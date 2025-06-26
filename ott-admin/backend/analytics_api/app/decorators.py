from config import settings, logger
from functools import wraps
import boto3
import time
import json


def validate_key(func):
    @wraps(func)
    async def wrapper(request, bt):
        try:
            data = await request.json()
            if data.get("ping", None):
                payload = data.get("ping", {})
            elif data.get("event", None):
                payload = data.get("event", {})
            else:
                payload = {}
            platform = payload.get("deviceType", "") if payload.get("deviceType", "") in ['Firestick','AndroidSmartTv'] and payload.get("platform", "") == "Android" else payload.get("platform", "")
            if False:
                print('NEVER')
            # if isinstance(default_config_data, dict):
            if False:
                enable_auth = default_config_data.get(f"enable_auth_for_{platform}", "")
                enable_auth=False
                if enable_auth:
                    key = request.headers.get("authorization", None)
                    if key and default_config_data.get("api_auth_key", {}).get(key, "") == platform:
                        return await func(request, bt)
                    else:
                        data = dict()
                        data["payload"] = payload
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
                    return await func(request, bt)
            else:
                    return await func(request, bt)
        except Exception as e:
            logger.exception(f"validate_key Exception: {e}")
            return await func(request, bt)
    return wrapper