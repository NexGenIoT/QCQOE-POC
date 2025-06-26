from enum import Enum


class Fields(Enum):
    raw_columns = {
        "aCodec": "LIST", "assetDuration": "SUM", "bitrate": "AVG", "cdn": "LIST", "drm": "LIST", "has": "LIST",
        "live": "LIST", "manufacturer": "LIST", "mitigationID": "LIST", "model": "LIST", "networkType": "LIST",
        "playbackPosInSec": "SUM", "player": "LIST", "playerApp": "LIST", "provider": "LIST", "resolution": "LIST",
        "sdkVersion": "LIST", "throughput": "AVG", "ua": "LIST", "vCodec": "LIST", "version": "LIST", "videoId": "LIST",
        "frameRate": "AVG", "contentType": "LIST", "subscriberId": "LIST", "clientIP": "LIST", "sblLevel": "AVG",
        "rblLevel": "AVG", "diffTime": "SUM", "durationOfPlayback": "SUM", "stall_duration": "SUM",
        "stall_count": "SUM",
        "totalDurationOfPlayback": "SUM", "totalStallDuration": "SUM", "totalSwitchesUp": "SUM",
        "totalSwitchesDown": "SUM", "sbl": "AVG", "rbl": "AVG", "frameLoss": "SUM", "ping_count": "COUNT"}

    calculative_cols = [
        "throughput_before_Mbps", "uei_before", "bitrate_before_Mbps", "throughput_after_Mbps",
        "uei_after", "bitrate_after_Mbps", "mitigation_time_difference", "stall_diff", "stall_increase_in_per",
        "throughput_diff", "throughput_diff_Mbps", "bitrate_diff", "bitrate_diff_Mbps", "uei_diff"]

    dynamo_cols = [
        "ueid", "device_id", "location", "mitigation_status", "source", "platform",
        "group_mitigation_id", "local_mitigation_id", "mitigationgenerationtime",
        "mitigationgenerationsessionid", "mitigationfixedtime", "mitigationfixedsessionid"]

    report_cols = [
        "ueid", "device_id", "location", "platform", "group_mitigation_id", "local_mitigation_id",
        "source", "subscriberId_before", "mitigationgenerationtime", "mitigationgenerationsessionid",
        "mitigationfixedtime",
        "mitigationfixedsessionid", "throughput_before_Mbps", "bitrate_before_Mbps", "networkType_before",
        "provider_before", "resolution_before", "stall_count_before", "sbl_before", "rbl_before", "uei_before",
        "videoId_before", "ping_count_before", "throughput_after_Mbps", "bitrate_after_Mbps", "networkType_after",
        "provider_after", "resolution_after", "stall_count_after", "sbl_after", "rbl_after", "uei_after",
        "videoId_after",
        "ping_count_after", "mitigation_time_difference", "stall_diff", "stall_increase_in_per",
        "throughput_diff", "throughput_diff_Mbps", "bitrate_diff", "bitrate_diff_Mbps", "uei_diff"]

    report_standard_cols = [
        "ueid", "device_id", "location", "platform", "group_mitigation_id", "local_mitigation_id",
        "source", "subscriberId", "mitigationgenerationtime", "mitigationgenerationsessionid", "mitigationfixedtime",
        "mitigationfixedsessionid"]

    report_before_cols = [
        "throughput_before_Mbps", "bitrate_before_Mbps", "networkType_before",
        "provider_before", "resolution_before", "stall_count_before", "sbl_before", "rbl_before", "uei_before",
        "videoId_before", "ping_count_before"]

    report_after_cols = [
        "throughput_after_Mbps", "bitrate_after_Mbps", "networkType_after",
        "provider_after", "resolution_after", "stall_count_after", "sbl_after", "rbl_after", "uei_after",
        "videoId_after",
        "ping_count_after"]

    report_calculative_cols = [
        "mitigation_time_difference", "stall_diff", "stall_increase_in_per",
        "throughput_diff", "throughput_diff_Mbps", "bitrate_diff", "bitrate_diff_Mbps", "uei_diff"]