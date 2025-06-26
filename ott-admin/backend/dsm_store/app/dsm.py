from config import logger
from wrapper import UtilityWrapper
from schemas import RedisDeviceState,DDBRecord,QueueReqBody,SwitchDeplyStatus
from config import settings

class Device(object):
    def __init__(self, request,redis_client):
        #self.redis_client = RedisConnection().client
        self.redis_client = redis_client 
        self.req = request
        self.device_id = None
        self.device_state = None 
        self.device_payload_state = dict()
        self.device_existing_state = dict()

    def set_device_payload_state(self):
        if self.req.ping:
            self.device_payload_state = self.req.ping.dict()
            self.device_state = "ping"
        elif self.req.event:
            self.device_payload_state = self.req.event.dict()
            self.device_state = "event"
        elif self.req.switch:
            self.device_payload_state = self.req.switch.dict()
            self.device_state = "switch"
        elif self.req.registration:
            self.device_payload_state = self.req.registration.dict()
            self.device_state = "registration"
        else:
            logger.exception(f"Invalid requires received : {self.req}")
            raise Exception("Invalid requires received")

    def set_device_key(self):
        self.device_id = f"qoe_dsm_ds_{self.device_payload_state.get('device_id', '')}"

    def set_device_existing_state(self):
        self.device_existing_state = self.redis_client.hgetall(self.device_id)


class DeviceState(object):

    def __init__(self,redis_client,dynamo_obj):
        #self.redis_client = RedisConnection().client
        self.redis_client = redis_client
        self.dynamo_obj = dynamo_obj
        self.mitigation_status_changed = True
        self.group_mitigation_changed = True
        self.is_sbl_change = False
        self.is_mitgation_fixed=False

    def process_state(self, device_state, device_id,device_payload_state, device_existing_state):
        return getattr(self, '_case_'+ str(device_state))(device_id,device_payload_state, device_existing_state)

    def _case_ping(self, device_id,device_payload_state, device_existing_state):
        ping_obj = UtilityWrapper(device_payload_state, device_existing_state)
        ping_obj.set_last_session_id()
        ping_obj.set_stall_count()
        ping_obj.set_sbl_value_today()
        ping_obj.set_sbl_value_last_session()
        ping_obj.set_sbl_value_all_time()
        ping_obj.set_mitigation_default_value()
        ping_obj.set_seconds_watched()
        ping_obj.set_device_ping_time()
        self.mitigation_status_changed = ping_obj.update_mitigation_status()
        self.is_mitgation_fixed  = self.mitigation_status_changed
        ping_obj.calculate_uei()
        ping_obj.set_redis_null_state()
        logger.debug(f"Payload state After Before Setting to Redis {ping_obj.payload_state}")
        self.redis_client.hset(device_id, mapping=ping_obj.payload_state)
        logger.debug(f"Payload state After {ping_obj.payload_state}")
        self.is_sbl_change = ping_obj.is_change_startup_buffer_length()
      
    def _case_event(self, device_id, device_payload_state, device_existing_state):
        self.is_sbl_change = False  
        self.group_mitigation_changed = False
        self.mitigation_status_changed = False
        
    def _case_switch(self, device_id, device_payload_state, device_existing_state):
        switch_obj = UtilityWrapper(device_payload_state, device_existing_state)
        switch_obj.set_previous_uei() 
        switch_obj.set_last_report_time()
        switch_obj.check_missed_status(self.dynamo_obj)
        switch_obj.set_redis_null_state()
        logger.debug(f"Payload state After Before setting to Redis {switch_obj.payload_state}")
        self.redis_client.hset(device_id, mapping=switch_obj.payload_state)
        logger.debug(f"Payload state After {switch_obj.payload_state}")
        self.group_mitigation_changed = switch_obj.is_global_mitigation_changed()


    def _case_registration(self,device_id, device_payload_state, device_existing_state):
        register_obj = UtilityWrapper(device_payload_state, device_existing_state)
        register_obj.set_registration_state()
        register_obj.set_last_report_time()
        register_obj.set_redis_null_state()
        logger.debug(f"Payload state After Before setting to Redis{register_obj.payload_state}")
        self.redis_client.hset(device_id,mapping=register_obj.payload_state)
        self.mitigation_status_changed = True
        logger.debug(f"Payload state After {register_obj.payload_state}")
    
    def _set_dsm_state(self,dsm_state):
        dsm_state['previous_stall_count'] = dsm_state.get('previous_stall_count', 0)
        dsm_state['previous_sbl'] = dsm_state.get('previous_sbl', 4)
        dsm_state['previous_rbl'] = dsm_state.get('previous_rbl', 5)
        dsm_state['previous_rbl'] = dsm_state.get('previous_rbl', 5)
        dsm_state['previous_rbl'] = dsm_state.get('previous_rbl', 5)
        dsm_state['previous_bitrate'] = dsm_state.get('previous_bitrate',1000000)
        dsm_state['previous_througput'] =  dsm_state.get('previous_througput',0) 
        
    def dynamo_update(self,device_id):
        if self.is_sbl_change or self.group_mitigation_changed or self.mitigation_status_changed:
            dsm_state = self.redis_client.hgetall(device_id)
            self._set_dsm_state(dsm_state)
            ds = RedisDeviceState(**dsm_state)
            from db_wrapper import AWSDynamoDB
            dynamo_obj = AWSDynamoDB()
            dynamo_obj.send(DDBRecord.from_device_state(ds).dict())
            if self.is_mitgation_fixed:
                   dynamo_obj.set_table_name(settings.DDB_TABLE_FIXED)
                   dynamo_obj.send(DDBRecord.from_device_state(ds).dict())
        
class DeviceStateManager():
    def __init__(self, request,redis_client):
        self.req = request
        self.device = Device(self.req,redis_client)
        self.device.set_device_payload_state()
        self.device.set_device_key()
        self.device.set_device_existing_state()

    def process_request(self,redis_client,dynamo_obj):
        ds = DeviceState(redis_client,dynamo_obj)
        logger.debug(f"------------------------------Data Before ------------------------------")
        logger.debug(f"Redis state Before{self.device.device_existing_state}")
        logger.debug(f"Payload state Before{self.device.device_payload_state}")
        ds.process_state(self.device.device_state, self.device.device_id,self.device.device_payload_state,
                                                        self.device.device_existing_state)
        logger.debug(f"------------------------------Data After ------------------------------")
        self.device.set_device_existing_state()
        logger.debug(f"Redis state After{self.device.device_existing_state}")
        ds.dynamo_update(self.device.device_id)

