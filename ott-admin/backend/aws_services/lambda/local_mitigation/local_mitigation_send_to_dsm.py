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
DYNAMO_TABLE_NAME = os.environ["DYNAMO_TABLE_NAME"]

redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                     decode_responses=True,
                     skip_full_coverage_check=True,
                     ssl=True)
stream_session = boto3.session.Session()
kinesis_client = stream_session.client('kinesis')
s3 = boto3.client('s3')
session = botocore.session.get_session()
dynamodb = session.create_client('dynamodb')  # low-level client


def send_to_kinesis(data, did, lmid, gmid, source):
    partitionkey = str(uuid4())[:8]
    if source == "Manual":
        device_data = redis.hgetall(str('qoe_dsm_ds_' + str(did)))
        data['sbl_last_session'] = device_data.get('sbl_last_session', 4)
        data['rebuffering_duration'] = device_data.get('rebuffering_duration', 5)
        data['start_bitrate'] = device_data.get('start_bitrate', 1000000)
        data['stall_count_last_session'] = device_data.get('stall_count_last_session', 0)
        data['current_session_id'] = device_data.get('current_session_id', "")
        data['throughput'] = device_data.get('throughput', 0)
        data['previous_uei'] = device_data.get('current_uei', 0)
        data["MitigationGenerationTime"] = int(time.time())
        data["MitigationGenerationSessionID"] = device_data["current_session_id"]
    data_to_kinesis = {"switch": {"device_id": did,
                                  "local_mitigation_id": lmid,
                                  "group_mitigation_id": gmid,
                                  "source": source,
                                  "current_session_id": data["current_session_id"],
                                  "mitigation_time_stamp": int(time.time()),
                                  "uei": float(data["previous_uei"]),
                                  "suggestive_startup_buffer_duration": data.get("SuggestiveStartupBufferDuration", 5),
                                  "suggestive_start_bitrate": data.get("SuggestiveStartBitrate", 1000000),
                                  "suggestive_rebuffering_duration": data.get("SuggestiveReBufferingDuration", 5),
                                  "last_mitigation_deployment_status": "Pending",
                                  "previous_sbl": data.get("sbl_last_session", 4),
                                  "previous_rbl": data.get("rebuffering_duration", 5),
                                  "previous_stall_count": data.get("stall_count_last_session", 0),
                                  "previous_bitrate": data.get("start_bitrate", 1000000),
                                  "previous_throughput": data.get("throughput", 0),
                                  "MitigationGenerationSessionID": data["MitigationGenerationSessionID"],
                                  "MitigationGenerationTime": data["MitigationGenerationTime"]}}
    print(data_to_kinesis)
    kinesis_client.put_record(StreamName=REDIS_KINESIS_STREAM, Data=json.dumps(data_to_kinesis),
                              PartitionKey=partitionkey)


def send_to_dynamo(gmid, source, nod):
    print("Putting record in Dynamo")
    params = {
        'TableName': DYNAMO_TABLE_NAME,
        'Item': {
            "GroupMitigationID": {'S': str(gmid)},
            "Time_Stamp": {'N': str(time.time())},
            "AppliedOn": {'N': str(nod)},
            "ImpactedSessions": {'N': str(0)},
            "PreviousUEI": {'N': str(0)},
            "CurrentUEI": {'N': str(0)},
            "Source": {'S': source}
        }
    }
    print(params)
    dynamodb.put_item(**params)


def process_auto_mitigation_records(data):
    send_to_kinesis(data, did=data["device_id"], lmid=data["LocalMitigationID"], gmid=group_mitigation_id,
                    source="Local Intelligence")
    return True


def process_manual_mitigation_records(data):
    GroupMitigationID = str(uuid4())
    for device_id in data["DeviceID"]:
        LocalMitigationID = str(uuid4())
        send_to_kinesis(data, did=device_id, lmid=LocalMitigationID, gmid=GroupMitigationID, source="Manual")
    send_to_dynamo(gmid=GroupMitigationID, source="Manual", nod=len(data["DeviceID"]))
    return True


def lambda_handler(event, context):
    print(f"event {event}")
    global group_mitigation_id
    if type(event) is dict and "Source" in event.keys():
        # Manual mitigation flow
        group_mitigation_id = ''
        process_manual_mitigation_records(event)
    else:
        # auto mitigation flow
        for i in event['data_files']:
            file_name = i['file_name']
            print(f"Processing File ---> {file_name}")
            obj = s3.get_object(Bucket=LOCAL_MITIGATION_GENERATOR_BUCKET_NAME, Key=file_name)
            keys_of_interest = json.loads(obj['Body'].read())
            group_mitigation_id = list(keys_of_interest.keys())[0]
            print(f"group_mitigation_id {group_mitigation_id}")
            list(map(process_auto_mitigation_records, keys_of_interest[group_mitigation_id]))
            send_to_dynamo(gmid=group_mitigation_id, source="Local Intelligence",
                           nod=len(keys_of_interest[group_mitigation_id]))
    return {"Status_Code": 200}
