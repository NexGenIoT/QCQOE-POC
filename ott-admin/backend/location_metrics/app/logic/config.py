from fastapi import FastAPI
from loguru import logger
import sys
from pydantic import BaseSettings
from opensearchpy import OpenSearch


app = FastAPI()


class Settings(BaseSettings):
    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # Open Search Config
    OPEN_SEARCH_HOST: str  = 'vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com'
    OPEN_SEARCH_PORT: str = '443'
    OPEN_SEARCH_USER: str = 'admin'
    OPEN_SEARCH_PASSWORD: str  = ''

    # INDEX NAME
    PLAYCOUNT_INDEX: str = ''
    C_PLAYCOUNT_INDEX: str = ''
    # JDBC_URL: str

    DYNAMODB_OUTAGE_BANNER_TABLE: str = ''
    ELASTIC_HOST: str = 'qoe-aggregation.lgu9tv.0001.aps1.cache.amazonaws.com'
    ELASTIC_PORT: str = 6379
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379


settings = Settings()

conn = False

class GetConnection:
    def __init__(self):
        try:
            
            self.conn = OpenSearch(
                hosts=[{'host': settings.OPEN_SEARCH_HOST, 'port': settings.OPEN_SEARCH_PORT}],
                http_compress=True,  
                http_auth=(settings.OPEN_SEARCH_USER, settings.OPEN_SEARCH_PASSWORD),
                use_ssl=True,
                verify_certs=True,
                ssl_assert_hostname=False,
                ssl_show_warn=False,

            )
        except Exception as error:
            print(error)
        else:
            pass

fmt = " {time} | {level: <8} | {name: ^15} | {function: ^15} | {line: >3} | {message}"
logger.remove()
logger.add(sys.stderr, format=fmt)