/**
 * Sidebar Content
 */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListSubheader } from '@material-ui/core';
import { withRouter, Link } from 'react-router-dom';
import IntlMessages from 'Util/IntlMessages';
import NavMenuItem from './NavMenuItem';
import Button from "@material-ui/core/Button";
// redux actions
import { onToggleMenu } from 'Store/Actions';
// actions
import { collapsedSidebarAction } from "Store/Actions";

function SidebarContent() {
   const dispatch = useDispatch();
   const sidebar = useSelector(state => state.sidebar);
   const { sidebarMenus } = sidebar; 
   const settings = useSelector((state) => state.settings);

   const toggleMenu = (menu, stateCategory) => {
      let data = { menu, stateCategory }
      dispatch(onToggleMenu(data));
   }

   // function to change the state of collapsed sidebar
  const onToggleNavCollapsed = (event) => {
   const val = settings.navCollapsed ? false : true;   
   dispatch(collapsedSidebarAction(val));
 };

   return (
      <div className="rct-sidebar-nav">
         <nav className="navigation">
            {sidebarMenus.category1 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={
                     <ListSubheader className="side-title" component="li">
                        menu
                        <Button className="close-menu" onClick={(e) => onToggleNavCollapsed(e)}>
                           <i className="zmdi zmdi-close"></i>{" "}
                        </Button>
                     </ListSubheader>}
               >
                  <ListSubheader className="for-dashboard" component="li">
               <Link to="/dashboard/crm/dashboard">
                  <b></b>
               <img alt='map' src={`${process.env.PUBLIC_URL}/assets/dashboard.svg`} />
                  Dashboard </Link>  
                     </ListSubheader>
                  {sidebarMenus.category1.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category1')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category2 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.modules" /></ListSubheader>}
               >
                  {sidebarMenus.category2.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category2')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category3 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.component" /></ListSubheader>}
               >
                  {sidebarMenus.category3.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category3')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category4 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.features" /></ListSubheader>}
               >
                  {sidebarMenus.category4.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category4')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category5 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.applications" /></ListSubheader>}
               >
                  {sidebarMenus.category5.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category5')}
                     />
                  ))}
               </List>
            }
            {sidebarMenus.category6 &&
               <List
                  className="rct-mainMenu p-0 m-0 list-unstyled"
                  subheader={<ListSubheader className="side-title" component="li"><IntlMessages id="sidebar.extensions" /></ListSubheader>}
               >
                  {sidebarMenus.category6.map((menu, key) => (
                     <NavMenuItem
                        menu={menu}
                        key={key}
                        onToggleMenu={() => toggleMenu(menu, 'category6')}
                     />
                  ))}
               </List>
            }
         </nav>
      </div>
   );
}

export default withRouter(SidebarContent);
