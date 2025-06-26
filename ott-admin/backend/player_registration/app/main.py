import time

import uvicorn
from boto3 import Session
from fastapi import FastAPI, BackgroundTasks,Request 
from fastapi.middleware.cors import CORSMiddleware
from kinesis.producer import KinesisProducer
from redis import Redis
from rediscluster import RedisCluster
from config import settings, logger,MetricesName,default_platform_data
from schemas import *
from decorator import validate_key
import json 


time.clock = time.time

null = 'NULL'

redis_kinesis_session = Session(aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                region_name=settings.AWS_REGION_NAME)
redis_kinesis_producer = KinesisProducer(stream_name=settings.REDIS_KINESIS_STREAM, boto3_session=redis_kinesis_session)


rc = RedisCluster(startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                  decode_responses=True,
                  skip_full_coverage_check=True,
                  ssl=True)


def device_key(device_id:str):
    """Generate key for device state hashmap in redis"""
    return f"qoe_dsm_ds_{device_id}"


def get_mitigation(rc: Redis, device_id: str):
    device_state = rc.hgetall(device_key(device_id))
    if device_state.get('local_mitigation_id'):
        mitigation_config = dict(startupBuffDuration=device_state.get('suggestive_startup_buffer_duration', -1),
                                 rebufferingDuration=device_state.get('suggestive_rebuffering_duration', -1) if device_state.get(
                                                                                                 'suggestive_rebuffering_duration', -1) != null else None,
                                 estimatedDownloadRate=device_state.get('suggestive_start_bitrate', -1),
                                 bufferingStyle=BufferStyleEnum.continuous,
                                 mitigationID=device_state['local_mitigation_id'],
                                 mitigationTimestamp=device_state['mitigation_time_stamp'],
                                 startBitrate=device_state['start_bitrate'])
        return MitigationConfig(**mitigation_config),device_state.get('last_mitigation_deployment_status','')
    return None,None


app = FastAPI(
    title="Player-Registration",
    description='PlayerRegistration ',
    version="0.0.1",
    swagger_ui_parameters={"syntaxHighlight": False})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




async def update_dsm_store(updates: MitigationStatusUpdate):
    redis_kinesis_producer.put(MitigationStatusUpdateReq(registration=updates).json())
    

@app.get("/status")
async def app_status():
    return {"msg": "ok"}


def get_default_platform_mitigation_config(req):
    try:
        mc = MitigationConfig()
        if req.req.platform and req.req.deviceType and req.req.platform in MetricesName.PLATFORM_ENUM.value:
            platform = req.req.deviceType if req.req.deviceType in ["Firestick","AndroidSmartTv"] and req.req.platform == "Android" else req.req.platform
            mc.startupBuffDuration = default_platform_data[platform]["startupBuffDuration"]
            mc.rebufferingDuration= default_platform_data[platform]["rebufferingDuration"]
            mc.estimatedDownloadRate= default_platform_data[platform]["estimatedDownloadRate"]
        return mc
    except Exception as e:
        logger.exception(f"Exception {e}")
        return MitigationConfig()

def get_kc_ka_timer_vals(req):
    try:
        platform = req.req.deviceType if req.req.deviceType in ["Firestick","AndroidSmartTv"] and req.req.platform == "Android" else req.req.platform
        if platform in ["Firestick","iOS","Web","Android","AndroidSmartTv"]:
            return default_platform_data[platform]["kcTimer"],default_platform_data[platform]["kaTimer"]
    except Exception as e:
        logger.exception(f"Exception {e}")
    print(default_platform_data)
    return default_platform_data["DefaultTimerValues"]["kcTimer"],default_platform_data["DefaultTimerValues"]["kaTimer"]


@app.post("/register-session")
@validate_key
async def register_session(req:Request, bt: BackgroundTasks) -> RegistrationResponse:
    try:
        request = await req.body()
        request = json.loads(request.decode())
        req = RegistrationRequest(**request)
        logger.debug(f"Received request register: {req.json()}")
        probe_config = ProbeConfig()
        mc,last_mitigation_deployment_status = get_mitigation(rc, req.req.udid)
        print(f"Registration request:  {req}")
        if mc:
            player_config = PlayerConfig(pc=probe_config, mc=mc)
            # if req.req.mitigationCfgID != mc.mitigationID:
            #     mitigation_update = MitigationStatusUpdate(device_id=req.req.udid, mitigation_id=mc.mitigationID)
            #     bt.add_task(update_dsm_store, mitigation_update)
        else:
            mc = get_default_platform_mitigation_config(req)
            player_config = PlayerConfig(pc=probe_config, mc=mc)
        kcTimer,kaTimer = get_kc_ka_timer_vals(req)
        res = RegistrationResponse(registration_response=RegRes(version=settings.SCHEMA_VERSION,
                                                                bu=settings.BEACON_URL,
                                                                cfg=player_config,
                                                                kaInterval=settings.KA_INTERVAL,
                                                                kcInterval=settings.KC_INTERVAL,
                                                                kcTimer=kcTimer,
                                                                kaTimer=kaTimer))
        logger.debug(f"Received response register: {res}")
        return res
    except Exception as e:
        logger.exception(f"Exception is {e}")
        return {"Message":"Invalid Request"}


@app.post("/get-mitigation-config")
@validate_key
async def get_mitigation_config(req: Request, bt: BackgroundTasks) -> MitigationConfigResponse:
    try:
        request = await req.body()
        request = json.loads(request.decode())
        req = MitigationConfigRequest(**request)
        logger.debug(f"Received request get-mitigation-config: {req.json()}")
        device_id = req.configRequest.udid
        mc,last_mitigation_deployment_status = get_mitigation(rc, device_id)
        if mc:
            res = MitigationConfigRes(version=settings.SCHEMA_VERSION, mc=mc)
            if req.configRequest.mitigationCfgID != mc.mitigationID and last_mitigation_deployment_status == 'Pending':
                mitigation_update = MitigationStatusUpdate(device_id=device_id, mitigation_id=mc.mitigationID)
                bt.add_task(update_dsm_store, mitigation_update)
                logger.debug(f"Received response get-mitigation-config: {res}")
            return MitigationConfigResponse(mitigation_config_response=res)
        mitigation_config_response = MitigationConfigRes(version=settings.SCHEMA_VERSION)
        logger.debug(f"Received response get-mitigation-config: {mitigation_config_response}")
        return MitigationConfigResponse(mitigation_config_response=mitigation_config_response)
    except Exception as e:
        logger.exception(f"Exception is {e}")
        return {"Message":"Invalid Request"}


if __name__ == "__main__":
    uvicorn.run('main:app', host="0.0.0.0", port=8000, log_level="debug", reload=True)
