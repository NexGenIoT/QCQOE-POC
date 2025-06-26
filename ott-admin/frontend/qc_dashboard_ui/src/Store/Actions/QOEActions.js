/**
 * Chat App Actions
 */
 import {
    GET_WIDGET_DATA,
    SET_WIDGET_DATA,
    START_LOADING_QOE,
    STOP_LOADING_QOE,
    EXPERINCE_DATA,
    SET_EXPERINCE_DATA_DEVICE,
    SET_EXPERINCE_DATA_CONTENT,
    GET_THRESHOLD,
    SET_THRESHOLD,
    GET_FILTERS,
    SET_FILTERS,
    GET_VIDEO_FAILURE_DATA,
    SET_VIDEO_FAILURE_DATA,
    GET_CONCURRENT_PLAYS,
    SET_CONCURRENT_PLAYS,
    GET_TOTAL_MINUTES,
    SET_TOTAL_MINUTES,
    GET_AVG_COMPLETION,
    SET_AVG_COMPLETION,
    GET_VIDEO_FAIL,
    SET_VIDEO_FAIL,
    GET_UNIQUE_VIEWERS,
    SET_UNIQUE_VIEWERS,
    GET_USER_ATTRITION,
    SET_USER_ATTRITION,
    GET_SUCCESSFUL_PLAYS,
    SET_SUCCESSFUL_PLAYS,
    GET_REBUFFERING_PERCENTAGE,
    SET_REBUFFERING_PERCENTAGE,
    GET_VIDEO_PLAYS_AND_FAILURE,
    SET_VIDEO_PLAYS_AND_FAILURE,
    GET_AVERAGE_BITRATE,
    SET_AVERAGE_BITRATE,
    GET_ENDED_PLAY,
    SET_ENDED_PLAY,
    GET_REBUFFERING_RATIO,
    SET_REBUFFERING_RATIO,
    GET_REAL_TIME_PAGE_DATA,
    SET_REAL_TIME_PAGE_DATA,
    GET_USER_ENGAGEMENT_PAGE_DATA,
    SET_USER_ENGAGEMENT_PAGE_DATA,
    GET_QUALITY_EXPERIENCE_PAGE_DATA,
    SET_QUALITY_EXPERIENCE_PAGE_DATA,
    SET_METRIC_TYPE,
    CLEAR_ALL_METRICS,
    CLEAR_IMAGE_ASSET_INFO,
    GET_BANDWIDTH,
    SET_BANDWIDTH,
    GET_AVERAGE_FRAME_RATE,
    SET_AVERAGE_FRAME_RATE,
    GET_ENDED_PLAYS_PER_UNIQUE_DEVICE,
    SET_ENDED_PLAYS_PER_UNIQUE_DEVICE,
    GET_ATTEMPTS,
    SET_ATTEMPTS,
    GET_UNIQUE_DEVICES,
    SET_UNIQUE_DEVICES,
    GET_MINUTES_PER_UNIQUE_DEVICES,
    SET_MINUTES_PER_UNIQUE_DEVICES,
    GET_EXIT_BEFORE_VIDEO_START,
    SET_EXIT_BEFORE_VIDEO_START,
    SET_FAVORITE_METRIC,
    GET_FAVORITE_METRIC,
    SET_FAV,
    GET_VALIDATE,
    SET_APPLY_MITIGATION,
    GET_ALL_MITIGATION,
    SET_ALL_MITIGATION,
    TOGGLE_MITIGATION,
    GET_AUTO_MITIGATION_STATUS,
    SET_AUTO_MITIGATION_STATUS,
    APPLY_MANUAL_MITIGATION,
    SET_TAB_VALUE_EXPERT,
    GET_SECOND_MITIGATION,
    SET_SECOND_MITIGATION,
    GET_THIRD_MITIGATION,
    SET_THIRD_MITIGATION,
    CLEAR_ALL_MITIGATION_DATA_TABLE,
    SET_REAL_TIME_PAGE_DATA_COMBINE,
    CLEAR_REAL_TIME_DATA_COMBINE,
    GET_CITIES,
    SET_CITIES,
    SET_TAB_VALUE_MITIGATION,
    GET_CONNECTION_INDUCED_REBIFFERING_RATIO,
    SET_CONNECTION_INDUCED_REBIFFERING_RATIO,
    GET_MITIGATION_ANALYSIS_PAGE_DATA,
    SET_MITIGATION_ANALYSIS_PAGE_DATA,
    GET_ANOMALIES_DETECTED_PAGE_DATA,
    SET_ANOMALIES_DETECTED_PAGE_DATA,
    GET_ANOMALIES_RCA_PAGE_DATA,
    SET_ANOMALIES_RCA_PAGE_DATA, 
    GET_ANOMALIES_MITIGATION_PAGE_DATA,
    SET_ANOMALIES_MITIGATION_PAGE_DATA,
    GET_ANOMALIES_CLUSTER_PAGE_DATA,
    SET_ANOMALIES_CLUSTER_PAGE_DATA,    
    GET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA,
    SET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA,    
    GET_VIDEO_START_TIME,
    SET_VIDEO_START_TIME,
    GET_VIDEO_RESTART_TIME,
    SET_VIDEO_RESTART_TIME,
    GET_RENDERING_QUALITY,
    SET_RENDERING_QUALITY,
    GET_NOTIFICATIONS,
    SET_NOTIFICATIONS,
    GET_NUMBER_OF_MITIGATION_APPLIED,
    SET_NUMBER_OF_MITIGATION_APPLIED,
    GET_IMPROVEMENT_IN_UEI,
    SET_IMPROVEMENT_IN_UEI,
    GET_DEGRADATION_IN_UEI,
    SET_DEGRADATION_IN_UEI,
    GET_AVERAGE_STARTUP_BUFFER_LENGTH,
    SET_AVERAGE_STARTUP_BUFFER_LENGTH,
    GET_AVERAGE_REBUFFERING_BUFFER_LENGTH,
    SET_AVERAGE_REBUFFERING_BUFFER_LENGTH,
    GET_TASK_STATUS,
    SET_TASK_STATUS,
    GET_GLOBAL_SETTING,
    SET_GLOBAL_SETTING,
    GET_GLOBAL_SETTING_POST,
    SET_GLOBAL_SETTING_POST,
    SET_ANOMALIES_DETECT_POST,
    GET_ANOMALIES_DETECT_POST,
    GET_RCA_POST,
    SET_RCA_POST,
    GET_SECOND_ANOMALIES_DETECT_POST,
    SET_SECOND_ANOMALIES_DETECT_POST,
    GET_CSV_ANOMALIES_DETECT_POST,
    SET_CSV_ANOMALIES_DETECT_POST,
    GET_THIRD_ANOMALIES_DETECT_POST,
    SET_THIRD_ANOMALIES_DETECT_POST,
    GET_ESTIMATED_ROOT_SECOND_POST,
    SET_ESTIMATED_ROOT_SECOND_POST,
    GET_ESTIMATED_ROOT_RCA_BUCKET,
    SET_ESTIMATED_ROOT_RCA_BUCKET,
    GET_CONFIG_MITI_BUCKET,
    SET_CONFIG_MITI_BUCKET,
    GET_ADD_MITIGATION_BUCKET,
    GET_UPDATE_MITIGATION_BUCKET,
    GET_METIGATION_TYPE_BUCKET,
    SET_METIGATION_TYPE_BUCKET,
    GET_APPLY_MITIGATION_FOR_RCA,
    GET_ADD_TO_RCA_BUCKETS,
    GET_UPDATE_TO_RCA_BUCKETS,
    GET_LABLED_DATA_RECORDS_POST,
    GET_LOCATION_COORDINATES,
    SET_LOCATION_COORDINATES,
    GET_PLAY_COUNT,
    SET_PLAY_COUNT,
    GET_ERROR_COUNT,
    GET_ERROR_LOCATION_COORDINATES,
    SET_ERROR_LOCATION_COORDINATES,
    SET_ERROR_COUNT,
    SET_METRIC_TYPE_FULLNAME,
    GET_CONCURRENT_COUNT,
    SET_CONCURRENT_COUNT,
    GET_ANOMALIES_DETECT_POST_RECORD_CSV,
    SET_ANOMALIES_DETECT_POST_RECORD_CSV,
    GET_ERC_POST_RECORD_CSV,
    SET_ERC_POST_RECORD_CSV,
    DELETE_CONFIG_MITI_BUCKET,
    GET_NOTIFICATION,
    SET_NOTIFICATION,
    SET_ERROR_RECORDS_DATA,
    GET_ERROR_RECORDS_DATA,
    SET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
    GET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
    GET_ANOMALIES_PLAYBACK_FAILURE_POST,
    SET_ANOMALIES_PLAYBACK_FAILURE_POST,
    GET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST,
    SET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST,
    SET_MITIGATION_AI,
    GET_MITIGATION_AI,
    GET_DOWNLOAD_LABELED_RECORD_CSV,
    SET_DOWNLOAD_LABELED_RECORD_CSV,
 } from 'Store/Actions/types';
 
 export const getWidgetDataRequest = (matrics_name,dispatch, loader) => ({
    type: GET_WIDGET_DATA,
    payload: {matrics_name,dispatch, loader}
 });

 export const storeWidgetData = (data) => ({
    type: SET_WIDGET_DATA,
    payload: data
 })

 export const startLoadingQOE = () => ({
    type: START_LOADING_QOE,
 })

 export const stoptLoadingQOE = () => ({
    type: STOP_LOADING_QOE,
 })


 export const experienceData = (matricsName, group, isDevice, dispatch) => ({
   type: EXPERINCE_DATA,
   payload:{matricsName, group, isDevice, dispatch}
})

export const storeExperinceDataDevice = (data) => ({
   type: SET_EXPERINCE_DATA_DEVICE,
   payload: data
})

export const storeExperinceDataContent = (data) => ({
   type: SET_EXPERINCE_DATA_CONTENT,
   payload: data
})

export const getThresholds = (dispatch) => ({
   type: GET_THRESHOLD,
   payload: dispatch
})

export const storeThresholdData = (data) => ({
   type: SET_THRESHOLD,
   payload: data
})

export const getUniqueFilters = (dispatch) => ({
   type: GET_FILTERS,
   payload: dispatch
})

export const storeFiltersData = (data) => ({
   type: SET_FILTERS,
   payload: data
})
export const checkVideoFailure = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_VIDEO_FAILURE_DATA,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const storeVideoFailureData = (data) => ({
   type: SET_VIDEO_FAILURE_DATA,
   payload: data
});

export const getConcurrentPlays = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_CONCURRENT_PLAYS,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setConcurrentPlays = (data) => ({
   type: SET_CONCURRENT_PLAYS,
   payload: data
});

export const getTotalMinutesWatched = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_TOTAL_MINUTES,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setTotalMinutesWatched = (data) => ({
   type: SET_TOTAL_MINUTES,
   payload: data
});

export const getAveragePercentCompletion = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_AVG_COMPLETION,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setAveragePercentCompletion = (data) => ({
   type: SET_AVG_COMPLETION,
   payload: data
});

export const getVideoFailures = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_VIDEO_FAIL,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setVideoFailures = (data) => ({
   type: SET_VIDEO_FAIL,
   payload: data
});

export const getUniqueViewers = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_UNIQUE_VIEWERS,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setUniqueViewers = (data) => ({
   type: SET_UNIQUE_VIEWERS,
   payload: data
});

export const getUniqueDevices = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_UNIQUE_DEVICES,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setUniqueDevices = (data) => ({
   type: SET_UNIQUE_DEVICES,
   payload: data
});

export const getMinutesPerUniqueDevices = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_MINUTES_PER_UNIQUE_DEVICES,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setMinutesPerUniqueDevices = (data) => ({
   type: SET_MINUTES_PER_UNIQUE_DEVICES,
   payload: data
});

export const getUserAttrition = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_USER_ATTRITION,
   payload: {dispatch, toDate, fromDate, agr,location}
});

export const setUserAttrition = (data) => ({
   type: SET_USER_ATTRITION,
   payload: data
});


export const getRealTimePage = (dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform) => ({
   type: GET_REAL_TIME_PAGE_DATA,
   payload:{dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform}
})

export const setRealTimePage = (data) => ({
   type: SET_REAL_TIME_PAGE_DATA,
   payload:data
})

export const getMitigationAnalyticsPage = (dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform,sourceD) => ({
   type: GET_MITIGATION_ANALYSIS_PAGE_DATA,
   payload:{dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform,sourceD}
})

export const setMitigationAnalyticsPage = (data) => ({
   type: SET_MITIGATION_ANALYSIS_PAGE_DATA,
   payload:data
})

export const getAnomaliesDetectedPage = (dispatch, toDate, fromDate, interval) => ({
   type: GET_ANOMALIES_DETECTED_PAGE_DATA,
   payload:{dispatch, toDate, fromDate, interval}
})

export const setAnomaliesDetectedPage = (data) => ({
   type: SET_ANOMALIES_DETECTED_PAGE_DATA,
   payload:data
})

export const getAnomaliesRCAPage = (dispatch, toDate, fromDate, interval) => ({
   type: GET_ANOMALIES_RCA_PAGE_DATA,
   payload:{dispatch, toDate, fromDate, interval}
})

export const setAnomaliesRCAPage = (data) => ({
   type: SET_ANOMALIES_RCA_PAGE_DATA,
   payload:data
})

export const getAnomaliesMitigationPage = (dispatch, toDate, fromDate,interval) => ({
   type: GET_ANOMALIES_MITIGATION_PAGE_DATA,
   payload:{dispatch, toDate, fromDate,interval}
})

export const setAnomaliesMitigationPage = (data) => ({
   type: SET_ANOMALIES_MITIGATION_PAGE_DATA,
   payload:data
})

export const getAnomaliesClusterPage = (dispatch, toDate, fromDate) => ({
   type: GET_ANOMALIES_CLUSTER_PAGE_DATA,
   payload:{dispatch, toDate, fromDate}
})

export const setAnomaliesClusterPage = (data) => ({
   type: SET_ANOMALIES_CLUSTER_PAGE_DATA,
   payload:data
})

export const getAnomaliesClusterSessionPage = (dispatch, toDate, fromDate) => ({
   type: GET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA,
   payload:{dispatch, toDate, fromDate}
})

export const setAnomaliesClusterSessionPage = (data) => ({
   type: SET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA,
   payload:data
})

export const setRealTimePageCombine = (data) => ({
   type: SET_REAL_TIME_PAGE_DATA_COMBINE,
   payload:data
})

export const clearRealTimeDataCombine = () => ({
   type: CLEAR_REAL_TIME_DATA_COMBINE,
})

export const getUserEngagementPage = (dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform) => ({
   type: GET_USER_ENGAGEMENT_PAGE_DATA,
   payload:{dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform}
})

export const setUserEngagementPage = (data) => ({
   type: SET_USER_ENGAGEMENT_PAGE_DATA,
   payload:data
})

export const getQualityExperiencePage = (dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform) => ({
   type: GET_QUALITY_EXPERIENCE_PAGE_DATA,
   payload:{dispatch, cdn, contentType, contentPartner, location, metric,toDate, fromDate, aggregationInterval, devicePlatform}
})

export const setQualityExperiencePage = (data) => ({
   type: SET_QUALITY_EXPERIENCE_PAGE_DATA,
   payload:data
})

export const successfullPlays = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_SUCCESSFUL_PLAYS,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setSuccessfullPlays = (data) => ({
   type: SET_SUCCESSFUL_PLAYS,
   payload: data
})

export const getRebufferingPercentage = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_REBUFFERING_PERCENTAGE,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setRebufferingPercentage = (data) => ({
   type: SET_REBUFFERING_PERCENTAGE,
   payload: data
})

export const getVideoPlaysAndFailure = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_VIDEO_PLAYS_AND_FAILURE,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setVideoPlaysAndFailure = (data) => ({
   type: SET_VIDEO_PLAYS_AND_FAILURE,
   payload: data
})

export const getAverageBitRate = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_AVERAGE_BITRATE,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setAverageBitRate = (data) => ({
   type: SET_AVERAGE_BITRATE,
   payload: data
})

export const getExitBeforeVideoStart = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_EXIT_BEFORE_VIDEO_START,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setExitBeforeVideoStart = (data) => ({
   type: SET_EXIT_BEFORE_VIDEO_START,
   payload: data
})

export const getConnectionInducedRebufferingRatio = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_CONNECTION_INDUCED_REBIFFERING_RATIO,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setConnectionInducedRebufferingRatio = (data) => ({
   type: SET_CONNECTION_INDUCED_REBIFFERING_RATIO,
   payload: data
})

export const getVideoStartTime = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_VIDEO_START_TIME,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setVideoStartTime = (data) => ({
   type: SET_VIDEO_START_TIME,
   payload: data
})

export const getVideoRestartTime = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_VIDEO_RESTART_TIME,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setVideoRestartTime = (data) => ({
   type: SET_VIDEO_RESTART_TIME,
   payload: data
})

export const getRenderingQuality = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_RENDERING_QUALITY,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setRenderingQuality = (data) => ({
   type: SET_RENDERING_QUALITY,
   payload: data
})

export const getEndedPlay = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_ENDED_PLAY,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setEndedPlay = (data) => ({
   type: SET_ENDED_PLAY,
   payload: data
})

export const getRebufferingRatio = (dispatch, toDate, fromDate,agr,location) => ({
   type: GET_REBUFFERING_RATIO,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setRebufferingRatio = (data) => ({
   type: SET_REBUFFERING_RATIO,
   payload: data
})

export const getBandwith = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_BANDWIDTH,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setBandwidth = (data) => ({
   type: SET_BANDWIDTH,
   payload: data
})

export const getAverageFramrate = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_AVERAGE_FRAME_RATE,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setAverageFramrate = (data) => ({
   type: SET_AVERAGE_FRAME_RATE,
   payload: data
})

export const getEndedPlaysPerUniqueDevice = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_ENDED_PLAYS_PER_UNIQUE_DEVICE,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setEndedPlaysPerUniqueDevice = (data) => ({
   type: SET_ENDED_PLAYS_PER_UNIQUE_DEVICE,
   payload: data
})

export const getAttempts = (dispatch, toDate, fromDate, agr,location) => ({
   type: GET_ATTEMPTS,
   payload: {dispatch, toDate, fromDate, agr,location}
})

export const setAttempts = (data) => ({
   type: SET_ATTEMPTS,
   payload: data
})

export const setMetricType = (type) => ({
   type: SET_METRIC_TYPE,
   payload: type
})

export const clearAllMetrics = () => ({
   type: CLEAR_ALL_METRICS,
})

export const clearAssetInfoData = () => ({
   type: CLEAR_IMAGE_ASSET_INFO,
})

export const markMetricAsFavorite = (selectedMetric, cb) => ({
   type: SET_FAVORITE_METRIC,
   payload: {selectedMetric, cb}
})

export const getFavoriteMetrics = (dispatch) => ({
   type: GET_FAVORITE_METRIC,
   payload: dispatch
})

export const setFav = (data) => ({
   type: SET_FAV,
   payload: data
})
export const getValidate = (tags, platform, location, mitigation_status, uei_condition,rebuffering_duration,startup_buffer_length,start_bitrate,stall_count, dispatch, cb) => ({
   type: GET_VALIDATE,
  // payload: {tags, platform, location, bufferLength, rebufferDuration, bitrate, dispatch, cb}
   payload: {tags, platform, location,mitigation_status,uei_condition,rebuffering_duration,startup_buffer_length,start_bitrate,stall_count, dispatch, cb}

})

export const getUpdateTask = (payloads, dispatch, cb) => ({
   type: GET_TASK_STATUS,
   payload: {payloads, dispatch, cb}

})

export const setApplyMitigtationData = (data) => ({
   type: SET_APPLY_MITIGATION,
   payload: data
})
export const setStatusLogDetailTableData = (data) => ({
   type: SET_TASK_STATUS,
   payload: data
})

export const getAllMitigation = (dispatch, to_time, from_time) => ({
   type: GET_ALL_MITIGATION,
   payload: {dispatch, to_time, from_time}
})

export const setAllMitigationData = (data) => ({
   type: SET_ALL_MITIGATION,
   payload: data
})

export const getSecondMitigation = (id, dispatch, cb) => ({
   type: GET_SECOND_MITIGATION,
   payload: {id, dispatch, cb}
})

export const setSecondMitigationData = (data) => ({
   type: SET_SECOND_MITIGATION,
   payload: data
})

export const getThirdMitigation = (id, dispatch) => ({
   type: GET_THIRD_MITIGATION,
   payload: {id, dispatch}
})

export const setThirdMitigationData = (data) => ({
   type: SET_THIRD_MITIGATION,
   payload: data
})

export const clearAllMitigationData = () => ({
   type: CLEAR_ALL_MITIGATION_DATA_TABLE,
})

// export const getAutoMitigationStatus = (dispatch) => ({
//    type: GET_AUTO_MITIGATION_STATUS,
//    payload: {dispatch}
// })

export const setAutoMitigationStatus = (data) => ({
   type: SET_AUTO_MITIGATION_STATUS,
   payload: data
})

export const getCities = (dispatch) => ({
   type: GET_CITIES,
   payload: {dispatch}
})

export const setCities = (data) => ({
   type: SET_CITIES,
   payload: data
})

// export const toggleMitigation = (data, dispatch, cb) => ({
//    type: TOGGLE_MITIGATION,
//    payload: {data, dispatch, cb}
// })

export const applyManualMitigation = (data, cb) => ({
   type: APPLY_MANUAL_MITIGATION,
   payload: {data, cb}
})

export const setTabsValueExpert = (data) => ({
   type: SET_TAB_VALUE_EXPERT,
   payload: data
})

export const setTabValueMitigation = (data) => ({
   type: SET_TAB_VALUE_MITIGATION,
   payload: data
})

export const getNotification = (dispatch) => ({
   type: GET_NOTIFICATIONS,
   payload: {dispatch}
})

export const setNotification = (data) => ({
   type: SET_NOTIFICATIONS,
   payload: data
})

export const getNumberOfMitigationApplied = (dispatch, toDate, fromDate, agr,sourceD) => ({
   type: GET_NUMBER_OF_MITIGATION_APPLIED,
   payload: {dispatch, toDate, fromDate, agr,sourceD}
})

export const setNumberOfMitigationApplied = (data) => ({
   type: SET_NUMBER_OF_MITIGATION_APPLIED,
   payload: data
})

export const getImprovementInUEI = (dispatch, toDate, fromDate, agr,sourceD) => ({
   type: GET_IMPROVEMENT_IN_UEI,
   payload: {dispatch, toDate, fromDate, agr,sourceD}
})

export const setImprovementInUEI = (data) => ({
   type: SET_IMPROVEMENT_IN_UEI,
   payload: data
})

export const getDegradationInUEI = (dispatch, toDate, fromDate, agr,sourceD) => ({
   type: GET_DEGRADATION_IN_UEI,
   payload: {dispatch, toDate, fromDate, agr,sourceD}
})

export const setDegradationInUEI = (data) => ({
   type: SET_DEGRADATION_IN_UEI,
   payload: data
})

export const getAverageStartupBufferLength = (dispatch, toDate, fromDate, agr,sourceD) => ({
   type: GET_AVERAGE_STARTUP_BUFFER_LENGTH,
   payload: {dispatch, toDate, fromDate, agr,sourceD}
})

export const setAverageStartupBufferLength = (data) => ({
   type: SET_AVERAGE_STARTUP_BUFFER_LENGTH,
   payload: data
})

export const getAverageRebufferingBufferLength = (dispatch, toDate, fromDate, agr,sourceD) => ({
   type: GET_AVERAGE_REBUFFERING_BUFFER_LENGTH,
   payload: {dispatch, toDate, fromDate, agr,sourceD}
})

export const setAverageRebufferingBufferLength = (data) => ({
   type: SET_AVERAGE_REBUFFERING_BUFFER_LENGTH,
   payload: data
})

export const getGlobalSetting = (dispatch) => ({
   type: GET_GLOBAL_SETTING,
   payload: {dispatch}
})

export const setGlobalSetting = (data) => ({
   type: SET_GLOBAL_SETTING,
   payload: data
})
export const setGlobalsettingPost = (dispatch, local_intelligence, android_probe,android_mitigation,web_probe,web_mitigation,firetv_probe,firetv_mitigation,ios_probe,ios_mitigation,updated_by,updated_at) => ({
   type: GET_GLOBAL_SETTING_POST,
   payload: {dispatch, local_intelligence, android_probe,android_mitigation,web_probe,web_mitigation,firetv_probe,firetv_mitigation,ios_probe,ios_mitigation,updated_by,updated_at}
})

export const getGlobalsettingPost = (data) => ({
   type: SET_GLOBAL_SETTING_POST,
   payload: data
})

export const getAnomaliesDetect = (dispatch, toDate, fromDate,anomalyscore,pagesiz,iterationId, filters) => ({
   type: GET_ANOMALIES_DETECT_POST,
   payload: {dispatch, toDate, fromDate,anomalyscore,pagesiz,iterationId, filters}
});

export const setAnomaliesDetect = (data) => ({
   type: SET_ANOMALIES_DETECT_POST,
   payload: data
});

export const getSecondAnomalies = (dispatch,id,anomalyScore,toDate, fromDate) => ({
   type: GET_SECOND_ANOMALIES_DETECT_POST,
   payload: {dispatch,id,anomalyScore,toDate, fromDate}
})

export const setSecondAnomalies = (data) => ({
   type: SET_SECOND_ANOMALIES_DETECT_POST,
   payload: data
})
export const getThirdAnomalies = (dispatch,id,sessionId,anomalyScore,toDate, fromDate) => ({
   type: GET_THIRD_ANOMALIES_DETECT_POST,
   payload: {dispatch,id,sessionId,anomalyScore,toDate, fromDate}
})

export const setThirdAnomalies = (data) => ({
   type: SET_THIRD_ANOMALIES_DETECT_POST,
   payload: data
})
export const getCSVAnomalies = (dispatch,userid,upload_time,toDate, fromDate,arrdata,anomalyname,buttonType) => ({
   type: GET_CSV_ANOMALIES_DETECT_POST,
   payload: {dispatch,userid,upload_time,toDate,fromDate,arrdata,anomalyname,buttonType}
  // payload: {dispatch,userid,upload_time,toDate,fromDate,device_platform,content_partner,cdn,device_id,location_city,networktype,live,drm,has,manufacturer,m_rebuffering_ratio,m_bandwidth,m_video_start_time,dts,anomaly_id,sessionid,anomaly_score}

})

export const setCSVAnomalies = (data) => ({
   type: SET_CSV_ANOMALIES_DETECT_POST,
   payload: data
})

export const getRca = (dispatch, toDate, fromDate,page,iterationId, filters) => ({
   type: GET_RCA_POST,
   payload: {dispatch, toDate, fromDate,page,iterationId, filters}
});

export const setRca = (data) => ({
   type: SET_RCA_POST,
   payload: data
});

export const getEstimatedRootSecond = (dispatch, toDate, fromDate, dimension, filters) => ({
   type: GET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
   payload: {dispatch, toDate, fromDate, dimension, filters}
});

export const setEstimatedRootSecond  = (data) => ({
   type: SET_ESTIMATED_ROOT_SECOND_POST,
   payload: data
});

export const setEstimatedRootSecondRequest  = () => ({
   type: SET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
});

export const getEstimatedRootRcaBucket = (dispatch) => ({
   type: GET_ESTIMATED_ROOT_RCA_BUCKET,
   payload: {dispatch}
});

export const setEstimatedRootRcaBucket = (data) => ({
   type: SET_ESTIMATED_ROOT_RCA_BUCKET,
   payload: data
});
export const getConfigMitiListBucket = (dispatch) => ({
   type: GET_CONFIG_MITI_BUCKET,
   payload: {dispatch}
});

export const setConfigMitiListBucket = (data) => ({
   type: SET_CONFIG_MITI_BUCKET,
   payload: data
});
export const deletConfigMitiListAndRcaBucket = (dispatch,name,urlendpoint,type) => ({
   type: DELETE_CONFIG_MITI_BUCKET,
   payload: {dispatch,name,urlendpoint,type}
});

export const getmitigationType = (dispatch) => ({
   type: GET_METIGATION_TYPE_BUCKET,
   payload: {dispatch}
});

export const setmitigationType = (data) => ({
   type: SET_METIGATION_TYPE_BUCKET,
   payload: data
});

export const postAddMitigation = (dispatch, mitigationType, Recepients,PlanName,Subject) => ({
   type: GET_ADD_MITIGATION_BUCKET,
   payload: {dispatch,  mitigationType, Recepients,PlanName,Subject}
});
export const postUpdateMitigation = (dispatch, mitigationType, Recepients,PlanName,Subject) => ({
   type: GET_UPDATE_MITIGATION_BUCKET,
   payload: {dispatch,  mitigationType, Recepients,PlanName,Subject}
});

export const postApplyMitigationForRCA = (dispatch, bucket_name, PlanName,body,records) => ({
   type: GET_APPLY_MITIGATION_FOR_RCA,
   payload: {dispatch, bucket_name, PlanName,body,records}
});

export const postAddToRCABuckets = (dispatch, bucket_name, PlanName) => ({
   type: GET_ADD_TO_RCA_BUCKETS,
   payload: {dispatch, bucket_name, PlanName}
});

export const postUpdateToRCABuckets = (dispatch, bucket_name, PlanName) => ({
   type: GET_UPDATE_TO_RCA_BUCKETS,
   payload: {dispatch, bucket_name, PlanName}
});
export const postEstimatedRootLabeled = (dispatch,userid,upload_time,toDate, fromDate,arrdata) => ({
   type: GET_LABLED_DATA_RECORDS_POST,
   payload: {dispatch,userid,upload_time,toDate,fromDate,arrdata}
  // payload: {dispatch,userid,upload_time,toDate,fromDate,device_platform,content_partner,cdn,device_id,location_city,networktype,live,drm,has,manufacturer,m_rebuffering_ratio,m_bandwidth,m_video_start_time,dts,anomaly_id,sessionid,anomaly_score}

})

export const getAnomalyPlayBackFailure= (dispatch, toDate, fromDate,anomaly_score,pagesize,iterationId, filters) => ({
   type: GET_ANOMALIES_PLAYBACK_FAILURE_POST,
   payload: {dispatch, toDate, fromDate,anomaly_score,pagesize,iterationId, filters}
});

export const setAnomalyPlayBackFailure = (data) => ({
   type: SET_ANOMALIES_PLAYBACK_FAILURE_POST,
   payload: data
});

export const getSecondPlayBackFailureAnomalies = (dispatch,id,anomalyScore,toDate, fromDate, filters) => ({
   type: GET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST,
   payload: {dispatch,id,anomalyScore,toDate, fromDate, filters}
})

export const setSecondPlayBackFailureAnomalies = (data) => ({
   type: SET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST,
   payload: data
})

export const setMetricTypeFullName = (type) => ({
   type: SET_METRIC_TYPE_FULLNAME,
   payload: type
})


export const getlocationCoordinates = (dispatch, params) => ({
   type: GET_LOCATION_COORDINATES,
   payload: {dispatch, params}
});

export const setlocationCoordinates = (data) => ({
   type: SET_LOCATION_COORDINATES,
   payload: data
});

export const getErrorlocationCoordinates = (dispatch, params) => ({
   type: GET_ERROR_LOCATION_COORDINATES,
   payload: {dispatch, params}
});

export const setErrorlocationCoordinates = (data) => ({
   type: SET_ERROR_LOCATION_COORDINATES,
   payload: data
});

export const getPlayCount = (dispatch, params) => ({
   type: GET_PLAY_COUNT,
   payload: {dispatch, params}
});

export const setPlayCount = (data) => ({
   type: SET_PLAY_COUNT,
   payload: data
});

export const getErrorCount = (dispatch, params) => ({
   type: GET_ERROR_COUNT,
   payload: {dispatch, params}
});

export const setErrorCount = (data) => ({
   type: SET_ERROR_COUNT,
   payload: data
});

export const getlocationConcurrentCount = (dispatch, params) => ({
   type: GET_CONCURRENT_COUNT,
   payload: {dispatch, params}
});

export const setlocationConcurrentCount = (data) => ({
   type: SET_CONCURRENT_COUNT,
   payload: data
});

export const getAnomaliesDetectRecordCSV = (dispatch, toDate, fromDate,anomaly_score) => ({
   type: GET_ANOMALIES_DETECT_POST_RECORD_CSV,
   payload: {dispatch, toDate, fromDate,anomaly_score}
});

export const setAnomaliesDetectRecordCSV = (data) => ({
   type: SET_ANOMALIES_DETECT_POST_RECORD_CSV,
   payload: data
});

export const getLabeledRecordCSV = (dispatch, toDate, fromDate,filter) => ({
   type: GET_DOWNLOAD_LABELED_RECORD_CSV,
   payload: {dispatch, toDate, fromDate,filter}
});

export const setLabeledRecordCSV = (data) => ({
   type: SET_DOWNLOAD_LABELED_RECORD_CSV,
   payload: data
});

export const getERCauseCSV = (dispatch, toDate, fromDate,upper_threshold) => ({
   type: GET_ERC_POST_RECORD_CSV,
   payload: {dispatch, toDate, fromDate,upper_threshold}
});

export const setERCauseCSV = (data) => ({
   type: SET_ERC_POST_RECORD_CSV,
   payload: data
});

export const getNotifications = (dispatch) => ({
   type: GET_NOTIFICATION,
   payload: { dispatch },
});

export const setNotifications = (data) => ({
   type: SET_NOTIFICATION,
   payload: data,
})
export const getErrorRecord = (dispatch, params) => ({
   type: GET_ERROR_RECORDS_DATA,
   payload: {dispatch, params},
});

export const setErrorRecord = (data) => ({
   type: SET_ERROR_RECORDS_DATA,
   payload: data,
});

export const getMitigationAI = (dispatch,isAI,gid) => ({
   type: GET_MITIGATION_AI,
   payload: {dispatch,isAI,gid}
})

export const setMitigationAIData = (data) => ({
   type: SET_MITIGATION_AI,
   payload: data
})

