from re import L
import re
from loguru import logger
import requests
from pydantic import BaseSettings
import socket
import sys

class Settings(BaseSettings):
    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # Redis/MemoryDB config
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379

    CONFIG_MANAGER_SERVICE_URL: str = "http://3.6.164.157:8085/api/v1/config"
    DYNAMODB_QOE_GLOBALCONFIG_LOG_TABLE: str = 'qoe_global_config_log'

    VALIDATE_AUTH_TOKEN_URL: str = 'https://qcotp.qoe.com/oauth/validate?verify=True'

    ENABLE_AUTO_MITIGATION = False



settings = Settings()

def checkDockerContainerStatus():
    docker_short_id = socket.gethostname()
    if docker_short_id and docker_short_id is not None:
        return str(docker_short_id) + " | "
    else:
        return ""

def get_logger_level():
    response = dict()
    level = "INFO"
    try:
        response = requests.get(settings.CONFIG_MANAGER_SERVICE_URL + "?service=qoe_analytics_api&version=v1")
    except Exception as e:
        raise Exception("Not able to set Logger level")
    else:
        if response:
            response = response.json()
            level = response.get("LOGGER_LEVEL", "INFO")
        return level

running_id = checkDockerContainerStatus()
fmt = running_id + " {time} | {level: <8} | {name: ^15} | {function: ^15} | {line: >3} | {message}"
logger.remove()
# level = get_logger_level()
level = "DEBUG"
logger.add(sys.stderr, format=fmt, level=level)