'''
    This Lambda will identify the potential candidates for mitigation
'''
import os
import json
from uuid import uuid4 
import time
import boto3
from rediscluster import RedisCluster

AWS_REGION_NAME = os.environ["AWS_REGION_NAME"]
AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
BUCKET_NAME = os.environ["BUCKET_NAME"]
STALL_THRESHOLD = os.environ["STALL_THRESHOLD"]
UEI_THRESHOLD = os.environ["UEI_THRESHOLD"]

TIME_INTERVAL = 300

s3 = boto3.client('s3', region_name=AWS_REGION_NAME,aws_access_key_id=AWS_ACCESS_KEY_ID,aws_secret_access_key= AWS_SECRET_ACCESS_KEY)
redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                  decode_responses=True,
                  skip_full_coverage_check=True,
                  ssl=True)


def list_keys_from_redis(stall_threshold,uei_threshold,pattern="qoe_dsm_ds_*"):
    all_keys = []
    group_mitigation_id = str(uuid4())
    for key in redis.scan_iter(pattern):
        data=redis.hgetall(str(key))
        if len(data) > 0 \
        and ((int(data.get("stall_count_last_session",0))>stall_threshold \
                or float(data.get("current_uei",0.0))<uei_threshold)) \
        and (time.time() - float(data.get("last_mitigation_applied",0))) > TIME_INTERVAL:
            data["GroupMitigationID"] = str(group_mitigation_id)
            data["LocalMitigationID"] = str(uuid4())
            all_keys.append(data)
    return all_keys, group_mitigation_id


def create_groups_of_record(keys_of_interest, group_mitigation_id, group_size):
    subList = [keys_of_interest[n:n + group_size] for n in range(0, len(keys_of_interest), group_size)]
    keys_of_interest = {group_mitigation_id: subList}
    return keys_of_interest


def lambda_handler(event, context):
    all_keys, group_mitigation_id=list_keys_from_redis(STALL_THRESHOLD,UEI_THRESHOLD,"qoe_dsm_ds_*")
    print("all_keys len :", len(all_keys), "group_mitigation_id", group_mitigation_id)
    keys_of_interest = create_groups_of_record(all_keys, group_mitigation_id, 1000)
    print("keys_of_interest :", len(keys_of_interest))
    file_list=[]
    if len(keys_of_interest)>0:
        for i in keys_of_interest.keys():
            file_name='data_for_local_intelligence_lambda'+str(i)+'.json'
            s3.put_object(
                Body=json.dumps({i:keys_of_interest[i]}),
                Bucket=BUCKET_NAME,
                Key=file_name
            )
            file_list.append({"file_name":file_name})
        print(f"File_list {file_list}")
        return {"Status_Code":200,"size":str(len(keys_of_interest.keys())),"data_file":file_list}
    else:
        print(f"File_list {file_list}")
        return {"Status_Code":200,"size":str(len(keys_of_interest.keys())),"data_file":[]}


# #  ----------------------- set as ENV vars --------------------------- #
# AWS_REGION_NAME="ap-south-1"
# AWS_ACCESS_KEY_ID="AKIAWZG524Z4PKWJFIQU"
# AWS_SECRET_ACCESS_KEY=""
# REDIS_HOST="clustercfg.qoe-memorydb.ebvbgv.memorydb.ap-south-1.amazonaws.com"
# REDIS_PORT=6379
# BUCKET_NAME = 'mitigationinfralambda'
# STALL_THRESHOLD = 4 
# UEI_THRESHOLD = 90.0
# # ------------------------------------------------------------------- #

