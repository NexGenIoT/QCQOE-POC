/**
 * Root Sagas
 */
import { Pending } from '@mui/icons-material';
import { all } from 'redux-saga/effects';

// sagas
import authSagas from './Auth';
import crm from './CRM';
import logDetail from './LogDetails';
import qoe from './QOE';
import pendingInQueue from './PendingInQueue';
import userManagement from './UserManagement';

export default function* rootSaga(getState) {
    yield all([
        authSagas(),
        crm(),
        logDetail(),
        qoe(),
        pendingInQueue(),
        userManagement()
    ]);
}