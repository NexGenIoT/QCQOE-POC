from config import settings, logger
from db_wrapper import AwsDynamodb, enable_and_disable_lambda
import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydentc_config import Services
from lib import ConfigManager
from uuid import uuid4
from validate_token import validate_token

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/status")
async def status():
    return {"msg": "ok"}





@app.post("/api/v1/config")
@validate_token
async def set_config(request: Request, service: Services, version: str):
    "Set config for a service"
    try:
        cm = ConfigManager()
        data = cm.get_config(service, version)
        new_data = await request.json()
        if data:
            data.update(new_data)
        else:
            data = new_data
        cm.set_config(service, version, data)
        if settings.ENABLE_AUTO_MITIGATION and service == "mitigation_probe_config_data":
            await enable_and_disable_lambda(data)
        obj = AwsDynamodb()
        new_data["id"] = str(uuid4())
        obj.push_data(new_data, settings.DYNAMODB_QOE_GLOBALCONFIG_LOG_TABLE)
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
    return {"msg": "ok"}



@app.get("/api/v1/config")
@validate_token
async def get_config(request: Request, service: Services, version: str):
    "Get config for a service"
    try:
        cm = ConfigManager()
        data = cm.get_config(service, version)
        if data is not None:
            return data
        else:
            return {}
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")
        return {}


if __name__ == '__main__':
    uvicorn.run("main:app", host='0.0.0.0', port=5007, debug=True, reload=True)
