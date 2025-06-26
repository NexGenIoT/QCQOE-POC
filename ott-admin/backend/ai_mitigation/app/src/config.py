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
    REDIS_KINESIS_STREAM: str = 'qoe-dsm-store'
    # Redis/MemoryDB config
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379
    # Logging config
    LOG_LEVEL: str = 'ERROR'
    # Criteria
    MANUAL_MITIGATION_TIME_THD: int = 3600
    AI_MITIGATION_TIME_THD: int = 3600
    AI_REDIS_COLLECTION_PREFIX: str = 'qoe_ai_mitigation_'
    DSM_REDIS_COLLECTION_PREFIX: str = 'qoe_dsm_ds_'

    THROUGHPUT_WINDOW_LEN: int = 10

    AI_STATE_MACHINE_ARN: str =  "arn:aws:states:ap-south-1:466469185144:stateMachine:AIMitigation"

    BITRATE_MBPS_THD: float = 2.0




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
logger.add(sys.stderr, format=fmt, level="INFO")