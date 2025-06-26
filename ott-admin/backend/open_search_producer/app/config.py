from pydantic import BaseSettings


class Settings(BaseSettings):
    # Opensearch config
    OS_HOST: str = 'vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com'
    OS_PORT: int = '443'
    OS_USER: str = 'admin'
    OS_PASSWORD: str  = ''
    OS_INDEX: str = ''

    # Logging config
    LOG_LEVEL: str = 'debug'


settings = Settings()
