import boto3
import json
import os
import re
from rediscluster import RedisCluster

s3 = boto3.client('s3')

REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]
CONTENT_PARTNER_BUCKET_NAME = os.environ["CONTENT_PARTNER_BUCKET_NAME"]

def read_data_from_s3(file_name):
    obj = s3.get_object(Bucket=CONTENT_PARTNER_BUCKET_NAME, Key=file_name)
    data_set = json.loads(obj['Body'].read())
    return data_set


def write_data_into_redis(data_set, key_name):
    STATUS_CODE = 200
    RESPONSE_BODY = "File successfully uploaded"
    redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                         decode_responses=True,
                         skip_full_coverage_check=True,
                         ssl=True
                         )

    if len(data_set) > 0 and type(data_set) is dict:
        flag = True
        for key, value in data_set.items():
            if type(key) is str and type(value) is str and re.match(r'^[A-Za-z0-9_.]+$', value):
                pass
            else:
                flag = False
                break
        if flag:
            redis.hset(key_name, mapping=data_set)
            print("redis data:", len(redis.hgetall(key_name)))
        else:
            s3.delete_object(Bucket=CONTENT_PARTNER_BUCKET_NAME, Key=key_name)
            STATUS_CODE = 400
            RESPONSE_BODY = "Invalid data set"
    else:
        s3.delete_object(Bucket=CONTENT_PARTNER_BUCKET_NAME, Key=key_name)
        STATUS_CODE = 400
        RESPONSE_BODY = "Invalid file"
    return STATUS_CODE, RESPONSE_BODY


def process_file(file_name, key_name):
    data_set = read_data_from_s3(file_name)
    STATUS_CODE, RESPONSE_BODY = write_data_into_redis(data_set, key_name)
    return STATUS_CODE, RESPONSE_BODY


def lambda_handler(event, context):
    records = event.get("Records", [])
    STATUS_CODE = 400
    RESPONSE_BODY = "Invalid file name. please upload file name as enums_config.json or partner_icon.json"
    for record in records:
        file_name = record.get("s3").get("object").get("key")
        if file_name == "enums_config.json":
            key_name = "enums_config_content_partner_11111"
            STATUS_CODE, RESPONSE_BODY = process_file(file_name, key_name)
        elif file_name == "partner_icon.json":
            key_name = "partner_icon_content_partner_22222"
            STATUS_CODE, RESPONSE_BODY = process_file(file_name, key_name)
        else:
            pass
    return {
        'statusCode': STATUS_CODE,
        'body': json.dumps(RESPONSE_BODY)
    }