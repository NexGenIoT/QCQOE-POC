from base64 import decode

from loguru import logger
from db_wrapper import AwsDynamodb, SqliteDb
from datetime import datetime
import pandas as pd


class Mitigation(object):
    def __init__(self):
        self.dynamodb_obj = AwsDynamodb()
        self.sqlite_obj = SqliteDb()

    def decode(self, resp):
        data=[]
        for i in range(len(resp["Items"])):
                row_data={}
                for j in resp["Items"][i]:
                    if j=="last_report_time":
                        row_data[j]=int(float(resp["Items"][i][j][list(resp["Items"][i][j].keys())[0]]))
                    else:
                        row_data[j] = resp["Items"][i][j][list(resp["Items"][i][j].keys())[0]]
                data.append(row_data)
        df=pd.DataFrame(data)
        if len(df)==0:
            return df
        
        df["last_report_time"]=pd.to_datetime(df["last_report_time"].astype(int), unit="s")
        return df
                

    def decode_v2(self, resp):
        data=[]
        df=pd.DataFrame(resp)
        if len(df)==0:
            return df
        df["last_report_time"]=pd.to_datetime(df["last_report_time"].astype(str))
        # df["last_report_time"] = df.last_report_time + pd.Timedelta('05:30:00')
        # df.last_report_time = df.last_report_time.dt.tz_localize('GMT').dt.tz_convert('Asia/Kolkata')

        return df

    def get_dates_from_aggrigation_window(self, aggregation_window, from_time, to_time):
        from_time = self.replace_time_window(aggregation_window, from_time)
        to_time = self.replace_time_window(aggregation_window, to_time)
        dates = ""
        if "d" in aggregation_window:
            dates = dict(dt=pd.date_range(from_time, to_time, freq="1d"))
        elif "min" in aggregation_window:
            dates = dict(dt=pd.date_range(from_time, to_time, freq="1min"))
        elif "h" in aggregation_window:
            dates = dict(dt=pd.date_range(from_time, to_time, freq="1h"))
        return dates

    def get_time_and_count(self, dates, mapping):
        time = []
        count = []
        for j in dates["dt"]:
            if pd.Timestamp(j) in mapping.keys() and mapping[j] != "NaN":
                time.append(str(j))
                count.append(int(mapping[j]))
            else:
                time.append(str(j))
                count.append(0)
        return time, count

    def replace_time_window(self, aggregation_window,time):
        if type(time) is str:
            time = pd.to_datetime(time)
        if "d" in aggregation_window:
            return time.replace(hour=0,minute=0,second=0, microsecond=0)
        elif "min" in aggregation_window:
            return time.replace(second=0, microsecond=0)
        elif "h" in aggregation_window:
            return time.replace(minute=0,second=0, microsecond=0)

    def get_data_for_single_platform(self):
        data = []
        pass

    def get_data_for_multiple_platform(self):
        data = []
        pass

    def number_of_mitigations_applied(self, from_time,to_time,aggregation_window,platform,location,source):
        query='SELECT mitigation_status,last_report_time,platform FROM dsm where mitigation_status=\'FIXED\' {}'.format("and location in {}".format(str(tuple(location)) if len(location)>1 else "(\'>"+location[0]+"\')") if len(location)>0 else "") +" and last_report_time>=\'{}\'".format(from_time)+"" +" and last_report_time<=\'{}\'".format(to_time)+""
        # resp = self.dynamodb_obj.execute_query(query=query)
        # filters = self.dynamodb_obj.get_records_date_range(from_time, to_time, location=location, platform=platform,mitigation_status='FIXED')
        # logger.info(f"filters : {filters}")
        # resp = self.dynamodb_obj.query_execution_v2(filters)
        if len(source) > 0:
            source = tuple(source) if len(source) > 1 else f"('{source[0]}')"
            query += f" and source in {source}"
        resp = self.sqlite_obj.execute_query(query)
        #logger.info(f"resp : {len(resp)}")
        df=self.decode_v2(resp)
        if len(df)==0:
            return []
        if len(platform)>0:
            df1=df.groupby([df["platform"],df["last_report_time"]]).mitigation_status.count().groupby([pd.Grouper(level="platform"),pd.Grouper(level='last_report_time', freq=aggregation_window, label="left", origin="start_day")]).count()
            # from_time=pd.to_datetime(datetime.strptime(from_time, '%Y-%m-%dT%H:%M:%S').isoformat(timespec='microseconds'))
            # to_time=pd.to_datetime(datetime.strptime(to_time, '%Y-%m-%dT%H:%M:%S').isoformat(timespec='microseconds'))
            # from_time = datetime.strptime(from_time, '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
            # to_time = datetime.strptime(to_time, '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
            dates = self.get_dates_from_aggrigation_window(aggregation_window, from_time, to_time)
            data=[]
            for i in set(df1.index.get_level_values(0)):
                if i.lower() in list(map(lambda x: x.lower(),platform)):
                    time_full_array=[pd.Timestamp(x) for x in df1[df1.index.get_level_values(0)==i].index.get_level_values(1).values]
                    count_full_array=df1[df1.index.get_level_values(0)==i].values
                    mapping=dict(zip(time_full_array,count_full_array))
                    time, count = self.get_time_and_count(dates, mapping)
                    group_by_interval = pd.DataFrame(list(zip(count, time)), columns=["counts", "time"])
                    group_by_interval["time"] = pd.to_datetime(group_by_interval["time"])
                    group_by_interval = group_by_interval.resample(aggregation_window, on='time').counts.sum()
                    data.append({i.lower(): {"number_of_mitigations_applied": [int(x) for x in list(group_by_interval.values)],
                                             "TimeStamp": [str(i) for i in list(group_by_interval.index.values)]}})

        else:
            df1 = df.groupby([df["last_report_time"]]).mitigation_status.count().groupby(
                [pd.Grouper(level='last_report_time', freq=aggregation_window, label="right", origin="start_day")]).count()
            data = []
            time = df1.index.get_level_values(0).values
            time = [str(i) for i in time]
            count = [int(i) for i in df1.values]
            if count:
                total_sum = sum(count)
                avrage_data = total_sum/len(count)*100
            else:
                total_sum = 0
                avrage_data = 0
            data.append({"all": {"number_of_mitigations_applied": list(count), "TimeStamp": list(time),  "total_sum": "{:.2f}".format(total_sum), "avrage_data": "{:.2f}".format(avrage_data) }})
        return data

    def improvement_in_uei(self, from_time,to_time,aggregation_window,platform,location,source):
        query='SELECT device_id,last_report_time,platform FROM dsm where mitigation_status=\'FIXED\' and current_uei>previous_uei {}'.format("and location in {}".format(str(tuple(location)) if len(location)>1 else "(\'"+location[0]+"\')") if len(location)>0 else "") +" and last_report_time>=\'{}\'".format(from_time)+"" +" and last_report_time<=\'{}\'".format(to_time)+""
        # resp= self.dynamodb_obj.execute_query(query=query)
        if len(source) > 0:
            source = tuple(source) if len(source) > 1 else f"('{source[0]}')"
            query += f" and source in {source}"
        resp = self.sqlite_obj.execute_query(query)

        # filters = self.dynamodb_obj.get_records_date_range(from_time, to_time, location=location, platform=platform,mitigation_status='FIXED', metric_name="improvement_in_uei")
        # logger.info(f"filters : {filters}")
        # resp = self.dynamodb_obj.query_execution_v2(filters)
        # logger.info(f"resp : {resp}")
        # new_df = pd.DataFrame(resp)
        # df = new_df.filter(["device_id", "last_report_time", "platform"])
        # filters = self.dynamodb_obj.get_records_date_range(from_time, to_time, location=location, platform=platform,mitigation_status='FIXED',)
        # logger.info(f"filters : {filters}")
        # resp = self.dynamodb_obj.query_execution_v2(filters)
        # df = pd.DataFrame(resp)
        df=self.decode_v2(resp)
        if len(df)==0:
            return []
        if len(platform)>0:
            df1=df.groupby([df["platform"],df["last_report_time"]]).device_id.count().groupby([pd.Grouper(level="platform"),pd.Grouper(level='last_report_time', freq=aggregation_window, label="left", origin="start_day")]).count()
            # from_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            # to_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            dates = self.get_dates_from_aggrigation_window(aggregation_window, from_time, to_time)
            data=[]
            for i in set(df1.index.get_level_values(0)):
                if i.lower() in list(map(lambda x: x.lower(),platform)):
                    time_full_array=[pd.Timestamp(x) for x in df1[df1.index.get_level_values(0)==i].index.get_level_values(1).values]
                    count_full_array=df1[df1.index.get_level_values(0)==i].values
                    mapping=dict(zip(time_full_array,count_full_array))
                    time, count = self.get_time_and_count(dates, mapping)
                    group_by_interval=pd.DataFrame(list(zip(count, time)),columns=["counts","time"])
                    group_by_interval["time"]=pd.to_datetime(group_by_interval["time"])
                    group_by_interval=group_by_interval.resample(aggregation_window, on='time').counts.sum()
                    data.append({i.lower():{"improvement_in_uei":[int(x) for x in list(group_by_interval.values)],"TimeStamp":[str(i) for i in list(group_by_interval.index.values)]}})

        else:
            df1 = df.groupby([df["last_report_time"]]).device_id.count().groupby(
                [pd.Grouper(level='last_report_time', freq=aggregation_window, label="right", origin="start_day")]).count()
            data = []
            time = df1.index.get_level_values(0).values
            time = [str(i) for i in time]
            count = [int(i) for i in df1.values]
            if count:
                total_sum = sum(count)
                avrage_data = total_sum/len(count)*100
            else:
                total_sum = 0
                avrage_data = 0
            data.append({"all": {"improvement_in_uei": list(count), "TimeStamp": list(time),  "total_sum": "{:.2f}".format(total_sum), "avrage_data": "{:.2f}".format(avrage_data) }})


        return data

    def degradation_in_uei(self, from_time,to_time,aggregation_window,platform,location,source):
        query='SELECT device_id,last_report_time,platform FROM dsm where mitigation_status=\'FIXED\' and current_uei<previous_uei {}'.format("and location in {}".format(str(tuple(location)) if len(location)>1 else "(\'"+location[0]+"\')") if len(location)>0 else "") +" and last_report_time>=\'{}\'".format(from_time)+"" +" and last_report_time<=\'{}\'".format(to_time)+""
        if len(source) > 0:
            source = tuple(source) if len(source) > 1 else f"('{source[0]}')"
            query += f" and source in {source}"
        # resp= self.dynamodb_obj.execute_query(query=query)
        resp = self.sqlite_obj.execute_query(query)
        # df=self.decode(resp)
        df=self.decode_v2(resp)
        if len(df)==0:
            return []
        if len(platform)>0:
            df1=df.groupby([df["platform"],df["last_report_time"]]).device_id.count().groupby([pd.Grouper(level="platform"),pd.Grouper(level='last_report_time', freq=aggregation_window,label="left",origin="start_day")]).count()
            # from_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            # to_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            dates = self.get_dates_from_aggrigation_window(aggregation_window, from_time, to_time)
            data=[]
            for i in set(df1.index.get_level_values(0)):
                if i.lower() in list(map(lambda x: x.lower(),platform)):
                    time_full_array=[pd.Timestamp(x) for x in df1[df1.index.get_level_values(0)==i].index.get_level_values(1).values]
                    count_full_array=df1[df1.index.get_level_values(0)==i].values
                    mapping=dict(zip(time_full_array,count_full_array))
                    time, count = self.get_time_and_count(dates, mapping)
                    group_by_interval=pd.DataFrame(list(zip(count, time)),columns=["counts","time"])
                    group_by_interval["time"]=pd.to_datetime(group_by_interval["time"])
                    group_by_interval=group_by_interval.resample(aggregation_window, on='time').counts.sum()
                    data.append({i.lower():{"degradation_in_uei":[int(x) for x in list(group_by_interval.values)],"TimeStamp":[str(i) for i in list(group_by_interval.index.values)]}})

        else:
            df1=df.groupby([df["last_report_time"]]).device_id.count().groupby([pd.Grouper(level='last_report_time', freq=aggregation_window,label="right",origin="start_day")]).count()
            data=[]
            time = df1.index.get_level_values(0).values
            time = [str(i) for i in time]
            count = [int(i) for i in df1.values]
            #  "avrage_data": 0.0, "total_sum": 0.0
            if count:
                total_sum = sum(count)
                avrage_data = total_sum/len(count)*100
            else:
                total_sum = 0
                avrage_data = 0
            data.append({"all": {"degradation_in_uei": list(count), "TimeStamp": list(time),  "total_sum": "{:.2f}".format(total_sum), "avrage_data": "{:.2f}".format(avrage_data) }})
        return data

    def average_rebuffering_buffer(self, from_time,to_time,aggregation_window,platform,location,source):
        query='SELECT rebuffering_duration,last_report_time,platform FROM dsm where mitigation_status=\'FIXED\' {}'.format("and location in {}".format(str(tuple(location)) if len(location)>1 else "(\'"+location[0]+"\')") if len(location)>0 else "") +" and last_report_time>=\'{}\'".format(from_time)+"" +" and last_report_time<=\'{}\'".format(to_time)+""
        if len(source) > 0:
            source = tuple(source) if len(source) > 1 else f"('{source[0]}')"
            query += f" and source in {source}"
        # resp= self.dynamodb_obj.execute_query(query=query)
        resp = self.sqlite_obj.execute_query(query)
        # df=self.decode(resp)
        df=self.decode_v2(resp)
        if len(df)==0:
            return []
        if len(platform)>0:
            df1=df.groupby([df["platform"],df["last_report_time"]]).rebuffering_duration.mean().groupby([pd.Grouper(level="platform"),pd.Grouper(level='last_report_time', freq=aggregation_window,label="left" ,origin="start_day")]).mean()
            # from_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            # to_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            dates = self.get_dates_from_aggrigation_window(aggregation_window, from_time, to_time)
            data=[]
            for i in set(df1.index.get_level_values(0)):
                if i.lower() in list(map(lambda x: x.lower(),platform)):
                    time_full_array=[pd.Timestamp(x) for x in df1[df1.index.get_level_values(0)==i].index.get_level_values(1).values]
                    count_full_array=df1[df1.index.get_level_values(0)==i].values
                    mapping=dict(zip(time_full_array,count_full_array))
                    time, count = self.get_time_and_count(dates, mapping)
                    group_by_interval=pd.DataFrame(list(zip(count, time)),columns=["counts","time"])
                    group_by_interval["time"]=pd.to_datetime(group_by_interval["time"])
                    group_by_interval=group_by_interval.resample(aggregation_window, on='time').counts.mean()
                    data.append({i.lower():{"average_rebuffering_buffer_length":[int(x) for x in list(group_by_interval.values)],"TimeStamp":[str(i) for i in list(group_by_interval.index.values)]}})
        else:
            df1=df.groupby([df["last_report_time"]]).rebuffering_duration.mean().groupby([pd.Grouper(level='last_report_time', freq=aggregation_window,label="right",origin="start_day")]).mean()
            data=[]
            time = df1.index.get_level_values(0).values
            df1=df1.fillna(0)
            time = [str(i) for i in time]
            count = [int(i) for i in df1.values]
            if count:
                total_sum = sum(count)
                avrage_data = total_sum/len(count)*100
            else:
                total_sum = 0
                avrage_data = 0
            data.append({"all": {"average_rebuffering_buffer_length": list(count), "TimeStamp": list(time),  "total_sum": "{:.2f}".format(total_sum), "avrage_data": "{:.2f}".format(avrage_data) }})

        return data

    def average_startup_buffer(self, from_time,to_time,aggregation_window,platform,location,source):
        query='SELECT startup_buffer_length,last_report_time,platform FROM dsm where mitigation_status=\'FIXED\' {}'.format("and location in {}".format(str(tuple(location)) if len(location)>1 else "(\'"+location[0]+"\')") if len(location)>0 else "") +" and last_report_time>=\'{}\'".format(from_time)+"" +" and last_report_time<=\'{}\'".format(to_time)+""
        if len(source) > 0:
            source = tuple(source) if len(source) > 1 else f"('{source[0]}')"
            query += f" and source in {source}"
        # resp= self.dynamodb_obj.execute_query(query=query)
        resp = self.sqlite_obj.execute_query(query)
        # df=self.decode(resp)
        df=self.decode_v2(resp)
        if len(df)==0:
            return []
        if len(platform)>0:
            df1=df.groupby([df["platform"],df["last_report_time"]]).startup_buffer_length.mean().groupby([pd.Grouper(level="platform"),pd.Grouper(level='last_report_time', freq=aggregation_window,label="left",origin="start_day")]).mean()
            # from_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(from_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            # to_time=pd.to_datetime(datetime.strptime(str(datetime.fromtimestamp(int(to_time))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds'))
            dates = self.get_dates_from_aggrigation_window(aggregation_window, from_time, to_time)
            data=[]
            for i in set(df1.index.get_level_values(0)):
                if i.lower() in list(map(lambda x: x.lower(),platform)):
                    time_full_array=[pd.Timestamp(x) for x in df1[df1.index.get_level_values(0)==i].index.get_level_values(1).values]
                    count_full_array=df1[df1.index.get_level_values(0)==i].values
                    mapping=dict(zip(time_full_array,count_full_array))
                    time, count = self.get_time_and_count(dates, mapping)
                    group_by_interval=pd.DataFrame(list(zip(count, time)),columns=["counts","time"])
                    group_by_interval["time"]=pd.to_datetime(group_by_interval["time"])
                    group_by_interval=group_by_interval.resample(aggregation_window, on='time').counts.mean()
                    data.append({i.lower():{"average_startup_buffer_length":[int(x) for x in list(group_by_interval.values)],"TimeStamp":[str(i) for i in list(group_by_interval.index.values)]}})
        else:
            df1 = df.groupby([df["last_report_time"]]).startup_buffer_length.mean().groupby([pd.Grouper(level='last_report_time', freq=aggregation_window, label="right", origin="start_day")]).mean()
            data = []
            time = df1.index.get_level_values(0).values
            time = [str(i) for i in time]
            df1.fillna('', inplace=True)
            count = [int(i)  for i in df1.values if i]
            if count:
                total_sum = sum(count)
                avrage_data = total_sum/len(count)*100
            else:
                total_sum = 0
                avrage_data = 0
            data.append({"all": {"average_startup_buffer_length": list(count), "TimeStamp": list(time), "total_sum": "{:.2f}".format(total_sum), "avrage_data": "{:.2f}".format(avrage_data) }})
        return data

