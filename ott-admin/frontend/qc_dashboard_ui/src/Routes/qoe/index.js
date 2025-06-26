import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Crm = ({ match }) => (   
   <div className="Crm-wrapper">      
      <Switch>
         <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
         <Route path={`${match.url}/dashboard`} component={Dashboard} />
      </Switch>
   </div>
);

export default Crm;