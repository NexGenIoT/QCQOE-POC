import awswrangler as wr
import boto3
from config import settings, logger, app, REQUIRED_FILTERS
import json
from dashboard_wrapper import DashboardServiceWrapper
from datetime import datetime
from db_wrapper import AwsS3, AwsEvent, AwsDynamodb, AwsLambda, OpenSearchClient, SqliteDb, RedisConnection
from experience_insight import experience_insight_screen_dsl
from mitigation_wrapper import Mitigation
from metrics_wrapper import MetricsWrapper
from pydentic_config import MetricesName, ErrorCodes, Deeplinked_Partners
from refurbishing_code_v2 import metric_graphs_dsm_es, metric_graphs_flink_es
from redis_wrapper import ElasticCacheUtility
from utils.meta_data_for_frontend import real_time_key_insights_metrices_name, qoe_metrices, qoe_metrices_name, \
    user_engagement_metrices, user_engagement_metrices_name, MITIGATION_STATUS, UEI_CONDITION, threshold, \
    real_time_key_insights_metrices
from utils.ics_utility import validate_ueids
from boto3.dynamodb.conditions import Attr
import pandas as pd
import time
from decimal import Decimal
from fastapi import Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

MITIGATION_LAMBDA_FUNCTION = settings.MITIGATION_LAMBDA_FUNCTION

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/metrics")
async def graph_data(to_time: int, from_time: int, request: Request):
    try:
        # redis_client = ElasticCacheUtility()
        if to_time and from_time:
            time_start = datetime.strptime(str(datetime.utcfromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')
            time_end = datetime.strptime(str(datetime.utcfromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')
            body = await request.json()
            api_name = "metrics"
            metrices_name = "m_" + body["metricname"]
            query_duration = {"from_time": from_time, "to_time": to_time}
            # cache_query = redis_client.cache_key_generator(api_name, query_duration, body)
            # cache = redis_client.search_cache(cache_query)
            cache=None
            if cache is not None:
                return JSONResponse(jsonable_encoder(json.loads(cache)))
            else:
                if metrices_name and metrices_name in MetricesName.metrices_from_dsm_es.value:
                    """
                    FORMAT
                    filters={
                        "metricname": "ended_plays_per_unique_devices",
                        "provider": [],
                        "device_model": [],
                        "platform": ["Android", "iOS", "FireTV", "Web", "FIRESTICK"],
                        "content_type": [],
                        "cdn": [],
                        "location": [],
                        "aggregation_feild":"device_id",
                        "aggregation_interval": "1d"
                    }
                    """
                    aggregation_feild = {"unique_devices": "device_id", "unique_viewers": "current_session_id",
                                         "ended_plays": "last_event_state", "ended_plays_per_unique_devices": "device_id"}
                    filters = {
                        "metricname": body["metricname"],
                        "provider": body["content_partner"],
                        "device_model": [],
                        "platform": body["device_platform"],
                        "content_type": [],
                        "cdn": [],
                        "location": body["location"],
                        "aggregation_feild": aggregation_feild[body["metricname"]],
                        "aggregation_interval": body.get("aggregation_interval", "1d")
                    }
                    response = metric_graphs_dsm_es(time_start, time_end, filters, "platform")
                    # redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                    return JSONResponse(jsonable_encoder((response)))
                elif metrices_name and metrices_name in MetricesName.metrices_from_flink_es.value or metrices_name in MetricesName.real_time_key_insights_metrices_flink.value:
                    if metrices_name == "m_concurrent_plays":
                        filters = {
                            "metricname": body["metricname"],
                            "provider": body["content_partner"],
                            "device_model": [],
                            "platform": body["device_platform"],
                            "content_type": [],
                            "cdn": [],
                            "location": body["location"],
                            "aggregation_feild": "m_concurrent_pay",
                            "aggregation_interval": body.get("aggregation_interval", "1d")
                        }
                        return JSONResponse(jsonable_encoder(metric_graphs_dsm_es(time_start, time_end, filters, "platform")))
                    response = metric_graphs_flink_es(time_start, time_end, body, "device_platform")
                    # redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                    return JSONResponse(jsonable_encoder(response))
                else:
                    return JSONResponse(jsonable_encoder({"message": "Bad request, Invalid metrics name."}))

        else:
            return {}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.post("/api/unique_filters")
async def unique_filter():
    """
    Method Type: Post
    Purpose: Used to return all the values filter's drop down can have
    Used By: All Screens
    """
    data_per_filter = {}
    try:
        open_search_client_obj = OpenSearchClient()
        # redis_client = RedisConnection()
        # content_partners = redis_client.client.hgetall('enums_config_content_partner_11111')
        for i in REQUIRED_FILTERS:
            query = {
                "aggs": {
                    "keys": {
                        "terms": {
                            "field": i + ".keyword",
                            "size": 100
                        }}},
                "size": 100}
            # response = open_search_client_obj.search_data(query=query, index_name=settings.FLINK_ES_INDEX_NAME)
            # filtered_data = [i["key"] for i in response["aggregations"]["keys"]["buckets"] if i["key"]]
            # data_per_filter[i] = filtered_data
        content_partner = data_per_filter.get("content_partner", [])
        # data_per_filter["content_partner"] = list(sorted(set([content_partners.get(partnername) for partnername in content_partner if not "".join(partnername.split()).lower() in Deeplinked_Partners and partnername in content_partners.keys()])))
        # zee5, hotstar, prime, sonyliv
        data_per_filter["device_platform"] = ["Android", "iOS", "FireTV", "Web", "Firestick","AndroidSmartTv"]
        data_per_filter["qoe_metrics"] = qoe_metrices
        data_per_filter["realtime_metrices"] = real_time_key_insights_metrices + ["video_plays_and_failures"]
        data_per_filter["user_metrices"] = user_engagement_metrices
        data_per_filter["qoe_metrics_name"] = qoe_metrices_name
        data_per_filter["realtime_metrices_name"] = real_time_key_insights_metrices_name + ["Video Plays And Failures"]
        data_per_filter["user_metrices_name"] = user_engagement_metrices_name
        data_per_filter["uei_condition"] = UEI_CONDITION
        data_per_filter["mitigation_status"] = [i.upper() for i in MITIGATION_STATUS]
        # data_per_filter["error_codes"] = redis_client.client.hgetall(settings.REDIS_KEY_FOR_ERROR_CODE_ENUM) #{i.value: i.name for i in ErrorCodes}
        api_name = "unique_filters"
        query_duration = {}
        # redis_client = ElasticCacheUtility()
        # cache_query = redis_client.cache_key_generator(api_name, query_duration, {})
        # cache = redis_client.search_cache(cache_query)
        cache = None
        if cache is not None:
            return JSONResponse(jsonable_encoder(json.loads(cache)))
        else:
            # redis_client.cache_response(api_name, cache_query, data_per_filter, cache_expiry=60)
            return JSONResponse(jsonable_encoder(data_per_filter))
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return JSONResponse(jsonable_encoder([]))

# Needs to be uncomment the redis cache for this API
@app.post("/api/aggregated_data_for_24hrs")
async def aggregated_data_for_24hrs(to_time: int, from_time: int, request: Request):
    try:
        body = await request.json()
        # redis_client = ElasticCacheUtility()
        if to_time and from_time:
            time_start = datetime.strptime(str(datetime.utcfromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')
            time_end = datetime.strptime(str(datetime.utcfromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')
            # time_start = datetime.strptime(str(datetime.fromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S')
            # time_end = datetime.strptime(str(datetime.fromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S')
            api_name = "aggregated_data_for_24hrs"
            query_duration = {"from_time": from_time, "to_time": to_time}
            # cache_query = redis_client.cache_key_generator(api_name, query_duration, body)
            # cache = redis_client.search_cache(cache_query)
            cache = None
            if cache is not None:
                return JSONResponse(jsonable_encoder(json.loads(cache)))
            else:
                response = experience_insight_screen_dsl(body["group_on"], time_start, time_end,
                                                         body["metric_type"], from_time, to_time)
                # response = set_provider_logo(response)
                # redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                return JSONResponse(jsonable_encoder(response))
        else:
            return JSONResponse(jsonable_encoder([]))
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return JSONResponse(jsonable_encoder([]))


@app.post("/api/v2/percentage_change")
async def percentage_change_v2(from_time_24hrs: int, from_time_48hrs: int, to_time: int, request: Request):
    try:
        body = await request.json()
        obj = DashboardServiceWrapper()
        # redis_client = ElasticCacheUtility()
        if from_time_24hrs and from_time_48hrs and to_time:
            time_start_24hrs = str(datetime.utcfromtimestamp(int(float(from_time_24hrs))).isoformat())
            time_start_48hrs = str(datetime.utcfromtimestamp(int(float(from_time_48hrs))).isoformat())
            time_end = str(datetime.utcfromtimestamp(int(to_time)).isoformat())
            logger.info(f" time_start_24hrs : {time_start_24hrs}")
            logger.info(f" time_start_48hrs : {time_start_48hrs}")
            logger.info(f" time_end : {time_end}")
            device_platform = body.get("device_platform", "")
            if device_platform and device_platform not in ["Android", "iOS", "FireTV", "Web", "Firestick","AndroidSmartTv"]:
                return JSONResponse(jsonable_encoder({"message": "Bad request, Invalid device platform."}))

            api_name = "percentage_change"
            query_duration = {"from_time_24hrs": from_time_24hrs, "from_time_48hrs": from_time_48hrs,
                              "to_time": to_time}
            # cache_query = redis_client.cache_key_generator(api_name, query_duration, body)
            # cache = redis_client.search_cache(cache_query)
            cache=None
            if cache is not None:
                return JSONResponse(jsonable_encoder(json.loads(cache)))
            else:
                response = obj.process_percent_change(time_end, time_start_24hrs, time_start_48hrs, body)
                # redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                return JSONResponse(jsonable_encoder(response))
        else:
            return JSONResponse(jsonable_encoder([]))
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return JSONResponse(jsonable_encoder([]))


# Todo: cache this?
@app.post("/api/thresholds")
async def send_thresholds(request: Request):
    """
    Method Type: Post
    Purpose: Used to send Alerting threshold range for available set of metrices
    Used By: Experience Insight Page
    """
    return JSONResponse(jsonable_encoder(threshold))


@app.post("/api/favorite")
async def favorite(request: Request):
    """
    Method Type: Post
    Purpose: Used to send Favorite Screen's Data
    Used By: Favorite Screen
    [ "Average Bitrate","Concurrent Plays" ]
    {"favorite":["video_start_failures", "exit_before_video_starts", "successful_plays", "attempts"]}
    """
    s3_obj = AwsS3()
    body = await request.json()
    s3_obj.put_s3_object(body=json.dumps(body), key="favorite_metrics.json")
    return {"status": 200}


@app.get("/api/get_favorite")
async def get_favorite(request: Request):
    s3_obj = AwsS3()
    obj = s3_obj.get_s3_object(key="favorite_metrics.json")
    meta_data = json.loads(obj['Body'].read())
    return JSONResponse(jsonable_encoder(meta_data))


@app.post("/mitigation/list_user_groups")
async def list_user_groups():
    dynamodb_client = AwsDynamodb()
    resp = dynamodb_client.execute_query("SELECT group_name from mitigation_user_group;")
    return JSONResponse(jsonable_encoder({"user_groups": pd.DataFrame(resp["Items"]).group_name.apply(
        lambda x: x[list(x.keys())[0]]).unique().tolist()}))


@app.get("/api/get_local_intelligence_status")
async def get_local_intelligence_status():
    try:
        s3_client = AwsS3()
        obj = s3_client.get_s3_object(key="local_intelligence_state.json")
        meta_data = json.loads(obj['Body'].read())
        return JSONResponse(jsonable_encoder(meta_data))
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder({"message": f"Internal server error."}))


@app.get("/mitigation/get_users")
async def get_user_groups(request: Request):
    """
        GET
        Params={
            "group_name":"test1"
            }
        Response={
            "users":[]
            }
    """
    table_name = "mitigation_user_group"
    dynamodb_client = AwsDynamodb()
    body = await request.json()
    query = f"select * from {table_name} where group_name=\'{body['group_name']}\';"
    resp = dynamodb_client.execute_query(query)
    return {"users": resp["Items"]}


@app.post("/mitigation/create_user_group")
async def create_user_group(request: Request):
    """
        POST
        Params={"add_users":[{"device_id":"xyzq",
                       "group_name":"test1",
                       "rmn":""}]}
        Response={"Status":200}
    """
    table_name = "mitigation_user_group"
    dynamodb_client = AwsDynamodb()
    body = await request.json()
    for i in body["add_users"]:
        params = {
            'TableName': table_name,
            'Item': {
                "device_id": {'S': str(i["device_id"])},
                "group_name": {'S': str(i["group_name"])},
                "rmn": {'S': str(i["rmn"])},
            }
        }
        response = dynamodb_client.client.put_item(**params)
    return {"Status": 200}


@app.post("/api/get_startup_buffer")
async def get_startup_buffer(request: Request):
    results = []
    iterator = 500
    wrapper_obj = MetricsWrapper()
    mapping = await request.json()
    with open("resp.txt", "w") as f:
        f.write(str(mapping))
    mapping = mapping["device_ids"]
    list_of_udid = list(mapping.values())
    current_session_id = list(mapping.keys())

    for i in range(0, len(list_of_udid), 500):
        udids = list_of_udid[i:i + iterator]
        query = wrapper_obj.get_query(udids=udids)
        response = wrapper_obj.execute_query(query)
        results += response
    results_all_time = pd.DataFrame(results)
    results_all_time.columns = ["device_id", "startup_buffer_duration_all_time"]
    try:
        from_time = datetime.today().replace(hour=0, minute=0, second=0).strftime("%Y-%m-%d"'T'"%H:%M:%S")
        to_time = datetime.today().strftime("%Y-%m-%d"'T'"%H:%M:%S")
        query = wrapper_obj.get_query(from_time=from_time, to_time=to_time)
        results_24hrs = pd.DataFrame(wrapper_obj.execute_query(query))
        results_24hrs.columns = ["device_id", "startup_buffer_duration_today"]
        final = results_all_time.merge(results_24hrs, left_on="device_id", right_on="device_id")
    except Exception as e:
        results_24hrs = pd.DataFrame(list_of_udid)
        results_24hrs.columns = ["device_id"]
        results_24hrs["startup_buffer_duration_today"] = [1 for i in results_24hrs["device_id"].values]
        final = results_all_time.merge(results_24hrs, left_on="device_id", right_on="device_id")
        logger.exception(f"Exception : {str(e)}")
    results = []
    for i in range(0, len(list_of_udid), iterator):
        session_ids = current_session_id[i:i + iterator]
        query = wrapper_obj.get_query(session_ids=session_ids, group_on="current_session_id")
        results += wrapper_obj.execute_query(query)

    results_last_session = pd.DataFrame(results)
    results_last_session.columns = ["current_session_id", "startup_buffer_last_session"]
    results_last_session["device_id"] = [str(mapping[i]) for i in results_last_session["current_session_id"].values]
    results_last_session.drop("current_session_id", inplace=True, axis=1)

    final = final.merge(results_last_session, left_on="device_id", right_on="device_id")
    final.fillna(0, inplace=True)
    return json.loads(final.to_json(orient="records"))


@app.post("/api/apply_manual_mitigation")
async def manual_mitigation(request: Request):
    """
    Method Type: Post
    Purpose: Used to send Alerting threshold range for available set of metrices
    Used By: Experience Insight Page
    """
    api_response = {}
    try:
        lambda_client = AwsLambda()
        # Todo: use settings with env vars for this
        filters = await request.json()

        device_id = filters.get("DeviceID", [])
        if len(device_id) > 0 and '' not in device_id:
            result = lambda_client.invoke_function(function_name=MITIGATION_LAMBDA_FUNCTION,
                                                   invocation_type="RequestResponse", body=json.dumps(filters))
            logger.info(f" AWS lambda result: {result}")
            range = result['Payload'].read()
            api_response = json.loads(range)
        else:
            logger.info("Device id is empty")
            return {"Status_Code": 200}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder(api_response))


@app.post("/api/enable_disable_local_intelligence")
async def enable_disable_local_intelligence(request: Request):
    try:
        s3_client = AwsS3()
        body = await request.json()
        event_client = AwsEvent()
        if body["switch"] == "on":
            # Todo: use settings var
            s3_client.put_s3_object(body=json.dumps(body), key="local_intelligence_state.json")
            response = event_client.enable_event_rule(name="localintelligencetrigger")
            return {"status": str(response)}
        else:
            s3_client.put_s3_object(body=json.dumps(body), key="local_intelligence_state.json")
            response = event_client.disable_event_rule(name="localintelligencetrigger")
            return {"Status": str(response)}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder({"message": f"Internal server error."}))


@app.get("/api/get_local_intelligence_status")
async def get_local_intelligence_status():
    try:
        s3_client = AwsS3()
        obj = s3_client.get_s3_object(key="local_intelligence_state.json")
        meta_data = json.loads(obj['Body'].read())
        return JSONResponse(jsonable_encoder(meta_data))
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder({"message": f"Internal server error."}))


@app.post("/api/mitigation_history2")
async def mitigation_history2(request: Request):
    data = []
    try:
        filter = await request.json()
        dynamodb_client = AwsDynamodb()
        group_mitigation_id = filter.get("group_mitigation_id", "")
        data = dynamodb_client.get_single_filter_data("group_mitigation_id", group_mitigation_id)
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder(data))


@app.post("/api/mitigation_history3")
async def mitigation_history3(request: Request):
    data = []
    try:
        filter = await request.json()
        dynamodb_client = AwsDynamodb()
        device_id = filter.get("device_id", "")
        data = dynamodb_client.get_single_filter_data("device_id", device_id)
        return JSONResponse(jsonable_encoder(data))
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder(data))


@app.post("/api/old_sync_dynamodb")
async def old_sync_dynamodb():
    try:
        dynamodb_client = AwsDynamodb()
        data = dynamodb_client.get_all_records()
        df = pd.DataFrame(data)
        df["last_report_time"] = pd.to_datetime(df["last_report_time"].astype(int), unit="s")
        sqlite3_client = SqliteDb()
        disk_engine = sqlite3_client.disk_engine
        cur = sqlite3_client.cursor
        df.to_sql("dsm", disk_engine, if_exists="replace", index=False)
        for row in cur.execute(
                """SELECT group_mitigation_id, AVG(case when mitigation_status = "FIXED" then previous_uei end),AVG(case when mitigation_status = "FIXED" then current_uei end), count(distinct (case when mitigation_status = "FIXED" then session_id end)) from dsm GROUP BY group_mitigation_id"""
        ):
            if row[3] > 0:
                if row[1] == None:
                    try:
                        query = 'UPDATE mitigation_history_screen_level1 SET PreviousUEI=\'{}\' SET CurrentUEI=\'{}\' SET ImpactedSessions=\'{}\' WHERE GroupMitigationID=\'{}\''.format(
                            "NA", "NA", row[3], row[0])
                        resp = dynamodb_client.execute_query(query)
                    except:
                        logger.info("DEBUG:1")
                        continue
                elif row[0] != "NULL":
                    try:
                        query = 'UPDATE mitigation_history_screen_level1 SET PreviousUEI=\'{}\' SET CurrentUEI=\'{}\' SET ImpactedSessions=\'{}\' WHERE GroupMitigationID=\'{}\''.format(
                            row[1], row[2], row[3], row[0])
                        resp = dynamodb_client.execute_query(query)
                        logger.info(f"DEBUG:1  {str(resp)}")
                    except Exception as ex:
                        logger.info("DEBUG:1")
                        continue
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return {"Status": 200}

def convert_int_for_sqlite(value):
    max_value = 2**63 - 10
    if value > max_value:
        return max_value
    return value


def sync_dynamodb_utility():
    try:
        t0 = int(time.time())
        dynamodb_client = AwsDynamodb()
        data = dynamodb_client.get_all_records(settings.DSM_SERVICE_TABLE_NAME)
        df = pd.DataFrame(data)
        t1 = int(time.time())
        logger.debug(f"TIme for Dynamo in sync dynamo db : {t1-t0}")
        df["lrt"] = df["last_report_time"]
        df["last_report_time"] = pd.to_datetime(df["last_report_time"].astype(int), unit="s")
        t2 = int(time.time())
        logger.debug(f"TIme for Manuplating Data Frame in sync dynamo db : {t2-t1}")
        sqlite3_client = SqliteDb()
        disk_engine = sqlite3_client.disk_engine
        cur = sqlite3_client.cursor
        t3 = int(time.time())
        logger.debug(f"TIme for Creating Connection in sync dynamo db : {t3-t2}")
        nums_cols = list(df.select_dtypes(include=['int64', 'uint64']).columns)
        num_df = df.loc[:, nums_cols].apply(lambda col: col.apply(convert_int_for_sqlite), axis=0)
        non_nums_cols = list(df.select_dtypes(exclude=['int64', 'uint64']).columns)
        non_num_df = df.loc[:, non_nums_cols]
        df = pd.concat([num_df, non_num_df], axis=1)
        t4 = int(time.time())
        logger.debug(f"TIme for preparing Data Frame in sync dynamo db : {t4-t3}")
        df.to_sql("dsm", disk_engine, if_exists="replace", index=False)
        t5 = int(time.time())
        logger.debug(f"TIme for loading  Data in sqllite in sync dynamo db : {t5-t4}")
        data = cur.execute(
                """SELECT group_mitigation_id,
                 AVG(case when mitigation_status = "FIXED" then previous_uei end),
                 AVG(case when mitigation_status = "FIXED" then current_uei end),
                 count(distinct (case when mitigation_status = "FIXED" then current_session_id end)),
                 source,
                 count(distinct (current_session_id)),
                 lrt,
                 mitigation_state_timestamp
                  from dsm GROUP BY group_mitigation_id"""
        )
        t6 = int(time.time())
        logger.debug(f"TIme for Execute select query in sqllite in sync dynamo db : {t6-t5}")    
        for row in data:
            if row[3] > 0:
                try:
                    previous_uei = row[1] if row[0] != "NULL" else "NA"
                    current_uei = row[2] if row[0] != "NULL" else "NA"
                    resp = dynamodb_client.update_record("mitigation_history_screen_level1",
                                                         {"PreviousUEI": previous_uei, "CurrentUEI": current_uei,
                                                          "ImpactedSessions": row[3], "GroupMitigationID": row[0],
                                                          "AppliedOn": row[5], "Source": row[4], "Time_Stamp": row[7]})
                
                except Exception as ex:
                    continue
        t7 = int(time.time())
        logger.debug(f"TIme for sqllite query and dynamo update in sqllite in sync dynamo db : {t7-t6}")
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    else:
        logger.debug("Sync dynamodb execution done.")

@app.post("/api/sync_dynamodb")
async def sync_dynamodb(request: Request,bt: BackgroundTasks):
    bt.add_task(sync_dynamodb_utility)
    return {"Status": 200}


# @app.post("/api/mitigation_history1")
# async def mitigation_history1(from_time: int, to_time: int, request: Request):
#     data = []
#     try:
#         f_query = 'SELECT * FROM mitigation_history_screen_level1 WHERE Time_Stamp>' + str(
#         int(from_time)) + ' and Time_Stamp<=' + str(int(to_time)) + ''
#         dynamodb_client = AwsDynamodb()
#         logger.info(f" history1 query = {f_query}")
#         resp = dynamodb_client.execute_query(f_query)
#         logger.info(f" history1 response = {f_query}")
#         for i in range(len(resp["Items"])):
#             row_data = {}
#             for j in resp["Items"][i]:
#                 if j == "Time_Stamp":
#                     row_data[j] = int(float(resp["Items"][i][j][list(resp["Items"][i][j].keys())[0]]))
#                 elif j == "CurrentUEI" or j == "PreviousUEI":
#                     row_data[j] = round(float(resp["Items"][i][j][list(resp["Items"][i][j].keys())[0]]), 2)
#                 else:
#                     row_data[j] = resp["Items"][i][j][list(resp["Items"][i][j].keys())[0]]
#             data.append(row_data)
#         return JSONResponse(jsonable_encoder(data))
#     except Exception as e:
#         logger.exception(f"Exception : {str(e)}")
#     return JSONResponse(jsonable_encoder(data))

@app.post("/api/mitigation_history1")
async def mitigation_history1(from_time: int, to_time: int, request: Request):
    result = []
    try:
        dynamodb_client = AwsDynamodb()
        table = dynamodb_client.resource.Table('mitigation_history_screen_level1')
        query = table.scan(FilterExpression=Attr("Time_Stamp").gt(int(from_time)) & Attr("Time_Stamp").lt(int(to_time)))
        response = query['Items']
        for doc in response:
            if type(doc) is dict:
                data = {k:(int(v) if type(v) == Decimal else v) for k,v in doc.items()}
                if type(data) is dict:
                    result.append(data)
        while 'LastEvaluatedKey' in query:
            query = table.scan(FilterExpression=Attr("Time_Stamp").gt(int(from_time)) & Attr("Time_Stamp").lt(int(to_time)), ExclusiveStartKey=query['LastEvaluatedKey'])
            documents = query['Items']
            for doc in documents:
                if type(doc) is dict:
                    data = {k:(int(v) if type(v) == Decimal else v) for k,v in doc.items()}
                    if type(data) is dict:
                        result.append(data)
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder(result))

@app.get("/api/mitigation_history2/ai")
async def mitigation_history2_ai(gid: str):
    result = []
    try:
        dynamodb_client = AwsDynamodb()
        result = dynamodb_client.get_single_filter_data(key="GroupMitigationID",value=gid,table_name = 'mitigation_ai_records')
        if not result:
            result = []
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return JSONResponse(jsonable_encoder(result))

@app.post("/mitigation/metrics")
async def mitigation_metric(to_time: int, from_time: int, request: Request):
    try:
        mitigation_obj = Mitigation()
        filter = await request.json()
        redis_client = ElasticCacheUtility()
        api_name = "mitigation_metrics"
        query_duration = {"from_time": from_time, "to_time": to_time}
        cache_query = redis_client.cache_key_generator(api_name, query_duration, filter)
        cache = redis_client.search_cache(cache_query)
        if cache is not None:
            return JSONResponse(jsonable_encoder(json.loads(cache)))
        else:
            if from_time and to_time:
                time_start = datetime.utcfromtimestamp(from_time).strftime('%Y-%m-%d %H:%M:%S')
                time_end = datetime.utcfromtimestamp(to_time).strftime('%Y-%m-%d %H:%M:%S')
                logger.info("Got Date")
            else:
                # Creating Start and End Time Where No Data For Dates Is Received
                time_start = ""
                time_end = ""

            filter["aggregation_interval"] = "1min" if filter.get("aggregation_interval", "") == "1m" else filter.get(
                "aggregation_interval", "")
            if filter["metricname"] == "average_startup_buffer_length":
                response = mitigation_obj.average_startup_buffer(time_start, time_end,
                                                                 filter["aggregation_interval"],
                                                                 filter["device_platform"],
                                                                 filter["location"],
                                                                 filter.get("source",[]))
                redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                return JSONResponse(jsonable_encoder(response))
            elif filter["metricname"] == "average_rebuffering_buffer_length":
                response = mitigation_obj.average_rebuffering_buffer(time_start, time_end,
                                                                     filter["aggregation_interval"],
                                                                     filter["device_platform"],
                                                                     filter["location"],
                                                                     filter.get("source",[]))
                redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                return JSONResponse(jsonable_encoder(response))
            elif filter["metricname"] == "degradation_in_uei":
                response = mitigation_obj.degradation_in_uei(time_start, time_end, filter["aggregation_interval"],
                                                             filter["device_platform"], 
                                                             filter["location"],
                                                             filter.get("source",[]))
                redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                return JSONResponse(jsonable_encoder(response))
            elif filter["metricname"] == "improvement_in_uei":
                response = mitigation_obj.improvement_in_uei(time_start, time_end, filter["aggregation_interval"],
                                                             filter["device_platform"], 
                                                             filter["location"],
                                                             filter.get("source",[]))
                redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                return JSONResponse(jsonable_encoder(response))
            elif filter["metricname"] == "number_of_mitigations_applied":
                response = mitigation_obj.number_of_mitigations_applied(time_start, time_end,
                                                                        filter["aggregation_interval"],
                                                                        filter["device_platform"],
                                                                        filter["location"],
                                                                        filter.get("source",[]))
                redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
                return JSONResponse(jsonable_encoder(response))
            else:
                return JSONResponse(jsonable_encoder({"message": "Bad request, metric name."}))
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return JSONResponse(jsonable_encoder({"message": f"Internal server error."}))


@app.post("/api/validate_records")
async def mitigation_validate_record(request: Request):
    data = []
    try:
        filters = await request.json()
        ueids = filters.pop("ueids", [])
        if len(ueids) >= 1:
            filters["ueid"] = validate_ueids(ueids)
        redis_client = ElasticCacheUtility()
        api_name = "validate_records"
        query_duration = {}
        cache_query = redis_client.cache_key_generator(api_name, query_duration, filters)
        cache = redis_client.search_cache(cache_query)
        if cache is not None:
            return JSONResponse(json.loads(jsonable_encoder(json.loads(cache))))
        else:
            dynamodb_obj = AwsDynamodb()
            data = dynamodb_obj.key_finder_v2(filters=filters)
            redis_client.cache_response(api_name, cache_query, data, cache_expiry=60)
            return JSONResponse(json.loads(jsonable_encoder(data)))
    except Exception as e:
        logger.exception(f"Exception in validate_records : {str(e)}")
    return JSONResponse(jsonable_encoder(data))


@app.post("/api/rca")
async def rca(to_time: int, from_time: int, request: Request):
    dummy_data = '[{"RCA SESSION ID":1,"Total Anomolies Count":176,"Total Record Count":319,"Top impacted location":"New Delhi:70","Top impacted Content Partner":"Sheemaroome:60","Top impacted device platform":"Android:40","Possible RCA Report":"Bandwidth"},{"RCA SESSION ID":2,"Total Anomolies Count":159,"Total Record Count":325,"Top impacted location":"Noida:50","Top impacted Content Partner":"Sheemaroome:62","Top impacted device platform":"Android:39","Possible RCA Report":"VST"},{"RCA SESSION ID":3,"Total Anomolies Count":192,"Total Record Count":388,"Top impacted location":"Pune:90","Top impacted Content Partner":"Epicon:110","Top impacted device platform":"Web:86","Possible RCA Report":"Rebuffering Ratio"},{"RCA SESSION ID":4,"Total Anomolies Count":170,"Total Record Count":301,"Top impacted location":"New Delhi:70","Top impacted Content Partner":"Epicon:110","Top impacted device platform":"Android:40","Possible RCA Report":"Partner:Epicon"},{"RCA SESSION ID":5,"Total Anomolies Count":116,"Total Record Count":369,"Top impacted location":"Bhubaneswar:82","Top impacted Content Partner":"VootKids:77","Top impacted device platform":"IOS:110","Possible RCA Report":"Platform:IOS"},{"RCA SESSION ID":6,"Total Anomolies Count":105,"Total Record Count":392,"Top impacted location":"Chandigarh:76","Top impacted Content Partner":"Sheemaroome:60","Top impacted device platform":"Web:74","Possible RCA Report":"VST"},{"RCA SESSION ID":7,"Total Anomolies Count":125,"Total Record Count":296,"Top impacted location":"Noida:50","Top impacted Content Partner":"Sheemaroome:62","Top impacted device platform":"Android:39","Possible RCA Report":"Rebuffering Ratio"},{"RCA SESSION ID":8,"Total Anomolies Count":107,"Total Record Count":304,"Top impacted location":"Pune:90","Top impacted Content Partner":"Epicon:110","Top impacted device platform":"Android:48","Possible RCA Report":"Location:Pune"},{"RCA SESSION ID":9,"Total Anomolies Count":197,"Total Record Count":351,"Top impacted location":"Bhubaneswar:20","Top impacted Content Partner":"Epicon:110","Top impacted device platform":"IOS:92","Possible RCA Report":"Platform:Android"},{"RCA SESSION ID":10,"Total Anomolies Count":120,"Total Record Count":392,"Top impacted location":"Noida:54","Top impacted Content Partner":"Sheemaroome:62","Top impacted device platform":"Android:39","Possible RCA Report":"Partner:Sheemaroome"},{"RCA SESSION ID":11,"Total Anomolies Count":197,"Total Record Count":389,"Top impacted location":"New Delhi:78","Top impacted Content Partner":"Epicon:110","Top impacted device platform":"Android:40","Possible RCA Report":"Bandwidth"},{"RCA SESSION ID":12,"Total Anomolies Count":105,"Total Record Count":341,"Top impacted location":"Chandigarh:51","Top impacted Content Partner":"Sheemaroome:60","Top impacted device platform":"Android:77","Possible RCA Report":"VST"}]'
    try:
        if to_time and from_time:
            time_start = pd.to_datetime(from_time, unit="s")
            time_end = pd.to_datetime(to_time, unit="s")
            df = pd.read_json(dummy_data, orient="records")
            df["Timestamp"] = pd.date_range(time_start, time_end, freq="2H").tolist()[:12]
            return df.to_json(orient="records")
        else:
            return {}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.post("/api/anomalies")
async def anomalies(to_time: int, from_time: int, request: Request):
    try:
        if to_time and from_time:
            time_start = pd.to_datetime(from_time, unit="s")
            time_end = pd.to_datetime(to_time, unit="s")
            sql = "select * from anomalyParquet where anomaly_score>1  order by dts desc;"  # where dts='2022--7-27';"
            my_session = boto3.Session(region_name=settings.AWS_REGION_NAME,
                                       aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                       aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            df = wr.athena.read_sql_query(sql=sql, database="anomaly-destination", ctas_approach=True,
                                          boto3_session=my_session)
            df["dts"] = pd.to_datetime(df["dts"])
            df = df[(df.dts > time_start) & (df.dts <= time_end)]
            response = json.loads(df.drop("anomaly_explanation", axis=1).to_json(orient="records"))
            return json.dumps(response)
            # return JSONResponse(jsonable_encoder((response)))

        else:
            return {}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}

@app.get("/status")
async def heart_check_status():
    logger.debug(f"status is ok")
    return {"Status": 200}


# @app.on_event("startup")
# async def application_tearup():
#     await sync_dynamodb_utility()


@app.get("/{full_path:path}")
def handle_404_get(request: Request, full_path: str):
    if len(full_path) > 0:
        logger.debug(f"url not found")
    else:
        logger.debug(f"status is ok")
    return {"Status": 200}


@app.post("/{full_path:path}")
def handle_404_post(request: Request, full_path: str):
    if len(full_path) > 0:
        logger.debug(f"url not found")
    else:
        logger.debug(f"status is ok")
    return {"Status": 200}


if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host="127.0.0.1", port=8000, log_level="debug", reload=False)
