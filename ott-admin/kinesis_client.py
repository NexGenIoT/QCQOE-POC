import boto3

# Initialize a Kinesis client with credentials
session = boto3.Session(
    aws_access_key_id='',
    aws_secret_access_key='',
    region_name='ap-south-1'
)
kinesis = session.client('kinesis')


print('KINESIS_OBJECT ->',kinesis)

# Get a list of stream names
streams = kinesis.list_streams()
stream_names = streams['StreamNames']
print(stream_names)

# Choose the first stream (you may modify this based on your use case)
if stream_names:
    stream_name = stream_names[1]
else:
    print("No streams found.")
    exit()
print('STREAM_NAME ->',stream_name)
# Get all shard iterators for the Kinesis stream
shard_iterators = {}
for shard in kinesis.describe_stream(StreamName=stream_name)['StreamDescription']['Shards']:
    shard_iterator = kinesis.get_shard_iterator(
        StreamName=stream_name,
        ShardId=shard['ShardId'],
        ShardIteratorType='LATEST'
    )['ShardIterator']
    shard_iterators[shard['ShardId']] = shard_iterator

print('SHARD_ITERATORS->',shard_iterators)
# Continuously get records from all shards of the stream
while True:
    for shard_id, shard_iterator in shard_iterators.items():
        records_response = kinesis.get_records(
            ShardIterator=shard_iterator,
            Limit=100  # Maximum number of records to retrieve in one call
        )
        records = records_response['Records']
        print('RECORDS->',records)
        for record in records:
            # Process each record
            print(record['Data'].decode('utf-8'))

        # Update the shard iterator for the next batch of records
        shard_iterators[shard_id] = records_response['NextShardIterator']
    # break 
