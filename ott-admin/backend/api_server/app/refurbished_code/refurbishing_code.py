from sqlite3 import connect
import jaydebeapi
import time
import pandas as pd
import json
import copy
from zmq import device
import opensearch_connector
import asyncio
from enum import Enum
from datetime import datetime, timedelta

# Todo: compare and remove after merging the changes

jdbc_url= "jdbc:opensearch://https://vpc-qoe-opensearch-vpbzmm44ds5kulnit2h3degj44.ap-south-1.es.amazonaws.com"
creds=["root", "dell#Hp$20"]
dsm_es_index_name="qoe_dev_state_6"
flink_es_index_name="qoe_metric_dev"

conn = jaydebeapi.connect("org.opensearch.jdbc.Driver",
                         jdbc_url,
                           creds,
                           "./opensearch-sql-jdbc-1.1.0.1.jar")
client = opensearch_connector.opensearch_client(opensearch_connector.config["host"], opensearch_connector.config["http_auth"])
cursor = conn.cursor()

class Aggregation_type(Enum):
    m_attempts="sum"
    m_average_bitrate="avg"
    m_average_framerate="avg"
    m_average_percentage_completion="avg"
    m_bandwidth="avg"
    m_concurrent_plays="max"
    m_ended_plays="value_count"
    m_ended_plays_per_unique_devices="terms"
    m_exit_before_video_starts="sum"
    m_minutes_per_unique_devices="avg"
    m_play_attempts="sum"
    m_rebuffering_percentage="avg"
    m_rebuffering_ratio="avg"
    m_successful_plays="sum"
    m_total_minutes_watched="sum"
    m_unique_devices="cardinality"
    m_unique_viewers="cardinality"
    m_user_attrition="sum"
    m_video_playback_failures="sum"
    m_video_start_failures="sum"
    m_video_start_time="avg"
    m_video_restart_time="avg"
    m_rendering_quality="avg"

class Units(Enum):
    m_video_start_time=""
    m_video_restart_time=""
    m_rendering_quality=""
    m_attempts=""
    m_average_bitrate="kbps"
    m_average_framerate="fps"
    m_average_percentage_completion="%"
    m_bandwidth="mbps"
    m_concurrent_plays=""
    m_ended_plays=""
    m_ended_plays_per_unique_devices=""
    m_exit_before_video_starts=""
    m_minutes_per_unique_devices="mins"
    m_play_attempts=""
    m_rebuffering_percentage="%"
    m_rebuffering_ratio=""
    m_successful_plays=""
    m_total_minutes_watched="mins"
    m_unique_devices=""
    m_unique_viewers=""
    m_user_attrition=""
    m_video_playback_failures=""
    m_video_start_failures=""
    
class Metrices_name(Enum):
    metrices_from_flink_es=['m_attempts','m_average_bitrate','m_average_framerate','m_average_percentage_completion','m_bandwidth','m_exit_before_video_starts','m_minutes_per_unique_devices','m_rebuffering_percentage','m_rebuffering_ratio','m_successful_plays','m_total_minutes_watched','m_user_attrition','m_video_playback_failures','m_video_start_failures','m_video_start_time','m_video_restart_time','m_rendering_quality','m_concurrent_plays']
    metrices_from_dsm_es=["m_unique_devices","m_unique_viewers","m_ended_plays","m_ended_plays_per_unique_devices"]

def generate_jdbc_query(metrics,index_name):
    sql_query="SELECT "
    for pos,i in enumerate(metrics):
        sql_query+=Aggregation_type.i+"({})".format(i)
        if pos<len(metrics)-1:
            sql_query+=","
    sql_query+=" FROM {} WHERE dts_es<=\'".format(index_name)+str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))+"\' and dts_es>\'"+str((datetime.today() - timedelta(days=2)).strftime("%Y-%m-%d %H:%M:%S"))+"\'"
    return sql_query

def get_metric_single_datapoint_jdbc(metrics,filter,from_time,to_time,source) -> dict:
    """
    return {"metricname":"metricvalue"}
    """
    if source=="flink_es":
        sql_query="SELECT "
        for pos,i in enumerate(metrics):
            sql_query+=Aggregation_type[i].value+"({})".format(i)
            if pos<len(metrics)-1:
                sql_query+=","
        sql_query+=" FROM {} where dts_es<=\'".format(flink_es_index_name)+str(to_time)+"\' and dts_es>\'"+str(from_time)+"\' "
        sql_query+="and content_partner=\'{}\'".format(filter["content_partner"]) if filter["content_partner"]!="" else ""
        #sql_query=generate_jdbc_query(metrics,flink_es_index_name)
        cursor.execute(sql_query)
        results = cursor.fetchall()
        return dict(zip(metrics,list(results[0])))
    elif source=="dsm_es":
        #sql_query=generate_jdbc_query(metrics,flink_es_index_name)
        sql_query="SELECT count(DISTINCT device_id), count(DISTINCT current_session_id) from {}  WHERE last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\'"
        sql_query+="and provider=\'{}\'".format(filter["content_partner"]) if filter["content_partner"]!="" else ""
        print(sql_query)
        cursor.execute(sql_query)
        results = list(cursor.fetchall()[0])
        sql_query="select count(device_id) from {} where last_event_state='STOPPED' and last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' {}".format("and provider=\'{}\'".format(filter["content_partner"]) if filter["content_partner"]!="" else "")
        cursor.execute(sql_query)
        results.extend(list(cursor.fetchall()[0]))
        sql_query="select count(device_id) from {} where last_event_state='STOPPED' and last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' {}".format("and provider=\'{}\'".format(filter["content_partner"]) if filter["content_partner"]!="" else "")+" group by device_id order by count(device_id) desc LIMIT 1 "
        cursor.execute(sql_query)
        value=cursor.fetchall()
        if len(list(value))>0:
            results.extend(list(value[0]))
        else:
            results.extend([0])
        sql_query="select avg(rebuffering_duration/(rebuffering_duration+seconds_watched)) from "+dsm_es_index_name+" where last_event_state!='SEEKED' and last_report_time<=\'"+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' {}".format("and provider=\'{}\'".format(filter["content_partner"]) if filter["content_partner"]!="" else "")
        cursor.execute(sql_query)
        value=cursor.fetchall()
        if len(list(value))>0:
            results.extend(list(value[0]))
        else:
            results.extend([0])
        #results.extend(list(cursor.fetchall()[0]))
        #print(results)
        return dict(zip(metrics,results))


async def get_metric_single_datapoint_jdbc_grouped_by_partner_provider(metrics,filter,from_time,to_time,source) -> dict:
    """
    return {"metricname":"metricvalue"}
    """
    if source=="flink_es":
        sql_query="SELECT "
        for pos,i in enumerate(metrics):
            sql_query+=Aggregation_type[i].value+"({})".format(i)
            if pos<len(metrics)-1:
                sql_query+=","
        sql_query+=" FROM {} where dts_es<=\'".format(flink_es_index_name)+str(to_time)+"\' and dts_es>\'"+str(from_time)+"\' GROUP BY {}".format(filter["group_on"])
        #print(sql_query)
        #sql_query=generate_jdbc_query(metrics,flink_es_index_name)
        cursor.execute(sql_query)
        results = cursor.fetchall()
        sql_query="SELECT * FROM {} where dts_es<=\'".format(flink_es_index_name)+str(to_time)+"\' and dts_es>\'"+str(from_time)+"\' GROUP BY {}".format(filter["group_on"])
        #print(sql_query)
        cursor.execute(sql_query)
        name = cursor.fetchall()
        name=[i[0] for i in name]
        return {name[i]:{**{filter["group_on"]:name[i]},**dict(zip(metrics,results[i]))} for i in range(len(name))},name

    elif source=="dsm_es":
        result=[]
        sql_query="SELECT * FROM {} where last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' GROUP BY {}".format(filter["group_on"])
        cursor.execute(sql_query)
        keys= cursor.fetchall()
        keys=[i[0] for i in keys]
        sql_query="SELECT {}".format(filter["group_on"])+",count(DISTINCT device_id) from {}  WHERE last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' GROUP BY {}".format(filter["group_on"])
        cursor.execute(sql_query)
        result.append(list(cursor.fetchall()))
        sql_query="SELECT {}".format(filter["group_on"])+",count(DISTINCT current_session_id) from {}  WHERE last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' GROUP BY {}".format(filter["group_on"])
        cursor.execute(sql_query)
        result.append(list(cursor.fetchall()))

        sql_query="SELECT {}".format(filter["group_on"])+",count(device_id) from {} where last_event_state='STOPPED' and last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' GROUP BY {}".format(filter["group_on"])
        cursor.execute(sql_query)
        result.append(list(cursor.fetchall()))
        #print(result)
        

        sql_query="select device_id,platform,provider from {} where last_event_state='STOPPED' and last_report_time<=\'".format(dsm_es_index_name)+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\'"
        #print(sql_query)
        cursor.execute(sql_query)
        value=cursor.fetchall()
        value=pd.DataFrame(value)
        value.columns=["device_id","platform","provider"]
        label=list(value.groupby(filter["group_on"])["device_id"].value_counts().sort_values(ascending=False).index.get_level_values(0))
        count=list(value.groupby(filter["group_on"])["device_id"].value_counts().sort_values(ascending=False).max(level=0).values)
        result.append([(label[i],count[i])for i in range(len(count))])

        #if len(list(value))>0:
        #    results.extend(list(value[0]))
        #else:
        #    results.extend([0])
        """
        sql_query="SELECT {}".format(filter["group_on"])+",avg(rebuffering_duration/(rebuffering_duration+seconds_watched)) from "+dsm_es_index_name+"  where last_event_state!='SEEKED' and last_report_time<=\'"+str(to_time)+"\' and last_report_time>\'"+str(from_time)+"\' GROUP BY {}".format(filter["group_on"])
        print(sql_query)
        cursor.execute(sql_query)
        result.append(list(cursor.fetchall()))
        #print("Result",result)
        #result=list(map(list, zip(*result)))
        """
        response={}
        #print(result)
        #print(keys)
        for i in keys:
            data_for_each_key={}
            data_for_each_key[filter["group_on"]]=i
            for j in range(len(metrics)):
                #print(metrics[j])
                #print(result)
                if len(result[j])>0 and i in list(dict(result[j])):
                    data_for_each_key[metrics[j]]=dict(result[j])[i]
                else:
                    data_for_each_key[metrics[j]]=0
            response[i]=data_for_each_key

        return response,keys



#to_time=str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))

#print(get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_dsm_es.value,{"content_partner":""},from_time,to_time,'dsm_es'))


def percentage_change(to_time,from_time_24hrs,from_time_48hrs):
    dsm_es_24hrs=get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_dsm_es.value,{"content_partner":""},from_time_24hrs,to_time,'dsm_es')
    dsm_es_48hrs=get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_dsm_es.value,{"content_partner":""},from_time_48hrs,from_time_24hrs,'dsm_es')
    flink_es_24hrs=get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_flink_es.value,{"content_partner":""},from_time_24hrs,to_time,'flink_es')
    flink_es_48hrs=get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_flink_es.value,{"content_partner":""},from_time_48hrs,from_time_24hrs,'flink_es')
    percentage_change_dsm_es={i:((dsm_es_24hrs[i]-dsm_es_48hrs[i])/dsm_es_48hrs[i])*100 if dsm_es_48hrs[i]>0 else 100 for i in dsm_es_24hrs}
    percentage_change_flink_es={i:((flink_es_24hrs[i]-flink_es_48hrs[i])/flink_es_48hrs[i])*100 if flink_es_48hrs[i]>0 else 100 for i in flink_es_24hrs}
    percentage_change={**percentage_change_dsm_es,**percentage_change_flink_es}
    metrices_24hrs={**dsm_es_24hrs,**flink_es_24hrs}
    metrices_48hrs={**dsm_es_48hrs,**flink_es_48hrs}
    return [{"percentage":percentage_change[i],"hrs_change_24hrs":metrices_24hrs[i],"hrs_change_48hrs":metrices_48hrs[i],"metricname":i[2:].replace("_"," ").title(),"metric_key_name":i[2:],"unit":Units[i].value,"color":True if metrices_48hrs[i]<metrices_24hrs[i] else False} for i in metrices_24hrs]

def generate_query(start_time, stop_time, filters,aggregation_type,device_platform):
    """
    Generate's Query V1
    1) Having comparably high latency
    """
    filter=[{"range": {"dts_es": {"lte": stop_time, "gt": start_time}}}] if len(start_time) != 0 and len(stop_time) != 0 else []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i!="device_platform":
            if len(filters[i]) > 0:
                if i == "content_partner":
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j.lower() for j in filters[i]]
                        }
                    })
    if len(filters["device_platform"]) > 0:
        filter.append(
            {"terms": {"device_platform": [device_platform.lower()]}})
    filter = list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"] = "10m"
    query = {"_source":"false","aggs": {
        "selected_dates": {
            "filter": {
                "bool": {
                    "must": filter
                }
            },
            "aggs": {
                "time_stamp": {
                    "date_histogram": {
                        "field": "dts_es",
                        "fixed_interval": filters["aggregation_interval"]
                    },
                    "aggregations": {
                        "average_value": {
                            aggregation_type: {
                                "field": "m_"+filters["metricname"]

                            }
                        }
                    }
                }
            }
        }
    }}
    return query

def generate_query_dsm_es(start_time, stop_time, filters,aggregation_type,must_filters,platform):
    """
    Generate's Query V1
    1) Having comparably high latency
    """
    filter=[]
    query={}
    filter=must_filters if len(start_time) != 0 and len(stop_time) != 0 else []
    for i in filters:
        if i != "metricname" and i != "aggregation_interval" and i!="aggregation_feild" and i!="platform" :
            if len(filters[i]) > 0:
                if i == "provider":
                    filter.append({
                        "terms": {
                            i: [j for j in filters[i]]
                        }
                    })
                else:
                    filter.append({
                        "terms": {
                            i: [j for j in filters[i]]
                        }
                    })
    if len(filters["platform"]) > 0:
        #print(filter)
        filter.append(
            {"terms": {"platform": [platform.lower()]}})
    filter = list(filter)
    if "aggregation_interval" not in filters.keys():
        filters["aggregation_interval"] = "10m"
    query = {"_source":"false","aggs": {
        "selected_dates": {
            "filter": {
                "bool": {
                    "must": filter
                }
            },
            "aggs": {
                "time_stamp": {
                    "date_histogram": {
                        "field": "last_report_time",
                        "fixed_interval": filters["aggregation_interval"]
                    },
                    "aggregations": {
                        "average_value": {
                            aggregation_type: {
                                "field": filters["aggregation_feild"]

                            }
                        }
                    }
                }
            }
        }
    }}
    #print(query)
    filter=0
    return query
def metric_graphs_dsm_es(from_time,to_time,filters):
    output_response = []
    if filters["metricname"] in ["unique_devices","unique_viewers"]:
        conditions=[{'range': {'last_report_time': {'lte': to_time, 'gt': from_time}}}]
    elif filters["metricname"] in ["ended_plays","ended_plays_per_unique_devices"]:
        conditions=[{'range': {'last_report_time': {'lte': to_time, 'gt': from_time}}},{"match":{"last_event_state":"STOPPED"}}]
    if len(filters["platform"])>0:
        for i in filters["platform"]:
                query = json.dumps(generate_query_dsm_es(
                    from_time, to_time, filters, Aggregation_type["m_"+filters["metricname"]].value,copy.copy(conditions),i))
                try:
                    # if the data for the requested query in opensearch does not exist then exception will be called
                    response = client.search(body=query, index=opensearch_connector.config2["index_name"])

                except: # pylint: disable=bare-except
                    return {}
                ##print(response)
                time_stamp = []
                metric_value = []
                
                if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
                    for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                        time_stamp.append(j["key_as_string"])
                        if Aggregation_type["m_"+filters["metricname"]].value!="terms":
                            if j["average_value"]["value"] is None:
                                metric_value.append(0) # if by any chance value ="" or None 
                            else:
                                metric_value.append(j["average_value"]["value"])
                        else:
                            metric_value.append(j["average_value"]["buckets"][0]["doc_count"])

                output_response.append({i: {"time_stamp": time_stamp, filters["metricname"]: metric_value}}) #appending [X,y] for each device to the consolidated list            
        #equalizing the legth for all the requested platforms
        ##print(output_response)
        new_df=pd.DataFrame()
        ret={}
        for i in output_response:
            sub_df=pd.DataFrame()
            if list(i.keys())[0] in filters["platform"]:
                    dff=i[list(i.keys())[0]]
                    sub_df=pd.DataFrame(dff[filters["metricname"]],dff["time_stamp"],columns=[filters["metricname"]+"_"+list(i.keys())[0]])
            new_df=pd.concat([new_df,sub_df],axis=1).fillna(0)
        new_df.index=pd.to_datetime(new_df.index)
        new_df.sort_index(inplace=True)
        output_response=[]
        new_df.index=new_df.index.map(str)
        
        for i in filters["platform"]:
            ret={}
            ret[i]={}
            ret[i][filters["metricname"]]=new_df[filters["metricname"]+"_"+i].values.tolist()
            ret[i]["time_stamp"]=list(new_df.index.values) 
            ret[i]["unit"]=Units["m_"+filters["metricname"]].value
            output_response.append(ret)  
        #print(response)
        return output_response

    else:
        query = json.dumps(generate_query_dsm_es(
            from_time, to_time, filters, Aggregation_type["m_"+filters["metricname"]].value,conditions,None))
        try:
            # if the data for the requested query in opensearch does not exist then exception will be called
            response = client.search(body=query, index=opensearch_connector.config2["index_name"])
        except: # pylint: disable=bare-except
            return {}
        print(response)
        time_stamp = []
        metric_value = []
        if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
            for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                time_stamp.append(j["key_as_string"])
                if Aggregation_type["m_"+filters["metricname"]].value!="terms":
                    if j["average_value"]["value"] is None:
                        metric_value.append(0) # if by any chance value ="" or None 
                    else:
                        metric_value.append(j["average_value"]["value"])
                else:
                    metric_value.append(j["average_value"]["buckets"][0]["doc_count"])
        output_response.append({"all": {"time_stamp": time_stamp,filters["metricname"] : metric_value}}) 
        return(output_response)


def metric_graphs_flink_es(from_time,to_time,filters):
        output_response = []
        if len(filters["device_platform"]) != 0:
            for i in filters["device_platform"]:
                query = json.dumps(generate_query(
                    from_time, to_time, filters, Aggregation_type["m_"+filters["metricname"]].value,i))
                try:
                    # if the data for the requested query in opensearch does not exist then exception will be called
                    response = client.search(
                        body=query, index=opensearch_connector.config["index_name"])
                except: # pylint: disable=bare-except
                    return {}
                #print(response)
                time_stamp = []
                metric_value = []
                
                if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
                    for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                        time_stamp.append(j["key_as_string"])
                        if j["average_value"]["value"] is None:
                            metric_value.append(0) # if by any chance value ="" or None 
                        else:
                            metric_value.append(j["average_value"]["value"])
                
                output_response.append({i: {"time_stamp": time_stamp, filters["metricname"]: metric_value}}) #appending [X,y] for each device to the consolidated list            
            #equalizing the legth for all the requested platforms
            new_df=pd.DataFrame()
            ret={}
            for i in output_response:
                sub_df=pd.DataFrame()
                if list(i.keys())[0] in filters["device_platform"]:
                        dff=i[list(i.keys())[0]]
                        sub_df=pd.DataFrame(dff[filters["metricname"]],dff["time_stamp"],columns=[filters["metricname"]+"_"+list(i.keys())[0]])
                new_df=pd.concat([new_df,sub_df],axis=1).fillna(0)
            new_df.index=pd.to_datetime(new_df.index)
            new_df.sort_index(inplace=True)
            output_response=[]
            new_df.index=new_df.index.map(str)
            
            for i in filters["device_platform"]:
                ret={}
                ret[i]={}
                ret[i][filters["metricname"]]=new_df[filters["metricname"]+"_"+i].values.tolist()
                ret[i]["time_stamp"]=list(new_df.index.values) 
                ret[i]["unit"]=Units["m_"+filters["metricname"]].value
                output_response.append(ret)  
            return output_response
        else:
            # Condition will be called when API Body Does not contain any device_platform and hence api returns aggregated data for all devices
            query = json.dumps(generate_query(
                from_time, to_time, filters, Aggregation_type["m_"+filters["metricname"]].value,None))
            response = client.search(
                body=query, index=opensearch_connector.config["index_name"])
            time_stamp = []
            metric_value = []
            if len(response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]) > 0:
                for j in response["aggregations"]["selected_dates"]["time_stamp"]["buckets"]:
                    time_stamp.append(j["key_as_string"])
                    if j["average_value"]["value"] is None:
                        metric_value.append(0)
                    else:
                        metric_value.append(j["average_value"]["value"])
            output_response.append({"all": {"time_stamp": time_stamp, filters["metricname"]: metric_value,"unit":Units["m_"+filters["metricname"]].value}})
            return output_response

"""def aggregated_data_by_platform_partner(from_time,to_time,group_on):
    mapping={"device_platform":"platform","content_partner":"provider"}
    flink_es,keys_flink=get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metrices_from_flink_es.value,{"group_on":group_on},from_time,to_time,'flink_es')
    dsm_es,keys_dsm=get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metrices_from_dsm_es.value,{"group_on":mapping[group_on]},from_time,to_time,'dsm_es')
    #print(flink_es)
    #print(dsm_es)
    print(keys_flink)
    print(keys_dsm)
    response=[]
    print(set(keys_flink)-set(keys_dsm))
    for i in set(keys_dsm).intersection(set(keys_flink)):
        response.append({**flink_es[i],**dsm_es[i]})
    print(response)
    #return [{**flink_es[i],**dsm_es[i]} for i in range(len(flink_es))]]"""

async def aggregated_data_by_platform_partner(from_time,to_time,group_on):
    mapping={"device_platform":"platform","content_partner":"provider"}
    flink,dsm=await asyncio.gather(get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metrices_from_flink_es.value,{"group_on":group_on},from_time,to_time,'flink_es'),get_metric_single_datapoint_jdbc_grouped_by_partner_provider(Metrices_name.metrices_from_dsm_es.value,{"group_on":mapping[group_on]},from_time,to_time,'dsm_es'))
    flink_es,keys_flink,dsm_es,keys_dsm=flink[0],flink[1],dsm[0],dsm[1]
    #print(flink_es)
    #print(dsm_es)
    response=[]
    print(set(keys_flink)-set(keys_dsm))
    for i in set(keys_dsm).intersection(set(keys_flink)):
        response.append({**flink_es[i],**dsm_es[i]})
    return response
    #return [{**flink_es[i],**dsm_es[i]} for i in range(len(flink_es))]]



if __name__=="__main__":
    # Aggregated Data Grouped By Either Content Partner Or Device Platform
    # For Experience Insight Screen
    from_time=str((datetime.today() - timedelta(days=5)).strftime("%Y-%m-%d %H:%M:%S"))
    to_time=str((datetime.today() - timedelta(days=4)).strftime("%Y-%m-%d %H:%M:%S"))
    import time
    #to_time=str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))
    #from_time=str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))
    time_start=time.time()
    print(from_time)
    print(to_time)
    print(asyncio.run(aggregated_data_by_platform_partner(from_time,to_time,"content_partner")))
    print("Time Lapsed",time.time()-time_start)
    #print(aggregated_data_by_platform_partner(from_time,to_time,"content_partner"))

    

    """
    # Get Percentage Change For All Metrices
    # For Home Screen Top Bar,and Home Screen Analysis Section
    to_time=str((datetime.today() - timedelta(days=50)).strftime("%Y-%m-%d %H:%M:%S"))
    from_time_24hrs=str((datetime.today() - timedelta(days=49)).strftime("%Y-%m-%d %H:%M:%S"))
    from_time_48hrs=str((datetime.today() - timedelta(days=48)).strftime("%Y-%m-%d %H:%M:%S"))
    print(percentage_change(to_time,from_time_24hrs,from_time_48hrs))
    """
    """
    #extracting graph data for metrices on flink elastic search
    filters={
        "metricname": "average_bitrate",
        "content_partner": [],
        "device_model": [],
        "device_platform": ["IOS","ANDROID"],
        "content_type": [],
        "cdn": [],
        "location": [],
        "aggregation_interval": "1d"
    }
    to_time=from_time=str((datetime.today() - timedelta(days=40)).strftime("%Y-%m-%dT%H:%M:%S"))
    from_time=str((datetime.today() - timedelta(days=50)).strftime("%Y-%m-%dT%H:%M:%S"))
    print(to_time)
    print(from_time)
    print(metric_graphs_flink_es(from_time,to_time,filters))
    """
    
    """
    mapping={"device_platform":"platform","content_partner":"provider"}
    #extracting graph data for metrices on dsm elastic search
    filters={
        "metricname": "ended_plays_per_unique_devices",
        "provider": [],
        "device_model": [],
        "platform": ["Android","IOS","WEb"],
        "content_type": [],
        "cdn": [],
        "location": [],
        "aggregation_feild":"device_id",
        "aggregation_interval": "1d"
    }
    #to_time='2022-03-31T10:50:28.000000'
    #from_time='2022-03-30T10:50:28.000000'
    to_time=from_time=str((datetime.today() - timedelta(days=4)).strftime("%Y-%m-%dT%H:%M:%S"))
    from_time=str((datetime.today() - timedelta(days=5)).strftime("%Y-%m-%dT%H:%M:%S"))
    print(metric_graphs_dsm_es(from_time,to_time,filters))
    """
    """
    # Get Last X hours Change For [FLINK_ES/DSM_ES]
    to_time=str(datetime.today().strftime("%Y-%m-%d %H:%M:%S"))
    from_time=str((datetime.today() - timedelta(days=1)).strftime("%Y-%m-%d %H:%M:%S"))
    print(get_metric_single_datapoint_jdbc(Metrices_name.metrices_from_dsm_es.value,{"content_partner":""},from_time,to_time,'dsm_es'))
    """