from urllib import response
import boto3
from boto3.dynamodb.conditions import Key
import pandas as pd
TABLE_NAME = "mitigationDB_poc"

# Creating the DynamoDB Client
from_time=1647434717
to_time=1647520991
dynamodb = boto3.client('dynamodb', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "")
resp = dynamodb.execute_statement(Statement='SELECT * FROM mitigationDB_poc WHERE DeploymentStatus=\'Applied\' and DevicePlatform=\'Windows\' and Time_Stamp>'+str(from_time)+' and Time_Stamp<='+str(to_time)+'')
print("Windows",len(resp['Items']))
print(resp["Items"])
rows=[]
data=resp["Items"]
updated_data=[]
for j in data:
    json_data={}
    for i in j.keys():
        json_data[i]=j[i][list(j[i].keys())[0]] 
    updated_data.append(json_data)
df=pd.DataFrame(updated_data)
df["Time_Stamp"]=pd.to_datetime(df["Time_Stamp"],unit='s')

resp = dynamodb.execute_statement(Statement='SELECT * FROM mitigationDB_poc WHERE DeploymentStatus=\'Applied\' and DevicePlatform=\'iOS\' and Time_Stamp>'+str(from_time)+' and Time_Stamp<='+str(to_time)+'')
print("iOS",len(resp['Items']))
resp = dynamodb.execute_statement(Statement='SELECT * FROM mitigationDB_poc WHERE DeploymentStatus=\'Applied\' and DevicePlatform=\'Android\' and Time_Stamp>'+str(from_time)+' and Time_Stamp<='+str(to_time)+'')
print("Android",len(resp['Items']))

resp = dynamodb.execute_statement(Statement='SELECT * FROM mitigationDB_poc WHERE CurrentUEI>PreviousUEI')
print("Increment In UEI",len(resp['Items']))
print(resp["Items"][0])

resp = dynamodb.execute_statement(Statement='SELECT * FROM mitigationDB_poc WHERE Time_Stamp>'+str(from_time)+' and Time_Stamp<='+str(to_time)+'')
print("Number Of Records In the Interval",len(resp['Items']))