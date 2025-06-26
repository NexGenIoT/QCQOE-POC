import jaydebeapi
import time
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
sql = "SELECT * FROM qoe_dev_state LIMIT 1000"
sql = "SELECT COUNT(DISTINCT device_id) from qoe_dev_state_4 where last_event_state != 'STOPPED' and last_report_time > '2022-02-01 15:35:33'"
#cursor.execute("Select  dts, min(m_average_bitrate), cdn from qoe_metric_dev group by cdn, dts LIMIT 100")
def sql_provider():
    sqls = []
    sqls1 = "SELECT * FROM qoe_dev_state LIMIT 1"
    sqls2 = "SELECT COUNT(DISTINCT device_id) from qoe_dev_state_4 where last_event_state != 'STOPPED' and last_report_time > '2022-02-01 15:35:33'"
    yield sqls1
    yield sqls2
counter=0
while True:
        for query in sql_provider():
            print(query)
            print("+++++++++")
        
            cursor.execute(query)
            results = cursor.fetchall()
            #print(cursor.description)
            if not results:
                break
            for result in results:
                counter=counter+1
                print(counter, result)
    