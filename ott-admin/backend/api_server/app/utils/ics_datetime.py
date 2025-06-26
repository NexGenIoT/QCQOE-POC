from datetime import datetime


def get_datetime_in_format(ip_datetime:str, timespec=False):
    try:
        if timespec:
            op_datetime = datetime.strptime(str(datetime.fromtimestamp(int(ip_datetime))), '%Y-%m-%d %H:%M:%S').isoformat(timespec='microseconds')
        else:
            op_datetime = datetime.strptime(str(datetime.fromtimestamp(int(ip_datetime))), '%Y-%m-%d %H:%M:%S')
    except Exception as e:
        # need to add logger.exception(f"Exception in ics_datetime->get_datetime_in_format {str(e)}")
        op_datetime = ""
    return op_datetime