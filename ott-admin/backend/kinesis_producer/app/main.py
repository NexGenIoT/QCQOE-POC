import json
import uuid
import boto3
from fastapi import Request, BackgroundTasks

from config import app, settings, logger
import datetime


request_count = 0 

kinesis = boto3.client('kinesis', region_name=settings.AWS_REGION_NAME,
                       aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                       aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)


# Todo:
#   https://stackoverflow.com/questions/67599119/fastapi-asynchronous-background-tasks-blocks-other-requests
#   run_in_threadpool or processpool the worker or fastapi backgroundtask?

def send_to_kinesis(ks_payload):
    response = kinesis.put_record(
        StreamName=settings.KINESIS_STREAM,
        Data=json.dumps(ks_payload),
        PartitionKey=str(uuid.uuid4())[:8])
    logger.debug(f"put record in kinesis response: {response}")

@app.get("/status")
async def status():
    return "ok"


@app.post("/")
async def root(req: Request, bt:BackgroundTasks):
    global request_count
    request_count+=1
    # logger.debug(f"heads : { req.headers } ")
    # logger.debug(f"client : { req.client } ")
    # logger.debug(f"query_params : { req.query_params } ")
    ks_payload = await req.json()
    #logger.debug(f'Received  request: {ks_payload}')
    bt.add_task(send_to_kinesis, ks_payload)
    #if request_count % 100 == 0:
    logger.debug(f"Count {request_count} Date: {datetime.datetime.now()}")
    return {'msg': 'ok'}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host="0.0.0.0", port=8001, log_level="debug", reload=True)
