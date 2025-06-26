import json
from config import settings, logger
from pydantic import BaseModel
from redis.client import Redis
from rediscluster import RedisCluster

from utils import lru_cache_with_ttl

class RedisConnection(object):
    def __init__(self):
        try:
            self.client = RedisCluster(
                startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                decode_responses=True,
                skip_full_coverage_check=True)
        except Exception as error:
            logger.exception(f"Exception in Redis connection : {str(error)}")
        else:
            logger.info("Connection established")

class ConfigManager:
    def __init__(self,ttl: int = 5, prefix: str = "CONFIG_MANAGER"):
        obj = RedisConnection()
        self.rc = obj.client
        self.ttl = ttl
        self.prefix = prefix
        self._cached_config = lru_cache_with_ttl(1, False, self.ttl)(self._read)

    def _write(self, key: str, value: dict):
        # Basic function to write to a redis key
        self.rc.set(self.prefix + ":" + key, json.dumps(value))

    def _read(self, key: str) -> dict:
        # Basic function to read from a redis key
        config = None
        data = self.rc.get(self.prefix + ":" + key)
        print("data:", data)
        if data is not None:
            config = json.loads(data)
        return config

    def get_config(self, service: str, version: str):
        return self._cached_config(service + ":" + version)

    def set_config(self, service: str, version: str, value: dict):
        self._write(service + ":" + version, value)
        self._cached_config.cache_clear()


class Setting(BaseModel):
    a: str


class AdvConfigManager(ConfigManager):
    def __init__(self, bm: BaseModel.__class__, service: str, version: str, rc: Redis, ttl: int = 5,
                 prefix: str = "CONFIG_MANAGER"):
        super().__init__(rc, ttl, prefix)
        self.service = service
        self.version = version
        self.bm = bm

    def _get_key(self):
        return self.service + ":" + self.version

    @property
    def config(self):
        data = self.get_config(self.service, self.version)
        return self.bm(**data)

    @config.setter
    def config(self, value: dict):
        data = self.bm(**value)
        self.set_config(self.service, self.version, data.dict())


if __name__ == '__main__':
    rc = Redis()
    acm = AdvConfigManager(Setting, 'random_service', '2.0', rc)
    acm.config = {'a': 'b'}
    print(acm.config)
    acm.config = {'a': 'c'}
    print(acm.config)
