from config import logger, settings
from db_wrapper import AwsDynamodb
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/aiml_platforms/getErrorData")
def get_errors(request: Request):
    filters = {}
    response = []
    try:
        obj = AwsDynamodb()
        response = obj.get_records(settings.DYNAMODB_OUTAGE_BANNER_TABLE, filters)
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return {"items": response, "total_record": len(response)}


@app.post("/api/v1/error_analytics")
async def get_error_records(request: Request):
    response = []
    try:
        filters = await request.json()
        obj = AwsDynamodb()
        response = obj.get_records(settings.DYNAMODB_OUTAGE_BANNER_TABLE, filters)
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return {"items": response, "total_record": len(response)}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run('main:app', host="0.0.0.0", port=5009, log_level="debug", reload=True)