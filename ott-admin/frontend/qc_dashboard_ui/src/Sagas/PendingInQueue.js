import { all, fork, takeEvery } from 'redux-saga/effects';
import axios from 'axios';
import exportFromJSON from 'export-from-json';
import moment from 'moment';
import { setPendingInQueueTableData, startLoading, stopLoading, setAssetDetailsOfPendingInQueuePage, setAssetQCDetails, getStatusPendingInQueueTableData, setStatusPendingInQueueTableData } from 'Store/Actions'
import {
    GET_PENDING_IN_QUEUE_TABLE_DATA,
    GET_PENDING_IN_QUEUE_TABLE_DOWNLOADED_DATA,
    GET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE,
    SEND_NOTIFICATION,
    GET_ASSET_QC_DETAILS
} from 'Store/Actions/types';
import { NotificationManager } from 'react-notifications';

export function* getPendingInQueueTableData() {
    yield takeEvery(GET_PENDING_IN_QUEUE_TABLE_DATA, getPendingInQueueTableDataDashboard);
}

export function* getPendingInQueueTableDownloadedData() {
    yield takeEvery(GET_PENDING_IN_QUEUE_TABLE_DOWNLOADED_DATA, getPendingInQueueTableDownloadedDataDashboard);
}

export function* getAssetDetailsOfPendingInQueuePage() {
    yield takeEvery(GET_ASSET_DETAILS_OF_PENDING_IN_QUEUE_PAGE, getAssetDetailsOfPendingInQueuePageDashboard);
}

export function* getAssetQCDetails() {
    yield takeEvery(GET_ASSET_QC_DETAILS, getAssetQCDetailsDashboard);
}

export function* sendNotification() {
    yield takeEvery(SEND_NOTIFICATION, sendNotificationDashboard);
}





async function getAssetQCDetailsDashboard({ payload }) {
    const { data } = payload;
    const { dispatch } = payload
    const url = `/api/assets/getAssetQCDetails?asset_id=${data}`
    try {
        const response = await axios.get(url);
        const { data } = response
        dispatch(setAssetQCDetails(data))
    }
    catch (error) {
        console.log(error)
    }
}

async function getAssetDetailsOfPendingInQueuePageDashboard({ payload }) {
    const { data } = payload;
    const { dispatch } = payload
    const url = `/api/assets-queue/detail?asset_id=${data}`
    try {
        const response = await axios.get(url);
        const { data } = response
        dispatch(setAssetDetailsOfPendingInQueuePage(data))
    }
    catch (error) {
        console.log(error)
    }
}

async function getPendingInQueueTableDataDashboard({ payload }) {
    const { title } = payload;
    const { dispatch } = payload;
    const { image } = payload;
    const { page } = payload;
    const { size } = payload;
    const { type } = payload;
    const { issue } = payload;
    const { status } = payload;
    const { assetid } = payload;
    let finalStatus;
    if (status) {
        finalStatus = status
    }
    else {
        finalStatus = ''
    }
    let url = ''
    if (image) {
        url = `/api/assets-queue/logs?frequency=${title}&partner=${image}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&page=${page}&size=${size}&assetId=`
    }
    else {
        url = `/api/assets-queue/logs?frequency=${title}&partner=${image}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&page=${page}&size=${size}&assetId=${assetid}`
    }
    try {
        dispatch(startLoading())
        const response = await axios.get(url);
        const { data } = response;
        dispatch(setPendingInQueueTableData(data))
        dispatch(stopLoading())
    }
    catch (error) {
        dispatch(stopLoading())
        console.log(error)
    }
}

async function getPendingInQueueTableDownloadedDataDashboard({ payload }) {
    const { title } = payload;
    const { dispatch } = payload;
    const { image } = payload;
    const { page } = payload;
    const { size } = payload;
    const { type } = payload;
    const { issue } = payload;
    const { status } = payload;
    const { assetid } = payload;
    let finalStatus;
    if (status) {
        finalStatus = status
    }
    else {
        finalStatus = ''
    }
    let url = ''
    if (image) {
        url = `/api/assets-queue/download/logs?frequency=${title}&partner=${image}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&page=${page}&size=${size}&assetId=${assetid}`
    }
    else {
        url = `/api/assets-queue/download/logs?frequency=${title}&partner=${image}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&page=${page}&size=${size}&assetId=${assetid}`
    }
    try {
        dispatch(startLoading())
        const response = await axios.get(url);
        const downloadedData = response.data.data
        let data = downloadedData
        let myWindow = window.open('', '_blank')
        // for (var i = 0; i < downloadedData.length; i++) {
        //     data.push({
        //         'Asset ID': downloadedData[i].assetsId,
        //         'Content Partner': downloadedData[i].contentPartner,
        //         'Content Type': downloadedData[i].contentType,
        //         'Title': downloadedData[i].contentName,
        //         'Issue Type': downloadedData[i].issueType,
        //         'Date/Time': convertDateTime(downloadedData[i].date),
        //         'Task Status': downloadedData[i].taskStatus,
        //       })
        // }
        const fileName = `${moment().format('DD-MM-YYYY')}-asset-info`
        const exportType = exportFromJSON.types.csv
        exportFromJSON({
            data,
            fileName,
            exportType,
            withBOM: true
        })
        dispatch(stopLoading())
        myWindow.close()
    }
    catch (error) {
        dispatch(stopLoading())
        console.log(error)
    }
}

async function sendNotificationDashboard({ payload }) {
    const url = `api/assets/notification?asset_id=${payload}`
    try {
        const response = await axios.get(url);
        if (response.data) {
            NotificationManager.success('Success Notification', '', 2000);
        }
    }
    catch (error) {
        NotificationManager.error('Network Error');
        console.log(error)
    }
}


export default function* rootSaga() {
    yield all([
        fork(getPendingInQueueTableData),
        fork(getPendingInQueueTableDownloadedData),
        fork(getAssetDetailsOfPendingInQueuePage),
        fork(sendNotification),
        fork(getAssetQCDetails)
    ]);
}

