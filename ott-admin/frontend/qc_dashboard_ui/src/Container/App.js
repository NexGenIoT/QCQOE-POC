/**
 * App.js Layout Start Here
 */
//Sarthak Saxena
import React from 'react';
import { useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { NotificationContainer } from 'react-notifications';
// rct theme provider
import RctThemeProvider from './RctThemeProvider'; 
// CRM layout
import CRMLayout from './CRMLayout';
// app login amit  
import AppLogin from '../Routes/session/login'; 
import Auth from 'Auth/Auth';
// callback component
import Callback from "Components/Callback/Callback";
import User from 'Routes/userManagement';
import Forgotpwd from 'Routes/session/forgot-password';
import ResetPassword from 'Routes/session/forgot-password/ResetPassword';
//Auth0 Handle Authentication
const auth = new Auth();
const handleAuthentication = ({ location }) => {
   if (/access_token|id_token|error/.test(location.hash)) {
      auth.handleAuthentication();
   }
}
/**
 * Initial Path To Check Whether User Is Logged In Or Not
 */
const InitialPath = ({ component: Component, authUser, ...rest }) =>
   <Route
      {...rest}
      render={props =>
         authUser
            ? <Component {...props} />
            : <Redirect
               to={{
                  pathname: '/signin',
                  state: { from: props.location }
               }}
            />}
   />;

function App(props) {
   const authUser = useSelector(state => state.authUser);
   const { user } = authUser;
   const { location, match } = props;
   if (location.pathname === '/') {
      if (user === null) {
         return (<Redirect to={'/signin'} />);
      } else {
         return (<Redirect to={'/dashboard/crm/dashboard'} />);
      }
   }
   return (
      <RctThemeProvider>
         <NotificationContainer />
         {/* <InitialPath
            path={`${match.url}app`}
            authUser={user}
            component={CRMLayout}
         /> */}
         <Route path="/dashboard" component={CRMLayout} />
         {/* <Route path="/signin" component={AppLogin} /> */}
         <Route path="/forgot-password" component={Forgotpwd} />
         <Route path="/reset-password" component={ResetPassword} />
         <Route path="/callback" render={(props) => {
            handleAuthentication(props);
            return <Callback {...props} />
         }} /> 
      </RctThemeProvider>
   );
}

export default App;
