from opensearchpy import OpenSearch
config={
        "host":"vpc-qoe-opensearch-vpbzmm44ds5kulnit2h3degj44.ap-south-1.es.amazonaws.com",
        "http_auth": ('root','dell#Hp$20'),
        "index_name":"qoe_metric_dev",
        "port":443
        }
config2={
        "host":"vpc-qoe-opensearch-vpbzmm44ds5kulnit2h3degj44.ap-south-1.es.amazonaws.com",
        "http_auth": ('root','dell#Hp$20'),
        "index_name":"qoe_dev_state_6",
        "port":443
        }
def opensearch_client(host,http_auth):
    '''
    Used to make connection to specified opensearch index
    '''
    client = OpenSearch(
        hosts = [{'host': host, 'port': config["port"]}],
        http_compress = True, # enables gzip compression for request bodies
        http_auth = http_auth,

        use_ssl = True,
        verify_certs = True,
        ssl_assert_hostname = False,
        ssl_show_warn = False,
    )
    return client
