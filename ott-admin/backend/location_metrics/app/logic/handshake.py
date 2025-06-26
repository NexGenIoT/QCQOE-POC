import boto3
from logic.config import settings, logger


class AwsDynamodbConnection:
    def __init__(self):
        try:
            self.client = boto3.client('dynamodb', region_name=settings.AWS_REGION_NAME,
                                       aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                       aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
            self.resource = boto3.resource('dynamodb', region_name=settings.AWS_REGION_NAME,
                                           aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                           aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception(f"Error: Connection not established {error}")
        else:
            logger.info("Connection established")

    def get_connection_objects(self) -> tuple:
        return (self.client, self.resource)

    def end_connection(self) -> bool:
        try:
            self.client.close()
            logger.info("Connection terminated")
            return True
        except Exception as error:
            logger.exception(f"Error: Connection not terminated {error}")
            return False
