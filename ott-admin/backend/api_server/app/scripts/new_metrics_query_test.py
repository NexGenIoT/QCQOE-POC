import opensearch_connector

aws_access_key_id="AKIAWZG524Z4PKWJFIQU"
aws_secret_access_key=""
region="ap-south-1"

#PUT qoe_dev_state_6/_mapping {"properties":{"current_session_id":{"type":"text","fielddata":true}}}

client = opensearch_connector.opensearch_client(opensearch_connector.config2["host"], opensearch_connector.config2["http_auth"])


def new_metrics(agg_window,feild_name,metricname,agg_type,must_filters):
    query={'aggs': {'selected_dates': {'filter': {'bool': {'must': must_filters}}, 'aggs': {'time_stamp': {'date_histogram': {'field': 'last_report_time', 'fixed_interval': agg_window}, 'aggregations': {'average_value': {agg_type: {'field': feild_name}}}}}}}}
    print(query)
    response = client.search(body=query, index=opensearch_connector.config2["index_name"])
    time_stamp = []
    metric_value = []
    output_response = []
    ##print(response)
    if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
        for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
            time_stamp.append(j["key_as_string"])
            if agg_type!="terms":
                if j["average_value"]["value"] is None:
                    metric_value.append(0) # if by any chance value ="" or None 
                else:
                    metric_value.append(j["average_value"]["value"])
            else:
                metric_value.append(j["average_value"]["buckets"][0]["doc_count"])
    output_response.append({"all": {"time_stamp": time_stamp,metricname : metric_value}}) 
    return(output_response)

must_filters=[{'range': {'last_report_time': {'lte': '2022-03-31T10:50:28.000000', 'gt': '2022-03-30T10:50:28.000000'}}}]
print(new_metrics("1d","device_id","unique_devices","cardinality",must_filters))
print(new_metrics("1d","current_session_id","unique_viewers","cardinality",must_filters))
#must_filters=[{'range': {'last_report_time': {'lte': '2022-03-31T10:50:28.000000', 'gt': '2022-03-30T10:50:28.000000'}}},{"match":{"last_event_state":"SEEKED"}}]
content_watched=new_metrics("1d","seconds_watched","content_watched_in_sec","sum",must_filters)
buffering_faced=new_metrics("1d","rebuffering_duration","rebuffering_duration","sum",must_filters)
connection_induced_rebuffering=[]
time_stamp=[]
for i in range(len(content_watched[0]["all"]["time_stamp"])):
    time_stamp.append(content_watched[0]["all"]["time_stamp"][i])
    connection_induced_rebuffering.append(int(buffering_faced[0]["all"]["rebuffering_duration"][i])/(int(content_watched[0]["all"]["content_watched_in_sec"][i])+int(buffering_faced[0]["all"]["rebuffering_duration"][i])))
print([{"all":{"time_stamp":time_stamp,"connection_induced_rebuffering":connection_induced_rebuffering}}])
must_filters=[{'range': {'last_report_time': {'lte': '2022-03-31T10:50:28.000000', 'gt': '2022-03-30T10:50:28.000000'}}},{"match":{"last_event_state":"STOPPED"}}]
print(new_metrics("1d","last_event_state","ended_plays","value_count",must_filters))

print(new_metrics("1d","device_id","ended_plays_per_unqiue_device","terms",must_filters))
