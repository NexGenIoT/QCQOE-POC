import pandas as pd
import boto3
from boto3.dynamodb.conditions import Attr, And
from functools import reduce
from numpy import average
from report_enums import Fields
from datetime import date
import os
from db_wrapper import AwsDynamodb,AwsAthena,AwsS3
import json
from config import *
s3 = AwsS3()
athena = AwsAthena()
dynamo = AwsDynamodb()


class ReportGenerator:
    def __init__(self, from_time, to_time, before_records, after_records):
        self.from_time = from_time
        self.to_time = to_time
        self.full_report_name = "/tmp/full_data.parquet"
        #self.report_name = "/tmp/report_data.xlsx"
        self.report_name = "/tmp/report_data.csv"
        self.before_records = before_records
        self.after_records = after_records
        self.dynamodb_resource = dynamo.resource
        self.mitigation_fixed_records = pd.DataFrame()
        self.mitigation_raw_data = pd.DataFrame()
        self.report_data = pd.DataFrame()
        self.full_data = pd.DataFrame()
        self.before_cols = []
        self.after_cols = []
        self.raw_columns = Fields.raw_columns.value
        self.calculative_cols = Fields.calculative_cols.value
        self.dynamo_cols = Fields.dynamo_cols.value
        self.required_cols = []
        self.report_cols = []

    def query_filter_builder(self, filters):
        filter = []
        for k, v in filters.items():
            if k == "from_time" and v:
                filter.append(Attr("last_report_time").gte(v))
            elif k == "to_time" and v:
                filter.append(Attr("last_report_time").lte(v))
            else:
                pass
        return filter

    def get_fixed_mitigation_data(self):
        self.table = self.dynamodb_resource.Table(AWS_DYNAMO_TABLE_NAME)
        body = {"from_time": self.from_time, "to_time": self.to_time}
        filter = self.query_filter_builder(body)
        query = self.table.scan(FilterExpression=reduce(And, (filter)))
        response = query['Items']
        while 'LastEvaluatedKey' in query:
            query = self.table.scan(FilterExpression=reduce(And, (filter)), ExclusiveStartKey=query['LastEvaluatedKey'])
            response.extend(query['Items'])
        self.mitigation_fixed_records = pd.DataFrame(response)
        self.mitigation_fixed_records.columns= self.mitigation_fixed_records.columns.str.lower()
        return self.mitigation_fixed_records

    def get_filter_conditions(self,row):
        before_condition = f"\n( udid = '{row['device_id']}' and sessionid = '{row['mitigationgenerationsessionid']}' and record_time < {row['mitigationgenerationtime']}) or \n"
        after_condition = f"( udid = '{row['device_id']}' and sessionid = '{row['mitigationfixedsessionid']}' and record_time > {row['mitigationfixedtime']}) or"
        condition = before_condition + after_condition
        return condition

    def generate_filters_from_dynamo(self):
        filter_df = pd.DataFrame()
        filter_df['filter_crieteria'] = self.mitigation_fixed_records.apply(self.get_filter_conditions,axis=1)
        filter = ' '.join(filter_df['filter_crieteria'].to_list())
        return filter[:-2]

    def query_generator(self):
        query = f"""
                SELECT * FROM qoe_all_payload
                WHERE record_time BETWEEN  {self.from_time} AND  {self.to_time}
                AND rec_type = 'ping'
                AND (
                {self.generate_filters_from_dynamo()}
                )
                order by udid,sessionid,record_time;
        """
        return query

    def get_raw_data(self):
        query = self.query_generator()
        print_log(query)
        self.mitigation_raw_data = athena.get_data(ATHENA_DATABASE_NAME,query)
        self.mitigation_raw_data.columns= self.mitigation_raw_data.columns.str.lower()
        return self.mitigation_raw_data

    def clean_data(self,df):
        df =  df.fillna({col: 0.0 for col in df.columns[df.dtypes.eq('float64')]})
        df =  df.fillna({col: '' for col in df.columns[df.dtypes.eq('object')]})
        df =  df.fillna({col: '' for col in df.columns[df.dtypes.eq('string')]})
        existing_cols_types = df.dtypes
        for col,aggtype in self.raw_columns.items():
            col = col.lower()
            if aggtype in ['SUM','AVG'] and existing_cols_types[col] in ('object','string'):
                df[col] = df[col].apply(lambda x:x if len(str(x))>0 else 0.0)
                df[col] = df[col].astype('float64')
        return df

    def set_required_cols(self):
        self.required_cols.extend(self.dynamo_cols)
        self.required_cols.extend(self.before_cols)
        self.required_cols.extend(self.after_cols)
        self.required_cols.extend(self.calculative_cols)
    
    def set_report_cols(self):
        self.report_cols = Fields.report_cols.value
    
    def get_cols_heading(self):
        self.report_standard_cols = Fields.report_standard_cols.value
        self.report_before_cols = Fields.report_before_cols.value
        self.report_after_cols = Fields.report_after_cols.value
        self.report_calculative_cols = Fields.report_calculative_cols.value
        self.report_view = []
        self.report_view.extend(self.report_standard_cols)
        self.report_view.extend(self.report_before_cols)
        self.report_view.extend(self.report_after_cols)
        self.report_view.extend(self.report_calculative_cols)
        return self.report_view
    
    def color_highlight(self,df):
        color_df = df.copy()
        color_df.loc[:, :] = 'background-color: green'
        color_df[self.report_standard_cols] = 'background-color: #969696'
        color_df[self.report_before_cols] = 'background-color: #FFFFCC'
        color_df[self.report_after_cols] = 'background-color: #CCFFFF'
        color_df[self.report_calculative_cols] = 'background-color: #CCCCFF'
        return color_df
    
    def set_before_after_cols(self):
        self.before_cols = [f"{str(col)}_before" for col in self.raw_columns.keys()]
        self.after_cols = [f"{str(col)}_after" for col in self.raw_columns.keys()]

    def data_aggregator(self,col,aggtype,df):
        col = col.lower()
        agg_value = ''
        if aggtype == "SUM":
            agg_value = df[col].sum()
        elif aggtype == "AVG":
            agg_value = df[col].mean() 
        elif aggtype == "LIST":
            agg_value_list = pd.Series(df[col].unique()).astype(str).values.tolist()
            agg_value = agg_value_list if len(agg_value_list) > 1 else agg_value_list[0]
        elif aggtype == "COUNT":
            agg_value = df['stall'].count()
        return agg_value

    def get_before_data(self,row):
        before_list_values = []
        filtered_df = self.mitigation_raw_data.loc[
            (self.mitigation_raw_data.udid==row['device_id'])&
            (self.mitigation_raw_data.sessionid==row['mitigationgenerationsessionid'])& 
            (self.mitigation_raw_data.record_time < row['mitigationgenerationtime'])]
        if len(filtered_df.index) > 0:
            filtered_df = filtered_df.sort_values(by='record_time', ascending=False)
            filtered_df = filtered_df.head(self.before_records)
            filtered_df.reset_index(inplace=True) 
            for col,aggtype in self.raw_columns.items():
                before_list_values.append(self.data_aggregator(col,aggtype,filtered_df))
        else:
            for i in range(0,len(self.raw_columns)):
                before_list_values.append('NA')
                before_list_values[-1] = 0
        return pd.Series(before_list_values)

    def get_after_data(self,row):
        after_list_values = []
        filtered_df = self.mitigation_raw_data.loc[
            (self.mitigation_raw_data.udid==row['device_id'])&
            (self.mitigation_raw_data.sessionid==row['mitigationfixedsessionid'])& 
            (self.mitigation_raw_data.record_time > row['mitigationfixedtime'])]
        if len(filtered_df.index) > 0:
            filtered_df = filtered_df.sort_values(by='record_time')
            filtered_df = filtered_df.head(self.after_records)
            filtered_df.reset_index(inplace=True) 
            for col,aggtype in self.raw_columns.items():
                after_list_values.append(self.data_aggregator(col,aggtype,filtered_df))
        else:
            for i in range(0,len(self.raw_columns)):
                after_list_values.append('NA')
                after_list_values[-1] = 0
        return pd.Series(after_list_values)
    
    def get_calculative_diff_value(self,actualcol,beforecol,aftercol):
        self.mitigation_fixed_records.loc[
            (self.mitigation_fixed_records[beforecol] != "NA")&
            (self.mitigation_fixed_records[aftercol] != "NA"), 
            actualcol] =self.mitigation_fixed_records.loc[
                            (self.mitigation_fixed_records[beforecol] != "NA")&
                            (self.mitigation_fixed_records[aftercol] != "NA"), 
                            aftercol] - self.mitigation_fixed_records.loc[
                            (self.mitigation_fixed_records[beforecol] != "NA")&
                            (self.mitigation_fixed_records[aftercol] != "NA"), 
                            beforecol]  
        self.mitigation_fixed_records.loc[
            (self.mitigation_fixed_records[beforecol] == "NA")|
            (self.mitigation_fixed_records[aftercol] == "NA"), 
            actualcol] = "NA"
    
    def get_normalized_val(self,lower_bound, upper_bound, value):
        if not (type(lower_bound) in [float, int] and type(upper_bound) in [float, int] and type(value) in [float, int]):
            print_log(type(lower_bound), type(upper_bound), type(value))
            raise TypeError("Bad params, please use input as int or float")
        if (lower_bound < 0 or upper_bound < 0 or value < 0):
            raise ValueError("Cannot Except Negative Values")
        if lower_bound - upper_bound == 0:
            raise ValueError("Bad params, may result in divide by zero error")
        if value < lower_bound:
            value = lower_bound + float(0.0001)
        if value > upper_bound:
            value = upper_bound - float(0.0001)
        denominator = upper_bound - lower_bound
        return (value - lower_bound) / denominator
    
    def calculate_uei(self,row):
        if row[0] != "NA" and row[1] != "NA":
            sbl_normalized = self.get_normalized_val(lower_bound=0, upper_bound=6, value=int(row[0]))
            stall_count_normalized = self.get_normalized_val(lower_bound=0, upper_bound=6, value=int(row[1]))
            sbl_weight = 30
            stall_weight = 70
            values_df = pd.DataFrame([[sbl_normalized, stall_count_normalized]])
            weights_df = pd.DataFrame([[sbl_weight, stall_weight]])
            avg = average(values_df, weights=weights_df)
            normalize_avg = self.get_normalized_val(float("0.001"), float("0.999"), float(avg))
            uei = 1 - normalize_avg
            return int(uei * 100)
        else:
            return "NA"

    def get_increase_percent(self,row):
        return (100*int(row[0]))/int(row[1]) if row[0] != "NA" and row[1] != "NA" and int(row[1]) !=0 else "NA"

    def get_calculative_fields(self):
        self.mitigation_fixed_records['throughput_before_Mbps'] = self.mitigation_fixed_records['throughput_before'].apply(lambda x:x if x =="NA" else x/1024/1024) 
        self.mitigation_fixed_records['bitrate_before_Mbps'] = self.mitigation_fixed_records['bitrate_before'].apply(lambda x:x if x =="NA" else x/1024/1024) 
        self.mitigation_fixed_records['throughput_after_Mbps'] = self.mitigation_fixed_records['throughput_after'].apply(lambda x:x if x =="NA" else x/1024/1024) 
        self.mitigation_fixed_records['bitrate_after_Mbps'] = self.mitigation_fixed_records['bitrate_after'].apply(lambda x:x if x =="NA" else x/1024/1024) 
        self.get_calculative_diff_value('mitigation_time_difference','mitigationgenerationtime','mitigationfixedtime')
        self.get_calculative_diff_value('stall_diff','stall_count_before','stall_count_after')
        self.get_calculative_diff_value('throughput_diff','throughput_before','throughput_after')
        self.get_calculative_diff_value('bitrate_diff','bitrate_before','bitrate_after')
        self.mitigation_fixed_records['throughput_diff_Mbps'] = self.mitigation_fixed_records['throughput_diff'].apply(lambda x:x if x =="NA" else x/1024/1024) 
        self.mitigation_fixed_records['bitrate_diff_Mbps'] = self.mitigation_fixed_records['bitrate_diff'].apply(lambda x:x if x =="NA" else x/1024/1024) 
        self.mitigation_fixed_records['uei_before'] = self.mitigation_fixed_records.loc[:,['sbl_before','stall_count_before']].apply(self.calculate_uei,axis=1)
        self.mitigation_fixed_records['uei_after'] = self.mitigation_fixed_records.loc[:,['sbl_after','stall_count_after']].apply(self.calculate_uei,axis=1)
        self.mitigation_fixed_records['stall_increase_in_per'] = self.mitigation_fixed_records.loc[:,['stall_diff','stall_count_before']].apply(self.get_increase_percent,axis=1)
        self.get_calculative_diff_value('uei_diff','uei_after','uei_before')
        
    def stall_conversion(self,stall):
        try:
            stall = json.loads(stall) if ("count" in stall or "duration" in stall) else stall
            count = int(stall.get('count',0)) if type(stall) is dict else 0
            duration = int(stall.get('duration',0)) if type(stall) is dict else 0
            return pd.Series([count,duration])
        except Exception as e:
            print_log(f"stall_conversion failed {e}")

    def prepare_data(self):
        self.mitigation_raw_data[['stall_count','stall_duration']] = self.mitigation_raw_data['stall'].apply(self.stall_conversion)
        self.mitigation_raw_data = self.clean_data(self.mitigation_raw_data)
        self.set_before_after_cols()
        self.mitigation_fixed_records[self.before_cols] = self.mitigation_fixed_records.apply(self.get_before_data,axis=1)
        self.mitigation_fixed_records[self.after_cols] = self.mitigation_fixed_records.apply(self.get_after_data,axis=1)
        self.get_calculative_fields()
        self.set_required_cols()
        self.full_data = self.mitigation_fixed_records[self.required_cols]
        return self.full_data

    def prepare_excel_report(self):
        self.set_report_cols()
        self.report_data = self.full_data[self.report_cols]
        self.report_data.columns = self.get_cols_heading()
        self.full_data = self.full_data.astype('str')
        self.full_data.to_parquet(self.full_report_name)
        #self.report_data.style.apply(self.color_highlight, axis = None).to_excel(self.report_name, engine='openpyxl',index=False,sheet_name='Local Mitigation Data')
        self.report_data.to_csv(self.report_name)
        return self.report_name

    def upload_report_to_s3(self,report_path,full_report_path,bucket_name):
        todays_date = date.today()
        year,mon = todays_date.year,todays_date.month
        full_report_name = f'rawdata/{year}/{mon}/{self.from_time}_{self.to_time}_{full_report_path.split("/")[2]}'
        report_name = f'data/{year}/{mon}/{self.from_time}_{self.to_time}_{report_path.split("/")[2]}'
        s3.put_s3_object(full_report_name,full_report_path,bucket_name)
        s3.put_s3_object(report_name,report_path,bucket_name)
        return report_name

    def generate_pre_signed_url(self,s3_object,bucket_name,expiration=604800):
        try:
            s3.client.head_object(Bucket=bucket_name, Key=s3_object)
            print_log("object read successful")
            response = s3.client.generate_presigned_url('get_object',Params={'Bucket': bucket_name,'Key': s3_object},ExpiresIn=expiration) 
        except Exception as e:
            print_log(e)
            response = None
        return response
