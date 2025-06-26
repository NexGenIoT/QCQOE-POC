import aiohttp
import boto3
from boto3 import Session
from kinesis.producer import KinesisProducer
import datetime
import json
import os.path
import re
import tarfile
import time
from typing import Callable
from urllib import request
import geoip2.database
from fastapi import HTTPException, Request, Response, BackgroundTasks
from fastapi.exceptions import RequestValidationError, ValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.routing import APIRoute
from uuid import uuid4
from config import app, settings, logger
from rediscluster import RedisCluster
import requests
from redis_producer import RedisConsumer
from schemas import AnalysisReqBody, KinesisPayload, DeviceStateSchemaOS, DeviceStateSchemaRedis, \
    PushBaseNotificationPayload
from wrapper import ApiWrapper
from decorators import validate_key
import hashlib

from fastapi import status
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

time.clock = time.time

city_pattern = re.compile(r'City=(.*) TimeZone=')

unknown_location = 'unknown'


def parse_city(location_str: str):
    """
    "City=Mumbai TimeZone=" -> Mumbai
    """
    found = city_pattern.findall(location_str)
    if found:
        return found[0]
    return unknown_location


def download_mmdb_file(url: str, dest_path: str):
    request.urlretrieve(url, dest_path)


def extract_mmdb_file(tarball_path: str, dest_dir: str):
    with tarfile.open(tarball_path) as fp:
        for filename in fp.getnames():
            if filename.endswith('.mmdb'):
                fp.extract(filename, dest_dir)
                return os.path.join(dest_dir, filename)


# geo_reader = geoip2.database.Reader(settings.GEOIP_DB_PATH)

kinesis_session = Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_REGION_NAME)

# redis_kinesis_producer = KinesisProducer(stream_name=settings.REDIS_KINESIS_STREAM, boto3_session=kinesis_session)

firehose_client = boto3.client('firehose', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                               aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                               region_name=settings.AWS_REGION_NAME)

# redis_client = RedisCluster(startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
#                             decode_responses=True,
#                             skip_full_coverage_check=True,
#                             ssl=True)

dynamodb_resource = boto3.resource('dynamodb', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                   aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                   region_name=settings.AWS_REGION_NAME)


# def get_user_location(geo_reader: geoip2.database.Reader, payload: AnalysisReqBody):
#     try:
#         if payload.ping:
#             clientIP = payload.ping.clientIP
#         elif payload.event:
#             clientIP = payload.event.clientIP
#         else:
#             return unknown_location
#         address = geo_reader.city(clientIP)
#         subdivision = f"subdivision={address.subdivisions[0].names.get('en','')}" if address.subdivisions else ''
#         dev_location = f"CountryCode={address.country.iso_code} CountryName={address.country.names.get('en','')} {subdivision} City={address.city.names.get('en','')} TimeZone={address.location.time_zone} Latitude={address.location.latitude} Longitude={address.location.longitude}"
#         logger.debug(
#             f"get_user_location IP: {clientIP}, address: {address}, subdivision: {subdivision}, dev_location :{dev_location}")
#         return dev_location
#     except Exception as e:
#         logger.exception(f"Exception in get_user_location : {e}")
#         return unknown_location


class ValidationErrorLoggingRoute(APIRoute):
    def get_route_handler(self) -> Callable:
        original_route_handler = super().get_route_handler()

        async def custom_route_handler(request: Request) -> Response:
            # TODO: This configuration must be in debug mode configurable when it would go to production.
            logger.info(f"Logged the body request :{str(await request.body())}")
            try:
                return await original_route_handler(request)
            except RequestValidationError as exc:
                body = await request.body()
                detail = {"errors": exc.errors(), "body": body.decode()}
                logger.debug(detail)
                await logger.complete()
                raise HTTPException(status_code=422, detail='Invalid payload')

        return custom_route_handler


async def send_to_kinesis(payload: str, location: str, event_time:str, record_id: str):
    print('HERE',payload)
    print(payload)
    try:
        if 'event' in payload:
            ks_payload = KinesisPayload.from_event_load(payload['event'])
        elif 'ping' in payload:
            ks_payload = KinesisPayload.from_ping_load(payload['ping'])
        record = ks_payload.dict()
        record['event_time'] = event_time
        record['record_id'] = record_id
        record['location'] = location
        record['location_city'] = parse_city(location)
        record['networkType'] = ks_payload.networkType
        record['live'] = ks_payload.live
        record['drm'] = ks_payload.drm
        record['has'] = ks_payload.has
        record['manufacturer'] = ks_payload.manufacturer
        record['deviceType'] = ks_payload.deviceType
        record['content_type'] = ks_payload.contentType
        logger.debug(f"send_to_kinesis record: {record}")
        response = requests.post(str(settings.KINESIS_PRODUCER_URL) + "/", json=record)
        logger.debug(f"send_to_kinesis response : {response}")
    except Exception as e:
        logger.exception(f"Exception in send_to_kinesis :{e}")

async def send_to_redis(payload: AnalysisReqBody, location: str):
    try:
        if payload.event:
            obj = DeviceStateSchemaRedis.from_event(payload.event)
            obj.event.location = location
            obj.event.dict()["content_type"] = obj.event.contentType
        else:
            obj = DeviceStateSchemaRedis.from_ping(payload.ping)
            obj.ping.location = location
            obj.ping.dict()["content_type"] = obj.ping.contentType
        logger.debug(f"send_to_redis record: {obj.json()}")
        # redis_kinesis_producer.put(obj.json())
    except Exception as e:
        logger.exception(f"Exception in send_to_redis :{e}")

# async def send_to_open_search(payload: AnalysisReqBody, location: str):
#     try:
#         if payload.event:
#             record = DeviceStateSchemaOS.from_event(payload.event)
#         else:
#             record = DeviceStateSchemaOS.from_ping(payload.ping)
#         record.location = location
#         res_record = record.dict()
#         res_record["content_type"] = record.contentType
#         logger.debug(f"send_to_open_search record: {res_record}")
#         # response = requests.post(str(settings.OPEN_SEARCH_PRODUCER_URL) + "/", json=res_record)
#         logger.debug(f"send_to_open_search response: {response}")
#     except Exception as e:
#         logger.exception(f"Exception in send_to_open_search :{e}")


def prepare_qoe_data(payload: AnalysisReqBody, city: str,record_id: str):
    try:
        record = payload.dict()
        rec_type = "ping" if record.get('ping') else "event"
        record = record['ping'] if record['ping'] else record['event']
        record['rec_type'] = rec_type
        if "timestamp" in record.keys():
            rec_time = record.get("timestamp", 0)
            record["record_time"] = rec_time
            del record["timestamp"]
        record['record_id'] = record_id
        record['clientIP'] = str(record['clientIP'])
        record['location_city'] = city
        event_data = record.get("eventData", None)
        if payload.event and payload.event.eventData and  payload.event.event == "ERROR":
            record['errorname'] = payload.event.eventData.desc.dict().get('ErrorName','')
            record['errorcode'] = payload.event.eventData.desc.dict().get('ErrorCode','')
            record['errordetails'] = payload.event.eventData.desc.dict().get('ErrorDetails','')
        if event_data:
            record['vrt'] = event_data.get('vrt', 0)
            record['latency'] = event_data.get('latency', 0)
        # if type(record.get("latency", 0)) is not None and type(record.get("latency", 0)) is int and record.get("latency", 0) > 0:
        #     try:
        #         # redis_client.hset(f"latency_{record['udid']}", mapping={"latency": record.get("latency", 0), "last_report_time": record.get("record_time", time.time())})
        #     except Exception as e:
        #         logger.exception(f"Device id error: {e}")
        #         raise Exception(f"Device id error: {e}")
        # else:
        #     # record['latency'] = redis_client.hgetall(f"latency_{record['udid']}").get("latency", 0)
        return record
    except Exception as e:
        logger.exception(f"prepare_qoe_data : {e}")


async def send_to_full_payload_kinesis_stream(payload: AnalysisReqBody, city: str,record_id: str):
    try:
        record = prepare_qoe_data(payload, city, record_id)
        logger.debug(f" send_to_full_payload_kinesis_stream : {json.dumps(record)}")
        logger.debug(firehose_client.put_record(DeliveryStreamName=settings.FULL_PAYLOAD_KINESIS_STREAM,
                                    Record={'Data': json.dumps(record)}))
        firehose_client.put_record(DeliveryStreamName=settings.KINESIS_DELIVERY_STREAM_FOR_ANOMALY,
                                    Record={'Data': json.dumps(record)})
    except Exception as e:
        logger.exception(f"send_to_full_payload_kinesis_stream : {e}")


app.router.route_class = ValidationErrorLoggingRoute
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.info("new response is")
    logger.info(JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content=jsonable_encoder({"detail": exc.errors(), "body": exc.body}),
    ))


@app.exception_handler(ValidationError)
async def _(request: Request,
            exc: ValidationError):
    try:
        logger.info("Logging Response: for bad request")
        print(await request.json())
    except json.decoder.JSONDecodeError:
        # Request had invalid or no body
        pass
    raise exc


state_pattern = re.compile(r'subdivision=(.*) City=')


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


def set_state_cities_in_redis(location):
    """

    :param location:
    :return:
    """
    try:
        city = parse_city(location)
        state = parse_state(location)
        # data = redis_client.hgetall("qoe_state_cities")
        cities = data.get(state, [])
        if type(cities) is str:
            cities = json.loads(cities)
        if city not in cities:
            cities.append(city)
        data[state] = json.dumps(cities)
        # redis_client.hmset("qoe_state_cities", data)
    except Exception as e:
        logger.exception(f" Exception : {str(e)}")


def get_outage_banner_data(payload, user_city):
    eventData = payload.eventData.desc
    eventData = eventData.dict()
    eventData["id"] = str(uuid4())
    eventData["udid"] = payload.udid
    eventData["ueid"] = payload.ueid
    eventData["platform"] = payload.deviceType if payload.platform == 'Android' and payload.deviceType in ['Firestick','AndroidSmartTv'] else payload.platform
    eventData["provider"] = payload.provider
    eventData["dts_es"] = payload.timestamp
    eventData["location"] = user_city
    eventData["videoId"] = payload.videoId
    eventData["videoTitle"] = payload.videoTitle
    return eventData


def set_error_code_in_redis(record):
    ErrorCode =  str(record.get("ErrorCode", ""))
    # all_error_code = redis_client.hgetall(settings.REDIS_KEY_FOR_ERROR_CODE_ENUM)
    logger.debug(f"all_error_code : {all_error_code}")
    if ErrorCode and ErrorCode not in all_error_code:
        all_error_code[ErrorCode]= record.get("ErrorName", "")
        logger.debug(f"insert error code into enum: {all_error_code}")
        # redis_client.hset(settings.REDIS_KEY_FOR_ERROR_CODE_ENUM, mapping=all_error_code)


async def send_to_outage_banner(payload: AnalysisReqBody, user_city: str):
    try:
        if payload.event and payload.event.event == "ERROR":
            record = get_outage_banner_data(payload.event, user_city)
            table = dynamodb_resource.Table(settings.DYNAMODB_OUTAGE_BANNER_TABLE)
            table.put_item(Item=record)
            logger.debug("send_to_outage_banner data send successfully.")
            set_error_code_in_redis(record)
    except Exception as e:
        logger.exception(f"Exception in send_to_outage_banner : {e}")


def get_platform_and_device_type(payload):
    if type(payload) is not dict:
        payload = payload.dict()
    if "ping" in payload.keys():
        payload = payload.get("ping")
    elif "event" in payload.keys():
        payload = payload.get("event")
    platform = payload.get("platform", "")
    device_type = payload.get("deviceType", "")
    return platform, device_type


def getMitigationFonfig(platform, device_type):
    from config import mitigation_probe_config_data
    data = mitigation_probe_config_data
    response = dict()
    if data:
        if platform == "Android" and device_type == "Mobile":
            response["disable_qoe_beacons"] = False if data.get("android_probe", "OFF") == "ON" else True
            response["disable_mitigation_poll"] = False if data.get("android_mitigation", "OFF") == "ON" else True
        elif platform == "iOS":
            response["disable_qoe_beacons"] = False if data.get("ios_probe", "OFF") == "ON" else True
            response["disable_mitigation_poll"] = False if data.get("ios_mitigation", "OFF") == "ON" else True
        elif platform == "Web":
            response["disable_qoe_beacons"] = False if data.get("web_probe", "OFF") == "ON" else True
            response["disable_mitigation_poll"] = False if data.get("web_mitigation", "OFF") == "ON" else True
        elif platform == "Android" and device_type == "FireTV":
            response["disable_qoe_beacons"] = False if data.get("firetv_probe", "OFF") == "ON" else True
            response["disable_mitigation_poll"] = False if data.get("firetv_mitigation", "OFF") == "ON" else True
        elif platform == "Android" and device_type == "Firestick":
            response["disable_qoe_beacons"] = False if data.get("firetv_probe", "OFF") == "ON" else True
            response["disable_mitigation_poll"] = False if data.get("firetv_mitigation", "OFF") == "ON" else True
        elif platform == "Android" and device_type == "AndroidSmartTv":
            response["disable_qoe_beacons"] = False if data.get("androidsmarttv_probe", "OFF") == "ON" else True
            response["disable_mitigation_poll"] = False if data.get("androidsmarttv_mitigation", "OFF") == "ON" else True
        else:
            response["disable_qoe_beacons"] = False
            response["disable_mitigation_poll"] = False
    else:
        response["disable_qoe_beacons"] = False
        response["disable_mitigation_poll"] = False
    return response


async def send_to_firehose_stream(payload: PushBaseNotificationPayload):
    try:
        if dict:
            if type(payload) is dict:
                pass
            else:
                payload = payload.dict()
            # firehose_client.put_record(DeliveryStreamName=settings.FULL_PAYLOAD_KINESIS_STREAM,
                                    # Record={'Data': json.dumps(payload)})
    except Exception as e:
        logger.exception(f"Exception in send_to_firehose_stream {e}")


async def send_minute_level_data_to_redis(payload: AnalysisReqBody, location: str):
    """
    This method store event payload in side redis its store only for 61 second
    Redis key will be start from concurrent_play_ and current session id
    :param payload:
    :return:
    """
    try:
        if payload.event:
            record = DeviceStateSchemaOS.from_event(payload.event)
        else:
            record = DeviceStateSchemaOS.from_ping(payload.ping)
        record.location = location
        session_id = record.current_session_id  # record.get("current_session_id", "")
        key = "concurrent_play_" + str(session_id)
        receive_record = record.dict()
        if "last_event_state" in receive_record.keys() and ((receive_record.get("last_event_state") == "ERROR") or (receive_record.get("prev_event_state") == "ERROR" and receive_record.get("last_event_state") == "STOPPED")) and payload.event.durationOfPlayback == 0:
            # redis_client.delete(key)
            logger.debug(f"send_minute_level_data_to_redis : Success delete")
        else:
            receive_record["content_type"] = record.contentType
            receive_record["timestamp"] = time.time()
            logger.debug(f"send_minute_level_data_to_redis : {receive_record}")
            # redis_client.set(key, json.dumps(receive_record), ex=61)
            logger.debug(f"send_minute_level_data_to_redis : Success")
    except Exception as e:
        logger.exception(f" Exception send_minute_level_data_to_redis : {e}")


async def send_to_faulty_payload_kinesis_stream(payload, exception):
    try:
        data = dict()
        if type(payload) is not dict:
            payload = payload.dict()
        data["payload"] = payload
        data["error_description"] = str(exception)
        data["server_validation_timestamp"] = time.time()
        logger.debug(
            firehose_client.put_record(DeliveryStreamName=settings.REJECTED_PAYLOAD_KINESIS_STREAM,
                                    Record={'Data': json.dumps(data)}))
    except Exception as e:
        logger.exception(f" Exception send_to_faulty_payload_kinesis_stream : {e}")

def convert_str_to_md5(sid, sdk_version):
    if sdk_version < '2.0.0':
        sid = '' if not sid else str(sid)
        sid = hashlib.md5(sid.encode()).hexdigest()
        logger.info(f"SID encryption: {sid}")
    return sid

# def update_payload(payload):
    # provider_enum = redis_client.hgetall("enums_config_content_partner_11111")
    # IS_PROVIDER_EXIST = True
    # try:
    #     if payload.get("ping", None):
    #         payload["ping"]["provider"] = provider_enum[payload["ping"]["provider"]]
    #         sid = payload["ping"].get('subscriberId','')
    #         sdk_version = payload["ping"].get('sdkVersion','')
    #         payload["ping"]['subscriberId'] = convert_str_to_md5(sid, sdk_version)
    #     elif payload.get("event", None):
    #         payload["event"]["provider"] = provider_enum[payload["event"]["provider"]]
    #         sid = payload["event"].get('subscriberId','')
    #         sdk_version = payload["event"].get('sdkVersion','')
    #         payload["event"]['subscriberId'] = convert_str_to_md5(sid, sdk_version)
    #     return payload, IS_PROVIDER_EXIST
    # except Exception as e:
    #     IS_PROVIDER_EXIST = False
        # return payload, IS_PROVIDER_EXIST
    # if payload.get("ping", None):
    #     payload["ping"]["provider"] = provider_enum.get(payload["ping"].get("provider", ""),
    #                                                     payload["ping"].get("provider", ""))
    # elif payload.get("event", None):
    #     payload["event"]["provider"] = provider_enum.get(payload["event"].get("provider", ""),
    #                                                      payload["event"].get("provider", ""))


async def send_to_unmatched_content_partner_stream(payload: AnalysisReqBody, city: str,record_id: str):
    try:
        record = prepare_qoe_data(payload, city, record_id)
        logger.debug(f" send_to_unmatched_content_partner_stream : {json.dumps(record)}")
        firehose_client.put_record(DeliveryStreamName=settings.UNMATCHED_CONTENT_PARTNER_STREAM,
                                    Record={'Data': json.dumps(record)})
    except Exception as e:
        logger.exception(f"send_to_unmatched_content_partner_stream : {e}")


@app.post("/api/analysis")
@validate_key
async def root(request: Request, bt: BackgroundTasks):
    data = dict()
    received_payload = await request.json()
    print(received_payload,'DDDDD')
    # received_payload, IS_PROVIDER_EXIST = update_payload(received_payload)
    IS_PROVIDER_EXIST=True
    platform, device_type = get_platform_and_device_type(received_payload)
    data = getMitigationFonfig(platform, device_type)
    data["msg"] = "ok"
    try:
        if "ping" in received_payload.keys():
            disable_qoe_beacons = data.get("disable_qoe_beacons", "")
            if disable_qoe_beacons:
                send_to_firehose_stream(received_payload)
                return data
        payload = received_payload
    except Exception as e:

        logger.debug(f"send_to_faulty_payload_kinesis_stream Exception: {str(e)}")
        bt.add_task(send_to_faulty_payload_kinesis_stream, received_payload, e)
        logger.exception(f"send_to_faulty_payload received_payload:{received_payload}, Exception:{e}")
    else:
        # logger.debug(f"Received payload: {received_payload}")
        # logger.debug(f"Process payload: {payload.json()}")
        # print('DAME',payload['ping'])
        # payload=json.dumps(payload)
        # print(payload,'PPP')
        if payload and ('ping' in payload and payload['ping']) or ('event' in payload and payload['event']):
            try:
                event_time = datetime.datetime.fromtimestamp(int(time.time())).isoformat(sep=" ")
                if 'event' in payload:
                    record_id = f"{payload['event']['sessionId']}__{payload['event']['timestamp']}__{event_time}"
                elif 'ping' in payload:
                    record_id = f"{payload['ping']['sessionId']}__{payload['ping']['timestamp']}__{event_time}"
                # user_location = get_user_location(geo_reader, payload)
                # logger.debug("parse_city ")
                # user_city = parse_city(user_location)
                logger.debug("set_state_cities_in_redis ")
                # set_state_cities_in_redis(user_location)
                logger.debug("ENABLE_UNMATCHED_CONTENT_ENUM ")
                if settings.ENABLE_UNMATCHED_CONTENT_ENUM and not IS_PROVIDER_EXIST:
                    bt.add_task(send_to_unmatched_content_partner_stream, payload)
                    return data
                # logger.debug("ENABLE_KINESIS ")
                if settings.ENABLE_KINESIS:
                    bt.add_task(send_to_kinesis, payload,'New Delhi',event_time,record_id)
                # logger.debug("ENABLE_REDIS ")
                if settings.ENABLE_REDIS:
                    bt.add_task(send_to_redis, payload)
                # logger.debug("ENABLE_OPEN_SEARCH ")
                # if settings.ENABLE_OPEN_SEARCH:
                    # bt.add_task(send_to_open_search, payload, user_location)
                # logger.debug("ENABLE_MINUTE_LEVEL_AGGREGATE ")
                if settings.ENABLE_MINUTE_LEVEL_AGGREGATE:
                    """
                    send data to redis for minute level aggregation.
                    set every record in redis cluster using key as session id with TTL of 61 seconds. 
                    """
                    bt.add_task(send_minute_level_data_to_redis, payload)
                logger.debug("ENABLE_KINESIS_FULL_PAYLOAD ")
                if settings.ENABLE_KINESIS_FULL_PAYLOAD:
                    bt.add_task(send_to_full_payload_kinesis_stream, payload)
                # logger.debug("ENABLE_ERROR_COLLECTION ")
                if settings.ENABLE_ERROR_COLLECTION:
                    bt.add_task(send_to_outage_banner, payload)
            except Exception as e:
                logger.exception(f"Exception in analytcis api: {str(e)}")
    return data


@app.get("/api/v1/get_conccurent_plays")
def get_conccurent_plays():
    consumer = RedisConsumer()
    consumer.scan_and_set()
    return {"StatusCode": 200, "message": "Success"}



@app.get("/status")
async def app_status():
    return {"msg": "ok"}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host="0.0.0.0", port=8002, log_level="debug", reload=True, workers=4)
    # uvicorn.run('main:app', host="0.0.0.0", port=80, log_level="debug", reload=False)
    # import gunicorn
    # import uvicorn.workers.UvicornWorker
    # gunicorn.run('main:app', workers=4, worker_class=uvicorn.workers.UvicornWorker, bind=0.0.0.0:80)
    # gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:80
