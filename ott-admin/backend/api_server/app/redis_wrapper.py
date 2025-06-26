from db_wrapper import ElasticRedisCacheConnection
import json
from datetime import datetime
from config import logger


class ElasticCacheUtility(object):
    def __init__(self):
        self.redis = ElasticRedisCacheConnection()
        self.client = self.redis.client

    def cache_response(self, api_name,cache_query,response,cache_expiry=3600):
        self.client.set(cache_query,json.dumps(response),ex=cache_expiry)

    def cache_key_generator(self, api_name,query_duration,body):
        is_min_level_caching = True 
        if api_name == 'metrics' and isinstance(body,dict):
            for key,value in body.items():
                if isinstance(value,list) and len(value) > 0:
                    is_min_level_caching = False
                    break
        if is_min_level_caching:
            try:
                for key,value in query_duration.items():
                    query_duration[key] = datetime.fromtimestamp(int(value)).strftime("%y%m%d%H%M")
            except Exception as e:
                logger.exception(f"Unable to generate query cache : {e}")
        query=f"{api_name}_{json.dumps({**body,**query_duration})}"
        return query

    def search_cache(self, cache_query):
        cached_response=self.client.get(cache_query)
        if cached_response is not None:
            return cached_response
        else:
            return None