from rediscluster import RedisCluster
import os
import botocore.session
import random
import json
import time
from datetime import datetime
from uuid import uuid4
import boto3

LOCAL_MITIGATION_GENERATOR_BUCKET_NAME = os.environ["LOCAL_MITIGATION_GENERATOR_BUCKET_NAME"]
REDIS_KINESIS_STREAM = os.environ["REDIS_KINESIS_STREAM"]
REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]

stream_session = boto3.session.Session()
kinesis_client = stream_session.client('kinesis')
s3 = boto3.client('s3')
session = botocore.session.get_session()
dynamodb = session.create_client('dynamodb')  # low-level client


def data_to_mitigationdb_updated_flow(data):
    if len(group_mitigation_id) > 0:
        if data["Source"] == "Manual":
            data["DeploymentStatus"] = "Policy Voilated"
            partitionkey = str(uuid4())[:8]
            data_to_kinesis = {"switch": {"device_id": data["device_id"],
                                          "local_mitigation_id": data["LocalMitigationID"],
                                          "group_mitigation_id": group_mitigation_id,
                                          "source": "Local Intelligence",
                                          "session_id": data["last_session_id"],
                                          "mitigation_time_stamp": int(time.time()),
                                          "uei": float(data["previous_uei"]),
                                          "startup_buffer_duration": data["SuggestiveStartupBufferDuration"],
                                          "startup_buffer_length": data["SuggestiveStartupBufferDuration"],
                                          "rebuffering_duration": data["SuggestiveReBufferingDuration"],
                                          "start_bitrate": data["SuggestiveStartBitrate"],
                                          "last_mitigation_deployment_status": "Policy Voilated"}}
            kinesis_client.put_record(StreamName=REDIS_KINESIS_STREAM, Data=json.dumps(data_to_kinesis),
                                      PartitionKey=partitionkey)
        else:
            partitionkey = str(uuid4())[:8]
            data_to_kinesis = {"switch": {"device_id": data["device_id"],
                                          "local_mitigation_id": data["LocalMitigationID"],
                                          "group_mitigation_id": group_mitigation_id,
                                          "source": "Local Intelligence",
                                          "session_id": data["last_session_id"],
                                          "mitigation_time_stamp": int(time.time()),
                                          "uei": float(data["previous_uei"]),
                                          "startup_buffer_duration": data["SuggestiveStartupBufferDuration"],
                                          "startup_buffer_length": data["SuggestiveStartupBufferDuration"],
                                          "rebuffering_duration": data["SuggestiveReBufferingDuration"],
                                          "start_bitrate": data["SuggestiveStartBitrate"],
                                          "last_mitigation_deployment_status": "Pending"}}
            kinesis_client.put_record(StreamName=REDIS_KINESIS_STREAM, Data=json.dumps(data_to_kinesis),
                                      PartitionKey=partitionkey)
    else:
        GroupMitigationID = str(uuid4())
        for i in data["DeviceID"]:
            LocalMitigationID = str(uuid4())
            partitionkey = str(uuid4())[:8]
            data_to_kinesis = {"switch": {"device_id": i,
                                          "local_mitigation_id": LocalMitigationID,
                                          "group_mitigation_id": GroupMitigationID,
                                          "source": "Manual",
                                          "mitigation_time_stamp": int(time.time()),
                                          "startup_buffer_duration": data["SuggestiveStartupBufferDuration"],
                                          "startup_buffer_length": data["SuggestiveStartupBufferDuration"],
                                          "rebuffering_duration": data["SuggestiveReBufferingDuration"],
                                          "start_bitrate": data["SuggestiveStartBitrate"],
                                          "last_mitigation_deployment_status": "Pending"}}
            kinesis_client.put_record(StreamName=REDIS_KINESIS_STREAM, Data=json.dumps(data_to_kinesis),
                                      PartitionKey=partitionkey)
        params_1 = {
            'TableName': "mitigation_history_screen_level1",
            'Item': {
                "GroupMitigationID": {'S': str(GroupMitigationID)},
                "Time_Stamp": {'N': str(time.time())},
                "AppliedOn": {'N': str(len(data["DeviceID"]))},
                "ImpactedSessions": {'N': str(0)},
                "PreviousUEI": {'N': str(0)},
                "CurrentUEI": {'N': str(0)},
                "Source": {'S': "Manual"}
            }
        }
        dynamodb.put_item(**params_1)
    return True


def lambda_handler(event, context):
    global data
    global keys_of_interest
    global data_after_formula
    global group_mitigation_id
    if type(event) is dict and "Source" in event.keys():
        # Manual mitigation flow
        group_mitigation_id = ''
        data_to_mitigationdb_updated_flow(event)
    else:
        # auto mitigation flow
        obj = s3.get_object(Bucket=LOCAL_MITIGATION_GENERATOR_BUCKET_NAME, Key=event["file_name"])
        keys_of_interest = json.loads(obj['Body'].read())
        group_mitigation_id = str(list(keys_of_interest.keys())[0])
        list(map(data_to_mitigationdb_updated_flow, keys_of_interest[list(keys_of_interest.keys())[0]]))
        params = {
            'TableName': "mitigation_history_screen_level1",
            'Item': {
                "GroupMitigationID": {'S': str(group_mitigation_id)},
                "Time_Stamp": {'N': str(time.time())},
                "AppliedOn": {'N': str(len(keys_of_interest[list(keys_of_interest.keys())[0]]))},
                "ImpactedSessions": {'N': str(0)},
                "PreviousUEI": {'N': str(0)},
                "CurrentUEI": {'N': str(0)},
                "Source": {'S': "Local Intelligence"}
            }
        }
        dynamodb.put_item(**params)
    return {"Status_Code": 200}