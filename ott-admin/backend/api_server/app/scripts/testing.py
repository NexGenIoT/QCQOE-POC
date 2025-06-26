from urllib import response
import pytest
import requests
import json 


@pytest.fixture
def base_url():
    return ["http://3.108.121.176","5001","5002","epoch_Start","epoch_end",["attempts","video_playback_failures"]]


def graph_api(base_url):
    url=base_url[0]+":"+base_url[1]+"/api/metric"+"?to_time="+base_url[3]+"&from_time="+base_url[4]
    body={}
    response=requests.post(url,body)
    data=json.loads(response.text)
    assert response.status_code==200

def threshold_api(base_url):
    url=base_url[0]+":"+base_url[1]+"/threshold"
    response=requests.post(url)
    data=json.loads(response.text)
    assert response.status_code==200
    for i in base_url[5]:
        assert i in data.keys()
        assert int(data[i]["lower"]) 
