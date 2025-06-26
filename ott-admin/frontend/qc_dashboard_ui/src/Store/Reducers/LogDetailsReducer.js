/**
 * CRM Reducer
 */
//action types
import { convertDateTime } from "Constants/constant";
import {
  SET_LOG_DETAILS_TABLE_DATA,
  SET_ASSET_QC_DETAILS,
  START_LOADER,
  STOP_LOADER,
  SET_ASSET_DETAIL_OF_LOG,
  SET_RESOURCE_MANAGEMENT_DATA,
  SET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER,
  SET_QC_DEEPLINK_TOKEN,
  SET_CONTENT_CATALOGUE_DATA,
  SET_NGESTION_LOG_DATA,
  SET_QCDETAILED_DATA,
} from "../Actions/types";

const INITIAL_STATE = {
  logTableData: [],
  isLoading: false,
  logAssetData: {},
  totalItems: 0,
  qcAnalyticData: {},
};

let logDetailsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_LOG_DETAILS_TABLE_DATA:
      let logTableData = action.payload.data;
      let data = [];
      logTableData.length > 0 &&
        logTableData.map((d) => {
          return data.push({
            id: d.assetsId,
            contentPartner: d.contentPartner,
            contentType: d.contentType,
            title: d.contentName,
            issueType: d.issueType,
            date: convertDateTime(d.date),
            task: d.taskStatus,
            url: d.url,
            dateTimeStamp: d.date,
            qoe_web_url: d.qoe_web_url,
            qoeMobileUrl: d.qoeMobileUrl,
            wandroidStatus:
              d.androidAutomationStatus != null
                ? d.androidAutomationStatus
                : "",
            webStatus:
              d.webAutomationStatus != null ? d.webAutomationStatus : "",
            updatedDate: convertDateTime(d.updatedDate),
          });
        });
      let totalItems = action.payload.totalItems;
      return {
        ...state,
        logTableData: data,
        totalItems: totalItems,
        isLoading: true,
      };
    case SET_ASSET_QC_DETAILS:
      let qcAnalyticData = action.payload;
      return {
        ...state,
        qcAnalyticData: qcAnalyticData,
      };
    case SET_ASSET_DETAIL_OF_LOG:
      let logAssetData = action.payload;
      return {
        ...state,
        logAssetData: logAssetData,
      };
    case START_LOADER:
      return {
        ...state,
        isLoading: true,
      };
    case STOP_LOADER:
      return {
        ...state,
        isLoading: false,
      };
    case SET_RESOURCE_MANAGEMENT_DATA:
      let resource_manaement = action.payload;
      return {
        ...state,
        resource_manaement: resource_manaement,
      };
    case SET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER:
      let resource_manaement_for_filter = action.payload;
      return {
        ...state,
        resource_manaement_for_filter: resource_manaement_for_filter,
      };
    case SET_QC_DEEPLINK_TOKEN:
      let qc_deeplink_token = action.payload;

      return {
        ...state,
        qc_deeplink_token: qc_deeplink_token,
      };
    case SET_CONTENT_CATALOGUE_DATA:
      let content_catalogue = action.payload;
      return {
        ...state,
        content_catalogue: content_catalogue,
      };
    case SET_NGESTION_LOG_DATA:
      let Ingestion_log_data = action.payload;
      return {
        ...state,
        Ingestion_log_data: Ingestion_log_data,
      };

    case SET_QCDETAILED_DATA:
      let qcdetailed_data = action.payload;
      return {
        ...state,
        qcdetailed_data: qcdetailed_data,
      };

    // default case
    default:
      return { ...state };
  }
};

export default logDetailsReducer;
