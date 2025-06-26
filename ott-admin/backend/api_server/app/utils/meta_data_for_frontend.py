aggregation_type = {
  "attempts": "sum",
  "average_bitrate": "avg",
  "average_framerate": "avg",
  "average_percentage_completion": "avg",
  "bandwidth": "avg",
  "concurrent_plays": "max",
  "ended_plays": "sum",
  "ended_plays_per_unique_devices": "max",
  "exit_before_video_starts": "sum",
  "minutes_per_unique_devices": "avg",
  "play_attempts": "sum",
  "rebuffering_percentage": "avg",
  "rebuffering_ratio": "avg",
  "succesful_plays": "sum",
  "total_minutes_watched": "sum",
  "unique_devices": "max",
  "unique_viewers": "max",
  "user_attrition": "sum",
  "video_playback_failures": "sum",
  "video_start_failures": "sum",
  "video_start_time": "avg",
  "video_restart_time": "avg",
  "rendering_quality": "avg"
}


units={'attempts':"",
'average_bitrate':"kbps",
'average_framerate':"fps"
, 'average_percentage_completion':"%"
  ,'bandwidth':"mbps"
  ,'concurrent_plays':"",
  'ended_plays':"",
  'ended_plays_per_unique_devices':"",
   'exit_before_video_starts':""
   , 'minutes_per_unique_devices':"mins"
   , 'play_attempts':""
   , 'rebuffering_percentage':"%"
   , 'rebuffering_ratio':"",
   'succesful_plays':""
   , 'total_minutes_watched':"mins"
   , 'unique_devices':"k",
   'unique_viewers':"k"
   , 'user_attrition':""
   , 'video_playback_failures':"",
   'video_start_failures':"",
   "video_start_time":"",
   "video_restart_time":"",
   "rendering_quality":""}


real_time_key_insights_metrices=["average_bitrate","attempts","concurrent_plays","exit_before_video_starts","rebuffering_percentage","succesful_plays","video_playback_failures","video_start_failures", "connection_induced_rebuffering_ratio"]
user_engagement_metrices=["total_minutes_watched", "average_percentage_completion","concurrent_plays","average_bitrate","minutes_per_unique_devices","attempts","succesful_plays","unique_devices","unique_viewers","video_playback_failures"]
qoe_metrices=["average_framerate","bandwidth","attempts","ended_plays","ended_plays_per_unique_devices","rebuffering_ratio","user_attrition","video_playback_failures","video_start_time","video_restart_time","rendering_quality"]
real_time_key_insights_metrices_name=["Average Bitrate","Play Attempts","Max Concurrent Plays","Exit Before Video Starts","Rebuffering Percentage","Successful Plays","Video Playback Failures","Video start Failures", "Connection Induced Rebuffering Ratio"]
user_engagement_metrices_name=["Total Minutes Watched","Average Percentage Completion","Max Concurrent Plays","Average Bitrate","Minutes Per Unique Devices","Play Attempts","Successful Plays","Unique Devices","Unique Viewers","Video Playback Failures"]
qoe_metrices_name=["Average Framerate","Bandwidth","Play Attempts","Ended Plays","Ended Plays Per Unique Devices","Rebuffering Ratio","User Attrition","Video Playback Failures","Average Video Start Time","Average Video Restart Time","Average Rendering Quality"]

threshold={"m_attempts": {"upper":50000,"lower":-1},
"m_average_bitrate": {"upper":6000,"lower":-1},
"m_average_framerate": {"upper":60,"lower":-1},
"m_average_percentage_completion":{"upper":100,"lower":-1},
"m_bandwidth": {"upper":51194621,"lower":-1},
"m_concurrent_plays": {"upper":10000,"lower":-1},
"m_ended_plays": {"upper":10000,"lower":-1},
"m_ended_plays_per_unique_devices": {"upper":10000,"lower":-1},
"m_exit_before_video_starts": {"upper":18,"lower":-1},
"m_minutes_per_unique_devices": {"upper":3000,"lower":-1},
"m_play_attempts": {"upper":10000,"lower":-1},
"m_rebuffering_percentage": {"upper":50,"lower":-1},
"m_rebuffering_ratio": {"upper":0.5,"lower":-1},
"m_succesful_plays": {"upper":100000,"lower":-1},
"m_total_minutes_watched": {"upper":100000,"lower":-1},
"m_unique_devices": {"upper":100000,"lower":-1},
"m_unique_viewers": {"upper":100000,"lower":-1},
"m_user_attrition": {"upper":100000,"lower":-1},
"m_video_playback_failures": {"upper":2,"lower":-1},
"m_video_start_failures": {"upper":0,"lower":-1},
"m_video_start_time": {"upper":0,"lower":-1},
"m_video_restart_time": {"upper":0,"lower":-1},
"m_rendering_quality": {"upper":0,"lower":-1}
}

MITIGATION_STATUS = ["PENDING", "MISSED", "DISPATCHED", "FIXED"]

UEI_CONDITION = [">=", "<=", "<", ">", "="]