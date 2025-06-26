from config import settings, logger, SSO_ERROR
import pandas as pd
from db_wrapper import OpenSearchClient, AwsDynamodb, RedisConnection, AwsS3
from refurbishing_code_v2 import Aggregation_type, Metrices_name
from datetime import datetime

# Todo: remove if not used
open_search_obj = OpenSearchClient()


def query_builder_experience_insight_dsm_es_ended_plays(group_on, from_time, to_time):
    query = {
        "_source": "false",
        "size":0,
        "aggs": {
            "selected_dates": {
                "filter": {
                    "bool": {
                        "must": [
                            {
                                "range": {
                                    "last_report_time": {
                                        "gte": from_time, "lte": to_time
                                    }
                                }
                            }, {"terms": {
                                "last_event_state.keyword": ["STOPPED"]
                            }}
                        ]
                    }
                },
                "aggs": {
                    "provider": {
                        "terms": {
                            "field": group_on + ".keyword",
                            "size": settings.DSL_MAX_BUCKET_SIZE
                        },
                        "aggs": {
                            "m_ended_plays":{
                                "value_count":{
                                    "field":"last_event_state.keyword"
                                }
                            },
                            "m_ended_plays_per_unique_devices": {
                                "cardinality":{
                                    "field":"device_id.keyword"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    return query


def query_builder_experience_insight_dsm_es_unqiue_devices_viewers(group_on, from_time, to_time):
    query = {
            "_source": "false",
            "aggs": {
                "selected_dates": {
                    "filter": {
                        "bool": {
                            "must": [
                                {
                                    "range": {
                                        "last_report_time": {
                                        "gte": from_time,
                                        "lte": to_time
                                        }
                                    }
                                }
                            ]
                        }
                    },
                    "aggs": {
                        "provider": {
                            "terms": {
                                "field": group_on + ".keyword",
                                "size": settings.DSL_MAX_BUCKET_SIZE
                            },
                            "aggs": {
                                "m_unique_devices": {
                                    "cardinality": {
                                        "field": "device_id.keyword"
                                    }
                                },
                                "m_unique_viewers": {
                                    "cardinality": {
                                    "field": "current_session_id.keyword"
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    return query


def query_builder_experience_insight_flink_es(metrics_of_interest, group_on, from_time, to_time):
    metrics = {}
    for metricname in metrics_of_interest:
        metrics[metricname] = {Aggregation_type[metricname].value: {'field': metricname}} if Aggregation_type[metricname].value !='avg' else {"weighted_avg": {"value": {"field": metricname}, "weight": {"field":"m_total_payload_count"}}}
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
                                        "gte": from_time, "lte": to_time
                                    }
                                }
                            }
                        ]
                    }
                },
                "aggs": {
                    "provider": {
                        "terms": {
                            "field": group_on + ".keyword",
                            "size": settings.DSL_MAX_BUCKET_SIZE
                        },
                        "aggregations": metrics
                            }
                        }
                    }
        }
    }
    return query


def query_builder_experience_insight_dsm_es(metrics_of_interest, group_on, to_time, from_time):
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


def get_concurrent_play_data(group_on, from_time, to_time):
    if group_on == "device_platform":
        dsm_group_on = "platform"
    elif group_on == "content_partner":
        dsm_group_on = "provider"
    else:
        dsm_group_on = group_on
    query = {
                "size":0,
                "query":{
                    "range":{"last_report_time":{"gte": from_time, "lte": to_time}}
                },
                "aggs":{
                    "cont_provider":{
                    "terms":{"field":f"{dsm_group_on}.keyword","size":10000},
                    "aggs":{
                        "time_stamp":{
                            "date_histogram":{
                                "field":"last_report_time",
                                "fixed_interval":"1h"
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
                        "avg_plays":{
                            "max_bucket":{
                                "buckets_path":"time_stamp>average_value"
                            }
                        }
                    }
                }
            }
        }
    logger.info(f"get_concurrent_play_data query : {query}")
    response = open_search_obj.search_data(query=query, index_name=settings.CONCURRENT_PLAYS_INDEX_NAME)
    logger.info(f"get_concurrent_play_data response : {response}")
    return response


def experience_insight_screen_dsm(group_on, from_time, to_time, metrics_of_interest):
    if group_on in ["platform", "provider"]:
        if len(metrics_of_interest) == 0:
            return []
        if "unique" in metrics_of_interest[0] and 'm_ended_plays_per_unique_devices' not in metrics_of_interest[0]:
            query = query_builder_experience_insight_dsm_es_unqiue_devices_viewers(group_on, from_time, to_time)
        else:
            query = query_builder_experience_insight_dsm_es_ended_plays(group_on, from_time, to_time)
        logger.debug(f"experience_insight_screen_dsm query : {query}")

        response = open_search_obj.search_data(query=query, index_name=settings.DSM_ES_INDEX_NAME)
        logger.debug(f"experience_insight_screen_dsm response : {response}")
    else:
        return {}
    result = []
    for i in response["aggregations"]["selected_dates"]["provider"]["buckets"]:
        metric_data = {}
        metric_data[group_on] = i["key"]
        for j in i:
            if j in metrics_of_interest:
                metric_data[j] = i[j]["value"]
        result.append(metric_data)
    return result


def experience_insight_screen_flink(group_on, from_time, to_time, metrics_of_interest):
    if group_on in ["device_platform", "content_partner"]:
        query = query_builder_experience_insight_flink_es(metrics_of_interest, group_on, from_time, to_time)
        logger.debug(f"experience_insight_screen_flink query : {query}")
        response = open_search_obj.search_data(query=query, index_name=settings.FLINK_ES_INDEX_NAME)
        logger.debug(f"experience_insight_screen_flink response : {response}")
    else:
        return {}
    result = []
    for i in response["aggregations"]["selected_dates"]["provider"]["buckets"]:
        metric_data = {}
        metric_data[group_on] = i["key"]
        for j in i.keys():
            if j in metrics_of_interest:
                metric_data[j] = i[j]["value"] if j !='m_total_minutes_watched' else i[j]["value"]/60
        result.append(metric_data)
    #TSH-767 new patch for concurrent play
    concurrent_response = get_concurrent_play_data(group_on, from_time, to_time)
    concurrent_response_buckets = concurrent_response["aggregations"]["cont_provider"]["buckets"]
    for res in result:
        for concurrent_play in concurrent_response_buckets:
            if concurrent_play["key"] == res[group_on]:
                res["m_concurrent_plays"] = float(round(concurrent_play["avg_plays"]["value"], 2))
    return result


def iterdict(response):
    for item in response:
        if type(item) is dict:
            for k, v in item.items():
                if isinstance(v, dict):
                    data = list(v.values())
                    item[k] = data[0]
                    iterdict(v)
    return response


def get_sso_error_data(group_on, from_time, to_time):

    filters = dict()
    if group_on == "content_partner":
        group_on = "provider"
    else:
        group_on = "platform"
    filters["from_time"] = from_time
    filters["to_time"] = to_time
    filters["ErrorCode"] = SSO_ERROR
    # obj = AwsDynamodb()
    # query = obj.sso_query_builder(filters)
    # logger.debug(f"dynamo db query: {query}")
    # data = obj.execute_query(query=query)
    # response = data.get("Items", [])
    # Below code commented for testing purpose
    # response = obj.get_records(settings.DYNAMODB_OUTAGE_BANNER_TABLE, filters)
    # logger.debug(f"dynamo db response: {response}")
    # iterdict(response)

    # Below code commented for testing purpose
    # df = pd.DataFrame(response)
    # df = {}
    # if df.empty:
    return {}
    # else:
    #     group_by = df.groupby(group_on)
    #     dic_data = group_by.size()
    #     return dic_data.to_dict()


def create_presigned_url(object_name, expiration=3600,bucket_name=settings.CONTENT_PARTNER_LOGO_BUCKET_NAME):
    """Generate a presigned URL to share an S3 object
        :param bucket_name: string
        :param object_name: string
        :param expiration: Time in seconds for the presigned URL to remain valid
        :return: Presigned URL as string. If error, returns None.
    """
    obj = AwsS3()
    try:
        obj.client.head_object(Bucket=bucket_name, Key=object_name)
    except Exception as e:
        logger.exception(f"Object does not exist in s3 object_name:{object_name} exception: {e}")
        object_name = settings.CONTENT_PARTNER_DEFAULT_LOGO
    try:
        response = obj.client.generate_presigned_url('get_object', Params={'Bucket': settings.CONTENT_PARTNER_LOGO_BUCKET_NAME, 'Key': object_name}, ExpiresIn=expiration)
    except Exception as e:
        logger.exception(f"Not able to get object from s3 object_name:{object_name} exception: {e}")
        response = None
    return response


def set_provider_logo(data):
    redis = RedisConnection()
    content_partner_logos = redis.client.hgetall("partner_icon_content_partner_22222")
    provider = data.get("content_partner", "")
    logo = content_partner_logos.get(provider, settings.CONTENT_PARTNER_DEFAULT_LOGO)
    presigned_url = create_presigned_url(logo, expiration=604800)
    data["content_partner_logo"] = presigned_url
    return data


def experience_insight_screen_dsl(group_on, from_time, to_time, metric_type, epoch_start_time, epoch_end_time):
    mapping = {"device_platform": "platform", "content_partner": "provider"}
    metrics_of_interest = Metrices_name.metric_mapping.value[metric_type]
    if len(metrics_of_interest) > 1:
        dsm = experience_insight_screen_dsm(mapping[group_on], from_time, to_time, metrics_of_interest[1])
        flink = experience_insight_screen_flink(group_on, from_time, to_time, metrics_of_interest[0])
        result = []
        sso_error_result = get_sso_error_data(group_on, epoch_start_time, epoch_end_time)
        logger.debug(f"sso_error_result result : {sso_error_result}")
        total_errors = sum(int(x) for x in sso_error_result.values())
        for i in flink:
            for j in dsm:
                device_array = j.copy()
                if i[group_on] == j[mapping[group_on]]:
                    device_array.pop(mapping[group_on])
                    data = {**i, **device_array}
                    if "device_platform" in data.keys():
                        sso_errors_count = int(sso_error_result.get(data["device_platform"], 0))
                        if total_errors > 0:
                            sso_error_percentage = sso_errors_count / total_errors * 100
                        else:
                            sso_error_percentage = 0
                        data["sso_errors_count"] = sso_errors_count
                        data["sso_error_percentage"] = sso_error_percentage
                    elif "content_partner" in data.keys():
                        sso_errors_count = int(sso_error_result.get(data["content_partner"], 0))
                        if total_errors > 0:
                            sso_error_percentage = sso_errors_count / total_errors * 100
                        else:
                            sso_error_percentage = 0
                        data["sso_errors_count"] = sso_errors_count
                        data["sso_error_percentage"] = sso_error_percentage
                        data = set_provider_logo(data)
                    else:
                        data["sso_errors_count"] = 0
                        data["sso_error_percentage"] = 0
                    result.append(data)
        return result
    else:
        flink = experience_insight_screen_flink(group_on, from_time, to_time, metrics_of_interest[0])
        sso_error_result = get_sso_error_data(group_on, epoch_start_time, epoch_end_time)
        total_errors = sum(int(x) for x in sso_error_result.values())
        for data in flink:
            if "device_platform" in data.keys():
                sso_errors_count = int(sso_error_result.get(data["device_platform"], 0))
                if total_errors > 0:
                    sso_error_percentage = sso_errors_count / total_errors * 100
                else:
                    sso_error_percentage = 0
            elif "content_partner" in data.keys():
                sso_errors_count = int(sso_error_result.get(data["content_partner"], 0))
                if total_errors > 0:
                    sso_error_percentage = sso_errors_count / total_errors * 100
                else:
                    sso_error_percentage = 0
                data = set_provider_logo(data)
            else:
                sso_errors_count = 0
                sso_error_percentage = 0
            data["sso_errors_count"] = sso_errors_count
            data["sso_error_percentage"] = sso_error_percentage

        return flink


if __name__ == "__main__":
    logger.debug(experience_insight_screen_dsl("device_platform", "2022-04-28T00:00:00.000000", "2022-04-29T00:00:00.000000",
                                        "user_engagement_metrices"))
