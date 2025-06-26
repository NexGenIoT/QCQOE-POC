from rediscluster import RedisCluster
import os
import json
from uuid import uuid4
import boto3
import urllib3

http = urllib3.PoolManager()

s3 = boto3.client('s3')

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
LOCAL_MITIGATION_GENERATOR_BUCKET_NAME = os.environ["LOCAL_MITIGATION_GENERATOR_BUCKET_NAME"]
GET_STARTUP_BUFFER_API_URL = os.environ["GET_STARTUP_BUFFER_API_URL"]

redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                     decode_responses=True,
                     skip_full_coverage_check=True,
                     ssl=True)


def list_keys_from_redis(stall_threshold, uei_threshold, pattern="qoe_dsm_ds_*"):
    updated_data = []
    body_for_startup_buffer = {}
    keys_of_interest = {}
    c = 0
    for key in redis.scan_iter(pattern):
        data = redis.hgetall(str(key))
        print(data)
        if int(data["last_report_time"]) > 1661426705:
            try:
                body_for_startup_buffer[data["current_session_id"]] = data["device_id"]
                updated_data.append(data)
            except:
                continue
    response = http.request('POST', GET_STARTUP_BUFFER_API_URL,
                            body=json.dumps({"device_ids": body_for_startup_buffer}),
                            headers={'Content-Type': 'application/json'},
                            retries=False)
    try:
        response = json.loads(response.data.decode("utf-8"))
    except Exception as ex:
        print(ex)
        response = 0
    print(body_for_startup_buffer)
    print(f"$$$$$$$$$$$$$$$$$$$$$${response}")
    if len(updated_data) > 0:
        for i in updated_data:
            if len(response) == 0:
                data["startup_buffer_duration_all_time"] = 1
                data["startup_buffer_duration_today"] = 1
                data["startup_buffer_last_session"] = 1
            else:
                for j in response:
                    data = i
                    if len(response) > 0 and i["device_id"] == j["device_id"]:
                        data["startup_buffer_duration_all_time"] = j["startup_buffer_duration_all_time"]
                        data["startup_buffer_duration_today"] = j["startup_buffer_duration_today"]
                        data["startup_buffer_last_session"] = j["startup_buffer_last_session"]
                    else:
                        data["startup_buffer_duration_all_time"] = 1
                        data["startup_buffer_duration_today"] = 1
                        data["startup_buffer_last_session"] = 1

            if c <= 999 and c > 0:
                data["LocalMitigationID"] = str(uuid4())
                data["GroupMitigationID"] = str(GroupMitigationID)
                list_of_local_mitigations.append(data)
                keys_of_interest[GroupMitigationID] = list_of_local_mitigations
                c += 1
            elif c == 0:
                GroupMitigationID = str(uuid4())
                list_of_local_mitigations = []
                data["LocalMitigationID"] = str(uuid4())
                data["GroupMitigationID"] = str(GroupMitigationID)
                list_of_local_mitigations.append(data)
                keys_of_interest[GroupMitigationID] = list_of_local_mitigations
                c += 1
            elif c > 999:
                list_of_local_mitigations = []
                data["LocalMitigationID"] = str(uuid4())
                data["GroupMitigationID"] = str(GroupMitigationID)
                list_of_local_mitigations.append(data)
                keys_of_interest[GroupMitigationID] = list_of_local_mitigations
                c = 1
        return keys_of_interest
    else:
        return {}


# list_keys_from_redis(4,0.4,"qoe_dsm_ds_*")
def lambda_handler(event, context):
    keys_of_interest = list_keys_from_redis(4, 0.4, "qoe_dsm_ds_*")
    file_list = []
    if len(keys_of_interest) > 0:
        for i in keys_of_interest.keys():
            file_name = 'data_for_local_intelligence_lambda' + str(i) + '.json'
            s3.put_object(
                Body=json.dumps({i: keys_of_interest[i]}),
                Bucket=LOCAL_MITIGATION_GENERATOR_BUCKET_NAME,
                Key=file_name
            )
            file_list.append({"file_name": file_name})

        return {"Status_Code": 200, "size": str(len(keys_of_interest.keys())), "data_file": file_list}
    else:
        return {"Status_Code": 200, "size": str(len(keys_of_interest.keys())), "data_file": []}
