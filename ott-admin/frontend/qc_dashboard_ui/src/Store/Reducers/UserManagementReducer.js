import { SET_PERMISSIONS_LIST, SET_PROJECT, SET_ROLE_PERMISSION, SET_USER_ACCOUNT, SET_USER_LIST_STATUS, SET_USER_MANAGEMENT_LIST, SET_USER_ROLES, SET_USER_ROLES_LIST, SET_USER_ROLE_PERMISSION } from "Store/Actions/types";


const initialState = {
    userManagementList: [],
    userRoles: [],
    userRoleList: [],
    userAccount: [],
    userListStatus: [],
    permissionList: [],
    rolePermission: [],
    userRolePermission: [],
    projectData: [],
};

export const userManagementReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_MANAGEMENT_LIST:
            let userManagementData = action.payload;
            return {
                ...state,
                userManagementList: userManagementData
            }
        case SET_USER_ROLES_LIST:
            let userRoles = action.payload;
            return {
                ...state,
                userRoles,
            }
        case SET_USER_ROLES:
            let userRoleList = action.payload;
            return {
                ...state,
                userRoleList,
            }
        case SET_USER_ACCOUNT: 
            let userAccount = action.payload;
            return {
                ...state,
                userAccount,
            }
        case SET_USER_LIST_STATUS:
            let userListStatus = action.payload;
            return {
                ...state,
                userListStatus,
            }
        case SET_PERMISSIONS_LIST:
            let permissionList = action.payload;
            return {
                ...state,
                permissionList,
            }
        case SET_ROLE_PERMISSION:
            let rolePermission = action.payload;
            return {
                ...state,
                rolePermission,
            }
        case SET_USER_ROLE_PERMISSION:
            let userRolePermission = action.payload;
            return {
                ...state,
                userRolePermission,
            }
        case SET_PROJECT:
            let projectData = action.payload
            return {
                ...state,
                projectData,
            }
        default:
            return {...state}
    }
}