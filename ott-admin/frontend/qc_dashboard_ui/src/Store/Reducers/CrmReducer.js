/**
 * CRM Reducer
 */
//action types
import {
   ADD_NEW_CLIENT,
   DELETE_CLIENT,
   UPDATE_CLIENT,
   SET_TAB_VALUE,
   STORE_ASSET_DATA,
   STORE_PARTNER_DATA,
   SET_ISSUE_TYPE_DETAILS,
   SET_STATUS_TYPE_DETAILS,
   STORE_IMAGE_ASSET_INFO,
   SET_CONNECTED_GRAPH_DATA,
   CLEAR_CONNECTED_GRAPH_DATA,
   STORE_ASSET_OVERVIEW_GRAPH,
   STORE_RPI_OVERVIEW_GRAPH,
   SET_CONTENT_TYPES,
   CLEAR_IMAGE_ASSET_INFO,
   START_LOADER_CRM,
   STOP_LOADER_CRM,
   STORE_ISSUE_TYPE_GRAPH,
   STORE_PARTNER_GRAPH,
   SET_ANALYSIS_COUNTS_POST,
   SET_PENDING_IN_QUEUE_GRAPH_DATA,
   CLEAR_PENDING_IN_QUEUE_GRAPH_DATA
} from '../Actions/types';

const INITIAL_STATE = {
   clientsData: null,
   assetInfo: {},
   partnerInfo: [],
   issueType: [],
   status: [],
   imageAssetInfo: {},
   connectedData: {},
   imageInfo: '',
   assetOverviewGraph: [],
   rpiOverviewGraph: [],
   tabValue: 0,
   contentTypes: [],
   isLoadingCrm: false,
   issueTypeGraph: [],
   partnerGraph: [],

}

let crmReducer = (state = INITIAL_STATE, action) => {
   switch (action.type) {
      // add product to cart 
      case ADD_NEW_CLIENT:
         let client = action.payload;
         let newClient = {
            image: "profile.jpg",
            name: client.name,
            e_mail: client.email,
            phone_number: client.mobile,
            country: client.location,
            type: "recently_added"
         }
         return {
            ...state,
            clientsData: [...state.clientsData, newClient]
         }
      // remove client to cart	
      case DELETE_CLIENT:
         let removeClient = action.payload;
         let newData = state.clientsData.filter((clientItem) => clientItem.id !== removeClient.id)
         return {
            ...state,
            clientsData: newData
         }
      // update client
      case UPDATE_CLIENT:
         let updateClient = action.payload;
         let newclientsData = [];
         for (const item of state.clientsData) {
            if (item.id === updateClient.ID) {
               item.name = updateClient.data.name;
               item.e_mail = updateClient.data.email;
               item.phone_number = updateClient.data.phoneNumber;
               item.country = updateClient.data.location;
            }
            newclientsData.push(item)
         }
         return {
            ...state,
            clientsData: newclientsData
         }
      case STORE_ASSET_DATA:
         let assetInfo = action.payload;
         return {
            ...state,
            assetInfo: assetInfo
         }
      case STORE_ISSUE_TYPE_GRAPH:
         let issueTypeGraph = action.payload;
         return {
            ...state,
            issueTypeGraph: issueTypeGraph
         }
      case STORE_PARTNER_GRAPH:
         let partnerGraph = action.payload;
         return {
            ...state,
            partnerGraph: partnerGraph
         }
      case STORE_PARTNER_DATA:
         let partnerInfo = action.payload;
         return {
            ...state,
            partnerInfo: partnerInfo
         }
      case START_LOADER_CRM:
         return {
            ...state,
            isLoadingCrm: true,
         }
      case STOP_LOADER_CRM:
         return {
            ...state,
            isLoadingCrm: false,
         }
      case SET_ISSUE_TYPE_DETAILS:
         let issueType = action.payload;
         return {
            ...state,
            issueType: issueType
         }
      case SET_STATUS_TYPE_DETAILS:
         let status = action.payload;
         return {
            ...state,
            status: status
         }
      case STORE_IMAGE_ASSET_INFO:
         let imageAssetInfo = action.payload.data;
         let imageInfo = action.payload.name
         return {
            ...state,
            imageAssetInfo: imageAssetInfo,
            imageInfo: imageInfo,
            isLoadingCrm: true
         }
      case SET_CONNECTED_GRAPH_DATA:
         let connectedData = action.payload.data;
         return {
            ...state,
            connectedData: connectedData,
         }
      case CLEAR_CONNECTED_GRAPH_DATA:
         return {
            ...state,
            connectedData: {},
         }
      case CLEAR_IMAGE_ASSET_INFO:
         return {
            ...state,
            imageAssetInfo: {},
            imageInfo: ''
         }
      case STORE_ASSET_OVERVIEW_GRAPH:
         let assetOverviewGraph = action.payload.data;
         return {
            ...state,
            assetOverviewGraph: assetOverviewGraph,
         }
      case STORE_RPI_OVERVIEW_GRAPH:
         let rpiOverviewGraph = action.payload.data;
         return {
            ...state,
            rpiOverviewGraph: rpiOverviewGraph,
         }
      case SET_TAB_VALUE:
         let tabValue = action.payload
         return {
            ...state,
            tabValue: tabValue,
         }
      case SET_CONTENT_TYPES:
         let contentTypes = action.payload
         return {
            ...state,
            contentTypes: contentTypes,
         }
      case SET_ANALYSIS_COUNTS_POST:
         let analysisCounts = action.payload
         return {
            ...state,
            analysisCounts: analysisCounts,
         }
      case SET_PENDING_IN_QUEUE_GRAPH_DATA:
         let pendingInQueueData = action.payload.data;
         return {
            ...state,
            connectedData: pendingInQueueData,
         }
      case CLEAR_PENDING_IN_QUEUE_GRAPH_DATA:
         return {
            ...state,
            connectedData: {},
         }
      // default case	
      default:
         return { ...state }
   }
}

export default crmReducer;