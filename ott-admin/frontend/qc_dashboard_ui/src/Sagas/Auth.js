import { all, fork, takeEvery } from 'redux-saga/effects';
import axios from 'axios'
import {
    LOGIN_USER,
    LOGOUT_USER
} from 'Store/Actions/types';

import {
    signinUserSuccess,
    signinUserFailure,
    logoutUserFromFirebaseSuccess,
    logoutUserFromFirebaseFailure
} from 'Store/Actions';
import { NotificationManager } from 'react-notifications';
/**
 * Sigin User With Email and Password Request
 */


/**
 * Signin User With Email & Password
 */
async function signInUserWithEmailPassword({ payload }) {
    const { email, password } = payload.user;
    const { history } = payload;
    const { dispatch } = payload
    const url = '/oauth/token'
    const obj = { username: email, password }
    try {
        const response = await axios.post(url, obj);
        const { data } = response

        if (data.access_token) {
            localStorage.setItem('user_id', JSON.stringify(data.access_token));
            localStorage.setItem('firstName', data?.userDetails?.firstName);
            localStorage.setItem('lastName', data?.userDetails?.lastName);
            localStorage.setItem('userDetails', JSON.stringify(data?.userDetails));
            var getData = localStorage.getItem('user_id')
            var fName = localStorage.getItem('firstName')
            var lName = localStorage.getItem('lastName')
            dispatch(signinUserSuccess(getData, fName, lName))
            history.replace('/dashboard');
            NotificationManager.success('User Logged In', '', 1000);
        } else {
            dispatch(signinUserFailure(data.details[0]))
        }
    }
    catch (error) {
        if (error.response) {
            dispatch(signinUserFailure(error.response.data.details[0]))
        }
        else {
            dispatch(signinUserFailure('Network Error'))
        }
    }
}

/**
 * Signout User
 */
function signOut({ payload }) {
    const { history, dispatch } = payload
    try {
        localStorage.removeItem('user_id');
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName')
        history.replace('/signin')
        dispatch(logoutUserFromFirebaseSuccess('User Logged Out', '', 2000))
    } catch (error) {
        dispatch(logoutUserFromFirebaseFailure());
    }
}

/**
 * Signin User 
 */
export function* signinUserInFirebase() {
    yield takeEvery(LOGIN_USER, signInUserWithEmailPassword);
}

/**
 * Signout User  
 */
export function* signOutUser() {
    yield takeEvery(LOGOUT_USER, signOut);
}


/**
 * Auth Root Saga
 */
export default function* rootSaga() {
    yield all([
        fork(signinUserInFirebase),
        fork(signOutUser),
    ]);
}