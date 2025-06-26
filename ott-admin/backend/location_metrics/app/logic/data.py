from logic import handshake, helper
from boto3.dynamodb.conditions import Attr, Key
from logic.config import logger

helper_obj = helper.Helper()


class AwsDynamodb:

    def __init__(self):
        self.client, self.resource = handshake.AwsDynamodbConnection().get_connection_objects()

    def fetch_sso_stats_from_dynamodb(self, table:str, start_time:int, end_time:int, *args:str) -> list:
        try:
            table = self.resource.Table(table)
            fields = helper_obj.extract_args_data(args)
            kwargs = {
                'ProjectionExpression': fields,
                'ExpressionAttributeNames': {'#location': 'location'},
                'FilterExpression': Key('dts_es').between(start_time, end_time)
            } if fields else {
                'FilterExpression': Key('dts_es').between(start_time, end_time)
            }
            query = table.scan(**kwargs)
            response = query["Items"]
            while 'LastEvaluatedKey' in query:
                query = table.scan(**kwargs,
                                ExclusiveStartKey=query['LastEvaluatedKey'])
                response.extend(query['Items'])
            return response
        except Exception as err:
            logger.exception(f"Error: Unable to fetch data from dynamodb from table {table}, {err}")
            return []
