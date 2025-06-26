import os
import json
import boto3

from pandas import DataFrame
from numpy import average
from rediscluster import RedisCluster

AWS_REGION_NAME = os.environ["AWS_REGION_NAME"]
AWS_ACCESS_KEY_ID = os.environ["AWS_ACCESS_KEY_ID"]
AWS_SECRET_ACCESS_KEY = os.environ["AWS_SECRET_ACCESS_KEY"]
BUCKET_NAME = os.environ["BUCKET_NAME"]
REDIS_HOST = os.environ["REDIS_HOST"]
REDIS_PORT = os.environ["REDIS_PORT"]

s3 = boto3.client('s3', 
    region_name=AWS_REGION_NAME,
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key= AWS_SECRET_ACCESS_KEY)

redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                  decode_responses=True,
                  skip_full_coverage_check=True,
                  ssl=True)

def get_normalized_val(lower_bound, upper_bound, value):
    if not (type(lower_bound) in [float, int] and type(upper_bound) in [float, int] and type(value) in [float, int]):
        print(type(lower_bound), type(upper_bound), type(value))
        raise TypeError("Bad params, please use input as int or float")
    if (lower_bound < 0 or upper_bound < 0 or value < 0):
        raise ValueError("Cannot Except Negative Values")
    if lower_bound - upper_bound == 0:
        raise ValueError("Bad params, may result in divide by zero error")
    value = (lower_bound + float(0.0001)) if value < lower_bound else value 
    value = (upper_bound - float(0.0001)) if value > upper_bound else value 
    denominator = upper_bound - lower_bound
    return (value - lower_bound) / denominator

def calculate_uei(startup_buffer_last_session, stall_count: int):
    sbl_normalized = get_normalized_val(lower_bound=0, upper_bound=6, value=startup_buffer_last_session)
    stall_count_normalized = get_normalized_val(lower_bound=0, upper_bound=6, value=stall_count)
    sbl_weight = 30
    stall_weight = 70
    values_df = DataFrame([[sbl_normalized, stall_count_normalized]])
    weights_df = DataFrame([[sbl_weight, stall_weight]])
    avg = average(values_df, weights=weights_df)
    normalize_avg = get_normalized_val(float("0.001"), float("0.999"), float(avg))
    uei = 1 - normalize_avg
    return uei * 100

def local_mitigation_generator_dynamodb(row):
    print(f"{row['device_id']} Before process : {row}")
    w1,w2,w3,delta=0.5,0.3,0.2,1.1
    row["SuggestiveStartupBufferDuration"]=min(
        (w1*int(row.get("sbl_last_session",1)) \
        +w2*int(row.get("sbl_today",1)) \
        +w3*int(row.get("sbl_all_time",1)) \
        +delta*int(row.get("sbl_last_session",0))),
        12)
    row["SuggestiveRebufferingDuration"]=min(
        (w1*int(row.get("sbl_last_session",1)) \
        +w2*int(row.get("sbl_today",1)) \
        +w3*int(row.get("sbl_all_time",1)) \
        +delta*int(row.get("sbl_last_session",0))),
        12)

    row["SuggestiveStartBitrate"]= row.get("start_bitrate", 1000000)
    row["previous_uei"]= calculate_uei(int(row.get("sbl_last_session",1)), int(row.get("stall_count_last_session",0)))
    row["Source"] = row.get("Source", "Local Intelligence")
    print(f"{row['device_id']} After process : {row}")
    return row

def lambda_handler(event,context):
    global data
    global keys_of_interest
    obj = s3.get_object(Bucket=BUCKET_NAME, Key=event['file_name'])
    keys_of_interest = json.loads(obj['Body'].read())
    updated_keys_of_interest=list(map(local_mitigation_generator_dynamodb,keys_of_interest[list(keys_of_interest.keys())[0]]))
    s3.put_object(Body=json.dumps({list(keys_of_interest.keys())[0]:updated_keys_of_interest}),Bucket='mitigationinfralambda',Key=event['file_name'])
    return {"Status_Code":200,"file_name":event["file_name"]}


# BUCKET_NAME = 'mitigationinfralambda'
# AWS_REGION_NAME="ap-south-1"
# AWS_ACCESS_KEY_ID="AKIAWZG524Z4PKWJFIQU"
# AWS_SECRET_ACCESS_KEY=""
# REDIS_HOST="clustercfg.qoe-memorydb.ebvbgv.memorydb.ap-south-1.amazonaws.com"
# REDIS_PORT=6379