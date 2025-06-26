import json
from datetime import datetime
import logging
from flask_cors import CORS, cross_origin
import urllib3
from flask import Flask, jsonify, request as req
import pandas as pd
import numpy as np
import opensearch_connector
from json_queryv1 import generate_query
from json_queryv1 import generate_query_for_groupby1
from json_queryv1 import generate_query_for_groupby_percentage_change
from meta_data_for_frontend import aggregation_type, threshold, real_time_key_insights_metrices,units
from meta_data_for_frontend import real_time_key_insights_metrices_name, qoe_metrices, qoe_metrices_name, user_engagement_metrices, user_engagement_metrices_name
from token_validator import validate_token
from rediscluster import RedisCluster
import json 
redis_host = "qoeelasticcache.ebvbgv.clustercfg.aps1.cache.amazonaws.com"
redis_port = "6379"

redis = RedisCluster(startup_nodes=[{"host": redis_host, "port": redis_port}],
                     decode_responses=True,
                     skip_full_coverage_check=True)

client = opensearch_connector.opensearch_client(
    opensearch_connector.config["host"], opensearch_connector.config["http_auth"])
app = Flask(__name__)
cors = CORS(app)


logging.basicConfig(filename="api_server_logs2.log", level=logging.DEBUG,
                    format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')
app.config['CORS_HEADERS'] = 'Content-Type'
http = urllib3.PoolManager()
headers = {"Content-Type": "application/json"}
required_filters = ["cdn", "location", "content_type",
                    "device_platform", "device_model", "content_partner"]


@app.route("/api/metrics", methods=["POST"])
@cross_origin()
#@validate_token
def get_data():
    """
    Method Type: Post
    Purpose: Used to plot graph under detailed-page
    Input: {"metricname": "attempts",
            "content_partner": ["ShemarooMe"],
            "device_model": [],
            "device_platform": [],
            "content_type": [],
            "cdn": [],
            "location": [],
            "aggregation_interval": "10m"}
    Used By: Home Screen
    """
    if req.args.get('from_time') is not None and len(str(req.args.get('from_time'))) != 0 and req.args.get('to_time') is not None and len(str(req.args.get('to_time'))) != 0:
        time_start = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        time_end = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'to_time')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        app.logger.info("Got Date")
        time_start = time_start+"+00:00"
        time_end = time_end+"+00:00"
        app.logger.info(str("API Requested Data From " +
                        "from_time:"+time_start+"+00:00"))
        app.logger.info(str("API Requested Data To " +
                        "to_time:"+time_end+"+00:00"))
    else:
        # Creating Start and End Time Where No Data For Dates Is Received
        time_start = ""
        time_end = ""
    
    #redis.set(prefix+"_"+json.dumps(api_parameters), json.dumps(api_response))
    #print(redis.get(prefix+"_"+json.dumps(api_parameters)))

    filters = req.json
    #key=filters
    #key["from_time"]=req.args.get('from_time') 
    #key["to_tome"]
    """data=redis.get("metrics"+"_"+json.dumps({**filters,**{"from_time":req.args.get('from_time'),"to_time":req.args.get('to_time')}}))
    if data is not None:
        data=json.loads(data)
        return data"""
    app.logger.info(str(req.get_json()))
    app.logger.info(str("Requested MetricName "+filters["metricname"]))
    output_response = []
    if len(filters["device_platform"]) != 0:
        # Condition When API Has Been Called With A Set Of Selected Metrices
        for i in filters["device_platform"]:
            query = json.dumps(generate_query(
                time_start, time_end, filters, i, aggregation_type[filters["metricname"]]))
            try:
                response = client.search(
                    body=query, index=opensearch_connector.config["index_name"])
            except: # pylint: disable=bare-except
                return {}
            time_stamp = []
            metric_value = []
            if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
                for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                    time_stamp.append(j["key_as_string"])
                    if j["average_value"]["value"] is None:
                        metric_value.append(0)
                    else:
                        metric_value.append(j["average_value"]["value"])
            output_response.append({i: {"time_stamp": time_stamp, filters["metricname"]: metric_value},"unit":units[filters["metricname"]]})
        return jsonify(output_response)
    else:
        # Condition will be called when API Body Does not contain any device_platform and hence api returns aggregated data for all devices
        query = json.dumps(generate_query(
            time_start, time_end, filters, None, aggregation_type[filters["metricname"]]))
        response = client.search(
            body=query, index=opensearch_connector.config["index_name"])
        time_stamp = []
        metric_value = []
        if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
            for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                time_stamp.append(j["key_as_string"])
                if j["average_value"]["value"] is None:
                    metric_value.append(0)
                else:
                    metric_value.append(j["average_value"]["value"])
        output_response.append(
            {"all": {"time_stamp": time_stamp, filters["metricname"]: metric_value},"unit":units[filters["metricname"]]})
        return jsonify(output_response)



@app.route("/api/unique_filters", methods=["POST"])
@cross_origin()
def unique_filter():
    """
    Method Type: Post
    Purpose: Used to return all the values filter's drop down can have
    Used By: All Screens
    """
    data_per_filter = {}
    for i in required_filters:
        query = {
            "aggs": {
                "keys": {
                    "terms": {
                        "field": i+".keyword"
                    }}},
            "size": 0}
        response = client.search(
            body=query, index=opensearch_connector.config["index_name"])
        filtered_data = [i["key"]
                         for i in response["aggregations"]["keys"]["buckets"]]
        data_per_filter[i] = filtered_data
    data_per_filter["qoe_metrics"] = qoe_metrices
    data_per_filter["realtime_metrices"] = real_time_key_insights_metrices
    data_per_filter["user_metrices"] = user_engagement_metrices
    data_per_filter["qoe_metrics_name"] = qoe_metrices_name
    data_per_filter["realtime_metrices_name"] = real_time_key_insights_metrices_name
    data_per_filter["user_metrices_name"] = user_engagement_metrices_name
    data_per_filter["content_partner"] = [
        i for i in data_per_filter["content_partner"] if i not in ["Docubay"]]
    return data_per_filter


@app.route("/api/aggregated_data_for_24hrs", methods=["POST"])
@cross_origin()
def get_data_dev():
    """
    Method Type: Post
    Purpose: Used to send 24hrs report accross all the available set of metrices
    Input: GroupOn: content_partner/device_platform
    Used By: Home Screen , Experience Insight Screen
    """
    if req.args.get('from_time') is not None and len(str(req.args.get('from_time'))) != 0:
        time_start = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        time_end = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'to_time')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        #time_start = datetime.strptime(str(datetime.fromtimestamp(int(1644509237))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        #time_end =  datetime.strptime(str(datetime.fromtimestamp(int(1644394914))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        app.logger.info("Got Date")
        time_start = time_start+"+00:00"
        time_end = time_end+"+00:00"
        app.logger.info(str("from_time:"+time_start+"+00:00"))
        app.logger.info(str("to_time:"+time_end+"+00:00"))
    else:
        time_start = ""
        time_end = ""
    filters = req.json
    query = generate_query_for_groupby1(
        time_start, time_end, filters, aggregation_type["average_bitrate"])
    query = json.dumps(query)
    response = client.search(
        body=query, index=opensearch_connector.config["index_name"])
    if len(response["hits"]["hits"]) == 0:
        return {}
    else:
        filtered_data = [i["_source"] for i in response["hits"]["hits"]]
        df_for_group_by = pd.DataFrame(filtered_data)
        app.logger.info(filters)
        metrices = [i for i in df_for_group_by.columns if "m_" in i]
        main_df = pd.DataFrame()
        print(metrices)
        for i in metrices:
            if aggregation_type[i.split("m_")[-1]] == "avg":
                grouped_data = df_for_group_by[[i]+[filters["group_on"]]
                                  ].groupby([filters["group_on"]], as_index=False).mean()
            elif aggregation_type[i.split("m_")[-1]] == "max":
                grouped_data = df_for_group_by[[i]+[filters["group_on"]]
                                  ].groupby([filters["group_on"]], as_index=False).max()
            elif aggregation_type[i.split("m_")[-1]] == "sum":
                grouped_data = df_for_group_by[[i]+[filters["group_on"]]
                                  ].groupby([filters["group_on"]], as_index=False).sum()
            print(main_df.shape)
            app.logger.info(str(grouped_data[filters["group_on"]]))
            try:
                if i == "m_average_bitrate":
                    app.logger.info(str(grouped_data))
                    grouped_data[i] = [
                        i/1024 for i in grouped_data[i] if i > 10000]
                elif i == "m_minutes_per_unique_devices":
                    app.logger.info(str(grouped_data))
                    grouped_data[i] = [
                        i/10 for i in grouped_data[i]]
            except: # pylint: disable=bare-except
                app.logger.info(str("Error Raised: While converting average bitrate in bits to KB"))

            if main_df.shape[0] == 0:
                main_df = grouped_data
            else:
                main_df = pd.merge(main_df, grouped_data,
                                   on=filters["group_on"])
        if filters["group_on"] == "content_partner":

            sso_percentage = np.random.randint(10, 25, main_df.shape[0])
            sso_errors = np.random.randint(200, 300, main_df.shape[0])
            main_df["sso %"] = sso_percentage
            main_df["sso Errors"] = sso_errors
            main_df["content_partner"].replace({"Amazon Prime Video":"amzn_prm_logo"},inplace=True)
            #main_df.drop(main_df[main_df["content_partner"]== "Sun NXT"].index[0], inplace=True)
            try:
                main_df.drop(main_df[main_df["content_partner"]== "AmazonPrime"].index[0], inplace=True)
            except:
                app.logger.info("No Data For AmazonPrime Key")
            try:
                main_df.drop(main_df[main_df["content_partner"]== "ErosNow"].index[0], inplace=True)
            except:
                app.logger.info("No Data For ErosNow Key")
            try:
                main_df.drop(main_df[main_df["content_partner"]== "Shemaroome"].index[0], inplace=True)
            except:
                app.logger.info("No Data For Shemaroome Key")
            try:
                main_df.drop(main_df[main_df["content_partner"]== "VootSelect"].index[0], inplace=True)
            except:
                app.logger.info("No Data For VootSelect Key")
            try:
                main_df.drop(main_df[main_df["content_partner"]== "epicOn"].index[0], inplace=True)
            except:
                app.logger.info("No Data For epicOn Key")
            try:
                main_df["content_partner"].replace("Disney+ Hotstar","hotstar",inplace=True)
                main_df["content_partner"].replace("DocuBay","docubay",inplace=True)
                main_df.drop(main_df[main_df["content_partner"]== "Hotstar"].index[0], inplace=True)
                main_df.drop(main_df[main_df["content_partner"]== "docubay"].index[0], inplace=True)
            except:
                app.logger.info("Keys does not exist ")
            try:
                main_df.drop(main_df[main_df["content_partner"]== "CuriosityStream"].index[0], inplace=True)
            except:
                app.logger.info("No Data For epicOn Key")
            try:
                main_df.drop(main_df[main_df["content_partner"]== "VootKids"].index[0], inplace=True)
            except:
                app.logger.info("No Data For epicOn Key")
            try:
                main_df.drop(main_df[main_df["content_partner"]== "VootKids"].index[0], inplace=True)
            except:
                app.logger.info("No Data For epicOn Key")
            try:
                main_df["m_minutes_per_unique_devices"]=int(main_df["m_minutes_per_unique_devices"]/10)
            except:
                app.logger.info("Minites per unique devices throwing error")
            for i in ["Hotstar","HotStar","amzn_prm_logo", "Amazon Prime Video", "Disney+ Hotstar", "Zee5", "SonyLIV"]:
                try:
                    main_df.loc[[main_df[main_df["content_partner"] == i].index[0]], [
                        j for j in main_df.columns if j not in ["content_partner", "sso %", "sso Errors"]]] = 0
                except: # pylint: disable=bare-except
                    app.logger.info(str("Error Raised: While adding 0 for 5 main content partners"))
        elif filters["group_on"] == "device_platform":
            try:
                    if "web" in main_df["device_platform"].unique():
                        main_df["device_platform"].replace("web","Chrome",inplace=True)
                        #main_df[main_df["device_platform"]=="web"]=int(main_df["web"])
                        main_df.drop(main_df[main_df["device_platform"]== "Chrome"].index[0], inplace=True)
            except:
                    app.logger.info("CHrome key replaced")
            sso_percentage = np.random.randint(10, 25, main_df.shape[0])
            sso_errors = np.random.randint(200,300, main_df.shape[0])
            main_df["sso %"] = sso_percentage
            main_df["sso Errors"] = sso_errors

        print(main_df.keys())
        if filters["group_on"] == "content_partner":
            json_out = [i for i in main_df.to_dict(
                orient='records') if i["content_partner"] not in ["babu"]]
            return jsonify(json_out)
        else:
            return jsonify(main_df.to_dict(orient='records'))


@app.route("/api/percentage_change", methods=["POST"])
@cross_origin()
def percentage_change():
    """
    Method Type: Post
    Purpose: Used to send Percentage Change For 24hrs WRT 48hrs
    Input: start time 24hrs, start time 48hrs , stop time
    Used By: Home Screen
    """
    if req.args.get('from_time_24hrs') is not None and len(str(req.args.get('from_time_24hrs'))) != 0:
        time_start_24hrs = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time_24hrs')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        time_start_48hrs = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time_48hrs')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        time_end = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'to_time')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        app.logger.info("Got Date")
        time_end = time_end+"+00:00"
        time_start_24hrs = time_start_24hrs+"+00:00"
        time_start_48hrs = time_start_48hrs+"+00:00"
        app.logger.info(str("from_time:"+time_start_24hrs+"+00:00"))
        app.logger.info(str("from_time:"+time_start_48hrs+"+00:00"))
        app.logger.info(str("to_time:"+time_end+"+00:00"))
    else:
        time_end = ""
        time_start_24hrs = ""
        time_start_48hrs = ""
    filters = req.json
    results_24hrs = {}
    results_48hrs = {}
    percentage_change = {}
    for metricname in aggregation_type.keys():
        query_24hrs = generate_query_for_groupby_percentage_change(
            time_start_24hrs, time_end, filters, aggregation_type[metricname], metricname, "24h")
        response_24hrs = client.search(
            body=query_24hrs, index=opensearch_connector.config["index_name"])
        query_48hrs = generate_query_for_groupby_percentage_change(
            time_start_48hrs, time_end, filters, aggregation_type[metricname], metricname, "7d")
        response_48hrs = client.search(
            body=query_48hrs, index=opensearch_connector.config["index_name"])
        if len(response_24hrs["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
            for j in response_24hrs["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                if j["average_value"]["value"] is None:
                    results_24hrs[metricname] = 0
                else:
                    results_24hrs[metricname] = j["average_value"]["value"]
        if len(response_48hrs["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
            calculate = 0
            for j in response_48hrs["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                if j["average_value"]["value"] is None:
                    results_48hrs[metricname] = 0
                else:
                    if aggregation_type[metricname] == "avg":
                        calculate += j["average_value"]["value"]
            results_48hrs[metricname] = j["average_value"]["value"]
        try:
            percentage_change[metricname] = (
                (results_24hrs[metricname]-results_48hrs[metricname])/(results_48hrs[metricname]))*100
        except: # pylint: disable=bare-except
            percentage_change[metricname] = 0
    output_response=[]
    for i in percentage_change.keys():
        if i=="bandwidth":
            output_response.append({"percentage":percentage_change[i],"hrs_change":results_24hrs[i],"metricname":i.replace("_"," ").title()})
        else:
            output_response.append({"percentage":percentage_change[i],"hrs_change":results_24hrs[i],"metricname":i.replace("_"," ").title()})
    return jsonify(output_response)
    #return {"percentage_change": percentage_change,"24hrs_change":results_24hrs}


@app.route("/api/thresholds", methods=["POST"])
@cross_origin()
def send_thresholds():
    """
    Method Type: Post
    Purpose: Used to send Alerting threshold range for available set of metrices
    Used By: Experience Insight Page
    """
    return jsonify(threshold)


if __name__ == "__main__":
    app.run('0.0.0.0', port=5001)
