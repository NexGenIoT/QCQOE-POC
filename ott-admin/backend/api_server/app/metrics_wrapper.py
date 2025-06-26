from config import settings
from db_wrapper import OpenSearchClient


class MetricsWrapper(object):
    def __init__(self) -> None:
        self.open_search_obj = OpenSearchClient()
    
    def get_query(self, udids=None, from_time=None, to_time=None, session_ids=None, group_on="device_id"):
        filters = []
        if from_time and to_time:
            filters.append({"range": {"last_report_time": 
                                {"lte": to_time, "gte": from_time}}},)
        if udids:
            filters.append({"terms": {"device_id.keyword": udids}})
        if session_ids:
            filters.append({"terms": {"current_session_id.keyword": session_ids}})
        query = {
                    "size": 0,
                    "query": {
                        "bool": {
                        "must": filters
                        }
                    },
                    "aggs": {
                        "group_on": {
                        "terms": {
                            "field": str(group_on)+".keyword",
                            "size":10000
                        },
                        "aggs": {
                            "startup_buffer_duration": {
                            "avg": {
                                "field": "startup_buffer_duration"
                            }
                            }
                        }
                        }
                    }
                    }
        
        return query

    def execute_query(self, query):
        query_response = self.open_search_obj.search_data(query=query, index_name=settings.DSM_ES_INDEX_NAME)
        response = query_response["aggregations"]["group_on"]["buckets"]
        result = []
        if response:
            for res in response:
                result.append((res["key"],res["startup_buffer_duration"]["value"] ))
        return result