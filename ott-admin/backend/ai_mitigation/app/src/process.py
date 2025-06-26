from src.config import settings,logger
from src.db_wrapper import AwsStepFunction
import json


class ProcessRecord(object):
    def __init__(self, dsm_redis_data, ai_redis_data, record, redis_client):
        self.dsm_redis_data = dsm_redis_data
        self.ai_redis_data = ai_redis_data
        self.record = record
        self.redis_client = redis_client 

    def add_throughput(self):
        if self.ai_redis_data.get('sessionid', '') == self.record.get('current_session_id', ''):
            self.ai_redis_data['latest_throughput'].append(self.record['throughput'])
            self.ai_redis_data['latest_record_time'].append(self.record['last_report_time'])
        else:
            self.ai_redis_data['latest_throughput'] = [self.record['throughput']]
            self.ai_redis_data['latest_record_time'] = [self.record['last_report_time']]
            self.ai_redis_data['sessionid'] = self.record['current_session_id']
    
    def set_values_in_redis(self):
        self.redis_client.hset(f"{settings.AI_REDIS_COLLECTION_PREFIX}{self.record['device_id']}",mapping=self.ai_redis_data)

    def prepare_input(self):
        return {"sessionid": self.ai_redis_data['sessionid'],
                "throughput_mbps": [round(throughput/1024/1024*8, 2) for throughput in self.ai_redis_data['latest_throughput']],
                "bitrate_mbps": settings.BITRATE_MBPS_THD
                }
    
    def send_to_ai_mitigation(self):
         request_input = self.prepare_input()
         logger.info(request_input)
         state_machine_obj = AwsStepFunction()
         state_machine_obj.invoke(request_input, name=settings.AI_STATE_MACHINE_ARN)

    def check_previous_mitigation_details(self):
        if self.dsm_redis_data.get('source', '') == 'Manual' and (self.record['last_report_time'] - int(self.dsm_redis_data['last_applied_mitigation_time'])) < settings.MANUAL_MITIGATION_TIME_THD:
            return False 
        elif self.dsm_redis_data.get('source', '') == 'AIMitigation' and (self.record['last_report_time'] - int(self.dsm_redis_data['last_applied_mitigation_time'])) < settings.AI_MITIGATION_TIME_THD:
            return False 
        return True
    
    def convert_ai_redis_data_dict(self):
        self.ai_redis_data['latest_throughput'] = json.loads(self.ai_redis_data['latest_throughput'] )
        self.ai_redis_data['latest_record_time'] = json.loads(self.ai_redis_data['latest_record_time'] )

    def convert_ai_dict_data_to_redis(self):
        self.ai_redis_data['latest_throughput'] = json.dumps(self.ai_redis_data['latest_throughput'] )
        self.ai_redis_data['latest_record_time'] = json.dumps(self.ai_redis_data['latest_record_time'] )
    
    def clear_throughput_data(self):
        self.ai_redis_data['latest_throughput'],self.ai_redis_data['latest_record_time'] = [],[]

    def process(self):
        if self.record.get('throughput', None) and self.check_previous_mitigation_details():
            self.convert_ai_redis_data_dict()
            self.add_throughput()
            if len(self.ai_redis_data.get('latest_throughput', [])) == settings.THROUGHPUT_WINDOW_LEN:
                self.send_to_ai_mitigation() 
                self.clear_throughput_data()
            self.convert_ai_dict_data_to_redis()
            self.set_values_in_redis()
