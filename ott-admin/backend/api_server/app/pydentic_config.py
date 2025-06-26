from enum import Enum


class AggregationType(Enum):
    m_attempts = "sum"
    m_average_bitrate = "avg"
    m_average_framerate = "avg"
    m_average_percentage_completion = "avg"
    m_bandwidth = "avg"
    m_concurrent_plays = "max"
    m_ended_plays = "value_count"
    m_ended_plays_per_unique_devices = "terms"
    m_exit_before_video_starts = "sum"
    m_minutes_per_unique_devices = "avg"
    m_play_attempts = "sum"
    m_rebuffering_percentage = "avg"
    m_rebuffering_ratio = "avg"
    m_succesful_plays = "sum"
    m_total_minutes_watched = "sum"
    m_unique_devices = "cardinality"
    m_unique_viewers = "cardinality"
    m_user_attrition = "sum"
    m_video_playback_failures = "sum"
    m_video_start_failures = "sum"
    m_video_start_time = "avg"
    m_video_restart_time = "avg"
    m_rendering_quality = "avg"
    m_connection_induced_rebuffering_ratio = "avg"


class Units(Enum):
    m_video_start_time = "ms"
    m_video_restart_time = "ms"
    m_rendering_quality = ""
    m_attempts = ""
    m_average_bitrate = "kbps"
    m_average_framerate = "fps"
    m_average_percentage_completion = "%"
    m_bandwidth = "mbps"
    m_concurrent_plays = ""
    m_ended_plays = ""
    m_ended_plays_per_unique_devices = ""
    m_exit_before_video_starts = ""
    m_minutes_per_unique_devices = "mins"
    m_play_attempts = ""
    m_rebuffering_percentage = "%"
    m_rebuffering_ratio = ""
    m_succesful_plays = ""
    m_total_minutes_watched = "mins"
    m_unique_devices = ""
    m_unique_viewers = ""
    m_user_attrition = ""
    m_video_playback_failures = ""
    m_video_start_failures = ""
    m_connection_induced_rebuffering_ratio = ""


class MetricesName(Enum):
    metrices_from_flink_es = ['m_attempts', 'm_average_bitrate', 'm_average_framerate',
                              'm_average_percentage_completion', 'm_bandwidth', 'm_exit_before_video_starts',
                              'm_minutes_per_unique_devices', 'm_rebuffering_percentage', 'm_rebuffering_ratio',
                              'm_succesful_plays', 'm_total_minutes_watched', 'm_user_attrition',
                              'm_video_playback_failures', 'm_video_start_failures', 'm_video_start_time',
                              'm_video_restart_time', 'm_rendering_quality', 'm_concurrent_plays',
                              'm_connection_induced_rebuffering_ratio']
    metrices_from_dsm_es = ["m_unique_devices", "m_unique_viewers", "m_ended_plays", "m_ended_plays_per_unique_devices"]
    real_time_key_insights_metrices_flink = ["m_average_bitrate", "m_play_attempts", "m_concurrent_plays",
                                             "m_exit_before_video_starts", "m_rebuffering_percentage",
                                             "m_succesful_plays", "m_video_playback_failures", "m_video_start_failures",
                                             "m_connection_induced_rebuffering_ratio"]
    # real_time_key_insights_metrices_dsm=[]
    user_engagement_metrices_flink = ["m_average_percentage_completion", "m_concurrent_plays", "m_average_bitrate",
                                      "m_minutes_per_unique_devices", "m_play_attempts", "m_succesful_plays",
                                      "m_video_playback_failures"]
    user_engagement_metrices_dsm = ["m_unique_devices", "m_unique_viewers"]
    qoe_metrices_flink = ["m_average_framerate", "m_bandwidth", "m_play_attempts", "m_rebuffering_ratio",
                          "m_user_attrition",
                          "m_video_playback_failures", "m_video_start_time", "m_video_restart_time",
                          "m_rendering_quality"]
    qoe_metrices_dsm = ["m_ended_plays", "m_ended_plays_per_unique_devices"]
    metric_mapping = {"user_engagement_metrices": [user_engagement_metrices_flink, user_engagement_metrices_dsm],
                      "real_time_key_insights": [real_time_key_insights_metrices_flink],
                      "quality_of_experience": [qoe_metrices_flink, qoe_metrices_dsm]}




class ContentPartners:
    hotstar = "hotstar"
    prime_video = "prime_video"
    docubay = "docubay"
    voot_select = "voot_select"
    voot_kids = "voot_kids"
    eros_now = "eros_now"
    zee5 = "zee5"
    epic_on = "epic_on"
    sonyliv = "sonyliv"
    shemaroo_me = "shemaroo_me"
    hungama_play = "hungama_play"
    curiosity_stream = "curiosity_stream"
    sun_nxt = "sun_nxt"


class DeeplinkedPartners(Enum):
    hotstar = "hotstar"
    prime_video = "primevideo"
    zee5 = "zee5"
    sonyliv = "sonyliv"
    sun_nxt = "sunnxt"

Deeplinked_Partners = [partnername.value for partnername in DeeplinkedPartners]

class ProviderEnum(Enum):
    curiosity = "Curiosity"
    chaupal = "Chaupal"
    docu_bay = "DocuBay"
    epic_on = "EpicOn"
    eros_now = "ErosNow"
    hoichoi = "Hoichoi"
    hungama = "Hungama"
    mamma_flix = "NammaFlix"
    planet_marathi = "PlanetMarathi"
    shemaroo_me = "ShemarooMe"
    sun_nxt = "SunNxt"
    voot_kids = "VootKids"
    voot_select = "VootSelect"
    sony_liv = "SonyLiv"
    prime = "Prime"
    zee5 = "Zee5"


class ContentTypeEnum(Enum):
    movies = "MOVIES"
    tv_shows = "TV_SHOWS"

    # const val TYPE_MOVIES = "MOVIES"
    # const val TYPE_WEB_SHORTS = "WEB_SHORTS"//WEB_SHORTS
    # const val TYPE_TV_SHOWS = "TV_SHOWS"
    # const val TYPE_BRAND = "BRAND"
    # const val TYPE_CATCH_UP = "CATCH_UP"
    # const val TYPE_SERIES = "SERIES"
    # const val TYPE_SERIES_CHILD = "SERIES_CHILD_LOCAL"
    # const val TYPE_BRAND_CHILD = "BRAND_CHILD_LOCAL"
    # const val TYPE_CUSTOM_WEB_VIEW = "CUSTOM_WEB_VIEW"
    # const val TYPE_LIVE = "LIVE"
    # const val TYPE_LIVE_EVENT = "LIVE_EVENT"
    # const val TYPE_CUSTOM_PRIME = "CUSTOM_PRIME"
    # const val TYPE_SUB_PAGE = "SUB_PAGE"


class ErrorCodes(Enum):
    AVAuthorization = 401
    TYPE_SOURCE = 402
    SOURCE_COULD_NOT_LOAD_MANIFEST = 403
    Invalid_content = 404
    VIDEO_UNAVAILABLE = -1
