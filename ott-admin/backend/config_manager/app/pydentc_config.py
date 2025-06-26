from enum import Enum


class Services(str, Enum):
    qoe_analytics_api = "qoe_analytics_api"
    qoe_kinesis_producer = "qoe_kinesis_producer"
    qoe_dsm_store = "qoe_dsm_store"
    qoe_dashboard = "qoe_dashboard"
    qoe_location_service = "qoe_location_service"
    qoe_player_registration = "qoe_player_registration"
    qoe_open_search_producer = "qoe_open_search_producer"
    qoe_config_manager = "qoe_config_manager"
    mitigation_probe_config_data = "mitigation_probe_config_data"
    global_config = "global_config"
    qoe_outage_banner = "qoe_outage_banner"

