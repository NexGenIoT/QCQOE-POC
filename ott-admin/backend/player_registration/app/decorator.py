from config import settings, logger,default_config_data
from functools import wraps
import boto3
import time
import json
from fastapi import  BackgroundTasks
from schemas import RegistrationRequest

def validate_key(func):
    @wraps(func)
    async def wrapper(req, bt: BackgroundTasks):
        try:
            request = await req.body()
            request = json.loads(request.decode())
            request = request.get("req") if "req" in request.keys() else request.get("configRequest") 
            platform = request.get("deviceType","") if request.get("deviceType") in ["Firestick","AndroidSmartTv"] and request.get("platform") == "Android" else request.get("platform")
            
            if isinstance(default_config_data, dict):
                enable_auth = default_config_data.get(f"enable_auth_for_{platform}", "")
                if enable_auth:
                    key = req.headers.get("authorization", None)
                    if key and default_config_data.get("api_auth_key", {}).get(key, "") == platform:
                        return await func(req, bt)
                    else:
                        data = dict()
                        data["payload"] = request
                        data["error_description"] = "Api key validation error"
                        data["server_validation_timestamp"] = time.time()
                        logger.debug(f"validate_key data: {data}")
                        firehose_client = boto3.client('firehose', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                                                    region_name=settings.AWS_REGION_NAME)
                        firehose_client.put_record(DeliveryStreamName=settings.REJECTED_PAYLOAD_KINESIS_STREAM,
                                                    Record={'Data': json.dumps(data)})
                        return {"Message": "Authentication error.", "StatusCode": 400}
                else:
                    return await func(req, bt)
            else:
                    return await func(req, bt)
        except Exception as e:
            logger.exception(f"validate_key Exception: {e}")
            return await func(req, bt)
    return wrapper

