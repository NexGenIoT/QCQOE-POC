/**
 * Chat App Actions
 */
import {
   ADD_NEW_CLIENT,
   DELETE_CLIENT,
   UPDATE_CLIENT,
   GET_ASSET_DETAILS,
   SET_TAB_VALUE,
   STORE_ASSET_DATA,
   GET_PARTNER_DETAILS,
   STORE_PARTNER_DATA,
   GET_ISSUE_TYPE_DETAILS,
   SET_ISSUE_TYPE_DETAILS,
   GET_STATUS_TYPE_DETAILS,
   SET_STATUS_TYPE_DETAILS,
   GET_IMAGE_ASSET_INFO,
   STORE_IMAGE_ASSET_INFO,
   GET_ASSET_OVERVIEW_GRAPH,
   STORE_ASSET_OVERVIEW_GRAPH,
   GET_RPI_OVERVIEW_GRAPH,
   STORE_RPI_OVERVIEW_GRAPH,
   GET_CONTENT_TYPES,
   SET_CONTENT_TYPES,
   START_LOADER_CRM,
   STOP_LOADER_CRM,
   GET_CONNECTED_GRAPH_DATA,
   SET_CONNECTED_GRAPH_DATA,
   CLEAR_CONNECTED_GRAPH_DATA,
   STORE_ISSUE_TYPE_GRAPH,
   GET_ISSUE_TYPE_GRAPH,
   STORE_PARTNER_GRAPH,
   GET_PARTNER_GRAPH,
   GET_ANALYSIS_COUNTS_POST,
   SET_ANALYSIS_COUNTS_POST,
   GET_PENDING_IN_QUEUE_GRAPH_DATA,
   SET_PENDING_IN_QUEUE_GRAPH_DATA,
   CLEAR_PENDING_IN_QUEUE_GRAPH_DATA
} from 'Store/Actions/types';

export const addNewClient = (data) => ({
   type: ADD_NEW_CLIENT,
   payload: data
});

export const deleteClient = (data) => ({
   type: DELETE_CLIENT,
   payload: data
});

export const onUpdateClient = (data, ID) => ({
   type: UPDATE_CLIENT,
   payload: { data, ID }
})

export const getAssetDetails = (dispatch) => ({
   type: GET_ASSET_DETAILS,
   payload: dispatch
});

export const setTabValue = (dispatch) => ({
   type: SET_TAB_VALUE,
   payload: dispatch
})

export const storeAssetData = (data) => ({
   type: STORE_ASSET_DATA,
   payload: data
})

export const getPartnerDetails = (dispatch) => ({
   type: GET_PARTNER_DETAILS,
   payload: dispatch
});

export const storePartnerData = (data) => ({
   type: STORE_PARTNER_DATA,
   payload: data
})

export const getIssueTypesDetails = (dispatch) => ({
   type: GET_ISSUE_TYPE_DETAILS,
   payload: dispatch
});

export const storeIssueType = (data) => ({
   type: SET_ISSUE_TYPE_DETAILS,
   payload: data
})

export const getStatusTypesDetails = (dispatch) => ({
   type: GET_STATUS_TYPE_DETAILS,
   payload: dispatch
});

export const setStatusTypesDetails = (data) => ({
   type: SET_STATUS_TYPE_DETAILS,
   payload: data
})

export const getImageAssetInfo = (name, time, dispatch) => ({
   type: GET_IMAGE_ASSET_INFO,
   payload: { name, time, dispatch }
})

export const storeImageAssetInfo = (data, name) => ({
   type: STORE_IMAGE_ASSET_INFO,
   payload: { data, name }
})

export const getConnectedGraphData = (name, time, issue, type, status,asset_id,iosAutoStatus,webAuotStatus,AndroidStatus ,dispatch) => ({
   type: GET_CONNECTED_GRAPH_DATA,
   payload: { name, time, issue, type, status,asset_id,iosAutoStatus,webAuotStatus,AndroidStatus ,dispatch }
})

export const setConnectedGraphData = (data) => ({
   type: SET_CONNECTED_GRAPH_DATA,
   payload: { data }
})

export const clearConnectedData = () => ({
   type: CLEAR_CONNECTED_GRAPH_DATA,
})

export const getAssetOverview = (title, dispatch) => ({
   type: GET_ASSET_OVERVIEW_GRAPH,
   payload: {title, dispatch}
});

export const setAssetOverview = (data) => ({
   type: STORE_ASSET_OVERVIEW_GRAPH,
   payload: data
})
//amit
export const getIssueType = (title,issueType,partners,contentTypes, dispatch) => ({
   type: GET_ISSUE_TYPE_GRAPH,
   payload: {title,issueType,partners,contentTypes,dispatch}
});

export const setIssueType = (data) => ({
   type: STORE_ISSUE_TYPE_GRAPH,
   payload: data
})

export const getPartner = (frequency,partner,contentType, dispatch) => ({
   type: GET_PARTNER_GRAPH,
   payload: {frequency,partner,contentType, dispatch}
});

export const setPartner = (data) => ({
   type: STORE_PARTNER_GRAPH,
   payload: data
})


export const getRPIOverview = (title, dispatch) => ({
   type: GET_RPI_OVERVIEW_GRAPH,
   payload: {title, dispatch}
});

export const setRPIOverview = (data) => ({
   type: STORE_RPI_OVERVIEW_GRAPH,
   payload: data
})

export const getContentTypes = (dispatch) => ({
   type: GET_CONTENT_TYPES,
   payload: dispatch
})

export const setContentTypes = (data) => ({
   type: SET_CONTENT_TYPES,
   payload: data
})

export const startLoadingCrm = () => ({
   type: START_LOADER_CRM,
})

export const stopLoadingCrm = () => ({
   type: STOP_LOADER_CRM,
})

// export const getAnalysisCounts = (dispatch) => ({
//    type: GET_ANALYSIS_COUNTS_POST,
//    payload: {dispatch}
// });

// export const setAnalysisCounts = (data) => ({
//    type: SET_ANALYSIS_COUNTS_POST,
//    payload: data
// });

export const getPendingInQueueGraphData = (name, time, issue, type, status, dispatch) => ({
   type: GET_PENDING_IN_QUEUE_GRAPH_DATA,
   payload: { name, time, issue, type, status, dispatch }
})

export const setPendingInQueueGraphData = (data) => ({
   type: SET_PENDING_IN_QUEUE_GRAPH_DATA,
   payload: { data }
})

export const clearPendingInQueueData = () => ({
   type: CLEAR_PENDING_IN_QUEUE_GRAPH_DATA,
})