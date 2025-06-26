'''
    This Lambda will identify the potential candidates for mitigation
'''
import os
import json
from uuid import uuid4
import time
import boto3

from rediscluster import RedisCluster

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
BUCKET_NAME = os.environ["BUCKET_NAME"]

STALL_THRESHOLD = 4
UEI_THRESHOLD = 99
TIME_INTERVAL = 1200
GROUP_SIZE = 1000
Manual_TIME_INTERVAL = 900
ACTIVE_DEVICE_LAST_TIME = 300
REDIS_KEY_PATTERN = "qoe_dsm_ds_*"
WHITELIST_KEY = "qoe_dsm_whitelist_ds"
WHITELIST_LAMBDA = 'local_mitigation_AB_testing'
WHITELIST = True

s3 = boto3.client('s3')
lambda_obj = boto3.client('lambda')
redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                     decode_responses=True,
                     skip_full_coverage_check=True,
                     ssl=True)


def convert_date_to_epoch(mit_dt):
    result = 0
    try:
        if mit_dt != 0:
            p = '%Y-%m-%d %H:%M:%S.%f'
            result = int(time.mktime(time.strptime(mit_dt, p)))
    except Exception as e:
        print(e)
        result = 0
    return result


def filter_devices_from_redis():
    lambda_obj.invoke(FunctionName=WHITELIST_LAMBDA)
    list_of_local_mitigations = []
    keys_of_interest = {}
    count = 0
    key_count = 0
    key_list = redis.hgetall(WHITELIST_KEY).keys() if WHITELIST else redis.scan_iter(REDIS_KEY_PATTERN)
    # for key in redis.hgetall(WHITELIST_KEY).keys():
    # for key in redis.scan_iter(REDIS_KEY_PATTERN):
    for key in key_list:
        key_count += 1
        process_device = False
        data = redis.hgetall(str(key))
        print(data)
        last_mitigation_applied = convert_date_to_epoch(data.get("last_mitigation_applied", 0))
        if len(data) > 0 and (int(data.get("stall_count_last_session", 0)) > STALL_THRESHOLD or float(
                data.get("current_uei", 0.0)) < UEI_THRESHOLD) and (
                int(time.time()) - last_mitigation_applied) > TIME_INTERVAL and (
                int(time.time()) - int(data.get('last_ping_time', 0))) <= ACTIVE_DEVICE_LAST_TIME:
            if data.get("source", '') == 'Manual':
                if (int(time.time()) - last_mitigation_applied) > Manual_TIME_INTERVAL:
                    process_device = True
            else:
                process_device = True

            if process_device:
                if ((count >= GROUP_SIZE and count % GROUP_SIZE == 0) or count == 0):
                    if count > 0:
                        keys_of_interest[GroupMitigationID] = list_of_local_mitigations
                        list_of_local_mitigations = []
                    GroupMitigationID = str(uuid4())
                data["GroupMitigationID"] = str(GroupMitigationID)
                data["LocalMitigationID"] = str(uuid4())
                data["MitigationGenerationSessionID"] = data["current_session_id"]
                data["MitigationGenerationTime"] = int(time.time())
                list_of_local_mitigations.append(data)
                count += 1

    if count > 0:
        keys_of_interest[GroupMitigationID] = list_of_local_mitigations
    print(f"keys_of_interest {keys_of_interest}")
    print(f"Total Devices {key_count} Concerend devices {count}")
    return keys_of_interest


def lambda_handler(event, context):
    keys_of_interest = filter_devices_from_redis()
    file_list = []
    if len(keys_of_interest) > 0:
        for i in keys_of_interest.keys():
            file_name = 'data_for_local_intelligence_lambda' + str(i) + '.json'
            s3.put_object(
                Body=json.dumps({i: keys_of_interest[i]}),
                Bucket=BUCKET_NAME,
                Key=file_name
            )
            file_list.append({"file_name": file_name})
    print(f"File_list {file_list}")
    return {"Status_Code": 200, "size": str(len(keys_of_interest.keys())), "data_files": file_list}
