from loguru import logger
from pydantic import BaseSettings
import socket
import sys


class Settings(BaseSettings):
    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # AWS Kinesis stream config
    REDIS_KINESIS_STREAM: str = ''
    # DynamoDB Table
    DDB_TABLE: str = 'qoe_dsm_store1'
    DDB_TABLE_FIXED: str = 'qoe_dsm_store2'
    # Redis/MemoryDB config
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379
    REDIS_CITIES_KEY:str = 'qoe_cities'
    # Logging config
    LOG_LEVEL: str = 'ERROR'




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
logger.add(sys.stderr, format=fmt, level="DEBUG")
