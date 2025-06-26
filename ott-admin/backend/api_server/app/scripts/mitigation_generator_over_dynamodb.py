import os
import botocore.session
import random 
import json
import collections
import boto3

s3 = boto3.client('s3', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "")

def local_mitigation_generator(row):
    w1=0.5
    w2=0.3
    w3=0.2
    delta=1.1
    SuggestiveStartupBufferDuration=w1*row["StartupBufferLastSession"]+w2*row["AvgStartupBufferToday"]+w3*row["AvgStartupBufferAllTime"]+row["StallCount"]*delta
    SuggestiveRebufferingDuration=w1*row["StartupBufferLastSession"]+w2*row["AvgStartupBufferToday"]+w3*row["AvgStartupBufferAllTime"]+row["StallCount"]*delta
    row["SuggestiveStartBitrate"]=row["LastSessionAvgBitrate"]
    row["SuggestiveStartupBufferDuration"]=SuggestiveStartupBufferDuration if SuggestiveStartupBufferDuration<12 else 12
    row["SuggestiveReBufferingDuration"]=SuggestiveRebufferingDuration if SuggestiveRebufferingDuration<12 else 12
    startup_buffer_upper=50
    stall_count_upper=100
    try:
        row["previous_uei"]=((row["StartupBufferLastSession"]/startup_buffer_upper)*(row["StallCount"]/stall_count_upper))
    except ZeroDivisionError:
        row["previous_uei"]=0
    if "Source" not in row:
        row["Source"]="Local Intelligence"
    return row
def local_mitigation_generator_dynamodb(row):
    w1=0.5
    w2=0.3
    w3=0.2
    delta=1.1
    SuggestiveStartupBufferDuration=w1*row["startup_buffer_duration"]+w2*row["avg_startup_buffer_today"]+w3*row["avg_startup_buffer_all_time"]+row["stall_count"]*delta
    SuggestiveRebufferingDuration=w1*row["startup_buffer_duration"]+w2*row["avg_startup_buffer_today"]+w3*row["avg_startup_buffer_all_time"]+row["stall_count"]*delta
    row["SuggestiveStartBitrate"]=row["last_session_avg_bitrate"]
    row["SuggestiveStartupBufferDuration"]=SuggestiveStartupBufferDuration if SuggestiveStartupBufferDuration<12 else 12
    row["SuggestiveReBufferingDuration"]=SuggestiveRebufferingDuration if SuggestiveRebufferingDuration<12 else 12
    startup_buffer_upper=50
    stall_count_upper=100
    try:
        row["previous_uei"]=((row["startup_buffer_duration"]/startup_buffer_upper)*(row["stall_count"]/stall_count_upper))
    except ZeroDivisionError:
        row["previous_uei"]=0
    if "Source" not in row:
        row["Source"]="Local Intelligence"
    return row
def lambda_handler(event,context):
    global data
    global keys_of_interest
    obj = s3.get_object(Bucket="mitigationinfralambda", Key=event['file_name'])
    keys_of_interest = json.loads(obj['Body'].read())
    updated_keys_of_interest=list(map(local_mitigation_generator_dynamodb,keys_of_interest[list(keys_of_interest.keys())[0]]))
    s3.put_object(Body=json.dumps({list(keys_of_interest.keys())[0]:updated_keys_of_interest}),Bucket='mitigationinfralambda',Key=event['file_name'])
    return {"Status_Code":200,"file_name":event["file_name"]}

print(lambda_handler({'file_name': 'data_for_local_intelligence_lambdaa6ef713d-2775-40b3-864e-b6538e6cb68f.json'},{}))