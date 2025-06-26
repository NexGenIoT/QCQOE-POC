import os
import sys
import asyncio
import pytest
import json 
import pandas as pd

sys.path.append(os.getcwd())

from fastapi.testclient import TestClient
from unittest import mock

import app
from app import main
from test_mock.main_mock import boto3,wr,experience_insight_screen_dsl
from test_mock.redis_wrapper_mock import ElasticCacheUtility
from test_mock.utils.ics_utility_mock import validate_ueids
from test_mock.db_wrapper_mock import AwsDynamodb,AwsS3,AwsEvent,AwsLambda,SqliteDb,OpenSearchClient
from test_mock.mitigation_wrapper_mock import Mitigation
from test_mock.metrics_wrapper_mock import MetricsWrapper
from test_mock.utils.meta_data_for_frontend_mock import qoe_metrices,qoe_metrices_name,real_time_key_insights_metrices,real_time_key_insights_metrices_name,user_engagement_metrices,user_engagement_metrices_name,UEI_CONDITION,MITIGATION_STATUS
from test_mock.config_mock import REQUIRED_FILTERS
from test_mock.refurbishing_code_v2_mock import metric_graphs_dsm_es,metric_graphs_flink_es
from test_mock.dashboard_wrapper_mock import DashboardServiceWrapper
from experience_insight import set_provider_logo

# to resolve ValueError: set_wakeup_fd only works in main thread
if sys.platform == "win32" and (3, 8, 0) <= sys.version_info < (3, 9, 0):
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())


@pytest.fixture()
def client():
    from app.main import app

    with TestClient(app) as test_client:
        yield test_client

def test_invalid_url(client):
    response = client.get("/some_invalid_url")
    assert response.status_code == 404
    assert response.json() == {'detail': 'Not Found'}

def test_heart_check(client):
    response = client.post("/status")
    assert response.status_code == 200
    assert response.json() == {"Status": 200}

def test_api_thresholds(client, monkeypatch):
    mockc = {"Hello":"world"}
    monkeypatch.setattr(main,"threshold",mockc)
    response = client.post("/api/thresholds")
    assert response.status_code == 200
    assert str(response.text) == '{"Hello":"world"}'

def test_api_anomalies_missing_value_payload(client,monkeypatch):
    monkeypatch.setattr(main,"boto3",boto3)
    monkeypatch.setattr(main,"wr",wr)
    response = client.post("/api/anomalies")
    assert json.loads(response.text)["detail"][0]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][1]['type'] == 'value_error.missing'
    assert response.status_code == 422

def test_api_anomalies_invalid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"boto3",boto3)
    monkeypatch.setattr(main,"wr",wr)
    response = client.post("/api/anomalies?to_time=1653282749&from_time=16531963xx")
    assert json.loads(response.text)["detail"][0]['type'] == 'type_error.integer'
    assert response.status_code == 422

def test_api_anomalies_valid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"boto3",boto3)
    monkeypatch.setattr(main,"wr",wr)
    response = client.post("/api/anomalies?to_time=1653282749&from_time=1653196349")
    print(response.text)
    assert response.text == '"[]"'

def test_api_rca_missing_value_payload(client):
    response = client.post("/api/rca")
    assert json.loads(response.text)["detail"][0]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][1]['type'] == 'value_error.missing'
    assert response.status_code == 422

def test_api_rca_invalid_payload(client):
    response = client.post("/api/rca?to_time=1653282749&from_time=16531963xx")
    assert json.loads(response.text)["detail"][0]['type'] == 'type_error.integer'
    assert response.status_code == 422

def test_api_rca_valid_payload(client):
    response = client.post("/api/rca?to_time=1653282749&from_time=1653196349")
    assert response.status_code == 200

@pytest.mark.parametrize("body",[({"ueids": ["6120456793"]}),({"ueids": ["6120456794"]}),({"ueids": ["6120456795"]}),({"ueids": ["6120456796"]}),({})])
def test_api_validate_records_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    monkeypatch.setattr(main,"validate_ueids",validate_ueids)
    response = client.post("/api/validate_records",json=body)
    assert response.status_code == 200
    assert ('[{"data_response":"True"}]' in response.text) or (response.text == '[]')

@pytest.mark.parametrize("body",[({"ueids": [6120456796.123]}),(),({"ueids": [6120456796]})])
def test_api_validate_records_invalid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    monkeypatch.setattr(main,"validate_ueids",validate_ueids)
    response = client.post("/api/validate_records",json=body)
    assert response.status_code == 200
    assert response.text == '[]'

def test_mitigation_metrics_missing_value_payload(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"Mitigation",Mitigation)
    response = client.post("/mitigation/metrics")
    assert json.loads(response.text)["detail"][0]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][1]['type'] == 'value_error.missing'
    assert response.status_code == 422

def test_mitigation_metrics_invalid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"Mitigation",Mitigation)
    response = client.post("/mitigation/metrics?to_time=1653282749&from_time=16531963xx")
    assert json.loads(response.text)["detail"][0]['type'] == 'type_error.integer'
    assert response.status_code == 422

#data_response":"True" ---> Data Cached
#message":"Bad request, metric name.  ---> Invalid Metric name
#message":"Internal server error." ---> Exception due to Body parm not sent
@pytest.mark.parametrize("body",[({"metricname": "unknown_metric"})])
def test_mitigation_metrics_invalid_metric(client,monkeypatch,body):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"Mitigation",Mitigation)
    response = client.post("/mitigation/metrics?to_time=1653282749&from_time=1653196347",json=body)
    assert response.status_code == 200
    assert (response.text == '{"message":"Bad request, metric name."}') or ('[{"data_response":"True"}]' in response.text)

mitigation_metrics_metric1 = {
    "metricname": "average_startup_buffer_length",
    "device_platform":"dummy",
    "location":"dummy"
}

mitigation_metrics_metric2 = {
    "metricname": "average_rebuffering_buffer_length",
    "device_platform":"dummy",
    "location":"dummy"
}
mitigation_metrics_metric3 = {
    "metricname": "degradation_in_uei",
    "device_platform":"dummy",
    "location":"dummy"
}
mitigation_metrics_metric4 = {
    "metricname": "improvement_in_uei",
    "device_platform":"dummy",
    "location":"dummy"
}
mitigation_metrics_metric5 = {
    "metricname": "number_of_mitigations_applied",
    "device_platform":"dummy",
    "location":"dummy"
}

@pytest.mark.parametrize("body",[(mitigation_metrics_metric1),(mitigation_metrics_metric2),(mitigation_metrics_metric3),(mitigation_metrics_metric4),(mitigation_metrics_metric5)])
def test_mitigation_metrics_valid_metric(client,monkeypatch,body):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"Mitigation",Mitigation)
    response = client.post("/mitigation/metrics?to_time=1653282749&from_time=1653196347",json=body)
    assert response.status_code == 200
    assert ('data_response' in response.text and 'True' in response.text) or ('data_receieved' in response.text and 'True' in response.text)

@pytest.mark.parametrize("body",[({"metricname":"number_of_mitigations_applied"}),({"metricname":"improvement_in_uei"})])
def test_mitigation_metrics_incorrect_body(client,monkeypatch,body):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"Mitigation",Mitigation)
    response = client.post("/mitigation/metrics?to_time=1653282749&from_time=1653196347",json=body)
    assert response.status_code == 200
    assert (response.text == '{"message":"Internal server error."}') or ('[{"data_response":"True"}]' in response.text)

def test_api_mitigation_history1_valid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/mitigation_history1?to_time=1653282749&from_time=1653196349")
    assert response.status_code == 200
    assert response.text == '[]'


def test_api_mitigation_history1_missing_value_payload(client,monkeypatch):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/mitigation_history1")
    assert json.loads(response.text)["detail"][0]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][1]['type'] == 'value_error.missing'
    assert response.status_code == 422

def test_api_mitigation_history1_invalid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/mitigation_history1?to_time=1653282749&from_time=16531963xx")
    assert json.loads(response.text)["detail"][0]['type'] == 'type_error.integer'
    assert response.status_code == 422

@pytest.mark.parametrize("body",[({"group_mitigation_id": "5c707ce8-ede0-4cf0-9ffb-7fed8e934389"}),({})])
def test_api_mitigation_history2_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/mitigation_history2",json=body)
    assert response.status_code == 200
    assert response.text == '{"single_filter_data":"True"}'

#@pytest.mark.skip(reason="Error While empty payload")
@pytest.mark.parametrize("body",[()])
def test_api_mitigation_history2_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/mitigation_history2",json=body)
    assert response.status_code == 200
    assert response.text == '[]'

@pytest.mark.parametrize("body",[({"device_id": "7db14b87-15d1-41fd-80fd-6d8c65d05db0"}),({})])
def test_api_mitigation_history3_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/mitigation_history3",json=body)
    assert response.status_code == 200
    assert response.text == '{"single_filter_data":"True"}'

#@pytest.mark.skip(reason="Error While empty payload")
@pytest.mark.parametrize("body",[()])
def test_api_mitigation_history3_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/mitigation_history3",json=body)
    assert response.status_code == 200
    assert response.text == '[]'

def test_api_get_local_intelligence_status_valid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"AwsS3",AwsS3)
    response = client.get("/api/get_local_intelligence_status",)
    assert response.status_code == 200
    assert '{"switch":"off"}' in response.text 


@pytest.mark.parametrize("body",[({"switch":"off"}),(({"switch":"dummy_value"}))])
def test_api_enable_disable_local_intelligence_disable(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsS3",AwsS3)
    monkeypatch.setattr(main,"AwsEvent",AwsEvent)
    response = client.post("/api/enable_disable_local_intelligence",json=body)
    assert response.status_code == 200
    assert response.text == '{"Status":"disable_event"}'

@pytest.mark.parametrize("body",[({"switch":"on"})])
def test_api_enable_disable_local_intelligence_enable(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsS3",AwsS3)
    monkeypatch.setattr(main,"AwsEvent",AwsEvent)
    response = client.post("/api/enable_disable_local_intelligence",json=body)
    assert response.status_code == 200
    assert response.text == '{"status":"enable_event"}'

@pytest.mark.parametrize("body",[({}),(),({"Invalid_parm":"dummy_value"})])
def test_api_enable_disable_local_intelligence_exception(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsS3",AwsS3)
    monkeypatch.setattr(main,"AwsEvent",AwsEvent)
    response = client.post("/api/enable_disable_local_intelligence",json=body)
    assert response.status_code == 200
    assert response.text == '{"message":"Internal server error."}'

@pytest.mark.parametrize("body",[({"add_users":[{"device_id":"xyzq","group_name":"test1","rmn":""}]}),({"add_users":[]})])
def test_mitigation_create_user_group_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/mitigation/create_user_group",json=body)
    assert response.status_code == 200

@pytest.mark.skip(reason="Error Handling Required")
@pytest.mark.parametrize("body",[({"add_users":[{"group_name":"test1","rmn":""}]}),({}),()])
def test_mitigation_create_user_group_invalid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/mitigation/create_user_group",json=body)
    assert response.status_code == 500
    assert response.text == 'Internal Server Error'

@pytest.mark.parametrize("body",[({"group_name":"test1"})])
def test_mitigation_get_user_groups_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.get("/mitigation/get_users",json=body)
    assert response.status_code == 200
    assert response.text == '{"users":[{"group_name":{"S":"test1"}}]}' or response.text == '{"users":[]}'

@pytest.mark.skip(reason="Error Handling Required")
@pytest.mark.parametrize("body",[({"group_name":["test1","test2"]}),({}),()])
def test_mitigation_get_user_groups_invalid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.get("/mitigation/get_users",json=body)
    assert response.status_code == 500
    assert response.text == 'Internal Server Error'

def test_mitigation_list_user_groups_valid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/mitigation/list_user_groups")
    assert response.status_code == 200
    assert '{"user_groups":["test1"]}' in response.text

@pytest.mark.parametrize("body",[(["Average Bitrate","Conncurrent Plays"]),("dummy"),({}),()])
def test_api_favorite_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsS3",AwsS3)
    response = client.post("/api/favorite",json=body)
    assert response.status_code == 200

def test_api_get_favorite_valid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"AwsS3",AwsS3)
    response = client.get("/api/get_favorite")
    assert response.status_code == 200
    assert '["Average Bitrate"]' in response.text 

def test_api_apply_manual_mitigation_valid_payload(client,monkeypatch):
    body = {
        "DeviceID":["e7ffd7af0bce18d9"],
        "Source":"Manual",
        "SuggestiveStartupBufferDuration":2,
        "SuggestiveReBufferingDuration":4,
        "SuggestiveStartBitrate":3
        }
    monkeypatch.setattr(main,"AwsLambda",AwsLambda)
    response = client.post("/api/apply_manual_mitigation",json=body)
    assert response.status_code == 200
    assert '["lambda invoked"]' in response.text  

@pytest.mark.parametrize("body",[({"DeviceID":[]}),({})])
def test_api_apply_manual_mitigation_invalid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsLambda",AwsLambda)
    response = client.post("/api/apply_manual_mitigation",json=body)
    assert response.status_code == 200
    assert '{"Status_Code":200}' in response.text 

@pytest.mark.parametrize("body",[()])
def test_api_apply_manual_mitigation_no_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"AwsLambda",AwsLambda)
    response = client.post("/api/apply_manual_mitigation",json=body)
    assert response.status_code == 200
    assert response.text == '{}'

@pytest.mark.parametrize("body",[({"group_on": "content_partner","metric_type": "user_engagement_metrices"})])
def test_api_aggregated_data_for_24hrs_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"experience_insight_screen_dsl",experience_insight_screen_dsl)
    response = client.post("/api/aggregated_data_for_24hrs?to_time=1659957366&from_time=1659870966",json=body)
    assert response.status_code == 200
    assert '[{"data_response":"True"}]' in response.text  or '{"content_partner":"epicon"}' in response.text  

def test_api_aggregated_data_for_24hrs_missing_value_payload(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"experience_insight_screen_dsl",experience_insight_screen_dsl)
    response = client.post("/api/aggregated_data_for_24hrs")
    assert json.loads(response.text)["detail"][0]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][1]['type'] == 'value_error.missing'
    assert response.status_code == 422

def test_api_aggregated_data_for_24hrs_invalid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"experience_insight_screen_dsl",experience_insight_screen_dsl)
    response = client.post("/api/aggregated_data_for_24hrs?to_time=1653282749&from_time=16531963xx")
    assert json.loads(response.text)["detail"][0]['type'] == 'type_error.integer'
    assert response.status_code == 422

@pytest.mark.parametrize("body",[({"group_on": "content_partner"}),({}),()])
def test_api_aggregated_data_for_24hrs_invalid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"experience_insight_screen_dsl",experience_insight_screen_dsl)
    response = client.post("/api/aggregated_data_for_24hrs?to_time=1659957366&from_time=1659870966",json=body)
    assert response.status_code == 200
    assert response.text == '[]' or '[{"data_response":"True"}]' in response.text


def test_api_v2_percentage_change_missing_value_payload(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"DashboardServiceWrapper",DashboardServiceWrapper)
    response = client.post("/api/v2/percentage_change")
    assert json.loads(response.text)["detail"][0]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][1]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][2]['type'] == 'value_error.missing'
    assert response.status_code == 422

def test_api_v2_percentage_change_invalid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"DashboardServiceWrapper",DashboardServiceWrapper)
    response = client.post("/api/v2/percentage_change?to_time=1658824605&from_time_24hrs=1658738205&from_time_48hrs=16586518xx")
    assert json.loads(response.text)["detail"][0]['type'] == 'type_error.integer'
    assert response.status_code == 422

def test_api_v2_percentage_change_invalid_device_platform(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"DashboardServiceWrapper",DashboardServiceWrapper)
    body = {"metrices_name": "concurrent_plays","device_platform":"Invalid"}
    response = client.post("/api/v2/percentage_change?to_time=1663738424&from_time_24hrs=1663652024&from_time_48hrs=1663565624",json=body)
    assert response.status_code == 200
    assert 'Invalid device platform' in response.text

def test_api_v2_percentage_change_valid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"DashboardServiceWrapper",DashboardServiceWrapper)
    body = {"metrices_name": "concurrent_plays"}
    response = client.post("/api/v2/percentage_change?to_time=1663738424&from_time_24hrs=1663652024&from_time_48hrs=1663565624",json=body)
    assert response.status_code == 200
    assert 'data_response' in response.text and 'True' in response.text


def test_api_metrics_missing_value_payload(client,monkeypatch):
    monkeypatch.setattr(main,"metric_graphs_dsm_es",metric_graphs_dsm_es)
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"metric_graphs_flink_es",metric_graphs_flink_es)
    response = client.post("/api/metrics")
    assert json.loads(response.text)["detail"][0]['type'] == 'value_error.missing'
    assert json.loads(response.text)["detail"][1]['type'] == 'value_error.missing'
    assert response.status_code == 422

def test_api_metrics_invalid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"metric_graphs_dsm_es",metric_graphs_dsm_es)
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"metric_graphs_flink_es",metric_graphs_flink_es)
    response = client.post("/api/metrics?to_time=1658824605&from_time=16587382xx")
    assert json.loads(response.text)["detail"][0]['type'] == 'type_error.integer'
    assert response.status_code == 422

payload_ended_plays = {
    "aggregation_interval": "1h",
    "cdn": [],
    "content_partner": [],
    "content_type": [],
    "device_model": [],
    "device_platform": [],
    "location":[],
    "metricname": "ended_plays"
}

payload_concurrent_plays = {
    "aggregation_interval": "1h",
    "cdn": [],
    "content_partner": [],
    "content_type": [],
    "device_model": [],
    "device_platform": [],
    "location":[],
    "metricname": "ended_plays"
}

payload_attempts = {
    "aggregation_interval": "1h",
    "cdn": [],
    "content_partner": [],
    "content_type": [],
    "device_model": [],
    "device_platform": [],
    "location":[],
    "metricname": "ended_plays"
}

@pytest.mark.parametrize("body",[(payload_ended_plays),(payload_concurrent_plays),(payload_attempts)])
def test_api_metrics_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"metric_graphs_dsm_es",metric_graphs_dsm_es)
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"metric_graphs_flink_es",metric_graphs_flink_es)
    response = client.post("/api/metrics?to_time=1660036855&from_time=1658275200",json=body)
    assert response.status_code == 200
    assert '[{"data_response":"True"}]' in response.text or 'time_stamp' in response.text 

@pytest.mark.parametrize("body",[({"metricname": "invalid_metric"}),({"metricname": ""})])
def test_api_metrics_invalid_metric(client,monkeypatch,body):
    monkeypatch.setattr(main,"metric_graphs_dsm_es",metric_graphs_dsm_es)
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"metric_graphs_flink_es",metric_graphs_flink_es)
    response = client.post("/api/metrics?to_time=1660036855&from_time=1658275200",json=body)
    assert response.status_code == 200
    assert '[{"data_response":"True"}]' in response.text or 'Bad request' in response.text 

payload_ended_plays = {
    "aggregation_interval": "1h",
    "cdn": [],
    "content_partner": [],
    "content_type": [],
    "device_model": [],
    "device_platform": [],
    "metricname": "ended_plays"
}

@pytest.mark.parametrize("body",[(payload_ended_plays),(),({})])
def test_api_metrics_missing_values_in_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"metric_graphs_dsm_es",metric_graphs_dsm_es)
    monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
    monkeypatch.setattr(main,"metric_graphs_flink_es",metric_graphs_flink_es)
    response = client.post("/api/metrics?to_time=1660036855&from_time=1658275200",json=body)
    assert response.status_code == 200
    assert '{}' in response.text or '[{"data_response":"True"}]' in response.text

def test_old_sync_dynamodb_valid_payload(client,monkeypatch):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/old_sync_dynamodb")
    assert response.status_code == 200

def test_sync_dynamodb(client,monkeypatch):
    monkeypatch.setattr(main,"AwsDynamodb",AwsDynamodb)
    response = client.post("/api/sync_dynamodb")
    assert response.status_code == 200

@pytest.mark.skip(reason="Need to Correct 500")
@pytest.mark.parametrize("body",[({"device_ids":{ "5a1c3d8d564bc72ee3159ac26a42fc35": "9A1F68C9-C431-49FD-9298-6DD6546F9819" }
}),({}),()])
def test_get_startup_buffer_valid_payload(client,monkeypatch,body):
    monkeypatch.setattr(main,"MetricsWrapper",MetricsWrapper)
    response = client.post("/api/get_startup_buffer",json=body)
    assert response.status_code == 200

# #@pytest.mark.skip(reason="Need to Correct 500")
# def test_unique_filters(client,monkeypatch):
#     monkeypatch.setattr(main,"ElasticCacheUtility",ElasticCacheUtility)
#     monkeypatch.setattr(main,"qoe_metrices",qoe_metrices)
#     monkeypatch.setattr(main,"qoe_metrices_name",qoe_metrices_name)
#     monkeypatch.setattr(main,"real_time_key_insights_metrices",real_time_key_insights_metrices)
#     monkeypatch.setattr(main,"real_time_key_insights_metrices_name",real_time_key_insights_metrices_name)
#     monkeypatch.setattr(main,"user_engagement_metrices",user_engagement_metrices)
#     monkeypatch.setattr(main,"user_engagement_metrices_name",user_engagement_metrices_name)
#     monkeypatch.setattr(main,"UEI_CONDITION",UEI_CONDITION)
#     monkeypatch.setattr(main,"MITIGATION_STATUS",MITIGATION_STATUS)
#     monkeypatch.setattr(main,"REQUIRED_FILTERS",REQUIRED_FILTERS)
#     response = client.post("/api/unique_filters")
#     assert response.status_code == 200
#     assert '[{"data_response":"True"}]' in response.text or '[]' in response.text

def test_set_provider_logo():
    data = {'content_partner': 'DocuBay'}
    resp = set_provider_logo(data)
    assert "content_partner_logo" in resp.keys()

def test_set_provider_logo_without_body():
    data = {}
    resp = set_provider_logo(data)
    assert "content_partner_logo" in resp.keys()