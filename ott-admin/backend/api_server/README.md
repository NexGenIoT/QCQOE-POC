# Dashboard Microservices 

## `Current Endpoint  Usage/Status` 


|Service Name| dashboard_microservice.py  | main_v2.py    |
|---| ---------------------------| ------------- |
|Running on | `http://3.108.121.176:5002 `             | `http://3.108.121.176:5001`  |
|`Endpoints Being Used By Dashboards`| /api/percentage_change, /api/aggregated_data_for_24hrs               | /api/metrics ,/api/unique_filters ,/api/thresholds |



## Files Details

- dashboard_microservice.py   
    - Serving On Port: 5002

            - /api/metrics
            - /api/unique_filters
            - /api/aggregated_data_for_24hrs
            - /api/percentage_change
            - /api/thresholds

- main_v2.py   
    - Serving On Port: 5001

            - /api/metrics
            - /api/unique_filters
            - /api/aggregated_data_for_24hrs
            - /api/percentage_change
            - /api/thresholds
- json_queryv1.py
    - generate_query_for_groupby1
        - Used for quering graph's X,Y with Filters from opesearch
    - generate_query_for_groupby_percentage_change
        - Used for Dashboard's Percentage Change accross different time aggregation level
    - generate_query_for_groupby
        - Used for quering Experience Insight & Analysis screen on dashboard
- opensearch_connector.py
    - opensearch_client
        - Used for connecting to opensearch cluster
- meta_data_for_frontend.py


    
    