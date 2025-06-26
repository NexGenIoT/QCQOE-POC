
import {
    GET_LOG_DETAILS_TABLE_DATA,
    SET_LOG_DETAILS_TABLE_DATA,
    GET_ASSET_DETAILS_OF_LOG_PAGE,
    SET_ASSET_DETAIL_OF_LOG,
    START_LOADER,
    STOP_LOADER,
    SEND_NOTIFICATION,
    GET_ASSET_QC_DETAILS,
    SET_ASSET_QC_DETAILS,
    GET_LOG_DETAILS_TABLE_DOWNLOADED_DATA,
    STATUS_DATA,
    GET_RESOURCE_MANAGEMENT_DATA,
    SET_RESOURCE_MANAGEMENT_DATA,
    GET_SEARCH_RESOURCE_MANAGEMENT_DATA,
    GET_UPDATE_RESOURCE_MANAGEMENT_DATA,
    SET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER,
    GET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER,
    SET_QC_DEEPLINK_TOKEN,
    GET_QC_DEEPLINK_TOKEN,
    GET_CONTENT_CATALOGUE_DATA,
    SET_CONTENT_CATALOGUE_DATA,
    SET_NGESTION_LOG_DATA,
    GET_INGESTION_LOG_DATA,
    GET_QCDETAILED_DATA,
    SET_QCDETAILED_DATA
} from 'Store/Actions/types';
 
export const getLogDetailTableData = (image, title, page, size, issue, type, status,assetid,iosAutoStatus,webAuotStatus,AndroidStatus ,dispatch) => ({
    type: GET_LOG_DETAILS_TABLE_DATA,
    payload: {image, title, page, size, issue, type, status,assetid,iosAutoStatus,webAuotStatus,AndroidStatus , dispatch}
});

export const setLogDetailTableData = (data) => ({
    type: SET_LOG_DETAILS_TABLE_DATA,
    payload: data
})
//
export const getStatusLogDetailTableData = (data) => ({
     type: SET_LOG_DETAILS_TABLE_DATA,
     payload: data
 })

export const getLogDetailTableDownloadedData = (image, title, page, size, issue, type, status,assetid,iosAutoStatus,webAuotStatus,AndroidStatus , dispatch) => ({
    type: GET_LOG_DETAILS_TABLE_DOWNLOADED_DATA,
    payload: {image, title, page, size, issue, type, status, assetid,iosAutoStatus,webAuotStatus,AndroidStatus ,dispatch}
});

export const getAssetDetailsOfLogPage = (data, dispatch) => ({
    type: GET_ASSET_DETAILS_OF_LOG_PAGE,
    payload: {data, dispatch}
})

export const getAssetQCDetails = (data, dispatch) => ({
    type: GET_ASSET_QC_DETAILS,
    payload: {data, dispatch}
})

export const startLoading = () => ({
    type: START_LOADER,
})

export const stopLoading = () => ({
    type: STOP_LOADER,
})

export const setAssetDetailsOfLogPage = (data) => ({
    type: SET_ASSET_DETAIL_OF_LOG,
    payload: data
})

export const setAssetQCDetails = (data) => ({
    type: SET_ASSET_QC_DETAILS,
    payload: data
})

export const sendNotification = (id) => ({
    type: SEND_NOTIFICATION,
    payload: id
})

export const getResourceManagementData = (pagenumber,pagesize, dispatch) => ({
    type: GET_RESOURCE_MANAGEMENT_DATA,
    payload: {pagenumber,pagesize, dispatch}
});
export const getSearchResourceManagementData = (pagenumber,pagesize, dispatch) => ({
    type: GET_SEARCH_RESOURCE_MANAGEMENT_DATA,
    payload: {pagenumber,pagesize, dispatch}
});

export const setResourceManagementData= (data) => ({
    type: SET_RESOURCE_MANAGEMENT_DATA,
    payload: data
})
export const getResourceManagementDataForFilter = (pagenumber,pagesize, dispatch) => ({
    type: GET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER,
    payload: {pagenumber,pagesize, dispatch}
});
export const setResourceManagementDataForFilter= (data) => ({
    type: SET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER,
    payload: data
})

export const getUpdateResourceManagementData = (headerpayload,message, dispatch) => ({
    type: GET_UPDATE_RESOURCE_MANAGEMENT_DATA,
    payload: {headerpayload,message,dispatch}
});

export const setDeepLinkTokenData = (data) => ({
    type: SET_QC_DEEPLINK_TOKEN,
    payload: data
})
export const getDeepLinkTokenData = (name,assetid,assetType,isTitleClick,dispatch) => ({
    type: GET_QC_DEEPLINK_TOKEN,
    payload: {name,assetid,assetType,isTitleClick,dispatch}
})


export const getContentCatalogueData = (partner,contenttype,dispatch) => ({
    type: GET_CONTENT_CATALOGUE_DATA,
    payload: {partner,contenttype, dispatch}
});
export const setContentCatalogueData = (data) => ({
    type: SET_CONTENT_CATALOGUE_DATA,
    payload: data
})

export const getIngestionLogData = (partner,contenttype,fromdate,todate,dispatch) => ({
    type: GET_INGESTION_LOG_DATA,
    payload: {partner,contenttype,fromdate,todate, dispatch}
});
export const setIngestionLogData = (data) => ({
    type: SET_NGESTION_LOG_DATA,
    payload: data
})

export const getQCDetailedData = (assetid,dispatch) => ({
    type: GET_QCDETAILED_DATA,
    payload: {assetid, dispatch}
});
export const setQCDetailedData = (data) => ({
    type: SET_QCDETAILED_DATA,
    payload: data
})



