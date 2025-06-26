import sys
import os
current = os.path.dirname(os.path.realpath(__file__))
parent = os.path.dirname(current)
sys.path.append(os.path.dirname(parent))

import boto3
import time
import pandas as pd
import awswrangler as wr
import json
from decimal import Context, Decimal
from functools import reduce
from boto3.dynamodb.conditions import Attr, And, Key
from datetime import date

from app.controllers.config import settings,logger,boto3_session

ctx = Context(prec=38)

class AWSDynamoDB:

    def __init__(self):
        try:
            self.dynamodb = boto3.resource('dynamodb',
                                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                        region_name=settings.AWS_REGION_NAME)
            self.table = None
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def set_table_name(self, name):
        try:
            self.table_name = name
            self.table = self.dynamodb.Table(name)
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def send(self, data: dict):
        try:
            for k, v in data.items():
                if isinstance(v, float):
                    data[k] = ctx.create_decimal_from_float(v)
            response = self.table.put_item(Item=data)
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def get_single_filter_data(self, key, value, fields='',):
        try:
            query = self.table.scan(FilterExpression=Attr(key).eq(value))
            result = query['Items']
            while 'LastEvaluatedKey' in query:
                query = self.table.scan(FilterExpression=Attr(key).eq(value), ExclusiveStartKey=query['LastEvaluatedKey'])
                result.extend(query['Items'])
            return result
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def get_records(self, table_name):
        try:
            self.set_table_name(table_name)
            query = self.table.scan()
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = self.table.scan(ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
            return response
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def update_record(self, table_name,record_dict):
        try:
            record_dict= json.loads(json.dumps(record_dict), parse_float=Decimal)
            self.set_table_name(table_name)
            return self.table.put_item(Item= record_dict)
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")
    
    def delete_record(self,table_name,key,value):
        try:
            self.set_table_name(table_name)
            self.table.delete_item(Key={key:value})
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def query_filter_builder1(self, filters):
        try:
            filter = []
            for col, value in filters.items():
                condition = value[0]
                if condition == '_range':
                    filter.append(Attr(col).gte(value[1][0]))
                    filter.append(Attr(col).lte(value[1][1]))
                if condition == "_eq":
                    filter.append(Attr(col).eq(value[1]))
                if condition == "_neq":
                    filter.append(Attr(col).ne(value[1]))
                if condition == "_gt":
                    filter.append(Attr(col).gt(value[1]))
                if condition == "_gte":
                    filter.append(Attr(col).gte(value[1]))
                if condition == "_lt":
                    filter.append(Attr(col).lt(value[1]))
                if condition == "_lte":
                    filter.append(Attr(col).lte(value[1]))
                if condition == "_in":
                    filter.append(Attr(col).is_in(value[1]))
                else:
                    pass
            print(filter)
            return filter
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def query_filter_builder(self, filters):
        try:
            filters_data = []
            for k, v in filters.items():
                if k == "from_time" and v:
                    filters_data.append(Attr("dts").gte(v))
                elif k == "to_time" and v:
                    filters_data.append(Attr("dts").lte(v))
                elif k == "is_approved" and v:
                    filters_data.append(Attr("is_approved").ne(v))
                elif k == "anomaly_score" and v:
                    filters_data.append(Attr("ANOMALY_SCORE").gte(v))
                elif type(v) is str and v != "":
                    filters_data.append(Attr(k).eq(v))
                elif type(v) is int:
                    filters_data.append(Attr(k).eq(v))
                elif type(v) is list and v != []:
                    filters_data.append(Attr(k).is_in(v))
                else:
                    pass
            print(filters_data)
            return filters_data
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def get_filtered_records(self, table_name, filters, page_number, next_iteration_id=None):
        try:
            self.set_table_name(table_name)
            filters = self.query_filter_builder1(filters)
            if len(filters) == 1:
                if next_iteration_id:
                    next_iteration_id = {
                        "id": next_iteration_id
                    }
                    query = self.table.scan(FilterExpression=filters[0], ExclusiveStartKey=next_iteration_id)
                    response = query['Items']
                else:
                    query = self.table.scan(FilterExpression=filters[0])
                    response = query['Items']
            else:
                if next_iteration_id:
                    next_iteration_id = {
                        "id": next_iteration_id
                    }
                    query = self.table.scan(FilterExpression=reduce(And, (filters)),  ExclusiveStartKey=next_iteration_id)
                    response = query['Items']
                else:
                    query = self.table.scan(FilterExpression=reduce(And, (filters)))
                    response = query['Items']
            while "LastEvaluatedKey" in query and len(response) < page_number:
                next_iteration_id = query['LastEvaluatedKey'].get("id", None)
                query = self.table.scan(FilterExpression=reduce(And, (filters)),  ExclusiveStartKey=next_iteration_id)
                response.extend(query['Items'])
            return response, next_iteration_id
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")
            
    def get_all_filtered_records(self, table_name, filters):
        try:
            self.set_table_name(table_name)
            kwargs = {'FilterExpression': Key('Created_At').between(filters['Created_At_from'], filters['Created_At_to'])} if filters else {}
            query = self.table.scan(**kwargs) if kwargs else self.table.scan()
            response = query['Items']
            while "LastEvaluatedKey" in query:
                query = self.table.scan(**kwargs, ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
            return response
        except Exception as e:
            return {}

class AwsS3(object):

    def __init__(self):
        try:
            self.resource = boto3.resource('s3', region_name=settings.AWS_REGION_NAME,
                                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            self.client = boto3.client('s3', region_name=settings.AWS_REGION_NAME,
                                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            pass

    def upload_s3_file(self,file_name,filepath,bucket):
        self.resource.meta.client.upload_file(filepath, bucket, file_name)
    
    def generate_pre_signed_url(self,s3_object,bucket_name,expiration=604800):
        try:
            self.client.head_object(Bucket=bucket_name, Key=s3_object)
            print("object read successful")
            response = self.client.generate_presigned_url('get_object',Params={'Bucket': bucket_name,'Key': s3_object},ExpiresIn=expiration) 
        except Exception as e:
            print(e)
            response = None
        return response

    def get_s3_path_for_AI_mitigation(self):
        todays_date = date.today()
        year,mon = todays_date.year,todays_date.month
        s3_path_csv = f'data/{year}/{mon}/{int(time.time())}_{settings.MITIGATION_FILE_NAME}'
        return s3_path_csv

            
class AWSAthena:
    def __init__(self):
        self.client = boto3.client("athena",region_name=settings.AWS_REGION_NAME,
                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        
    def get_athena_data(self, sql, max_items, execution_id, next_token, database):
        max_items = None if max_items <=0 else max_items if max_items <= settings.ATHENA_PAGINATION_LIMIT else settings.ATHENA_PAGINATION_LIMIT
        
        if not execution_id and not next_token:
            result = self.client.start_query_execution(
                QueryString=sql,
                ResultConfiguration={
                    "OutputLocation": settings.ATHENA_PAGINATION_OUTPUT_LOCATION
                },
                QueryExecutionContext={
                    'Database': database
                }
            )
            execution_id = result["QueryExecutionId"]
        status = "RUNNING"
        while status == "RUNNING" or status == 'QUEUED':
            response = self.client.get_query_execution(QueryExecutionId=execution_id)
            status = response["QueryExecution"]["Status"]["State"]
        if status == "SUCCEEDED":
            paginator = self.client.get_paginator('get_query_results')
            next_token = None
            data_list = []
            response_iterator = paginator.paginate(
                QueryExecutionId=execution_id,
                PaginationConfig={
                    'MaxItems': max_items+1,
                    'PageSize': 1,
                    'StartingToken': next_token
                }
            )
            for results_page in response_iterator:
                next_token = results_page["NextToken"] if 'NextToken' in results_page else None
                for row in results_page['ResultSet']['Rows']:
                    data_list.append(row['Data'])

            return {"response":data_list, "next_token": next_token, "execution_id": execution_id}
        else:
            return {"response": [] ,"status": "error"}
    def parse_query_response(self, query_response, body): 
        fields = [] 
        for item in query_response['response'][0]: 
            fields.append(item['VarCharValue']) 
        data = list() 
        for _ in query_response['response'][1:]: 
            response_obj = list() 
            for item in _: 
                response_obj.append(item.get('VarCharValue', 0)) 
            data.append(response_obj) 
        return pd.DataFrame(data, columns=fields)
    
    def get_full_athena_data(self,sql,athenadb):
        return wr.athena.read_sql_query(sql=sql, database=athenadb, ctas_approach=True,
                                        boto3_session=boto3_session)


class SnsUtility(object):
    def __init__(self):
        self.sns = boto3.resource("sns", region_name=settings.AWS_REGION_NAME,
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        self.sns_client = boto3.client("sns", region_name=settings.AWS_REGION_NAME,
                          aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)

    def create_topic(self, name):
        topic = self.sns.create_topic(Name=name)
        return topic

    def list_topics(self):
        topics_iter = self.sns.topics.all()
        return topics_iter

    def subscribe(self, topic, protocol, endpoint):
        if isinstance(topic,str):
            subscription = self.sns_client.subscribe(TopicArn=topic,Protocol=protocol, Endpoint=endpoint, ReturnSubscriptionArn=True)
        else:
            subscription = topic.subscribe(Protocol=protocol, Endpoint=endpoint, ReturnSubscriptionArn=True)
        return subscription

    def delete_topic(self, topic):
        topic.delete()

    def send_notification(self,body,subject,planname):
        response = self.sns_client.publish(
            TargetArn=settings.SNS_TOPIC_ARN+planname,
            Message=body,
            Subject=subject
        )

        return {
            'statusCode': 200,
            'body': json.dumps(response)
        }
