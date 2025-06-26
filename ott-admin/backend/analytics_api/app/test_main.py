from fastapi.testclient import TestClient

from main import app

client = TestClient(app)


def test_check_status():
    response = client.get("/status")
    assert response.status_code == 200
    assert response.json() == {"msg": "ok"}


def test_valid_payload():
    valid_body = {
        "ping": {
            "aCodec": "mp4a.40.2",
            "assetDuration": 7759,
            "bitrate": 600,
            "cdn": "Na",
            "deviceType": "Mobile",
            "diffTime": 1587,
            "drm": "Widevine",
            "durationOfPlayback": 26,
            "frameRate": 25,
            "has": "DASH",
            "ip": "6e0b302b011192b1f9eaa6b79d1dd186",
            "live": "false",
            "location": "Chandigarh",
            "manufacturer": "HMD Global",
            "mitigationID": "",
            "model": "Nokia 8.1",
            "networkType": "Cellular",
            "platform": "Android",
            "playbackPosInSec": 31,
            "player": "ExoPlayer",
            "playerApp": "qoe qoe",
            "provider": "VootSelect",
            "resolution": "640*360",
            "sdkVersion": "1.0.0",
            "sessionId": "36c1644469926797b9c",
            "stall": {
                "count": 1,
                "duration": 3729
            },
            "switch": {
                "up": {
                    "1644469928": 600
                },
                "down": {
                    "1644469928": 64
                }
            },
            "throughput": 22,
            "timestamp": 1644469960,
            "totalDurationOfPlayback": 28,
            "totalStallDuration": 3729,
            "totalSwitchesDown": 1,
            "totalSwitchesUp": 1,
            "ua": "Device User Agent : Dalvik/2.1.0 (Linux; U; Android 10; Nokia 8.1 Build/QKQ1.190828.002)",
            "udid": "f3fd09ebefe40faf",
            "ueid": "32a3ae55fc03010fcfb83673351321ec",
            "vCodec": "avc1.4d401e",
            "version": "1.0.0",
            "videoId": "1105292"
        }
    }
    response = client.post("/api/analysis", json=valid_body)
    assert response.status_code == 200
    assert response.json() == {"msg": "ok"}


def test_invalid_payload():
    invalid_body = {
        "aCodec": "mp4a.40.2",
        "assetDuration": 7759,
        "bitrate": 600,
        "cdn": "Na",
        "deviceType": "Mobile",
        "diffTime": 1587,
        "drm": "Widevine",
        "durationOfPlayback": 26,
        "frameRate": 25,
        "has": "DASH",
        "ip": "6e0b302b011192b1f9eaa6b79d1dd186",
        "live": "false",
        "location": "Chandigarh",
        "manufacturer": "HMD Global",
        "mitigationID": "",
        "model": "Nokia 8.1",
        "networkType": "Cellular",
        "platform": "Android",
        "playbackPosInSec": 31,
        "player": "ExoPlayer",
        "playerApp": "qoe qoe",
        "provider": "VootSelect",
        "resolution": "640*360",
        "sdkVersion": "1.0.0",
        "sessionId": "36c1644469926797b9c",
        "stall": {
            "count": 1,
            "duration": 3729
        },
        "switch": {
            "up": {
                "1644469928": 600
            },
            "down": {
                "1644469928": 64
            }
        },
        "throughput": 22,
        "timestamp": 1644469960,
        "totalDurationOfPlayback": 28,
        "totalStallDuration": 3729,
        "totalSwitchesDown": 1,
        "totalSwitchesUp": 1,
        "ua": "Device User Agent : Dalvik/2.1.0 (Linux; U; Android 10; Nokia 8.1 Build/QKQ1.190828.002)",
        "udid": "f3fd09ebefe40faf",
        "ueid": "32a3ae55fc03010fcfb83673351321ec",
        "vCodec": "avc1.4d401e",
        "version": "1.0.0",
        "videoId": "1105292"
    }
    response = client.post("/api/analysis", json=invalid_body)
    assert response.status_code == 422
    assert response.json() == {'detail': 'Invalid payload'}
