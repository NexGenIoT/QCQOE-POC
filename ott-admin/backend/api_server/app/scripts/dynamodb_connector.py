from __future__ import print_function
import os
import amazondax
import botocore.session
from matplotlib.pyplot import table

region = os.environ.get('AWS_DEFAULT_REGION', 'us-west-2')

session = botocore.session.get_session()
dynamodb = session.create_client('dynamodb', region_name="ap-south-1",aws_access_key_id="",aws_secret_access_key= "") # low-level client



def create_table(table_name):
    params = {
        'TableName' : table_name,
        'KeySchema': [       
            { 'AttributeName': "pk", 'KeyType': "HASH"},    # Partition key
            { 'AttributeName': "sk", 'KeyType': "RANGE" }   # Sort key
        ],
        'AttributeDefinitions': [       
            { 'AttributeName': "pk", 'AttributeType': "N" },
            { 'AttributeName': "sk", 'AttributeType': "N" }
        ],
        'ProvisionedThroughput': {       
            'ReadCapacityUnits': 10, 
            'WriteCapacityUnits': 10
        }
    }

    dynamodb.create_table(**params)
    print('Waiting for', table_name, '...')
    waiter = dynamodb.get_waiter('table_exists')
    waiter.wait(TableName=table_name)

def write_data(table_name):
            params = {
                'TableName': table_name,
                'Item': {
                    "LocalMitigationID": {'S': str("Cedced")},
                    "CurrentSessionID": {'S': str("cedcedc")},
                    "CurrentUEI":{'N':str(0.4)},
                    "DeploymentStatus":{'S':"Inprogress"},
                    "DeviceID":{"S":"wdcdwcwecwed23d3e3"},
                    "GroupMitigationID":{'S':"dsdcsdcsd"},
                    "PreviousSessionID":{'S':"ecdcdced3"},
                    "PreviousUEI":{'N':str(0.45)},
                    "Source":{'S':"Manual"}

                }
            }
            dynamodb.put_item(**params)
            print("PutItem ({}, {}) suceeded".format(ipk, isk))



if __name__=="__main__":
    table="mitigationDB_poc"
    #create_table(table)
    write_data(table)