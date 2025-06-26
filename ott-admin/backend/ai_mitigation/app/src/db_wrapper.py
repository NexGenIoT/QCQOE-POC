from rediscluster import RedisCluster
from src.config import settings
import boto3
import json
from src.config import logger


class RedisConnection(object):
    def __init__(self):
        try:
            self.client = RedisCluster(
                startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                decode_responses=True,
                skip_full_coverage_check=True,
                ssl=True)
        except Exception as error:
            logger.exception("Error: Connection not established {}".format(error))
        else:
            logger.info("Connection established")

class AwsStepFunction(object):
    def __init__(self):
        try:
            self.client = boto3.client('stepfunctions',region_name=settings.AWS_REGION_NAME,
                        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception("Error: Connection not established {}".format(error))
        else:
            logger.info("Connection established")

    def invoke(self, request_input, name=settings.AI_STATE_MACHINE_ARN):
        try:
            response = self.client.start_execution(
                            stateMachineArn=name,
                            input=json.dumps(request_input)
                            )
        except Exception as error:
            print("Error: unable to invoke step function. {}".format(error))
        else:
            print("response", response)