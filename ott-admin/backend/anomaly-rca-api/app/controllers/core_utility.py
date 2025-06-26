import sys
import os
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(os.path.dirname(parent))

import pandas as pd
import json 
import re 
from decimal import Decimal

from app.controllers.config import logger
from app.controllers.constants import AthenaFilterENUM

def parse_pegination_request(request_body):
    max_items = request_body.get("max_items", 50)
    execution_id = request_body.get("execution_id", None)
    next_token = request_body.get("next_token", None)
    return max_items, execution_id, next_token

def generate_query_v2(body,from_time,to_time):
    try:
        required_fields = '*' if 'groupby' not in body.keys() else 'count(sessionid) as anomaly_count,sessionid,device_id,max(dts) as datetime'
        groupby_clause = '' if 'groupby' not in body.keys() else 'group By sessionid,device_id'
        outer_query = '' if 'groupby' not in body.keys() else 'select a.*,b.sessionduration from ( '
        inner_query = '' if 'groupby' not in body.keys() else f"""
            ) as a
            inner join 
            (
            select sessionid,max(totaldurationofplayback) as sessionduration  
                from qoe_all_payload
                where udid='{body['filters']['device_id'][1]}'
                group by sessionid
            ) as b 					
            on a.sessionid = b.sessionid
        """
        sql = f"""
                    {outer_query}
                    select 
                        {required_fields}
                        from anomalyParquet
                        where anomaly_id IN (
                        Select 
                            distinct anomaly_id 
                            from anomalyParquet
                            where dts between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}'
                            {sql_filter_generator(body.get('filters',{}),where_cond=True)}
                        EXCEPT
                        Select 
                            distinct anomaly_id 
                            from qoe_anomaly_label_records 
                            {sql_filter_generator(body.get('filters',{}),where_cond=False)})
                    {groupby_clause}
                    {inner_query};
            """
        logger.info(sql)
        return sql
    except Exception as e:
        logger.exception(f"Exception: {e}")


def generate_query_for_playbackfailure(body,from_time,to_time):
    query = f" SELECT * FROM anomalyparquetplaybackfailure where  dts between TIMESTAMP '{from_time}' and TIMESTAMP '{to_time}'"
    query += f"{sql_filter_generator(body.get('filters',{}),where_cond=True)} ;"
    return query

def anomaly_score_conversion(body,api_type):
    if api_type == 'Dynamo':
        if 'filters' in body.keys() and "ANOMALY_SCORE" in body['filters'].keys():
            if isinstance(body['filters']["ANOMALY_SCORE"][1],list):
                body['filters']["ANOMALY_SCORE"][1] = [Decimal(val) for val in body['filters']["ANOMALY_SCORE"][1]]
            else:
                body['filters']["ANOMALY_SCORE"][1] = Decimal(body['filters']["ANOMALY_SCORE"][1])
    elif api_type == 'Athena':
        if 'filters' in body.keys() and "ANOMALY_SCORE" in body['filters'].keys():
            if isinstance(body['filters']["ANOMALY_SCORE"][1],list):
                body['filters']["ANOMALY_SCORE"][1] = [float(val) for val in body['filters']["ANOMALY_SCORE"][1]]
            else:
                body['filters']["ANOMALY_SCORE"][1] = float(body['filters']["ANOMALY_SCORE"][1])
    return body

def default_value_df(response):
    response['is_approved'] = response.get('is_approved', 0)
    response['error_count'] = response.get('error_count', 0)
    if "anomaly_type" in list(response.columns):
        response['anomaly_type'] = response.get('anomaly_type', lambda x:"NULL" if 'NA' in str(x) else x)
    return response
        
def describe(anomaly_explanation, anomaly_score):
    try:
        for this_key, nested_dict in anomaly_explanation.items():
            attribtion_score = float(nested_dict["ATTRIBUTION_SCORE"])
            attribution_percentage = round(float(attribtion_score)/anomaly_score*100, 2)
            sensititivity_threshold_attr = 30
            score_sensitivity = attribution_percentage > sensititivity_threshold_attr
            strength = float(nested_dict["STRENGTH"])
            confidence_threshold = 1
            confidence = "HIGH" if strength > confidence_threshold else "LOW"
            if score_sensitivity:
                line_1 = f"Analyzing the parameter {this_key}"
                line_2 = f", we see that it is contributing {attribution_percentage} % to the detected anomaly score of {anomaly_score}"
                line_3 = f". Considering that the sensitivity threshold for this value is greater than {sensititivity_threshold_attr} we believe it is a relevant indicator for the detected anomaly" 
                line_4 = f""". However, with a {confidence} level of confidence computed by strength: {strength}, we can say that this value is relatively {nested_dict["DIRECTION"]} when compared against other records and hence is marked as anomaly."""
                res = line_1+line_2+line_3+line_4
                return res
    except Exception as e:
        return "-"

def anomaly_explanation_to_description(row):
    try:
        explanation = json.loads(row['anomaly_explanation'])
        score = float(row['anomaly_score'])
        description =  describe(explanation,score)
        return description
    except Exception as e:
        return "-"

def data_validator_for_label_api(data_df,allowed_cols,csv_cols,allowed_is_approved_vals,error_dict={},rca=False):
    missing_cols = list(set(allowed_cols).difference(set(csv_cols)))
    extra_cols =  list(set(csv_cols).difference(set(allowed_cols)))
    must_required_cols = ['rca_unique_id','is_approved'] if rca else ['anomaly_id','is_approved']
    if len(set(must_required_cols).intersection(set(missing_cols))) <= 0:
        invalid_values = data_df[~(data_df['is_approved'].isin(allowed_is_approved_vals))][must_required_cols].to_dict('records')
    else:
        invalid_values = []
    if len(missing_cols) > 0:
        error_dict['missing_cols'] = missing_cols
    if len(extra_cols) > 0:
        error_dict['extra_cols'] = extra_cols
    if len(invalid_values) > 0:
        error_dict['allowed_is_approved_values'] = allowed_is_approved_vals
        error_dict['invalid_is_approved_values_records'] = invalid_values
    return error_dict


def bucket_validator_for_label_api(data_df,allowed_buckets,error_dict={}):
    must_required_cols = ['rca_unique_id','rca_bucket']
    if len(set(must_required_cols).intersection(set(list(data_df.columns)))) == len(must_required_cols):
        invalid_values = data_df[~(data_df['rca_bucket'].isin(allowed_buckets))][must_required_cols].to_dict('records') if 'rca_bucket' in list(data_df.columns) else []
        if len(invalid_values) > 0:
            error_dict['allowed_rca_bucket_values'] = allowed_buckets
            error_dict['invalid_rca_bucket_values_records'] = invalid_values
    return error_dict

def str_manipulator_for_sql(value):
    resp =  f"'{value}'" if isinstance(value,str) else f"{value}"
    return resp

def check_for_timestamp(col,value):
    ts_pattern = '^[0-9]{4}.[0-1][0-9].[0-3][0-9]'
    if re.match(ts_pattern, str(value[1][0])) and re.match(ts_pattern, str(value[1][1])):
        return 'TIMESTAMP'
    return ''

def convert_tuple_of_len_one(col_val):
    if len(col_val)==1:
        if isinstance(col_val[0],bool):
            col_val = f"({str(col_val[0]).lower()})"
        elif isinstance(col_val[0],str):
            col_val = f"('{col_val[0]}')" 
        else:
            col_val = f"({col_val[0]})" 
    elif isinstance(col_val[0],bool):
        temp_col_val = f'('
        for val in col_val:
            temp_col_val+= f"{str(val).lower()},"
        col_val = temp_col_val[:-1] + ')'
    return col_val


def sql_filter_generator(filters,where_cond=False):
    try:
        if len(filters) > 0:
            response = " where " if not where_cond else " and "
            for col,value in filters.items():
                if value[0] in [item.name for item in AthenaFilterENUM]:
                    condition = AthenaFilterENUM[value[0]].value
                    if value[0] == '_range':
                        ts = check_for_timestamp(col,value)
                        rhs =f" between {ts} {str_manipulator_for_sql(value[1][0])} and {ts} {str_manipulator_for_sql(value[1][1])} "
                    else:
                        col_val = tuple(value[1]) if isinstance(value[1],list) else str_manipulator_for_sql(value[1])
                        if isinstance(col_val,tuple):
                            logger.info(f"type is : {type(col_val[0])}")
                            col_val = convert_tuple_of_len_one(col_val)
                        rhs = f" {condition} {col_val} " 
                    response+= f" {col} {rhs} and " 
            response = 'and'.join(response.rsplit('and')[:-1])
        else:
            response = ' '
    except Exception as e:
        response = ' '
    return response


def generate_filter_TotalDimensionsInRCA(filters):
    filter_string = ''
    for filter,val in filters.items():
        if filter == 'rca_bucket' and val:
            filter_string += f" AND rca_bucket IN " + f"('{val[0]}')" if len(val)==1 else tuple(val)
        else:
            filter_string += f" AND (" + " OR ".join([f"dimension like '%{filter}={v}%'" for v in val]) + ")" if val else ''
    return filter_string

def generate_filter_labelledrecords(filters):
    filter_string = ''
    for filter,val in filters.items():
        if isinstance(val[1],list):
            filter_string += f" AND (" + " OR ".join([f"dimension like '%{filter}={v}%'" for v in val[1]]) + ")"
        elif isinstance(val[1],str):
            filter_string += f" AND (" + f"dimension like '%{filter}={val[1]}%'" + ")"
    return filter_string

