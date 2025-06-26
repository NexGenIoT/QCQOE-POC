/**
 * CRM Reducer
 */
//action types
import { convertDateTime } from 'Constants/constant';
import {
    SET_PENDING_IN_QUEUE_TABLE_DATA,
    SET_ASSET_QC_DETAILS,
    START_LOADER,
    STOP_LOADER,
    SET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE,
} from '../Actions/types';

const INITIAL_STATE = {
    logTableData: [],
    isLoading: false,
    logAssetData: {},
    totalItems: 0,
    qcAnalyticData: {}

}

let pendingInQueueReducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SET_PENDING_IN_QUEUE_TABLE_DATA:
            let pendingInQueueTableData = action.payload.data;
            let data = [];
            pendingInQueueTableData.length > 0 && pendingInQueueTableData.map(d => {
                return data.push({
                    id: d.assetsId,
                    contentPartner: d.contentPartner,
                    contentType: d.contentType,
                    title: d.contentName,
                    issueType: d.issueType,
                    date: convertDateTime(d.date),
                    task: d.taskStatus,
                    url: d.url,
                    dateTimeStamp: d.date
                })
            })
            let totalItems = action.payload.totalItems;
            return {
                ...state,
                logTableData: data,
                totalItems: totalItems,
                isLoading: true
            }
        case SET_ASSET_QC_DETAILS:
            let qcAnalyticData = action.payload;
            return {
                ...state,
                qcAnalyticData: qcAnalyticData
            }
        case SET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE:
            let logAssetData = action.payload;
            return {
                ...state,
                logAssetData: logAssetData
            }
        case START_LOADER:
            return {
                ...state,
                isLoading: true,
            }
        case STOP_LOADER:
            return {
                ...state,
                isLoading: false,
            }
        // default case	
        default:
            return { ...state }
    }
}

export default pendingInQueueReducer;