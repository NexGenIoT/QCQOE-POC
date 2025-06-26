from config import settings, logger
from datetime import datetime
import json
# import threading
from opensearchpy import OpenSearch
from rediscluster import RedisCluster
import pandas as pd

class RedisConsumer():
    def __init__(self):
        try:
            self.client = RedisCluster(startup_nodes=[{"host": settings.REDIS_HOST, "port": settings.REDIS_PORT}],
                          decode_responses=True,
                          skip_full_coverage_check=True,
                          ssl=True)
            self.opensearch_client = OpenSearch(
                    hosts=[{'host': settings.OS_HOST, 'port': settings.OS_PORT}],
                    http_compress=True,  # enables gzip compression for request bodies
                    http_auth=(settings.OS_USER, settings.OS_PASSWORD),
                    use_ssl=True,
                    verify_certs=True,
                    ssl_assert_hostname=False,
                    ssl_show_warn=False
                )
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def push_data_to_elastic_search(self, groupby_data):
        try:
            if groupby_data:
                logger.debug(f"groupby_data: {groupby_data}")
                df = pd.DataFrame(groupby_data)
                
                required_cols = ['platform','provider','location', 'content_type','m_concurrent_plays','last_report_time','timestamp']
                df = df[required_cols]
                group_cols = ['platform','provider','location', 'content_type']
                agg_dict = {
                    'm_concurrent_plays' : 'sum',
                    'last_report_time' : 'min',
                    'timestamp' : 'min'
                }
                
                final_records_to_db = df.groupby(group_cols).agg(agg_dict)
                final_records_to_db["batch_time"] =  datetime.utcnow().replace(second=0, microsecond=0).isoformat()
                final_records_to_db = final_records_to_db.reset_index().to_dict("records")
                logger.debug(f"final records sent to db {final_records_to_db}")
                if len(final_records_to_db) > 0:
                    for record in final_records_to_db:
                        logger.debug(f"single record from finalrecordsofdb {record}")
                        response = self.opensearch_client.index(
                                index=settings.CONCURRENT_PLAYS_INDEX_NAME,
                                body=record,
                                refresh=True
                            )
                    logger.debug(f"send_to_concurrent_play response : {response}")
        except Exception as e:
            logger.exception(f"Exception : {str(e)}")

    def scan_and_set(self):
        """
              last_report_time=event.timestamp,
              ueid=event.ueid,
              device_id=event.udid,
              prev_event_state=EventEnum.na if event.eventPrev is None else event.eventPrev,
              last_event_state=event.event,
              current_session_id=event.sessionId,
              cdn=event.cdn if event.cdn else 'NA',
              provider=event.provider if event.provider else 'NA',
              platform=event.platform,
              startup_buffer_length=event.sbl,
              video_id=event.videoId if event.videoId else 'NA',
              mitigation_id=event.mitigationID

        :return:
        """
        process_data = []
        # groupby_data = {}
        for key in self.client.scan_iter("concurrent_play_*"):
            data = self.client.get(key)
            if data:
                res = json.loads(data)
                res["m_concurrent_plays"] = 1
                # groupby_data.setdefault(res['platform'], []).append(res)
                process_data.append(res)
            self.client.delete(key)
        logger.info(f"process_data : {process_data}")
        # logger.info(f"groupby_data : {groupby_data}")
        self.push_data_to_elastic_search(process_data)