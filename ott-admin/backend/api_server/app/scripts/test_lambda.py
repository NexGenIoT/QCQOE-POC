from rediscluster import RedisCluster
import os
import botocore.session
import random 
import json
import time
from uuid import uuid4
import boto3 
import collections
REDIS_HOST = "qoeelasticcache.ebvbgv.clustercfg.aps1.cache.amazonaws.com"
REDIS_PORT = "6379"

s3 = boto3.client('s3', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "")

redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                     decode_responses=True,
                     skip_full_coverage_check=True)
session = botocore.session.get_session()
dynamodb = session.create_client('dynamodb', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "") # low-level client

def data_to_mitigationdb(data):
    if len(group_mitigation_id)>0:
        params = {
                'TableName': "mitigationDB_poc",
                'Item': {
                    "LocalMitigationID": {'S': data["LocalMitigationID"]},
                    "DeviceID":{"S":data["UDID"]},
                    "GroupMitigationID":{'S':group_mitigation_id},
                    "Source":{'S':data["Source"]}
                }
            } 
        dynamodb.put_item(**params)
        keys_of_interest[data["RedisKey"]].update({"LocalMitigationID":data["LocalMitigationID"]})
        keys_of_interest[data["RedisKey"]].update({"DeviceConfig":{"SuggestiveStartupBufferLength":data["SuggestiveStartupBufferLength"]}})
        redis.set(data["RedisKey"],json.dumps(keys_of_interest[data["RedisKey"]]))
    else:
        GroupMitigationID=str(uuid4())
        for i in data:
            LocalMitigationID=str(uuid4())
            params = {
                    'TableName': "mitigationDB_poc",
                    'Item': {
                        "LocalMitigationID": {'S': LocalMitigationID},
                        "DeviceID":{"S":i},
                        "GroupMitigationID":{'S':GroupMitigationID},
                        "Source":{'S':"Manual"}
                    }
                } 
            dynamodb.put_item(**params)
            redis.set("manual_mitigation_"+str(GroupMitigationID)+"_"+str(LocalMitigationID),json.dumps(params["Item"]))
    return True

 
def lambda_handler(event,context):
    global data
    global keys_of_interest
    global data_after_formula
    global group_mitigation_id
    if type(event) is dict and "Source" in event.keys() :
        group_mitigation_id=''
        #event=json.load(event)
        data_to_mitigationdb(event["UDID"])
    else:
        for i in event:
            obj = s3.get_object(Bucket="mitigationinfralambda", Key=i["file_name"])
            event_from_last_lambda = json.loads(obj['Body'].read())
            data=event_from_last_lambda["data"]
            keys_of_interest=event_from_last_lambda["keys_of_interest"]
            data_after_formula=event_from_last_lambda["data_after_formula"]
            group_mitigation_id=list(data[0].keys())[0]
            #load data_after_formula and key_of_interest from data store
            print(group_mitigation_id)
            strt=time.time()
            list(map(data_to_mitigationdb,data_after_formula))
            print(time.time()-strt)
            #s3.delete_object(Bucket='mitigationinfralambda', Key=i["file_name"])
            print(i)
    return {"Status_Code":200}
lambda_handler( [
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda980c6647-0e8f-4158-a55d-4119310d6a12.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda5f4d22b6-1afe-46ad-9e9c-5619c337ec07.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda36820c5f-40b5-4c35-a886-78f1655bb537.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda694febe6-3b98-4f00-8a78-42f2aa2a01be.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda6aa470ed-b54b-4586-a4ed-545fe0952203.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda63ba60e8-90af-42c9-81f6-cb96d4782aa1.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda7c486b3c-c99b-4a79-9779-a99aa452f21c.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdabd97f364-bc6d-4447-a4c4-99feefde0771.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda8bf42ebe-0130-4d31-9282-e7feb78e7ded.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdaaadbabd9-bbe3-4219-9a27-3a73052b2921.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda97ad35e6-9f96-4da7-a92e-15cc8d6085ed.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda55cd787f-bfd9-40db-b2bd-d2aa478d3064.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda56247e4e-4a9f-4dcf-b010-fb597d633d7e.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdac9403bf7-a32d-438d-bb15-c9ed5e67c21a.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda88a37604-1703-4e8b-b4fc-4184644b3466.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdab7904066-30a8-41cd-b91b-b2f4d2381849.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdad9e1be8f-04d6-4f7a-8cbb-5d34edbe28c1.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda6bb4beef-a7e9-45e4-92f8-8d145aceca96.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda8b7828b0-3ad6-4e5f-954b-4fd742a9716a.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda5f53fb3a-b142-4a77-9d12-127db9ba94e3.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdafe8b6a43-8233-4e36-a992-b6a9c44c489d.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda110b3422-8da4-4e2b-a0e4-1c8f75625ad0.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambda86265f8c-0e5d-4a2f-91dc-e1af38ffd4d2.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdadef20f3c-78ea-4107-908e-41eeddeded75.json"
    },
    {
      "Status_Code": 200,
      "file_name": "data_for_local_intelligence_lambdacf0c9cba-2da3-4e0e-95c9-7ef10d1d141b.json"
    }
  ],{})