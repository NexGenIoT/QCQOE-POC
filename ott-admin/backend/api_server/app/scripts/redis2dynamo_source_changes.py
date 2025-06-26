from rediscluster import RedisCluster
import os
import json
from uuid import uuid4
import boto3    
import urllib3

http = urllib3.PoolManager()

#url = 'http://3.108.121.176:5002/api/get_startup_buffer'
#myobj = {"device_ids":{"8e725d35-3464-445f-bfbf-4e9f2da58409":"13c2257b-5cec-4b0a-8628-cfc4137ceaf1","42ea053c-2412-4dd6-8cc8-71fcaf60ee45":"df3aab8e-b934-4bbd-969f-72414aef3b20"}}
#x = requests.post(url, json= myobj)
#print(x.text)
s3 = boto3.client('s3', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "")

REDIS_HOST="clustercfg.qoe-memorydb.ebvbgv.memorydb.ap-south-1.amazonaws.com"
REDIS_PORT=6379

#redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],decode_responses=True,skip_full_coverage_check=True)
redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                  decode_responses=True,
                  skip_full_coverage_check=True,
                  ssl=True)
def list_keys_from_dynamodb(stall_threshold,uei_threshold,tablename):
    dynamodb = boto3.client('dynamodb', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "")
    #resp = dynamodb.execute_statement(Statement='SELECT * FROM "{0}" WHERE stall_count>{1} and uei<{2}'.format(tablename,str(stall_threshold),str(uei_threshold)))
    resp = dynamodb.execute_statement(Statement='SELECT * FROM "{0}"'.format(tablename))
    updated_data=[]
    if len(resp["Items"])>0:
        for j in resp["Items"]:
            json_data={}
            for i in j.keys():
                dtype=list(j[i].keys())[0]
                if dtype=="N":
                    json_data[i]=float(j[i][dtype])
                else:
                    json_data[i]=str(j[i][dtype])
            updated_data.append(json_data)
    keys_of_interest={}
    c=0
    if len(updated_data)>0:
        print("entering")
        for i in updated_data:
            data=i
            if c<=999 and c>0:
                    data["LocalMitigationID"]=str(uuid4())
                    data["GroupMitigationID"]=str(GroupMitigationID)
                    list_of_local_mitigations.append(data)
                    keys_of_interest[GroupMitigationID]=list_of_local_mitigations
                    c+=1
            elif c==0 :
                GroupMitigationID=str(uuid4())
                list_of_local_mitigations=[]
                data["LocalMitigationID"]=str(uuid4())
                data["GroupMitigationID"]=str(GroupMitigationID)
                list_of_local_mitigations.append(data)
                c+=1
            elif c>999:
                list_of_local_mitigations=[]
                data["LocalMitigationID"]=str(uuid4())
                data["GroupMitigationID"]=str(GroupMitigationID)
                list_of_local_mitigations.append(data)
                keys_of_interest[GroupMitigationID]=list_of_local_mitigations
                c=1
        print(keys_of_interest)
        return keys_of_interest
    else:
        return {}

def list_keys_from_redis(stall_threshold,uei_threshold,pattern="qoe_dsm_ds_*"):
    updated_data=[]
    body_for_startup_buffer={}
    keys_of_interest={}
    c=0
    data_points_count=0
    for key in redis.scan_iter(pattern):
        data=redis.hgetall(str(key))
        try:
            body_for_startup_buffer[data["current_session_id"]]=data["device_id"]
            updated_data.append(data)
        except:
            continue
    #response=requests.post("http://3.108.121.176:5002/api/get_startup_buffer", data = {"device_ids":body_for_startup_buffer})
    response = http.request('POST',
                        "http://3.108.121.176:5002/api/get_startup_buffer",
                        body = json.dumps({"device_ids":body_for_startup_buffer}),
                        headers = {'Content-Type': 'application/json'},
                        retries = False)
    response=json.loads(response.data.decode("utf-8"))
    #print(body_for_startup_buffer)
    #print(updated_data)
    if len(updated_data)>0:
        #print("entering")
        for i in updated_data:
            #print(i)
            if len(response)==0:
                data["startup_buffer_duration_all_time"]=1
                data["startup_buffer_duration_today"]=1
                data["startup_buffer_last_session"]=1
            else:
                for j in response:
                    data=i
                    if len(response)>0 and i["device_id"]==j["device_id"]:
                        data["startup_buffer_duration_all_time"]=j["startup_buffer_duration_all_time"]
                        data["startup_buffer_duration_today"]=j["startup_buffer_duration_today"]
                        data["startup_buffer_last_session"]=j["startup_buffer_last_session"]
                    else:
                        data["startup_buffer_duration_all_time"]=1
                        data["startup_buffer_duration_today"]=1
                        data["startup_buffer_last_session"]=1

            if c<=999 and c>0:
                    data["LocalMitigationID"]=str(uuid4())
                    data["GroupMitigationID"]=str(GroupMitigationID)
                    list_of_local_mitigations.append(data)
                    keys_of_interest[GroupMitigationID]=list_of_local_mitigations
                    c+=1
            elif c==0 :
                GroupMitigationID=str(uuid4())
                list_of_local_mitigations=[]
                data["LocalMitigationID"]=str(uuid4())
                data["GroupMitigationID"]=str(GroupMitigationID)
                list_of_local_mitigations.append(data)
                keys_of_interest[GroupMitigationID]=list_of_local_mitigations
                c+=1
            elif c>999:
                list_of_local_mitigations=[]
                data["LocalMitigationID"]=str(uuid4())
                data["GroupMitigationID"]=str(GroupMitigationID)
                list_of_local_mitigations.append(data)
                keys_of_interest[GroupMitigationID]=list_of_local_mitigations
                c=1
        return keys_of_interest
    else:
        return {}

def list_keys(stall_threshold,uei_threshold,pattern="localMitigation*"):
    keys_of_interest={}
    c=0
    for key in redis.scan_iter(pattern):
        if c<=999 and c>0:
            data=redis.get(key)
            data=json.loads(data)
            if int(data["StallCount"])>stall_threshold or int(data["UEI"])<uei_threshold:
                data["LocalMitigationID"]=str(uuid4())
                data["GroupMitigationID"]=str(GroupMitigationID)
                data["RedisKey"]=key
                list_of_local_mitigations.append(data)
                c+=1
        elif c==0 :
            GroupMitigationID=str(uuid4())
            list_of_local_mitigations=[]
            data=redis.get(key)
            data=json.loads(data)
            if int(data["StallCount"])>stall_threshold or int(data["UEI"])<uei_threshold:
                data["LocalMitigationID"]=str(uuid4())
                data["GroupMitigationID"]=str(GroupMitigationID)
                data["RedisKey"]=key
                list_of_local_mitigations.append(data)
                c+=1
        else:
            keys_of_interest[GroupMitigationID]=list_of_local_mitigations
            list_of_local_mitigations=[]
            c=0
            
    return keys_of_interest
print(list_keys_from_redis(4,0.4,"qoe_dsm_ds_*"))
def lambda_handler(event,context):
    #data=distribute_load() # if len of list represent number of lambda's required
    #keys_of_interest=list_keys(4,0.4) #save in data store 
    keys_of_interest=list_keys_from_dynamodb(0,1,"qoe-dsm-store")
    keys_of_interest=list_keys_from_redis(4,0.4,"qoe_dsm_ds_*")
    file_list=[]
    if len(keys_of_interest)>0:
        for i in keys_of_interest.keys():
            file_name='data_for_local_intelligence_lambda'+str(i)+'.json'
            s3.put_object(
                 Body=json.dumps({i:keys_of_interest[i]}),
                 Bucket='mitigationinfralambda',
                 Key=file_name
            )
            file_list.append({"file_name":file_name})

        return {"Status_Code":200,"size":str(len(keys_of_interest.keys())),"data_file":file_list}
    else:
        return {"Status_Code":200,"size":str(len(keys_of_interest.keys())),"data_file":""}
