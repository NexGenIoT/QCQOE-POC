import json
from boto3 import Session
from config import logger, settings
from kinesis.consumer import KinesisConsumer
from pydantic import ValidationError
from schemas import QueueReqBody
from dsm import DeviceStateManager
from datetime import datetime
from db_wrapper import AWSDynamoDB, RedisConnection


class Consumer:
    def __init__(self):
        session = Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_REGION_NAME)
        self.consumer = KinesisConsumer(stream_name=settings.REDIS_KINESIS_STREAM, boto3_session=session)
        self.request_count = 0
        self.redis_client = RedisConnection().client
        self.dynamo_obj = AWSDynamoDB()

    def start(self):
        while True:
            for message in self.consumer:
                self.request_count = self.request_count + 1
                data = json.loads(message['Data'])
                try:
                    logger.debug(f"Received data: {data}")
                    req = QueueReqBody(**data)
                    req_obj = DeviceStateManager(req,self.redis_client)
                    req_obj.process_request(self.redis_client,self.dynamo_obj)
                except ValidationError as e:
                    logger.exception(f"Invalid data received: {e}")
                if self.request_count % 100 == 0:
                    logger.info(f"time : {datetime.now()}, request_count : {self.request_count} ")


if __name__ == '__main__':
    from config import settings

