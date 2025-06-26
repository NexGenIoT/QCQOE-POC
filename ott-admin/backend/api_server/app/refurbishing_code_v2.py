import asyncio
import copy
from config import settings, logger
from datetime import datetime, timedelta
from db_wrapper import JaydebeApi, OpenSearchClient
from enum import Enum
import json
import jaydebeapi
import isodate
import pandas as pd
import time



JDBC_URL = settings.JDBC_URL
DSM_ES_INDEX_NAME = settings.DSM_ES_INDEX_NAME
FLINK_ES_INDEX_NAME = settings.FLINK_ES_INDEX_NAME

creds = ["root", "dell#Hp$20"]


# Todo: merge changes from this into the dashboard_microservice and delete this one

class Aggregation_type(Enum):
    m_attempts = "sum"
    m_average_bitrate = "avg"
    m_average_framerate = "avg"
    m_average_percentage_completion = "avg"
    m_bandwidth = "avg"
    m_concurrent_plays = "sum"
    m_ended_plays = "value_count"
    m_ended_plays_per_unique_devices = "cardinality"
    m_exit_before_video_starts = "sum"
    m_minutes_per_unique_devices = "avg"
    m_play_attempts = "sum"
    m_rebuffering_percentage = "avg"
    m_rebuffering_ratio = "avg"
    m_succesful_plays = "sum"
    m_total_minutes_watched = "sum"
    m_unique_devices = "cardinality"
    m_unique_viewers = "cardinality"
    m_user_attrition = "sum"
    m_video_playback_failures = "sum"
    m_video_start_failures = "sum"
    m_video_start_time = "avg"
    m_video_restart_time = "avg"
    m_rendering_quality = "avg"
    m_connection_induced_rebuffering_ratio = "avg"


class Units(Enum):
    m_video_start_time = ""
    m_video_restart_time = ""
    m_rendering_quality = ""
    m_attempts = ""
    m_average_bitrate = "kbps"
    m_average_framerate = "fps"
    m_average_percentage_completion = "%"
    m_bandwidth = "mbps"
    m_concurrent_plays = ""
    m_ended_plays = ""
    m_ended_plays_per_unique_devices = ""
    m_exit_before_video_starts = ""
    m_minutes_per_unique_devices = "mins"
    m_play_attempts = ""
    m_rebuffering_percentage = "%"
    m_rebuffering_ratio = ""
    m_succesful_plays = ""
    m_total_minutes_watched = "mins"
    m_unique_devices = ""
    m_unique_viewers = ""
    m_user_attrition = ""
    m_video_playback_failures = ""
    m_video_start_failures = ""
    m_connection_induced_rebuffering_ratio = ""


class Metrices_name(Enum):
    metrices_from_flink_es = ['m_attempts', 'm_average_bitrate', 'm_average_framerate',
                              'm_average_percentage_completion', 'm_bandwidth', 'm_exit_before_video_starts',
                              'm_minutes_per_unique_devices', 'm_rebuffering_percentage', 'm_rebuffering_ratio',
                              'm_succesful_plays', 'm_total_minutes_watched', 'm_user_attrition',
                              'm_video_playback_failures', 'm_video_start_failures', 'm_video_start_time',
                              'm_video_restart_time', 'm_rendering_quality', 'm_concurrent_plays',
                              'm_connection_induced_rebuffering_ratio']
    metrices_from_dsm_es = ["m_unique_devices", "m_unique_viewers", "m_ended_plays", "m_ended_plays_per_unique_devices"]
    real_time_key_insights_metrices_flink = ["m_average_bitrate", "m_play_attempts", "m_concurrent_plays",
                                             "m_exit_before_video_starts", "m_rebuffering_percentage",
                                             "m_succesful_plays", "m_video_playback_failures", "m_video_start_failures",
                                             "m_connection_induced_rebuffering_ratio"]
    # real_time_key_insights_metrices_dsm=[]
    user_engagement_metrices_flink = ["m_average_percentage_completion", "m_concurrent_plays", "m_average_bitrate",
                                      "m_minutes_per_unique_devices", "m_play_attempts", "m_succesful_plays",
                                      "m_video_playback_failures", "m_total_minutes_watched"]
    user_engagement_metrices_dsm = ["m_unique_devices", "m_unique_viewers"]
    qoe_metrices_flink = ["m_average_framerate", "m_bandwidth", "m_attempts", "m_rebuffering_ratio", "m_user_attrition",
                          "m_video_playback_failures", "m_video_start_time", "m_video_restart_time",
                          "m_rendering_quality"]
    qoe_metrices_dsm = ["m_ended_plays_per_unique_devices","m_ended_plays" ]
    metric_mapping = {"user_engagement_metrices": [user_engagement_metrices_flink, user_engagement_metrices_dsm],
                      "real_time_key_insights": [real_time_key_insights_metrices_flink],
                      "quality_of_experience": [qoe_metrices_flink, qoe_metrices_dsm]}


class ResourcePool:
    """
    Manage Reusable objects for use by Client objects.
    """

    def __init__(self, size):
        self._reusables = [jaydebeapi.connect("org.opensearch.jdbc.Driver", JDBC_URL, creds,
                                              "./opensearch-sql-jdbc-1.1.0.1.jar").cursor() for _ in range(size)]

    def acquire(self):
        return self._reusables.pop()

    def release(self, reusable):
        self._reusables.append(reusable)


def generate_jdbc_query(metrics, index_name):
    sql_query = "SELECT "
    for pos, i in enumerate(metrics):
        sql_query += Aggregation_type.i + "({})".format(i)
        if pos < len(metrics) - 1:
            sql_query += ","
    sql_query += " FROM {} WHERE dts_es<=\'".format(index_name) + str(
        datetime.today().strftime("%Y-%m-%d %H:%M:%S")) + "\' and dts_es>\'" + str(
        (datetime.today() - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S")) + "\'"
    return sql_query


# def execute_query(sql_query):
#     jaydebe_obj = JaydebeApi()
#     # available_cursor = cursor_not_in_use.pop(0)
#     # cursor_in_use.append(available_cursor)
#     JaydebeApi.client.execute
#     available_cursor.execute(sql_query)
#     # print(cursor.getCatalog())
#     result = available_cursor.fetchall()
#     # available_cursor.close()
#     # cursor_not_in_use.append(available_cursor)
#     # cursor_in_use.pop(-1)
#     return result


async def get_metric_single_datapoint_jdbc(metrics, filter, from_time, to_time, source) -> dict:
    """
    return {"metricname":"metricvalue"}
    """
    jaydebeapi_obj = JaydebeApi()
    device_platform = filter.get("device_platform", "")
    if source == "flink_es":
        sql_query = "SELECT "
        for pos, i in enumerate(metrics):
            if i == "m_total_minutes_watched" and "m_minutes_per_unique_devices":
                sql_query += Aggregation_type[i].value + "({})".format(i) + "/60.0"
            else:
                sql_query += Aggregation_type[i].value + "({})".format(i)
            if pos < len(metrics) - 1:
                sql_query += ","
        sql_query += " FROM {} where dts_es<=\'".format(FLINK_ES_INDEX_NAME) + str(to_time) + "\' and dts_es>\'" + str(
            from_time) + "\' "
        sql_query += "and device_platform=\'{}\'".format(device_platform) if device_platform != "" else ""
        start_time = time.time()
        logger.info(f"flink_es sql_query : {sql_query}")
        results = jaydebeapi_obj.execute_query(sql_query)
        logger.info(f"flink_es sql_query results type : { type(results)}")
        logger.info(f"flink_es sql_query results : {results}")
        if type(results) is dict:
            results = results.get(0,"")
        elif len(results) > 0:
            results = results[0]
        else:
            logger.exception(f"Data is not coming from flink server results: {results}")
        logger.info(f"-------------Execution Time : {time.time() - start_time} --------------------")
        return dict(zip(metrics, list(results)))
    elif source == "dsm_es":
        sql_query = "SELECT count(DISTINCT device_id), count(DISTINCT current_session_id) from {}  WHERE last_report_time<=\'".format(
            DSM_ES_INDEX_NAME) + str(to_time) + "\' and last_report_time>\'" + str(from_time) + "\'"
        sql_query += "and platform=\'{}\'".format(device_platform) if device_platform != "" else ""
        results = list(jaydebeapi_obj.execute_query(sql_query)[0])

        sql_query = "select count(device_id) from {} where last_event_state='STOPPED' and last_report_time<=\'".format(
            DSM_ES_INDEX_NAME) + str(to_time) + "\' and last_report_time>\'" + str(from_time) + "\' {}".format(
            "and platform=\'{}\'".format(device_platform) if device_platform != "" else "")
        results.extend(list(jaydebeapi_obj.execute_query(sql_query)[0]))

        # ended play per unique device
        sql_query = "select count(device_id) from {} where last_event_state='STOPPED' and last_report_time<=\'".format(
            DSM_ES_INDEX_NAME) + str(to_time) + "\' and last_report_time>\'" + str(from_time) + "\' {}".format(
            "and platform=\'{}\'".format(device_platform) if device_platform != "" else "") + " group by device_id order by count(device_id) desc LIMIT 1 "
        value = jaydebeapi_obj.execute_query(sql_query)
        if len(list(value)) > 0:
            results.extend(list(value[0]))
        else:
            results.extend([0])
        return dict(zip(metrics, results))


async def get_metric_single_datapoint_jdbc_grouped_by_partner_provider(metrics, filter, from_time, to_time,
                                                                       source) -> dict:
    """
    return {"metricname":"metricvalue"}
    """
    jaydebeapi_obj = JaydebeApi()
    if source == "flink_es":
        sql_query = "SELECT "
        for pos, i in enumerate(metrics):
            if i == "m_total_minutes_watched" and "m_minutes_per_unique_devices":
                sql_query += Aggregation_type[i].value + "({})".format(i) + "/60.0"
            else:
                sql_query += Aggregation_type[i].value + "({})".format(i)
            if pos < len(metrics) - 1:
                sql_query += ","
        sql_query += " FROM {} where dts_es<=\'".format(FLINK_ES_INDEX_NAME) + str(to_time) + "\' and dts_es>\'" + str(
            from_time) + "\' GROUP BY {}".format(filter["group_on"])
        print(sql_query)
        results = jaydebeapi_obj.execute_query(sql_query)
        sql_query = "SELECT * FROM {} where dts_es<=\'".format(FLINK_ES_INDEX_NAME) + str(
            to_time) + "\' and dts_es>\'" + str(from_time) + "\' GROUP BY {}".format(filter["group_on"])
        name = jaydebeapi_obj.execute_query(sql_query)
        name = [i[0] for i in name]
        return {name[i]: {**{filter["group_on"]: name[i]}, **dict(zip(metrics, results[i]))} for i in
                range(len(name))}, name

    elif source == "dsm_es":
        result = []
        sql_query = "SELECT * FROM {} where last_report_time<=\'".format(DSM_ES_INDEX_NAME) + str(
            to_time) + "\' and last_report_time>\'" + str(from_time) + "\' GROUP BY {}".format(filter["group_on"])
        keys = jaydebeapi_obj.execute_query(sql_query)
        keys = [i[0] for i in keys]
        sql_query = "SELECT {}".format(
            filter["group_on"]) + ",count(DISTINCT device_id) from {}  WHERE last_report_time<=\'".format(
            DSM_ES_INDEX_NAME) + str(to_time) + "\' and last_report_time>\'" + str(from_time) + "\' GROUP BY {}".format(
            filter["group_on"])
        result.append(list(jaydebeapi_obj.execute_query(sql_query)))
        sql_query = "SELECT {}".format(
            filter["group_on"]) + ",count(DISTINCT current_session_id) from {}  WHERE last_report_time<=\'".format(
            DSM_ES_INDEX_NAME) + str(to_time) + "\' and last_report_time>\'" + str(from_time) + "\' GROUP BY {}".format(
            filter["group_on"])
        result.append(list(jaydebeapi_obj.execute_query(sql_query)))
        sql_query = "SELECT {}".format(filter[
            "group_on"]) + ",count(device_id) from {} where last_event_state='STOPPED' and last_report_time<=\'".format(
            DSM_ES_INDEX_NAME) + str(to_time) + "\' and last_report_time>\'" + str(from_time) + "\' GROUP BY {}".format(
            filter["group_on"])
        result.append(list(jaydebeapi_obj.execute_query(sql_query)))

        sql_query = "select device_id,platform,provider from {} where last_event_state='STOPPED' and last_report_time<=\'".format(
            DSM_ES_INDEX_NAME) + str(to_time) + "\' and last_report_time>\'" + str(from_time) + "\'"
        value = jaydebeapi_obj.execute_query(sql_query)
        if len(value) > 0:
            value = pd.DataFrame(value)
            value.columns = ["device_id", "platform", "provider"]
            label = list(value.groupby(filter["group_on"])["device_id"].value_counts().sort_values(
                ascending=False).index.get_level_values(0))
            count = list(value.groupby(filter["group_on"])["device_id"].value_counts().sort_values(ascending=False).max(
                level=0).values)
            result.append([(label[i], int(count[i])) for i in range(len(count))])
        else:
            result.append([])

        response = {}
        for i in keys:
            data_for_each_key = {}
            data_for_each_key[filter["group_on"]] = i
            for j in range(len(metrics)):
                if len(result[j]) > 0 and i in list(dict(result[j])):
                    data_for_each_key[metrics[j]] = dict(result[j])[i]
                else:
                    data_for_each_key[metrics[j]] = 0
            response[i] = data_for_each_key

        return response, keys



async def percentage_change(to_time, from_time_24hrs, from_time_48hrs, filter):
    dsm_es_24hrs, dsm_es_48hrs, flink_es_24hrs, flink_es_48hrs = await asyncio.gather(
        get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_dsm_es.value, filter, from_time_24hrs, to_time,
                                         'dsm_es'),
        get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_dsm_es.value, filter, from_time_48hrs,
                                         from_time_24hrs, 'dsm_es'),
        get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_flink_es.value, filter, from_time_24hrs, to_time,
                                         'flink_es'),
        get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_flink_es.value, filter, from_time_48hrs,
                                         from_time_24hrs, 'flink_es'))

    percentage_change_dsm_es = {
        i: ((dsm_es_24hrs[i] - dsm_es_48hrs[i]) / dsm_es_48hrs[i]) * 100 if dsm_es_48hrs[i] > 0 else 0 if dsm_es_24hrs[
            i] == 0 else 100
        for i in dsm_es_24hrs}

    percentage_change_flink_es = {
        i: ((flink_es_24hrs[i] - flink_es_48hrs[i]) / flink_es_48hrs[i]) * 100 if flink_es_48hrs[i] > 0 else 0 if
        flink_es_24hrs[i] == 0 else 100 for i in flink_es_24hrs}
    logger.info(f"percentage_change_dsm_es : {percentage_change_dsm_es}")
    logger.info(f"percentage_change_flink_es : {percentage_change_flink_es}")
    percentage_change = {**percentage_change_flink_es, **percentage_change_dsm_es,}
    metrices_24hrs = {**flink_es_24hrs, **dsm_es_24hrs}
    metrices_48hrs = {**flink_es_48hrs, **dsm_es_48hrs,}
    logger.info(f"metrices_24hrs : {metrices_24hrs}")
    logger.info(f"metrices_24hrs : {metrices_24hrs}")

    return [{"percentage": percentage_change[i], "hrs_change_24hrs": metrices_24hrs[i],
             "hrs_change_48hrs": metrices_48hrs[i], "metricname": i[2:].replace("_", " ").title(),
             "metric_key_name": i[2:], "unit": Units[i].value,
             "color": True if metrices_48hrs[i] < metrices_24hrs[i] else False} for i in metrices_24hrs]


def generate_query(start_time, stop_time, filters, aggregation_type):
    """
    Generate's Query V1
    1) Having comparably high latency
    """
    filter = [{"range": {"dts_es": {"lte": stop_time, "gt": start_time}}}] if len(start_time) != 0 and len(
        stop_time) != 0 else []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i != "device_platform":
            if len(filters[i]) > 0:
                filter.append({
                    "terms": {
                        i: [j.lower() for j in filters[i]]
                    }
                })
    if len(filters["device_platform"]) > 0:
        filter.append(
            {"terms": {"device_platform": list(map(str.lower, filters["device_platform"]))}})
    filter = list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"] = "10m"
    if aggregation_type == "avg":
        query = {"_source": "false", "aggs": {
            "selected_dates": {
                "filter": {
                    "bool": {
                        "must": filter
                    }
                },
                "aggs": {
                    "m_" + filters["metricname"]: {
                        "weighted_avg": {
                            "value": {
                                "field": "m_" + filters["metricname"]
                            },
                            "weight": {
                                "field": "m_total_payload_count"
                            }
                        }
                    },
                    "time_stamp": {
                        "date_histogram": {
                            "field": "dts_es",
                            "fixed_interval": filters["aggregation_interval"]
                        },
                        "aggregations": {
                            "average_value": {
                                "weighted_avg": {
                                    "value": {
                                        "field": "m_" + filters["metricname"]
                                    },
                                    "weight": {
                                        "field": "m_total_payload_count"
                                    }
                                }
                            }
                        }
                    },
                    "platform":{
                        "terms": {
                            "field": "device_platform.keyword",
                            "size": settings.DSL_MAX_BUCKET_SIZE
                        },
                        "aggs": {
                            "m_" + filters["metricname"]:{
                                "weighted_avg":{
                                    "value":{
                                        "field":"m_" + filters["metricname"]
                                    },
                                    "weight":{
                                        "field":"m_total_payload_count"
                                    }
                                }
                            }, 
                            "time_stamp": {
                                "date_histogram": {
                                    "field": "dts_es",
                                    "fixed_interval": filters["aggregation_interval"]
                                },
                                "aggregations": {
                                    "average_value": {
                                        "weighted_avg": {
                                            "value": {
                                                "field": "m_" + filters["metricname"]
                                            },
                                            "weight": {
                                                "field": "m_total_payload_count"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    else:
        query = {"_source": "false", "aggs": {
            "selected_dates": {
                "filter": {
                    "bool": {
                        "must": filter
                    }
                },
                "aggs": {
                    "m_" + filters["metricname"]: {
                        aggregation_type: {
                            "field": "m_" + filters["metricname"]
                        }
                    },
                    "time_stamp": {
                        "date_histogram": {
                            "field": "dts_es",
                            "fixed_interval": filters["aggregation_interval"]
                        },
                        "aggregations": {
                            "average_value": {
                                aggregation_type: {
                                    "field": "m_" + filters["metricname"]

                                }
                            }
                        }
                    },
                    "platform":{
                        "terms": {
                            "field": "device_platform.keyword",
                            "size": settings.DSL_MAX_BUCKET_SIZE
                        },
                        "aggs": {
                            "m_" + filters["metricname"]:{
                                aggregation_type: {
                                    "field": "m_" + filters["metricname"]
                                }
                            }, 
                            "time_stamp": {
                                "date_histogram": {
                                    "field": "dts_es",
                                    "fixed_interval": filters["aggregation_interval"]
                                },
                                "aggregations": {
                                    "average_value": {
                                        aggregation_type: {
                                            "field": "m_" + filters["metricname"]
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }}
    return query


def generate_query_dsm_es(start_time, stop_time, filters, aggregation_type, must_filters):
    """
    Generate's Query V1
    1) Having comparably high latency
    """
    filter = []
    query = {}
    filter = must_filters if len(start_time) != 0 and len(stop_time) != 0 else []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i != "aggregation_feild" and i != "platform":
            if len(filters[i]) > 0:
                if i == "provider":
                    filter.append({
                        "terms": {
                            f"{i}.keyword": [j for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
    if len(filters["platform"]) > 0:
        filter.append({"terms": {"platform": list(map(str.lower, filters["platform"]))}})
        
    filter = list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"] = "10m"
    if aggregation_type == "avg":
        query = {"_source": "false", "aggs": {
            "selected_dates": {
                "filter": {
                    "bool": {
                        "must": filter
                    }
                },
                "aggs": {
                    "m_" + filters["metricname"]: {
                        "weighted_avg": {
                            "value": {
                                "field": filters["aggregation_feild"]
                            },
                            "weight": {
                                "field": "m_total_payload_count"
                            }
                        }                      
                    },
                    "platform":{
                        "terms": {
                            "field": "platform.keyword",
                            "size": settings.DSL_MAX_BUCKET_SIZE
                        },
                        "aggs": {
                            "m_" + filters["metricname"]:{
                                "weighted_avg":{
                                    "value":{
                                        "field":filters["aggregation_feild"]
                                    },
                                    "weight":{
                                        "field":"m_total_payload_count"
                                    }
                                }
                            }, 
                            "time_stamp": {
                                "date_histogram": {
                                    "field": "last_report_time",
                                    "fixed_interval": filters["aggregation_interval"]
                                },
                                "aggregations": {
                                    "average_value": {
                                        "weighted_avg": {
                                            "value": {
                                                "field": filters["aggregation_feild"]
                                            },
                                            "weight": {
                                                "field": "m_total_payload_count"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "time_stamp": {
                        "date_histogram": {
                            "field": "last_report_time",
                            "fixed_interval": filters["aggregation_interval"]
                        },
                        "aggregations": {
                            "average_value": {
                                "weighted_avg": {
                                    "value": {
                                        "field": filters["aggregation_feild"]
                                    },
                                    "weight": {
                                        "field": "m_total_payload_count"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }}
    else:
        query = {"_source": "false", "aggs": {
            "selected_dates": {
                "filter": {
                    "bool": {
                        "must": filter
                    }
                },
                "aggs": {
                    "m_" + filters["metricname"]: {
                        aggregation_type: {
                            "field": str(filters["aggregation_feild"]) + ".keyword"
                        }                     
                    },
                    "platform":{
                        "terms": {
                            "field": "platform.keyword",
                            "size": settings.DSL_MAX_BUCKET_SIZE
                        },
                        "aggs": {
                            "m_" + filters["metricname"]:{
                                aggregation_type: {
                                    "field": str(filters["aggregation_feild"]) + ".keyword"
                                } 
                            }, 
                            "time_stamp": {
                                "date_histogram": {
                                    "field": "last_report_time",
                                    "fixed_interval": filters["aggregation_interval"]
                                },
                                "aggregations": {
                                    "average_value": {
                                        aggregation_type: {
                                            "field": str(filters["aggregation_feild"]) + ".keyword"

                                        }
                                    }
                                }
                            }
                        }
                    },
                    "time_stamp": {
                        "date_histogram": {
                            "field": "last_report_time",
                            "fixed_interval": filters["aggregation_interval"]
                        },
                        "aggregations": {
                            "average_value": {
                                aggregation_type: {
                                    "field": str(filters["aggregation_feild"]) + ".keyword"

                                }
                            }
                        }
                    }
                }
            }
        }}

    filter = 0
    return query


def concurrent_plays_query(start_time, stop_time, filters, aggregation_type, must_filters):
    filter = []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i != "aggregation_feild" and i != "platform":
            if len(filters[i]) > 0:
                if i == "provider":
                    filter.append({
                        "terms": {
                            f"{i}.keyword": [j for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
    if len(filters["platform"]) > 0:
        filter.append(
            {"terms": {"platform": list(map(str.lower, filters["platform"]))}})
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"] = "10m"
    if stop_time and start_time:
        filter.append({"range": {"last_report_time": {"lte": stop_time, "gt": start_time}}})
    query = {"_source": "false", "size": 0, "query": {"bool": {"must": filter, "filter": [], "should": [], "must_not": []}}, 
   "aggs":{
            "time_stamp":{
                "date_histogram":{
                    "field":"last_report_time",
                    "fixed_interval":filters["aggregation_interval"]
                },
                "aggs":{
                    "time_stamp_min":{
                    "date_histogram":{
                        "field":"last_report_time",
                        "interval":"1m"
                    },
                    "aggregations":{
                        "average_value":{
                            "sum":{
                                "field":"m_concurrent_plays"
                            }
                        }
                    }
                    },
                    "average_value":{
                    "max_bucket":{
                        "buckets_path":"time_stamp_min>average_value"
                    }
                    }
                }
            },
            "m_concurrent_plays":{
                "max_bucket":{
                    "buckets_path":"time_stamp>average_value"
                }
            },
            "platform":{
                "terms":{
                    "field":"platform.keyword",
                    "size": settings.DSL_MAX_BUCKET_SIZE
                },
                "aggs":{
                    "time_stamp":{
                    "date_histogram":{
                        "field":"last_report_time",
                        "fixed_interval":filters["aggregation_interval"]
                    },
                    "aggs":{
                        "time_stamp_min":{
                            "date_histogram":{
                                "field":"last_report_time",
                                "interval":"1m"
                            },
                            "aggregations":{
                                "average_value":{
                                "sum":{
                                    "field":"m_concurrent_plays"
                                }
                                }
                            }
                        },
                        "average_value":{
                            "max_bucket":{
                                "buckets_path":"time_stamp_min>average_value"
                            }
                        }
                    }
                    },
                    "m_concurrent_plays":{
                    "max_bucket":{
                        "buckets_path":"time_stamp>average_value"
                    }
                }
                }
            }
        }
    }
    return query



def metric_graphs_dsm_es(from_time, to_time, filters, key_for_platform_in_payload):
    open_search_obj = OpenSearchClient()
    if filters["metricname"] in ["unique_devices", "unique_viewers", "concurrent_plays"]:
        conditions = [{'range': {'last_report_time': {'lte': to_time, 'gt': from_time}}}]
    elif filters["metricname"] in ["ended_plays", "ended_plays_per_unique_devices"]:
        conditions = [{'range': {'last_report_time': {'lte': to_time, 'gt': from_time}}},
                      {"term": {"last_event_state.keyword": "STOPPED"}}]
    try:
        # if the data for the requested query in opensearch does not exist then exception will be called
        if filters["metricname"] == "concurrent_plays":
            query = json.dumps(concurrent_plays_query(from_time, to_time, filters, Aggregation_type["m_" + filters["metricname"]].value, conditions))
            logger.info(f"metric_graphs_dsm_es query : {query}")
            query_response_obj = open_search_obj.search_data(query=query, index_name=settings.CONCURRENT_PLAYS_INDEX_NAME)
            logger.info(f"metric_graphs_dsm_es response : {query_response_obj}")
            query_response = query_response_obj["aggregations"]
        else:
            query = json.dumps(generate_query_dsm_es(from_time, to_time, filters, Aggregation_type["m_" + filters["metricname"]].value,
                                                            copy.copy(conditions)))
            logger.info(f"metric_graphs_dsm_es query : {query}")
            query_response_obj = open_search_obj.search_data(query=query, index_name=settings.DSM_ES_INDEX_NAME)
            logger.info(f"metric_graphs_dsm_es response : {query_response_obj}")
            query_response = query_response_obj["aggregations"]["selected_dates"]
        return create_dsm_es_or_flink_es_response(query_response, filters, key_for_platform_in_payload)

    except Exception as e:
        logger.exception(f"Excelption in metric_graphs_dsm_es : {str(e)}")
        return {}


def metric_graphs_flink_es(from_time, to_time, filters, key_for_platform_in_payload):
    try:
        open_search_obj = OpenSearchClient()    
        query = json.dumps(generate_query(from_time, to_time, filters, Aggregation_type["m_" + filters["metricname"]].value)) 
        logger.info(f"metric_graphs_flink_es query : {query}")
        query_response_obj = open_search_obj.search_data(query=query, index_name=FLINK_ES_INDEX_NAME)
        logger.info(f"metric_graphs_flink_es response : {query_response_obj}")
        query_response = query_response_obj["aggregations"]["selected_dates"]
        return create_dsm_es_or_flink_es_response(query_response, filters, key_for_platform_in_payload)
    except Exception as e:
        logger.exception(f"Excelption in metric_graphs_flink_es : {str(e)}")
        return {}
    
def create_dsm_es_or_flink_es_response(query_response, filters, key_for_platform_in_payload):
    try:
        output_response = []
        agg_sum = query_response["m_" + filters["metricname"]]["value"] if query_response["m_" + filters["metricname"]]["value"] else 0
        agg_sum = agg_sum if isinstance(agg_sum, int) else agg_sum if isinstance(agg_sum, float) else 0        
        output_response = list()
        platforms_returned = list()
        time_interval = None

        total_time_stamp_buckets = query_response["time_stamp"]["buckets"]
        out_response = dict()
        out_response["all"] = dict()
        out_response["all"]["time_stamp"] = list()
        out_response["all"][filters["metricname"]] = list()
        out_response["all"]["total_sum"] = agg_sum / 60 if filters["metricname"] == "total_minutes_watched" else agg_sum
        out_response["all"]["unit"] = Units["m_" + filters["metricname"]].value
        for times in total_time_stamp_buckets:
            out_response["all"]["time_stamp"].append(times["key_as_string"])
            value = times["average_value"]["value"] if times["average_value"]["value"] else 0
            value = value if isinstance(value, int) else value if isinstance(value, float) else 0
            out_response["all"][filters["metricname"]].append(float(value)/60 if filters["metricname"] == "total_minutes_watched" else float(value))
        out_response["all"]["time_stamp"] = list(map(isodate.parse_datetime, out_response["all"]["time_stamp"]))
        out_response["all"]["time_stamp"] = list(map(str, out_response["all"]["time_stamp"]))
        output_response.append(out_response)
        time_interval = out_response["all"]["time_stamp"]
        if query_response["platform"]["buckets"]:
            for bucket in query_response["platform"]["buckets"]:
                output = dict()
                platforms_returned.append(bucket["key"])
                output[bucket["key"]] = dict()
                output[bucket["key"]][filters["metricname"]] = list()
                output[bucket["key"]]["time_stamp"] = list()
                value = bucket["m_" + filters["metricname"]]["value"] if bucket["m_" + filters["metricname"]]["value"] else 0
                value = value if isinstance(value, int) else value if isinstance(value, float) else 0
                output[bucket["key"]]["total_sum"] = float(value)/60 if filters["metricname"] == "total_minutes_watched" else float(value)
                output[bucket["key"]]["unit"] = Units["m_" + filters["metricname"]].value

                for sub_bucket in bucket["time_stamp"]["buckets"]:
                    output[bucket["key"]]["time_stamp"].append(sub_bucket["key_as_string"])
                    value = sub_bucket["average_value"]["value"] if sub_bucket["average_value"]["value"] else 0
                    value = value if isinstance(value, int) else value if isinstance(value, float) else 0
                    output[bucket["key"]][filters["metricname"]].append(value / 60 if filters["metricname"] == "total_minutes_watched" else value)
                output[bucket["key"]]["time_stamp"] = list(map(isodate.parse_datetime, output[bucket["key"]]["time_stamp"]))
                output[bucket["key"]]["time_stamp"] = list(map(str, output[bucket["key"]]["time_stamp"]))
                output_response.append(output)
            if not filters[key_for_platform_in_payload]: 
                filters[key_for_platform_in_payload] = [ "Android", "iOS", "Web", "Firestick","AndroidSmartTv"]
            platforms_not_returned = [x for x in filters[key_for_platform_in_payload] if x not in platforms_returned]
        else:
            platforms_not_returned = filters[key_for_platform_in_payload] 
        for i in platforms_not_returned:
            output = dict()
            output[i] = dict()
            output[i]["time_stamp"] = time_interval if time_interval else list()
            output[i][filters["metricname"]] = [0] * len(time_interval) if time_interval else list()
            output[i]["total_sum"] = 0
            output[i]["unit"] = Units["m_" + filters["metricname"]].value
            output_response.append(output)
        logger.info(f"create_dsm_es_or_flink_es_response response : {output_response}")        
        return output_response
    except Exception as e:
        logger.exception(f"create_dsm_es_or_flink_es_response : {str(e)}")
        return {}


def query_builder_experience_insight_flink_es(metrics_of_interest, group_on, to_time, from_time):
    metrics = {}
    for metricname in metrics_of_interest:
        metrics[metricname] = {Aggregation_type[metricname].value: {'field': metricname}}
    query = {
        "_source": "false",
        "aggs": {
            "selected_dates": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "dts_es": {
                                        "gt": to_time, "lte": from_time
                                    }
                                }
                            }
                        ]
                    }
                },
                "aggs": {
                    "provider": {
                        "terms": {
                            "field": group_on + ".keyword"
                        },
                        "aggs": {
                            "time_stamp": {
                                "date_histogram": {
                                    "field": "dts_es",
                                    "fixed_interval": "24h"
                                },
                                "aggregations": metrics
                            }
                        }
                    }
                }
            }
        }
    }
    return query


def experience_insight_screen(group_on, from_time, to_time, metric_type):
    metrics_of_interest = Metrices_name.metric_mapping.value[metric_type][0]
    open_search_obj = OpenSearchClient()
    if group_on in ["device_platform", "content_partner"]:
        query = query_builder_experience_insight_flink_es(metrics_of_interest, group_on, from_time, to_time)
        response = open_search_obj.search_data(query=query, index_name=settings.FLINK_ES_INDEX_NAME)
    else:
        return {}
    result = []
    for i in response["aggregations"]["selected_dates"]["provider"]["buckets"]:
        metric_data = {}
        metric_data[group_on] = i["key"]
        for j in i["time_stamp"]["buckets"][0]:
            if j in metrics_of_interest:
                metric_data[j] = i["time_stamp"]["buckets"][0][j]["value"]
        result.append(metric_data)
    return result


"""def aggregated_data_by_platform_partner(from_time,to_time,group_on):
    mapping={"device_platform":"platform","content_partner":"provider"}
    flink_es,keys_flink=get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metrices_from_flink_es.value,{"group_on":group_on},from_time,to_time,'flink_es')
    dsm_es,keys_dsm=get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metrices_from_dsm_es.value,{"group_on":mapping[group_on]},from_time,to_time,'dsm_es')
    #print(flink_es)
    #print(dsm_es)
    print(keys_flink)
    print(keys_dsm)
    response=[]
    print(set(keys_flink)-set(keys_dsm))
    for i in set(keys_dsm).intersection(set(keys_flink)):
        response.append({**flink_es[i],**dsm_es[i]})
    print(response)
    #return [{**flink_es[i],**dsm_es[i]} for i in range(len(flink_es))]]"""

"""async def aggregated_data_by_platform_partner(from_time,to_time,group_on,metric_type):
    mapping={"device_platform":"platform","content_partner":"provider"}
    #print(Metrices_name.metric_mapping.value)
    flink,dsm=await asyncio.gather(get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metric_mapping.value[metric_type][0],{"group_on":group_on},from_time,to_time,'flink_es'),get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metric_mapping.value[metric_type][1],{"group_on":mapping[group_on]},from_time,to_time,'dsm_es'))
    flink_es,keys_flink,dsm_es,keys_dsm=flink[0],flink[1],dsm[0],dsm[1]
    #print(flink_es)
    #print(dsm_es)
    response=[]
    print(dsm_es)
    print(flink_es)
    print(set(keys_flink)-set(keys_dsm))
    for i in set(keys_dsm).intersection(set(keys_flink)):
        response.append({**flink_es[i],**dsm_es[i]})
    return response
    #return [{**flink_es[i],**dsm_es[i]} for i in range(len(flink_es))]]"""


async def aggregated_data_by_platform_partner(from_time, to_time, group_on, metric_type):
    mapping = {"device_platform": "platform", "content_partner": "provider"}
    # print(Metrices_name.metric_mapping.value)
    flink, dsm = await asyncio.gather(
        get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metric_mapping.value[metric_type][0],
                                                                     {"group_on": group_on}, from_time, to_time,
                                                                     'flink_es'),
        get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metric_mapping.value[metric_type][1],
                                                                     {"group_on": mapping[group_on]}, from_time,
                                                                     to_time, 'dsm_es'))
    flink_es, keys_flink, dsm_es, keys_dsm = flink[0], flink[1], dsm[0], dsm[1]
    # print(flink_es)
    # print(dsm_es)
    response = []
    print(dsm_es)
    print(flink_es)
    print(set(keys_flink) - set(keys_dsm))
    for i in set(keys_dsm).intersection(set(keys_flink)):
        response.append({**flink_es[i], **dsm_es[i]})
    return response
    # return [{**flink_es[i],**dsm_es[i]} for i in range(len(flink_es))]]


if __name__ == "__main__":
    # Aggregated Data Grouped By Either Content Partner Or Device Platform
    # For Experience Insight Screen
    pool = ResourcePool(15)
    print(pool.acquire())

    """
    from_time=str((datetime.today() - timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S"))
    to_time=str((datetime.today() - timedelta(days=4)).strftime("%Y-%m-%d %H:%M:%S"))
    import time
    #to_time=str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))
    #from_time=str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))
    time_start=time.time()
    print(from_time)
    print(to_time)
    print(asyncio.run(aggregated_data_by_platform_partner(from_time,to_time,"content_partner")))
    print("Time Lapsed",time.time()-time_start)
    #print(aggregated_data_by_platform_partner(from_time,to_time,"content_partner"))
    """

    """
    # Get Percentage Change For All Metrices
    # For Home Screen Top Bar,and Home Screen Analysis Section
    to_time=str((datetime.today() - timedelta(days=50)).strftime("%Y-%m-%d %H:%M:%S"))
    from_time_24hrs=str((datetime.today() - timedelta(days=49)).strftime("%Y-%m-%d %H:%M:%S"))
    from_time_48hrs=str((datetime.today() - timedelta(days=48)).strftime("%Y-%m-%d %H:%M:%S"))
    print(percentage_change(to_time,from_time_24hrs,from_time_48hrs))
    asyncio.run(percentage_change(to_time,from_time_24hrs,from_time_48hrs))
    """
    """
    #extracting graph data for metrices on flink elastic search
    filters={
        "metricname": "average_bitrate",
        "content_partner": [],
        "device_model": [],
        "device_platform": ["IOS","ANDROID"],
        "content_type": [],
        "cdn": [],
        "location": [],
        "aggregation_interval": "1d"
    }
    to_time=from_time=str((datetime.today() - timedelta(days=40)).strftime("%Y-%m-%dT%H:%M:%S"))
    from_time=str((datetime.today() - timedelta(days=50)).strftime("%Y-%m-%dT%H:%M:%S"))
    print(to_time)
    print(from_time)
    print(metric_graphs_flink_es(from_time,to_time,filters))
    """

    """
    mapping={"device_platform":"platform","content_partner":"provider"}
    #extracting graph data for metrices on dsm elastic search
    filters={
        "metricname": "ended_plays_per_unique_devices",
        "provider": [],
        "device_model": [],
        "platform": ["Android","IOS","WEb"],
        "content_type": [],
        "cdn": [],
        "location": [],
        "aggregation_feild":"device_id",
        "aggregation_interval": "1d"
    }
    #to_time='2022-03-31T10:50:28.000000'
    #from_time='2022-03-30T10:50:28.000000'
    to_time=from_time=str((datetime.today() - timedelta(days=4)).strftime("%Y-%m-%dT%H:%M:%S"))
    from_time=str((datetime.today() - timedelta(days=5)).strftime("%Y-%m-%dT%H:%M:%S"))
    print(metric_graphs_dsm_es(from_time,to_time,filters))
    """
    """
    # Get Last X hours Change For [FLINK_ES/DSM_ES]
    to_time=str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))
    from_time=str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))
    print(get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_dsm_es.value,{"content_partner":""},from_time,to_time,'dsm_es'))
    """
