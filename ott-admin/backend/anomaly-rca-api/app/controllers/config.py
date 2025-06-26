import boto3
from rediscluster import RedisCluster
from pydantic import BaseSettings
from loguru import logger

class Settings(BaseSettings):

    
    RCA_BUCKET_FILE: str = "rca_buckets.csv"
    MITIGATION_PLAN_FILE: str ="mitigation_plans.csv"
    ESD_BUCKET: str ='expert-system-dashboard-utils'
    # AWS Config
    AWS_REGION_NAME: str = 'ap-south-1'
    AWS_ACCESS_KEY_ID: str = ''
    AWS_SECRET_ACCESS_KEY: str = ''

    # s3
    AWS_S3_BUCKET_NAME: str ="qoe-aggregation"

    # Redis/MemoryDB config
    REDIS_HOST: str = '3.6.164.157'
    REDIS_PORT: int = 6379

    # Open Search Config
    OPEN_SEARCH_URL: str = 'https://vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com'
    OPEN_SEARCH_HOST: str  = 'vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com'
    OPEN_SEARCH_PORT: str = '443'
    OPEN_SEARCH_USER: str = 'admin'
    OPEN_SEARCH_PASSWORD: str  = ''
    OPEN_SEARCH_INDEX: str = ''
    OPEN_SEARCH_DRIVER: str = ''
    OPEN_SEARCH_JAR: str = ''

    # SQLite
    SQLITE_ENGINE: str = "sqlite:///my_lite_store.db"
    SQLITE_DB_NAME: str = "my_lite_store.db"

    #INDEX NAME
    DSM_ES_INDEX_NAME: str = "qoe_dev_state_6"
    FLINK_ES_INDEX_NAME: str = "qoe_metric_dev"
    CONCURRENT_PLAYS_INDEX_NAME: str = 'qoe_concurrent_dev'

    JDBC_URL: str = "jdbc:opensearch://https://vpc-qoe-aggregation-o3dikm2rylf5rjs45de4vyu3p4.ap-south-1.es.amazonaws.com"

    MITIGATION_LAMBDA_FUNCTION: str = "arn:aws:lambda:ap-south-1:466469185144:function:SwitchLambda"

    DYNAMODB_OUTAGE_BANNER_TABLE: str = "qoe_outage_banner"

    DDB_MITIGATION_PLAN: str = "qoe-mitigation-plan-types"
    DDB_RCA_BUCKET: str = "qoe-rca-buckets"
    DYNAMO_ANOMALY_SUMMARY_UPDATE: str = "arn:aws:lambda:ap-south-1:466469185144:function:update-anomaly-summary-dynamo"
    ANOMALY_MITIGATION_EMAIL_FILES_BUCKET: str = "anomaly-mitigation-email-files-local"
    ANOMALY_SUMMARY_TABLE_NAME: str = "anomaly_summary"
    MITIGATION_FILE_NAME: str = "ai_mitigation_records.csv"
    MITIGATION_RECORDS_S3_BUCKET: str = "mitigation-ai-records-dev"
    DDB_MITIGATION_SCREEN_LEVEL_1:str = "mitigation_history_screen_level1"
    DDB_AI_MITIGATION_RECORDS:str = "mitigation_ai_records"
    DDB_ANOMALY_PLAYBACK_FAILURE:str = "anomaly_summary_playback_failure"
    MITIGATION_SOURCE_NAME:str = "AI"
    SNS_TOPIC_ARN:str = "arn:aws:sns:ap-south-1:466469185144:"
    ATHENA_PAGINATION_LIMIT: int = 100
    ATHENA_PAGINATION_OUTPUT_LOCATION: str = "s3://qoe-athena-results"
    PUSH_LABEL_RCA:str = "qoe-rca-label-payload"
    PUSH_LABEL_ANOMALY:str = "qoe-anamoly-label-payload"
    PUSH_LABEL_PLAYBACK:str = "qoe-rca-label-payload"
    ATHENA_TABLES_DB:str = "anomaly-destination"
    MITIGATION_AI_RECORDS: str = "mitigation_ai_records"
    QOE_RCA_BUCKETS: str = "qoe-rca-buckets"


settings = Settings()

redis = RedisCluster(startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                  decode_responses=True,
                  skip_full_coverage_check=True,
                  ssl=True)

firehose_client = boto3.client('firehose', aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                               aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
                               region_name=settings.AWS_REGION_NAME)
boto3_session = boto3.Session(region_name=settings.AWS_REGION_NAME,
                                    aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                    aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)


