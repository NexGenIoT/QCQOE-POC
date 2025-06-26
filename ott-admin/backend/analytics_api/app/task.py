import datetime
import json
import re
import aiohttp
import boto3
from boto3 import Session
from config import settings, logger
from fastapi import Request
from geoip2.errors import AddressNotFoundError
import geoip2.database
from kinesis.producer import KinesisProducer
from rediscluster import RedisCluster
from uuid import uuid4
from schemas import AnalysisReqBody, KinesisPayload, DeviceStateSchemaOS, DeviceStateSchemaRedis, PushBaseNotificationPayload, EventPayload
from redis_producer import *


# geo_reader = geoip2.database.Reader(settings.GEOIP_DB_PATH)

kinesis = aiohttp.ClientSession(settings.KINESIS_PRODUCER_URL)
# open_search = aiohttp.ClientSession(settings.OPEN_SEARCH_PRODUCER_URL)

kinesis_session = Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_REGION_NAME)
# redis_kinesis_producer = KinesisProducer(stream_name=settings.REDIS_KINESIS_STREAM, boto3_session=kinesis_session)

firehose_client = boto3.client('firehose', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                               aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                               region_name=settings.AWS_REGION_NAME)

dynamodb_resource = boto3.resource('dynamodb', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                   aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                   region_name=settings.AWS_REGION_NAME)

redis_client = RedisCluster(startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                            decode_responses=True,
                            skip_full_coverage_check=True,
                            ssl=True)


city_pattern = re.compile(r'City=(.*) TimeZone=')

state_pattern = re.compile(r'subdivision=(.*) City=')

unknown_location = 'unknown'

def parse_city(location_str: str):
    """
    "City=Mumbai TimeZone=" -> Mumbai
    """
    found = city_pattern.findall(location_str)
    if found:
        return found[0]
    return unknown_location

def parse_state(location_str: str) -> str:
    """
    CountryCode=IN CountryName=India subdivision=Maharashtra City=Mumbai TimeZone=Asia/Kolkata Latitude=19.0748 Longitude=72.8856
    :param location_str:
    :return:
    """
    found = state_pattern.findall(location_str)
    if found:
        return found[0]
    return unknown_location



async def send_to_kinesis(payload: AnalysisReqBody, location: str):
    ks_payload = KinesisPayload.from_event_load(
        payload.event) if payload.event else KinesisPayload.from_ping_load(
        payload.ping)
    record = ks_payload.dict()
    record['event_time'] = datetime.datetime.fromtimestamp(ks_payload.event_time).isoformat(sep=" ")
    record['record_id'] = f"{ks_payload.sessionid}__{ks_payload.timestamp}__{ks_payload.event_time}"
    record['location'] = location
    record['location_city'] = parse_city(location)
    record['networkType'] = ks_payload.networkType
    record['live'] = ks_payload.live
    record['drm'] = ks_payload.drm
    record['has'] = ks_payload.has
    record['manufacturer'] = ks_payload.manufacturer

    await kinesis.post('/', json=record)


async def send_to_redis(payload: AnalysisReqBody, location: str):
    if payload.event:
        obj = DeviceStateSchemaRedis.from_event(payload.event)
        obj.event.location = location
    else:
        obj = DeviceStateSchemaRedis.from_ping(payload.ping)
        obj.ping.location = location
    # redis_kinesis_producer.put(obj.json())


async def send_to_open_search(payload: AnalysisReqBody, location: str):
    if payload.event:
        record = DeviceStateSchemaOS.from_event(payload.event)
    else:
        record = DeviceStateSchemaOS.from_ping(payload.ping)
    record.location = location
    await open_search.post('/', json=record.dict())


async def send_to_full_payload_kinesis_stream(payload: AnalysisReqBody, city: str):
    record = payload.dict()
    record['location_city'] = city
    logger.debug(
        # firehose_client.put_record(DeliveryStreamName=settings.FULL_PAYLOAD_KINESIS_STREAM,
                                #    Record={'Data': json.dumps(record)}))


def get_outage_banner_data(payload):
    eventData = payload.eventData.desc
    eventData = eventData.dict()
    eventData["id"] = str(uuid4())
    eventData["udid"] = payload.udid
    eventData["ueid"] = payload.ueid
    eventData["platform"] = payload.platform
    eventData["provider"] = payload.provider
    eventData["dts_es"] = payload.timestamp
    return eventData


async def send_to_outage_banner(payload: AnalysisReqBody):
    if payload.event and payload.event.event == "ERROR":
        record = get_outage_banner_data(payload.event)
        table = dynamodb_resource.Table(settings.DYNAMODB_OUTAGE_BANNER_TABLE)
        table.put_item(Item=record)
        # opensearch_client = OpenSearch(
        #     hosts=[{'host': settings.OS_HOST, 'port': settings.OS_PORT}],
        #     http_compress=True,  # enables gzip compression for request bodies
        #     http_auth=(settings.OS_USER, settings.OS_PASSWORD),
        #     use_ssl=True,
        #     verify_certs=True,
        #     ssl_assert_hostname=False,
        #     ssl_show_warn=False
        # )
        # response = opensearch_client.index(
        #     index="qoe_outage_banner",
        #     body=record,
        #     refresh=True
        # )


def send_to_firehose_stream(payload:PushBaseNotificationPayload):
    if dict:
        if type(payload) is dict:
            pass
        else:
            payload = payload.dict()
        firehose_client.put_record(DeliveryStreamName=settings.FULL_PAYLOAD_KINESIS_STREAM,
                                Record={'Data': json.dumps(payload)})


def send_minute_level_data_to_redis(payload:AnalysisReqBody, location:str):
    """
    This method store event payload in side redis its store only for 61 second
    Redis key will be start from concurrent_play_ and current session id
    :param payload:
    :return:
    """
    if payload.event:
        record = DeviceStateSchemaOS.from_event(payload.event)
    else:
        record = DeviceStateSchemaOS.from_ping(payload.ping)
    record.location = location
    session_id = record.current_session_id #record.get("current_session_id", "")
    key = "concurrent_play_" + str(session_id)
    redis_client.set(key, json.dumps(record.dict()), ex=61)


def get_user_location(geo_reader: geoip2.database.Reader, req: Request):
    try:
        address = geo_reader.city(req.client.host)
        if address.subdivisions:
            subdivision = f"subdivision={address.subdivisions[0].names['en']}"
        else:
            subdivision = ''
        dev_location = f"CountryCode={address.country.iso_code} CountryName={address.country.names['en']} {subdivision} City={address.city.names['en']} TimeZone={address.location.time_zone} Latitude={address.location.latitude} Longitude={address.location.longitude}"
        logger.debug(dev_location)
        return dev_location
    except AddressNotFoundError:
        pass
    return unknown_location


def set_state_cities_in_redis(location):
    """

    :param location:
    :return:
    """
    try:
        city = parse_city(location)
        state = parse_state(location)
        data = redis_client.hgetall("qoe_state_cities")
        cities = data.get(state, [])
        if type(cities) is str:
             cities = json.loads(cities)
        if city not in cities:
            cities.append(city)
        data[state] = json.dumps(cities)
        redis_client.hmset("qoe_state_cities", data)
    except Exception as e:
        logger.exception(f" Exception : {str(e)}")