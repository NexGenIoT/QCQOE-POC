from enum import Enum
from typing import Optional
from pydantic import BaseModel, NonNegativeInt, root_validator, Field


null = 'NULL'


def generate_record_id(gmi: str, udid: str):
    return f"{gmi}:{udid}"



def device_key(device_id: str):
    """Generate key for device state hashmap in redis"""
    return f"qoe_dsm_ds_{device_id}"


class SwitchDeplyStatus(str, Enum):
    pending = 'Pending'
    policy_violated = 'PolicyViolated'
    null = null


class BufferStyleEnum(str, Enum):
    continuous = "continuous"
    burst = "burst"


class EventEnum(str, Enum):
    playclicked = 'PLAYCLICKED'
    started = 'STARTED'
    stopped = 'STOPPED'
    buffering = 'BUFFERING'
    paused = 'PAUSED'
    resumed = 'RESUMED'
    error = 'ERROR'
    seeked = 'SEEKED'
    null = 'NULL'
    na = "NA"
    completed = 'COMPLETED'
    idle = 'IDLE'


class MitigationConfig(BaseModel):
    startupBuffDuration: int
    rebufferingDuration: int
    estimatedDownloadRate: int
    bufferingStyle: BufferStyleEnum
    mitigationID: str
    mitigationTimestamp: int


# Device State in MemoryDB/Redis
class RedisDeviceState(BaseModel):
    # Device Identifier, unique
    device_id: str
    ueid: str

    # Metrics
    seconds_watched: NonNegativeInt = 0
    ended_plays: NonNegativeInt = 0
    failed_plays: NonNegativeInt = 0
    total_plays: NonNegativeInt = 0

    # States
    prev_event_state: EventEnum = EventEnum.null
    last_event_state: EventEnum = EventEnum.null
    video_id: str = null
    last_session_id: str = null
    current_session_id: str = null
    last_report_time: NonNegativeInt = 0
    cdn: str = null
    provider: str = null
    location: str = null
    platform: str = null
    last_applied_mitigation_id: str = null
    last_applied_mitigation_time: NonNegativeInt = 0
    startup_buffer_last_session: NonNegativeInt = 0
    previous_uei: float = 0.0
    current_uei: float = 0.0
    stall_count: NonNegativeInt = 0
    stall_count_last_session: NonNegativeInt = 0
    local_mitigation_id: str = null
    group_mitigation_id: str = null
    avg_startup_buffer_today: NonNegativeInt = 0
    avg_startup_buffer_all_time: NonNegativeInt = 0
    last_session_avg_bitrate: NonNegativeInt = 0

    source: str = null
    startup_buffer_length: Optional[NonNegativeInt] = 0
    sbl_last_session: Optional[NonNegativeInt] = 0
    rebuffering_duration: Optional[NonNegativeInt] = 0
    start_bitrate: NonNegativeInt = 0
    throughput:Optional[NonNegativeInt] = 0
    last_mitigation_deployment_status: str = null
    mitigation_time_stamp: NonNegativeInt = 0
    previous_stall_count: Optional[NonNegativeInt] = 0
    previous_sbl: Optional[NonNegativeInt] = 4
    previous_rbl: Optional[NonNegativeInt] = 5
    previous_bitrate:Optional[NonNegativeInt] = 1000000
    previous_throughput:Optional[NonNegativeInt] = 0
    set_device_ping_time: Optional[int] = 0
    MitigationGenerationSessionID : str = null
    MitigationGenerationTime : NonNegativeInt = 0
    MitigationFixedSessionID : str = null
    MitigationFixedTime: NonNegativeInt = 0


class BasePayloadRequest(BaseModel):
    device_id: str


class RegistrationServiceRequest(BasePayloadRequest):
    mitigation_status: str
    mitigation_id: str


class EventPayloadRequest(BasePayloadRequest):
    ueid: str
    prev_event_state: EventEnum = EventEnum.null
    last_event_state: EventEnum
    video_id: str = 'null'
    current_session_id: str  # SessionID
    last_report_time: NonNegativeInt  # last updated?
    cdn: str = 'null'
    provider: str = 'null'
    location: str = 'null'
    platform: str = 'null'  # DevicePlatform
    mitigation_id: Optional[str]


class PingPayloadRequest(BasePayloadRequest):
    ueid: str
    current_session_id: str  # SessionID
    last_report_time: NonNegativeInt  # last updated?
    video_id: str = 'null'
    cdn: str = 'null'
    provider: str = 'null'
    location: str = 'null'
    platform: str = 'null'  # DevicePlatform
    duration_of_playback_in_seconds: NonNegativeInt = 0
    mitigation_id: Optional[str]
    stall_count: NonNegativeInt
    startup_buffer_length: NonNegativeInt
    rebuffering_duration: Optional[NonNegativeInt]
    start_bitrate: Optional[NonNegativeInt]
    throughput:Optional[NonNegativeInt] = 0


class SwitchServiceRequest(BasePayloadRequest):
    local_mitigation_id: str  # Simple update
    group_mitigation_id: str  # Simple update
    source: str  # Simple update
    current_session_id: Optional[str] 
    last_mitigation_deployment_status: SwitchDeplyStatus
    mitigation_time_stamp: NonNegativeInt
    uei: Optional[float]
    previous_sbl:NonNegativeInt
    previous_rbl:NonNegativeInt
    previous_stall_count:NonNegativeInt
    previous_bitrate:NonNegativeInt
    previous_throughput:Optional[NonNegativeInt] = 0
    suggestive_rebuffering_duration:int = Field(lt=2**62,gt=-2)
    suggestive_start_bitrate:int = Field(lt=2**62,gt=-2)
    suggestive_startup_buffer_duration: int = Field(lt=2**62,gt=-2) 
    MitigationGenerationSessionID : str
    MitigationGenerationTime : NonNegativeInt


class QueueReqBody(BaseModel):
    ping: Optional[PingPayloadRequest]
    event: Optional[EventPayloadRequest]
    registration: Optional[RegistrationServiceRequest]
    switch: Optional[SwitchServiceRequest]

    @root_validator
    def any_of(cls, v):
        if not any(v.values()):
            raise ValueError('request body should have one of ping, event, registration or switch payload')
        return v


class DDBRecord(BaseModel):
    record_id: str = Field(default_factory=generate_record_id)
    device_id: str
    ueid: str
    last_report_time: NonNegativeInt
    stall_count: NonNegativeInt
    local_mitigation_id: str
    provider: str
    rebuffering_duration: Optional[NonNegativeInt]
    start_bitrate: NonNegativeInt
    throughput:Optional[NonNegativeInt] = 0
    startup_buffer_length: Optional[NonNegativeInt]
    mitigation_status: str
    location: str
    mitigation_state_timestamp: NonNegativeInt
    source: str
    group_mitigation_id: str
    last_session_id: str
    current_session_id: str
    platform: str
    current_uei: float
    previous_uei: float
    previous_stall_count: Optional[NonNegativeInt] = 0
    previous_sbl: Optional[NonNegativeInt] = 4
    previous_rbl: Optional[NonNegativeInt] = 5
    previous_bitrate:Optional[NonNegativeInt] = 1000000
    previous_throughput:Optional[NonNegativeInt] = 0
    MitigationGenerationSessionID : str
    MitigationGenerationTime : NonNegativeInt
    MitigationFixedSessionID : str
    MitigationFixedTime : NonNegativeInt


    @classmethod
    def from_device_state(cls, ds: RedisDeviceState):
        return cls(record_id=generate_record_id(ds.group_mitigation_id, ds.device_id),
                   device_id=ds.device_id,
                   last_report_time=ds.last_report_time,
                   stall_count=ds.stall_count_last_session,
                   local_mitigation_id=ds.local_mitigation_id,
                   provider=ds.provider,
                   rebuffering_duration=ds.rebuffering_duration,
                   start_bitrate=ds.start_bitrate,
                   startup_buffer_length=ds.sbl_last_session,
                   mitigation_status=ds.last_mitigation_deployment_status,
                   location=ds.location,
                   mitigation_state_timestamp=ds.mitigation_time_stamp,
                   source=ds.source,
                   group_mitigation_id=ds.group_mitigation_id,
                   platform=ds.platform,
                   previous_uei=ds.previous_uei,
                   current_uei=ds.current_uei,
                   last_session_id=ds.last_session_id,
                   current_session_id=ds.current_session_id,
                   ueid=ds.ueid,
                   previous_stall_count=ds.previous_stall_count,
                   previous_sbl=ds.previous_sbl,
                   previous_rbl=ds.previous_rbl,
                   previous_bitrate=ds.previous_bitrate,
                   previous_throughput=ds.previous_throughput,
                   throughput=ds.throughput,
                   MitigationGenerationSessionID = ds.MitigationGenerationSessionID,
                   MitigationGenerationTime = ds.MitigationGenerationTime,
                   MitigationFixedSessionID = ds.MitigationFixedSessionID,
                   MitigationFixedTime = ds.MitigationFixedTime
                   )