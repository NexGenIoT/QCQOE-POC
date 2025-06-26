from fastapi import FastAPI, Response
from pydantic import BaseSettings
from opensearchpy import OpenSearch
from pydentic_config import *
import socket
import sys
from uuid import uuid4
from loguru import logger
from fastapi import Request
from typing import Optional
from contextvars import ContextVar

app = FastAPI()

class Settings(BaseSettings):
    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # s3
    AWS_S3_BUCKET_NAME: str ="qoe-aggregation"

    # Redis/MemoryDB config
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379

    ELASTIC_HOST: str = 'qoe-aggregation.lgu9tv.0001.aps1.cache.amazonaws.com'
    ELASTIC_PORT: str = 6379
    # Open Search Config

    OPEN_SEARCH_URL: str = 'https://vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com'
    OPEN_SEARCH_HOST: str  = 'vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com'
    OPEN_SEARCH_PORT: str = '443'
    OPEN_SEARCH_USER: str = 'admin'
    OPEN_SEARCH_PASSWORD: str  = ''

    OPEN_SEARCH_INDEX: str ='video_analytics'
    # OPEN_SEARCH_DRIVER: str 
    # OPEN_SEARCH_JAR: str 

    # SQLite
    SQLITE_ENGINE: str = "sqlite:///my_lite_store.db"
    SQLITE_DB_NAME: str = "my_lite_store.db"

    #INDEX NAME
    # DSM_ES_INDEX_NAME: str = "qoe_dev_state_6"
    DSM_ES_INDEX_NAME: str = "video_analytics"
    FLINK_ES_INDEX_NAME: str = "video_analytics"
    CONCURRENT_PLAYS_INDEX_NAME: str = 'qoe_concurrent_dev'

    JDBC_URL: str = "jdbc:opensearch://https://vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com"

    MITIGATION_LAMBDA_FUNCTION: str = "arn:aws:lambda:ap-south-1:466469185144:function:local_mitigation_send_to_dsm"

    DYNAMODB_OUTAGE_BANNER_TABLE: str = "qoe_outage_banner"

    CONTENT_PARTNER_LOGO_BUCKET_NAME: str = "content-partner-logo"
    CONTENT_PARTNER_DEFAULT_LOGO: str = "qoe_logo.png"
    DSM_SERVICE_TABLE_NAME: str = "qoe_dsm_store1"
    
    DSL_MAX_BUCKET_SIZE : int = 10000
    OS_CONNECTION_POOL_SIZE: int = 200
    OS_QUERY_TIMEOUT_SECONDS: int = 20

    REDIS_KEY_FOR_ERROR_CODE_ENUM: str = "qoe_error_codes_enum"
    OS_CONNECTION_POOL_SIZE: int = 200
    OS_QUERY_TIMEOUT_SECONDS: int = 20



settings = Settings()


# Set of Filters to send to frontend
REQUIRED_FILTERS = ["cdn", "location", "content_type", "device_platform", "device_model", "content_partner"]


def checkDockerContainerStatus():
    docker_short_id = socket.gethostname()
    if docker_short_id and docker_short_id is not None:
        return str(docker_short_id) + " | "
    else:
        return ""


correlation_id: ContextVar[Optional[str]] = ContextVar(
    'correlation_id', default=None)


@app.middleware("http")
async def add_request_id_header(request: Request, call_next):
    try:
        correlation_id.set(uuid4().hex)
        response = await call_next(request)
        response.headers["x-request-id"] = correlation_id.get()
    except Exception as e:
        logger.exception(f"Exception in middleware : {e}")
        return Response('Internal server error', status_code=500)
    return response

running_id = checkDockerContainerStatus()
fmt = running_id + "{time} | {extra[correlation_id]} | {level: <8}| {name: ^15}| {function: ^15}| {line: >3} | {" \
                   "message} "
logger.remove()

logger.add(sys.stderr, format=fmt, level="DEBUG")
logger = logger.patch(lambda record: record["extra"].update(correlation_id=correlation_id.get()))

def get_connection():
    connection = None
    try:
        connection = OpenSearch(
            hosts=[{'host': settings.OPEN_SEARCH_HOST, 'port': settings.OPEN_SEARCH_PORT}],
            http_compress=True,
            http_auth=(settings.OPEN_SEARCH_USER, settings.OPEN_SEARCH_PASSWORD),
            use_ssl=True,
            verify_certs=True,
            ssl_assert_hostname=False,
            ssl_show_warn=False,
        )
    except Exception as error:
        print("Error: Connection not established {}".format(error))
    else:
        pass
    return connection

SSO_ERROR = ['401']

global connection_in_use
connection_in_use = []
global connection_pool
connection_pool = []
@app.on_event("startup")
async def startup_event():
    global connection_pool
    connection_pool = [get_connection() for i in range(60)]
    global connection_in_use
    connection_in_use = []