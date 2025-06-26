import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import UserList from './UserList/UserList';
import PendingApprovals from './UserList/PendingApprovals';
import MyAccount from './UserList/MyAccount';
import ChangePassword from './ChangePassword/ChangePassword';
import AccessControl from './AccessControl/AccessControl';
import CreateEditUser from './CreateEditUser/CreateUser';
import CreateEditRole from './AccessControl/AddRole/CreateEditRole';
import EditRole from './AccessControl/AddRole/EditRole';
import RolesAndPermission from './AccessControl/RolePermission/RolesAndPermission/RolesAndPermission';
import EditUser from './CreateEditUser/EditUser';
import { isValidRole } from 'Constants/constant';
import NotFound from 'Routes/session/404';

export default function User({match}) {
  return (
    <Switch>
        <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
        <Route path={`${match.url}/my-account`}  component={MyAccount} />
        <Route path={`${match.url}/change-password`} component={ChangePassword} />
        {isValidRole('ROLE_ADMIN') ?
        <>
        <Route path={`${match.url}/user-list`} component={UserList} />
        <Route path={`${match.url}/access-control`} component={AccessControl} />
        <Route path={`${match.url}/create-user`} component={CreateEditUser} />
        <Route path={`${match.url}/edit-user`} component={EditUser} />
        <Route path={`${match.url}/pending-approvals`} component={PendingApprovals} />
        <Route path={`${match.url}/add-role`} component={CreateEditRole}/>
        <Route path={`${match.url}/edit-role`} component={EditRole}/>
        <Route path={`${match.url}/roles-permissions`} component={RolesAndPermission} />
        </>:<Route path={`${match.url}/`} component={NotFound} />
        }
    </Switch>
  )
}

const UserManagement = () => (
    <h1 style={{ backgroundColor: 'red' }}>user management</h1>
)
