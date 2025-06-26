import json
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from redis import Redis
from rediscluster import RedisCluster

from config import settings
from schemas import CitiesRes

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if settings.REDIS_CLUSTER:
    rc = RedisCluster(startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                      decode_responses=True,
                      skip_full_coverage_check=True,
                      ssl=True)
else:
    rc = Redis(host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True)


@app.get("/cities")
async def root() -> CitiesRes:
    cities = rc.smembers(settings.REDIS_KEY)
    res = CitiesRes(cities=list(cities))
    return res


@app.get("/api/states")
async def get_states():
    states = rc.hgetall("qoe_state_cities")
    if states:
        for state in states:
            if type(states[state]) is str:
                states[state] = json.loads(states[state])
    return states


@app.get("/status")
async def status():
    return {"msg": "ok"}


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('main:app', host="0.0.0.0", port=8000, log_level="debug", reload=False)
