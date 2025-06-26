import os
import json
import boto3
LOCAL_MITIGATION_GENERATOR_BUCKET_NAME = os.environ["LOCAL_MITIGATION_GENERATOR_BUCKET_NAME"]
s3 = boto3.client('s3')


def local_mitigation_generator_dynamodb(row):
    w1=0.5
    w2=0.3
    w3=0.2
    delta=1.1
    if ["startup_buffer_duration_all_time","startup_buffer_duration_today","startup_buffer_last_session"] not in list(row.keys()):
        row["startup_buffer_duration_all_time"]=1
        row["startup_buffer_duration_today"]=1
        row["startup_buffer_last_session"]=1
    if "stall_count" not in list(row.keys()):
        row["stall_count"]=0
    SuggestiveStartupBufferDuration=w1*int(row["startup_buffer_last_session"])+w2*int(row["startup_buffer_duration_today"])+w3*int(row["startup_buffer_duration_all_time"])+int(row["stall_count"])*delta
    SuggestiveRebufferingDuration=w1*int(row["startup_buffer_last_session"])+w2*int(row["startup_buffer_duration_today"])+w3*int(row["startup_buffer_duration_all_time"])+int(row["stall_count"])*delta
    try:
        row["SuggestiveStartBitrate"]=row["start_bitrate"]
    except:
        row["SuggestiveStartBitrate"]=1010
    row["SuggestiveStartupBufferDuration"]=SuggestiveStartupBufferDuration if SuggestiveStartupBufferDuration<12 else 12
    row["SuggestiveReBufferingDuration"]=SuggestiveRebufferingDuration if SuggestiveRebufferingDuration<12 else 12
    startup_buffer_upper=50
    stall_count_upper=100
    try:
        row["previous_uei"]=(int(row["startup_buffer_last_session"])/int(startup_buffer_upper))*(int(row["stall_count"])/int(stall_count_upper))
    except:
        row["previous_uei"]=0.5
    if "Source" not in row:
        row["Source"]="Local Intelligence"
    return row


def lambda_handler(event,context):
    global data
    global keys_of_interest
    obj = s3.get_object(Bucket=LOCAL_MITIGATION_GENERATOR_BUCKET_NAME, Key=event['file_name'])
    keys_of_interest = json.loads(obj['Body'].read())
    updated_keys_of_interest=list(map(local_mitigation_generator_dynamodb,keys_of_interest[list(keys_of_interest.keys())[0]]))
    s3.put_object(Body=json.dumps({list(keys_of_interest.keys())[0]:updated_keys_of_interest}),Bucket=LOCAL_MITIGATION_GENERATOR_BUCKET_NAME,Key=event['file_name'])
    return {"Status_Code":200,"file_name":event["file_name"]}