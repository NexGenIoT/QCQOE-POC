import os
import base64
from opensearchpy import OpenSearch
import urllib3
from aws_kinesis_agg.deaggregator import iter_deaggregate_records

OS_HOST = os.environ['OS_HOST']
OS_PORT = os.environ['OS_PORT']
OS_USER = os.environ['OS_USER']
OS_PASSWORD = os.environ['OS_PASSWORD']
FLINK_ES_INDEX_NAME = os.environ["FLINK_ES_INDEX_NAME"]
auth = (OS_USER, OS_PASSWORD)

http = urllib3.PoolManager()


client = OpenSearch(
    hosts=[{'host': OS_HOST, 'port': OS_PORT}],
    http_compress=True,  # enables gzip compression for request bodies
    http_auth=(OS_USER, OS_PASSWORD),
    use_ssl=True,
    verify_certs=True,
    ssl_assert_hostname=False,
    ssl_show_warn=False
)

def lambda_handler(event, context):
    raw_kinesis_records = event['Records']
    count = 0

    for record in iter_deaggregate_records(raw_kinesis_records):
        message = base64.b64decode(record['kinesis']['data'])
        message = message.decode("utf-8")
        print("message is :", message)
        # Create the JSON document
        response = client.index(
            index=FLINK_ES_INDEX_NAME,
            body=message,
            refresh=True
        )

        print(response)
        count += 1
    return 'Processed ' + str(count) + ' items.'