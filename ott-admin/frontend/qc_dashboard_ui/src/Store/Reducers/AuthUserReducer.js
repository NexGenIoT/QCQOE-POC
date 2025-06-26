/**
 * Auth User Reducers
 */
import { NotificationManager } from 'react-notifications';
import {
    LOGIN_USER,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_FAILURE,
    LOGOUT_USER,
    SIGNUP_USER,
    SIGNUP_USER_SUCCESS,
    SIGNUP_USER_FAILURE,
    LOGOUT_USER_SUCCESS,
    LOGOUT_USER_FAILURE
} from '../Actions/types';

/**
 * initial auth user
 */
const INIT_STATE = {
    // user: localStorage.getItem('user_id'),
    user: true,
    loading: false,
    first_name: localStorage.getItem('firstName'),
    last_name: localStorage.getItem('lastName'),
};

let authUser = (state = INIT_STATE, action) => {
    switch (action.type) {

        case LOGIN_USER:
            return { ...state, loading: true };

        case LOGIN_USER_SUCCESS:
            return { ...state, loading: false, user: action.payload.user, first_name: action.payload.fName, last_name: action.payload.lName };

        case LOGIN_USER_FAILURE:
            NotificationManager.error(action.payload);
            return { ...state, loading: false };

        case LOGOUT_USER:
            return { ...state };

        case LOGOUT_USER_SUCCESS:
            NotificationManager.success(action.payload, '', 2000);
            return { ...state, user: null, first_name: '', last_name: '', };

        case LOGOUT_USER_FAILURE:
            return { ...state };

        case SIGNUP_USER:
            return { ...state, loading: true };

        case SIGNUP_USER_SUCCESS:
            NotificationManager.success('Account Created', '', 2000);
            return { ...state, loading: false, user: action.payload.uid };

        case SIGNUP_USER_FAILURE:
            NotificationManager.error(action.payload);
            return { ...state, loading: false };

        default: return { ...state };
    }
}

export default authUser;