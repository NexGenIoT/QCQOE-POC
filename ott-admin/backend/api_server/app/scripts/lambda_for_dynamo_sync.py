from boto3.dynamodb.conditions import Key
import boto3
import pandas as pd
import sqlite3
import numpy as np
import random
from sqlalchemy import create_engine
import time
dynamodb = boto3.client('dynamodb', region_name="ap-south-1",aws_access_key_id="AKIAWZG524Z4PKWJFIQU",aws_secret_access_key= "")
resp = dynamodb.execute_statement(Statement='SELECT * FROM qoe_dsm_store1 ')
data=[]
for i in range(len(resp["Items"])):
        row_data={}
        for j in resp["Items"][i]:
            if j=="last_report_time":
                row_data[j]=int(float(resp["Items"][i][j][list(resp["Items"][i][j].keys())[0]]))
            else:
                row_data[j] = resp["Items"][i][j][list(resp["Items"][i][j].keys())[0]]
        data.append(row_data)
df=pd.DataFrame(data)

"""
df=pd.DataFrame(resp["Items"])
df=df.fillna(pd.Series({'N':0}))
#df=df.replace(np.nan,pd.Series({'N':0}))
df=df.applymap(lambda x: {'N':1} if x=='NaN' else x)
print(df)
df=df.applymap(lambda x:str(list(x.values())[0]) if list(x.keys())[0]=="S" else float(list(x.values())[0]))
"""
disk_engine = create_engine("sqlite:///my_lite_store.db")
sqllite_db_name = "sql_temp"
con = sqlite3.connect('my_lite_store.db')
cur = con.cursor()


#db = Sqlite(conn={"db_name": sqllite_db_name})
#db.build_db_from_df(df=res, table_name="dsm")

df.to_sql("dsm", disk_engine, if_exists="replace", index=False)
#"""SELECT group_mitigation_id, AVG(UEI), count(distinct (case when mitigation_status = "FIXED" then session_id end)) from dsm GROUP BY group_mitigation_id"""
for row in cur.execute(
        """SELECT group_mitigation_id, AVG(previous_uei),AVG(current_uei), count(distinct (case when mitigation_status = "FIXED" then session_id end)) from dsm GROUP BY group_mitigation_id"""
    ):
    if row[3]>0:
        print(row)
        if row[1]==None :
            try:
                query='UPDATE mitigation_history_screen_level1 SET PreviousUEI=\'{}\' SET CurrentUEI=\'{}\' SET ImpactedSessions=\'{}\' WHERE GroupMitigationID=\'{}\''.format("NA","NA",row[3],row[0])
                print(query)
                resp = dynamodb.execute_statement(Statement=query)
                print(resp)
            except:
                continue
        elif row[0]!="NULL":
            try:
                query='UPDATE mitigation_history_screen_level1 SET PreviousUEI=\'{}\' SET CurrentUEI=\'{}\' SET ImpactedSessions=\'{}\' WHERE GroupMitigationID=\'{}\''.format(row[1],row[2],row[3],row[0])
                print(query)
                resp = dynamodb.execute_statement(Statement=query)
                print(resp)
            except:
                continue
#print(len(resp['Items']))