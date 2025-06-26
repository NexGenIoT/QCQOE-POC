import { CREATE_USER_LIST,
    EDIT_USER_LIST,
    GET_USER_MANAGEMENT_LIST,
    GET_USER_ROLES,
    SET_EDIT_USER_LIST,
    SET_USER_LIST,
    SET_USER_MANAGEMENT_LIST,
    SET_USER_ROLES,
    CREATE_USER_ROLES,
    GET_USER_ROLES_LIST,
    SET_USER_ROLES_LIST,
    GET_USER_ACCOUNT,
    SET_USER_ACCOUNT,
    USER_CHANGE_PASSWORD,
    USER_RESET_EMAIL,
    CREATE_NEW_PASSWORD,
    USER_LIST_ENABLED,
    USER_LIST_STATUS,
    SET_USER_LIST_STATUS,
    GET_PERMISSIONS_LIST,
    GET_ROLE_PERMISSION,
    SET_PERMISSIONS_LIST,
    SET_ROLE_PERMISSION,
    GET_USER_ROLE_PERMISSION,
    SET_USER_ROLE_PERMISSION,
    SET_PROJECT,
    GET_PROJECT,
} from "./types";


export const getUserManagementList = (dispatch, val = {}, type = '') => ({
    type: GET_USER_MANAGEMENT_LIST,
    payload: {dispatch, val, type},
});

export const setUserManagementList = (data) => ({
    type: SET_USER_MANAGEMENT_LIST,
    payload: data,
});

export const createUserManagementList = (dispatch) => ({
    type: CREATE_USER_LIST,
    payload: {dispatch},
})

export const setCreatedUserManagementList = (data) => ({
    type: SET_USER_LIST,
    payload: data,
});

export const editUserManagementList = (dispatch) => ({
    type: EDIT_USER_LIST,
    payload: { dispatch },
})

export const setEditedUserManagementList = (data) => ({
    type: SET_EDIT_USER_LIST,
    payload: data,
});

export const getUserRoles = (dispatch) => ({
    type: GET_USER_ROLES,
    payload: { dispatch }
})

export const setUserRoles = (data) => ({
    type: SET_USER_ROLES,
    payload: data,
});

export const createUserRoles = (dispatch, history, data) => ({
    type: CREATE_USER_ROLES,
    payload: { dispatch, history, data },
});

export const getUserRoleList = (dispatch) => ({
    type: GET_USER_ROLES_LIST,
    payload: { dispatch }
});

export const setUserRoleList = (data) => ({
    type: SET_USER_ROLES_LIST,
    payload: data
});

export const getUserAccount = (dispatch, id) => ({
    type: GET_USER_ACCOUNT,
    payload: { dispatch, id }
});

export const setUserAccount = (data) => ({
    type: SET_USER_ACCOUNT,
    payload: data,
});

export const userChangePassword = ( dispatch, val, history) => ({
    type: USER_CHANGE_PASSWORD,
    payload: { dispatch, val, history },
});

export const userResetEmail = (dispatch, val, history) => ({
    type: USER_RESET_EMAIL,
    payload: { dispatch, val, history }
});

export const userResetPassword = (dispatch, val, history) => ({
    type: CREATE_NEW_PASSWORD,
    payload: { dispatch, val, history }
});

export const userListEnabled = (dispatch, val, history) => ({
    type: USER_LIST_ENABLED,
    payload: { dispatch, val, history },
});

export const userListStatus = (dispatch, history) => ({
    type: USER_LIST_STATUS,
    payload: { dispatch, history }
});

export const setUserListStatus = (data) => ({
    type: SET_USER_LIST_STATUS,
    payload: data,
});

export const getPermissionList = (dispatch, id) => ({
    type: GET_PERMISSIONS_LIST,
    payload: { dispatch, id }
});

export const setPermissionList = (data) => ({
    type: SET_PERMISSIONS_LIST,
    payload: data
});

export const getRolePermission = (dispatch, id) => ({
    type: GET_ROLE_PERMISSION,
    payload: { dispatch, id }
});

export const setRolePermission = (data) => ({
    type: SET_ROLE_PERMISSION,
    payload: data
});

export const getUserRolePermission = (dispatch, id) => ({
    type: GET_USER_ROLE_PERMISSION,
    payload: { dispatch, id }
})

export const setUserRolePermission = (data) => ({
    type: SET_USER_ROLE_PERMISSION,
    payload: data,
});

export const getProject = (dispatch) => ({
    type: GET_PROJECT,
    payload: { dispatch }
});

export const setProject = (data) => ({
    type: SET_PROJECT,
    payload: data
});