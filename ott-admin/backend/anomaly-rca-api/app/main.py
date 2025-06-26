import sys
import os
current = os.path.dirname(os.path.realpath(__file__))
sys.path.append(os.path.dirname(current))
import numpy as np
import json
import pandas as pd
import datetime  
import time 

from fastapi import Request, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from decimal import Decimal

from app.controllers.config import settings, logger,redis,firehose_client
from app.controllers.db_wrapper import AWSDynamoDB, AWSAthena,AwsS3,SnsUtility
from app.controllers.schema import MitigationPlanSchema, RCASchema
from app.controllers.ai_mitigation import PrepareEmail,PrepareDynamoRecord,UtilityWrapper
from app.controllers.core_utility import generate_filter_labelledrecords,generate_filter_TotalDimensionsInRCA,anomaly_explanation_to_description,generate_query_v2,parse_pegination_request,generate_query_for_playbackfailure,default_value_df,data_validator_for_label_api,bucket_validator_for_label_api,sql_filter_generator,anomaly_score_conversion
from app.controllers import constants

app = FastAPI()

origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/GetAnomalyDetailsByID")
async def GetAnomalyDetailsByID(to_time: int, from_time: int, request: Request):
    try:
        logger.info("GetAnomalyDetailsByID")
        body = await request.json() if len(await request.body()) > 1  else {}
        max_items, execution_id, next_token = parse_pegination_request(body)
        from_time = datetime.datetime.utcfromtimestamp(from_time)
        to_time = datetime.datetime.utcfromtimestamp(to_time)
        sql = generate_query_v2(body,from_time,to_time)
        athena_obj = AWSAthena()
        response = athena_obj.get_athena_data(sql, max_items, execution_id, next_token,settings.ATHENA_TABLES_DB)
        execution_id, next_token = response["execution_id"], response["next_token"]
        df = athena_obj.parse_query_response(response, body)
        df = default_value_df(df)
        if 'groupby' not in body.keys():
            df['anomaly_description'] = df.apply(anomaly_explanation_to_description,axis=1)
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response, "execution_id":execution_id, "next_token": next_token}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.post("/api/GetDetailedAnomalyRecords")
async def GetDetailedAnomalyRecords(to_time: int, from_time: int,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        body = anomaly_score_conversion(body,'Athena')
        from_time = datetime.datetime.utcfromtimestamp(from_time)
        to_time = datetime.datetime.utcfromtimestamp(to_time)
        sql = f"""
                Select * from anomalyparquet where anomaly_id IN (
                    Select anomaly_id from anomalyparquet where dts between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}' {sql_filter_generator(body.get('filters',{}),where_cond=True)}
                    except 
                    Select anomaly_id from qoe_anomaly_playback_label_records )
            """
        logger.info("-----------------------------------------------")
        logger.info(f"sql : {sql}", )
        athena_obj = AWSAthena()
        df = athena_obj.get_full_athena_data(sql,settings.ATHENA_TABLES_DB)
        df = default_value_df(df)
        df = df.drop(['uploadtime', 'userid'], axis=1)
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.post("/api/GetDetailedRCARecords")
async def GetDetailedRCARecords(to_time: int, from_time: int,upper_threshold:float,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        from_time = datetime.datetime.utcfromtimestamp(from_time)
        to_time = datetime.datetime.utcfromtimestamp(to_time)
        sql = f"""
                Select * from rca2 where rca_unique_id IN (
                    Select rca_unique_id from rca2 where batch_time between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}' and upper_threshold >= {float(upper_threshold)} {sql_filter_generator(body.get('filters',{}),where_cond=True)}
                    except 
                    Select rca_unique_id from qoe_rca_label_records )   
            """
        athena_obj = AWSAthena()
        df = athena_obj.get_full_athena_data(sql,settings.ATHENA_TABLES_DB)
        df = df.drop(['type'], axis=1)
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.post("/api/GetAnomalySummary")
async def GetAnomalySummary(to_time: int, from_time: int, request: Request, page_size: int = 50, next_iteration_id: str = None):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        body = anomaly_score_conversion(body,'Dynamo')
        if to_time and from_time:
            result = []
            time_start = str(datetime.datetime.strptime(str(datetime.datetime.utcfromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')).replace("T", " ")
            time_end = str(datetime.datetime.strptime(str(datetime.datetime.utcfromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')).replace("T", " ")
            filters = {"dts": ["_range",[time_start,time_end]], "is_approved": ["_neq",1]}
            filters.update(body.get('filters',{}))
            logger.debug(f"filters : {filters}")
            obj = AWSDynamoDB()
            response, next_iteration_id = obj.get_filtered_records(settings.ANOMALY_SUMMARY_TABLE_NAME, filters, page_size, next_iteration_id)
            for record in response:
                record["anomaly_description"] = anomaly_explanation_to_description(record)
                record["errorcode"] = record.get("errorcode","-")
                record["error_count"] = record.get("error_count","-")
                result.append(record)
            return {'Message': 'Success', "StatusCode": 200, "size": len(result), "next_iteration_id": next_iteration_id, "data": result}
        else:
            return {}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.post("/api/PushLabeledDataRecordsRCA")
async def PushLabeledDataRecordsRCA(request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        userid = body["userid"]
        uploadtime = body["upload_time"]
        if isinstance(body["records"],list):
            df = pd.DataFrame.from_records(body["records"])
            df.reset_index(drop=True)
            logger.info(list(df.columns))
            df.columns = [x.lower() for x in df.columns]
            dynamo_obj = AWSDynamoDB()
            response = dynamo_obj.get_records(settings.DDB_RCA_BUCKET)
            allowed_rca_bucket_values =[i["bucket_name"] for i in response]
            logger.info(f"allowed_rca_bucket_values {allowed_rca_bucket_values}")
            if len(df.index) > 0 and sorted(list(df.columns)) == sorted(constants.cols_required_rca) and set(df['is_approved'].unique()).issubset(set(constants.allowed_approved_values_rca)) and set(df['rca_bucket'].unique()).issubset(set(allowed_rca_bucket_values)):
                df['uploadtime'],df['userid'] = uploadtime,userid
                for bucket in df['rca_bucket'].unique():
                    redis.hset(f'qoe_used_rca',bucket,"True")
                records = list()
                for i in df.to_dict(orient='records'):
                    records.append({'Data':json.dumps(i)})
                logger.info(f"records: {records}")
                logger.info(list(df.columns))
                result = firehose_client.put_record_batch(DeliveryStreamName=settings.PUSH_LABEL_RCA,Records=records)
                return {'Message':'Success',"StatusCode":200} if result['ResponseMetadata']['HTTPStatusCode'] == 200 else {'Message':'Firehose Error',"StatusCode":400}
            else:
                error_dict = {'Message':'Invalid Records',"StatusCode":400}
                error_dict = data_validator_for_label_api(df,constants.cols_required_rca,list(df.columns),constants.allowed_approved_values_rca,error_dict,rca=True)
                error_dict = bucket_validator_for_label_api(df,allowed_rca_bucket_values,error_dict)
                return error_dict
        else:
            return {'Message':'Invalid Body',"StatusCode":400}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message':'Invalid Request',"StatusCode":400}


@app.post("/api/PushLabeledDataRecords")
async def PushLabeledDataRecords(request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        userid = body["userid"]
        uploadtime = body["upload_time"]
        if isinstance(body["records"],list):
            df = pd.DataFrame.from_records(body["records"])
            df.reset_index(drop=True)
            df.columns = [x.lower() for x in df.columns]
            if len(df.index) > 0 and sorted(list(df.columns)) == sorted(constants.cols_required_anomaly) and set(df['is_approved'].unique()).issubset(set(constants.allowed_approved_values_anomaly)):
                df['uploadtime'],df['userid'] = uploadtime,userid
                df['dts'] = df['dts'].apply(lambda x:int(str(x)[0:10]))
                df['live'] = df['live'].astype(bool)
                records=[]
                for i in df.to_dict(orient='records'):
                    records.append({'Data':json.dumps(i)})
                logger.info(f"records: {records}")
                logger.info(list(df.columns))
                body = {'device_list' : df['device_id'].unique().tolist()}
                result = firehose_client.put_record_batch(DeliveryStreamName=settings.PUSH_LABEL_ANOMALY,Records=records)
                return {'Message':'Success',"StatusCode":200} if result['ResponseMetadata']['HTTPStatusCode'] == 200 else {'Message':'Firehose Error',"StatusCode":400}
            else:
                error_dict = {'Message':'Invalid Records',"StatusCode":400}
                error_dict = data_validator_for_label_api(df,constants.cols_required_anomaly,list(df.columns),constants.allowed_approved_values_anomaly,error_dict)
                return error_dict
        else:
            return {'Message':'Invalid Body',"StatusCode":400}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message':'Invalid Request',"StatusCode":400}

@app.post("/api/rca")
async def rca(to_time: int, from_time: int,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        max_items, execution_id, next_token = parse_pegination_request(body)
        if to_time and from_time:
            time_start = pd.to_datetime(from_time, unit="s")
            time_end = pd.to_datetime(to_time, unit="s")
            sql = f"""
                    select * from rca2 
                    where rca_unique_id IN 
                        (select distinct rca_unique_id from rca2  
                            where batch_time BETWEEN TIMESTAMP '{time_start}' AND TIMESTAMP '{time_end}' {sql_filter_generator(body.get('filters',{}),where_cond=True)}
                        EXCEPT
                        select distinct rca_unique_id from qoe_rca_label_records
                            where batch_time BETWEEN {from_time}000 AND {to_time}000);
            """
            athena_obj = AWSAthena()
            response = athena_obj.get_athena_data(sql, max_items, execution_id, next_token,settings.ATHENA_TABLES_DB)
            execution_id, next_token = response["execution_id"], response["next_token"]
            df = athena_obj.parse_query_response(response, body)
            response= json.loads(df.to_json(orient="records"))      
            return {'Message': 'Success', "StatusCode": 200, "Items": response, "execution_id":execution_id, "next_token": next_token}
        else:
            return {}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}

@app.post("/api/get_anomalies_for_rca")
async def GetAnomalyDetailsByID(to_time: int, from_time: int,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        batch_time_to=pd.to_datetime(body["batch_time"][0], unit="s")
        batch_time_from=pd.to_datetime(body["batch_time"][1], unit="s")
        max_items, execution_id, next_token = parse_pegination_request(body)
        if len(body["dimension"])>0:
            sql='select * from anomalyParquet where '+body["dimension"].replace("=","='").replace(",","' and ")+"'"+ f"and dts between TIMESTAMP '{batch_time_from}' and TIMESTAMP '{batch_time_to}' {sql_filter_generator(body.get('filters',{}),where_cond=True)}"
        else:
            return {"Response":"Records Not Found"}
        athena_obj = AWSAthena()
        response = athena_obj.get_athena_data(sql, max_items, execution_id, next_token,settings.ATHENA_TABLES_DB)
        execution_id, next_token = response["execution_id"], response["next_token"]
        df = athena_obj.parse_query_response(response, body)
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response, "execution_id":execution_id, "next_token": next_token}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.post("/api/apply_mitigation_for_rca")
async def apply_mitigation_for_rca(request: Request):
    req_body = await request.json() if len(await request.body()) > 1  else {}
    logger.info(type(req_body))
    try:
        response = {
            'StatusCode':400,
            'Message':'OK'
        }
        if len(set(constants.required_cols_ai_mitigation).intersection(set(req_body.keys()))) == len(constants.required_cols_ai_mitigation) and len(req_body['records']) > 0:
            dynamo_obj = AWSDynamoDB()
            s3_obj = AwsS3()
            sns_obj = SnsUtility()
            email_obj = PrepareEmail(req_body)
            dynamo_obj.set_table_name(settings.DDB_MITIGATION_PLAN)
            result = dynamo_obj.get_single_filter_data(key="plan_name",value=req_body["plan_name"])
            if result:
                recepients = result[0]['Recepients']
                recepients_list = UtilityWrapper().email_validator(recepients)
                if len(recepients_list) > 0:
                    
                    subject = email_obj.generate_subject()
                    records_df = email_obj.generate_records_df()
                    records_df.to_csv(settings.MITIGATION_FILE_NAME)
                    s3_path = s3_obj.get_s3_path_for_AI_mitigation()
                    s3_obj.upload_s3_file(s3_path,settings.MITIGATION_FILE_NAME,settings.MITIGATION_RECORDS_S3_BUCKET)
                    url = s3_obj.generate_pre_signed_url(s3_path,settings.MITIGATION_RECORDS_S3_BUCKET)
                    if url:
                        body = email_obj.generate_body(url)
                        sns_obj = SnsUtility()
                        sns_obj.send_notification(body,subject,req_body["plan_name"])
                        record_obj = PrepareDynamoRecord(s3_path,email_obj)
                        dynamo_obj.set_table_name(settings.DDB_MITIGATION_SCREEN_LEVEL_1)
                        dynamo_obj.send(record_obj.prepare_mitigation_screen_level_1_record())
                        dynamo_obj.set_table_name(settings.DDB_AI_MITIGATION_RECORDS)
                        dynamo_obj.send(record_obj.prepare_ai_mitigation_record(email_obj,recepients_list))
                        response['StatusCode'] = 200
                    else:
                        response['Message'] = 'Unable to generate Presigned Url'
                else:
                    response['Message'] = 'Empty Recepients list' 
            else:
                response['Message'] = 'Invalid Plan Name'
        else:
            response['Message'] = 'Invalid Payload'
        return response
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}
    

@app.post("/api/GetAnomalyLabalHistory")
async def GetAnomalyLabalHistory(request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        max_items, execution_id, next_token = parse_pegination_request(body)
        sql='Select * from qoe_anomaly_label_records'
        athena_obj = AWSAthena()
        response = athena_obj.get_athena_data(sql, max_items, execution_id, next_token,settings.ATHENA_TABLES_DB)
        execution_id, next_token = response["execution_id"], response["next_token"]
        df = athena_obj.parse_query_response(response, body)
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response, "execution_id":execution_id, "next_token": next_token}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}

@app.post("/api/GetRCALabalHistory")
async def GetRCALabalHistory(request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        max_items, execution_id, next_token = parse_pegination_request(body)
        sql='Select * from qoe_rca_label_records'
        athena_obj = AWSAthena()
        response = athena_obj.get_athena_data(sql, max_items, execution_id, next_token, settings.ATHENA_TABLES_DB)
        execution_id, next_token = response["execution_id"], response["next_token"]
        df = athena_obj.parse_query_response(response, body)
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response, "execution_id":execution_id, "next_token": next_token}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


@app.get("/api/mitigation_plan")
async def get_mitigation_plans(request:Request):
    try:
        dynamo_obj = AWSDynamoDB()
        response =dynamo_obj.get_records(settings.DDB_MITIGATION_PLAN)
        return {'Message': 'Success', "StatusCode": 200, "Items": response}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message': 'Invalid request body', "StatusCode": 400}


@app.post("/api/mitigation_plan")
async def add_mitigation_plan(request: Request):
    body = await request.json() if len(await request.body()) > 1  else {}
    try:
        dynamo_obj = AWSDynamoDB()
        dynamo_obj.set_table_name(settings.DDB_MITIGATION_PLAN)
        plan_response = dynamo_obj.get_single_filter_data(key="plan_name",value=body["plan_name"])
        if not plan_response:
            body['Recepients'] = UtilityWrapper().email_validator(body['Recepients'])
            sns = SnsUtility()
            topic = sns.create_topic(body.get("plan_name"))
            for email in body['Recepients']:
                sns.subscribe(topic, "email", email)
            dynamo_obj.send(MitigationPlanSchema(**body).dict())
            return {'Message': 'Success', "StatusCode": 200}
        else:
            return {'Message': 'Plan Already exists, Try Updating', "StatusCode": 400}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message':'Invalid request body',"StatusCode":400}

@app.put("/api/mitigation_plan")
async def update_mitigation_plan(request: Request):
    body = await request.json() if len(await request.body()) > 1  else {}
    try:
        dynamo_obj = AWSDynamoDB()
        dynamo_obj.set_table_name(settings.DDB_MITIGATION_PLAN)
        plan_response = dynamo_obj.get_single_filter_data(key="plan_name",value=body["plan_name"])
        if plan_response:
            utility_object = UtilityWrapper()
            body['Recepients'] = utility_object.email_validator(body['Recepients'])
            dynamo_recepients = set(plan_response[0].get('Recepients',[]))
            subscriber_list = set(body['Recepients']).difference(dynamo_recepients)
            sns = SnsUtility()
            for email in subscriber_list:
                sns.subscribe(settings.SNS_TOPIC_ARN+body["plan_name"], "email", email)
            dynamo_obj.update_record(settings.DDB_MITIGATION_PLAN, body)
            return {'Message': 'Success', "StatusCode": 200}
        else:
            return {'Message': 'Plan does not exists, Try Adding', "StatusCode": 400}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message':'Invalid request body',"StatusCode":400}

@app.delete("/api/mitigation_plan")
async def delete_mitigation_plan(request: Request):
    body = await request.json() if len(await request.body()) > 1  else {}
    try:
        dynamo_obj = AWSDynamoDB()
        dynamo_obj.set_table_name(settings.DDB_MITIGATION_PLAN)
        plan_response = dynamo_obj.get_single_filter_data(key="plan_name",value=body["plan_name"])
        logger.info(f"plan_response {plan_response}")
        dynamo_obj.set_table_name(settings.DDB_RCA_BUCKET)
        rca_response = dynamo_obj.get_single_filter_data(key="plan_name",value=body["plan_name"])
        logger.info(f"rca_response {rca_response}")
        if plan_response and not rca_response:
            dynamo_obj.delete_record(settings.DDB_MITIGATION_PLAN, key='plan_name',value=body["plan_name"])
            return {'Message': 'Success', "StatusCode": 200}
        else:
            return {'Message': 'Plan doesnt exist or already used in Bucketing', "StatusCode": 400}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message': 'Invalid request body', "StatusCode": 400}

@app.post("/api/rca_buckets")
async def add_rca_buckets(request: Request):
    body = await request.json() if len(await request.body()) > 1  else {}
    try:
        dynamo_obj = AWSDynamoDB()
        dynamo_obj.set_table_name(settings.DDB_MITIGATION_PLAN)
        plan_response = dynamo_obj.get_single_filter_data(key="plan_name",value=body["plan_name"])
        dynamo_obj.set_table_name(settings.DDB_RCA_BUCKET)
        rca_response = dynamo_obj.get_single_filter_data(key="bucket_name",value=body["bucket_name"])
        if plan_response and not rca_response:
            dynamo_obj.send(RCASchema(**body).dict())
            return {'Message': 'Success', "StatusCode": 200}
        else:
            return {'Message': 'Plan Name does not exist or RCA Bucket already exists', "StatusCode": 400}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message': 'Invalid request body', "StatusCode": 400}


@app.get("/api/rca_buckets")
async def get_rca_buckets():
    try:
        dynamo_obj = AWSDynamoDB()
        response = dynamo_obj.get_records(settings.DDB_RCA_BUCKET)
        return {'Message': 'Success', "StatusCode": 200, "Items": response}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message': 'Invalid request body', "StatusCode": 400}


@app.put("/api/rca_buckets")
async def update_rca_buckets(request: Request):
    body = await request.json() if len(await request.body()) > 1  else {}
    try:
        dynamo_obj = AWSDynamoDB()
        dynamo_obj.set_table_name(settings.DDB_MITIGATION_PLAN)
        plan_response = dynamo_obj.get_single_filter_data(key="plan_name",value=body["plan_name"])
        dynamo_obj.set_table_name(settings.DDB_RCA_BUCKET)
        rca_response = dynamo_obj.get_single_filter_data(key="bucket_name",value=body["bucket_name"])
        if plan_response and rca_response and not redis.hget('qoe_used_rca',body["bucket_name"]):
            dynamo_obj.update_record(settings.DDB_RCA_BUCKET, body)
            return {'Message': 'Success', "StatusCode": 200}
        else:
            return {'Message': r'Plan name/RCA bucket does not exist or RCA bucket already used in labelling', "StatusCode": 400}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message': 'Invalid request body', "StatusCode": 400}

@app.delete("/api/rca_buckets")
async def delete_rca_buckets(request: Request):
    body = await request.json() if len(await request.body()) > 1  else {}
    try:
        dynamo_obj = AWSDynamoDB()
        dynamo_obj.set_table_name(settings.DDB_RCA_BUCKET)
        rca_response = dynamo_obj.get_single_filter_data(key="bucket_name",value=body["bucket_name"])
        if rca_response and not redis.hget('qoe_used_rca',body["bucket_name"]):
            dynamo_obj.delete_record(settings.DDB_RCA_BUCKET, key='bucket_name',value=body["bucket_name"])
            return {'Message': 'Success', "StatusCode": 200}
        else:
            return {'Message': 'RCA bucket doesnt exist or already used in labelling', "StatusCode": 400}
    except Exception as ex:
        logger.info(f"exception : {ex}")
        return {'Message': 'Invalid request body', "StatusCode": 400}


@app.post("/api/v1/playbackfailure_summary")
async def playbackfailure(to_time: int, from_time: int, request: Request, page_size: int = 50, next_iteration_id: str = None):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        body = anomaly_score_conversion(body,'Dynamo')
        result = []
        response = []
        if to_time and from_time:
            time_start = str(datetime.datetime.strptime(str(datetime.datetime.utcfromtimestamp(int(from_time))),
                                                        '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')).replace("T", " ")
            time_end = str(datetime.datetime.strptime(str(datetime.datetime.utcfromtimestamp(int(to_time))),
                                                    '%Y-%m-%d %H:%M:%S').isoformat(
                timespec='microseconds')).replace("T", " ")
            filters = {"dts": ["_range",[time_start,time_end]], "is_approved": ["_neq",1]}
            filters.update(body.get('filters',{}))
            logger.debug(f"filters : {filters}")
            obj = AWSDynamoDB()
            response, next_iteration_id = obj.get_filtered_records(settings.DDB_ANOMALY_PLAYBACK_FAILURE, filters, page_size,
                                                    next_iteration_id)
            for record in response:
                record["anomaly_description"] = anomaly_explanation_to_description(record)
                result.append(record)
        return {'Message': 'Success', "StatusCode": 200, "size": len(response), "next_iteration_id": next_iteration_id, "data": result}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message': 'Success', "StatusCode": 200}

@app.post("/api/v1/get_summary_by_videoid")
async def get_summer_by_videoid(to_time: int, from_time: int,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        max_items, execution_id, next_token = parse_pegination_request(body)
        result = []
        from_time = datetime.datetime.utcfromtimestamp(from_time)
        to_time = datetime.datetime.utcfromtimestamp(to_time)
        sql = generate_query_for_playbackfailure(body,from_time,to_time)
        athena_obj = AWSAthena()
        response = athena_obj.get_athena_data(sql, max_items, execution_id, next_token,settings.ATHENA_TABLES_DB)
        execution_id, next_token = response.get("execution_id", ''), response.get("next_token", '')
        response = athena_obj.parse_query_response(response, body)
        response = json.loads(response.to_json(orient="records"))
        for record in response:
            record["anomaly_description"] = anomaly_explanation_to_description(record)
            result.append(record)
        return {'Message': 'Success', "StatusCode": 200, "Items": response, "execution_id":execution_id, "next_token": next_token}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message': 'Success', "StatusCode": 200}

@app.post("/api/PushLabeledRecordsPlayback")
async def PushLabeledRecordsPlayback(request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        userid = body["userid"]
        uploadtime = body["upload_time"]
        if isinstance(body["records"],list):
            df = pd.DataFrame.from_records(body["records"])
            df.reset_index(drop=True)
            df.columns = [x.lower() for x in df.columns]
            if len(df.index) > 0 and sorted(list(df.columns)) == sorted(constants.cols_required_playback) and set(df['is_approved'].unique()).issubset(set(constants.allowed_approved_values_playback)):
                df['uploadtime'],df['userid'] = uploadtime,userid
                records=[]
                for i in df.to_dict(orient='records'):
                    records.append({'Data':json.dumps(i)})
                logger.info(f"records: {records}")
                result = firehose_client.put_record_batch(DeliveryStreamName="qoe-playback-label-payload",Records=records)
                return {'Message':'Success',"StatusCode":200} if result['ResponseMetadata']['HTTPStatusCode'] == 200 else {'Message':'Firehose Error',"StatusCode":400}
            else:
                error_dict = {'Message':'Invalid Records',"StatusCode":400}
                error_dict = data_validator_for_label_api(df,constants.cols_required_playback,list(df.columns),constants.allowed_approved_values_playback,error_dict)
                return error_dict
        else:
            return {'Message':'Invalid Body',"StatusCode":400}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message':'Invalid Request',"StatusCode":400}


@app.post("/api/GetDetailedPlaybackRecords")
async def GetDetailedPlaybackRecords(to_time: int, from_time: int, request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        body = anomaly_score_conversion(body,'Athena')
        from_time = datetime.datetime.utcfromtimestamp(from_time)
        to_time = datetime.datetime.utcfromtimestamp(to_time)
        sql = f"""
            select * from anomalyparquetplaybackfailure where anomaly_id IN(
                Select anomaly_id from anomalyparquetplaybackfailure where dts between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}' {sql_filter_generator(body.get('filters',{}),where_cond=True)}
                except 
                Select anomaly_id from qoe_anomaly_playback_label_records )
            """
        print(sql)
        athena_obj = AWSAthena()
        df = athena_obj.get_full_athena_data(sql,settings.ATHENA_TABLES_DB)
        df = default_value_df(df)
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}

@app.post("/api/v1/TotalMitigationsApplied")
async def total_ai_mitigation(to_time: int, from_time: int, interval:str):
    try:
        response = []
        if to_time and from_time:
            filters = {"Created_At_from": from_time, "Created_At_to": to_time}
            logger.debug(f"filters : {filters}")
            obj = AWSDynamoDB()
            response = obj.get_all_filtered_records(settings.MITIGATION_AI_RECORDS, filters)
            if not response:
                return {'Message': 'Success', "StatusCode": 200, "size": 0,"data": []}
            response_df = pd.DataFrame.from_records(response)
            buckets = obj.get_all_filtered_records(settings.QOE_RCA_BUCKETS, {})
            buckets = buckets if buckets else {"plan_name":"NA", "bucket_name": "NA"}
            for bucket in buckets:
                response_df["bucket_name"] = np.where(response_df["Planname"] == bucket['plan_name'], bucket["bucket_name"], "uncategorized")
            response_df["Created_At"] = pd.to_numeric(response_df["Created_At"])
            response_df['Created_At'] = pd.to_datetime(response_df['Created_At'], unit='s')
            response_df = response_df.groupby(["bucket_name", pd.Grouper(key='Created_At', freq=interval, label='right')])["NumOfRecords"].sum().to_dict()
            response = dict()
            for key, val in response_df.items():
                if key[0] in response.keys():
                    response[key[0]]["time_stamp"].append(datetime.datetime.strptime(str(key[1]), '%Y-%m-%d %H:%M:%S'))
                    response[key[0]]["count"].append(val)
                else:
                    response[key[0]] = dict()
                    response[key[0]]["time_stamp"] = [datetime.datetime.strptime(str(key[1]), '%Y-%m-%d %H:%M:%S')]
                    response[key[0]]["count"] = [val]
            logger.info(f"response: {response}")   
        return {'Message': 'Success', "StatusCode": 200, "size": len(response),"data": response}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message': 'Failure', "StatusCode": 500, "size": 0,"data": []}
    
@app.post("/api/v1/AnomaliesCluster")
async def anomaly_cluster(to_time: int, from_time: int, type:str):
    try:
        response = []
        if to_time and from_time:
            from_time = datetime.datetime.utcfromtimestamp(from_time)
            to_time = datetime.datetime.utcfromtimestamp(to_time)
            filters = {"from_time": from_time, "to_time": to_time}
            logger.info(f"filters: {filters}")
            if type == "in_session":
                sql = f"Select * from rca2 where batch_time between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}'"
                group_by = "dimension"
            elif type == "playback_failure":
                sql = f"Select * from anomalyparquetplaybackfailure where dts between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}'"
                group_by = "errorname"
            logger.info(f"sql: {sql}")
            athena_obj = AWSAthena()
            response = athena_obj.get_full_athena_data(sql, "anomaly-destination")
            if response.empty:
                return {'Message': 'No Records Found', "StatusCode": 200, "size": 0,"data": []}
            response = response.groupby([group_by]).size()
            response = json.loads(response.to_json())
            logger.info(f"response: {response}")
            return {'Message': 'Success', "StatusCode": 200, "size": len(response),"data": response}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message': 'Failure', "StatusCode": 500, "size": len(response),"data": response}

@app.post("/api/v1/TotalAnomaliesDetected")
async def TotalAnomaliesDetected(to_time:int, from_time:int, interval:str,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        to_time = datetime.datetime.utcfromtimestamp(to_time)
        from_time = datetime.datetime.utcfromtimestamp(from_time)
        all_date_interval = f" '7' day" if interval == 'week' else f" '1' {interval}"
        sql = f"""
        with INSESSION as (
            select  date_format(date_trunc('{interval}', dts),'%Y-%m-%d %h:%i:%s') AS time, 
            count(anomaly_id) as in_session_anomaly_count from anomalyparquet 
            WHERE dts >= TIMESTAMP '{from_time}' AND dts < TIMESTAMP '{to_time}'
            {sql_filter_generator(body.get('filters',{}),where_cond=True)}
            group by date_format(date_trunc('{interval}', dts),'%Y-%m-%d %h:%i:%s')),
        PLAYBACK as(
            select  date_format(date_trunc('{interval}', dts),'%Y-%m-%d %h:%i:%s') AS time, 
            count(anomaly_id) as playback_anomaly_count from anomalyparquetplaybackfailure
            WHERE dts >= TIMESTAMP '{from_time}' AND dts <= TIMESTAMP '{to_time}'
            {sql_filter_generator(body.get('filters',{}),where_cond=True)}
            group by date_format(date_trunc('{interval}', dts),'%Y-%m-%d %h:%i:%s')),
        RESULT as (
            select a.time,in_session_anomaly_count,playback_anomaly_count
            from INSESSION a FULL JOIN PLAYBACK b on a.time=b.time),
        ALL_DATES as (
            select date_format(date_trunc('{interval}',date_column),'%Y-%m-%d %h:%i:%s') as all_dates from 
            (VALUES(sequence(TIMESTAMP '{from_time}',TIMESTAMP '{to_time}',INTERVAL {all_date_interval} ))) as t1(date_array)
            cross join unnest(date_array) AS t2(date_column))
        select all_dates,
        CASE  WHEN in_session_anomaly_count is not null THEN in_session_anomaly_count ELSE 0 END as in_session_anomaly_count,
        CASE  WHEN playback_anomaly_count is not null THEN playback_anomaly_count ELSE 0 END as playback_anomaly_count    
        from ALL_DATES a left join RESULT b on a.all_dates=b.time order by all_dates
        ;
        """
        logger.info(sql)
        athena_obj = AWSAthena()
        athena_df = athena_obj.get_full_athena_data(sql,settings.ATHENA_TABLES_DB)
        logger.info(athena_df.shape[0])
        if athena_df.shape[0] > 0:
             response = {
                 "Timestamp":athena_df['all_dates'].to_list(),
                 "InSession":np.array(athena_df['in_session_anomaly_count'],dtype=np.int64).tolist(),
                 "Playback":np.array(athena_df['playback_anomaly_count'],dtype=np.int64).tolist()
             }

             return {"Message": "Success", "StatusCode": 200, "Items": response}
        else:
            return {'Message': 'No Records Found', "StatusCode": 200, "Items": {}}
    except Exception as e:
        logger.exception(f"Exception Occured {e}")
        return {'Message': 'Bad Request Failure', "StatusCode": 400, "Items": {}}
   


@app.post("/api/v1/TotalDimensionsInRCA")
async def TotalDimensionsInRCA(to_time:int, from_time:int,interval:str,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        sql = f"""
        select rca_bucket,count(*) as labelled_records,
        date_format(date_trunc('{interval}', from_unixtime(uploadtime)),'%y-%m-%d %h:%i:%s') AS time
        from qoe_rca_label_records 
        where uploadtime >= {from_time} and uploadtime <= {to_time} 
        {generate_filter_TotalDimensionsInRCA(body.get('filters',{}))}
        group by rca_bucket,date_format(date_trunc('{interval}', from_unixtime(uploadtime)),'%y-%m-%d %h:%i:%s')
        order by time
        """
        logger.info(sql)
        athena_obj = AWSAthena()
        athena_df = athena_obj.get_full_athena_data(sql,settings.ATHENA_TABLES_DB)
        if athena_df.shape[0] > 0:
            response = {
                "Timestamp":athena_df['time'].drop_duplicates().to_list(),
                "Bucket_info":{}
            }
            for bucket in athena_df['rca_bucket'].unique():
                athena_df['temp_count']=athena_df.apply(lambda x:x['labelled_records'] if x['rca_bucket']==bucket else 0,axis=1)
                response["Bucket_info"][bucket]=athena_df.groupby('time')['temp_count'].max().tolist()

            return {"Message": "Success", "StatusCode": 200, "Items": response}
        else:
            return {'Message': 'No Records Found', "StatusCode": 200, "Items": {}}
    except Exception as e:
        logger.exception(f"Exception Occured {e}")
        return {'Message': 'Bad Request Failure', "StatusCode": 400, "Items": {}}

@app.post("/api/v2/TotalDimensionsInRCA")
async def TotalDimensionsInRCA(to_time:int, from_time:int,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        sql = f"""
        select rca_bucket,count(*) as labelled_records
        from qoe_rca_label_records 
        where uploadtime >= {from_time} and uploadtime <= {to_time} 
        {generate_filter_TotalDimensionsInRCA(body.get('filters',{}))}
        group by rca_bucket
        order by 2
        """
        logger.info(sql)
        athena_obj = AWSAthena()
        athena_df = athena_obj.get_full_athena_data(sql,settings.ATHENA_TABLES_DB)
        if athena_df.shape[0] > 0:
            response = {
                "Bucket_info":athena_df['rca_bucket'].to_list(),
                "Label_Count":np.array(athena_df['labelled_records'],dtype=np.int64).tolist()
            }
            return {"Message": "Success", "StatusCode": 200, "Items": response}
        else:
            return {'Message': 'No Records Found', "StatusCode": 200, "Items": {}}
    except Exception as e:
        logger.exception(f"Exception Occured {e}")
        return {'Message': 'Bad Request Failure', "StatusCode": 400, "Items": {}}

@app.post("/api/v2/AnomaliesCluster")
async def anomaly_cluster(to_time: int, from_time: int, type:str):
    try:
        response = {}
        if to_time and from_time:
            from_time = datetime.datetime.utcfromtimestamp(from_time)
            to_time = datetime.datetime.utcfromtimestamp(to_time)
            filters = {"from_time": from_time, "to_time": to_time}
            logger.info(f"filters: {filters}")
            if type == "in_session":
                sql = f"Select dimension as anomaly_type,count(*) as anomaly_count from rca2 where batch_time between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}' group by dimension order by 2 desc"
            elif type == "playback_failure":
                sql = f"Select errorname as anomaly_type,count(*) as anomaly_count from anomalyparquetplaybackfailure where dts between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}' group by errorname"
            logger.info(f"sql: {sql}")
            athena_obj = AWSAthena()
            athena_df = athena_obj.get_full_athena_data(sql, "anomaly-destination")
            if athena_df.empty:
                return {'Message': 'No Records Found', "StatusCode": 200, "size": 0,"data": response}
            athena_df = athena_df[(athena_df['anomaly_type'] != '<NA>')]
            response = {key:value for key,value in zip(athena_df['anomaly_type'].to_list(),np.array(athena_df['anomaly_count'],dtype=np.int64).tolist()) if key != '{}'}
            logger.info(f"response: {response}")
            return {'Message': 'Success', "StatusCode": 200, "size": len(response),"data": response}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message': 'Failure', "StatusCode": 500, "size": len(response),"data": {}}

@app.post("/api/v1/labelledrecords")
async def GetLabelledRecords(to_time: int, from_time: int,anomaly_type: str,request: Request):
    try:
        body = await request.json() if len(await request.body()) > 1  else {}
        if anomaly_type in [item.name for item in constants.LabelledTables]:
            table_name = constants.LabelledTables[anomaly_type].value
        else:
            return {'Message': 'Anomaly Type is not correct', "StatusCode": 400, "Items": {}}
        sql = f"Select * from {table_name} where uploadtime between {from_time} and {to_time}"
        if len(body.get('filters',{})) > 0:
            if set(body['filters'].keys()).difference({'content_partner','device_platform'}) == set():
                sql += generate_filter_labelledrecords(body.get('filters',{})) if anomaly_type == 'erca' else sql_filter_generator(body.get('filters',{}),where_cond=True)
            else:
                return {'Message': 'Filter Type is not correct', "StatusCode": 400, "Items": {}}
        logger.info(f"sql : {sql}")
        athena_obj = AWSAthena()
        df = athena_obj.get_full_athena_data(sql,settings.ATHENA_TABLES_DB)
        df['is_approved'] = df['is_approved'].apply(lambda x:'Yes' if x==1 else 'No')
        response = json.loads(df.to_json(orient="records"))
        return {'Message': 'Success', "StatusCode": 200, "Items": response}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {'Message': 'Bad Request', "StatusCode": 400, "Items": {}}


@app.get("/status")
async def status():
    logger.debug(f"status is ok")
    return {'Message': 'Success', "StatusCode": 200}

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host="0.0.0.0", port=5009, log_level="debug",reload=True)