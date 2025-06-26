
def generate_query(start_time, stop_time, filters, device_platform, aggregation_type):
    """
    Generate's Query V1
    1) Having comparably high latency
    """
    if len(start_time) != 0:
        # ,"lt":start_time}}}]
        filter = [{"range": {"dts_es": {"lte": stop_time, "gt": start_time}}}]
    else:
        filter = []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i != "device_platform":
            if len(filters[i]) > 0:
                if i == "content_partner":
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
    if len(filters["device_platform"]) > 0:
        if device_platform.lower()=="chrome":
            device_platform="web"
        filter.append(
            {"terms": {"device_platform": [device_platform.lower()]}})
    filter = list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"] = "10m"
    query = {"_source":"false","aggs": {
        "selected_dates": {
            "filter": {
                "bool": {
                    "must": filter
                }
            },
            "aggs": {
                "time_stamp": {
                    "date_histogram": {
                        "field": "dts_es",
                        "fixed_interval": filters["aggregation_interval"]
                    },
                    "aggregations": {
                        "average_value": {
                            aggregation_type: {
                                "field": "m_"+filters["metricname"]

                            }
                        }
                    }
                }
            }
        }
    }}
    # print(query)
    
    return query


def generate_query_for_groupby(start_time, stop_time, filters, aggregation_type, metricname):
    """
        Generate's Query for experience insight screen    
    """
    if len(start_time) != 0:
        # ,"lt":start_time}}}]
        filter = [{"range": {"dts_es": {"lte": stop_time, "gt": start_time}}}]
    else:
        filter = []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i != "group_on":
            if len(filters[i]) > 0:
                if i == "content_partner":
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
    filter = list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"] = "24h"
    query = {"aggs": {
        "selected_dates": {
            "filter": {
                "bool": {
                    "must": filter
                }
            },
            "aggs": {
                "time_stamp": {
                    "date_histogram": {
                        "field": "dts_es",
                        "fixed_interval": "24h"
                    },
                    "aggregations": {
                        "average_value": {
                            aggregation_type: {
                                "field": "m_"+metricname

                            }
                        }
                    }
                }
            }
        }
    }}
    # print(query)
    return query


def generate_query_for_groupby_percentage_change(start_time, stop_time, filters, aggregation_type, metricname, time_agg):
    """
    Generates Query For Percentage Change Endpoints
    """
    if len(start_time) != 0:
        # ,"lt":start_time}}}]
        filter = [{"range": {"dts_es": {"lte": stop_time, "gt": start_time}}}]
    else:
        filter = []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i != "group_on" and i != "interval":
            if len(filters[i]) > 0:
                if i == "content_partner":
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
    filter = list(filter)
    #if "aggregation_interval" not in filters.keys():
    #    filters["aggregation_interval"] = time_agg
    query = {"aggs": {
        "selected_dates": {
            "filter": {
                "bool": {
                    "must": filter
                }
            },
            "aggs": {
                "time_stamp": {
                    "date_histogram": {
                        "field": "dts_es",
                        "fixed_interval": time_agg
                    },
                    "aggregations": {
                        "average_value": {
                            aggregation_type: {
                                "field": "m_"+metricname

                            }
                        }
                    }
                }
            }
        }
    }}
    # print(query)
    return query


def generate_query_for_groupby1(start_time, stop_time, filters, aggregation_type):
    """
    Generates Query For 24hr_change endpoints
    """
    if len(start_time) != 0:
        # ,"lt":start_time}}}]
        filter = [{"range": {"dts_es": {"lte": stop_time, "gt": start_time}}}]
    else:
        filter = []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i != "group_on":
            if len(filters[i]) > 0:
                if i == "content_partner":
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
    filter = list(filter)
    #if "aggregation_interval" not in filters.keys():
    #    filters["aggregation_interval"] = "24h"
    query = {
        "query": {
            "bool": {
                "filter": filter,
                "must": [
                    {
                        "match_all": {

                        }
                    }
                ],
                "must_not": [],
                "should": []
            }
        },
        "from": 0,
        "size": 10000,
        "sort": [],
        "aggs": {
            "time_stamp": {
                "date_histogram": {
                    "field": "dts_es",
                    "fixed_interval": "24h"
                },
                "aggregations": {
                    "average_value": {
                        aggregation_type: {
                            "field": "m_"+filters["metricname"]

                        }
                    }
                }
            }
        }
    }
    # print(query)
    return query
