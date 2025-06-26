import botocore.session
from uuid import uuid4
import time
import random
session = botocore.session.get_session()
dynamodb = session.create_client('dynamodb', region_name="ap-south-1",aws_access_key_id="",aws_secret_access_key= "") # low-level client

for i in range(1,100):
    params = {
                    'TableName': "qoe-dsm-store",
                    'Item': {
                        "device_id": {'S':str(uuid4())},
                        "stall_count":{'S':str(random.randrange(1,100,3))},
                        "startup_buffer_last_session":{'S':str(random.randrange(1,25,3))},
                        "uei":{'N':str(random.randrange(1,9,1)*0.1)},
                        "rebuffering_ratio":{'N':str(random.randrange(1,9,1)*0.1)},
                        "location":{'S':random.choice(["Delhi","Mumbai","Banglore"])},
                        "platform":{'S':random.choice(["Windows","IOS","Android","TV","FireStick"])}
                    }
                }
    dynamodb.put_item(**params)