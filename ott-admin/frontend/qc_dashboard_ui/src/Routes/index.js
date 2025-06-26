// routes
//import Dashboard from 'Routes/dashboard'; 
import Crm from 'Routes/crm';
import Overview from 'Components/OverviewPage/Overview'
import User from './userManagement';



let routes = [ 
   {
      path: 'crm',
      component: Crm
   },
   {
      path: 'overview',
      component: Overview
   },
   {
      path: 'crm',
      component: User
   }
]

export default routes;