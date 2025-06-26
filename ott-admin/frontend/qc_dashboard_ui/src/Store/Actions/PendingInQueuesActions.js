
import {
    GET_PENDING_IN_QUEUE_TABLE_DATA,
    SET_PENDING_IN_QUEUE_TABLE_DATA,
    GET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE,
    SET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE,
    START_LOADER,
    STOP_LOADER,
    SEND_NOTIFICATION,
    GET_ASSET_QC_DETAILS,
    SET_ASSET_QC_DETAILS,
    GET_PENDING_IN_QUEUE_TABLE_DOWNLOADED_DATA,
    SET_QC_DEEPLINK_TOKEN,
    GET_QC_DEEPLINK_TOKEN,
} from 'Store/Actions/types';
 
export const getPendingInQueueTableData = (image, title, page, size, issue, type, status,assetid, dispatch) => ({
    type: GET_PENDING_IN_QUEUE_TABLE_DATA,
    payload: {image, title, page, size, issue, type, status,assetid, dispatch}
});

export const setPendingInQueueTableData = (data) => ({
    type: SET_PENDING_IN_QUEUE_TABLE_DATA,
    payload: data
})
//

export const getStatusPendingInQueueTableData = (data) => ({
     type: SET_PENDING_IN_QUEUE_TABLE_DATA,
     payload: data
 })

export const getPendingInQueueTableDownloadedData = (image, title, page, size, issue, type, status,assetid, dispatch) => ({
    type: GET_PENDING_IN_QUEUE_TABLE_DOWNLOADED_DATA,
    payload: {image, title, page, size, issue, type, status, assetid,dispatch}
});

export const getAssetDetailsOfPendingInQueuePage = (data, dispatch) => ({
    type: GET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE,
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

export const setAssetDetailsOfPendingInQueuePage = (data) => ({
    type: SET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE,
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



