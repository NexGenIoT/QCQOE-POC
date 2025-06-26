
import boto3

from config import settings, logger
from rediscluster import RedisCluster
from decimal import Context

ctx = Context(prec=38)


class RedisConnection(object):
    def __init__(self):
        try:
            self.client = RedisCluster(
                startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                decode_responses=True,
                skip_full_coverage_check=True,
                ssl=True)
        except Exception as error:
            print("Error: Connection not established {}".format(error))
        else:
            print("Connection established")


class AWSDynamoDB:
    def __init__(self):
        self.dynamodb = boto3.resource('dynamodb',
                                  aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                  aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                  region_name=settings.AWS_REGION_NAME)
        self.table = self.dynamodb.Table(settings.DDB_TABLE)
    
    def set_table_name(self,name):
        self.table = self.dynamodb.Table(name)

    def send(self, data: dict):
        for k, v in data.items():
            if isinstance(v, float):
                data[k] = ctx.create_decimal_from_float(v)
        logger.debug(f"DDB_TABLE: {settings.DDB_TABLE}, DYNAMO data : {data}")
        response = self.table.put_item(Item=data)
        logger.debug(f"DYNAMO response {response}")
