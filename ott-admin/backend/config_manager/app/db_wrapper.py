import boto3
from config import settings, logger


class AwsDynamodb(object):

    def __init__(self):
        try:
            self.client = boto3.resource('dynamodb', region_name=settings.AWS_REGION_NAME,
                                              aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                              aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception("Error: Connection not established {}".format(error))
        else:
            logger.info("Connection established")

    def push_data(self, data, table):
            table = self.client.Table(table)
            table.put_item(Item = data)

class AwsEvent(object):
    def __init__(self):
        try:
            self.client = boto3.client('events', region_name=settings.AWS_REGION_NAME,
                                           aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                                           aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY)
        except Exception as error:
            logger.exception(f"Error: Connection not established {str(error)}")
        else:
            logger.info("Connection established")

    def enable_event_rule(self, name="", event_bus_name="default"):
        response = self.client.enable_rule(Name=name, EventBusName=event_bus_name)
        return response

    def disable_event_rule(self, name="", event_bus_name="default"):
        response = self.client.disable_rule(Name=name, EventBusName=event_bus_name)
        return response


async def enable_and_disable_lambda(body):
    try:
        event_client = AwsEvent()
        local_intelligence = body.get("local_intelligence", "")
        if local_intelligence == "ON":
            response = event_client.enable_event_rule(name="localintelligencetrigger")
        elif local_intelligence == "OFF":
            response = event_client.disable_event_rule(name="localintelligencetrigger")
        else:
            logger.exception(f"local_intelligence key not found in body: {body}")
    except Exception as e:
        logger.exception(f"Exception : {str(e)}")