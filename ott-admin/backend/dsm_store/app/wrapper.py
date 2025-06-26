from time import time
from config import logger
from pandas import DataFrame
from datetime import datetime, date
from numpy import average
from schemas import SwitchDeplyStatus,RedisDeviceState,DDBRecord
from config import settings

class UtilityWrapper(object):
    
    def __init__(self,payload,existing_state):
        self.redis_data = existing_state
        self.payload_state = payload
        self.sbl = self.payload_state.get("startup_buffer_length", 0)
        self.stall_count = self.payload_state.get("stall_count", 0)
        self.last_report_time = int(self.payload_state.get("last_report_time", 0))
        self.is_session_id_change = False

    def update_mitigation_status(self):
        if self.payload_state.get('mitigation_id'):
            status = self.redis_data.get("last_mitigation_deployment_status", "NA") 
            if status == 'DISPATCHED'and self.redis_data.get("local_mitigation_id", "") == self.payload_state.get("mitigation_id", " "):
                self.payload_state["last_mitigation_deployment_status"] = 'FIXED'
                self.payload_state["stall_count_last_session"]=0
                self.payload_state["stall_count"]=0
                self.payload_state["sbl_last_session_count"] = 1
                self.payload_state["sbl_last_session_sum"] =self.sbl
                self.payload_state["sbl_last_session"] =self.sbl
                self.payload_state["last_mitigation_applied"] = str(datetime.now())
                self.payload_state["MitigationFixedSessionID"] =self.payload_state['current_session_id']
                self.payload_state["MitigationFixedTime"] = int(time())
                self.payload_state["MitigationFixedTime"] = self.payload_state['last_report_time']
                return True
        return False

    def set_stall_count(self):
        if self.is_session_id_change:
            self.payload_state["stall_count_last_session"] = self.stall_count
            self.payload_state["session_change_at"] = str(datetime.now())
        else:
            self.payload_state["stall_count_last_session"] = int(self.redis_data.get("stall_count_last_session", 0)) + self.stall_count
            
    def continues_aggregation(self,current_sum, current_count, agg_type="avg"):
        avg = int(current_sum)/int(current_count)
        return int(avg)

    def set_sbl_value_today(self):
        if date.fromtimestamp(int(self.redis_data.get("last_report_time",0))) != date.fromtimestamp(self.last_report_time):
            self.payload_state["sbl_today_sum"] = self.sbl
            self.payload_state["sbl_today_count"] = 1
            self.payload_state["sbl_today"] = self.sbl
        else:
            self.payload_state["sbl_today_sum"] = int(self.redis_data.get("sbl_today_sum", 0)) + self.sbl
            self.payload_state["sbl_today_count"] = int(self.redis_data.get("sbl_today_count", 0)) + 1
            self.payload_state["sbl_today"] = self.continues_aggregation(self.payload_state["sbl_today_sum"], self.payload_state["sbl_today_count"])
            
    def set_sbl_value_last_session(self):
        if self.is_session_id_change:
            self.payload_state["sbl_last_session_sum"] = self.sbl
            self.payload_state["sbl_last_session_count"] = 1
            self.payload_state["sbl_last_session"] = self.sbl
        else:
            self.payload_state["sbl_last_session_sum"] = int(self.redis_data.get("sbl_last_session_sum", 0)) + self.sbl
            self.payload_state["sbl_last_session_count"] = int(self.redis_data.get("sbl_last_session_count", 0)) + 1
            self.payload_state["sbl_last_session"] = self.continues_aggregation(self.payload_state["sbl_last_session_sum"], self.payload_state["sbl_last_session_count"])
            
    def set_sbl_value_all_time(self):
        self.payload_state["sbl_all_time_sum"] = int(self.redis_data.get("sbl_all_time_sum", 0)) + self.sbl
        self.payload_state["sbl_all_time_count"] = int(self.redis_data.get("sbl_all_time_count", 0)) + 1
        self.payload_state["sbl_all_time"] = self.continues_aggregation(self.payload_state["sbl_all_time_sum"], self.payload_state["sbl_all_time_count"])
        
    def _get_normalized_val(self,lower_bound, upper_bound, value):
        if not (type(lower_bound) in [float, int] and type(upper_bound) in [float, int] and type(value) in [float, int]):
            print(type(lower_bound), type(upper_bound), type(value))
            raise TypeError("Bad params, please use input as int or float")
        if (lower_bound < 0 or upper_bound < 0 or value < 0):
            raise ValueError("Cannot Except Negative Values")
        if lower_bound - upper_bound == 0:
            raise ValueError("Bad params, may result in divide by zero error")
        if value < lower_bound:
            value = lower_bound + float(0.0001)
        if value > upper_bound:
            value = upper_bound - float(0.0001)
        denominator = upper_bound - lower_bound
        return (value - lower_bound) / denominator
    
    def calculate_uei(self):
        sbl_normalized = self._get_normalized_val(lower_bound=0, upper_bound=6, value=self.payload_state.get('sbl_last_session',4))
        stall_count_normalized = self._get_normalized_val(lower_bound=0, upper_bound=6, value=self.payload_state.get('stall_count_last_session',0))
        sbl_weight = 30
        stall_weight = 70
        values_df = DataFrame([[sbl_normalized, stall_count_normalized]])
        weights_df = DataFrame([[sbl_weight, stall_weight]])
        avg = average(values_df, weights=weights_df)
        normalize_avg = self._get_normalized_val(float("0.001"), float("0.999"), float(avg))
        uei = 1 - normalize_avg
        self.payload_state['current_uei'] = int(uei * 100)
    
    def is_global_mitigation_changed(self):
        return self.redis_data.get('group_mitigation_id','') != self.payload_state.get('group_mitigation_id','')
    
    def set_last_session_id(self):
        existing_session_id = self.redis_data.get('current_session_id','NA')
        payload_session_id = self.payload_state.get('current_session_id',' ')
        if existing_session_id != payload_session_id:
            self.payload_state['last_session_id'] = existing_session_id
            self.is_session_id_change = True
            
    def is_change_startup_buffer_length(self):
        return self.redis_data.get('startup_buffer_length','') != self.payload_state.get('startup_buffer_length','')
    
    def set_mitigation_default_value(self):
        if self.payload_state.get('mitigation_id','NULL') == None:
            self.payload_state['mitigation_id'] = 'NULL'
        else:
            self.payload_state['mitigation_id'] = self.payload_state.get('mitigation_id','NULL') 

    def set_seconds_watched(self):
        self.payload_state['seconds_watched'] = int(self.redis_data.get('seconds_watched',0))+ int(self.payload_state.get('duration_of_playback_in_seconds',0))
    
    def remove_key_from_payload(self,key):
        if key in self.payload_state:
            del self.payload_state[key]

    def set_registration_state(self):
        temp_state = dict()
        temp_state['last_mitigation_deployment_status'] = self.payload_state.get("mitigation_status",'')
        temp_state['last_applied_mitigation_id'] = self.payload_state.get("mitigation_id",'')
        temp_state['last_applied_mitigation_time'] = int(datetime.utcnow().timestamp())
        self.payload_state = temp_state
        
    def set_previous_uei(self):
        uei = float(self.payload_state.get('uei',0.0))
        if uei:
            self.payload_state['previous_uei'] = int(uei)
        elif self.payload_state.get('last_mitigation_deployment_status') == SwitchDeplyStatus.pending:
            current_uei = self.redis_data.get('current_uei',0.0)
            if current_uei:
                self.payload_state['previous_uei'] = int(current_uei)

    def check_missed_status(self,dynamo_obj):
        ds = RedisDeviceState(**self.redis_data)
        if ds.last_mitigation_deployment_status == SwitchDeplyStatus.pending:
            if ds.group_mitigation_id != self.payload_state.get('group_mitigation_id', ''):
                ds.last_mitigation_deployment_status = 'MISSED'
                from db_wrapper import AWSDynamoDB
                dynamo_obj = AWSDynamoDB()
                dynamo_obj.send(DDBRecord.from_device_state(ds).dict())
    
    def set_last_report_time(self):
        self.payload_state['last_report_time'] = int(time())

    def set_device_ping_time(self):
        self.payload_state['last_ping_time'] = int(time())
    
    def set_redis_null_state(self):
        for k,v in self.payload_state.items():
            self.payload_state[k] = v if v is not None else ""




    
 


