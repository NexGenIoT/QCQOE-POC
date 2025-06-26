import json
from loguru import logger
from pydantic import BaseSettings
import requests
import socket
import sys


class Settings(BaseSettings):
    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # dynamodb
    DYNAMODB_OUTAGE_BANNER_TABLE: str ="qoe_outage_banner"

    CONFIG_MANAGER_SERVICE_URL: str = "http://3.6.164.157:8085/api/v1/config"

    AUTH_TOKEN_URL: str ="http://qcotp.qoe.com:8080/oauth/token"
    AUTH_USER : str = "admin@qoe.com"
    AUTH_PASSWORD: str = ""





settings = Settings()

def get_token():
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
        data = {"username": settings.AUTH_USER, "password":  settings.AUTH_PASSWORD}
        headers = {'Content-type': 'application/json'}
        response = requests.post(settings.AUTH_TOKEN_URL, data=json.dumps(data), headers=headers)
    except Exception as e:
        raise Exception(f"Not able to call get auth token api{str(e)}")
    else:
        if response:
            response = response.json()
            token = response.get("access_token", "")
        return token


def get_logger_level():
    level = "DEBUG"
    try:
        token = get_token()
        headers = {'Authorization': token}
        response = requests.get(settings.CONFIG_MANAGER_SERVICE_URL + "?service=qoe_outage_banner&version=v1", headers=headers)
        print("response is ", response.json())
    except Exception as e:
        raise Exception(f"Not able to set Logger level: {str(e)}")
    else:
        if response:
            response = response.json()
            level = response.get("LOGGER_LEVEL", "INFO")
        return level

def getDockerHostName():
    docker_short_id = socket.gethostname()
    if docker_short_id and docker_short_id is not None:
        return str(docker_short_id) + " | "
    else:
        return ""

running_id = getDockerHostName()
fmt = running_id + " {time} | {level: <8} | {name: ^15} | {function: ^15} | {line: >3} | {message}"
logger.remove()
level = "DEBUG" #get_logger_level()
logger.add(sys.stderr, format=fmt, level=level)
