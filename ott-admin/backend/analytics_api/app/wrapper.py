import aiohttp
import boto3
from boto3 import Session
from config import settings, logger
import geoip2.database
from kinesis.producer import KinesisProducer
from rediscluster import RedisCluster


class ApiWrapper(object):

    def get_kinesis_session(self):
        kinesis_session = Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                  aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                  region_name=settings.AWS_REGION_NAME)
        return kinesis_session

    def get_redis_kinesis_producer(self):
        redis_kinesis_producer = KinesisProducer(stream_name=settings.REDIS_KINESIS_STREAM, boto3_session=self.get_kinesis_session())
        return redis_kinesis_producer

    def get_firehose_client(self):
        firehose_client = boto3.client('firehose', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                       aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                       region_name=settings.AWS_REGION_NAME)
        return firehose_client

    def get_redis_client(self):
        redis_client = RedisCluster(startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                                    decode_responses=True,
                                    skip_full_coverage_check=True,
                                    ssl=True)
        return redis_client

    def get_dynamodb_resource(self):
        dynamodb_resource = boto3.resource('dynamodb', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                           aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                           region_name=settings.AWS_REGION_NAME)
        return dynamodb_resource

    def get_kinesis_producer_session(self):
        kinesis = aiohttp.ClientSession(settings.KINESIS_PRODUCER_URL)
        return kinesis

    def get_open_search_producer_session(self):
        open_search = aiohttp.ClientSession(settings.OPEN_SEARCH_PRODUCER_URL)
        return open_search

    def get_geo_reader(self):
        geo_reader = geoip2.database.Reader(settings.GEOIP_DB_PATH)
        return geo_reader