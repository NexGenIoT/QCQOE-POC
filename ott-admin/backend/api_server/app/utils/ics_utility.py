from config import ContentPartners
from db_wrapper import OpenSearchClient
from typing import List
import hashlib
from utils.meta_data_for_frontend import aggregation_type, units


def get_provider_name(provider_name: str) -> str:
    provider_name_map = {
        "disney+ hotstar": ContentPartners.hotstar,
        "hotstar": ContentPartners.hotstar,

        "amazon prime video": ContentPartners.prime_video,
        "prime video": ContentPartners.prime_video,

        "docubay": ContentPartners.docubay,

        "voot select": ContentPartners.voot_select,
        "voot kids": ContentPartners.voot_kids,
        "vootkids": ContentPartners.voot_kids,
        "vootselect": ContentPartners.voot_select,

        "eros now": ContentPartners.eros_now,
        "erosnow": ContentPartners.eros_now,

        "zee5": ContentPartners.zee5,

        "sonyliv": ContentPartners.sonyliv,
        "sony liv": ContentPartners.sonyliv,

        "epic on": ContentPartners.epic_on,
        "epicon": ContentPartners.epic_on,

        "shemaroome": ContentPartners.shemaroo_me,
        "shemaroo me": ContentPartners.shemaroo_me,

        "hungamaplay": ContentPartners.hungama_play,
        "hungama play": ContentPartners.hungama_play,
        "hungama": ContentPartners.hungama_play,

        "curiosity stream": ContentPartners.curiosity_stream,
        "curiositystream": ContentPartners.curiosity_stream,

        "sun nxt": ContentPartners.sun_nxt,
        "sunnxt": ContentPartners.sun_nxt
    }

    result = provider_name_map.get(provider_name)
    if result is None:
        result = provider_name
        # Todo: send unknown provider names to a redis set for later analysis
    return result


def new_metrics(agg_window, field_name, metric_name, agg_type, must_filters):
    query = {'aggs': {'selected_dates': {'filter': {'bool': {'must': must_filters}}, 'aggs': {
        'time_stamp': {'date_histogram': {'field': 'last_report_time', 'fixed_interval': agg_window},
                       'aggregations': {'average_value': {agg_type: {'field': field_name}}}}}}}}
    opensearch_obj = OpenSearchClient()
    response = opensearch_obj.search_data(query=query)
    time_stamp = []
    metric_value = []
    output_response = []
    if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
        for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
            time_stamp.append(j["key_as_string"])
            if agg_type != "terms":
                if j["average_value"]["value"] is None:
                    metric_value.append(0)  # if by any chance value ="" or None
                else:
                    metric_value.append(j["average_value"]["value"])
            else:
                metric_value.append(j["average_value"]["buckets"][0]["doc_count"])
    output_response.append({"all": {"time_stamp": time_stamp, metric_name: metric_value}})
    return (output_response)


def metrics_from_dsm_store(metricname, time_end, time_start_24hrs, time_start_48hrs):
    results_24hrs = {}
    results_48hrs = {}
    if metricname == "unique_devices":
        must_filters_24hrs = [{'range': {'last_report_time': {'lte': time_end, 'gt': time_start_24hrs}}}]
        response_24hrs = new_metrics("2d", "device_id", metricname, "cardinality", must_filters_24hrs)
        must_filters_48hrs = [{'range': {'last_report_time': {'lte': time_start_24hrs, 'gt': time_start_48hrs}}}]
        response_48hrs = new_metrics("2d", "device_id", metricname, "cardinality", must_filters_48hrs)
    elif metricname == "unique_viewers":
        must_filters_24hrs = [{'range': {'last_report_time': {'lte': time_end, 'gt': time_start_24hrs}}}]
        response_24hrs = new_metrics("2d", "current_session_id", metricname, "cardinality", must_filters_24hrs)
        must_filters_48hrs = [{'range': {'last_report_time': {'lte': time_start_24hrs, 'gt': time_start_48hrs}}}]
        response_48hrs = new_metrics("2d", "current_session_id", metricname, "cardinality", must_filters_48hrs)
    elif metricname == "ended_plays":
        must_filters_24hrs = [{'range': {'last_report_time': {'lte': time_end, 'gt': time_start_24hrs}}},
                              {"match": {"last_event_state": "STOPPED"}}]
        must_filters_48hrs = [{'range': {'last_report_time': {'lte': time_start_24hrs, 'gt': time_start_48hrs}}},
                              {"match": {"last_event_state": "STOPPED"}}]
        response_24hrs = new_metrics("2d", "last_event_state", "ended_plays", "cardinality", must_filters_24hrs)
        response_48hrs = new_metrics("2d", "last_event_state", "ended_plays", "cardinality", must_filters_48hrs)
    else:
        must_filters_24hrs = [{'range': {'last_report_time': {'lte': time_end, 'gt': time_start_24hrs}}},
                              {"match": {"last_event_state": "STOPPED"}}]
        must_filters_48hrs = [{'range': {'last_report_time': {'lte': time_start_24hrs, 'gt': time_start_48hrs}}},
                              {"match": {"last_event_state": "STOPPED"}}]
        response_24hrs = new_metrics("2d", "device_id", "ended_plays_per_unique_devices", "terms", must_filters_24hrs)
        response_48hrs = new_metrics("2d", "device_id", "ended_plays_per_unique_devices", "terms", must_filters_48hrs)
    value = 0
    if len(response_24hrs[0]["all"][metricname]) == 0:
        results_24hrs[metricname] = 0
    else:
        for index, j in enumerate(response_24hrs[0]["all"][metricname]):
            if index == 0:
                value = j
            elif aggregation_type[metricname] == "sum" and index != 0:
                value = value + j
            elif aggregation_type[metricname] == "avg" and index != 0:
                value = (value + j) / 2
            elif aggregation_type[metricname] == "max" and index != 0:
                value = value if value > j else j
        if value != 0:
            results_24hrs[metricname] = value
        else:
            results_24hrs[metricname] = 0
    if len(response_48hrs[0]["all"][metricname]) == 0:
        results_48hrs[metricname] = 0
    else:
        for index, j in enumerate(response_48hrs[0]["all"][metricname]):
            if index == 0:
                value = j
            elif aggregation_type[metricname] == "sum" and index != 0:
                value = value + j
            elif aggregation_type[metricname] == "avg" and index != 0:
                value = (value + j) / 2
            elif aggregation_type[metricname] == "max" and index != 0:
                value = value if value > j else j
        if value != 0:
            results_48hrs[metricname] = value
        else:
            results_48hrs[metricname] = 0
    return results_24hrs[metricname], results_48hrs[metricname]


def validate_ueids(ueids: List) -> List:
    results = []
    for ueid in ueids:
        if len(ueid) == 10:
            d = hashlib.md5(ueid.encode("utf")).hexdigest()
            results.append(d)
        else:
            results.append(ueid)
    return results


def formation_of_percentage_change(percentage_change, results_48hrs, results_24hrs):
    output_response = []
    for i in percentage_change.keys():
        if i in ["video_start_failures", "video_playback_failures", "user_attrition", "rebuffering_percentage",
                 "rebuffering_ratio", "exit_before_video_starts"]:
            output_response.append({"percentage": percentage_change[i], "hrs_change_24hrs": results_24hrs[i],
                                    "metricname": i.replace("_", " ").title(),
                                    "hrs_change_48hrs": results_48hrs[i], "metric_key_name": i,
                                    "unit": units[i],
                                    "color": True if results_48hrs[i] > results_24hrs[i] else False})
        elif i in ["bandwidth", "unique_devices", "unique_viewers"]:
            output_response.append({"percentage": percentage_change[i], "hrs_change_24hrs": results_24hrs[i],
                                    "metricname": i.replace("_", " ").title(), "metric_key_name": i,
                                    "hrs_change_48hrs": results_48hrs[i] / 1000, "unit": units[i],
                                    "color": True if results_48hrs[i] < results_24hrs[i] else False})
        else:
            output_response.append({"percentage": percentage_change[i], "hrs_change_24hrs": results_24hrs[i],
                                    "metricname": i.replace("_", " ").title(), "metric_key_name": i,
                                    "hrs_change_48hrs": results_48hrs[i], "unit": units[i],
                                    "color": True if results_48hrs[i] < results_24hrs[i] else False})
    return output_response


def set_value_of_metric_name(response_hrs, result_hrs, metricname, aggregation_type):
    value = 0
    for index, j in enumerate(response_hrs["aggregations"]["selected_dates"]["time_stamp"]["buckets"]):
        if j["average_value"]["value"] is None:
            value = 0
        else:
            if index == 0:
                value = j["average_value"]["value"]
            elif aggregation_type[metricname] == "sum" and index != 0:
                value = value + j["average_value"]["value"]
            elif aggregation_type[metricname] == "avg" and index != 0:
                value = (value + j["average_value"]["value"]) / 2
            elif aggregation_type[metricname] == "max" and index != 0:
                value = max(value, j["average_value"]["value"])
    result_hrs[metricname] = value


def set_percentage(percentage_change, metricname, results_24hrs, results_48hrs):
    try:
        percentage_change[metricname] = ((results_24hrs[metricname] - results_48hrs[metricname]) / (
            results_48hrs[metricname])) * 100
    except ZeroDivisionError:  # pylint: disable=bare-except
        percentage_change[metricname] = 0
