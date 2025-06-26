import json
from boto3 import Session
from src.config import logger, settings
from kinesis.consumer import KinesisConsumer
from pydantic import ValidationError
from src.db_wrapper import RedisConnection
from src.schema import PingPayloadRequest
from src.process import ProcessRecord


class Consumer:
    def __init__(self):
        logger.info("creating object")
        session = Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                          aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                          region_name=settings.AWS_REGION_NAME)
        self.consumer = KinesisConsumer(stream_name=settings.REDIS_KINESIS_STREAM, boto3_session=session)
        self.redis_client = RedisConnection().client
        logger.info("object is created")

    def start(self):
        logger.info("fetching data from kinesis")
        while True:
            for message in self.consumer:
                try:
                    data = json.loads(message['Data'])
                    if data and data.get('ping', None):
                        ai_redis_data = self.redis_client.hgetall(f"{settings.AI_REDIS_COLLECTION_PREFIX}{data['ping'].get('device_id', '')}")
                        if ai_redis_data:
                            dsm_redis_data = self.redis_client.hgetall(f"{settings.DSM_REDIS_COLLECTION_PREFIX}{data['ping'].get('device_id', '')}")
                            payload = PingPayloadRequest(**data['ping'])
                            record_object = ProcessRecord(dsm_redis_data, ai_redis_data, data['ping'], self.redis_client)
                            record_object.process()
                            logger.info(f"payload {payload}")
                except ValidationError as e:
                    logger.exception(f"Invalid data received: {e}")

if __name__ == '__main__':
    from config import settings

