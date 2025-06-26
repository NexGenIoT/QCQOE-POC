import os
import json
import boto3

from pandas import DataFrame
from numpy import average

BUCKET_NAME = os.environ["BUCKET_NAME"]

MAX_SBL_VALUE, MIN_SBL_VALUE = 12, 5
MAX_RBL_VALUE, MIN_RBL_VALUE = 12, 5
DEVICE_SBL_VALUES = {
    'Android': {'max_sbl': 12, 'min_sbl': 5},
    'Web': {'max_sbl': 12, 'min_sbl': 5},
    'IOS': {'max_sbl': 12, 'min_sbl': 5},
    'FireTV': {'max_sbl': 12, 'min_sbl': 5},
    'Default': {'max_sbl': 12, 'min_sbl': 5}
}
DEVICE_RBL_VALUES = {
    'Android': {'max_rbl': 12, 'min_rbl': 5},
    'Web': {'max_rbl': 12, 'min_rbl': 5},
    'IOS': {'max_rbl': 12, 'min_rbl': 5},
    'FireTV': {'max_rbl': 12, 'min_rbl': 5},
    'Default': {'max_rbl': 12, 'min_rbl': 5}
}
DEFAULT_BITRATE = 1000000

s3 = boto3.client('s3')


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


def local_mitigation_generator(row):
    print(f"{row['device_id']} Before process : {row}")
    w1, w2, w3, delta = 0.5, 0.3, 0.2, 1.1
    row["SuggestiveStartupBufferDuration"] = max(
        min(
            (w1 * int(row.get("sbl_last_session", 4)) \
             + w2 * int(row.get("sbl_today", 4)) \
             + w3 * int(row.get("sbl_all_time", 4)) \
             + delta * int(row.get("sbl_last_session", 4))),
            DEVICE_SBL_VALUES.get(row["platform"], DEVICE_SBL_VALUES['Default'])['max_sbl']),
        DEVICE_SBL_VALUES.get(row["platform"], DEVICE_SBL_VALUES['Default'])['min_sbl'])
    row["SuggestiveRebufferingDuration"] = max(
        min(
            (w1 * int(row.get("sbl_last_session", 4)) \
             + w2 * int(row.get("sbl_today", 4)) \
             + w3 * int(row.get("sbl_all_time", 4)) \
             + delta * int(row.get("sbl_last_session", 4))),
            DEVICE_RBL_VALUES.get(row["platform"], DEVICE_RBL_VALUES['Default'])['max_rbl']),
        DEVICE_RBL_VALUES.get(row["platform"], DEVICE_RBL_VALUES['Default'])['min_rbl'])
    row["SuggestiveStartBitrate"] = row.get("start_bitrate", DEFAULT_BITRATE)
    row["previous_uei"] = calculate_uei(int(row.get("sbl_last_session", 4)),
                                        int(row.get("stall_count_last_session", 0)))
    print(f"{row['device_id']} After process : {row}")
    return row


def lambda_handler(event, context):
    global data
    global keys_of_interest
    print(f"event {event}")
    file_list = []
    for i in event['data_files']:
        file_name = i['file_name']
        print(f"Processing File ---> {file_name}")
        obj = s3.get_object(Bucket=BUCKET_NAME, Key=file_name)
        keys_of_interest = json.loads(obj['Body'].read())
        gid = list(keys_of_interest.keys())[0]
        print(f"gid is -----> {gid}")
        updated_keys_of_interest = list(map(local_mitigation_generator, keys_of_interest[gid]))
        s3.put_object(Body=json.dumps({gid: updated_keys_of_interest}), Bucket=BUCKET_NAME, Key=file_name)
        file_list.append({"file_name": file_name})
    print(f"file_list is {file_list}")
    return {"Status_Code": 200, "data_files": file_list}
