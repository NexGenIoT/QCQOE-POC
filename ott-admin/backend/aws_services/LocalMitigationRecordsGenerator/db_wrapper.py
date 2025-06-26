import boto3
import awswrangler as wr
from config import *
class AwsS3(object):

    def __init__(self):
        try:
            self.resource = boto3.resource('s3')
            self.client = boto3.client('s3')
        except Exception as error:
            print_log(f"Error: Connection not established {error}")

    def put_s3_object(self,file_name,filepath,bucket):
        self.resource.meta.client.upload_file(filepath, bucket, file_name)
    
class AwsDynamodb(object):

    def __init__(self):
        try:
            self.client = boto3.client('dynamodb')
            self.resource = boto3.resource('dynamodb')
        except Exception as error:
            print_log("Error: Connection not established {}".format(error))


class AwsAthena(object):
    def __init__(self):
        try:
            self.session = boto3.Session()
        except Exception as error:
            print_log("Error: Connection not established {}".format(error))

    def get_data(self,database,sql):
        df = wr.athena.read_sql_query(sql=sql, database=database, ctas_approach=True,
                                    boto3_session=self.session)
        return df

