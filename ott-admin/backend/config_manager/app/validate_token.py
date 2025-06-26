from config import settings, logger
import requests

from functools import wraps
from fastapi import Request, HTTPException
import requests
from werkzeug.exceptions import abort

VALIDATE_AUTH_TOKEN_URL = settings.VALIDATE_AUTH_TOKEN_URL
# Todo: check usage or delete

def validate_token(f):
    @wraps(f)
    async def decorated_function(request, *args, **kwargs):
        if "authorization" in request.headers.keys():
            token = request.headers.get('authorization', "")
            logger.debug(f"token : {token}")
            allow = False
            try:
                if token:
                    res = requests.post(VALIDATE_AUTH_TOKEN_URL, json={'token': token}, verify=True)
                    logger.debug(f"response : {res}")
                    if res.status_code == 200:
                        res = res.json()
                        logger.debug(f"res json : {res}")
                        if res.get('validated', ""):
                            allow = True
            except Exception as e:
                logger.debug(f"Exception : {str(e)}")
            if allow:
                logger.debug(f"return success")
                return await f(request, *args, **kwargs)
            else:
                logger.debug(f"Not allowed allow: {allow}")
                raise HTTPException(status_code=401, detail="Authentication failed! please provide valid token.")
        else:
            logger.debug(f"authorization key not provided")
            raise HTTPException(status_code=401, detail="Authentication failed! please provide valid token.")
    return decorated_function