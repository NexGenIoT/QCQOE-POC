import sys
import os
import json 

sys.path.insert(0, os.path.dirname(os.getcwd()))
from logic import service
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from logic.config import logger
from datetime import datetime 
from logic.db_wrapper import ElasticCacheUtility
from fastapi.encoders import jsonable_encoder
from fastapi.responses import JSONResponse

app = FastAPI(
    title="Dashboard-Metrics",
    description='DashboardMetrics ',
    version="0.0.1",
    swagger_ui_parameters={"syntaxHighlight": False})

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/status")
async def heart_check_status():
    logger.debug(f"status is ok")
    return {"Status": 200}
    
@app.post("/api/v1/location/geometric-insights/")
async def geometrics(start_time: int, end_time: int, request: Request):
    request_body = await request.json()
    if end_time < start_time:
        return {"message": "start_time must be less than end_time"}
    if "metric" not in request_body:
        return {"message": "metric parameter is required" }
    if len(request_body["metric"].strip()) == 0:
        return {"message": "metric parameter cannot be empty" }
    redis_client = ElasticCacheUtility()
    api_name = "geometric-insights"
    metrices_name = request_body["metric"]
    query_duration = {"from_time": start_time, "to_time": end_time}
    cache_query = redis_client.cache_key_generator(api_name, query_duration, request_body)
    cache = redis_client.search_cache(cache_query)
    if cache is not None:
        return JSONResponse(jsonable_encoder(json.loads(cache)))
    if request_body["metric"].strip() == "attempts":
        try:
            response =  service.GetMetricInfo(start_time, end_time, metric='geometricinsights').geometric(type="attempts")
            redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
            return response
        except Exception as err:
            logger.exception(f"Error: Something went wrong {err}")
            return {"message": "something went wrong"}
    elif request_body["metric"] == "error":
        try:
            response =  service.GetMetricInfo(start_time, end_time, metric='geometricinsights').get_response()
            redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
            return response
        except Exception as err:
            logger.exception(f"Error: Something went wrong {err}")
            return {"message": "something went wrong"}
    elif request_body["metric"] == "concurrent":
        try:
            response =  service.GetMetricInfo(start_time, end_time, metric='geometricinsights').geometric(type="concurrent")
            redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
            return response
        except Exception as err:
            logger.exception(f"Error: GEOMETRIC response went wrong {err}")
            return {"message": f"!something went wrong"}
    else:
        return {"message": "Please use values, 'concurrent' or 'error' for key, 'metric'"}


@app.post("/api/v1/location/MapBlips/")
async def play_count(start_time: int, end_time: int, request: Request):
    request_body = await request.json()
    if end_time < start_time:
        return {"message": "start_time must be less than end_time"}
    if "metric" not in request_body:
        return {"message": "metric parameter is required" }
    if len(request_body["metric"].strip()) == 0:
        return {"message": "metric parameter cannot be empty" }
    redis_client = ElasticCacheUtility()
    api_name = "MapBlips"
    metrices_name = request_body["metric"]
    query_duration = {"from_time": start_time, "to_time": end_time}
    cache_query = redis_client.cache_key_generator(api_name, query_duration, request_body)
    cache = redis_client.search_cache(cache_query)
    if cache is not None:
        return JSONResponse(jsonable_encoder(json.loads(cache)))
    if request_body["metric"].strip() == "attempts":
        try:
            response =  service.GetMetricInfo(start_time, end_time, metric='MapBlips').map_blips(type="attempts")
            redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
            return response
        except Exception as err:
            logger.exception(f"Error: Something went wrong {err}")
            return {"message": "something went wrong {}".format(err)}
    elif request_body["metric"].strip() == "error":
        try:
            response =  service.GetMetricInfo(start_time, end_time, metric='MapBlips').get_response()
            redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
            return response
        except Exception as err:
            logger.exception(f"Error: Something went wrong {err}")
            return {"message": "something went wrong {}".format(err)}
    elif request_body["metric"] == "concurrent":
        try:
            response =  service.GetMetricInfo(start_time, end_time, metric='geometricinsights').map_blips(type="concurrent")
            redis_client.cache_response(api_name, cache_query, response, cache_expiry=60)
            return response
        except Exception as err:
            logger.exception(f"Error: Something went wrong {err}")
            return {"message": f"something went wrong"}
    else:
        return {"message": "Please use values, attempts or error for key, metric"}

  
@app.get("/{full_path:path}")
def handle_404_get(request: Request, full_path: str):
    if len(full_path) > 0:
        logger.debug(f"url not found")
    else:
        logger.debug(f"status is ok")
    return {"Status": 200}

if __name__ == "__main__":
    uvicorn.run('main:app', host="0.0.0.0", port=5001, log_level="debug", reload=True)
