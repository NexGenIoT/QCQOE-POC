import asyncio
from boto3.dynamodb.conditions import Attr
#from config import settings, logger
from flask import Flask, jsonify, request as req
from flask_cors import CORS, cross_origin
import json
import time
from mitigationDashboardAPI import *
from config import REQUIRED_FILTERS
from dashboard_wrapper import DashboardServiceWrapper
from db_wrapper import  AwsS3, AwsEvent, AwsDynamodb, AwsLambda, JaydebeApi, OpenSearchClient, SqliteDb
from experience_insight import experience_insight_screen_dsl
from mitigation_wrapper import Mitigation
from pydentic_config import MetricesName, ProviderEnum, ContentTypeEnum
from utils.ics_datetime import get_datetime_in_format
from refurbishing_code_v2 import metric_graphs_dsm_es, metric_graphs_flink_es
from utils.meta_data_for_frontend import real_time_key_insights_metrices_name, qoe_metrices, qoe_metrices_name, \
    user_engagement_metrices, user_engagement_metrices_name, MITIGATION_STATUS, UEI_CONDITION, threshold, real_time_key_insights_metrices
from utils.ics_utility import validate_ueids
from datetime import timedelta
import jaydebeapi
import pandas as pd


# Todo: rename this to main.py and update in the wsgi.py as well, update the dockerfile cmd as well
# Todo: reduce this file size byu  moving the functionality to other module and use this only for api endpoint routing
app = Flask(__name__)
cors = CORS(app)
# app.config['CORS_HEADERS'] = 'Content-Type'


def get_startup_buffer(resp):
    #logger.info(str(req.get_json))
    conn = jaydebeapi.connect("org.opensearch.jdbc.Driver",
                          "jdbc:opensearch://https://vpc-qoe-opensearch-vpbzmm44ds5kulnit2h3degj44.ap-south-1.es.amazonaws.com",
                           ["root", "dell#Hp$20"],
                           "./opensearch-sql-jdbc-1.1.0.1.jar")
    try:
        
        #jaydebeapi_obj = JaydebeApi()
        #cursor = jaydebeapi_obj.client.cursor()
        cursor = conn.cursor()
        mapping = resp
        mapping = mapping["device_ids"]
        list_of_udid = list(mapping.values())
        current_session_id = list(mapping.keys())
        sql_query = "SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE device_id in " + str(
            tuple(list_of_udid)) + " GROUP BY device_id"

        cursor.execute(sql_query)
        results_all_time = pd.DataFrame(cursor.fetchall())
        results_all_time.columns = ["device_id", "startup_buffer_duration_all_time"]
        try:
            sql_query = "SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE device_id in " + str(
                tuple(list_of_udid)) + " and last_report_time<=\"" + datetime.today().strftime(
                "%Y-%m-%d"'T'"%H:%M:%S") + "\" and last_report_time>\"" + datetime.today().replace(hour=0, minute=0,
                                                                                                   second=0).strftime(
                "%Y-%m-%d"'T'"%H:%M:%S") + "\" GROUP BY device_id"
            cursor.execute(sql_query)
            print(cursor.fetchall())
            results_24hrs = pd.DataFrame(cursor.fetchall())
            results_24hrs.columns = ["device_id", "startup_buffer_duration_today"]
            print(results_24hrs)
            final = results_all_time.merge(results_24hrs, left_on="device_id", right_on="device_id")
        except:
            results_24hrs = pd.DataFrame(list_of_udid)
            results_24hrs.columns = ["device_id"]
            results_24hrs["startup_buffer_duration_today"] = [1 for i in results_24hrs["device_id"].values]
            final = results_all_time.merge(results_24hrs, left_on="device_id", right_on="device_id")
        sql_query = "SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE current_session_id in " + str(
            tuple(current_session_id)) + " GROUP BY current_session_id"
        cursor.execute(sql_query)
        results_last_session = pd.DataFrame(cursor.fetchall())
        results_last_session.columns = ["current_session_id", "startup_buffer_last_session"]
        results_last_session["device_id"] = [str(mapping[i]) for i in results_last_session["current_session_id"].values]
        results_last_session.drop("current_session_id", inplace=True, axis=1)

        final = final.merge(results_last_session, left_on="device_id", right_on="device_id")
        return final.to_json(orient="records")
    except:
        return {}

if __name__=="__main__":
    resp={"device_ids": {"5a1c3d8d564bc72ee3159ac26a42fc35": "9A1F68C9-C431-49FD-9298-6DD6546F9819", "834a13aed73d8ab4b8abde6ed6f50b61": "C7A2112D-5E8D-4D59-9E95-09F78C856059", "cae7795eff2845f9f4f51a4ec477d13e": "9050818D-E6B8-4B6D-9202-DB0EEFDFD8B4", "2a026125148df5048f2bb8f197472895": "9BD322D3-9997-460D-BA33-3267C382EF60", "2f01f3030c26904fb3c81c880d7d9b25": "FBE5D387-7B44-4717-846E-303B86DD114C", "1f3c08b3374c843f243d5a4f53162856": "FF95C87A-650E-4559-9929-1F2AF7BA629C", "d44dd94a130c47844f8e3697d6b86347": "B8A6282C-EC39-4F54-9819-856C64E4DE0E", "5e464c3be1449cb8d0b23a4f288372e9": "F415F783-6BA1-493A-BED7-77226722C1E5", "85c24f7b7f64e39b05c831ade58d2388": "A6A100A1-5886-4BA6-8E44-3BF782CDB7E3", "6a1b68b57c987e1ed01b5d0e320ee1b5": "EC4B24EE-DAFE-42D3-A43C-D3E5FABE84B0", "ce1992e066a32e60cf087114be555e53": "A59FBBF6-CC6B-4079-BF69-298FAD652AB2", "40e374d9992dc76f568a4e45c365ec73": "77D318BC-3EAC-4CD0-9D9C-3592F02FE7DD", "f282493885b6a83ea4d0b6e89a7888f9": "6FE76AE6-4C8B-4633-9EB6-AA0BD2BE50B2", "4ad400a16247f1f25c1fb1ef02e85566": "355BB3FB-77DF-4D46-8B04-CDA99B4970B7", "9bb1805d197bb4052f71f1dc3cc22c49": "D2A7CC38-DB9F-4683-A129-D27A56C869D7", "d8ebc16e2237bb3b9c86136af27e1667": "D4BDDB47-2925-46AF-86EE-B3A0E82FEF9A", "296e4e88f8a241d89982278045604dfe": "6D75A037-8B26-4192-B063-CFDE8D65A649", "b3b152ff4338180fb62fd75d460bc84b": "1136C66B-2874-4A69-BF0A-77980A4B2FDA", "783b6221d2901f25d6e7df269c6bae53": "C5C5DE6A-57F7-4F4B-B1F8-F6357FE2E5D0", "32f1edda72bff27e72f5bd298586e3dd": "8528C37A-7464-409F-9125-BFACF35402DD", "10016b28de3c9e7e2aa83daa6f5a576b": "3A683210-147E-403B-8FA8-A3C12CC63FBB", "65673d546137360b16e5e7ff12715cd9": "48B97B3D-FD3F-4276-A845-D4DB7A33F8E9", "c02aac384c3fd721d3c94e82f9ccc041": "CAFC64A8-C3FF-4A7E-A152-99F7F96B69E8", "24234234242343234": "9451B4C2-2B6E-484E-B49D-225DACBFC570", "daf481f6ed308f35d003342e91e9b9ea": "E43D5B46-EA7D-4983-8739-CA1FCA7EB05A", "2ca5f84d3bfb981f9529e2ee45d7ea7a": "31E9C757-7044-4CD1-A649-66E8755FAFD7", "80435ec2b5b2fb59ea4d96eb446d2c7b": "98BD39B6-B67C-46B2-A771-FA7C3B667DEB", "5201bf60f718a36d506a07872e3d5cc9": "DEAB7917-6824-40BB-B298-402A25530601"}}
    get_startup_buffer(resp)