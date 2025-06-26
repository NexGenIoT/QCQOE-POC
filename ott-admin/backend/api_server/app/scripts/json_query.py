def generate_query(start_time,stop_time,filters,device_platform):
    if len(start_time)!=0:
        filter=[{"range": {"dts_es": {"lte": stop_time,"gt":start_time}}}] #,"lt":start_time}}}]
    else:
        filter=[]
    for i in filters:
        if i!="metricname" and i!="aggregation_interval" and i!="device_platform":
            if len(filters[i])>0:
                filter.append({
                    "terms":{
                        i:[j.lower() for j in filters[i]]
                    }
                })
    if len(filters["device_platform"])>0:
        filter.append({"terms":{"device_platform":[device_platform.lower()]}})
    filter=list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"]="10m"
    query={"_source":"false",
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
                    "fixed_interval": filters["aggregation_interval"]
                },
                "aggregations": {
                    "average_value": {
                        "avg": {
                            "field": "m_"+filters["metricname"]
                            
                        }
                    }
                }
            }
        }
    }
    #print(query)
    return query

def generate_query_for_groupby(start_time,stop_time,filters):
    if len(start_time)!=0:
        filter=[{"range": {"dts_es": {"lte": stop_time,"gt":start_time}}}] #,"lt":start_time}}}]
    else:
        filter=[]
    for i in filters:
        if i!="metricname" and i!="aggregation_interval" and i!="group_on":
            if len(filters[i])>0:
                filter.append({
                    "terms":{
                        i:[j.lower() for j in filters[i]]
                    }
                })
    filter=list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"]="10m"
    query={
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
                    "fixed_interval": filters["aggregation_interval"]
                },
                "aggregations": {
                    "average_value": {
                        "avg": {
                            "field": "m_"+filters["metricname"]
                            
                        }
                    }
                }
            }
        }
    }
    #print(query)
    return query
