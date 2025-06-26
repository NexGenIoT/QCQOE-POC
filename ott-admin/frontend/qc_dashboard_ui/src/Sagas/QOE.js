import { all, fork, put, takeEvery } from "redux-saga/effects";
import axios from "axios";
import moment from "moment";
import {
  storeWidgetData,
  storeExperinceDataDevice,
  storeExperinceDataContent,
  startLoadingQOE,
  stoptLoadingQOE,
  storeThresholdData,
  storeFiltersData,
  storeVideoFailureData,
  setConcurrentPlays,
  setTotalMinutesWatched,
  setAveragePercentCompletion,
  setVideoFailures,
  setUniqueViewers,
  setUserAttrition,
  setRealTimePage,
  setUserEngagementPage,
  setQualityExperiencePage,
  setSuccessfullPlays,
  setRebufferingPercentage,
  setVideoPlaysAndFailure,
  setAverageBitRate,
  setEndedPlay,
  setRebufferingRatio,
  setBandwidth,
  setAverageFramrate,
  setEndedPlaysPerUniqueDevice,
  setAttempts,
  setUniqueDevices,
  setMinutesPerUniqueDevices,
  setExitBeforeVideoStart,
  setFav,
  setApplyMitigtationData,
  setAllMitigationData,
  setAutoMitigationStatus,
  setSecondMitigationData,
  setThirdMitigationData,
  setRealTimePageCombine,
  setCities,
  setConnectionInducedRebufferingRatio,
  setMitigationAnalyticsPage,
  setAnomaliesDetectedPage,
  setAnomaliesRCAPage,
  setAnomaliesMitigationPage,
  setAnomaliesClusterPage,
  setAnomaliesClusterSessionPage,
  setVideoStartTime,
  setVideoRestartTime,
  setRenderingQuality,
  setNotification,
  setNumberOfMitigationApplied,
  setImprovementInUEI,
  setDegradationInUEI,
  setAverageStartupBufferLength,
  setAverageRebufferingBufferLength,
  setStatusLogDetailTableData,
  setGlobalSetting,
  setAnomaliesDetect,
  setRca,
  setSecondAnomalies,
  getSecondAnomalies,
  setCSVAnomalies,
  setAnalysisCounts,
  setThirdAnomalies,
  setEstimatedRootRcaBucket,
  setEstimatedRootSecond,
  setConfigMitiListBucket,
  setmitigationType,
  setlocationCoordinates,
  getlocationCoordinates,
  setPlayCount,
  setErrorlocationCoordinates,
  setErrorCount,
  setlocationConcurrentCount,
  setAnomaliesDetectRecordCSV,
  setERCauseCSV,
  getNotifications,
  setNotifications,
  setErrorRecord,
  setEstimatedRootSecondRequest,
  setAnomalyPlayBackFailure,
  setSecondPlayBackFailureAnomalies,
  setMitigationAIData,
  setLabeledRecordCSV,
} from "Store/Actions";
// import { storeWidgetData, storeExperinceDataDevice, storeExperinceDataContent, startLoadingQOE, stoptLoadingQOE, storeThresholdData, storeFiltersData, storeVideoFailureData, setConcurrentPlays, setTotalMinutesWatched, setAveragePercentCompletion, setVideoFailures, setUniqueViewers, setUserAttrition, setRealTimePage, setUserEngagementPage, setQualityExperiencePage, setSuccessfullPlays, setRebufferingPercentage, setVideoPlaysAndFailure, setAverageBitRate, setEndedPlay, setRebufferingRatio, setBandwidth, setAverageFramrate, setEndedPlaysPerUniqueDevice, setAttempts, setUniqueDevices, setMinutesPerUniqueDevices, setExitBeforeVideoStart, setFav, setApplyMitigtationData, setAllMitigationData, setAutoMitigationStatus, setSecondMitigationData, setThirdMitigationData, setRealTimePageCombine, setCities, setConnectionInducedRebufferingRatio, setMitigationAnalyticsPage, setVideoStartTime, setVideoRestartTime, setRenderingQuality, setNotification, setNumberOfMitigationApplied, setImprovementInUEI, setDegradationInUEI, setAverageStartupBufferLength, setAverageRebufferingBufferLength, setStatusLogDetailTableData, setGlobalSetting, setAnomaliesDetect, setRca, setSecondAnomalies, getSecondAnomalies, setCSVAnomalies, setAnalysisCounts, setThirdAnomalies, setEstimatedRootRcaBucket, setEstimatedRootSecond, setConfigMitiListBucket, setmitigationType, setlocationCoordinates, getlocationCoordinates, setPlayCount, setErrorlocationCoordinates, setErrorCount, setlocationConcurrentCount, setErrorRecord } from 'Store/Actions'
import {
  GET_WIDGET_DATA,
  EXPERINCE_DATA,
  GET_VIDEO_FAILURE_DATA,
  GET_THRESHOLD,
  GET_FILTERS,
  GET_CONCURRENT_PLAYS,
  GET_TOTAL_MINUTES,
  GET_AVG_COMPLETION,
  GET_VIDEO_FAIL,
  GET_UNIQUE_VIEWERS,
  GET_USER_ATTRITION,
  GET_UNIQUE_DEVICES,
  GET_MINUTES_PER_UNIQUE_DEVICES,
  GET_SUCCESSFUL_PLAYS,
  GET_REBUFFERING_PERCENTAGE,
  GET_VIDEO_PLAYS_AND_FAILURE,
  GET_AVERAGE_BITRATE,
  GET_REAL_TIME_PAGE_DATA,
  GET_MITIGATION_ANALYSIS_PAGE_DATA,
  GET_ANOMALIES_DETECTED_PAGE_DATA,
  GET_ANOMALIES_RCA_PAGE_DATA,
  GET_ANOMALIES_MITIGATION_PAGE_DATA,
  GET_ANOMALIES_CLUSTER_PAGE_DATA,
  GET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA,
  GET_USER_ENGAGEMENT_PAGE_DATA,
  GET_QUALITY_EXPERIENCE_PAGE_DATA,
  GET_ENDED_PLAY,
  GET_REBUFFERING_RATIO,
  GET_BANDWIDTH,
  GET_AVERAGE_FRAME_RATE,
  GET_ENDED_PLAYS_PER_UNIQUE_DEVICE,
  GET_ATTEMPTS,
  GET_EXIT_BEFORE_VIDEO_START,
  GET_CONNECTION_INDUCED_REBIFFERING_RATIO,
  GET_VIDEO_START_TIME,
  GET_VIDEO_RESTART_TIME,
  GET_RENDERING_QUALITY,
  SET_FAVORITE_METRIC,
  GET_FAVORITE_METRIC,
  GET_VALIDATE,
  GET_ALL_MITIGATION,
  GET_AUTO_MITIGATION_STATUS,
  TOGGLE_MITIGATION,
  APPLY_MANUAL_MITIGATION,
  GET_SECOND_MITIGATION,
  GET_THIRD_MITIGATION,
  GET_CITIES,
  GET_NOTIFICATIONS,
  GET_NUMBER_OF_MITIGATION_APPLIED,
  GET_IMPROVEMENT_IN_UEI,
  GET_DEGRADATION_IN_UEI,
  GET_AVERAGE_STARTUP_BUFFER_LENGTH,
  GET_AVERAGE_REBUFFERING_BUFFER_LENGTH,
  GET_TASK_STATUS,
  GET_GLOBAL_SETTING,
  GET_GLOBAL_SETTING_POST,
  GET_ANOMALIES_DETECT_POST,
  GET_RCA_POST,
  GET_SECOND_ANOMALIES_DETECT_POST,
  GET_CSV_ANOMALIES_DETECT_POST,
  GET_THIRD_ANOMALIES_DETECT_POST,
  GET_ESTIMATED_ROOT_SECOND_POST,
  GET_ESTIMATED_ROOT_RCA_BUCKET,
  GET_CONFIG_MITI_BUCKET,
  GET_METIGATION_TYPE_BUCKET,
  GET_ADD_MITIGATION_BUCKET,
  GET_UPDATE_MITIGATION_BUCKET,
  GET_APPLY_MITIGATION_FOR_RCA,
  GET_ADD_TO_RCA_BUCKETS,
  GET_UPDATE_TO_RCA_BUCKETS,
  GET_LABLED_DATA_RECORDS_POST,
  GET_LOCATION_COORDINATES,
  GET_PLAY_COUNT,
  GET_ERROR_LOCATION_COORDINATES,
  GET_ERROR_COUNT,
  GET_CONCURRENT_COUNT,
  GET_ANOMALIES_DETECT_POST_RECORD_CSV,
  GET_DOWNLOAD_LABELED_RECORD_CSV,
  GET_ERC_POST_RECORD_CSV,
  DELETE_CONFIG_MITI_BUCKET,
  GET_NOTIFICATION,
  SET_NOTIFICATION,
  GET_ERROR_RECORDS_DATA,
  SET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
  GET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
  GET_ANOMALIES_PLAYBACK_FAILURE_POST,
  GET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST,
  GET_MITIGATION_AI,
} from "Store/Actions/types";

import metricsJsonData from "../../src/Routes/qoe/dashboard/matric.json";
import { NotificationManager } from "react-notifications";
import { removeHour } from "Constants/constant";

/**
 * Get Asset Details On Dashboard
 */
export function* getWidgetDataRequest() {
  yield takeEvery(GET_WIDGET_DATA, getWidgetDataRequestDashboard);
}

export function* experienceData() {
  yield takeEvery(EXPERINCE_DATA, getExperienceDataDashboard);
}

export function* getThresholds() {
  yield takeEvery(GET_THRESHOLD, getThresholdsDashboard);
}

export function* getFilters() {
  yield takeEvery(GET_FILTERS, getFiltersDashboard);
}

export function* checkVideoFailure() {
  yield takeEvery(GET_VIDEO_FAILURE_DATA, checkVideoFailureDashboard);
}

export function* getConcurrentPlays() {
  yield takeEvery(GET_CONCURRENT_PLAYS, getConcurrentPlaysDashboard);
}

export function* getTotalMinutesWatched() {
  yield takeEvery(GET_TOTAL_MINUTES, getTotalMinutesWatchedDashboard);
}

export function* getAveragePercentCompletion() {
  yield takeEvery(GET_AVG_COMPLETION, getAveragePercentCompletionDashboard);
}

export function* getVideoFail() {
  yield takeEvery(GET_VIDEO_FAIL, getVideoFailDashboard);
}

export function* getUniqueViewers() {
  yield takeEvery(GET_UNIQUE_VIEWERS, getUniqueViewersDashboard);
}

export function* getUniqueDevices() {
  yield takeEvery(GET_UNIQUE_DEVICES, getUniqueDevicesDashboard);
}

export function* getMinutesPerUniqueDevices() {
  yield takeEvery(
    GET_MINUTES_PER_UNIQUE_DEVICES,
    getMinutesPerUniqueDevicesDashboard
  );
}

export function* getUserAttrition() {
  yield takeEvery(GET_USER_ATTRITION, getUserAttritionDashboard);
}

export function* getGetRealTimePage() {
  yield takeEvery(GET_REAL_TIME_PAGE_DATA, getGetRealTimePageData);
}

export function* getMitigationAnalyticsPage() {
  yield takeEvery(
    GET_MITIGATION_ANALYSIS_PAGE_DATA,
    getMitigationAnalyticsPageData
  );
}

export function* getAnomaliesDetectedPage() {
  yield takeEvery(
    GET_ANOMALIES_DETECTED_PAGE_DATA,
    getAnomaliesDetectedPageData
  );
}

export function* getAnomaliesRCAPage() {
  yield takeEvery(GET_ANOMALIES_RCA_PAGE_DATA, getAnomaliesRCAPageData);
}
export function* getAnomaliesMitigationPage() {
  yield takeEvery(
    GET_ANOMALIES_MITIGATION_PAGE_DATA,
    getAnomaliesMitigationPageData
  );
}
export function* getAnomaliesClusterPage() {
  yield takeEvery(GET_ANOMALIES_CLUSTER_PAGE_DATA, getAnomaliesClusterPageData);
}
export function* getAnomaliesClusterSessionPage() {
  yield takeEvery(
    GET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA,
    getAnomaliesClusterSessionPageData
  );
}

export function* getGetUserEngagementPage() {
  yield takeEvery(GET_USER_ENGAGEMENT_PAGE_DATA, getGetUserEngagementPageData);
}

export function* getGetQualityExperiencePage() {
  yield takeEvery(
    GET_QUALITY_EXPERIENCE_PAGE_DATA,
    getGetQualityExperiencePageData
  );
}

export function* successfullPlays() {
  yield takeEvery(GET_SUCCESSFUL_PLAYS, successfullPlaysDashboard);
}

export function* getRebufferingPercentage() {
  yield takeEvery(
    GET_REBUFFERING_PERCENTAGE,
    getRebufferingPercentageDashboard
  );
}

export function* getVideoPlaysAndFailure() {
  yield takeEvery(
    GET_VIDEO_PLAYS_AND_FAILURE,
    getVideoPlaysAndFailureDashboard
  );
}

export function* getNumberOfMitigationApplied() {
  yield takeEvery(
    GET_NUMBER_OF_MITIGATION_APPLIED,
    getNumberOfMitigationAppliedDashboard
  );
}

export function* getImprovementInUEI() {
  yield takeEvery(GET_IMPROVEMENT_IN_UEI, getImprovementInUEIDashboard);
}

export function* getDegradationInUEI() {
  yield takeEvery(GET_DEGRADATION_IN_UEI, getDegradationInUEIDashboard);
}

export function* getAverageStartupBufferLength() {
  yield takeEvery(
    GET_AVERAGE_STARTUP_BUFFER_LENGTH,
    getAverageStartupBufferLengthDashboard
  );
}

export function* getAverageRebufferingBufferLength() {
  yield takeEvery(
    GET_AVERAGE_REBUFFERING_BUFFER_LENGTH,
    getAverageRebufferingBufferLengthDashboard
  );
}

export function* getAverageBitRate() {
  yield takeEvery(GET_AVERAGE_BITRATE, getAverageBitRateDashboard);
}

export function* getExitBeforeVideoStart() {
  yield takeEvery(
    GET_EXIT_BEFORE_VIDEO_START,
    getExitBeforeVideoStartDashboard
  );
}

export function* getConnectionInducedRebufferingRatio() {
  yield takeEvery(
    GET_CONNECTION_INDUCED_REBIFFERING_RATIO,
    getConnectionInducedRebufferingRatioDashboard
  );
}

export function* getVideoStartTime() {
  yield takeEvery(GET_VIDEO_START_TIME, getVideoStartTimeDashboard);
}

export function* getVideoRestartTime() {
  yield takeEvery(GET_VIDEO_RESTART_TIME, getVideoRestartTimeDashboard);
}

export function* getRenderingQuality() {
  yield takeEvery(GET_RENDERING_QUALITY, getRenderingQualityDashboard);
}

export function* getEndedPlay() {
  yield takeEvery(GET_ENDED_PLAY, getEndedPlayDashboard);
}

export function* getRebufferingRatio() {
  yield takeEvery(GET_REBUFFERING_RATIO, getRebufferingRatioDashboard);
}

export function* getBandwith() {
  yield takeEvery(GET_BANDWIDTH, getBandwithDashboard);
}

export function* getAverageFramrate() {
  yield takeEvery(GET_AVERAGE_FRAME_RATE, getAverageFramrateDashboard);
}

export function* getEndedPlaysPerUniqueDevice() {
  yield takeEvery(
    GET_ENDED_PLAYS_PER_UNIQUE_DEVICE,
    getEndedPlaysPerUniqueDeviceDashboard
  );
}

export function* getAttempts() {
  yield takeEvery(GET_ATTEMPTS, getAttemptsDashboard);
}

export function* markMetricAsFavorite() {
  yield takeEvery(SET_FAVORITE_METRIC, markMetricAsFavoriteDashboard);
}

export function* getFavoriteMetric() {
  yield takeEvery(GET_FAVORITE_METRIC, getFavoriteMetricDashboard);
}

export function* getValidate() {
  yield takeEvery(GET_VALIDATE, getValidateDashboard);
}
export function* getUpdateTask() {
  yield takeEvery(GET_TASK_STATUS, getUpdateTaskStatus);
}

export function* getAllMitigation() {
  yield takeEvery(GET_ALL_MITIGATION, getAllMitigationDashboard);
}

export function* getSecondMitigation() {
  yield takeEvery(GET_SECOND_MITIGATION, getSecondMitigationDashboard);
}

export function* getThirdMitigation() {
  yield takeEvery(GET_THIRD_MITIGATION, getThirdMitigationDashboard);
}

// export function* getAutoMitigationStatus(){
//     yield takeEvery(GET_AUTO_MITIGATION_STATUS, getAutoMitigationStatusDashboard)
// }

export function* getCities() {
  yield takeEvery(GET_CITIES, getCitiesDashboard);
}

// export function* getNotification(){
//     yield takeEvery(GET_NOTIFICATIONS, getNotificationDashboard)
// }

// export function* toggleMitigation(){
//     yield takeEvery(TOGGLE_MITIGATION, toggleMitigationDashboard)
// }

export function* applyManualMitigation() {
  yield takeEvery(APPLY_MANUAL_MITIGATION, applyManualMitigationDashboard);
}

export function* getGlobalSetting() {
  yield takeEvery(GET_GLOBAL_SETTING, getGLobalSettingDashboard);
}
export function* postGlobalSettingsDs() {
  yield takeEvery(GET_GLOBAL_SETTING_POST, postGlobalSettingDash);
}
///-------anamoly -----------------------
export function* getAnomaliesDetect() {
  yield takeEvery(GET_ANOMALIES_DETECT_POST, getAnomaliesDetectData);
}
export function* getAnomaliesDetectRecordCSV() {
  yield takeEvery(
    GET_ANOMALIES_DETECT_POST_RECORD_CSV,
    getAnomaliesDetectDataRecordCSV
  );
}
export function* getLabeledRecordCSV() {
  yield takeEvery(GET_DOWNLOAD_LABELED_RECORD_CSV, getLabeledRecordCSV_API);
}
export function* getERCauseRecordCsv() {
  yield takeEvery(GET_ERC_POST_RECORD_CSV, getERCauseDataRecordCsv);
}
export function* getRca() {
  yield takeEvery(GET_RCA_POST, getRCAData);
}

export function* getSecondAnomaliesDetect() {
  yield takeEvery(
    GET_SECOND_ANOMALIES_DETECT_POST,
    getSecondAnomaliesDetectData
  );
}
export function* getThirdAnomaliesDetect() {
  yield takeEvery(GET_THIRD_ANOMALIES_DETECT_POST, getThirdAnomaliesDetectData);
}
export function* getCSVAnomaliesDetect() {
  yield takeEvery(GET_CSV_ANOMALIES_DETECT_POST, getCSVAnomaliesDetectData);
}

export function* getEstimatedRootSecond() {
  yield takeEvery(
    GET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
    getEstimatedRootSecondFn
  );
}
export function* getEstimatedRootRcaBucket() {
  yield takeEvery(GET_ESTIMATED_ROOT_RCA_BUCKET, getEstimatedRootRcaBucketFn);
}
export function* getListConfigMitiBucket() {
  yield takeEvery(GET_CONFIG_MITI_BUCKET, getListConfigMitiBucketFn);
}
export function* deleteConfigMitiAndRcaBucket() {
  yield takeEvery(DELETE_CONFIG_MITI_BUCKET, deleteConfigMitiAndrcaBucketFn);
}
export function* getMetigationTypeBucket() {
  yield takeEvery(GET_METIGATION_TYPE_BUCKET, getMetigationTypeBucketFn);
}
export function* postAddMetigationBucUpdate() {
  yield takeEvery(GET_ADD_MITIGATION_BUCKET, getAddMitigationPlanBucketFn);
}

export function* postUpdateMetigationBucUpdate() {
  yield takeEvery(
    GET_UPDATE_MITIGATION_BUCKET,
    getUpdateMitigationPlanBucketFn
  );
}

export function* postApplyMetigationForRCA() {
  yield takeEvery(GET_APPLY_MITIGATION_FOR_RCA, getApplyMitigationForRCAFn);
}

export function* postAddToRCABuckets() {
  yield takeEvery(GET_ADD_TO_RCA_BUCKETS, postAddToRCABucketsFn);
}
// FOR Update
export function* postUpdateToRCABuckets() {
  yield takeEvery(GET_UPDATE_TO_RCA_BUCKETS, postUpdateToRCABucketsFn);
}

export function* postEstimatedRootLabeled() {
  yield takeEvery(GET_LABLED_DATA_RECORDS_POST, postEstimatedRootLabeledDataFn);
}
export function* getAnomalyPlayBackFailure() {
  yield takeEvery(
    GET_ANOMALIES_PLAYBACK_FAILURE_POST,
    getAnomalyPlayBackFailureData
  );
}
export function* getAnomalyPlayBackFailureByVid() {
  yield takeEvery(
    GET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST,
    getAnomalyPlayBackFailureByVidData
  );
}

//anomaly end-----------------------------------------------------
export function* getCoordinates() {
  yield takeEvery(GET_LOCATION_COORDINATES, getlocationCoordinatesFn);
}
export function* playCounts() {
  yield takeEvery(GET_PLAY_COUNT, playCountFn);
}

export function* getErrorLocationCoordinates() {
  yield takeEvery(
    GET_ERROR_LOCATION_COORDINATES,
    getErrorLocationCoordinatesFn
  );
}
export function* errorCounts() {
  yield takeEvery(GET_ERROR_COUNT, errorCountFn);
}
export function* playConcurrentCounts() {
  yield takeEvery(GET_CONCURRENT_COUNT, playConcurrentCountFn);
}

export function* notifications() {
  yield takeEvery(GET_NOTIFICATION, notificationsFn);
}
export function* getErrorRecord() {
  yield takeEvery(GET_ERROR_RECORDS_DATA, getErrorRecordFn);
}

export function* getMitigationAI() {
  yield takeEvery(GET_MITIGATION_AI, getMitigationDashboardAI);
}
let baseURL = "http://3.6.164.157:8080/"; //"https://qcotp.qoetech.com:4444/"//"http://3.108.121.176:5002" --prev// https://qc7.qoeqoe.com--dev
let baseURLCities = "http://3.6.164.157:8088/"; //http://65.1.227.110:8005/ --prev
let baseURLUpdateStatus = "http://3.6.164.157:8088/"; //http://65.1.227.110:8005/ --prev
let globalsettingBaseUrl = "http://3.6.164.157:8085/"; // "http://3.108.121.176:5007/--local"//"https://qc7.qoeqoe.com:5007"--prod
let AnomaliesBaseUrl = "http://3.6.164.157:8084"; //--temparory5008
let locationBaseUrl = "http://3.6.164.157:8087"; //"https://qc3.qoeqoe.com:5001"//"https://qc3.qoeqoe.com:5001/"//--dev "http://3.108.121.176:5001"
let errorAnalyticsBaseUrl = "http://3.6.164.157:8090";
let widgetArray = [];
async function getWidgetDataRequestDashboard({ payload }) {
  let startTime = new Date().getTime(),
    endTime;
  var fromDate;
  var toDate;
  var yesterdayDate;

  const { matrics_name, dispatch, loader } = payload;
  //  const {loader} = payload
  loader && dispatch(startLoadingQOE());
  const requestBody = {
    device_platform: "",
    metrices_name: matrics_name,
  };

  if (matrics_name == "concurrent_plays") {
    fromDate = Math.floor(new Date().getTime() / 1000.0) - 1 * 60;
    toDate = Math.floor(new Date().getTime() / 1000.0);
    yesterdayDate = Math.floor(new Date().getTime() / 1000.0) - 2 * 60;
  } else {
    fromDate = Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
    toDate = Math.floor(new Date().getTime() / 1000.0);
    yesterdayDate = Math.floor(new Date().getTime() / 1000.0) - 48 * 3600;
  }
  // let fromDate = Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600);
  // let toDate = Math.floor((new Date()).getTime() / 1000.0);

  const url = `${baseURL}api/v2/percentage_change?to_time=${toDate}&from_time_24hrs=${fromDate}&from_time_48hrs=${yesterdayDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    if (data.length != 0) {
      //calculate api response time
      endTime = new Date().getTime();
      if (data[0].message == "Bad request, Invalid matrices name") {
        return;
      }
      widgetArray.push(data[0]);
      var arr = metricsJsonData.concat(widgetArray).reduce(
        function (prev, current, index, array) {
          if (!(current?.metric_key_name in prev.keys)) {
            prev.keys[current?.metric_key_name] = index;
            prev.result.push(current);
          } else {
            prev.result[prev.keys[current?.metric_key_name]] = current;
          }

          return prev;
        },
        { result: [], keys: {} }
      ).result;
    }
    dispatch(storeWidgetData(arr));
    loader && dispatch(stoptLoadingQOE());
  } catch (error) {
    console.log(error);
    dispatch(stoptLoadingQOE());
  }
}
const mergeArrays = (arr1, arr2) => {
  return (
    arr1 &&
    arr1.map((obj) => (arr2 && arr2.find((p) => p.id === obj.id)) || obj)
  );
};

async function getExperienceDataDashboard({ payload }) {
  const { dispatch } = payload;
  const { matricsName } = payload;
  const { group } = payload;
  const { isDevice } = payload;
  dispatch(startLoadingQOE());
  const requestBody = {
    metric_type: matricsName,
    group_on: group,
  };
  let fromDate = Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
  let toDate = Math.floor(new Date().getTime() / 1000.0);
  const url = `${baseURL}api/aggregated_data_for_24hrs?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    var finalData = [];
    if (!isDevice) {
      const removeEmptyStringArray = [];
      data?.length > 0 &&
        data?.map((d) => {
          if (d.content_partner) {
            return removeEmptyStringArray.push(d);
          } else {
            return null;
          }
        });
      finalData = removeEmptyStringArray.map((product) => {
        const content_partner_image = product.content_partner
          ? product.content_partner.toLowerCase().replace(/ /g, "")
          : "";
        return { ...product, content_partner_image };
      });
    } else {
      finalData = data;
    }
    isDevice
      ? dispatch(storeExperinceDataDevice(finalData))
      : dispatch(storeExperinceDataContent(finalData));
    dispatch(stoptLoadingQOE());
  } catch (error) {
    console.log(error); // http://3.6.164.157:8080/api/thresholds

    dispatch(stoptLoadingQOE());
  }
}

async function getThresholdsDashboard({ payload }) {
  const dispatch = payload;
  const requestOpt = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const url = `${baseURL}api/thresholds`;
  try {
    const response = await axios.post(url, requestOpt);
    const { data } = response;
    dispatch(storeThresholdData(data));
  } catch (error) {
    console.log(error);
    dispatch(stoptLoadingQOE());
  }
}

async function getFiltersDashboard({ payload }) {
  const dispatch = payload;
  const requestOpt = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const url = `${baseURL}api/unique_filters`;
  try {
    const response = await axios.post(url, requestOpt);
    const { data } = response;
    dispatch(storeFiltersData(data));
  } catch (error) {
    console.log(error);
    dispatch(stoptLoadingQOE());
  }
}

async function checkVideoFailureDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "video_start_failures",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(storeVideoFailureData(data));
  } catch (error) {
    console.log(error);
  }
}

async function getConcurrentPlaysDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "concurrent_plays",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setConcurrentPlays(data));
  } catch (error) {
    console.log(error);
  }
}

async function getTotalMinutesWatchedDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "total_minutes_watched",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setTotalMinutesWatched(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAveragePercentCompletionDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "average_percentage_completion",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setAveragePercentCompletion(data));
  } catch (error) {
    console.log(error);
  }
}

async function getVideoFailDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "video_playback_failures",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setVideoFailures(data));
  } catch (error) {
    console.log(error);
  }
}

async function getUniqueViewersDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "unique_viewers",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setUniqueViewers(data));
  } catch (error) {
    console.log(error);
  }
}

async function getUniqueDevicesDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "unique_devices",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setUniqueDevices(data));
  } catch (error) {
    console.log(error);
  }
}

async function getMinutesPerUniqueDevicesDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "minutes_per_unique_devices",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setMinutesPerUniqueDevices(data));
  } catch (error) {
    console.log(error);
  }
}

async function getUserAttritionDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "user_attrition",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setUserAttrition(data));
  } catch (error) {
    console.log(error);
  }
}

async function successfullPlaysDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "succesful_plays",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setSuccessfullPlays(data));
  } catch (error) {
    console.log(error);
  }
}

async function getRebufferingPercentageDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "rebuffering_percentage",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setRebufferingPercentage(data));
  } catch (error) {
    console.log(error);
  }
}

async function getVideoPlaysAndFailureDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;

  const requestBody = {
    metricname: "play_attempts",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setVideoPlaysAndFailure(data));
  } catch (error) {
    console.log(error);
  }
}

async function getNumberOfMitigationAppliedDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { sourceD } = payload;
  const requestBody = {
    metricname: "number_of_mitigations_applied",
    device_platform: [],
    location: [],
    aggregation_interval: agr,
    source: sourceD ? sourceD : [],
  };
  console.log("number miti-1-", payload);
  const url = `${baseURL}mitigation/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setNumberOfMitigationApplied(data));
  } catch (error) {
    console.log(error);
  }
}

async function getImprovementInUEIDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { sourceD } = payload;

  const requestBody = {
    metricname: "improvement_in_uei",
    device_platform: [],
    location: [],
    aggregation_interval: agr,
    source: sourceD ? sourceD : [],
  };
  console.log("number miti-2-", payload);
  const url = `${baseURL}mitigation/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    console.log(data, "SARTHAK");
    dispatch(setImprovementInUEI(data));
  } catch (error) {
    console.log(error);
  }
}

async function getDegradationInUEIDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { sourceD } = payload;

  const requestBody = {
    metricname: "degradation_in_uei",
    device_platform: [],
    location: [],
    aggregation_interval: agr,
    source: sourceD ? sourceD : [],
  };
  console.log("number miti-3-", payload);
  const url = `${baseURL}mitigation/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setDegradationInUEI(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAverageStartupBufferLengthDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { sourceD } = payload;

  const requestBody = {
    metricname: "average_startup_buffer_length",
    device_platform: [],
    location: [],
    aggregation_interval: agr,
    source: sourceD ? sourceD : [],
  };
  console.log("number miti-4-", payload);
  const url = `${baseURL}mitigation/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setAverageStartupBufferLength(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAverageRebufferingBufferLengthDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { sourceD } = payload;

  const requestBody = {
    metricname: "average_rebuffering_buffer_length",
    device_platform: [],
    //  "location": [],
    aggregation_interval: agr,
    source: sourceD ? sourceD : [],
  };
  console.log("number miti-5-", payload);
  const url = `${baseURL}mitigation/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setAverageRebufferingBufferLength(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAverageBitRateDashboard({ payload }) {
  let startTime = new Date().getTime(),
    endTime;

  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "average_bitrate",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    //calculate api response time
    endTime = new Date().getTime();
    console.log(
      "Took " + (endTime - startTime) / 1000 + "s",
      "statrt time--",
      startTime,
      "end time--",
      endTime,
      "api name--",
      "average_bitrate"
    );
    //-----------------------------------------------------
    dispatch(setAverageBitRate(data));
  } catch (error) {
    console.log(error);
  }
}

async function getExitBeforeVideoStartDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "exit_before_video_starts",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setExitBeforeVideoStart(data));
  } catch (error) {
    console.log(error);
  }
}

async function getConnectionInducedRebufferingRatioDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "connection_induced_rebuffering_ratio",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setConnectionInducedRebufferingRatio(data));
  } catch (error) {
    console.log(error);
  }
}

async function getVideoStartTimeDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "video_start_time",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setVideoStartTime(data));
  } catch (error) {
    console.log(error);
  }
}

async function getVideoRestartTimeDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "video_restart_time",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setVideoRestartTime(data));
  } catch (error) {
    console.log(error);
  }
}

async function getRenderingQualityDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "rendering_quality",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setRenderingQuality(data));
  } catch (error) {
    console.log(error);
  }
}

async function getEndedPlayDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "ended_plays",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setEndedPlay(data));
  } catch (error) {
    console.log(error);
  }
}

async function getRebufferingRatioDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "rebuffering_ratio",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setRebufferingRatio(data));
  } catch (error) {
    console.log(error);
  }
}

async function getBandwithDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "bandwidth",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setBandwidth(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAverageFramrateDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "average_framerate",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setAverageFramrate(data));
  } catch (error) {
    console.log(error);
  }
}

async function getEndedPlaysPerUniqueDeviceDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "ended_plays_per_unique_devices",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setEndedPlaysPerUniqueDevice(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAttemptsDashboard({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { agr } = payload;
  const { location } = payload;
  const requestBody = {
    metricname: "attempts",
    content_partner: localStorage.getItem("contentPartner")
      ? [localStorage.getItem("contentPartner")]
      : [],
    device_model: [],
    device_platform: [],
    content_type: [],
    cdn: [],
    location: location == "all" ? [] : location,
    aggregation_interval: agr,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setAttempts(data));
  } catch (error) {
    console.log(error);
  }
}

async function markMetricAsFavoriteDashboard({ payload }) {
  const { selectedMetric } = payload;
  const { cb } = payload;
  const url = `${baseURL}api/favorite`;
  try {
    const response = await axios.post(url, selectedMetric);
    const { data } = response;
    if (data.status === 200) {
      cb();
    }
  } catch (error) {
    console.log(error);
  }
}

async function getFavoriteMetricDashboard({ payload }) {
  const dispatch = payload;
  const url = `${baseURL}api/get_favorite`; // `${baseURL}api/favorite`--prev
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setFav(data));
  } catch (error) {
    console.log(error);
  }
}

async function getValidateDashboard({ payload }) {
  const {
    tags,
    platform,
    location,
    mitigation_status,
    uei_condition,
    rebuffering_duration,
    startup_buffer_length,
    start_bitrate,
    stall_count,
    dispatch,
    cb,
  } = payload;
  const url = `${baseURL}api/validate_records`;
  try {
    const requestBody = {
      ueids: tags,
      device_platform: platform,
      location: location ? location : [],
      mitigation_status: mitigation_status,
      current_uei: uei_condition,
      rebuffering_duration: rebuffering_duration,
      startup_buffer_length: startup_buffer_length,
      start_bitrate: start_bitrate,
      stall_count: stall_count,
    };
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setApplyMitigtationData(data));
    cb({ error: false });
  } catch (error) {
    console.log(error);
    cb({ error: true, message: "Network Error" });
  }
}

async function getUpdateTaskStatus({ payload }) {
  const { payloads, dispatch, cb } = payload;
  const url = `${baseURLUpdateStatus}api/assets/update`;
  const requestBody = payloads;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setStatusLogDetailTableData(data));
    // cb({error: false})
    //setSuccessMessage("Status Updated Succesfully")
    NotificationManager.success("Status Updated Succesfully", "", 2000);
  } catch (error) {
    console.log(error);
    //cb({error: true, message: 'Network Error'})
  }
}

async function getAllMitigationDashboard({ payload }) {
  const { from_time, to_time, dispatch } = payload;
  const url = `${baseURL}api/mitigation_history1?to_time=${to_time}&from_time=${from_time}`;
  try {
    const response = await axios.post(url);
    const { data } = response;
    dispatch(setAllMitigationData(data));
  } catch (error) {}
}

async function getMitigationDashboardAI({ payload }) {
  const { isAI, gid, dispatch } = payload;
  const url = `${baseURL}api/mitigation_history2/ai?gid=${gid}`;
  // const url =   `https://qoe.qoetech.com/api/mitigation_history2/ai?gid=9e966add-7a6b-4a01-a00c-62362a2957d9`
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setMitigationAIData(data));
  } catch (error) {}
}

async function getSecondMitigationDashboard({ payload }) {
  const { dispatch } = payload;
  const { id } = payload;
  const { cb } = payload;
  const url = `${baseURL}api/mitigation_history2`;
  try {
    const obj = {
      group_mitigation_id: id,
    };
    const response = await axios.post(url, obj);
    const { data } = response;
    dispatch(setSecondMitigationData(data));
    cb();
  } catch (error) {
    cb();
  }
}

async function getThirdMitigationDashboard({ payload }) {
  const { dispatch } = payload;
  const { id } = payload;
  const url = `${baseURL}api/mitigation_history3`;
  try {
    const obj = {
      device_id: id,
    };
    const response = await axios.post(url, obj);
    const { data } = response;
    dispatch(setThirdMitigationData(data));
  } catch (error) {}
}

// async function getAutoMitigationStatusDashboard({payload}){
//     const {dispatch} = payload
//     const url = `${baseURL}api/enable_disable_local_intelligence`
//     try {
//         const response = await axios.get(url);
//         const { data } = response
//         dispatch(setAutoMitigationStatus(data))
//     } catch (error) {

//     }
// }
async function notificationsFn({ payload }) {
  const { dispatch } = payload;
  const url = `https://qcotp.qoetech.com/api/notifiaction/dashboard`;
  try {
    const response = await axios.get(url);
    console.log({ notificationResponse: response });
    const { data } = response || {};
    dispatch(setNotifications(data));
  } catch (error) {
    console.log(error);
  }
}

async function getCitiesDashboard({ payload }) {
  const { dispatch } = payload;

  //const url = `${baseURLCities}cities`//--prev
  const url = `${baseURLCities}api/states`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setCities(data));
  } catch (error) {}
}

// async function getNotificationDashboard({payload}){
//     const {dispatch} = payload
//     const url = `${baseURL}api/notifications`
//     try {
//         const response = await axios.get(url);
//         const { data } = response
//         dispatch(setNotification(data))
//     } catch (error) {

//     }
// }

// async function toggleMitigationDashboard({payload}){
//     const {data, dispatch, cb} = payload;
//     const url = `${baseURL}api/enable_disable_local_intelligence`
//     const requestBody = {
//         "switch": data === "on" ? "off" : "on"
//     }
//     try {
//         await axios.post(url, requestBody);
//         dispatch(setAutoMitigationStatus(requestBody))
//         cb()
//     } catch (error) {
//         cb()
//     }
// }

async function applyManualMitigationDashboard({ payload }) {
  const { data, cb } = payload;
  const url = `${baseURL}api/apply_manual_mitigation`;
  const requestBody = {
    DeviceID: data.toString().split(","),
    Source: "Manual",
    SuggestiveStartupBufferDuration: parseInt(
      localStorage.getItem("startup_buffer_length")
    ),
    SuggestiveReBufferingDuration: parseInt(
      localStorage.getItem("rebuffer_duration")
    ),
    SuggestiveStartBitrate: parseInt(localStorage.getItem("start_bit_rate")),
  };
  try {
    await axios.post(url, requestBody);
    cb();
    NotificationManager.success(
      "Mitigation apply successfully. Auto refresh in two minutes",
      "",
      2000
    );
  } catch (error) {
    cb();
  }
}
///  Inner pages
async function getGetRealTimePageData({ payload }) {
  const { dispatch } = payload;
  const { contentPartner } = payload;
  const { devicePlatform } = payload;
  const { contentType } = payload;
  const { cdn } = payload;
  const { location } = payload;
  const { aggregationInterval } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  var { metric } = payload;
  if (metric == "successful_plays") {
    metric = "succesful_plays";
  }
  if (metric === "video_plays_and_failures") {
    var finalRealMetricCombine = [];
    var combineMetric = [
      "attempts",
      "video_start_failures",
      "exit_before_video_starts",
      "succesful_plays",
    ];
    combineMetric.map(async (c) => {
      const requestBody = {
        metricname: c,
        content_partner: localStorage.getItem("contentPartner")
          ? [
              ...new Set(
                contentPartner.concat(localStorage.getItem("contentPartner"))
              ),
            ]
          : contentPartner,
        device_model: [],
        device_platform: devicePlatform,
        content_type: contentType,
        cdn: cdn,
        location: location,
        aggregation_interval: aggregationInterval,
      };
      const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
      const response = await axios.post(url, requestBody);
      const { data } = response;
      finalRealMetricCombine = finalRealMetricCombine.concat(data[0]);
    });
    setTimeout(() => {
      dispatch(setRealTimePageCombine(finalRealMetricCombine));
    }, 2000);
  } else {
    const requestBody = {
      metricname: metric,
      content_partner: localStorage.getItem("contentPartner")
        ? [
            ...new Set(
              contentPartner.concat(localStorage.getItem("contentPartner"))
            ),
          ]
        : contentPartner,
      device_model: [],
      device_platform: devicePlatform,
      content_type: contentType,
      cdn: cdn,
      location: location,
      aggregation_interval: aggregationInterval,
    };
    const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
    try {
      const response = await axios.post(url, requestBody);
      const { data } = response;
      dispatch(setRealTimePage(data));
    } catch (error) {
      console.log(error);
    }
  }
}

async function getMitigationAnalyticsPageData({ payload }) {
  const { dispatch } = payload;
  const { metric } = payload;
  const { devicePlatform } = payload;
  const { location } = payload;
  const { aggregationInterval } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { sourceD } = payload;

  const requestBody = {
    metricname: metric,
    device_platform: devicePlatform,
    location: location,
    aggregation_interval: aggregationInterval,
    source: sourceD,
  };
  const url = `${baseURL}mitigation/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setMitigationAnalyticsPage(data));
  } catch (error) {
    console.log(error);
  }
}

//-------------AI pipe line-------------------
function removeTime() {}
async function getAnomaliesDetectedPageData({ payload }) {
  const { dispatch } = payload;
  const { interval } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  // toDate == "undefined" ? Math.floor(new Date().getTime() / 1000.0):toDate
  //second,minute,hour,day,week,month,quarter,year

  let filter = {};
  if (interval?.contentPartner.length > 0) {
    filter["content_partner"] = ["_in", interval.contentPartner];
  }
  if (interval?.devicePlatform.length > 0) {
    filter["device_platform"] = ["_in", interval.devicePlatform];
  }
  if (interval?.location.length > 0) {
    let temploc = [];
    interval.location.map((res) => {
      temploc.push(res.split("(")[0]);
    });
    filter["location_city"] = ["_in", temploc];
  }
  // filter["interval"] = ["_in", temploc]=interval.selectVal
  let intervalch =
    interval.selectVal == "1s"
      ? "second"
      : interval.selectVal == "1min"
      ? "minute"
      : interval.selectVal == "1h"
      ? "hour"
      : interval.selectVal == "1d"
      ? "day"
      : interval.selectVal == "1w"
      ? "week"
      : interval.selectVal == "1m"
      ? "month"
      : interval.selectVal == "1y"
      ? "year"
      : interval.selectVal == "2d"
      ? "day"
      : interval.selectVal;

  let filterBody = {
    filters: filter,
  };

  const url = `${AnomaliesBaseUrl}/api/v1/TotalAnomaliesDetected?to_time=${toDate}&from_time=${fromDate}&interval=${intervalch}`;
  //const url = `${AnomaliesBaseUrl}/api/v1/TotalAnomaliesDetected?to_time=1669357130&from_time=1669270730&interval=hour`

  try {
    const response = await axios.post(url, filterBody);
    const { data } = response;
    let obj = {};
    if (data?.Items?.Timestamp) {
      obj = {
        InSession: data?.Items?.InSession,
        Playback: data?.Items?.Playback,
        Timestamp: removeHour(
          data?.Items?.Timestamp,
          interval.selectVal,
          "anom"
        ), //
      };
    }

    // if(data?.Items?.Timestamp && (interval.selectVal =="1d" || interval.selectVal =="1w" || interval.selectVal =="1m" || interval.selectVal =="1y") ){
    dispatch(setAnomaliesDetectedPage({ Items: obj }));

    // }else{
    //     dispatch(setAnomaliesDetectedPage(data))

    // }
  } catch (error) {
    console.log(error);
  }
}

async function getAnomaliesRCAPageData({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { interval } = payload;
  //   let filter = {
  //     "filters": {
  //         "rca_bucket": [],
  //         "device_platform": [],
  //         "content_partner": [],
  //         "location":[],
  //        "network":[],
  //        "manufacturer":[]
  //    }
  // };
  let filter = {};
  if (interval?.contentPartner.length > 0) {
    filter["content_partner"] = interval.contentPartner;
  }
  if (interval?.devicePlatform.length > 0) {
    filter["device_platform"] = interval.devicePlatform;
  }
  if (interval?.location.length > 0) {
    let temploc = [];
    interval.location.map((res) => {
      temploc.push(res.split("(")[0]);
    });
    filter["location_city"] = temploc;
  }
  if (interval?.network.length > 0) {
    filter["networktype"] = interval.network;
  }
  if (interval?.manufacturer.length > 0) {
    filter["manufacturer"] = interval.manufacturer;
  }
  if (interval?.bucketname.length > 0) {
    filter["rca_bucket"] = interval.bucketname;
  }
  let intervalch =
    interval.selectVal == "1s"
      ? "second"
      : interval.selectVal == "1min"
      ? "minute"
      : interval.selectVal == "1h"
      ? "hour"
      : interval.selectVal == "1d"
      ? "day"
      : interval.selectVal == "1w"
      ? "week"
      : interval.selectVal == "1m"
      ? "month"
      : interval.selectVal == "1y"
      ? "year"
      : interval.selectVal;

  let filterBody = {
    filters: filter,
  };

  const url = `${AnomaliesBaseUrl}/api/v2/TotalDimensionsInRCA?to_time=${toDate}&from_time=${fromDate}&interval=${intervalch}`;
  //const url = `${AnomaliesBaseUrl}/api/v1/TotalDimensionsInRCA?to_time=1687898426&from_time=1681984826&interval=second`
  //to_time=1687898426&from_time=1681984826&interval=second
  try {
    const response = await axios.post(url, filterBody);
    const { data } = response;
    dispatch(setAnomaliesRCAPage(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAnomaliesMitigationPageData({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { interval } = payload;
  let filter = {};

  const url = `${AnomaliesBaseUrl}/api/v1/TotalMitigationsApplied?from_time=${fromDate}&to_time=${toDate}&interval=${interval}`;
  // const url = `${AnomaliesBaseUrl}/api/v1/TotalMitigationsApplied?from_time=1681737190&to_time=1684650790&interval=1s`

  try {
    const response = await axios.post(url, filter);
    const { data } = response;
    let obj = {};
    if (data?.data?.uncategorized?.time_stamp) {
      obj = {
        count: data?.data?.uncategorized?.count,
        time_stamp: removeHour(
          data?.data?.uncategorized?.time_stamp,
          interval,
          "miti"
        ), //
      };
    }

    console.log("data remove --", obj);
    //    if(data?.data?.uncategorized?.time_stamp && (interval =="1d" || interval =="1w" || interval =="1m" || interval =="1y") ){
    //     dispatch(setAnomaliesMitigationPage({data:{uncategorized:obj}}))

    //    }else{
    // dispatch(setAnomaliesMitigationPage(data))
    dispatch(setAnomaliesMitigationPage({ data: { uncategorized: obj } }));
    // }
  } catch (error) {
    console.log(error);
  }
}

async function getAnomaliesClusterPageData({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const url = `${AnomaliesBaseUrl}/api/v2/AnomaliesCluster?from_time=${fromDate}&to_time=${toDate}&type=playback_failure`;

  //const url = `${AnomaliesBaseUrl}/api/v1/AnomaliesCluster?from_time=1681127945&to_time=1684214345&type=playback_failure`
  try {
    const response = await axios.post(url);
    const { data } = response;
    dispatch(setAnomaliesClusterPage(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAnomaliesClusterSessionPageData({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const url = `${AnomaliesBaseUrl}/api/v2/AnomaliesCluster?from_time=${fromDate}&to_time=${toDate}&type=in_session`;
  //const url = `${AnomaliesBaseUrl}/api/v1/AnomaliesCluster?from_time=1674994152&to_time=1675080552&type=in_session`

  try {
    const response = await axios.post(url);
    const { data } = response;
    dispatch(setAnomaliesClusterSessionPage(data));
  } catch (error) {
    console.log(error);
  }
}

//-------------AI pipe line------end-------------

async function getGetUserEngagementPageData({ payload }) {
  const { dispatch } = payload;
  const { metric } = payload;
  const { contentPartner } = payload;
  const { devicePlatform } = payload;
  const { contentType } = payload;
  const { cdn } = payload;
  const { location } = payload;
  const { aggregationInterval } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;

  const requestBody = {
    metricname: metric,
    content_partner: localStorage.getItem("contentPartner")
      ? [
          ...new Set(
            contentPartner.concat(localStorage.getItem("contentPartner"))
          ),
        ]
      : contentPartner,
    device_model: [],
    device_platform: devicePlatform,
    content_type: contentType,
    cdn: cdn,
    location: location,
    aggregation_interval: aggregationInterval,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setUserEngagementPage(data));
  } catch (error) {
    console.log(error);
  }
}

async function getGetQualityExperiencePageData({ payload }) {
  const { dispatch } = payload;
  const { metric } = payload;
  const { contentPartner } = payload;
  const { devicePlatform } = payload;
  const { contentType } = payload;
  const { cdn } = payload;
  const { location } = payload;
  const { aggregationInterval } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const requestBody = {
    metricname: metric,
    content_partner: localStorage.getItem("contentPartner")
      ? [
          ...new Set(
            contentPartner.concat(localStorage.getItem("contentPartner"))
          ),
        ]
      : contentPartner,
    device_model: [],
    device_platform: devicePlatform,
    content_type: contentType,
    cdn: cdn,
    location: location,
    aggregation_interval: aggregationInterval,
  };
  const url = `${baseURL}api/metrics?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    dispatch(setQualityExperiencePage(data));
  } catch (error) {
    console.log(error);
  }
}
async function getGLobalSettingDashboard({ payload }) {
  const { dispatch } = payload;
  const url = `${globalsettingBaseUrl}api/v1/config?service=mitigation_probe_config_data&version=v1`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setGlobalSetting(data));
  } catch (error) {
    console.log(error);
  }
}

async function postGlobalSettingDash({ payload }) {
  const {
    payloads,
    local_intelligence,
    android_probe,
    android_mitigation,
    web_probe,
    web_mitigation,
    firetv_probe,
    firetv_mitigation,
    ios_probe,
    ios_mitigation,
    updated_by,
    updated_at,
    dispatch,
  } = payload;
  const requestBody = {
    local_intelligence: local_intelligence,
    android_probe: android_probe,
    android_mitigation: android_mitigation,
    web_probe: web_probe,
    web_mitigation: web_mitigation,
    firetv_probe: firetv_probe,
    firetv_mitigation: firetv_mitigation,
    ios_probe: ios_probe,
    ios_mitigation: ios_mitigation,
    created_by: "admin@qoe.com", //constatnt
    updated_by: updated_by, //current login user
    created_at: "2022-06-12", //constatnt
    updated_at: updated_at, //current date
  };
  const url = `${globalsettingBaseUrl}api/v1/config?service=mitigation_probe_config_data&version=v1`;
  try {
    const response = await axios.post(url, requestBody);
    const { data } = response;
    //  dispatch(setGlobalsettingPost(data))
    // cb({error: false})
    console.log("--response--", data);
    if (data.msg == "ok") {
      NotificationManager.success(`Updated Succesfully`, "", 400);
    }
  } catch (error) {
    console.log(error);
    //cb({error: true, message: 'Network Error'})
  }
}

//Expert Dashboard sysytem--------------------------start-----------------
async function getAnomaliesDetectData({ payload }) {
  console.log("anomalies-2,,anomalyscore,pagesiz,iterationId", payload);

  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { anomalyscore } = payload;
  const { pagesiz } = payload;
  const { iterationId } = payload;
  const { filters } = payload;
  let filter = {};
  console.log({ filters }, "filter value");
  if (filters?.drm.length > 0) {
    filter["drm"] = ["_in", filters.drm];
  }
  if (filters?.has.length > 0) {
    filter["has"] = ["_in", filters.has];
  }
  if (filters?.contentPartner.length > 0) {
    filter["content_partner"] = ["_in", filters.contentPartner];
  }
  if (filters?.network.length > 0) {
    filter["networkType"] = ["_in", filters.network];
  }
  if (filters?.live.length > 0) {
    let livedata = filters?.live.map((res) => {
      return res == "Yes" ? "true" : "false";
    });
    filter["live"] = ["_in", livedata];
  }
  if (filters?.manufacturer.length > 0) {
    filter["manufacturer"] = ["_in", filters.manufacturer];
  }
  if (filters?.videoId.length > 0) {
    filter["videoid"] = ["_eq", filters.videoId];
  }
  if (filters?.location.length > 0) {
    let temploc = [];
    filters.location.map((res) => {
      temploc.push(res.split("(")[0]);
    });
    filter["location_city"] = ["_in", temploc];
  }
  if (filters?.deviceId.length > 0) {
    filter["device_id"] = ["_eq", filters.deviceId];
  }
  if (filters?.devicePlatform.length > 0) {
    filter["device_platform"] = ["_in", filters.devicePlatform];
  }
  let abcd = anomalyscore.replace(/"/g, "");
  let abcdef = abcd.split(",");
  filter["ANOMALY_SCORE"] = [
    "_range",
    [parseInt(abcdef[0]), parseInt(abcdef[1])],
  ];

  let filterBody = {
    filters: filter,
  };
  console.log({ filter, filterBody });

  const url = `${AnomaliesBaseUrl}/api/GetAnomalySummary?to_time=${toDate}&from_time=${fromDate}&page_size=${pagesiz}&next_iteration_id=${iterationId}`;
  // const url = `${AnomaliesBaseUrl}/api/GetAnomalySummary?to_time=1663940285&from_time=1663853885`
  try {
    const response = await axios.post(url, filterBody);
    const { data } = response;
    let obj = {
      Message: data.Message,
      StatusCode: data.StatusCode,
      data: data.data.sort(function (a, b) {
        var i = new Date(a.dts);
        var j = new Date(b.dts);
        return i > j ? -1 : i < j ? 1 : 0;
      }),
      next_iteration_id: data.next_iteration_id,
      size: data.size,
    };
    dispatch(setAnomaliesDetect(obj));
  } catch (error) {
    console.log(error);
  }
}

async function getSecondAnomaliesDetectData({ payload }) {
  console.log("anomalies-3");

  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { id } = payload;
  const { anomalyScore } = payload;
  let abcd = anomalyScore.replace(/"/g, "");
  let abcdef = abcd.split(",");
  const obj = {
    filters: {
      device_id: ["_eq", id], // "784ce44effe08cc5",

      // "anomaly_score": anomalyScore
      ANOMALY_SCORE: ["_range", [parseInt(abcdef[0]), parseInt(abcdef[1])]],
    },
    groupby: {
      operations: ["count"],
      feilds: ["sessionid"],
    },
  };

  const url = `${AnomaliesBaseUrl}/api/GetAnomalyDetailsByID?to_time=${toDate}&from_time=${fromDate}`;
  //const url = `${AnomaliesBaseUrl}/api/GetAnomalyDetailsByID?to_time=1664002475&from_time=1663916075`
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    console.log("second---", data);
    dispatch(setSecondAnomalies(data));
  } catch (error) {
    console.log(error);
  }
}
async function getThirdAnomaliesDetectData({ payload }) {
  console.log("anomalies-3");

  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { id } = payload;
  const { anomalyScore } = payload;
  const { sessionId } = payload;
  let abcd = anomalyScore.replace(/"/g, "");
  let abcdef = abcd.split(",");
  const obj = {
    filters: {
      device_id: ["_eq", id], // id,// "784ce44effe08cc5",
      sessionid: ["_eq", sessionId], //sessionId,//"3bd1664001731992ca9__1664002062__1664002",
      // "anomaly_score": anomalyScore
      ANOMALY_SCORE: ["_range", [parseInt(abcdef[0]), parseInt(abcdef[1])]],
    },
  };

  const url = `${AnomaliesBaseUrl}/api/GetAnomalyDetailsByID?to_time=${toDate}&from_time=${fromDate}`;
  //const url = `${AnomaliesBaseUrl}/api/GetAnomalyDetailsByID?to_time=1664002475&from_time=1663916075`
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    dispatch(setThirdAnomalies(data));
  } catch (error) {
    console.log(error);
  }
}

async function getCSVAnomaliesDetectData({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { upload_time } = payload;
  const { userid } = payload;
  const { arrdata } = payload;
  const { anomalyname } = payload;
  const { buttonType } = payload;
  console.log("anomalies-anomalyname", buttonType);

  const obj = {
    userid: userid,
    upload_time: upload_time, //1663853885,
    records: arrdata,
  };
  let url = "";
  if (anomalyname == "insession") {
    url = `${AnomaliesBaseUrl}/api/PushLabeledDataRecords`; //?to_time=${toDate}&from_time=${fromDate}`
  } else {
    url = `${AnomaliesBaseUrl}/api/PushLabeledRecordsPlayback`; //?to_time=${toDate}&from_time=${fromDate}`
  }
  //const url = `${AnomaliesBaseUrl}/api/GetAnomalyDetailsByID?to_time=1664002475&from_time=1663916075`
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    dispatch(setCSVAnomalies(data));

    if (data.StatusCode == 200) {
      if (buttonType == "Approve1") {
        NotificationManager.success("Anomaly Approved Successfully", "", 1500);
      } else if (buttonType == "Reject1") {
        NotificationManager.success("Anomaly Rejected Successfully", "", 1500);
      } else {
        NotificationManager.success("Anomaly Uploaded Successfully", "", 1500);
      }
    } else {
      if (data?.missing_cols) {
        NotificationManager.error(
          data.missing_cols,
          "Missing Columns In Your Sheet:-",
          2000
        );
      } else if (data?.extra_cols) {
        NotificationManager.error(
          data.extra_cols,
          "Extra Columns In Your Sheet:-",
          2000
        );
      } else if (data?.allowed_is_approved_values) {
        NotificationManager.error(
          "0 or 1",
          "Add value to Approved column Allowed value is :",
          2000
        );
      } else {
        NotificationManager.error(data.Message, "", 2000);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

//  isme
async function getRCAData({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { page } = payload;
  const { iterationId, filters } = payload;
  let filter = {};
  if (
    filters?.totalAnomalyRecord.length > 0 &&
    filters?.totalAnomalyRecordSign.length > 0
  ) {
    filter["total_anomaly_records"] = [
      filters.totalAnomalyRecordSign,
      Number(filters.totalAnomalyRecord),
    ];
  }
  if (
    filters?.problemScore.length > 0 &&
    filters?.problemScoreSign.length > 0
  ) {
    filter["problem_score"] = [
      filters.problemScoreSign,
      Number(filters.problemScore),
    ];
  }
  if (
    filters?.totalRecords.length > 0 &&
    filters?.totalRecordsSign.length > 0
  ) {
    filter["total_records"] = [
      filters.totalRecordsSign,
      Number(filters.totalRecords),
    ];
  }
  if (
    filters?.upperThresholdData.length > 0 &&
    filters?.upperThresholdSign.length > 0
  ) {
    filter["upper_threshold"] = [
      filters.upperThresholdSign,
      Number(filters.upperThresholdData),
    ];
  }
  let filterBody = {
    filters: filter,
  };
  const url = `${AnomaliesBaseUrl}/api/rca?to_time=${toDate}&from_time=${fromDate}&page_size=${page}&next_iteration_id=${iterationId}`;
  //const url="https://qc7.qoeqoe.com:5010/api/rca?to_time=1680003759&from_time=1677411759&page_size=0&next_iteration_id="
  try {
    const response = await axios.post(url, filterBody);
    const { data } = response;
    dispatch(setRca(data));
  } catch (error) {
    console.log(error);
  }
}

// dusraisme
async function getEstimatedRootSecondFn({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { dimension, filters } = payload;
  const obj = {
    dimension: dimension,
    batch_time: [toDate, fromDate],
  };
  dispatch(setEstimatedRootSecondRequest());
  let filter = {};
  if (
    filters?.totalAnomalyRecord.length > 0 &&
    filters?.totalAnomalyRecordSign.length > 0
  ) {
    filter["total_anomaly_records"] = [
      filters.totalAnomalyRecordSign,
      Number(filters.totalAnomalyRecord),
    ];
  }
  if (
    filters?.problemScore.length > 0 &&
    filters?.problemScoreSign.length > 0
  ) {
    filter["problem_score"] = [
      filters.problemScoreSign,
      Number(filters.problemScore),
    ];
  }
  if (
    filters?.totalRecords.length > 0 &&
    filters?.totalRecordsSign.length > 0
  ) {
    filter["total_records"] = [
      filters.totalRecordsSign,
      Number(filters.totalRecords),
    ];
  }
  if (
    filters?.upperThresholdData.length > 0 &&
    filters?.upperThresholdSign.length > 0
  ) {
    filter["upper_threshold"] = [
      filters.upperThresholdSign,
      Number(filters.upperThresholdData),
    ];
  }
  let filterBody = {
    filters: filter,
    ...obj,
  };
  const url = `${AnomaliesBaseUrl}/api/get_anomalies_for_rca?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, filterBody);
    const { data } = response;
    dispatch(setEstimatedRootSecond(data));
  } catch (error) {
    dispatch(setEstimatedRootSecond([]));
    console.log(error);
  }
}

async function getEstimatedRootRcaBucketFn({ payload }) {
  const { dispatch } = payload;
  const url = `${AnomaliesBaseUrl}/api/rca_buckets`;
  try {
    console.log("url", url);
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setEstimatedRootRcaBucket(data));
  } catch (error) {
    console.log(error);
  }
}
async function getListConfigMitiBucketFn({ payload }) {
  const { dispatch } = payload;
  const url = `${AnomaliesBaseUrl}/api/mitigation_plan`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    dispatch(setConfigMitiListBucket(data.Items));
  } catch (error) {
    console.log(error);
  }
}

async function deleteConfigMitiAndrcaBucketFn({ payload }) {
  const { dispatch } = payload;
  const { name } = payload;
  const { urlendpoint } = payload;
  const { type } = payload;

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = {};
  if (type == "mitigationrca") {
    raw = JSON.stringify({
      plan_name: name,
    });
  } else {
    raw = JSON.stringify({
      bucket_name: name,
    });
  }
  let requestOptions = {
    method: "DELETE",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  console.log(requestOptions);

  const url = `${AnomaliesBaseUrl}/api/${urlendpoint}`;
  try {
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((result) => {
        if (result.StatusCode == 200) {
          NotificationManager.success(result.Message);
        } else {
          NotificationManager.error(result.Message);
        }
      })
      .catch((error) => console.log("error", error));
  } catch (error) {
    console.log("api3--", error);
  }
}

async function getMetigationTypeBucketFn({ payload }) {
  const { dispatch } = payload;
  const url = `${AnomaliesBaseUrl}/api/mitigation_plan`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    console.log("abcd--", data);
    dispatch(setmitigationType([data.Items[0].mitigationType]));
  } catch (error) {
    console.log(error);
  }
}

async function getAddMitigationPlanBucketFn({ payload }) {
  // mitigationType, Recepients,PlanName,Subject
  const { dispatch } = payload;
  const { mitigationType } = payload;
  const { Recepients } = payload;
  const { PlanName } = payload;
  const { Subject } = payload;
  const obj = {
    mitigationType: mitigationType,
    Recepients: Recepients,
    plan_name: PlanName,
    Subject: Subject,
  };
  const url = `${AnomaliesBaseUrl}/api/mitigation_plan`;
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    // dispatch(setEstimatedRootSecond(data))
    if (data.StatusCode == 200) {
      NotificationManager.success("Mitigation Added Succesfully", "", 1500);
    } else {
      NotificationManager.error(data.Message, "", 1500);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getUpdateMitigationPlanBucketFn({ payload }) {
  // mitigationType, Recepients,PlanName,Subject
  const { dispatch } = payload;
  const { mitigationType } = payload;
  const { Recepients } = payload;
  const { PlanName } = payload;
  const { Subject } = payload;
  const obj = {
    mitigationType: mitigationType,
    Recepients: Recepients,
    plan_name: PlanName,
    Subject: Subject,
  };
  const url = `${AnomaliesBaseUrl}/api/mitigation_plan`;
  try {
    const response = await axios.put(url, obj);
    const { data } = response;
    // dispatch(setEstimatedRootSecond(data))
    NotificationManager.success("Mitigation Added Succesfully", "", 1500);
  } catch (error) {
    console.log(error);
  }
}

async function getApplyMitigationForRCAFn({ payload }) {
  //  bucket_name, PlanName,body,records
  const { dispatch } = payload;
  const { bucket_name } = payload;
  const { PlanName } = payload;
  const { body } = payload;
  const { records } = payload;
  const obj = {
    bucket_name: bucket_name,
    plan_name: PlanName,
    body: body,
    records: records,
  };
  const url = `${AnomaliesBaseUrl}/api/apply_mitigation_for_rca`;
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    // dispatch(setEstimatedRootSecond(data))
    if (data.StatusCode == 200) {
      NotificationManager.success("Mitigation Applied Succesfully", "", 1500);
    } else {
      NotificationManager.error(data.Message, "", 1500);
    }
  } catch (error) {
    console.log(error);
  }
}

async function postAddToRCABucketsFn({ payload }) {
  //  bucket_name, PlanName,body,records
  const { dispatch } = payload;
  const { bucket_name } = payload;
  const { PlanName } = payload;
  const obj = {
    bucket_name: bucket_name,
    plan_name: PlanName,
  };
  const url = `${AnomaliesBaseUrl}/api/rca_buckets`;
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    // dispatch(setEstimatedRootSecond(data))
    if (data.StatusCode == 200) {
      NotificationManager.success("RCA Added Succesfully", "", 1500);
    } else {
      NotificationManager.error(data.Message, "", 1500);
    }
  } catch (error) {
    console.log(error);
  }
}
// for the Update RCA
async function postUpdateToRCABucketsFn({ payload }) {
  //  bucket_name, PlanName,body,records
  console.log("in api");
  const { dispatch } = payload;
  const { bucket_name } = payload;
  const { PlanName } = payload;
  const obj = {
    bucket_name: bucket_name,
    plan_name: PlanName,
  };
  const url = `${AnomaliesBaseUrl}/api/rca_buckets`;
  try {
    const response = await axios.put(url, obj);
    const { data } = response;
    // dispatch(setEstimatedRootSecond(data))
    if (data.StatusCode == 200) {
      NotificationManager.success("RCA Updated Succesfully", "", 1500);
    } else {
      NotificationManager.error(data.Message, "", 1500);
    }
  } catch (error) {
    console.log(error);
  }
}

async function postEstimatedRootLabeledDataFn({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { upload_time } = payload;
  const { userid } = payload;
  const { arrdata } = payload;
  const obj = {
    userid: userid,
    upload_time: upload_time, //1663853885,
    records: arrdata,
  };
  const url = `${AnomaliesBaseUrl}/api/PushLabeledDataRecordsRCA`;
  //const url = `${AnomaliesBaseUrl}/api/PushLabeledDataRecordsRCA?to_time=${toDate}&from_time=${fromDate}`
  try {
    const response = await axios.post(url, obj);
    const { data } = response;
    dispatch(setCSVAnomalies(data));

    // if (data.StatusCode == 200) {
    //     NotificationManager.success(data.Message, "", 1500)
    // } else {
    //     NotificationManager.error(data.Message, "", 1500)

    // }

    if (data.StatusCode == 200) {
      NotificationManager.success("RCA Uploaded Successfully", "", 1500);
    } else {
      if (data?.missing_cols) {
        NotificationManager.error(
          data.missing_cols,
          "Missing Columns In Your Sheet:-",
          2000
        );
      } else if (data?.extra_cols) {
        NotificationManager.error(
          data.extra_cols,
          "Extra Columns In Your Sheet:-",
          2000
        );
      } else if (data?.invalid_rca_bucket_values_records) {
        NotificationManager.error(
          data.allowed_rca_bucket_values,
          "RCA Bucket should not be empty . Allowed Bucket Name :",
          4000
        );
      } else {
        NotificationManager.error(data.Message, "", 2000);
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function getAnomaliesDetectDataRecordCSV({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { anomaly_score } = payload;

  const url = `${AnomaliesBaseUrl}/api/GetDetailedAnomalyRecords?to_time=${toDate}&from_time=${fromDate}&anomaly_score=${anomaly_score}`;
  try {
    const response = await axios.post(url, "");
    const { data } = response;
    dispatch(setAnomaliesDetectRecordCSV(data));
  } catch (error) {
    console.log(error);
  }
}

async function getLabeledRecordCSV_API({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { filter } = payload;

  const url = `${AnomaliesBaseUrl}/api/v1/labelledrecords?to_time=${toDate}&from_time=${fromDate}&anomaly_type=${filter.anomaly_type}`;
  try {
    const response = await axios.post(url, "");
    const { data } = response;
    dispatch(setLabeledRecordCSV(data));
  } catch (error) {
    console.log(error);
  }
}

// ekisme

async function getERCauseDataRecordCsv({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { upper_threshold } = payload;

  const url = `${AnomaliesBaseUrl}/api/GetDetailedRCARecords?to_time=${toDate}&from_time=${fromDate}&upper_threshold=${upper_threshold}`;
  try {
    const response = await axios.post(url, "");
    const { data } = response;
    dispatch(setERCauseCSV(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAnomalyPlayBackFailureData({ payload }) {
  //,anomaly_score,pagesize,iterationId
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { anomaly_score } = payload;
  const { pagesize } = payload;
  const { iterationId } = payload;
  const { filters } = payload;
  let filter = {};
  console.log({ filters }, "filters");

  if (filters && filters?.contentPartner.length > 0) {
    filter["content_partner"] = ["_in", filters.contentPartner];
  }
  if (filters && filters?.devicePlatform.length > 0) {
    filter["device_platform"] = ["_in", filters.devicePlatform];
  }
  if (filters && filters?.location.length > 0) {
    let temploc = [];
    filters.location.map((res) => {
      temploc.push(res.split("(")[0]);
    });
    filter["location_city"] = ["_in", temploc];
  }
  if (filters && filters?.errorCode.length > 0) {
    filter["errorcode"] = ["_in", filters.errorCode];
  }

  if (
    filters &&
    filters?.videoId &&
    Object.values(filters?.videoId).length > 0
  ) {
    filter["videoid"] = ["_eq", filters.videoId];
  }
  // if (Object.values(filters?.errorName).length > 0) {
  //     filter["errorname"]  = ["_in", filters.errorName];
  // }
  if (
    filters &&
    Object.values(filters?.errorCount).length > 0 &&
    Object.values(filters?.errorCountSign).length > 0
  ) {
    filter["error_count"] = [filters.errorCountSign, [filters.errorCount]];
  }

  if (filters && Object.values(filters?.errorName).length > 0) {
    filter["errorname"] = ["_in", [filters.errorName]];
  }

  // if (anomaly_score.length > 0) {
  let abcd = anomaly_score.replace(/"/g, "");
  let abcdef = abcd.split(",");
  //  filter["ANOMALY_SCORE"] =["_range",[parseInt(abcdef[0]),parseInt(abcdef[1])]]

  filter["ANOMALY_SCORE"] = [
    "_range",
    [parseInt(abcdef[0]), parseInt(abcdef[1])],
  ];
  // }

  let filterBody = {
    filters: filter,
  };
  const url = `${AnomaliesBaseUrl}/api/v1/playbackfailure_summary?to_time=${toDate}&from_time=${fromDate}&page_size=${pagesize}&next_iteration_id=${iterationId}`;
  try {
    const response = await axios.post(url, filterBody);
    const { data } = response;
    dispatch(setAnomalyPlayBackFailure(data));
  } catch (error) {
    console.log(error);
  }
}

async function getAnomalyPlayBackFailureByVidData({ payload }) {
  const { dispatch } = payload;
  const { toDate } = payload;
  const { fromDate } = payload;
  const { id } = payload;
  const { anomalyScore } = payload;
  // let obj = {
  //     "videoid": id,
  //     "anomaly_score": anomalyScore
  // }

  const { filters } = payload;
  let filter = {};
  console.log({ filters });
  // // if (id.length > 0) {
  filter["videoid"] = ["_eq", id];
  // // }
  // if (filters?.contentPartner.length > 0) {
  //     filter["content_partner"] = ["_in", filters.contentPartner];
  // }
  // if (filters?.devicePlatform.length > 0) {
  //     filter["device_platform"] = ["_in", filters.devicePlatform];
  // }
  // if (filters?.location.length > 0) {
  //     filter["location_city"] = ["_in", filters.location];
  // }

  // if (filters?.errorCode.length > 0) {
  //     filter["errorcode"] = ["_in", filters.errorCode];
  // }

  // if (filters?.errorName.length>0) {
  //     filter["errorname"] = ["_in", [filters.errorName]];
  // }

  // if (filters?.errorCountSign.length>0 && filters?.errorCount.length>0) {

  //     filter["error_count"] = [filters.errorCountSign, [filters.errorCount]];

  // }

  // // if (anomalyScore.length > 0) {
  //  filter["anomaly_score"] = ["_range",[anomalyScore]] //["_in", [anomalyScore]];
  let abcd = anomalyScore.replace(/"/g, "");
  let abcdef = abcd.split(",");
  //  filter["ANOMALY_SCORE"] =["_range",[parseInt(abcdef[0]),parseInt(abcdef[1])]]

  filter["ANOMALY_SCORE"] = [
    "_range",
    [parseInt(abcdef[0]), parseInt(abcdef[1])],
  ];
  // // }

  let filterBody = {
    filters: filter,
  };

  const url = `${AnomaliesBaseUrl}/api/v1/get_summary_by_videoid?to_time=${toDate}&from_time=${fromDate}`;
  try {
    const response = await axios.post(url, filterBody);
    const { data } = response;
    dispatch(setSecondPlayBackFailureAnomalies(data));
  } catch (error) {
    console.log(error);
  }
}

async function getlocationCoordinatesFn({ payload }) {
  const { dispatch, params } = payload;
  let fromDate = Math.floor(new Date().getTime() / 1000.0) - 1 * 60;
  let toDate = Math.floor(new Date().getTime() / 1000.0);
  const url = `${locationBaseUrl}/api/v1/location/MapBlips/?start_time=${fromDate}&end_time=${toDate}`;
  try {
    const response = await axios.post(url, params);
    const { data } = response;
    dispatch(setlocationCoordinates(data));
  } catch (error) {
    console.log(error);
  }
}

async function getErrorLocationCoordinatesFn({ payload }) {
  const { dispatch, params } = payload;
  let fromDate = Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
  let toDate = Math.floor(new Date().getTime() / 1000.0);
  const url = `${locationBaseUrl}/api/v1/location/MapBlips/?start_time=${fromDate}&end_time=${toDate}`;
  try {
    const response = await axios.post(url, params);
    const { data } = response;
    dispatch(setErrorlocationCoordinates(data));
  } catch (error) {
    console.log(error);
  }
}

async function playCountFn({ payload }) {
  const { dispatch, params } = payload;
  let fromDate = Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
  let toDate = Math.floor(new Date().getTime() / 1000.0);
  const url = `${locationBaseUrl}/api/v1/location/geometric-insights/?start_time=${fromDate}&end_time=${toDate}`;
  try {
    const response = await axios.post(url, params);
    const { data } = response;
    dispatch(setPlayCount(data));
  } catch (error) {
    console.log(error);
  }
}

async function playConcurrentCountFn({ payload }) {
  const { dispatch, params } = payload;
  let fromDate = Math.floor(new Date().getTime() / 1000.0) - 1 * 60;
  let toDate = Math.floor(new Date().getTime() / 1000.0);
  const url = `${locationBaseUrl}/api/v1/location/geometric-insights/?start_time=${fromDate}&end_time=${toDate}`;
  //const url = `${locationBaseUrl}/api/v1/location/geometric-insights/?start_time=1668741676&end_time=1668741918`
  try {
    const response = await axios.post(url, params);
    const { data } = response;
    dispatch(setlocationConcurrentCount(data));
  } catch (error) {
    console.log(error);
  }
}

async function errorCountFn({ payload }) {
  const { dispatch, params } = payload;
  let fromDate = Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
  let toDate = Math.floor(new Date().getTime() / 1000.0);
  const url = `${locationBaseUrl}/api/v1/location/geometric-insights/?start_time=${fromDate}&end_time=${toDate}`;
  try {
    const response = await axios.post(url, params);
    const { data } = response;
    dispatch(setErrorCount(data));
  } catch (error) {
    console.log(error);
  }
}

async function getErrorRecordFn({ payload }) {
  const { dispatch, params } = payload;
  const requestOpt = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  };
  const url = `${errorAnalyticsBaseUrl}/api/v1/error_analytics`;
  try {
    const response = await axios.post(url, params, requestOpt);
    console.log({ responseData: response?.data });
    dispatch(setErrorRecord(response?.data));
  } catch (error) {
    console.log(error);
  }
}

export default function* rootSaga() {
  yield all([
    fork(checkVideoFailure),
    fork(getWidgetDataRequest),
    fork(experienceData),
    fork(getThresholds),
    fork(getFilters),
    fork(getConcurrentPlays),
    fork(getTotalMinutesWatched),
    fork(getAveragePercentCompletion),
    fork(getVideoFail),
    fork(getUniqueViewers),
    fork(getUserAttrition),
    fork(getGetRealTimePage),
    fork(getGetUserEngagementPage),
    fork(getGetQualityExperiencePage),
    fork(successfullPlays),
    fork(getRebufferingPercentage),
    fork(getVideoPlaysAndFailure),
    fork(getAverageBitRate),
    fork(getEndedPlay),
    fork(getRebufferingRatio),
    fork(getBandwith),
    fork(getAverageFramrate),
    fork(getEndedPlaysPerUniqueDevice),
    fork(getAttempts),
    fork(getUniqueDevices),
    fork(getMinutesPerUniqueDevices),
    fork(getExitBeforeVideoStart),
    fork(markMetricAsFavorite),
    fork(getFavoriteMetric),
    fork(getValidate),
    fork(getUpdateTask),
    fork(getAllMitigation),
    // fork(toggleMitigation),
    // fork(getAutoMitigationStatus),
    fork(applyManualMitigation),
    fork(getSecondMitigation),
    fork(getThirdMitigation),
    fork(getCities),
    fork(getConnectionInducedRebufferingRatio),
    fork(getMitigationAnalyticsPage),
    fork(getAnomaliesDetectedPage),
    fork(getAnomaliesRCAPage),
    fork(getAnomaliesMitigationPage),
    fork(getAnomaliesClusterPage),
    fork(getAnomaliesClusterSessionPage),
    fork(getVideoStartTime),
    fork(getVideoRestartTime),
    fork(getRenderingQuality),
    fork(notifications),
    fork(getNumberOfMitigationApplied),
    fork(getImprovementInUEI),
    fork(getDegradationInUEI),
    fork(getAverageStartupBufferLength),
    fork(getAverageRebufferingBufferLength),
    fork(getGlobalSetting),
    fork(postGlobalSettingsDs),
    fork(getAnomaliesDetect),
    fork(getSecondAnomaliesDetect),
    fork(getThirdAnomaliesDetect),
    fork(getCSVAnomaliesDetect),
    fork(getRca),
    fork(getAnomaliesDetectRecordCSV),
    fork(getERCauseRecordCsv),
    fork(getEstimatedRootSecond),
    fork(getEstimatedRootRcaBucket),
    fork(getListConfigMitiBucket),
    fork(deleteConfigMitiAndRcaBucket),
    fork(getMetigationTypeBucket),
    fork(postAddMetigationBucUpdate),
    fork(postUpdateMetigationBucUpdate),
    fork(postApplyMetigationForRCA),
    fork(postAddToRCABuckets),
    fork(postUpdateToRCABuckets),
    fork(postEstimatedRootLabeled),
    fork(getAnomalyPlayBackFailure),
    fork(getAnomalyPlayBackFailureByVid),

    fork(getCoordinates),
    fork(getErrorLocationCoordinates),
    fork(errorCounts),
    //  fork(playCounts),
    fork(playConcurrentCounts),
    fork(getErrorRecord),
    //AI
    fork(getMitigationAI),
    fork(getLabeledRecordCSV),
  ]);
}