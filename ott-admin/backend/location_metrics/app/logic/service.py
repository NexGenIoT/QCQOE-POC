import sys
import os
from typing import TypeVar

sys.path.insert(0, os.path.dirname(os.getcwd()))
from logic import helper, data
from logic.config import logger, settings
from datetime import datetime

helper_obj = helper.Helper()
data_obj = data.AwsDynamodb()


class GetMetricInfo:
    def __init__(self, start_time: int, end_time: int, metric: str=None):
        self.play_count_items = None
        self.metric = metric
        self.start_time = start_time
        self.end_time = end_time
        self.q_start_time = datetime.strptime(str(datetime.utcfromtimestamp(int(self.start_time))),
                                       '%Y-%m-%d %H:%M:%S').isoformat(
            timespec='microseconds')
        self.q_end_time = datetime.strptime(str(datetime.utcfromtimestamp(int(self.end_time))), '%Y-%m-%d %H:%M:%S').isoformat(
            timespec='microseconds')
        

    def get_response(self):
        try:
            data_resp = self.clean_fetched_data(
                data_obj.fetch_sso_stats_from_dynamodb(settings.DYNAMODB_OUTAGE_BANNER_TABLE, self.start_time, self.end_time, 'dts_es',
                                                    'provider', 'ErrorCode', 'platform', '#location'))
            df = helper_obj.create_dataframe(data_resp, ['ErrorCode', 'platform', 'provider', 'dts_es', 'location'])
            return self.create_response(df)
        except Exception as err:
            logger.exception(f"Error: Error getting response {err}")

    def clean_fetched_data(self, data_resp:list) -> list:
        try:
            return list(map(lambda x: [x['ErrorCode'] if 'ErrorCode' in x else None
                , x['platform'] if 'platform' in x else None
                , x['provider'] if 'provider' in x else None
                , x['dts_es'] if 'dts_es' in x else None
                , x['location'] if 'location' in x else None], data_resp))
        except Exception as err:
            logger.exception(f"Error: Error getting response {err}")

    def create_response(self, df:  TypeVar('pandas.core.frame.DataFrame')):
        try:
            data = []
            if self.metric == 'geometricinsights':
                resp = df[(df.dts_es >= self.start_time) & (df.dts_es <= self.end_time)].groupby(
                    ['provider', 'platform'])['ErrorCode'].count().to_dict()
                {data.append({"count": value, "provider": key[0], "platform": key[1]}) for key, value in resp.items()}
                return data
            else:
                resp = df.groupby(['location'])['ErrorCode'].count().to_dict()
                return self.create_response_for_mapblips_from_dict(resp)
        except Exception as err:
            logger.exception(f"Error: Error creating response {err}")

    def create_response_for_mapblips_from_dict(self, resp: dict) -> dict:
        try:
            response = dict()
            data = list()
            for key, val in resp.items():
                coordinates = helper_obj.get_location_details(key, val) if key else "", ""
                data.append(coordinates[0])
            return {"data": data}
        except Exception as err:
            logger.exception(f"Error: Error creating response for mapblips api {err}")

    def map_blips(self, type: str = None):
        try:
            self.type = type
            if self.type == "concurrent":
                self.mediater = "m_concurrent_plays"
                self.index = settings.C_PLAYCOUNT_INDEX
                self.timeperiod = "last_report_time"
                self.location = "location.keyword"
            else:
                self.mediater = "m_attempts"
                self.index = settings.PLAYCOUNT_INDEX
                self.timeperiod = "dts_es"
                self.location = "location.keyword"
                self.play_count = {
                    "m_count": {
                        "sum": {
                            "field": self.mediater
                        }
                    }
                }
            qu ={"size":0, "_source":"false", "query": {"bool": {"must": [{"range": {"last_report_time": {"gte": self.q_start_time, "lte": self.q_end_time}}}]}},"aggs": {"groupby_location": {"terms": {"field": self.location},"aggs": {"concurrent_sum": {"sum": {"field": self.mediater}}}}}}

        except Exception as e:
            logger.exception(f"error in forming the query Mapblips {e}")
            return {"message": f"something went wrong"}
        try:
            logger.info(f"mapblips:query: {qu}")
            query_response = helper_obj.get_query_response(qu, self.index)
            logger.info(f"mapblips:query response : {query_response}")
            if query_response is None:
                logger.exception(f"error in query response")
                return {"message": f"something went wrong"}
        except Exception as e:
            logger.error(f"error in query response {e}")
        try:
            if self.type == "concurrent":
                
                # self.coordinates = {
                #     "data": [helper_obj.get_location_details(source["_source"]["location"], cnt=source["_source"]["m_concurrent_plays"]) for source in query_response.get("hits").get("hits") ]}
                self.coordinates = {"data":[helper_obj.get_location_details(loc_count.get("key"), loc_count.get("concurrent_sum").get("value")) for loc_count  in query_response.get("aggregations").get("groupby_location").get("buckets")]} 
                return self.coordinates
        except Exception as e:
            logger.exception(f"error in getting location cords {e}")
            return {"message": f"something went wrong"}
        else:
            self.coordinates = {
                "data": [helper_obj.get_location_details(details.get("key"), cnt=int(details["m_count"]["value"])) for details in query_response.get("aggregations").get("groupbyfield").get("buckets")]}
            return self.coordinates

    def geometric(self, type: str = None):
        self.type = type
        if self.type == "concurrent":
            self.mediater = "m_concurrent_plays"
            index = settings.C_PLAYCOUNT_INDEX
            self.timeperiod = "last_report_time"
            self.platform = "platform.keyword"
            self.provider = "provider.keyword"
        else:
            self.mediater = "m_attempts"
            index = settings.PLAYCOUNT_INDEX
            self.platform = "device_platform.keyword"
            self.provider = "content_partner.keyword"
            self.timeperiod = "dts_es"
            self.play_count = {

                "m_count": {
                    "sum": {
                        "field": self.mediater

                    }
                }}
        qu = {
                "size": 0, 
                "query": {
                    "bool": {
                        "must": [
                                    {
                                        "range": {
                                            self.timeperiod: {
                                                "gte": self.q_start_time, "lte": self.q_end_time
                                                }
                                            }
                                        }
                                    ]
                        }
                    }, 
                "aggs": {
                    "provider": {
                        "terms": {
                            "field": self.provider, 
                            "size":1000
                        }, 
                        "aggs": {
                            "platform": {
                                "terms": {
                                    "field": self.platform,
                                    "size":1000
                                    }, 
                                "aggs": {
                                    "m_count": {
                                        "sum": {"field": self.mediater}
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
        try:
            logger.info({"api":"geometric", "metric":"concurrent", "query":qu})
            query_response_object = helper_obj.get_query_response(qu, index)
            logger.info({"api":"geometric", "metric":"concurrent", "response":query_response_object})
            query_response = query_response_object["aggregations"]["provider"]["buckets"] if query_response_object is not None else {}
            output_response = list()
            for bucket in query_response:
                output = dict()
                output["provider"] = bucket["key"]
                for sub_bucket in bucket["platform"]["buckets"]:
                    output["concurrentplays"] = sub_bucket["m_count"]["value"]
                    output["platform"] = sub_bucket["key"]
                output_response.append(output)
            return output_response              
        except Exception as e:
            logger.exception(f"error in geometric deatils {e}")
            return []

