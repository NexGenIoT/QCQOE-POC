import datetime
from enum import Enum
from typing import Optional
from uuid import uuid4

from pydantic import BaseModel, Field, IPvAnyAddress, NonNegativeInt


def get_current_utc_timestamp():
    return int(datetime.datetime.utcnow().timestamp())


class BufferStyleEnum(str, Enum):
    continuous = "continuous"
    burst = "burst"


class EventMonitoringEnum(str, Enum):
    on = "on"
    off = "off"


class ProbeConfig(BaseModel):
    renditionSwitch: str = EventMonitoringEnum.on
    stalls: str = EventMonitoringEnum.on
    userActions: str = EventMonitoringEnum.on
    qualityChanged: str = EventMonitoringEnum.on


def generate_mitigation_config_id():
    return str(uuid4())


class MitigationConfig(BaseModel):
    startupBuffDuration: int = -1
    rebufferingDuration: int = -1
    estimatedDownloadRate: int = -1
    bufferingStyle: BufferStyleEnum = BufferStyleEnum.continuous
    mitigationID: str = Field(default_factory=generate_mitigation_config_id)
    mitigationTimestamp: int = Field(default_factory=get_current_utc_timestamp)


class PlayerConfig(BaseModel):
    pc: ProbeConfig
    mc: Optional[MitigationConfig]


class Registration(BaseModel):
    ueid: str
    udid: str
    clientClock: int
    mitigationCfgID: Optional[str]
    mitigationApplTime: Optional[int]
    clientIP: Optional[IPvAnyAddress]
    ua: str
    platform: Optional[str]
    deviceType: Optional[str]
    version:Optional[str]


class RegistrationRequest(BaseModel):
    req: Registration


class RegRes(BaseModel):
    version: str
    bu: str
    kaInterval: int = 60
    kcInterval: int = 120
    serverClkOffset: int = 0
    cfg: PlayerConfig
    kcTimer:int
    kaTimer:int


class RegistrationResponse(BaseModel):
    registration_response: RegRes


class MitigationRequest(BaseModel):
    ueid: str
    udid: str
    mitigationCfgID: Optional[str]
    mitigationApplTime: Optional[int]
    clientIP: str
    ua: str
    platform: Optional[str]
    deviceType: Optional[str]
    version:Optional[str]


class MitigationConfigRequest(BaseModel):
    configRequest: MitigationRequest


class MitigationConfigRes(BaseModel):
    version: str
    mc: Optional[MitigationConfig]


class MitigationConfigResponse(BaseModel):
    mitigation_config_response: MitigationConfigRes


# Todo: schema for sending mitigation dispatched signal to the dsm store
class MitigationStatusUpdate(BaseModel):
    device_id: str
    mitigation_status: str = 'DISPATCHED'
    mitigation_id: str


class MitigationStatusUpdateReq(BaseModel):
    registration: MitigationStatusUpdate
