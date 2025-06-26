import os
import tarfile
from urllib import request


def download_mmdb_file(url: str, dest_path: str):
    request.urlretrieve(url, dest_path)


def extract_mmdb_file(tarball_path: str, dest_dir: str):
    with tarfile.open(tarball_path) as fp:
        for filename in fp.getnames():
            if filename.endswith('.mmdb'):
                fp.extract(filename, dest_dir)
                return os.path.join(dest_dir, filename)

def get_platform_and_device_type(payload):
    if payload.event:
        platform = payload.event.platform
        device_type = payload.event.deviceType
    elif payload.ping:
        res = payload.ping
        if type(res) is not dict:
            res = res.dict()
        platform = res.get("platform", "")
        device_type = res.get("deviceType", "")
    else:
        platform = ""
        device_type = ""
    return platform, device_type


def getMitigationFonfig(platform, device_type):
    from config import mitigation_probe_config_data
    data = mitigation_probe_config_data
    response = dict()
    if platform == "Android" and device_type == "Mobile":
        response["disable_qoe_beacons"] = False if data.get("android_probe", "OFF") == "ON" else True
        response["disable_mitigation_poll"] = False if data.get("android_mitigation", "OFF") == "ON" else True
    elif platform == "iOS":
        response["disable_qoe_beacons"] = False if data.get("ios_probe", "OFF") == "ON" else True
        response["disable_mitigation_poll"] = False if data.get("ios_mitigation", "OFF") == "ON" else True
    elif platform == "Web":
        response["disable_qoe_beacons"] = False if data.get("web_probe", "OFF") == "ON" else True
        response["disable_mitigation_poll"] = False if data.get("web_mitigation", "OFF") == "ON" else True
    elif platform == "Android" and device_type == "FireTV":
        response["disable_qoe_beacons"] = False if data.get("firetv_probe", "OFF") == "ON" else True
        response["disable_mitigation_poll"] = False if data.get("firetv_mitigation", "OFF") == "ON" else True
    elif platform == "Android" and  device_type == "Firestick":
        response["disable_qoe_beacons"] = False if data.get("firetv_probe", "OFF") == "ON" else True
        response["disable_mitigation_poll"] = False if data.get("firetv_mitigation", "OFF") == "ON" else True
    else:
        response["disable_qoe_beacons"] = True
        response["disable_mitigation_poll"] = True
    return response