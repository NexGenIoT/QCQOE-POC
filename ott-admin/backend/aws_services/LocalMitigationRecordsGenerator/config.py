import os
BEFORE_RECORDS_COUNT = int(os.environ["BEFORE_RECORDS_COUNT"])
AFTER_RECORDS_COUNT = int(os.environ["AFTER_RECORDS_COUNT"])
ATHENA_DATABASE_NAME = os.environ["ATHENA_DATABASE_NAME"]
AWS_S3_BUCKET_NAME = os.environ["AWS_S3_BUCKET_NAME"]
AWS_DYNAMO_TABLE_NAME = os.environ["AWS_DYNAMO_TABLE_NAME"]
DEBUG = os.environ["DEBUG"]

def print_log(*args):
    if DEBUG == True:
        print(*args)