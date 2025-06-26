import sys
import os
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(os.path.dirname(parent))

import re 
import pandas as pd
from uuid import uuid4
import time 
from app.controllers.config import settings

class UtilityWrapper:
    def __init__(self):
        self.email_pattern =  '^[A-Za-z][A-Za-z0-9_.]{0,30}@[A-Za-z]{1,20}[.][A-Za-z]{1,10}$'

    def email_validator(self,email_list):
        valid_email_list = set()
        for email in email_list:
            if re.search(self.email_pattern, email):
                valid_email_list.add(email)
        return list(valid_email_list) 
    
    def convert_recepients(self,recepients):
        recepients_list = []
        for record in recepients:
            for email_record in record.values():  
                email_list = self.email_validator(email_record.split(","))
                if len(email_list>0):
                    recepients_list.extend(email_list)
        return recepients_list

class PrepareEmail:
    def __init__(self,req_body):
        self.email_pattern =  '^[A-Za-z][A-Za-z0-9_.]{0,30}@[A-Za-z]{1,20}[.][A-Za-z]{1,10}$'
        self.subject = "AI Mitigation records"
        self.records = req_body['records']
        self.body = req_body['body']
        self.planname = req_body['plan_name']

    def generate_subject(self):
        return self.subject 
    
    def generate_records_df(self):
        return  pd.DataFrame(self.records)

    def generate_body(self,url):
        return str(self.body +  f" \n Please find the attached url {url}")

class PrepareDynamoRecord():
    def __init__(self,s3_path,email_obj):
        self.gid = str(uuid4())
        self.timestamp  = int(time.time())
        self.num_of_records = len(email_obj.records)
        self.s3_path = f"{settings.MITIGATION_RECORDS_S3_BUCKET}/{s3_path}"
        self.ai_mitigation_record = {}
        self.mitigation_screen_level_1_record = {}

    def prepare_mitigation_screen_level_1_record(self):
        self.mitigation_screen_level_1_record = {
            'GroupMitigationID' : self.gid,
            'AppliedOn' : self.num_of_records,
            'CurrentUEI' : 0,
            'ImpactedSessions' : 0,
            'PreviousUEI' : 0,
            'Source' : settings.MITIGATION_SOURCE_NAME,
            'Time_Stamp' : self.timestamp 
        } 
        return self.mitigation_screen_level_1_record

    def prepare_ai_mitigation_record(self,email_obj,recepients_list): 
        self.ai_mitigation_record = {
            'GroupMitigationID' : self.gid,
            'Recipient_List' : recepients_list,
            'Created_At' : self.timestamp ,
            'Planname' : email_obj.planname,
            'S3FilePath' : self.s3_path,
            'NumOfRecords' : self.num_of_records ,
            'Body' : email_obj.body
        }
        return self.ai_mitigation_record