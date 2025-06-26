/**
 * App Reducers
 */
import { combineReducers } from 'redux';
import settings from './settings';
import sidebarReducer from './SidebarReducer';
import authUserReducer from './AuthUserReducer';
import CrmReducer from './CrmReducer';
import LogDetailsReducer from './LogDetailsReducer';
import qoeReducer from './QOEReducer';
import PendingInQueueReducer from './PendingInQueueReducer';
import { userManagementReducer } from './UserManagementReducer';

const reducers = combineReducers({
   settings,
   sidebar: sidebarReducer,
   authUser: authUserReducer,
   overviewReducer: CrmReducer,
   logReducer: LogDetailsReducer,
   qoeReducer: qoeReducer,
   pendingInQueueReducer: PendingInQueueReducer,
   userReducer: userManagementReducer,
});

export default reducers;
