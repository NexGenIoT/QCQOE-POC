/**
 * Horizontal App
 */
//Sarthak Saxena
import React from 'react';
import { Route, withRouter, Redirect } from 'react-router-dom';

// app default layout
import RctCRMLayout from 'Components/RctCRMLayout';

// router service
import routerService from "Routes";
import { useSelector } from 'react-redux';

function CRMLayout(props) {
   const authUser = useSelector(state => state.authUser);
   const  user  = true;
   const { match, location } = props;
   if (location.pathname === '/dashboard') {
      if (user) {
         return (<Redirect to={'/dashboard/crm/dashboard'} />);
      }
      else {
         return (<Redirect to={'/signin'} />);
      }
   }
   else{
      if (user) {
         return (
            <RctCRMLayout >
               {routerService && routerService.map((route, key) =>
                  <Route key={key} path={`${match.url}/${route.path}`} component={route.component} />
               )}
            </RctCRMLayout >
         );
      }
      else {
         return (<Redirect to={'/signin'} />);
      }
   }
}

export default withRouter(CRMLayout);
