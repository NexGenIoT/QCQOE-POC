import uuid

from fastapi import FastAPI, Request, BackgroundTasks
from loguru import logger
from opensearchpy import OpenSearch

from config import settings

import datetime

app = FastAPI()

os_client = OpenSearch(
    hosts=[{'host': settings.OS_HOST, 'port': settings.OS_PORT}],
    http_compress=True,
    http_auth=(settings.OS_USER, settings.OS_PASSWORD),
    use_ssl=True,
    verify_certs=True,
    ssl_assert_hostname=False,
    ssl_show_warn=False
)

request_count = 0 

@app.get("/status")
async def status():
    return "ok"

def send_to_opensearch(payload):
    response = os_client.index(index=settings.OS_INDEX, id=str(uuid.uuid4()), body=payload)
    logger.debug(f'os_response: {response}')

@app.post("/")
async def root(req: Request, bt: BackgroundTasks):
    global request_count
    request_count += 1 
    payload = await req.json()
    # Add new record for each request
    # response = os_client.index(index=settings.OS_INDEX, id=str(uuid.uuid4()), body=payload)
    bt.add_task(send_to_opensearch, payload)
    # logger.debug(f'os_response send')
    #if request_count % 100 == 0:
    logger.debug(f"Count {request_count} Date: {datetime.datetime.now()}")
    return {'msg': 'ok'}


@app.on_event("shutdown")
async def shutdown_event():
    os_client.close()


if __name__ == '__main__':
    import uvicorn

    # uvicorn.run('main:app', host="0.0.0.0", port=8001, log_level="debug", reload=True)
    uvicorn.run("__main__:app", host="0.0.0.0", port=8001, log_level="debug", workers=16)
