import sys
import os
sys.path.insert(0, os.path.dirname(os.getcwd()))
import pandas as pd
from datetime import datetime, timedelta
from logic.config import GetConnection, logger
from typing import TypeVar
from logic.db_wrapper import RedisConnection
import json


class Helper:
    def create_dataframe(self, data_obj:list, columns:list) -> TypeVar('pandas.core.frame.DataFrame'):
        try: return pd.DataFrame(data_obj, columns=columns) 
        except Exception as err: logger.exception(f"Error: Unable to create Dataframe {err}")

    def extract_args_data(self, *args:str) -> str:
        resp = ""
        try:
            for arg in args[0]:
                resp += arg + ","
            print(resp[::-1])
            return resp[:-1]
        except Exception as err:
            logger.exception(f"Error: Unable to parse arguments {err}")

    def get_location_details(self, location: str, cnt: int = None):
        try:
            redis = RedisConnection().client
            location_details = redis.hgetall("qoe_location_mapblips")
            if location in location_details.keys():
                result = json.loads(location_details[location])
                if cnt:
                    result['count'] = cnt
            else:
                result = {"city": f"'unknown-'{location}", "latitude": 'unknown',
                            "longitude": 'unknown', "count":cnt}
            return result
        except Exception as e:
            logger.exception(f"Exception in location-name {e}")
            return {"err":f"Location not found"}
    def get_query_response(self, query, index):
        try:
            connection_obj = GetConnection()
            return connection_obj.conn.search(
            body=query, index=index,request_timeout=20
        )
        except Exception as err:
            logger.exception(f"Bucket list must be less than or equal to: [65535]-{err}")
            return None
