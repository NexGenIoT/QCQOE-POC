import datetime
from config import settings, logger
import inspect
from enum import Enum
from typing import Optional
from pydantic import BaseModel, NonNegativeInt, constr, root_validator, Field, IPvAnyAddress


# Todo: add limitations for the fields in the payloads

class ErrorDesc(BaseModel):
    ErrorCode: str
    ErrorName: str
    ErrorDetails: str


class EventData(BaseModel):
    latency: Optional[NonNegativeInt] = 0
    vrt: Optional[NonNegativeInt] = 0
    desc: Optional[ErrorDesc]

    @root_validator
    def any_of(cls, v):
        present = False
        if 'latency' in v.keys():
            present = True
        if 'vrt' in v.keys():
            present = True
        if not present:
            raise ValueError('EventData should have latency or vrt')
        return v


class DRMEnum(str, Enum):
    widevine = 'Widevine'
    fairplay = 'Fairplay'
    playready = 'Playready'


class EventEnum(str, Enum):
    playclicked = 'PLAYCLICKED'
    started = 'STARTED'
    stopped = 'STOPPED'
    buffering = 'BUFFERING'
    paused = 'PAUSED'
    resumed = 'RESUMED'
    error = 'ERROR'
    seeked = 'SEEKED'
    na = 'NA'
    completed = 'COMPLETED'
    idle = 'IDLE'


# provider_enum = {'Curiosity': 'Curiosity', 'Curiosity Stream': 'Curiosity', 'CuriosityStream': 'Curiosity', 'Curiosity_Stream': 'Curiosity', 'curiosity': 'Curiosity', 'curiosity stream': 'Curiosity', 'curiositystream': 'Curiosity', 'curiosity_stream': 'Curiosity',
#  'DocuBay': 'DocuBay', 'docubay': 'DocuBay', 'docu_bay': 'DocuBay', 'Epic ON': 'EpicOn', 'epicOn': 'EpicOn', 'Epic_On': 'EpicOn', 'epic on': 'EpicOn', 'epicon': 'EpicOn', 'epic_on': 'EpicOn', 'Eros Now': 'ErosNow', 'ErosNow': 'ErosNow', 'Eros_Now': 'ErosNow', 'eros now': 'ErosNow', 'erosnow': 'ErosNow', 'eros_now': 'ErosNow', 'Hoichoi': 'Hoichoi', 'hoichoi': 'Hoichoi', 'Hoi_choi': 'Hoichoi', 'hoi_choi': 'Hoichoi', 'Hungama': 'Hungama', 'HungamaPlay': 'Hungama', 'Hungama_Play': 'Hungama', 'hungamaplay': 'Hungama', 'hungama': 'Hungama', 'hungama_play': 'Hungama', 'PlanetMarathi': 'PlanetMarathi', 'Planet_Marathi': 'PlanetMarathi', 'planetmarathi': 'PlanetMarathi', 'planet_marathi': 'PlanetMarathi', 'ShemarooMe': 'ShemarooMe', 'Shemaroome': 'ShemarooMe', 'Shemaroo Me': 'ShemarooMe', 'shemaroome': 'ShemarooMe', 'shemaroo_me': 'ShemarooMe', 'Sun NXT': 'SunNxt', 'SunNxt': 'SunNxt', 'Sun_Nxt': 'SunNxt', 'sun nxt': 'SunNxt', 'sunnxt': 'SunNxt', 'sun_nxt': 'SunNxt', 'Voot Kids': 'VootKids', 'VootKids': 'VootKids',
# 'Voot_Kids': 'VootKids', 'voot kids': 'VootKids', 'vootkids': 'VootKids', 'voot_kids': 'VootKids',
# 'Voot Select': 'VootSelect', 'VootSelect': 'VootSelect', 'Voot_Select': 'VootSelect', 'voot select': 'VootSelect', 'vootselect': 'VootSelect', 'voot_select': 'VootSelect',
# 'SonyLiv': 'SonyLiv', 'Sony_Liv': 'SonyLiv', 'sonyliv': 'SonyLiv', 'sony_liv': 'SonyLiv',
# 'Hotstar': 'Hotstar', 'Hot_star': 'Hotstar', 'hotstar': 'Hotstar', 'hot_star': 'Hotstar',
# 'Prime': 'Prime', 'prime': 'Prime',
# 'ZEE5': 'Zee5', 'zee5': 'Zee5', 'zee_5': 'Zee5',
# 'NammaFlix': 'NammaFlix', 'Namma Flix': 'NammaFlix', 'NAMMA FLIX': 'NammaFlix', 'NAMMA_FLIX': 'NammaFlix', 'namma_flix': 'NammaFlix', 'Namma_Flix': 'NammaFlix', 'namma flix': 'NammaFlix', 'nammaflix': 'NammaFlix',
# 'Chaupal': 'Chaupal', 'chaupal': 'Chaupal'
# }

class ContentTypeEnum(Enum):
    movies = "MOVIES"
    tv_shows = "TV_SHOWS"


class HasEnum(str, Enum):
    hls = 'HLS'
    mss = 'MSS'
    dash = 'DASH'
    unknown = 'UNKNOWN'


class LiveEnum(str, Enum):
    true = 'true'
    false = 'false'


class NetworkTypeEnum(str, Enum):
    cellular = 'Cellular'
    cellular_2g = 'Cellular-2G'
    cellular_3g = 'Cellular-3G'
    cellular_4g = 'Cellular-4G'
    cellular_5g = 'Cellular-5G'
    wifi = 'WiFi'


class DeviceTypeEnum(str, Enum):
    mobile = 'Mobile'
    ctv = 'CTV'
    web = 'Web'
    firestick = 'Firestick'
    firetv = "FireTv"
    androidsmarttv = "AndroidSmartTv"


class PayloadTypeEnum(str, Enum):
    event = 'EVENT'
    ping = 'PING'


def optional(*fields):
    """Decorator function used to modify a pydantic model's fields to all be optional.
    Alternatively, you can  also pass the field names that should be made optional as arguments
    to the decorator.
    Taken from https://github.com/samuelcolvin/pydantic/issues/1223#issuecomment-775363074
    """

    def dec(_cls):
        for field in fields:
            _cls.__fields__[field].required = False
        return _cls

    if fields and inspect.isclass(fields[0]) and issubclass(fields[0], BaseModel):
        cls = fields[0]
        fields = cls.__fields__
        return dec(cls)

    return dec


class Payload(BaseModel):
    aCodec: Optional[str]  # optional
    assetDuration: Optional[int] 
    bitrate: int 
    cdn: Optional[str] = 'NA'  # optional
    deviceType: DeviceTypeEnum
    drm: Optional[DRMEnum]  # optional
    has: Optional[HasEnum]  # optional
    live: LiveEnum
    manufacturer: str
    mitigationID: Optional[str]  # optional
    model: str
    networkType: NetworkTypeEnum
    platform: str
    playbackPosInSec: Optional[NonNegativeInt]  # optional
    player: str
    playerApp: str
    provider: Optional[str]  # optional
    resolution: Optional[str]  # optional
    sdkVersion: str
    sessionId: str
    throughput: NonNegativeInt = 0  # optional
    timestamp: int 
    ua: Optional[str]  # optional
    udid: str
    # Todo: accept empty string as well as default
    # Todo: check what happens if null or empty received
    ueid: Optional[constr(to_lower=True, regex='^[a-f0-9]{32}$')]
    vCodec: Optional[str]  # optional
    version: str
    videoId: Optional[str]  # optional
    videoTitle: Optional[str]
    frameRate: int 
    contentType: Optional[str]
    subscriberId: Optional[str]
    clientIP: IPvAnyAddress
    sblLevel: Optional[float]
    rblLevel: Optional[float]
    analytics_api_version: Optional[str] = '1.0.0'


# @optional
class EventPayload(Payload):
    event: EventEnum
    eventData: Optional[EventData]
    eventPrev: Optional[EventEnum]
    sbl: NonNegativeInt = 0
    contentType: Optional[str]
    durationOfPlayback: int 
    stall: Optional[dict] = {'duration': 0}  # optional

    @root_validator()
    def error_checking(cls, v):
        logger.info(f"event payload: {str(v)}")
        if 'event' in v.keys() and v['event'] == EventEnum.error.value:
            try:
                if 'eventData' in v.keys() and v['eventData'] and v['eventData'].desc is None:
                    raise ValueError("ERROR event should have error description!")
            except KeyError:
                logger.error(f"Error while checking eventData: \n {v}")
        return v


# @optional
class PingPayload(Payload):
    diffTime: Optional[NonNegativeInt] = 0
    durationOfPlayback: int 
    stall: Optional[dict] = {'duration': 0}  # optional
    switch: Optional[dict]  # optional
    totalDurationOfPlayback: Optional[NonNegativeInt] = 0
    totalStallDuration: Optional[NonNegativeInt] = 0
    totalSwitchesUp: Optional[NonNegativeInt] = 0
    totalSwitchesDown: Optional[NonNegativeInt] = 0
    sbl: NonNegativeInt = 0
    rbl: NonNegativeInt = 0
    frameLoss: int = 0
    contentType: Optional[str]


class FullSchema(Payload):
    event: Optional[EventEnum]
    eventData: Optional[dict]
    eventPrev: Optional[EventEnum]
    diffTime: Optional[NonNegativeInt]
    durationOfPlayback: int
    stall: Optional[str]
    switch: Optional[str]
    totalDurationOfPlayback: Optional[NonNegativeInt] = 0
    totalStallDuration: Optional[NonNegativeInt] = 0
    totalSwitchesUp: Optional[NonNegativeInt] = 0
    totalSwitchesDown: Optional[NonNegativeInt] = 0
    payloadType: PayloadTypeEnum


class PushBasePingPayload(BaseModel):
    timestamp: int
    platform: str
    deviceType: str


class AnalysisReqBody(BaseModel):
    ping: Optional[PingPayload]
    event: Optional[EventPayload]

    @root_validator
    def any_of(cls, v):
        present = False
        if 'event' in v.keys() and 'ping' in v.keys():
            return v
        if 'event' in v.keys():
            return v
        elif 'ping' in v.keys():
            return v
        else:
            raise ValueError('request body should have ping or event payload')
        return v


# Todo: how to get last session id?
class EventSchemaRedis(BaseModel):
    device_id: str
    ueid: str
    prev_event_state: EventEnum = EventEnum.na
    last_event_state: EventEnum
    video_id: str = 'null'
    current_session_id: str  # SessionID
    last_report_time: NonNegativeInt  # last updated?
    cdn: str = 'null'
    provider: str = 'null'
    location: str = 'null'
    platform: str = 'null'  # DevicePlatform
    mitigation_id: Optional[str]
    contentType: Optional[str]
    vrt: int = 0
    latency: int = 0


class PingSchemaRedis(BaseModel):
    device_id: str
    ueid: str
    video_id: str = 'null'
    current_session_id: str  # SessionID
    last_report_time: NonNegativeInt  # last updated?
    cdn: str = 'null'
    provider: str = 'null'
    location: str = 'null'
    platform: str = 'null'  # DevicePlatform
    mitigation_id: Optional[str]
    startup_buffer_duration: NonNegativeInt
    startup_buffer_length: NonNegativeInt
    duration_of_playback_in_seconds: NonNegativeInt = 0
    stall_count: NonNegativeInt
    contentType: Optional[str]
    start_bitrate: NonNegativeInt = 0
    throughput: NonNegativeInt = 0
    rebuffering_duration: NonNegativeInt = 0


class DeviceStateSchemaRedis(BaseModel):
    ping: Optional[PingSchemaRedis]
    event: Optional[EventSchemaRedis]

    @classmethod
    def from_event(cls, event: EventPayload):
        es = EventSchemaRedis(last_report_time=event.timestamp,
                              ueid=event.ueid,
                              device_id=event.udid,
                              prev_event_state=EventEnum.na if event.eventPrev is None else event.eventPrev,
                              last_event_state=event.event,
                              current_session_id=event.sessionId,
                              cdn=event.cdn if event.cdn else 'NA',
                              provider=event.provider,
                              platform=event.deviceType if event.platform == 'Android' and event.deviceType in ['Firestick','AndroidSmartTv'] else event.platform,
                              startup_buffer_length=event.sbl,
                              video_id=event.videoId if event.videoId else 'NA',
                              mitigation_id=event.mitigationID,
                              contentType=event.contentType,
                              duration_of_playback_seconds=event.durationOfPlayback,
                              stall_duration_milliseconds=event.stall['duration'] if event.stall.get('duration') else 0
                              )
        if event.eventData:
            if event.eventData.vrt:
                es.vrt = event.eventData.vrt
            if event.eventData.latency:
                es.latency = event.eventData.latency
        return cls(event=es)

    @classmethod
    def from_ping(cls, ping: PingPayload):
        ps = PingSchemaRedis(last_report_time=ping.timestamp,
                             ueid=ping.ueid,
                             device_id=ping.udid,
                             current_session_id=ping.sessionId,
                             cdn=ping.cdn if ping.cdn else 'NA',
                             provider=ping.provider,
                             platform=ping.deviceType if ping.platform == 'Android' and ping.deviceType in ['Firestick','AndroidSmartTv'] else ping.platform,
                             video_id=ping.videoId if ping.videoId else 'NA',
                             mitigation_id=ping.mitigationID,
                             startup_buffer_duration=ping.sbl,
                             startup_buffer_length=ping.sbl,
                             duration_of_playback_in_seconds=ping.durationOfPlayback,
                             stall_count=ping.stall['count'] if ping.stall.get('count') else 0,
                             contentType=ping.contentType,
                             start_bitrate=ping.bitrate,
                             throughput=ping.throughput,
                             rebuffering_duration=ping.rbl
                             )
        return cls(ping=ps)


class DeviceStateSchemaOS(BaseModel):
    """Open search device state schema"""
    last_report_time: str
    device_id: str
    prev_event_state: Optional[EventEnum] = EventEnum.na
    last_event_state: Optional[EventEnum]
    current_session_id: str
    ueid: constr(to_lower=True, regex='^[a-f0-9]{32}$')
    seconds_watched: NonNegativeInt = 0

    cdn: str = 'NA'
    provider: str = 'NA'
    location: Optional[str]
    platform: str

    startup_buffer_duration: Optional[NonNegativeInt]
    startup_buffer_length: Optional[NonNegativeInt]
    rebuffering_duration: Optional[NonNegativeInt]
    contentType: Optional[str]

    @classmethod
    def from_event(cls, event: EventPayload):
        return cls(last_report_time=datetime.datetime.utcfromtimestamp(event.timestamp).isoformat() + '+00:00',
                   device_id=event.udid,
                   prev_event_state=EventEnum.na if event.eventPrev is None else event.eventPrev,
                   last_event_state=event.event,
                   current_session_id=event.sessionId,
                   ueid=event.ueid,
                   cdn=event.cdn if event.cdn else 'NA',
                   provider=event.provider,
                   platform=event.deviceType if event.platform == 'Android' and event.deviceType in ['Firestick','AndroidSmartTv'] else event.platform,
                   contentType=event.contentType
                   )

    @classmethod
    def from_ping(cls, ping: PingPayload):
        return cls(last_report_time=datetime.datetime.utcfromtimestamp(ping.timestamp).isoformat() + '+00:00',
                   device_id=ping.udid,
                   current_session_id=ping.sessionId,
                   ueid=ping.ueid,
                   cdn=ping.cdn if ping.cdn else 'NA',
                   provider=ping.provider,
                   platform=ping.deviceType if ping.platform == 'Android' and ping.deviceType in ['Firestick','AndroidSmartTv'] else ping.platform,
                   startup_buffer_duration=ping.sbl,
                   startup_buffer_length=ping.sbl,
                   rebuffering_duration=ping.rbl,
                   contentType=ping.contentType
                   )


def now_time_in_seconds() -> int:
    return int(datetime.datetime.utcnow().timestamp())


class KinesisPayload(BaseModel):
    platform: Optional[str]
    provider: Optional[str]
    networkType: Optional[str]
    drm: Optional[str]
    has: Optional[str]
    manufacturer: Optional[str]
    live: Optional[str]
    cdn: Optional[str]
    bitrate_bits_per_second: int 
    event: EventEnum = EventEnum.na
    event_prev: EventEnum = EventEnum.na
    sessionid: Optional[str]
    stall_duration_milliseconds: NonNegativeInt = 0
    duration_of_playback_seconds: NonNegativeInt = 0
    udid: Optional[str]
    framerate: int
    throughput_bits_per_second: NonNegativeInt = 0
    vrt_milliseconds: int = 0
    latency_milliseconds: int = 0
    frameloss: int = 0
    timestamp: int 
    event_time: int = Field(default_factory=now_time_in_seconds)
    asset_duration_seconds: int 
    deviceType: DeviceTypeEnum
    contentType: Optional[str]

    @classmethod
    def from_event_load(cls, event: EventPayload):
        print(event['aCodec'],'airpods')
        obj = cls(bitrate_bits_per_second=event['bitrate'],
                  networkType=event['networkType'],
                  drm=event['drm'],
                  has=event['has'],
                  manufacturer=event['manufacturer'],
                  live=event['live'],
                  cdn=event['cdn'],
                  provider=event['provider'],
                  sessionid=event['sessionId'],
                  timestamp=event['timestamp'],
                  event=event['event'],
                  platform=event['deviceType'] if event['platform'] == 'Android' and event['deviceType'] in ['Firestick','AndroidSmartTv'] else event['platform'],
                  framerate=event['frameRate'],
                  throughput_bits_per_second=event['throughput'],
                  udid=event['udid'],
                  asset_duration_seconds=event['assetDuration'],
                  deviceType=event['deviceType'],
                  contentType=event['contentType'],
                  duration_of_playback_seconds=event['durationOfPlayback'],
                  stall_duration_milliseconds=event['stall']['duration'] if event['stall'].get('duration') else 0,
                  )
        if event['eventData']:
            if 'eventData' in event and 'vrt' in event['eventData']:
                obj.vrt_milliseconds = event['eventData']['vrt']
            if 'eventData' in event and 'latency' in event['eventData']:
                obj.latency_milliseconds = event['eventData']['latency']
        if event['eventPrev']:
            obj.event_prev = event['eventPrev']
        return obj

    @classmethod
    def from_ping_load(cls, ping: PingPayload):
        return cls(bitrate_bits_per_second=ping['bitrate'],
                   networkType=ping['networkType'],
                   drm=ping['drm'],
                   has=ping['has'],
                   manufacturer=ping['manufacturer'],
                   live=ping['live'],
                   cdn=ping['cdn'],
                   provider=ping['provider'],
                   sessionid=ping['sessionId'],
                   timestamp=ping['timestamp'],
                   duration_of_playback_seconds=ping['durationOfPlayback'],
                   stall_duration_milliseconds=ping['stall']['duration'] if ping['stall'].get('duration') else 0,
                   platform=ping['deviceType'] if ping['platform'] == 'Android' and ping['deviceType'] in ['Firestick','AndroidSmartTv'] else ping['platform'],
                   framerate=ping['frameRate'],
                   frameloss=ping['frameLoss'],
                   throughput_bits_per_second=ping['throughput'],
                   udid=ping['udid'],
                   asset_duration_seconds=ping['assetDuration'],
                   deviceType=ping['deviceType'],
                   contentType=ping['contentType']
                   )


class PushBaseNotificationPayload(BaseModel):
    platform: str
    timestamp: int 
    deviceType: str