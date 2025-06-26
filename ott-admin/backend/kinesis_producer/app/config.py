from fastapi import FastAPI
from pydantic import BaseSettings
from loguru import logger
import socket
import sys


class Settings(BaseSettings):
    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # AWS Kinesis stream config
    KINESIS_STREAM: str = 'realtime-input'

    # Logging config
    LOG_LEVEL: str = 'debug'


settings = Settings()

app = FastAPI()

def checkDockerContainerStatus():
    docker_short_id = socket.gethostname()
    if docker_short_id and docker_short_id is not None:
        return str(docker_short_id) + " | "
    else:
        return ""

running_id = checkDockerContainerStatus()
fmt = running_id + "{time} | {level: <8}| {name: ^15}| {function: ^15}| {line: >3} | {" \
                   "message} "
logger.remove()
logger.add(sys.stderr, format=fmt, level="DEBUG")