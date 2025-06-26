
from src.consumer import Consumer
from src.config import logger

if __name__ == '__main__':
    logger.info("service is started")
    worker = Consumer()
    logger.info("now working is running")
    worker.start()
