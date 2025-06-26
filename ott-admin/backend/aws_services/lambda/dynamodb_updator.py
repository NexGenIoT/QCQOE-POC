import os
import urllib3
BASE_URL = os.environ['SYNC_DYNAMODB_API_SERVER_URL'] # dashboard service url
http = urllib3.PoolManager()


def lambda_handler(event,context):
    response = http.request('POST', BASE_URL )
    print("synch dynamodb done")
    print("response :", response)
    return {"Status":200}