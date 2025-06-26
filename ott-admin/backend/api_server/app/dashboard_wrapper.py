from config import settings, AggregationType, Units, MetricesName, logger
from db_wrapper import OpenSearchClient
from datetime import datetime

DSM_ES_INDEX_NAME = settings.DSM_ES_INDEX_NAME
FLINK_ES_INDEX_NAME = settings.FLINK_ES_INDEX_NAME


class DashboardServiceWrapper(object):

    def make_query_flink_es(self, metrics_name, to_time, from_time, device_platform):
        filter_data =[]
        aggregation_type = AggregationType[metrics_name].value
        if device_platform:
            filter_data.append({"match": {"device_platform": device_platform}})
        if to_time and from_time:
            filter_data.append({'range': {'dts_es': {'lte': to_time, 'gt': from_time}}})
        if aggregation_type == "avg":
            # https://www.elastic.co/guide/en/elasticsearch/reference/current/search-aggregations-metrics-weight-avg-aggregation.html
            basic_query = {"_source": "false", "size": 0, "query": {
                "bool": {"must": filter_data, "filter": [],
                        "should": [], "must_not": []}}, "aggs":
                            {"aggregations": {"weighted_avg": {
                                            "value": {
                                            "field": metrics_name
                                            },
                                            "weight": {
                                            "field": "m_total_payload_count"
                                            }
                                        }
                                    }
                            }
                    }
        else:
            basic_query = {"_source": "false", "size": 0, "query": {
                "bool": {"must": filter_data, "filter": [],
                        "should": [], "must_not": []}}, "aggs":
                {"aggregations": {aggregation_type: {"field": metrics_name}}
                }
                }
        return basic_query

    def make_query_dsm_es(self, field_name, to_time, from_time, device_platform, last_event_state=None, metrics_name=""):
        filter_data = []
        if last_event_state is not None:
            filter_data.append({"match": {"last_event_state": last_event_state}})
        if device_platform:
            filter_data.append({"match": {"platform": device_platform}})
        if to_time and from_time:
            filter_data.append({'range': {'last_report_time': {'lte': to_time, 'gt': from_time}}})
        if metrics_name in ["m_unique_viewers", "m_unique_devices", "m_ended_plays_per_unique_devices"]:
           query ={"_source": "false", "size": 0, "query": {"bool": {"must": filter_data, "filter": [],
                                                                    "should": [], "must_not": []}},
                    "aggs": {"types_count": {"value_count": {"field": field_name}},
                            "group_by_status": {"cardinality": {"field": str(field_name)+ ".keyword"}}}}
        else:
            query = {"_source": "false", "size": 0, "query": {"bool": {"must": filter_data, "filter": [],
                                                                    "should": [], "must_not": []}},
                    "aggs": {"types_count": {"value_count": {"field": str(field_name)+ ".keyword"}},
                            "group_by_status": {"terms": {"field": str(field_name)+ ".keyword"}}}}

        return query

    def make_query_cuncurrent_play(self, from_time, to_time):
        # query_for_time_diff_grater_than_min ={
        #         "size":0,
        #         "query":{
        #             "range":{"last_report_time":{"gte": from_time, "lte": to_time}}
        #         },
        #         "aggs":{
        #             "time_stamp":{
        #                 "date_histogram":{
        #                     "field":"last_report_time",
        #                     "fixed_interval":"1d"
        #                 },
        #                 "aggs":{
        #                     "time_stamp_min":{
        #                     "date_histogram":{
        #                         "field":"last_report_time",
        #                         "interval":"1m"
        #                     },
        #                     "aggregations":{
        #                         "average_value":{
        #                             "sum":{
        #                                 "field":"m_concurrent_plays"
        #                             }
        #                         }
        #                     }
        #                     },
        #                     "average_value":{
        #                     "max_bucket":{
        #                         "buckets_path":"time_stamp_min>average_value"
        #                     }
        #                     }
        #                 }
        #             },
        #             "m_concurrent_plays":{
        #                 "max_bucket":{
        #                     "buckets_path":"time_stamp>average_value"
        #                 }
        #             }
        #         }
        #     }
        query_for_time_diff_less_than_min = {
                "size":0,
                "query":{
                    "range":{"last_report_time":{"gte": from_time, "lte": to_time}}
                },
                "aggs":{
                    "m_concurrent_plays":{
                        "sum":{
                            "field":"m_concurrent_plays"
                        }
                    }
                }
            }
        return query_for_time_diff_less_than_min

    def get_dsm_es_data(self, metrics_name, filter, from_time, to_time):
        device_platform = filter.get("device_platform", "")
        results = 0
        if metrics_name == "m_unique_devices":
            query = self.make_query_dsm_es("device_id", to_time, from_time, device_platform, metrics_name=metrics_name)
            obj = OpenSearchClient()
            response = obj.search_data(query=query, index_name=DSM_ES_INDEX_NAME)
            logger.info(f"dsm_es metrics_name: {metrics_name}, query : {query}, response:{response}")
            results = response["aggregations"]["group_by_status"]["value"]
            logger.info(f"dsm_es metrics_name: {metrics_name}, query : {query}, response:{response}, results : {results}")
            return results

        elif metrics_name == "m_unique_viewers":
            query = self.make_query_dsm_es("current_session_id", to_time, from_time, device_platform, metrics_name=metrics_name)
            obj = OpenSearchClient()
            response = obj.search_data(query=query, index_name=DSM_ES_INDEX_NAME)
            results = response["aggregations"]["group_by_status"]["value"]
            logger.info(f"dsm_es metrics_name: {metrics_name}, query : {query}, response:{response}, results : {results}")
            return results
        elif metrics_name == "m_ended_plays":
            query = self.make_query_dsm_es("device_id", to_time, from_time, device_platform, last_event_state='STOPPED')
            obj = OpenSearchClient()
            response = obj.search_data(query=query, index_name=DSM_ES_INDEX_NAME)
            results = response["aggregations"]["types_count"]["value"]
            logger.info(f"dsm_es metrics_name: {metrics_name}, query : {query}, response:{response}, results : {results}")
            return results

        elif metrics_name == "m_ended_plays_per_unique_devices":
            query = self.make_query_dsm_es("device_id", to_time, from_time, device_platform, last_event_state='STOPPED', metrics_name=metrics_name)
            obj = OpenSearchClient()
            response = obj.search_data(query=query, index_name=DSM_ES_INDEX_NAME)
            results = response["aggregations"]["group_by_status"]["value"]
            logger.info(f"dsm_es metrics_name: {metrics_name}, query : {query}, response:{response}, results : {results}")
            return results
        else:
            raise Exception("Invalid Metrices Name")


    def get_flink_es_data(self, metrics_name, filter, from_time, to_time):
        device_platform = filter.get("device_platform", "")
        query = self.make_query_flink_es(metrics_name, to_time, from_time, device_platform)
        obj = OpenSearchClient()
        response = obj.search_data(query=query, index_name=FLINK_ES_INDEX_NAME)
        results = response["aggregations"]["aggregations"]["value"]
        if results is None:
            results = 0
        if metrics_name == "m_total_minutes_watched":
            if type(results) is int or float:
                results = results/60
        if type(results) is float:
            results = format(results, ".3f")
        if type(results) is str:
            results = float(results)
        logger.info(f"flink_es metrics_name: {metrics_name}, query : {query}, response:{response}, results : {results}")
        return results

    def get_concurrent_play_data(self, from_time, to_time):
        try:
            query = self.make_query_cuncurrent_play(from_time, to_time)
            logger.info(f"make_query_cuncurrent_play query : {str(query)}")
            obj = OpenSearchClient()
            response = obj.search_data(query=query, index_name=settings.CONCURRENT_PLAYS_INDEX_NAME)
            logger.info(f"make_query_cuncurrent_play response : {str(response)}")
            dsm_es_24hrs = response["aggregations"]["m_concurrent_plays"]["value"] if response["aggregations"]["m_concurrent_plays"]["value"] else 0
            dsm_es_24hrs = dsm_es_24hrs if isinstance(dsm_es_24hrs, int) else dsm_es_24hrs if isinstance(dsm_es_24hrs, float) else 0        


        except Exception as e:
            dsm_es_24hrs = 0
            logger.exception(f"Exception : {str(e)}")
        return dsm_es_24hrs

    def get_string_abbrivation(self, metrices_name):
        name = ""
        if metrices_name == "m_connection_induced_rebuffering_ratio":
            name = "CIRR"
        elif metrices_name == "m_exit_before_video_starts":
            name = "EBVS"
        elif metrices_name == "m_succesful_plays":
            name = "Successful Plays"
        else:
            name = metrices_name[2:].replace("_", " ").title()
            if "Average" in name:
                name = name.replace("Average", "Avg.")
            if "Minutes" in name:
                name = name.replace("Minutes", "Min.") 
            if "Percentage" in name:
                name = name.replace("Percentage", "Pct.")
            if "Rebuffering" in name:
                name = name.replace("Rebuffering", "ReBuff.")
            if "Plays Per" in name:
                name = name.replace("Plays Per " , "Plays/")
        return name

    def process_percent_change(self, to_time, from_time_24hrs, from_time_48hrs, filter):
        metrices_name = "m_" + str(filter.get("metrices_name", ""))
        if metrices_name:
            try:
                if metrices_name in MetricesName.metrices_from_dsm_es.value:
                    dsm_es_24hrs = self.get_dsm_es_data(metrices_name, filter, from_time_24hrs, to_time)
                    dsm_es_48hrs = self.get_dsm_es_data(metrices_name, filter, from_time_48hrs, from_time_24hrs)
                    percentage_change = ((dsm_es_24hrs - dsm_es_48hrs) / dsm_es_48hrs) * 100 if dsm_es_48hrs > 0 else 0 if dsm_es_24hrs == 0 else 100
                    logger.info(f"dsm_es_24hrs : {dsm_es_24hrs} , dsm_es_48hrs : {dsm_es_48hrs}, percentage_change_dsm_es : {percentage_change}")
                    return [{"percentage": percentage_change, "hrs_change_24hrs": dsm_es_24hrs,
                             "hrs_change_48hrs": dsm_es_48hrs, "metricname": self.get_string_abbrivation(metrices_name),
                             "metric_key_name": metrices_name[2:], "unit": Units[metrices_name].value,
                             "color": True if dsm_es_48hrs < dsm_es_24hrs else False}]
                elif metrices_name == "m_concurrent_plays":
                    dsm_es_24hrs, dsm_es_48hrs = self.get_concurrent_play_data(from_time_24hrs, to_time), self.get_concurrent_play_data(from_time_48hrs, from_time_24hrs)
                    percentage_change = ((
                                                     dsm_es_24hrs - dsm_es_48hrs) / dsm_es_48hrs) * 100 if dsm_es_48hrs > 0 else 0 if dsm_es_24hrs == 0 else 100
                    logger.info(
                        f"dsm_es_24hrs : {dsm_es_24hrs} , dsm_es_48hrs : {dsm_es_48hrs}, percentage_change_dsm_es : {percentage_change}")
                    return [{"percentage": percentage_change, "hrs_change_24hrs": dsm_es_24hrs,
                             "hrs_change_48hrs": dsm_es_48hrs,
                             "metricname": self.get_string_abbrivation(metrices_name),
                             "metric_key_name": metrices_name[2:], "unit": Units[metrices_name].value,
                             "color": True if dsm_es_48hrs < dsm_es_24hrs else False}]
                elif metrices_name in MetricesName.metrices_from_flink_es.value:
                    flink_es_24hrs = self.get_flink_es_data(metrices_name, filter, from_time_24hrs, to_time)
                    flink_es_48hrs = self.get_flink_es_data(metrices_name, filter, from_time_48hrs, from_time_24hrs)
                    if metrices_name == "m_concurrent_plays":
                        if flink_es_24hrs < 0:
                            flink_es_24hrs = 0
                        if flink_es_48hrs < 0:
                            flink_es_48hrs = 0
                    percentage_change = ((flink_es_24hrs - flink_es_48hrs) / flink_es_48hrs) * 100 if flink_es_48hrs > 0 else 0 if flink_es_24hrs == 0 else 100
                    logger.info(f"flink_es_24hrs : {flink_es_24hrs} , flink_es_48hrs : {flink_es_48hrs}, percentage_change_flink_es : {percentage_change}")
                    if metrices_name == "m_video_playback_failures":
                        color_code = True if flink_es_48hrs > flink_es_24hrs else False
                    else:
                        color_code = True if flink_es_48hrs < flink_es_24hrs else False
                    return [{"percentage": percentage_change, "hrs_change_24hrs": flink_es_24hrs,
                             "hrs_change_48hrs": flink_es_48hrs, "metricname": self.get_string_abbrivation(metrices_name),
                             "metric_key_name": metrices_name[2:], "unit": Units[metrices_name].value,
                             "color": color_code}]
                else:
                    return [{"message": "Bad request, Invalid matrices name"}]
            except Exception as e:
                logger.exception(f"Exception in process_percent_change : {str(e)}")
                return [{"message": f"Internal server error {str(e)}"}]

        else:
            return [{"message": "Bad request, Please provide matrices name"}]