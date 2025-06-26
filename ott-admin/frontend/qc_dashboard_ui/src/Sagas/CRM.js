import { all, fork, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  storeAssetData,
  storeImageAssetInfo,
  storePartnerData,
  setAssetOverview,
  setIssueType,
  setRPIOverview,
  setContentTypes,
  storeIssueType,
  setStatusTypesDetails,
  stopLoadingCrm,
  startLoadingCrm,
  setConnectedGraphData,
  setPartner,
  setPendingInQueueGraphData,
} from "Store/Actions";
import {
  GET_ASSET_DETAILS,
  GET_PARTNER_DETAILS,
  GET_ISSUE_TYPE_DETAILS,
  GET_STATUS_TYPE_DETAILS,
  GET_IMAGE_ASSET_INFO,
  GET_ASSET_OVERVIEW_GRAPH,
  GET_ISSUE_TYPE_GRAPH,
  GET_PARTNER_GRAPH,
  GET_RPI_OVERVIEW_GRAPH,
  GET_CONTENT_TYPES,
  GET_CONNECTED_GRAPH_DATA,
  // GET_ANALYSIS_COUNTS_POST,
  GET_PENDING_IN_QUEUE_GRAPH_DATA,
} from "Store/Actions/types";
import { is } from "@amcharts/amcharts4/core";

/**
 * Get Asset Details On Dashboard
 */
export function* getAssetDetails() {
  yield takeEvery(GET_ASSET_DETAILS, getAssetDetailsDashboard);
}

export function* getPartnerDetails() {
  yield takeEvery(GET_PARTNER_DETAILS, getPartnerDetailsDashboard);
}

export function* getIssueTypesDetails() {
  yield takeEvery(GET_ISSUE_TYPE_DETAILS, getIssueTypesDetailsDashboard);
}

export function* getStatusTypesDetails() {
  yield takeEvery(GET_STATUS_TYPE_DETAILS, getStatusTypesDetailsDashboard);
}

export function* getImageAssetInfo() {
  yield takeEvery(GET_IMAGE_ASSET_INFO, getImageAssetInfoDashboard);
}

export function* getConnectedGraphData() {
  yield takeEvery(GET_CONNECTED_GRAPH_DATA, getConnectedGraphDataDashboard);
}

export function* getAssetOverview() {
  yield takeEvery(GET_ASSET_OVERVIEW_GRAPH, getAssetOverviewDashboard);
}
//amit
export function* getIssueType() {
  yield takeEvery(GET_ISSUE_TYPE_GRAPH, getIssueTypeDashboard);
}
export function* getPartner() {
  yield takeEvery(GET_PARTNER_GRAPH, getPartnerDashboard);
}
export function* getRPIOverview() {
  yield takeEvery(GET_RPI_OVERVIEW_GRAPH, getRPIOverviewDashboard);
}

export function* getContentTypes() {
  yield takeEvery(GET_CONTENT_TYPES, getContentTypesDashboard);
}

// export function* getAnalysisCounts(){
//     yield takeEvery(GET_ANALYSIS_COUNTS_POST, getAnalysisCountsData)
// }

export function* getPendingInQueueGraphData() {
  yield takeEvery(
    GET_PENDING_IN_QUEUE_GRAPH_DATA,
    getPendingInQueueGraphDataDashboard
  );
}

let AnalysisCountsBaseUrl = "https://qc7.qoeqoe.com:5000"; //"https://beacon.qoetech.com:5000" //--temparory

async function getAssetDetailsDashboard({ payload }) {
  const dispatch = payload;
  const url = "/api/assets/getCummulativeCount";
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(storeAssetData(data));
  } catch (error) {
    console.log(error);
  }
}

async function getPartnerDetailsDashboard({ payload }) {
  const dispatch = payload;
  const url = "/api/partners";
  try {
    const response = await axios.get(url);
    const { data } = response;

    data.sort(function (a, b) {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
    dispatch(storePartnerData(data));
  } catch (error) {
    console.log(error);
  }
}

async function getIssueTypesDetailsDashboard({ payload }) {
  const dispatch = payload;
  const url = "/api/issueTypes";
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(storeIssueType(data));
  } catch (error) {
    console.log(error);
  }
}

async function getStatusTypesDetailsDashboard({ payload }) {
  const dispatch = payload;
  const url = "/api/statusTypes";
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setStatusTypesDetails(data));
  } catch (error) {
    console.log(error);
  }
}

async function getImageAssetInfoDashboard({ payload }) {
  const { name } = payload;
  const { dispatch } = payload;
  const { time } = payload;
  dispatch(startLoadingCrm());
  const url = `/api/assets/partner/assets-summary/?frequency=${time}&partner=${
    name ? name : ""
  }`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(storeImageAssetInfo(data, name ? name : ""));
    dispatch(stopLoadingCrm());
  } catch (error) {
    dispatch(stopLoadingCrm());
    console.log(error);
  }
}

function isAlphaNumeric(value) {
  let status =
    !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
  return status;
}

async function getConnectedGraphDataDashboard({ payload }) {
  const { dispatch } = payload;
  const { name } = payload;
  const { time } = payload;
  const { issue } = payload;
  const { type } = payload;
  const { status } = payload;
  const { asset_id } = payload;
  const { iosAutoStatus } = payload;
  const { webAuotStatus } = payload;
  const { AndroidStatus } = payload;

  let finalStatus;
  if (status) {
    finalStatus = status;
  } else {
    finalStatus = "";
  }
  dispatch(startLoadingCrm());
  let obj = {
    frequency: time,
    partners: name ? (name[0] == null ? [] : name) : [],
    contentTypes: type ? type : [],
    issueTypes: issue ? issue : [],
    statusTypes: finalStatus ? finalStatus : [],
    // "assetIdOrVodId":asset_id,
    // "androidAutomationStatus":AndroidStatus,
    // "webAutomationStatus":webAuotStatus
  };
  console.log("isAlphaNumeric-summary-", isAlphaNumeric(asset_id));

  if (!isAlphaNumeric(asset_id)) {
    obj["assetId"] = asset_id ? asset_id : null;
  } else {
    obj["vodId"] = asset_id ? parseInt(asset_id) : null;
  }
  if (webAuotStatus != "") {
    obj["webAutomationStatus"] = webAuotStatus;
  }
  if (AndroidStatus != "") {
    obj["androidAutomationStatus"] = AndroidStatus;
  }
  const url = `/api/assets/logs/chart/summary`; //?frequency=${time}&partner=${name}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}&assetId=${asset_id}`
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    dispatch(setConnectedGraphData(data));
    dispatch(stopLoadingCrm());
  } catch (error) {
    dispatch(stopLoadingCrm());
    console.log(error);
  }
}

async function getAssetOverviewDashboard({ payload }) {
  const { title } = payload;
  const { dispatch } = payload;
  const url = `/api/assets/assets-summary?frequency=${title}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setAssetOverview(data));
  } catch (error) {
    console.log(error);
  }
}
async function updateQCLogDetailsStatus({ payload }) {
  const { title } = payload;
  const { dispatch } = payload;
  const url = `/api/assets/assets-summary?frequency=${title}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setAssetOverview(data));
  } catch (error) {
    console.log(error);
  }
}

//amit
async function getIssueTypeDashboard({ payload }) {
  const { title } = payload;
  const { issueType } = payload;
  const { partners } = payload;
  const { contentTypes } = payload;
  const { dispatch } = payload;
  const url = `/api/issueanalysis/issuetype?frequency=${title}&issue=${issueType}&partner=${
    partners ? partners : ""
  }&contentTypes=${contentTypes ? contentTypes : ""}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setIssueType(data));
  } catch (error) {
    console.log(error);
  }
}
async function getPartnerDashboard({ payload }) {
  const { frequency } = payload;
  const { partner } = payload;
  const { contentType } = payload;
  const { dispatch } = payload;
  const url = `/api/issueanalysis/partner?frequency=${frequency}&partner=${partner}&contentType=${contentType}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setPartner(data));
  } catch (error) {
    console.log(error);
  }
}
//----------------------------------------

async function getRPIOverviewDashboard({ payload }) {
  const { title } = payload;
  const { dispatch } = payload;
  const url = `/api/assets/avg-rpi-qc-time?frequency=${title}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setRPIOverview(data));
  } catch (error) {
    console.log(error);
  }
}

async function getContentTypesDashboard(payload) {
  const dispatch = payload.payload;
  const url = `/api/contentTypes`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setContentTypes(data));
  } catch (error) {
    console.log(error);
  }
}
// async function getAnalysisCountsData({ payload }) {
//     const { dispatch } = payload
//     const url = `${AnalysisCountsBaseUrl}/get_counts`
//     try {
//         const response = await axios.get(url,"");
//         const { data } = response
//         dispatch(setAnalysisCounts(data))
//     }
//     catch (error) {
//         console.log(error)
//     }
// }

async function getPendingInQueueGraphDataDashboard({ payload }) {
  const { name } = payload;
  const { dispatch } = payload;
  const { time } = payload;
  const { issue } = payload;
  const { type } = payload;
  const { status } = payload;
  let finalStatus;
  if (status) {
    finalStatus = status;
  } else {
    finalStatus = "";
  }
  dispatch(startLoadingCrm());
  const url = `/api/assets-queue/chart?frequency=${time}&partner=${name}&contentTypes=${type}&issueTypes=${issue}&status=${finalStatus}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setPendingInQueueGraphData(data));
    dispatch(stopLoadingCrm());
  } catch (error) {
    dispatch(stopLoadingCrm());
    console.log(error);
  }
}

export default function* rootSaga() {
  yield all([
    fork(getAssetDetails),
    fork(getPartnerDetails),
    fork(getIssueTypesDetails),
    fork(getStatusTypesDetails),
    fork(getImageAssetInfo),
    fork(getAssetOverview),
    fork(getRPIOverview),
    fork(getContentTypes),
    fork(getConnectedGraphData),
    fork(getIssueType),
    fork(getPartner),
    // fork(getAnalysisCounts),
    fork(getPendingInQueueGraphData),
  ]);
}
