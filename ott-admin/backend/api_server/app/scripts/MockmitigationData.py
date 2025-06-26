from rediscluster import RedisCluster
import shortuuid
import os
import amazondax
import botocore.session
import random 
import json
import collections
from rediscluster import RedisCluster
#REDIS_HOST = "qoeelasticcache.ebvbgv.clustercfg.aps1.cache.amazonaws.com"
#REDIS_PORT = "6379"
REDIS_HOST="clustercfg.qoe-memorydb.ebvbgv.memorydb.ap-south-1.amazonaws.com"
REDIS_PORT=6379

#redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],decode_responses=True,skip_full_coverage_check=True)
redis = RedisCluster(startup_nodes=[{"host": REDIS_HOST, "port": REDIS_PORT}],
                  decode_responses=True,
                  skip_full_coverage_check=True,
                  ssl=True)
#redis = StrictRedisCluster(startup_nodes={"host": REDIS_HOST, "port": REDIS_PORT}, decode_responses=True)
region = os.environ.get('AWS_DEFAULT_REGION', 'us-west-2')
session = botocore.session.get_session()
dynamodb = session.create_client('dynamodb', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "") # low-level client


class MockRedis:
    def __init__(self):
        self.udid=shortuuid.ShortUUID().random(length=22)
        self.startup_buffer_upper=50
        self.stall_count_upper=100
        self.startup_buffer=random.randrange(0,50,1)
        self.stall_count=random.randrange(0,20,1)
        self.uei=((self.startup_buffer/self.startup_buffer_upper)*(self.stall_count/self.stall_count_upper))
        self.sessionid=shortuuid.ShortUUID().random(length=20)
        self.lastupdated=0
        self.mitigationid=0
        self.localmitigationid=0
        self.localappliedmitigationid=0
        self.localappliedmitigationtime=0
        self.deviceconfig={}
        self.lastmitigationdeploymentstatus=0
    def data(self):
        return {"UDID":self.udid,
          "StartupBufferLastSession":self.startup_buffer,
          "UEI":self.uei,
          "StallCount":self.stall_count,
          "SessionID":self.sessionid,
          "LastUpdated":'',
          "MitigationID":'',
          "LocalMitigationID":'',
          "LocalAppliedMitigationID":'',
          "LocalAppliedMitigationTime":'',
          "DevicePlatform":random.choice(["Windows","iOS","Android"]),
          "DeviceConfig":{},
          "LastMitigationDeploymentStatus":'',
          "AvgStartupBufferToday":random.randrange(0,50,1),
          "AvgStartupBufferAllTime":random.randrange(0,50,1),
          "LastSessionAvgBitrate":random.randrange(10000,40000,444)
          }
    
def generate_data():
    for i in range(2500):
        mock_data=MockRedis()
        redis.set("localMitigation"+"_"+mock_data.data()["SessionID"]+"_"+mock_data.data()["UDID"],json.dumps(mock_data.data()))

def search_key(key):
    data=redis.get(key)
    if data is not None:
        data=json.loads(data)
        return data
    else:
        return {}
"""
def list_keys(stall_threshold,uei_threshold,pattern="localMitigation*"):
    keys_of_interest={}
    c=0
    k=0
    for key in redis.scan_iter(pattern):
        k+=1
        if c<=999 and c>0:
            data=redis.get(key)
            data=json.loads(data)
            if int(data["StallCount"])>stall_threshold or int(data["UEI"])<uei_threshold:
                data["LocalMitigationID"]=str(uuid4())
                list_of_local_mitigations.append(data)
                c+=1
        elif c==0 :
            GroupMitigationID=str(uuid4())
            list_of_local_mitigations=[]
            data=redis.get(key)
            data=json.loads(data)
            if int(data["StallCount"])>stall_threshold or int(data["UEI"])<uei_threshold:
                data["LocalMitigationID"]=str(uuid4())
                list_of_local_mitigations.append(data)
                c+=1
        else:
            print("Count",c)
            keys_of_interest[GroupMitigationID]=list_of_local_mitigations
            list_of_local_mitigations=[]
            c=0
            
    print(k)    
    return keys_of_interest
"""
#-------------------------------------- 1

def list_keys(stall_threshold,uei_threshold,pattern="qoe_dsm_ds_*"):
    keys_of_interest={}
    c=0
    k=0
    for key in redis.scan_iter(pattern):
        k+=1
        print(key)
        #redis.delete(key)
        data=redis.hgetall(str(key))
        #data=json.loads(data)
        print(data)
        ##print(data)
        #if int(data["StallCount"])>stall_threshold or int(data["UEI"])<uei_threshold:
        ##    keys_of_interest[key]=data
        #    c+=1
    print("Count:",k)
    return keys_of_interest

def generate_local_mitigationid(data):
    return {data:shortuuid.uuid(data)}

def generate_global_mitigationid(data):
    return {shortuuid.uuid(str(data)):list(map(generate_local_mitigationid,data))}

def distribute_load():
    koi=list(list_keys(4,0.4).keys())
    n=10
    final = [koi[i * n:(i + 1) * n] for i in range((len(koi) + n - 1) // n )] 
    return list(map(generate_global_mitigationid,final))
    print(list(map(generate_global_mitigationid,final))[0].keys())


#----------------------------------------------------------------2

def local_mitigation_generator(data):
    row=keys_of_interest[list(data.keys())[0]]
    w1=0.8
    w2=0.4
    w3=0.2
    delta=0.1
    return {"UDID":row["UDID"],"SuggestiveStartupBufferLength":w1*row["StartupBufferLastSession"]+w2*row["AvgStartupBufferToday"]+w3*row["AvgStartupBufferAllTime"]+row["StallCount"]*delta,"LocalMitigationID":data[list(data.keys())[0]],"Source":"local intelligence","RedisKey":list(data.keys())[0]}


#----------------------------------------------------------------3

#if args.source==local intelligence
def data_to_mitigationdb(data):
    params = {
                'TableName': "mitigationDB_poc",
                'Item': {
                    "LocalMitigationID": {'S': data["LocalMitigationID"]},
                    "DeviceID":{"S":data["UDID"]},
                    "GroupMitigationID":{'S':group_mitigation_id},
                    "Source":{'S':data["Source"]}
                }
            }
    dynamodb.put_item(**params)
    keys_of_interest[data["RedisKey"]].update({"LocalMitigationID":data["LocalMitigationID"]})
    keys_of_interest[data["RedisKey"]].update({"DeviceConfig":{"SuggestiveStartupBufferLength":data["SuggestiveStartupBufferLength"]}})
    redis.set(data["RedisKey"],json.dumps(keys_of_interest[data["RedisKey"]]))
    return True

#load data_after_formula and key_of_interest from data store
#data=distribute_load() # if len of list represent number of lambda's required
#keys_of_interest=list_keys(4,0.4) #save in data store 
"""
#print(len(keys_of_interest))
#load key_of_intereset from data store
data_after_formula=list(map(local_mitigation_generator,data[0][list(data[0].keys())[0]]))
group_mitigation_id=list(data[0].keys())[0]
list(map(data_to_mitigationdb,data_after_formula))
"""






#print(search_key("localMitigation_66WgLfSDkJv3mzRFYGmz_3nnQYMr8FpMFms5nCqeW84"))
#generate_data()
list_keys(4,0.4)

