from pydantic import BaseSettings


class Settings(BaseSettings):
    # Redis/MemoryDB config
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379
    REDIS_KEY: str = ''
    REDIS_CLUSTER : bool = False


settings = Settings()
