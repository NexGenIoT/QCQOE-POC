
from typing import Optional
from pydantic import BaseModel, NonNegativeInt


class PingPayloadRequest(BaseModel):
    device_id: str
    current_session_id: str  # SessionID
    last_report_time: NonNegativeInt  # last updated?
    provider: str = 'null'
    location: str = 'null'
    platform: str = 'null'  # DevicePlatform
    stall_count: NonNegativeInt
    startup_buffer_length: NonNegativeInt
    rebuffering_duration: Optional[NonNegativeInt]
    start_bitrate: Optional[NonNegativeInt]
    throughput:Optional[NonNegativeInt] = 0