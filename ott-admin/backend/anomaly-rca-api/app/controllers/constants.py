from enum import Enum
allowed_approved_values_rca = [0,1]
cols_required_rca = ['rca_bucket', 'upper_threshold', 'total_records', 'batch_time', 'analysis_window_hrs', 'total_anomaly_records', 'problem_score', 'dimension','is_approved','rca_unique_id']
allowed_approved_values_anomaly = [0,1]
cols_required_anomaly = ['m_video_start_time', 'networktype', 'dts', 'm_rebuffering_ratio', 'device_id', 'anomaly_score', 'device_platform', 'videoid', 'live', 'anomaly_explanation', 'sessionid', 'manufacturer', 'location_city', 'm_bandwidth', 'content_partner', 'has', 'anomaly_id', 'drm', 'error_count', 'anomaly_type', 'is_approved','errorcode']
required_cols_ai_mitigation = ['bucket_name','plan_name','body','records']
cols_required_playback = ["anomaly_id","anomaly_explanation","anomaly_score","anomaly_type","content_partner","device_platform","dts","errorcode","error_count","is_approved","location_city","videoid","errorname"]
allowed_approved_values_playback = [0,1]
ai_insight_required_cols = ['type','agg_key','frequency','filters','agg_type','agg_col']

class LabelledTables(str, Enum):
    insession = 'qoe_anomaly_label_records'
    playback = 'qoe_anomaly_playback_label_records'
    erca = 'qoe_rca_label_records'


class AthenaFilterENUM(str, Enum):
    _eq = '='
    _neq = '<>'
    _gt = '>'
    _gte = '>='
    _lt = '<'
    _lte = '<='
    _in = 'IN'
    _nin = 'NOT IN'
    _range = 'BETWEEN'
    _like = 'LIKE'

class AIInsighTable(str, Enum):
    anomaly = "anomalyparquet"
    rca = "rca2"
    playback = "anomalyparquetplaybackfailure"