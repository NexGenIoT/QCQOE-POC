/**
 * CRM Reducer
 */
//action types
import {
  SET_WIDGET_DATA,
  START_LOADING_QOE,
  STOP_LOADING_QOE,
  SET_EXPERINCE_DATA_DEVICE,
  SET_EXPERINCE_DATA_CONTENT,
  SET_THRESHOLD,
  SET_FILTERS,
  SET_VIDEO_FAILURE_DATA,
  SET_CONCURRENT_PLAYS,
  SET_TOTAL_MINUTES,
  SET_AVG_COMPLETION,
  SET_VIDEO_FAIL,
  SET_UNIQUE_VIEWERS,
  SET_USER_ATTRITION,
  SET_SUCCESSFUL_PLAYS,
  SET_REBUFFERING_PERCENTAGE,
  SET_VIDEO_PLAYS_AND_FAILURE,
  SET_AVERAGE_BITRATE,
  SET_EXIT_BEFORE_VIDEO_START,
  SET_CONNECTION_INDUCED_REBIFFERING_RATIO,
  SET_VIDEO_START_TIME,
  SET_VIDEO_RESTART_TIME,
  SET_RENDERING_QUALITY,
  SET_ENDED_PLAY,
  SET_REBUFFERING_RATIO,
  SET_BANDWIDTH,
  SET_AVERAGE_FRAME_RATE,
  SET_UNIQUE_DEVICES,
  SET_MINUTES_PER_UNIQUE_DEVICES,
  SET_ENDED_PLAYS_PER_UNIQUE_DEVICE,
  SET_ATTEMPTS,
  SET_REAL_TIME_PAGE_DATA,
  SET_MITIGATION_ANALYSIS_PAGE_DATA,
  SET_ANOMALIES_DETECTED_PAGE_DATA,
  SET_ANOMALIES_RCA_PAGE_DATA,
  SET_ANOMALIES_MITIGATION_PAGE_DATA,
  SET_ANOMALIES_CLUSTER_PAGE_DATA,
  SET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA,
  SET_REAL_TIME_PAGE_DATA_COMBINE,
  CLEAR_REAL_TIME_DATA_COMBINE,
  SET_USER_ENGAGEMENT_PAGE_DATA,
  SET_QUALITY_EXPERIENCE_PAGE_DATA,
  SET_METRIC_TYPE,
  CLEAR_ALL_METRICS,
  SET_FAV,
  SET_APPLY_MITIGATION,
  SET_ALL_MITIGATION,
  SET_SECOND_MITIGATION,
  SET_THIRD_MITIGATION,
  CLEAR_ALL_MITIGATION_DATA_TABLE,
  SET_AUTO_MITIGATION_STATUS,
  SET_CITIES,
  SET_NOTIFICATIONS,
  SET_TAB_VALUE_EXPERT,
  SET_TAB_VALUE_MITIGATION,
  SET_NUMBER_OF_MITIGATION_APPLIED,
  SET_IMPROVEMENT_IN_UEI,
  SET_DEGRADATION_IN_UEI,
  SET_AVERAGE_STARTUP_BUFFER_LENGTH,
  SET_AVERAGE_REBUFFERING_BUFFER_LENGTH,
  SET_TASK_STATUS,
  SET_GLOBAL_SETTING,
  SET_GLOBAL_SETTING_POST,
  SET_ANOMALIES_DETECT_POST,
  SET_RCA_POST,
  SET_SECOND_ANOMALIES_DETECT_POST,
  SET_CSV_ANOMALIES_DETECT_POST,
  SET_THIRD_ANOMALIES_DETECT_POST,
  SET_ESTIMATED_ROOT_SECOND_POST,
  SET_ESTIMATED_ROOT_RCA_BUCKET,
  SET_CONFIG_MITI_BUCKET,
  SET_METIGATION_TYPE_BUCKET,
  SET_LOCATION_COORDINATES,
  SET_PLAY_COUNT,
  SET_ERROR_LOCATION_COORDINATES,
  SET_ERROR_COUNT,
  SET_METRIC_TYPE_FULLNAME,
  SET_CONCURRENT_COUNT,
  SET_ERC_POST_RECORD_CSV,
  SET_ANOMALIES_DETECT_POST_RECORD_CSV,
  SET_NOTIFICATION,
  SET_ERROR_RECORDS_DATA,
  SET_ESTIMATED_ROOT_SECOND_POST_REQUEST,
  SET_ANOMALIES_PLAYBACK_FAILURE_POST,
  SET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST,
  SET_MITIGATION_AI,
  SET_DOWNLOAD_LABELED_RECORD_CSV
} from '../Actions/types';

const INITIAL_STATE = {
  widgetData: [],
  loading: false,
  devicePlatformData: [],
  contentPartnerData: [],
  threshHold: {},
  filters: {},
  device_platform: [],
  experienceData: [],
  video_start_failures: {},
  concurrent_plays: {},
  average_percentage_completion: {},
  total_minutes_watched: {},
  number_of_mitigations_applied: {},
  improvement_in_uei: {},
  degradation_in_uei: {},
  average_startup_buffer_length: {},
  average_rebuffering_buffer_length: {},
  video_playback_failures: {},
  succesful_plays: {},
  rebuffering_percentage: {},
  play_attempts: {},
  average_bitrate: {},
  exit_before_video_starts: {},
  connection_induced_rebuffering_ratio: {},
  video_start_time: {},
  video_restart_time: {},
  rendering_quality: {},
  ended_plays: {},
  rebuffering_ratio: {},
  bandwidth: {},
  average_framerate: {},
  unique_devices: {},
  minutes_per_unique_devices: {},
  ended_plays_per_unique_devices: {},
  attempts: {},
  unique_viewers: {},
  user_attrition: {},
  realTimePageData: [],
  mitigationAnalysis: [],
  realTimePageDataCombine: [],
  userEngagementPageData: [],
  qualityExperiencePageData: [],
  metricType: '',
  favoriteMetric: null,
  mitigation: [],
  mitigationList: [],
  mitigationSecondList: [],
  mitigationThirdList: [],
  mitigationStatus: "",
  cities: [],
  notifications: [],
  tabValueExpert: 0,
  tabValueMitigation: 0,
  locationCoordinates: [],
  playCount: [],
  errorLocationCoordinates: [],
  errorCount: [],
  errorRecordData: [],
  estimatedRootSecond: [],
  isSetEstimatedRootSecondLoader: false,
}

let qoeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SET_WIDGET_DATA:
      let widgetData = action.payload;
      return {
        ...state,
        widgetData: widgetData,
      }
    case SET_TAB_VALUE_EXPERT:
      let tabValueExpert = action.payload;
      return {
        ...state,
        tabValueExpert: tabValueExpert,
      }
    case SET_TAB_VALUE_MITIGATION:
      let tabValueMitigation = action.payload;
      return {
        ...state,
        tabValueMitigation: tabValueMitigation,
      }
    case CLEAR_ALL_METRICS:
      return {
        ...state,
        video_start_failures: {},
        succesful_plays: {},
        rebuffering_percentage: {},
        play_attempts: {},
        average_bitrate: {},
        exit_before_video_starts: {},
        connection_induced_rebuffering_ratio: {},
        video_start_time: {},
        video_restart_time: {},
        rendering_quality: {},
        concurrent_plays: {},
        total_minutes_watched: {},
        number_of_mitigations_applied: {},
        improvement_in_uei: {},
        degradation_in_uei: {},
        average_startup_buffer_length: {},
        average_rebuffering_buffer_length: {},
        average_percentage_completion: {},
        video_playback_failures: {},
        unique_viewers: {},
        user_attrition: {},
        ended_plays: {},
        rebuffering_ratio: {},
        bandwidth: {},
        average_framerate: {},
        unique_devices: {},
        minutes_per_unique_devices: {},
        ended_plays_per_unique_devices: {},
        attempts: {}

      }
    case SET_METRIC_TYPE:
      let metricType = action.payload;
      return {
        ...state,
        metricType: metricType,
      }
    case SET_METRIC_TYPE_FULLNAME:
      let metricTypefulname = action.payload;
      return {
        ...state,
        metricTypefulname: metricTypefulname,
      }
    case SET_FAV:
      let favoriteMetric = action.payload;
      return {
        ...state,
        favoriteMetric: favoriteMetric,
      }
    case SET_APPLY_MITIGATION:
      let mitigation = action.payload;
      return {
        ...state,
        mitigation: mitigation,
      }
    case SET_TASK_STATUS:
      let taskstatus = action.payload;
      return {
        ...state,
        taskstatus: taskstatus,
      }
    case SET_ALL_MITIGATION:
      let mitigationList = action.payload;
      return {
        ...state,
        mitigationList: mitigationList,
      }
    case SET_SECOND_MITIGATION:
      let mitigationSecondList = action.payload;
      return {
        ...state,
        mitigationSecondList: mitigationSecondList,
      }
    case SET_THIRD_MITIGATION:
      let mitigationThirdList = action.payload;
      return {
        ...state,
        mitigationThirdList: mitigationThirdList,
      }
    case CLEAR_ALL_MITIGATION_DATA_TABLE:
      return {
        ...state,
        mitigationSecondList: [],
        mitigationThirdList: []
      }
    case SET_AUTO_MITIGATION_STATUS:
      let mitigationStatus = action.payload;
      return {
        ...state,
        mitigationStatus: mitigationStatus?.switch,
      }
    case SET_CITIES:
      let cities = action.payload;
      return {
        ...state,
        cities: cities
      }
    // case SET_NOTIFICATIONS:
    //   let notifications = action.payload;
    //   return {
    //     ...state,
    //     notifications: notifications
    //   }
    case SET_NUMBER_OF_MITIGATION_APPLIED:
      let number_of_mitigations_applied = action.payload;
      return {
        ...state,
        number_of_mitigations_applied: number_of_mitigations_applied,
      }
    case SET_IMPROVEMENT_IN_UEI:
      let improvement_in_uei = action.payload;
      return {
        ...state,
        improvement_in_uei: improvement_in_uei,
      }
    case SET_DEGRADATION_IN_UEI:
      let degradation_in_uei = action.payload;
      return {
        ...state,
        degradation_in_uei: degradation_in_uei,
      }
    case SET_AVERAGE_STARTUP_BUFFER_LENGTH:
      let average_startup_buffer_length = action.payload;
      return {
        ...state,
        average_startup_buffer_length: average_startup_buffer_length,
      }
    case SET_AVERAGE_REBUFFERING_BUFFER_LENGTH:
      let average_rebuffering_buffer_length = action.payload;
      return {
        ...state,
        average_rebuffering_buffer_length: average_rebuffering_buffer_length,
      }
    case START_LOADING_QOE:
      return {
        ...state,
        loading: true
      }
    case STOP_LOADING_QOE:
      return {
        ...state,
        loading: false
      }
    case SET_EXPERINCE_DATA_DEVICE:
      let devicePlatformData = action.payload;
      return {
        ...state,
        devicePlatformData: devicePlatformData,
      }
    case SET_EXPERINCE_DATA_CONTENT:
      let contentPartnerData = action.payload;
      return {
        ...state,
        contentPartnerData: contentPartnerData,
      }
    case SET_THRESHOLD:
      let threshHold = action.payload;
      return {
        ...state,
        threshHold: threshHold,
      }
    case SET_FILTERS:
      let filters = action.payload;
      // let devicePlatform = filters.device_platform
      // devicePlatform = devicePlatform.filter(f => f.toLowerCase() !== 'Chrome'.toLowerCase())
      // let uniqueDevicePlatform = [...new Set(devicePlatform)];
      return {
        ...state,
        filters: filters,
        device_platform: ["Android", "iOS", "Web", "Firestick","AndroidSmartTv"]
        //device_platform: ["Android", "iOS", "Web", "FIRESTICK"]
        //        device_platform: ["Android", "iOS", "FireTV", "Web", "FIRESTICK"]

      }
    case SET_VIDEO_FAILURE_DATA:
      let video_start_failures = action.payload;
      return {
        ...state,
        video_start_failures: video_start_failures,
      }
    case SET_CONCURRENT_PLAYS:
      let concurrent_plays = action.payload;
      return {
        ...state,
        concurrent_plays: concurrent_plays,
      }
    case SET_TOTAL_MINUTES:
      let total_minutes_watched = action.payload;
      return {
        ...state,
        total_minutes_watched: total_minutes_watched,
      }
    case SET_AVG_COMPLETION:
      let average_percentage_completion = action.payload;
      return {
        ...state,
        average_percentage_completion: average_percentage_completion,
      }
    case SET_VIDEO_FAIL:
      let video_playback_failures = action.payload;
      return {
        ...state,
        video_playback_failures: video_playback_failures,
      }
    case SET_SUCCESSFUL_PLAYS:
      let succesful_plays = action.payload;
      return {
        ...state,
        succesful_plays: succesful_plays,
      }
    case SET_REBUFFERING_PERCENTAGE:
      let rebuffering_percentage = action.payload;
      return {
        ...state,
        rebuffering_percentage: rebuffering_percentage,
      }
    case SET_VIDEO_PLAYS_AND_FAILURE:
      let play_attempts = action.payload;
      return {
        ...state,
        play_attempts: play_attempts,
      }
    case SET_AVERAGE_BITRATE:
      let average_bitrate = action.payload;
      return {
        ...state,
        average_bitrate: average_bitrate,
      }
    case SET_EXIT_BEFORE_VIDEO_START:
      let exit_before_video_starts = action.payload;
      return {
        ...state,
        exit_before_video_starts: exit_before_video_starts,
      }
    case SET_CONNECTION_INDUCED_REBIFFERING_RATIO:
      let connection_induced_rebuffering_ratio = action.payload;
      return {
        ...state,
        connection_induced_rebuffering_ratio: connection_induced_rebuffering_ratio,
      }
    case SET_VIDEO_START_TIME:
      let video_start_time = action.payload;
      return {
        ...state,
        video_start_time: video_start_time,
      }
    case SET_VIDEO_RESTART_TIME:
      let video_restart_time = action.payload;
      return {
        ...state,
        video_restart_time: video_restart_time,
      }
    case SET_RENDERING_QUALITY:
      let rendering_quality = action.payload;
      return {
        ...state,
        rendering_quality: rendering_quality,
      }
    case SET_REBUFFERING_RATIO:
      let rebuffering_ratio = action.payload;
      return {
        ...state,
        rebuffering_ratio: rebuffering_ratio,
      }
    case SET_BANDWIDTH:
      let bandwidth = action.payload;
      return {
        ...state,
        bandwidth: bandwidth,
      }
    case SET_AVERAGE_FRAME_RATE:
      let average_framerate = action.payload;
      return {
        ...state,
        average_framerate: average_framerate,
      }
    case SET_UNIQUE_DEVICES:
      let unique_devices = action.payload;
      return {
        ...state,
        unique_devices: unique_devices,
      }
    case SET_MINUTES_PER_UNIQUE_DEVICES:
      let minutes_per_unique_devices = action.payload;
      return {
        ...state,
        minutes_per_unique_devices: minutes_per_unique_devices,
      }
    case SET_ENDED_PLAYS_PER_UNIQUE_DEVICE:
      let ended_plays_per_unique_devices = action.payload;
      return {
        ...state,
        ended_plays_per_unique_devices: ended_plays_per_unique_devices,
      }
    case SET_ATTEMPTS:
      let attempts = action.payload;
      return {
        ...state,
        attempts: attempts,
      }
    case SET_ENDED_PLAY:
      let ended_plays = action.payload;
      return {
        ...state,
        ended_plays: ended_plays,
      }
    case SET_UNIQUE_VIEWERS:
      let unique_viewers = action.payload;
      return {
        ...state,
        unique_viewers: unique_viewers,
      }
    case SET_USER_ATTRITION:
      let user_attrition = action.payload;
      return {
        ...state,
        user_attrition: user_attrition,
      }

    case SET_REAL_TIME_PAGE_DATA:
      let realTimePageData = action.payload;
      return {
        ...state,
        realTimePageData: realTimePageData,
      }
    case SET_MITIGATION_ANALYSIS_PAGE_DATA:
      let mitigationAnalysis = action.payload;
      return {
        ...state,
        mitigationAnalysis: mitigationAnalysis,
      }
    case SET_ANOMALIES_DETECTED_PAGE_DATA:
    let anamaliesDetected = action.payload;
    return {
      ...state,
      anamaliesDetected: anamaliesDetected,
    }
    case SET_ANOMALIES_RCA_PAGE_DATA:
    let anamaliesRca = action.payload;
    return {
      ...state,
      anamaliesRca: anamaliesRca,
    }
    case SET_ANOMALIES_MITIGATION_PAGE_DATA:
    let anamaliesMitigation = action.payload;
    return {
      ...state,
      anamaliesMitigation: anamaliesMitigation,
    }
    case SET_ANOMALIES_CLUSTER_PAGE_DATA:
    let anamaliesCluster = action.payload;
    return {
      ...state,
      anamaliesCluster: anamaliesCluster,
    }
    case SET_ANOMALIES_CLUSTER_SESSION_PAGE_DATA:
    let anamaliesClusterSession = action.payload;
    return {
      ...state,
      anamaliesClusterSession: anamaliesClusterSession,
    }
    case SET_REAL_TIME_PAGE_DATA_COMBINE:
      let realTimePageDataCombine = action.payload;
      return {
        ...state,
        realTimePageDataCombine: realTimePageDataCombine,
      }
    case CLEAR_REAL_TIME_DATA_COMBINE:
      return {
        ...state,
        realTimePageDataCombine: [],
      }
    case SET_USER_ENGAGEMENT_PAGE_DATA:
      let userEngagementPageData = action.payload;
      return {
        ...state,
        userEngagementPageData: userEngagementPageData,
      }

    case SET_QUALITY_EXPERIENCE_PAGE_DATA:
      let qualityExperiencePageData = action.payload;
      return {
        ...state,
        qualityExperiencePageData: qualityExperiencePageData,
      }
    case SET_GLOBAL_SETTING:
      let globalSetting = action.payload;
      return {
        ...state,
        globalSetting: globalSetting,
      }

    case SET_GLOBAL_SETTING_POST:
      let globalSettingPost = action.payload;
      return {
        ...state,
        globalSettingPost: globalSettingPost,
      }
    case SET_ANOMALIES_DETECT_POST:
      let anomaliesDetect = action.payload;
      return {
        ...state,
        anomaliesDetect: anomaliesDetect,
      }
    case SET_RCA_POST:
      let rcaDetect = action.payload;
      return {
        ...state,
        rcaDetect: rcaDetect,
      }
    case SET_SECOND_ANOMALIES_DETECT_POST:
      let secondAnomaliesData = action.payload;
      return {
        ...state,
        secondAnomaliesData: secondAnomaliesData,
      }
    case SET_THIRD_ANOMALIES_DETECT_POST:
      let thirdAnomaliesData = action.payload;
      return {
        ...state,
        thirdAnomaliesData: thirdAnomaliesData,
      }
    case SET_CSV_ANOMALIES_DETECT_POST:
      let csvAnomaliesData = action.payload;
      return {
        ...state,
        csvAnomaliesData: csvAnomaliesData,
      }
    case SET_ESTIMATED_ROOT_SECOND_POST_REQUEST:
      return {
        ...state,
        isSetEstimatedRootSecondLoader: true,
      }
    case SET_ESTIMATED_ROOT_SECOND_POST:
      // let estimatedRootSecond = action.payload;
      return {
        ...state,
        isSetEstimatedRootSecondLoader: false,
        estimatedRootSecond: action.payload,
      }
    case SET_ESTIMATED_ROOT_RCA_BUCKET:
      let estimatedRootRcaBucket = action.payload;
      return {
        ...state,
        estimatedRootRcaBucket: estimatedRootRcaBucket,
      }
    case SET_CONFIG_MITI_BUCKET:
      let configMitiBucketPlan = action.payload;
      return {
        ...state,
        configMitiBucketPlan: configMitiBucketPlan,
      }
    case SET_METIGATION_TYPE_BUCKET:
      let mitigationType = action.payload;
      return {
        ...state,
        mitigationType: mitigationType,
      }
      case SET_ANOMALIES_PLAYBACK_FAILURE_POST:
        let anomaliesPlayBlackFailure = action.payload;
        return {
          ...state,
          anomaliesPlayBlackFailure: anomaliesPlayBlackFailure,
        }
        case SET_ANOMALIES_PLAYBACK_FAILURE_BY_VID_POST:
          let anomaliesPlayBlackFailureByVid = action.payload;
          return {
            ...state,
            anomaliesPlayBlackFailureByVid: anomaliesPlayBlackFailureByVid,
          }

    case SET_LOCATION_COORDINATES:
      let locationCoordinates = action.payload;
      return {
        ...state,
        locationCoordinates: locationCoordinates,
      }
    case SET_PLAY_COUNT:
      let playCount = action.payload;
      return {
        ...state,
        playCount: playCount,
      }
    case SET_ERROR_LOCATION_COORDINATES:
      let errorLocationCoordinates = action.payload;
      return {
        ...state,
        errorLocationCoordinates: errorLocationCoordinates,
      }
    case SET_ERROR_COUNT:
      let errorCount = action.payload;
      return {
        ...state,
        errorCount: errorCount,
      }
      case SET_CONCURRENT_COUNT:
        let conncurrentCount = action.payload;
        return {
          ...state,
          conncurrentCount: conncurrentCount,
        }
        case SET_ERC_POST_RECORD_CSV:
        let ercauseCSVRecord = action.payload;
        return {
          ...state,
          ercauseCSVRecord: ercauseCSVRecord,
        }
        case SET_ANOMALIES_DETECT_POST_RECORD_CSV:
          let anomaliesDetectCSVRecord = action.payload;
          return {
            ...state,
            anomaliesDetectCSVRecord: anomaliesDetectCSVRecord,
          }

          case SET_DOWNLOAD_LABELED_RECORD_CSV:
            let labeledCSVRecord = action.payload;
            return {
              ...state,
              labeledCSVRecord: labeledCSVRecord,
            }
        case SET_NOTIFICATION:
          return {
            ...state,
            notifications: action.payload,
          }
    case SET_ERROR_RECORDS_DATA:
      let errorRecordData = action.payload;
      return {
        ...state,
        errorRecordData: errorRecordData,
      }
      case SET_MITIGATION_AI:
        let aiMitigation = action.payload;
        return {
          ...state,
          aiMitigation: aiMitigation,
        }
    // default case	
    default:
      return { ...state }
  }
}

export default qoeReducer;