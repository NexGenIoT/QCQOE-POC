import { all, fork, takeEvery } from "redux-saga/effects";
import axios from "axios";
import exportFromJSON from "export-from-json";
import moment from "moment";
import {
  setLogDetailTableData,
  startLoading,
  stopLoading,
  setAssetDetailsOfLogPage,
  setAssetQCDetails,
  getStatusLogDetailTableData,
  setStatusLogDetailTableData,
  setResourceManagementData,
  setResourceManagementDataForFilter,
  setDeepLinkToken,
  setDeepLinkTokenData,
  setContentCatalogueData,
  setIngestionLogData,
  setQCDetailedData,
} from "Store/Actions";
import {
  GET_LOG_DETAILS_TABLE_DATA,
  GET_LOG_DETAILS_TABLE_DOWNLOADED_DATA,
  GET_ASSET_DETAILS_OF_LOG_PAGE,
  SEND_NOTIFICATION,
  GET_ASSET_QC_DETAILS,
  GET_RESOURCE_MANAGEMENT_DATA,
  GET_SEARCH_RESOURCE_MANAGEMENT_DATA,
  GET_UPDATE_RESOURCE_MANAGEMENT_DATA,
  GET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER,
  GET_QC_DEEPLINK_TOKEN,
  GET_CONTENT_CATALOGUE_DATA,
  GET_INGESTION_LOG_DATA,
  GET_QCDETAILED_DATA,
} from "Store/Actions/types";
import { NotificationManager } from "react-notifications";
import { DataObjectRounded } from "@mui/icons-material";
import { convertMilliToDate } from "Constants/constant";

export function* getLogDetailTableData() {
  yield takeEvery(GET_LOG_DETAILS_TABLE_DATA, getLogDetailTableDataDashboard);
}

export function* getLogDetailTableDownloadedData() {
  yield takeEvery(
    GET_LOG_DETAILS_TABLE_DOWNLOADED_DATA,
    getLogDetailTableDownloadedDataDashboard
  );
}

export function* getAssetDetailsOfLogPage() {
  yield takeEvery(
    GET_ASSET_DETAILS_OF_LOG_PAGE,
    getAssetDetailsOfLogPageDashboard
  );
}

export function* getAssetQCDetails() {
  yield takeEvery(GET_ASSET_QC_DETAILS, getAssetQCDetailsDashboard);
}

export function* sendNotification() {
  yield takeEvery(SEND_NOTIFICATION, sendNotificationDashboard);
}

export function* getResourceMngData() {
  yield takeEvery(GET_RESOURCE_MANAGEMENT_DATA, getResourceManagementDashboard);
}
export function* getResourceMngDataForFilter() {
  yield takeEvery(
    GET_RESOURCE_MANAGEMENT_DATA_FOR_FILTER,
    getResourceManagementDashboardForFilter
  );
}
export function* getSearchResourceMngData() {
  yield takeEvery(
    GET_SEARCH_RESOURCE_MANAGEMENT_DATA,
    getSearchResourceManagementDashboard
  );
}
export function* getUpdateResourceMngData() {
  yield takeEvery(
    GET_UPDATE_RESOURCE_MANAGEMENT_DATA,
    getUpdateResourceManagementDashboard
  );
}

export function* getDeepLinkLicenceToken() {
  yield takeEvery(GET_QC_DEEPLINK_TOKEN, getDeepLinkToken);
}

export function* getContentCatlogue() {
  yield takeEvery(GET_CONTENT_CATALOGUE_DATA, postContentCatalogue);
}

export function* getIngestionLogue() {
  yield takeEvery(GET_INGESTION_LOG_DATA, postIngestionLogData);
}

export function* getQCDetailed() {
  yield takeEvery(GET_QCDETAILED_DATA, getQCDetailedData);
}

const rsrcMng_BaseUrl = "https://qc7.qoeqoe.com:9000"; //--dev//https://qc8.qoeqoe.com:9000/--prod
const qcdetail_BaseUrl = "https://qc3.qoeqoe.com/"; //dev--https://qc3.qoeqoe.com

async function getAssetQCDetailsDashboard({ payload }) {
  const { data } = payload;
  const { dispatch } = payload;
  const url = `/api/assets/getAssetQCDetails?asset_id=${data}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setAssetQCDetails(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAssetDetailsOfLogPageDashboard({ payload }) {
  const { data } = payload;
  const { dispatch } = payload;
  const url = `/api/assets/getAssetDetail?asset_id=${data}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setAssetDetailsOfLogPage(data));
  } catch (error) {
    console.log(error);
  }
}

function isAlphaNumeric(value) {
  return (
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10))
  );
}

async function getLogDetailTableDataDashboard({ payload }) {
  const { title } = payload;
  const { dispatch } = payload;
  const { image } = payload;
  const { page } = payload;
  const { size } = payload;
  const { type } = payload;
  const { issue } = payload;
  const { status } = payload;
  const { assetid } = payload;
  const { iosAutoStatus } = payload;
  const { webAuotStatus } = payload;
  const { AndroidStatus } = payload;
  let finalStatus;
  let finaPage;
  if (status) {
    finalStatus = status;
  } else {
    finalStatus = "";
  }
  if (assetid != "") {
    finaPage = "";
  } else {
    finaPage = page;
  }
  let url = "";
  let obj = "";
  obj = {
    frequency: title,
    partners: image ? (image[0] == null ? [] : image) : [],
    contentTypes: type ? type : [],
    issueTypes: issue ? issue : [],
    statusTypes: finalStatus ? finalStatus : [],
    //"assetIdOrVodId":assetid,
  };
  if (!isAlphaNumeric(assetid)) {
    obj["assetId"] = assetid ? assetid : null;
  } else {
    obj["vodId"] = assetid ? parseInt(assetid) : null;
  }
  if (webAuotStatus != "") {
    obj["webAutomationStatus"] = webAuotStatus;
  }
  if (AndroidStatus != "") {
    obj["androidAutomationStatus"] = AndroidStatus;
  }

  // if (image) {

  url = `/api/assets/logs?page=${finaPage}&size=${size}`; //?frequency=${title}&partner=${image}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&page=${finaPage}&size=${size}&assetId=${assetid}`
  //  }
  // else {
  //     obj={
  //         "frequency":title,
  //         "partners":image,
  //         "contentTypes":type,
  //         "issueTypes":issue,
  //         "statusTypes":finalStatus,
  //         "page":finaPage,
  //         "size":size,
  //         "assetId":assetid
  //     }
  //     url = `/api/assets/logs`//?frequency=${title}&partner=${image}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&page=${finaPage}&size=${size}&assetId=${assetid}`
  // }
  try {
    dispatch(startLoading());
    const response = await axios.post(url, obj);
    const { data } = response;
    dispatch(setLogDetailTableData(data));
    dispatch(stopLoading());
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}

async function getLogDetailTableDownloadedDataDashboard({ payload }) {
  const { title } = payload;
  const { dispatch } = payload;
  const { image } = payload;
  const { page } = payload;
  const { size } = payload;
  const { type } = payload;
  const { issue } = payload;
  const { status } = payload;
  const { assetid } = payload;
  const { iosAutoStatus } = payload;
  const { webAuotStatus } = payload;
  const { AndroidStatus } = payload;
  let finalStatus;
  if (status) {
    finalStatus = status;
  } else {
    finalStatus = "";
  }
  let url = "";
  let obj = "";
  // if (image) {
  obj = {
    frequency: title,
    partners: image ? image : [],
    contentTypes: type ? type : [],
    issueTypes: issue ? issue : [],
    statusTypes: finalStatus ? finalStatus : [],
    // "assetIdOrVodId":assetid
  };
  console.log("isAlphaNumeric--", isAlphaNumeric(assetid));
  if (!isAlphaNumeric(assetid)) {
    obj["assetId"] = assetid ? assetid : null;
  } else {
    obj["vodId"] = assetid ? parseInt(assetid) : null;
  }
  if (webAuotStatus != "") {
    obj["webAutomationStatus"] = webAuotStatus;
  }
  if (AndroidStatus != "") {
    obj["androidAutomationStatus"] = AndroidStatus;
  }
  url = `/api/assets/download/logs?page=${page}&size=${size}`;
  // }
  // else {
  //     url = `/api/assets/download/logs?frequency=${title}&partner=${image}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&page=${page}&size=${size}&assetId=${assetid}`
  // }
  try {
    dispatch(startLoading());
    const response = await axios.post(url, obj);
    const downloadedData = response.data.data;
    let data = downloadedData;
    let myWindow = window.open("", "_blank");
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
    const fileName = `${moment().format("DD-MM-YYYY")}-asset-info`;
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({
      data,
      fileName,
      exportType,
      withBOM: true,
    });
    dispatch(stopLoading());
    myWindow.close();
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}

async function sendNotificationDashboard({ payload }) {
  const url = `api/assets/notification?asset_id=${payload}`;
  try {
    const response = await axios.get(url);
    if (response.data) {
      NotificationManager.success("Success Notification", "", 2000);
    }
  } catch (error) {
    NotificationManager.error("Network Error");
    console.log(error);
  }
}

async function getResourceManagementDashboard({ payload }) {
  const { dispatch } = payload;
  const { pagenumber } = payload;
  const { pagesize } = payload;
  //pagenumber,pagesize

  let url = `${rsrcMng_BaseUrl}/get_resources`; //?page_num=${pagenumber}&page_size=${pagesize}`
  try {
    dispatch(startLoading());
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setResourceManagementData(data));
    dispatch(setResourceManagementDataForFilter(data.data));
    dispatch(stopLoading());
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}

async function getResourceManagementDashboardForFilter({ payload }) {
  const { dispatch } = payload;
  const { pagenumber } = payload;
  const { pagesize } = payload;
  //pagenumber,pagesize

  let url = `${rsrcMng_BaseUrl}/get_resources`; //?page_num=${pagenumber}&page_size=${pagesize}`
  try {
    dispatch(startLoading());
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setResourceManagementDataForFilter(data.data));
    dispatch(stopLoading());
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}
async function getSearchResourceManagementDashboard({ payload }) {
  const { dispatch } = payload;
  const { pagesize } = payload;
  //pagenumber,pagesize
  let url = `${rsrcMng_BaseUrl}/get_resources?${pagesize}`;
  try {
    dispatch(startLoading());
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setResourceManagementData(data));
    dispatch(stopLoading());
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}
async function getUpdateResourceManagementDashboard({ payload }) {
  const { dispatch } = payload;
  // const { headerpayload } = headerpayload;
  //   const { message } = message;
  //pagenumber,pagesize
  console.log("abcd--", payload);
  let url = `${rsrcMng_BaseUrl}/update_resources?${payload.headerpayload}`;
  let obj = {
    message: payload.message,
  };
  try {
    dispatch(startLoading());
    const response = await axios.post(url, obj);
    const { data } = response;
    NotificationManager.success("Resource updated successfully");
    dispatch(stopLoading());
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}

async function postContentCatalogue({ payload }) {
  const { dispatch } = payload;
  const { partner } = payload;
  const { contenttype } = payload;
  let url = `/api/catalogue/chart`;
  //pagenumber,pagesize
  if (partner.length > 0 && contenttype.length <= 0) {
    let val = partner.toString().toUpperCase();
    url = `/api/catalogue/chart?partner=${val}`;
  } else if (partner.length <= 0 && contenttype.length > 0) {
    let val = contenttype.toString().toUpperCase();
    url = `/api/catalogue/chart?contentTypes=${val}`;
  } else if (partner.length > 0 && contenttype.length > 0) {
    let val = contenttype.toString().toUpperCase();
    let val2 = partner.toString().toUpperCase();
    url = `/api/catalogue/chart?contentTypes=${val}&partner=${val2}`;
  }

  //?page_num=${pagenumber}&page_size=${pagesize}`
  try {
    dispatch(startLoading());
    const response = await axios.get(url);
    const { data } = response;
    data.providerContentList.map((res, index) => {
      const sumOfCount = res.totalStatusList.reduce((sum, currentValue) => {
        return sum + currentValue.count;
      }, 0);
      data.providerContentList[index]["total"] = sumOfCount;
    });

    dispatch(
      setContentCatalogueData(
        data.providerContentList
          .sort(function (a, b) {
            if (a.total < b.total) {
              return 1;
            }
            if (a.total > b.total) {
              return -1;
            }
            return 0;
          })
          .filter((x) => x.total > 0)
      )
    );
    dispatch(stopLoading());
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}

async function postIngestionLogData({ payload }) {
  const { dispatch } = payload;
  const { partner } = payload;
  const { contenttype } = payload;
  const { fromdate } = payload;
  const { todate } = payload;
  //pagenumber,pagesize,,fromdate,todate,

  ///api/catalogue/ingestion/log?toDate=2023-06-07&fromDate=2023-05-07
  //   console.log("date--",convertMilliToDate(todate));

  let url = `/api/catalogue/ingestion/log?toDate=${convertMilliToDate(
    todate
  )}&fromDate=${convertMilliToDate(fromdate)}`; //&frequency=MONTHLY//?page_num=${pagenumber}&page_size=${pagesize}`
  if (partner.length > 0 && contenttype.length <= 0) {
    let val = partner.toString().toUpperCase();
    url = `/api/catalogue/ingestion/log?toDate=${convertMilliToDate(
      todate
    )}&fromDate=${convertMilliToDate(fromdate)}&partner=${val}`; //&frequency=MONTHLY
  } else if (partner.length <= 0 && contenttype.length > 0) {
    let val = contenttype.toString().toUpperCase();
    url = `/api/catalogue/ingestion/log?toDate=${convertMilliToDate(
      todate
    )}&fromDate=${convertMilliToDate(fromdate)}&contentTypes=${val}`; //&frequency=MONTHLY`
  } else if (partner.length > 0 && contenttype.length > 0) {
    let val = contenttype.toString().toUpperCase();
    let val2 = partner.toString().toUpperCase();
    url = `/api/catalogue/ingestion/log?toDate=${convertMilliToDate(
      todate
    )}&fromDate=${convertMilliToDate(
      fromdate
    )}&contentTypes=${val}&partner=${val2}`; //&frequency=MONTHLY`
  }
  try {
    dispatch(startLoading());
    const response = await axios.get(url);
    const { data } = response;
    data.providerContentList.map((res, index) => {
      // const sumOfCount = res.totalStatusList.reduce((sum, currentValue) => {
      //     return sum + currentValue.count;
      // }, 0);
      const sumOfCount = res.contentList.reduce((sum, currentValue) => {
        return sum + currentValue.count;
      }, 0);

      data.providerContentList[index]["total"] = sumOfCount;
    });
    dispatch(
      setIngestionLogData(
        data.providerContentList
          .sort(function (a, b) {
            if (a.total < b.total) {
              return 1;
            }
            if (a.total > b.total) {
              return -1;
            }
            return 0;
          })
          .filter((x) => x.total > 0)
      )
    );
    dispatch(stopLoading());
  } catch (error) {
    dispatch(stopLoading());
    console.log(error);
  }
}

async function getDeepLinkToken({ payload }) {
  const { name } = payload;
  const { assetid } = payload;
  const { assetType } = payload;
  const { isTitleClick } = payload;
  const { dispatch } = payload;

  console.log("isTitleClick--", isTitleClick);
  let url = "";
  if (name == "REELDRAMA" || name == "KOODE") {
    url = `${rsrcMng_BaseUrl}/licence_token_gen?partner_name=${name}`;
  } else if (name == "MANORAMAMAX") {
    url = `${rsrcMng_BaseUrl}/licence_token_gen?partner_name=${name}&asset_id=${assetid}`;
  } else if (name == "CHAUPAL") {
    url = `${rsrcMng_BaseUrl}/licence_token_gen?partner_name=${name}&asset_id=${assetid}&asset_type=${assetType}`;
  }

  try {
    const response = await axios.post(url);
    const { data } = response;
    dispatch(setDeepLinkTokenData(data));
    if (isTitleClick) {
      window.open(data.url, "_blank");
    }
  } catch (error) {
    console.log(error);
  }
}

async function getQCDetailedData({ payload }) {
  const { assetid } = payload;
  const { dispatch } = payload;
  console.log("getQCDetailedData-1-", assetid);
  let url = `${qcdetail_BaseUrl}get_detail_qc_result?asset_id=${assetid}`;
  //let url = `${qcdetail_BaseUrl}get_detail_qc_result?asset_id=SHEMAROOME/5e591857ed8f7d6b83000039010044`
  try {
    const response = await axios.get(url);
    const { data } = response;
    console.log("getQCDetailedData-2-", data);

    dispatch(setQCDetailedData(data));
  } catch (error) {
    console.log(error);
  }
}

export default function* rootSaga() {
  yield all([
    fork(getLogDetailTableData),
    fork(getLogDetailTableDownloadedData),
    fork(getAssetDetailsOfLogPage),
    fork(sendNotification),
    fork(getAssetQCDetails),
    fork(getResourceMngData),
    fork(getSearchResourceMngData),
    fork(getUpdateResourceMngData),
    fork(getResourceMngDataForFilter),
    fork(getDeepLinkLicenceToken),
    fork(getContentCatlogue),
    fork(getIngestionLogue),
    fork(getQCDetailed),
  ]);
}
