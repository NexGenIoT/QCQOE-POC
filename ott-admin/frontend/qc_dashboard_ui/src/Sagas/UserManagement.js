import { all, fork, takeEvery } from "redux-saga/effects";
import axios from "axios";
import {
  CREATE_NEW_PASSWORD,
  CREATE_USER_LIST,
  CREATE_USER_ROLES,
  GET_PERMISSIONS_LIST,
  GET_PROJECT,
  GET_ROLE_PERMISSION,
  GET_USER_ACCOUNT,
  GET_USER_MANAGEMENT_LIST,
  GET_USER_ROLES,
  GET_USER_ROLES_LIST,
  GET_USER_ROLE_PERMISSION,
  USER_CHANGE_PASSWORD,
  USER_LIST_ENABLED,
  USER_LIST_STATUS,
  USER_RESET_EMAIL,
} from "Store/Actions/types";
import {
  setCreatedUserManagementList,
  setPermissionList,
  setProject,
  setRolePermission,
  setUserAccount,
  setUserListStatus,
  setUserManagementList,
  setUserRoleList,
  setUserRolePermission,
  setUserRoles,
  userListEnabled,
} from "Store/Actions/UserManagementActions";
import { NotificationManager } from "react-notifications";

export function* getUserListData() {
  yield takeEvery(GET_USER_MANAGEMENT_LIST, getUserManagementListFn);
}

export function* createUserListData() {
  yield takeEvery(CREATE_USER_LIST, createUserListFn);
}

export function* getUserRoleData() {
  yield takeEvery(GET_USER_ROLES, getUserRoleFn);
}

export function* createUserRoleData() {
  yield takeEvery(CREATE_USER_ROLES, createUserRolesFn);
}

export function* getUserRoleListData() {
  yield takeEvery(GET_USER_ROLES_LIST, getUserRoleListFn);
}

export function* getUserAccountData() {
  yield takeEvery(GET_USER_ACCOUNT, getUserAccountDataFn);
}

export function* userChangePasswordData() {
  yield takeEvery(USER_CHANGE_PASSWORD, userChangePasswordFn);
}

export function* userResetEmailData() {
  yield takeEvery(USER_RESET_EMAIL, userResetEmailFn);
}

export function* userNewPasswordData() {
  yield takeEvery(CREATE_NEW_PASSWORD, userNewPasswordFn);
}

export function* userListEnabledData() {
  yield takeEvery(USER_LIST_ENABLED, userListEnabledFn);
}

export function* userListStatusData() {
  yield takeEvery(USER_LIST_STATUS, userListStatusDataFn);
}

export function* getPermissionListData() {
  yield takeEvery(GET_PERMISSIONS_LIST, getPermissionListFn);
}

export function* getRolePermissionData() {
  yield takeEvery(GET_ROLE_PERMISSION, getRolePermissionFn);
}

export function* getUserRolePermissionData() {
  yield takeEvery(GET_USER_ROLE_PERMISSION, getUserRolePermissionFn);
}

export function* getProjectData() {
  yield takeEvery(GET_PROJECT, getProjectDataFn);
}

async function getUserManagementListFn({ payload }) {
  const { dispatch, val, type } = payload;

  const url = `https://qcotp.qoetech.com/user/search`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.post(url, type !== "" ? val : {}, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    console.log({ userManagement: response, token: user, payload });
    if (response?.data) {
      const sortedData = response?.data?.data?.users.sort(
        (a, b) => b.sid - a.sid
      );
      sortedData.map((item) => {
        if (item.modifiedDate === null) {
          item.modifiedDate = item.createdDate;
        }
      });
      console.log({ sortedData });
      dispatch(setUserManagementList(sortedData));
    }
  } catch (error) {
    console.log({ error: error });
  }
}

async function createUserListFn({ dispatch }) {
  const url = `https://qcotp.qoetech.com/qcuser`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      }
    );
    console.log({ createUserManagement: response });
    dispatch(setCreatedUserManagementList(response));
  } catch (error) {
    console.log({ error: error });
  }
}

async function getUserRoleFn({ payload }) {
  const { dispatch } = payload;
  const url = "https://qcotp.qoetech.com/master?type=ROLES";
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    if (response?.data) {
      dispatch(setUserRoles(response.data?.data));
      console.log({ getRole: response });
    }
  } catch (error) { }
}

async function createUserRolesFn({ payload }) {
  const { dispatch, history, data } = payload;
  const url = `https://qcotp.qoetech.com/role`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = axios.post(
      url,
      { data: data },
      {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      }
    );
    console.log({ createRole: response });
  } catch (error) { }
}

async function getUserRoleListFn({ payload }) {
  const { dispatch } = payload;
  const url = `https://qcotp.qoetech.com/role/search`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      }
    );
    console.log({ createRole: response.data.data.roles });
    if (response?.data) {
      const sortedData = response?.data?.data?.roles.map((item) => {
        if (item.modifiedDate === null) {
          item.modifiedDate = item.createdDate;
        }
      });
      dispatch(setUserRoleList(response?.data?.data?.roles));
    }
  } catch (error) { }
}

async function getUserAccountDataFn({ payload }) {
  const { dispatch, id } = payload;
  const url = `https://qcotp.qoetech.com/qcuser?sid=${id}`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    dispatch(setUserAccount(response.data));
    console.log({ getUserAccount: response.data });
  } catch (error) { }
}

async function userChangePasswordFn({ payload }) {
  const { dispatch, history, val } = payload;
  const url = `https://qcotp.qoetech.com/user/change-password`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.put(url, val, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    const { data } = response;
    if (data.message == "Server Error") {
      NotificationManager.error("", data.details, 2000);
      // history.push('/signin');
    } else if (data.message == "Validation Failed") {
      NotificationManager.error("", data.details, 2000);
    } else {
      localStorage.clear();
      history.push("/signin");
      NotificationManager.success("", data.message, 2000);
    }
  } catch (error) { }
}

async function userResetEmailFn({ payload }) {
  const { dispatch, history, val } = payload;
  const url = `https://qcotp.qoetech.com/user/forgot-password?email=${val}`;
  try {
    const response = await axios.get(url);
    const { data } = response;
    if (data.message == "Server Error") {
      NotificationManager.error("", data.details, 2000);
      // history.push('/signin');
    } else {
      NotificationManager.error("", data.message, 2000);
    }
  } catch (error) {
    console.log(error, "abcd--error");
    NotificationManager.success(error.details, "", 2000);
  }
}

async function userNewPasswordFn({ payload }) {
  const { dispatch, history, val } = payload;
  const url = `https://qcotp.qoetech.com/user/create-password`;
  try {
    const response = await axios.put(url, val, history);
    console.log({ response });
  } catch (error) {
    console.log({ errorCreatePassword: error });
  }
}

async function userListEnabledFn({ payload }) {
  const { dispatch, val, history } = payload;
  const url = `https://qcotp.qoetech.com/user/enable?sid=${1}&Enabled=${val}`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.put(url, val, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    // dispatch(setUserAccount(response.data));
    console.log({ getUserListEnabled: response.data });
  } catch (error) { }
}

async function userListStatusDataFn({ payload }) {
  const { dispatch, id } = payload;
  const url = `https://qcotp.qoetech.com/user/status`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    dispatch(setUserListStatus(response.data));
    console.log({ getUserStatus: response.data });
  } catch (error) { }
}

async function getPermissionListFn({ payload }) {
  const { dispatch, id } = payload;
  const url = `https://qcotp.qoetech.com/master/permission?projectSid=${id}`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    dispatch(setPermissionList(response.data));
    console.log({ getPermissionList: response.data });
  } catch (error) { }
}

async function getRolePermissionFn({ payload }) {
  const { dispatch, id = 1 } = payload;
  const url = `https://qcotp.qoetech.com/role/permission?roleSid=${id}`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    dispatch(setRolePermission(response.data));
    console.log({ getRolePermisison: response.data });
  } catch (error) { }
}

async function getUserRolePermissionFn({ payload }) {
  const { dispatch, id = 1 } = payload;
  const url = `https://qcotp.qoetech.com/user/permission?userSid=${id}`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    dispatch(setUserRolePermission(response.data));
    console.log({ getUserRolePermission: response.data });
  } catch (error) { }
}

async function getProjectDataFn({ payload }) {
  const { dispatch } = payload;
  const url = `https://qcotp.qoetech.com/master?type=PROJECTS`;
  // const user = localStorage.getItem("user_id");
  const user = true;
  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${user}`,
      },
    });
    dispatch(setProject(response.data?.data));
    console.log({ getProject: response.data });
  } catch (error) { }
}

export default function* rootSaga() {
  yield all([
    fork(getUserListData),
    fork(getUserRoleData),
    fork(getUserRoleListData),
    fork(getUserAccountData),
    fork(userChangePasswordData),
    fork(userResetEmailData),
    fork(userNewPasswordData),
    fork(userListEnabledData),
    fork(userListStatusData),
    fork(getPermissionListData),
    fork(getRolePermissionData),
    fork(getUserRolePermissionData),
    fork(getProjectData),
  ]);
}
