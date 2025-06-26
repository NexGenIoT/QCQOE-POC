import boto3
from functools import reduce
from boto3.dynamodb.conditions import Attr, And
import jaydebeapi
import sqlite3
from opensearchpy import OpenSearch
from boto3.dynamodb.types import TypeDeserializer
from rediscluster import RedisCluster
from sqlalchemy import create_engine
import pandas as pd
import time
from config import settings, logger
from utils.json_queryv1 import generate_query_for_groupby_percentage_change
import json
from decimal import Decimal

class AwsS3(object):

    def __init__(self):
        try:
            self.client = boto3.client('s3', region_name=settings.AWS_REGION_NAME,
                                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            pass

    def put_s3_object(self, body=None, key=""):
        if body is None:
            body = {}
        self.client.put_object(
            Body=body,
            Bucket=settings.AWS_S3_BUCKET_NAME,
            Key=key
        )

    def get_s3_object(self, key=""):
        obj = self.client.get_object(Bucket=settings.AWS_S3_BUCKET_NAME, Key=key)
        return obj


class AwsLambda(object):
    def __init__(self):
        try:
            self.client = boto3.client('lambda',
                                            region_name=settings.AWS_REGION_NAME,
                                            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            pass


    def invoke_function(self, function_name="", invocation_type="", body=None):
        if body is None:
            body = {}
        result = self.client.invoke(FunctionName=function_name,
                                   InvocationType=invocation_type, Payload=body)
        return result


class AwsEvent(object):
    def __init__(self):
        try:
            self.client = boto3.client('events', region_name=settings.AWS_REGION_NAME,
                                           aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                           aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            pass

    def enable_event_rule(self, name="", event_bus_name="default"):
        response = self.client.enable_rule(Name=name, EventBusName=event_bus_name)
        return response

    def disable_event_rule(self, name="", event_bus_name="default"):
        response = self.client.disable_rule(Name=name, EventBusName=event_bus_name)
        return response


class AwsDynamodb(object):

    def __init__(self):
        try:
            self.client = boto3.client('dynamodb', region_name=settings.AWS_REGION_NAME,
                                              aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                              aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            self.resource = boto3.resource('dynamodb', region_name=settings.AWS_REGION_NAME,
                                              aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                              aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception("Error: Connection not established {}".format(error))
        else:
            logger.info("Connection established")


    def execute_query(self, query):
        resp = self.client.execute_statement(Statement=query)
        return resp
    def update_record(self,table_name,record_dict):
        record_dict=json.loads(json.dumps(record_dict), parse_float=Decimal)
        table = self.resource.Table(table_name)
        return table.put_item(Item= record_dict)

    def get_all_records(self,table_name=settings.DSM_SERVICE_TABLE_NAME):
        result = []
        table = self.resource.Table(table_name)
        query = table.scan()
        
        from boto3.dynamodb.types import TypeDeserializer
        from decimal import Decimal
        deserializer = TypeDeserializer()
        documents = query['Items']
        for doc in documents:
            if type(doc) is dict:
                data = {k:(int(v) if type(v) == Decimal else v) for k,v in doc.items()}
                if type(data) is dict:
                    result.append(data)
        while 'LastEvaluatedKey' in query:
            query = table.scan(ExclusiveStartKey=query['LastEvaluatedKey'])
            documents = query['Items']
            for doc in documents:
                if type(doc) is dict:
                    data = {k:(int(v) if type(v) == Decimal else v) for k,v in doc.items()}
                    if type(data) is dict:
                        result.append(data)
        return result

    def get_single_filter_data(self, key, value, table_name=settings.DSM_SERVICE_TABLE_NAME):
        result = []
        logger.info(f"table, key, value :{settings.DSM_SERVICE_TABLE_NAME}, {key} -- {value}")
        table = self.resource.Table(table_name)
        query = table.scan(FilterExpression=Attr(key).eq(value))
        result = query['Items']
        while 'LastEvaluatedKey' in query:
            query = table.scan(FilterExpression=Attr(key).eq(value), ExclusiveStartKey=query['LastEvaluatedKey'])
            result.extend(query['Items'])
        logger.info(f"get_single_filter_data result is: {result}")
        return result

    def query_dynamo(self, query_str: str = ""):
        all_data = []
        results = {}
        if query_str:
            data = dict(self.execute_query(query=query_str))
            for item in dict(data)["Items"]:
                all_data.append(
                    {k: TypeDeserializer().deserialize(v) for k, v in dict(item).items()}
                )

            results = pd.DataFrame(all_data)
            results.fillna('', inplace=True)
        return results

    def query_builder(self, where_in={}, select_clause=f""" SELECT * FROM {settings.DSM_SERVICE_TABLE_NAME} """):
        clauses = []
        for k, v in where_in.items():
            if v:
                if k in ["location", "platform", "ueid"] and type(v) is list:
                    clauses.append(f"{k} in {v}")
                elif k in ["current_uei", "rebuffering_duration", "startup_buffer_length", "start_bitrate", "stall_count"] and type(v) is str:
                    v = v.strip()
                    if v:
                        clauses.append(f" {k} {v}")
                elif type(v) is str:
                    clauses.append(f" {k}='{v}' ")
                else:
                    clauses.append(f" {k}={v} ")

        if len(clauses) >= 1:
            query = f""" {select_clause} WHERE {" and ".join(clauses)} """
        else:
            query = select_clause
        logger.info(f"Dynamo db Query : {query}")
        return query

    def key_finder(self, filters=None):

        if "device_platform" in filters.keys():
            filters["platform"] = filters.get("device_platform", [])
            del filters["device_platform"]
        try:
            query = self.query_builder(where_in=filters)
            result = self.query_dynamo(query_str=query)
            if result.empty:
                result = []
            else:
                result = result.sort_values(by="last_report_time").drop_duplicates(subset='device_id', keep="last")
                result = result.to_dict(orient='records')
            logger.info(f"Query Result : {result}")
            return result
        except Exception as e:
            logger.exception(f"Exception in key find: {str(e)}")
            pass

    def sso_query_builder(self, filters):
        filter = []
        for k, v in filters.items():
            if k == "from_time" and v:
                filter.append(Attr("dts_es").gte(v))
            elif k == "to_time" and v:
                filter.append(Attr("dts_es").lte(v))
            elif type(v) is str and v != "":
                filter.append(Attr(k).eq(v))
            elif type(v) is list and v != []:
                filter.append(Attr(k).is_in(v))
            else:
                pass
        return filter
        # query = f"SELECT * from {settings.DYNAMODB_OUTAGE_BANNER_TABLE}"
        # data = []
        # if filters:
        #     start_time = filters.get('start_time', "")
        #     end_time = filters.get('end_time', "")
        #     error_code = filters.get('ErrorCode', [])
        #     provider = filters.get('provider', "")
        #     platform = filters.get('platform', "")
        #     error_name = filters.get("ErrorName", "")
        #     if error_name:
        #         data.append(f" ErrorName='{error_name}'")
        #     if start_time:
        #         data.append(f" dts_es >={start_time}")
        #     if end_time:
        #         data.append(f" dts_es <={end_time}")
        #     if error_code:
        #         data.append(f" ErrorCode ='{error_code}'")
        #     if provider:
        #         data.append(f" provider ='{provider}'")
        #     if platform:
        #         data.append(f" platform='{platform}'")
        #     if len(data) > 0:
        #         query = query + " where " + " and ".join(data)
        # return query

    def get_value(self, key, v, clauses):
        data = v.split()
        condition, value = data[0], data[1] 
        value = int(value)
        if condition == ">=" :
            clauses.append(Attr(key).gte(value))
        elif condition == "<=":
            clauses.append(Attr(key).lte(value))
        elif condition == ">":
            clauses.append(Attr(key).gt(value))
        elif condition == "<":
            clauses.append(Attr(key).lt(value))
        elif condition == "=":
            clauses.append(Attr(key).eq(value))
        return clauses

    def query_execution_v2(self, clauses):
        logger.info(f"Starting query_execution_v2 : {len(clauses)}")
        table = self.resource.Table(settings.DSM_SERVICE_TABLE_NAME)
        response = []
        logger.info(f"clauses len {len(clauses)}")
        if len(clauses) == 1:
            query = table.scan(FilterExpression=clauses[0])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 2:
            query = table.scan(FilterExpression=clauses[0] & clauses[1])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 3:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 4:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 5:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 6:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 7:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 8:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6] & clauses[7])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6] & clauses[7], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 9:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6] & clauses[7] & clauses[8])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6] & clauses[7] & clauses[8], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        elif len(clauses) == 10:
            query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6] & clauses[7] & clauses[8] & clauses[9])
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(FilterExpression=clauses[0] & clauses[1] & clauses[2] & clauses[3] & clauses[4] & clauses[5] & clauses[6] & clauses[7] & clauses[8] & clauses[9], ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        else:
             query = table.scan()
             response = query['Items']
        return response

    def query_builder_v2(self, where_in={}):
        clauses = []
        for k, v in where_in.items():
            if v:
                if k in ["location", "platform", "ueid"] and type(v) is list:
                    clauses.append(Attr(k).is_in(v))
                elif k in ["current_uei", "rebuffering_duration", "startup_buffer_length", "start_bitrate",
                           "stall_count"] and type(v) is str:
                    v = v.strip()
                    if v:
                        data = v.split()
                        condition, value = data[0], data[1]
                        if condition == ">=" :
                            clauses.append(Attr(k).gte(int(value)))
                        elif condition == "<=":
                            clauses.append(Attr(k).lte(int(value)))
                        elif condition == ">":
                            clauses.append(Attr(k).gt(int(value)))
                        elif condition == "<":
                            clauses.append(Attr(k).lt(int(value)))
                        elif condition == "=":
                            clauses.append(Attr(k).eq(int(value)))
                elif type(v) is str:
                    clauses.append(Attr(k).eq(v))
                else:
                    clauses.append(Attr(k).is_in(v))
        return clauses

    def key_finder_v2(self, filters=None):
        if "device_platform" in filters.keys():
            filters["platform"] = filters.get("device_platform", [])
            del filters["device_platform"]
        try:
            clauses = self.query_builder_v2(where_in=filters)
            response = self.query_execution_v2(clauses)
            result = pd.DataFrame(response)
            if result.empty:
                result = []
            else:
                result = result.sort_values(by="last_report_time").drop_duplicates(subset='device_id', keep="last")
                result = result.to_json(orient='records')
            logger.info(f"Query Result : {len(result)}")
            return result
        except Exception as e:
            logger.exception(f"Exception in key find: {str(e)}")
            result = []
            return result

    def get_records_date_range(self, from_time, to_time, location=[], platform=[], mitigation_status='', metric_name=''):
        logger.info(f"from_time, to_time : {from_time} -- {to_time}")
        clauses = []
        if from_time and to_time:
            clauses.append(Attr('last_report_time').gte(int(from_time)))
            clauses.append(Attr('last_report_time').lte(int(to_time)))
        if location:
            clauses.append(Attr('location').is_in(location))
        if platform:
            clauses.append(Attr('platform').is_in(platform))
        if mitigation_status:
            clauses.append(Attr('mitigation_status').eq(mitigation_status))
        if metric_name == 'improvement_in_uei':
            clauses.append(Attr('current_uei').gte("previous_uei"))
        return clauses

    def get_records(self, table_name, filters):
        table = self.resource.Table(table_name)
        if filters:
            filter = self.sso_query_builder(filters)
            if len(filter) == 1:
                query = table.scan(FilterExpression=filter[0])
                response = query['Items']
                while 'LastEvaluatedKey' in query:
                    query = table.scan(FilterExpression=filter[0],
                                       ExclusiveStartKey=query['LastEvaluatedKey'])
                    response.extend(query['Items'])
            else:
                query = table.scan(FilterExpression=reduce(And, (filter)))
                response = query['Items']
                while 'LastEvaluatedKey' in query:
                    query = table.scan(FilterExpression=reduce(And, (filter)), ExclusiveStartKey=query['LastEvaluatedKey'])
                    response.extend(query['Items'])
        else:
            query = table.scan()
            response = query['Items']
            while 'LastEvaluatedKey' in query:
                query = table.scan(ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
        return response


class RedisConnection(object):
    def __init__(self):
        try:
            self.client = RedisCluster(
                startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                decode_responses=True,
                skip_full_coverage_check=True,
                ssl=True
                )
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            pass


class ElasticRedisCacheConnection(object):
    def __init__(self):
        try:
            self.client = RedisCluster(
                startup_nodes=[{"host": settings.ELASTIC_HOST, "port": settings.ELASTIC_PORT}],
                decode_responses=True,
                skip_full_coverage_check=True
                )
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            pass

def get_connection():
    connection = None
    try:
        connection = OpenSearch(
            hosts=[{'host': settings.OPEN_SEARCH_HOST, 'port': settings.OPEN_SEARCH_PORT}],
            http_compress=True,
            http_auth=(settings.OPEN_SEARCH_USER, settings.OPEN_SEARCH_PASSWORD),
            use_ssl=True,
            verify_certs=True,
            ssl_assert_hostname=False,
            ssl_show_warn=False,
        )
    except Exception as error:
        logger.exception(f"Error: Connection not established {error}")
    else:
        pass
    return connection

connection_pool = []
connection_in_use = []

def get_connection_manager():
    global connection_pool
    global connection_in_use
    if not connection_pool:
        connection_pool = [get_connection() for i in range(0, settings.OS_CONNECTION_POOL_SIZE)]
    return connection_pool


class OpenSearchClient(object):

    def get_hrs_data(self, time_start_24hrs, time_end, filters, aggregation_type, metricname):
        query = generate_query_for_groupby_percentage_change(time_start_24hrs, time_end, filters,
                                                     aggregation_type, metricname,
                                                     "2d")
        result = self.search_data(query=query)
        return result

    def search_data(self, query="", index_name=settings.OPEN_SEARCH_INDEX):
        global connection_pool 
        global connection_in_use
        connection_in_use=[]
        connection_pool=get_connection_manager()
        logger.info(f"Live Connection in connection pool : {len(connection_pool)}")
        logger.info(f"Connection in use : {len(connection_in_use)}")
        print('QUERYY:',query)
        while True:
            if len(connection_pool)>0:
                available_cursor = connection_pool.pop(0)
                connection_in_use.append(available_cursor)
                response = available_cursor.search(body=query, index=index_name,request_timeout=settings.OS_QUERY_TIMEOUT_SECONDS)
                # available_cursor.close()
                connection_pool.append(available_cursor)
                if len(connection_in_use)>0:
                    connection_in_use.pop(-1)
                return response
            else:
                logger.info("No connection in connection pool, Wating for connection")
                connection_pool=get_connection_manager()
                time.sleep(0.5)


class JaydebeApi(object):

    def __init__(self):
        try:
            self.client = jaydebeapi.connect(settings.OPEN_SEARCH_DRIVER,
                                                   settings.OPEN_SEARCH_URL,
                                                   [settings.OPEN_SEARCH_USER, settings.OPEN_SEARCH_PASSWORD],
                                                   settings.OPEN_SEARCH_JAR)
            logger.info("Connection establish done")
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            logger.info("Connection established")

    def execute_query(self, sql_query):
        try:
            cursor = self.client.cursor()
            cursor.execute(sql_query)
            result = cursor.fetchall()
        except Exception as e:
            logger.exception(f"Excelption in Jaydebe Api : {str(e)}")
            result= {}
        return result


class SqliteDb(object):
    def __init__(self):
        try:
            self.disk_engine = create_engine(settings.SQLITE_ENGINE)

            self.con = sqlite3.connect(settings.SQLITE_DB_NAME,check_same_thread=False)
            self.cursor = self.con.cursor()
            self.client = self.cursor
        except Exception as error:
            logger.exception(f"Exception in SQLite3 Database connection: {error} ")
        else:
            pass

    def execute_query(self, query):
        self.cursor.execute(query)
        result = []
        coluns = []
        for i in self.cursor.description:
            coluns.append(i[0])
        for record in self.cursor.fetchall():
            res = {coluns[i]: record[i] for i in range(len(record))}
            result.append(res)
        return result