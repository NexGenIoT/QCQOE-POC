import json
import os
import time

from ReportGenerator import ReportGenerator,AWS_S3_BUCKET_NAME
from config import *


def get_from_to_time():
    TO_TIME =(int(time.time() // 86400)) * 86400 
    FROM_TIME = TO_TIME - 86400
    #return 1671710114,1671713714
    return FROM_TIME,TO_TIME

def lambda_handler(event, context):
    FROM_TIME,TO_TIME = get_from_to_time()
    url = f'No Mitigations for the specified time : {FROM_TIME} , {TO_TIME}'
    print_log(f"FROM_TIME,TO_TIME : {FROM_TIME},{TO_TIME}")
    obj = ReportGenerator(FROM_TIME, TO_TIME, BEFORE_RECORDS_COUNT, AFTER_RECORDS_COUNT)
    mitigation_fixed_records = obj.get_fixed_mitigation_data()
    print_log(len(mitigation_fixed_records.index),type(mitigation_fixed_records))
    if mitigation_fixed_records.shape[0] > 0 :
        mitigation_raw_data = obj.get_raw_data()
        print_log(len(mitigation_raw_data.index),type(mitigation_raw_data))
        if mitigation_raw_data.shape[0] > 0:
            full_data= obj.prepare_data()
            if full_data.shape[0] > 0:
                report_name = obj.prepare_excel_report()
                object_name= obj.upload_report_to_s3(obj.report_name,obj.full_report_name,AWS_S3_BUCKET_NAME)
                print_log(object_name,AWS_S3_BUCKET_NAME)
                url= obj.generate_pre_signed_url(object_name,AWS_S3_BUCKET_NAME)
                print_log("url :", url)
    return {
        'statusCode': 200,
        'body': json.dumps(f'Pre Signed Url - {url}')
    }
