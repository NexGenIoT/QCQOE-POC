Module: Analytics API web server
--------------------------------------------------------------------------------
Initial setup:
1. Install libs
    pip install -r requirements.txt
2. Create environment file with approporate values
    AWS_REGION_NAME=ap-south-1
    AWS_ACCESS_KEY_ID=
    AWS_SECRET_ACCESS_KEY=
    OS_HOST=open-search-hostname
    OS_PORT=open-search-port
    OS_USER=-open-search-username
    OS_PASSWORD=open-search-password
    OS_INDEX=os-index-name
    REDIS_HOST=redis-cluster-host-name
    REDIS_PORT=redis-cluster-port
    KINESIS_STREAM=realtime-input
    ENABLE_KINESIS=1
    ENABLE_REDIS=1
    ENABLE_OPEN_SEARCH=1
    LOG_LEVEL=DEBUG|INFO|WARNING|ERROR|CRITICAL

Execution
1. Export environment variables
    export $(xargs <dev.env)
2. Start server script
    python main.py

Note: Code developed and tested with Python3.8
