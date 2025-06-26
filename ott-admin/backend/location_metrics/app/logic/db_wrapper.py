import json
from rediscluster import RedisCluster
from logic.config import logger,settings
from datetime import datetime

class ElasticRedisCacheConnection(object):
    def __init__(self):
        try:
            self.client = RedisCluster(
                startup_nodes=[{"host": settings.ELASTIC_HOST, "port": settings.ELASTIC_PORT}],
                decode_responses=True,
                skip_full_coverage_check=True
                )
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            pass

class ElasticCacheUtility(object):
    def __init__(self):
        self.redis = ElasticRedisCacheConnection()
        self.client = self.redis.client

    def cache_response(self, api_name,cache_query,response,cache_expiry=3600):
        self.client.set(cache_query,json.dumps(response),ex=cache_expiry)

    def cache_key_generator(self, api_name,query_duration,body):
        for key,value in query_duration.items():
            query_duration[key] = datetime.fromtimestamp(int(value)).strftime("%y%m%d%H%M")
        query=f"{api_name}_{json.dumps({**body,**query_duration})}"
        return query

    def search_cache(self, cache_query):
        cached_response=self.client.get(cache_query)
        if cached_response is not None:
            return cached_response
        else:
            return None

class RedisConnection():
    def __init__(self):
        try:
            self.client = RedisCluster(
                startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                decode_responses=True,
                skip_full_coverage_check=True,
                ssl=True)
        except Exception as error:
            logger.exception("Error: Connection not established {}".format(error))
        else:
            logger.info("Connection established")