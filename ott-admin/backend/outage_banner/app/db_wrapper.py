import boto3
from functools import reduce
from config import logger
from config import settings
from boto3.dynamodb.conditions import Attr, And, Between


class AwsDynamodb(object):
    def __init__(self):
        try:
            self.resource = boto3.resource('dynamodb',
                                           aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                           aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                           region_name=settings.AWS_REGION_NAME)
        except Exception as error:
            logger.exception("Error: Connection not established {}".format(error))
        else:
            logger.info("Connection established")

    def query_filter_builder(self, filters):
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

    def get_records(self, table_name, filters):
        table = self.resource.Table(table_name)
        if filters:
            filter = self.query_filter_builder(filters)
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

