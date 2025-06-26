import json
from contextvars import ContextVar
from loguru import logger
from fastapi import FastAPI
from fastapi import Request
from typing import Optional
from pydantic import BaseSettings
from uuid import uuid4
import requests
import socket
import threading
import sys
import os


class AnalyticsBaseSettings(BaseSettings):
    AUTH_TOKEN_URL: str = "http://qcotp.qoe.com:8080/oauth/token"
    AUTH_USER: str = "admin@qoe.com"
    AUTH_PASSWORD: str = ""
    # CONFIG_MANAGER_SERVICE_URL: str = "http://3.108.121.176:5007/api/v1/config"
    CONFIG_MANAGER_SERVICE_URL: str = "http://3.6.164.157:8085/api/v1/config"
    SERVICE_NAME: str = "qoe_analytics_api"
    SERVICE_VERSION: str = "v1"


base_settings = AnalyticsBaseSettings()


def get_token():
    token = ""
    try:
        data = {"username": base_settings.AUTH_USER, "password": base_settings.AUTH_PASSWORD}
        headers = {'Content-type': 'application/json'}
        response = requests.post(base_settings.AUTH_TOKEN_URL, data=json.dumps(data), headers=headers)
    except Exception as e:
        raise Exception(f"Not able to call get auth token api{str(e)}")
    else:
        if response:
            response = response.json()
            token = response.get("access_token", "")
        return token


def set_env_variable(json_obj):
    for key, value in json_obj.items():
        os.environ[key] = str(value)


# def get_global_config():
#     try:
#         token = get_token()
#         headers = {'Authorization': token}
#         response = requests.get(
#             base_settings.CONFIG_MANAGER_SERVICE_URL + f"?service={base_settings.SERVICE_NAME}&version={base_settings.SERVICE_VERSION}",
#             headers=headers)
#         print("response is ", response.json())
#     except Exception as e:
#         raise Exception(f"Not able to get global config: {str(e)}")
#     else:
#         if response:
#             response = response.json()
#             # set_env_variable(response)
#         return response


# get_global_config()

app = FastAPI(openapi_url=None)


class Settings(BaseSettings):
    KINESIS_PRODUCER_URL: str = 'http://3.6.164.157:8082'
    OPEN_SEARCH_PRODUCER_URL: str = 'http://0.0.0.0:8003'
    LOG_LEVEL: str = 'debug'

    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # Open search
    OS_HOST: str ='vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com'
    OS_PORT: str ='443'
    OS_USER: str= 'admin'
    OS_PASSWORD: str=''

    # AWS Kinesis stream config
    REDIS_KINESIS_STREAM: str=''

    FULL_PAYLOAD_KINESIS_STREAM: str=''

    ENABLE_KINESIS: bool = True
    ENABLE_REDIS: bool = False
    ENABLE_OPEN_SEARCH: bool = False
    ENABLE_KINESIS_FULL_PAYLOAD: bool =True

    # MaxMind GeoIP DB path
    GEOIP_DB_PATH: str =''

    # Global Config URl
    MITIGATION_PROBE_SERVICE_NAME: str = 'mitigation_probe_config_data'
    MITIGATION_PROBE_SERVICE_VERSION: str = 'v1'
    MITIGATION_PROBE_CONFIG_API_CALLING_TIME: int = 30

    ENABLE_ERROR_COLLECTION: bool = True
    ENABLE_MINUTE_LEVEL_AGGREGATE: bool = True
    # dynamodb
    DYNAMODB_OUTAGE_BANNER_TABLE: str = "qoe_outage_banner"

    REDIS_HOST: str='3.6.164.157'
    REDIS_PORT: str='6379'

    REJECTED_PAYLOAD_KINESIS_STREAM: str = "faulty_payload_delivery_stream"

    CONCURRENT_PLAYS_INDEX_NAME: str = 'qoe_concurrent_dev'
    ENVIRONMENT: str = "DEV"

    KINESIS_DELIVERY_STREAM_FOR_ANOMALY = "custome_payload_delivery_by_udid"
    UNMATCHED_CONTENT_PARTNER_STREAM = "unmatched_content_partner_records"

    GLOBAL_CONFIG_URL: str = "http://3.6.164.157:8085/api/v1/config"
    # Authentication details
    AUTH_TOKEN_URL: str = "http://qcotp.qoe.com:8080/oauth/token"
    AUTH_USER: str = "admin@qoe.com"
    AUTH_PASSWORD: str = ""
    SERVICE_NAME: str = "qoe_analytics_api"
    SERVICE_VERSION: str = "v1"
    SERVICE_NAME_GLOBAL: str = "global_config"
    SERVICE_VERSION_GLOBAL: str = "v1"
    ENABLE_UNMATCHED_CONTENT_ENUM: bool = True
    REDIS_KEY_FOR_ERROR_CODE_ENUM: str = "qoe_error_codes_enum"


settings = Settings()


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
    correlation_id.set(uuid4().hex)
    response = await call_next(request)
    response.headers["x-request-id"] = correlation_id.get()
    return response


running_id = checkDockerContainerStatus()
fmt = running_id + "{time} | {extra[correlation_id]} | {level: <8}| {name: ^15}| {function: ^15}| {line: >3} | {" \
                   "message} "
logger.remove()
logger.add(sys.stderr, format=fmt, level="DEBUG")
logger = logger.patch(lambda record: record["extra"].update(correlation_id=correlation_id.get()))

class GlobalConfig:

    def get_token(self):
        """
        Input body {"username": "", "password": ""}
        :return: {
                "access_token": "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkB0YXRhcGxheS5jb20iLCJleHAiOjE2NTgwODg1OTksImlhdCI6MTY1Nzg3MjU5OX0.JXTwsGMjk4ylVYNHx3F2pr1Iol6spRBH_rnyBYNNsPKVS_Z-z6YHSas5gXQGNcgWW3s5s1hC-InRArxeJYVw6A",
                "expires_in": 216000,
                "token_type": "bearer",
                "first_name": "Admin",
                "last_name": "User"
            }
        """
        token = ""
        try:
            data = {"username": settings.AUTH_USER, "password": settings.AUTH_PASSWORD}
            headers = {'Content-type': 'application/json'}
            response = requests.post(settings.AUTH_TOKEN_URL, data=json.dumps(data), headers=headers)
        except Exception as e:
            raise Exception(f"Not able to call get auth token api{str(e)}")
        else:
            if response:
                response = response.json()
                token = response.get("access_token", "")
            return token

    # def get_central_config_data(self, service_name=settings.SERVICE_NAME, version=settings.SERVICE_VERSION):
    #     try:
    #         token = self.get_token()
    #         headers = {'Authorization': token}
    #         url = f"{settings.GLOBAL_CONFIG_URL}?service={service_name}&version={version}"
    #         data = requests.get(url, headers=headers)
    #         if data:
    #             data = data.json()
    #         # logger.info(f"Get Config setting is : {data}")
    #     except Exception as e:
    #         logger.exception(f"Exception : {str(e)} ")
    #         data = {}
    #     return data

mitigation_probe_config_data = {}
config_obj = GlobalConfig()
# default_config_data = config_obj.get_central_config_data(service_name=settings.SERVICE_NAME_GLOBAL, version=settings.SERVICE_VERSION_GLOBAL)
# logger.debug(f"default_config_data :{default_config_data}")


class ScheduleManager:
    def __init__(self):
        self.central_config_obj = GlobalConfig()

    # def start(self):
    #     threading.Timer(settings.MITIGATION_PROBE_CONFIG_API_CALLING_TIME, self.start).start()
    #     global mitigation_probe_config_data
    #     mitigation_probe_config_data = self.central_config_obj.get_central_config_data(service_name=settings.MITIGATION_PROBE_SERVICE_NAME, version=settings.MITIGATION_PROBE_SERVICE_VERSION)
    #     return True


obj = ScheduleManager()
# obj.start()

