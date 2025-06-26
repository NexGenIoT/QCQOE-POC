import jaydebeapi
import time
import pandas as pd
from datetime import datetime, timedelta
conn = jaydebeapi.connect("org.opensearch.jdbc.Driver",
                          "jdbc:opensearch://https://vpc-qoe-opensearch-vpbzmm44ds5kulnit2h3degj44.ap-south-1.es.amazonaws.com",
                           ["root", "dell#Hp$20"],
                           "./opensearch-sql-jdbc-1.1.0.1.jar")
# jaydebeapi.connect()
cursor = conn.cursor()
# cursor.execute("Select  cdn from qoe_metric_dev group by cdn LIMIT 10000")
# select avg(start_up_buffer) from qoe_dev_state_6 group by device_id 
# select avg(start_up_buffer) from qoe_dev_state_6 group by device_id where time_stamp>=x time_stamp<y
# groupby->udid->sessionid->avg(n_payloads)
#sql = "SELECT * FROM qoe_dev_state LIMIT 1000"
#sql = "SELECT COUNT(DISTINCT device_id) from qoe_dev_state_4 where last_event_state != 'STOPPED' and last_report_time > '2022-02-01 15:35:33'"
"""

#@app.route("/api/favorite", methods=["POST"])
#@cross_origin(list_of_udid,current_session_id)
def favorite(mapping):
    #body:{"device_ids":{"device_id":"current_session_id"}
    #response:{}
    list_of_udid=list(mapping.values())
    current_session_id=list(mapping.keys())
    sql_query="SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE device_id in "+str(tuple(list_of_udid))+" GROUP BY device_id"
    cursor.execute(sql_query)
    results_all_time = pd.DataFrame(cursor.fetchall())

    results_all_time.columns=["device_id","startup_buffer_duration_all_time"]
    print(results_all_time)
    try:
        sql_query="SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE device_id in "+str(tuple(list_of_udid))+" and last_report_time<=\""+datetime.today().strftime("%Y-%m-%d"'T'"%H:%M:%S")+"\" and last_report_time>\""+datetime.today().replace(hour=0,minute=0,second=0).strftime("%Y-%m-%d"'T'"%H:%M:%S")+"\" GROUP BY device_id"
        cursor.execute(sql_query)
        print(cursor.fetchall())
        results_24hrs = pd.DataFrame(cursor.fetchall())
        results_24hrs.columns=["device_id","startup_buffer_duration_today"]
        print(results_24hrs)
        final=results_all_time.merge(results_24hrs,left_on="device_id",right_on="device_id")
    except:
        results_24hrs=pd.DataFrame(list_of_udid)
        results_24hrs.columns=["device_id"]
        results_24hrs["startup_buffer_duration_today"]=[1 for i in results_24hrs["device_id"].values]
        final=results_all_time.merge(results_24hrs,left_on="device_id",right_on="device_id")
    sql_query="SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE current_session_id in "+str(tuple(current_session_id))+" GROUP BY current_session_id"
    cursor.execute(sql_query)
    results_last_session = pd.DataFrame(cursor.fetchall())
    results_last_session.columns=["current_session_id","startup_buffer_last_session"]
    results_last_session["device_id"]=[str(mapping[i])  for i in results_last_session["current_session_id"].values]
    results_last_session.drop("current_session_id",inplace=True,axis=1)
    
    final=final.merge(results_last_session,left_on="device_id",right_on="device_id")
    return final.to_json(orient="records")
        
mapping={'8e725d35-3464-445f-bfbf-4e9f2da58409':"13c2257b-5cec-4b0a-8628-cfc4137ceaf1",'42ea053c-2412-4dd6-8cc8-71fcaf60ee45':"df3aab8e-b934-4bbd-969f-72414aef3b20"}
print(favorite(mapping))
"""
"""
sql_query="SELECT device_id,avg(startup_buffer_duration) FROM qoe_dev_state_6 GROUP BY device_id"
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)
"""
"""

sql_query="SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE device_id in "+str(tuple(["13c2257b-5cec-4b0a-8628-cfc4137ceaf1","df3aab8e-b934-4bbd-969f-72414aef3b20"]))+" and last_report_time<=\""+datetime.today().strftime("%Y-%m-%d"'T'"%H:%M:%S")+"\" and last_report_time>\""+datetime.today().replace(hour=0,minute=0,second=0).strftime("%Y-%m-%d"'T'"%H:%M:%S")+"\" GROUP BY device_id"
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)

sql_query="SELECT *,avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE current_session_id in "+str(tuple(["8e725d35-3464-445f-bfbf-4e9f2da58409","42ea053c-2412-4dd6-8cc8-71fcaf60ee45"]))+" GROUP BY current_session_id"
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)
"""

"""
#sql_query="SELECT avg(startup_buffer_duration) FROM qoe_dev_state_6  WHERE current_session_id=(SELECT current_session_id from qoe_dev_state_6 ORDER BY last_report_time DESC LIMIT 1) GROUP BY device_id"
sql_query="SELECT current_session_id from qoe_dev_state_6 WHERE device_id= ORDER BY last_report_time DESC LIMIT 1"
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)"""
"""
sql_query="SELECT avg(m_minutes_per_unique_devices) FROM qoe_metric_dev WHERE dts_es<=\'"+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))+"\'"
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)

sql_query="SELECT sum(m_total_minutes_watched) FROM qoe_metric_dev WHERE dts_es<=\'"+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))+"\'"
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)
"""


"""
sql_query="SELECT sum(m_successful_plays) FROM qoe_metric_dev WHERE dts_es<=\'"+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))+"\'"
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)
"""
import time
print("To:",str(datetime.today().strftime("%Y-%m-%d %H:%M:%S")))
print("FROM:",str((datetime.today() - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S")))
"""
#sql_query="SELECT sum(m_attempts) FROM qoe_metric_dev WHERE dts_es<=\'"+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))+"\'"
sql_query="SELECT max(m_concurrent_plays) FROM qoe_metric_dev WHERE dts_es<=\'"+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S"))+"\'"
print(sql_query)
time_now=time.time()
cursor.execute(sql_query)
print("TIME:",time.time()-time_now)
results = cursor.fetchall()
print(results)
sql_query="SELECT max(m_concurrent_plays) FROM qoe_metric_dev WHERE dts_es<=\'"+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))+"\'"
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)

"""
time_now=time.time()
#sql_query="SELECT sum(m_attempts),avg(m_average_bitrate),avg(m_average_framerate),avg(m_average_percentage_completion),avg(m_bandwidth),sum(m_exit_before_video_starts),avg(m_rebuffering_percentage),avg(m_rebuffering_ratio),sum(m_successful_plays),avg(m_minutes_per_unique_devices),sum(m_total_minutes_watched),sum(m_user_attrition),sum(m_video_playback_failures),sum(m_video_start_failures),avg(m_video_start_time),avg(m_video_restart_time),avg(m_rendering_quality) FROM qoe_metric_dev WHERE dts_es<=\'"+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S"))+"\' Group by content_partner"
sql_query="SELECT * FROM qoe_metric_dev WHERE dts_es<=\'"+str((datetime.today() - timedelta(days=8)).strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=9)).strftime("%Y-%m-%d %H:%M:%S"))+"\' Group by content_partner,device_platform"
print(sql_query)
print(sql_query)
cursor.execute(sql_query)
results = cursor.fetchall()
print(results)
from_time=str((datetime.today() - timedelta(days=9)).strftime("%Y-%m-%d %H:%M:%S"))
to_time=str((datetime.today() - timedelta(days=8)).strftime("%Y-%m-%d %H:%M:%S"))
sql_query=sql_query="select count(device_id) from {} where last_event_state='STOPPED' and last_report_time<=\'".format("qoe_dev_state_6")+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' group by provider"
print(sql_query)
cursor.execute(sql_query)
value=cursor.fetchall()
print(value)
#sql_query="SELECT sum(m_attempts),avg(m_average_bitrate),avg(m_average_framerate),avg(m_average_percentage_completion),avg(m_bandwidth),sum(m_exit_before_video_starts),avg(m_rebuffering_percentage),avg(m_rebuffering_ratio),sum(m_successful_plays),avg(m_minutes_per_unique_devices),sum(m_total_minutes_watched),sum(m_user_attrition),sum(m_video_playback_failures),sum(m_video_start_failures),avg(m_video_start_time),avg(m_video_restart_time),avg(m_rendering_quality) FROM qoe_metric_dev WHERE dts_es<=\'"+str((datetime.today() - timedelta(days=8)).strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=9)).strftime("%Y-%m-%d %H:%M:%S"))+"\' Group by content_partner"
##print(sql_query)
#cursor.execute(sql_query)
#results1 = cursor.fetchall()
#print(results)
#print(results1)
#print({results[i][0]:results1[i] for i in range(len(results))})
#print("TIME:",time.time()-time_now)