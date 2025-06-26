from httplib2 import Response
from refurbishing_code import *
from flask import Flask, jsonify, request as req
from flask_cors import CORS, cross_origin
import logging

# Todo: compare and remove after merging the changes

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
logging.basicConfig(filename="test_api_server_logs.log", level=logging.INFO,format=f'%(asctime)s %(levelname)s %(name)s %(threadName)s : %(message)s')


@app.route("/api/metrics", methods=["POST"])
@cross_origin()
#@validate_token
def graph_data():
    if req.args.get('from_time') is not None and len(str(req.args.get('from_time'))) != 0 and req.args.get('to_time') is not None and len(str(req.args.get('to_time'))) != 0:
        time_start = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        time_end = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'to_time')))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')       
        body=req.json
        if body["metricname"] not in ["unique_devices","unique_viewers","ended_plays","ended_plays_per_unique_devices"]:
            """
            FORMAT
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
            """
            #response=metric_graphs_flink_es(time_start,time_end,body)
            #print(response)
            return jsonify(metric_graphs_flink_es(time_start,time_end,body))
        elif body["metricname"] in ["unique_devices","unique_viewers","ended_plays","ended_plays_per_unique_devices"]:
            """
            FORMAT
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
            """
            aggregation_feild={"unique_devices":"device_id","unique_viewers":"current_session_id","ended_plays":"last_event_state","ended_plays_per_unique_devices":"device_id"}
            filters={
                "metricname": body["metricname"],
                "provider": body["content_partner"],
                "device_model": [],
                "platform":body["device_platform"],
                "content_type": [],
                "cdn": [],
                "location": [],
                "aggregation_feild":aggregation_feild[body["metricname"]],
                "aggregation_interval": "1d"
            }
            #response=metric_graphs_dsm_es(from_time,to_time,filters)
            return jsonify(metric_graphs_dsm_es(time_start,time_end,filters))

    else:
        return {}



@app.route("/api/percentage_change", methods=["POST"])
@cross_origin()
#@validate_token
def day_percentage_change():
    if req.args.get('from_time_24hrs') is not None and len(str(req.args.get('from_time_24hrs'))) != 0 and req.args.get('from_time_48hrs') is not None and len(str(req.args.get('from_time_48hrs'))) != 0 and  req.args.get('to_time') is not None and len(str(req.args.get('to_time'))) != 0:
        time_start_24hrs = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time_24hrs')))), '%Y-%m-%d %H:%M:%S')
        time_start_48hrs = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time_48hrs')))), '%Y-%m-%d %H:%M:%S')
        time_end = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'to_time')))), '%Y-%m-%d %H:%M:%S')
        print(time_start_24hrs)
        return jsonify(percentage_change(time_end,time_start_24hrs,time_start_48hrs))
    else:
        return jsonify([])



@app.route("/api/aggregated_data_for_24hrs", methods=["POST"])
@cross_origin()
#@validate_token
def aggregated_data_for_24hrs():
    if req.args.get('from_time') is not None and len(str(req.args.get('from_time'))) != 0 and req.args.get('to_time') is not None and len(str(req.args.get('to_time'))) != 0:
        time_start = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'from_time')))), '%Y-%m-%d %H:%M:%S')
        time_end = datetime.strptime(str(datetime.fromtimestamp(int(req.args.get(
            'to_time')))), '%Y-%m-%d %H:%M:%S')
        return jsonify(asyncio.run(aggregated_data_by_platform_partner(time_start,time_end,req.json["group_on"])))
    else:
        return jsonify([])



if __name__ == "__main__":
    app.run('0.0.0.0', debug=True,port=5006)

