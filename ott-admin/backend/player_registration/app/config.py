import json
from loguru import logger
from pydantic import BaseSettings, HttpUrl
import requests
import socket
import sys
from enum import Enum

class Settings(BaseSettings):
    SCHEMA_VERSION: str = "0.0.1"
    BEACON_URL: str = 'https://example.com'
    LOG_LEVEL: str = 'debug'

    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # AWS Kinesis stream config
    REDIS_KINESIS_STREAM: str = ''

    # Redis/MemoryDB config
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379

    REJECTED_PAYLOAD_KINESIS_STREAM: str = "faulty_payload_delivery_stream"

    KA_INTERVAL:int = 60
    KC_INTERVAL:int = 120

    GLOBAL_CONFIG_URL: str = "http://3.6.164.157:8085/api/v1/config"
    # Authentication details
    AUTH_TOKEN_URL: str = "http://qcotp.qoe.com:8080/oauth/token"
    AUTH_USER: str = "admin@qoe.com"
    AUTH_PASSWORD: str = ""
    SERVICE_NAME: str = "qoe_player_registration"
    SERVICE_VERSION: str = "v1"
    SERVICE_NAME_GLOBAL: str = "global_config"
    SERVICE_VERSION_GLOBAL: str = "v1"


settings = Settings()

def checkDockerContainerStatus():
    docker_short_id = socket.gethostname()
    if docker_short_id and docker_short_id is not None:
        return str(docker_short_id) + " | "
    else:
        return ""

running_id = checkDockerContainerStatus()
fmt = running_id + " {time} | {level: <8} | {name: ^15} | {function: ^15} | {line: >3} | {message}"
logger.remove()
logger.add(sys.stderr, format=fmt)


class MetricesName(Enum):
    PLATFORM_ENUM = ['Web','Android','iOS']
    DEVICE_TYPE_ENUM = ['Web','Mobile','Firestick','AndroidSmartTv'] 


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

    def get_central_config_data(self, service_name=settings.SERVICE_NAME, version=settings.SERVICE_VERSION):
        try:
            token = self.get_token()
            headers = {'Authorization': token}
            url = f"{settings.GLOBAL_CONFIG_URL}?service={service_name}&version={version}"
            data = requests.get(url, headers=headers)
            if data:
                data = data.json()
            #logger.info(f"Get Config setting is : {data}")
        except Exception as e:
            logger.exception(f"Exception : {str(e)} ")
            data = {}
        return data



obj = GlobalConfig()
default_platform_data = obj.get_central_config_data(service_name=settings.SERVICE_NAME, version=settings.SERVICE_VERSION)
default_config_data = obj.get_central_config_data(service_name=settings.SERVICE_NAME_GLOBAL, version=settings.SERVICE_VERSION_GLOBAL)
#logger.debug(f"default_config_data :{default_config_data}")
#logger.debug(f"default_platform_data :{default_platform_data}")
