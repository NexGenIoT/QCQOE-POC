import datetime
import json
import subprocess

# Get the current timestamp
current_timestamp = int(datetime.datetime.now().timestamp())

# Load the JSON data
json_data = {
    "ping": {
        "aCodec": "mp4a.40.2",
        "assetDuration": 135,
        "bitrate": 245778,
        "cdn": "Na",
        "clientIP": "103.198.173.169",
        "contentType": "Your Content Type",
        "deviceType": "Mobile",
        "diffTime": 0,
        "drm": "Wide",
        "durationOfPlayback": 60,
        "frameLoss": 0,
        "frameRate": 30,
        "has": "DASH",
        "live": "false",
        "location": "",
        "manufacturer": "Google",
        "mitigationID": "",
        "model": "Sdk_gphone64_arm64",
        "networkType": "Cellular",
        "platform": "Android",
        "playbackPosInSec": 60,
        "player": "ExoPlayer",
        "playerApp": "QOE",
        "playerVersion": "2.11.8",
        "provider": "epicOn",
        "rbl": 5,
        "rblLevel": 0,
        "resolution": "426x240",
        "sbl": 2,
        "sblLevel": 0,
        "sdkVersion": "1.0.0",
        "sessionId": "97f1712155170103d3b",
        "stall": {},
        "subscriberId": "subscriberID",
        "switch": {
            "up": {
                "1712155171": 245778,
                "1712155191": 2351398
            },
            "down": {
                "1712155171": 130333
            }
        },
        "throughput": 68422856,
        "timestamp": current_timestamp,  # Replace timestamp with current time
        "totalDurationOfPlayback": 60,
        "totalStallDuration": 1322,
        "totalSwitchesDown": 1,
        "totalSwitchesUp": 2,
        "ua": "Device User Agent : Dalvik\/2.1.0 (Linux; U; Android 14; sdk_gphone64_arm64 Build\/UE1A.230829.036.A1)",
        "udid": "5253496d1590cdhgfdtghghgfjexx6",
        "ueid": "d41d8cd98f00b204e9800998ecf8427e",
        "vCodec": "avc1.4d4015",
        "version": "1.0.0",
        "videoId": "1028123",
        "videoTitle": "Your Video Title"
    }
}

# Convert JSON data to string
json_string = json.dumps(json_data)
print(json_string)

# Execute the cURL command with subprocess
curl_command = [
    'curl', '--location', 'http://0.0.0.0:8002/api/analysis',
    '--header', 'Content-Type: application/json',
    '--data', json_string
]

# Execute the cURL command
subprocess.run(curl_command)