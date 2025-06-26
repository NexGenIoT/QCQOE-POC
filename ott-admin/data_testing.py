import logging
from opensearchpy import OpenSearch, RequestsHttpConnection, RequestError

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# OpenSearch client
OS_HOST = 'vpc-qoe-aggregation-aj6362v4gzvthgqb7wxiwjmuse.aos.ap-south-1.on.aws'
OS_PORT = '443'
OS_USER = 'qoe-user'
OS_PASSWORD = ''
client = OpenSearch(
    hosts=[{'host': OS_HOST, 'port': OS_PORT}],
    http_compress=True,  # enables gzip compression for request bodies
    http_auth=(OS_USER, OS_PASSWORD),
    use_ssl=True,
    verify_certs=True,
    ssl_assert_hostname=False,
    ssl_show_warn=False
)

# Sample data to be indexed
# data = {
#     'device_platform': 'Android',
#     'content_partner': 'epicOn',
#     'cdn': 'Na',
#     'm_average_bitrate': 30,
#     'm_play_attempts': 0,
#     'm_succesful_plays': 0,
#     'm_exit_before_video_starts': 0,
#     'm_video_start_failures': 0,
#     'm_video_playback_failures': 0,
#     'm_conncurrent_plays': 1,
#     'm_rebuffering_ratio': 0,
#     'm_total_minutes_watched': 60.0,
#     'm_unique_devices': 1,
#     'm_average_framerate': 30,
#     'm_bandwidth': 68,
#     'm_attempts': 0,
#     'm_ended_plays': 0,
#     'm_rebuffering_percentage': 0,
#     'm_ended_plays_per_unique_devices': 0,
#     'm_minutes_per_unique_devices': 60.0,
#     'm_unique_viewers': 1,
#     'm_average_percentage_completion': 44.44,
#     'm_user_attrition': 0,
#     'm_video_restart_time': 0,
#     'm_video_start_time': 0,
#     'm_rendering_quality': 1,
#     'dts': 'test',
#     'dts_es': '2024-05-17T20:15:16.000000+00:00',
#     'm_connection_induced_rebuffering_ratio': 0,
#     'location': 'unknown',
#     'batch_desc': '97f1712155170103d3b_1715976916_2024-05-17 20:15:16',
#     'm_total_payload_count': 1,
#     'content_type': 'Your Content Type'
# }

data={
   "device_platform":"Android",
   "content_partner":"epicOn",
   "cdn":"Na",
   "m_average_bitrate":30,
   "m_play_attempts":0,
   "m_succesful_plays":0,
   "m_exit_before_video_starts":0,
   "m_video_start_failures":0,
   "m_video_playback_failures":0,
   "m_conncurrent_plays":1,
   "m_rebuffering_ratio":0,
   "m_total_minutes_watched":60.0,
   "m_unique_devices":1,
   "m_average_framerate":30,
   "m_bandwidth":68,
   "m_attempts":0,
   "m_ended_plays":0,
   "m_rebuffering_percentage":0,
   "m_ended_plays_per_unique_devices":0,
   "m_minutes_per_unique_devices":60.0,
   "m_unique_viewers":1,
   "m_average_percentage_completion":44.44,
   "m_user_attrition":0,
   "m_video_restart_time":0,
   "m_video_start_time":0,
   "m_rendering_quality":1,
   "dts":"text",
   "dts_es":"2024-05-17T21:28:28.000000+00:00",
   "m_connection_induced_rebuffering_ratio":0,
   "location":"unknown",
   "batch_desc":"97f1712155170103d3b__1715981308__2024-05-17 21:28:28",
   "m_total_payload_count":1,
   "content_type":"Your Content Type"
}

# Index the document and log the request/response
try:
    response = client.index(index="qoe_metric_dev_2", body=data)
    print("Document indexed successfully:", response)
except RequestError as e:
    print(f"Error indexing document: {e.info}")
    logging.error(f"RequestError: {e.info}")