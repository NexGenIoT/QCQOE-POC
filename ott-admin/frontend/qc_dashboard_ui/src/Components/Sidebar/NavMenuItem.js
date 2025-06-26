/**
 * Nav Menu Item
 */
import React, { Fragment, useState } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  Collapse,
  Chip,
} from "@material-ui/core";
import { useDispatch } from "react-redux";
import classNames from "classnames";
import {
  setTabValue,
  collapsedSidebarAction,
  setTabsValueExpert,
  setTabValueMitigation
} from 'Store/Actions';
// intl messages
import IntlMessages from "Util/IntlMessages";
import { sideMenu } from "../../Constants/SubMenu";
import { NavLink, withRouter } from 'react-router-dom';
import { isValidPermission } from "Constants/constant";

function NavMenuItem(props) {
  const dispatch = useDispatch();
  const [subMenuOpen, setSubMenuOpen] = useState("");
  const [open, setOpen] = useState(0);
  const { menu, onToggleMenu } = props;
  const onToggleCollapseMenu = (index) => {
    if (subMenuOpen === "") {
      setSubMenuOpen(index);
    } else if (subMenuOpen !== index) {
      setSubMenuOpen(index);
    } else {
      setSubMenuOpen("");
    }
  };
  const clickOnSubmenu = (tabId) => {


    if (typeof tabId === 'number') {
      dispatch(setTabValue(tabId))
      dispatch(setTabsValueExpert(tabId))
      dispatch(setTabValueMitigation(tabId))
      dispatch(collapsedSidebarAction(false))
    }
    else {
      dispatch(collapsedSidebarAction(false))
    }
  }

  const IsDisabled = (tabId, path) => {
    if (tabId == 0 && path == "overview") {
      return false//!isValidPermission("READ_LOG_DETAIL")
    } else if (tabId == 1 && path == "overview") {
      return !isValidPermission("READ_LOG_DETAIL")
    } else if (tabId == 2 && path == "overview") {
      return !isValidPermission("READ_ISSUE_ANALYSIS")
    } else if (tabId == 3 && path == "overview") {
      return !isValidPermission("READ_PENDING_IN_QUEUE")
    } else if (tabId == 4 && path == "overview") {
      return !isValidPermission("READ_RESOURCE_MANAGEMENT")
    } else if (tabId == 5 && path == "overview") {
      return !isValidPermission("READ_INGESTION_INSIGHT")
    }

    if (path == "experience-insights") {
      return !isValidPermission("READ_EXPERIENCE_INSIGHT")
    } else if (path == "realtime-key-insights") {
      return !isValidPermission("READ_REAL_TIME_KEY_INSIGHTS")
    } else if (path == "user-engagement-metrics") {
      return !isValidPermission("READ_USER_ENGAGEMENT_METRICS")
    } else if (path == "quality-of-experience") {
      return  !isValidPermission("READ_QUALITY_OF_EXPERIENCE")
    } else if (path == "favorite") {
      return !isValidPermission("READ_FAVORITE")
    } else if (path == "location") {
      return !isValidPermission("READ_LOCATION")
    } else if (path == "error-screen") {
      return !isValidPermission("READ_SSO_PLAYBACK_ERRORS")
    }
   if (path == "mitigation") {
      if(tabId==0){
        return !isValidPermission("READ_MITIGATION")
      }else if(tabId==1){
        return !isValidPermission("READ_ANALYTICS")
      } 
    }

    if (path == "detectedanomalies") {
      if(tabId==0){
        return !isValidPermission("READ_DETECTED_ANOMALIES")
      }else if(tabId==1){
        return !isValidPermission("READ_ESTIMATED_ROOT_CAUSE")
      } else if(tabId==2){
        return !isValidPermission("READ_CONFIGURE_RCA")
      } else if(tabId==3){
        return !isValidPermission("READ_CONFIGURE_MITIGATION")
      } else if(tabId==4){
        return !isValidPermission("READ_AI_PIPELINE_INSIGHT")
      }  
    }

   
  }

  if (menu.child_routes != null) {
    return (
      <Fragment>
        {sideMenu &&
          sideMenu.length > 0 &&
          sideMenu.map((option) => {
            return (
              <React.Fragment key={option.id}>
                <ListItem
                  button
                  component="li"
                  onClick={() => {
                    setOpen((v) => (v === option.id ? 0 : option.id));
                    onToggleMenu();
                  }}
                  className={`list-item bg ${classNames({
                    "item-active": open === option.id,
                  })}`}
                >

                  <span className="menu text-capitalize">{option.title}</span>
                </ListItem>
                <Collapse
                  in={open === option.id}
                  timeout="auto"
                  className="sub-menu"
                >
                  <Fragment>
                    {menu.type_multi == null ? (
                      <List className="list-unstyled py-0">
                        {option.subMenu.map((subMenu, index) => {
                          return (
                            <ListItem  onClick={() => clickOnSubmenu(subMenu.tabId)} button component="li" key={index}>
                              <NavLink
                                to={subMenu.path}
                                activeClassName="item-active"
                              >
                                <span className="menu">
                                  <p>{subMenu.value}</p>
                                </span>
                              </NavLink>
                            </ListItem>
                          );
                        })}
                      </List>
                    ) : (
                      <List className="list-unstyled py-0">
                        {menu.child_routes.map((subMenu, index) => {
                          return (
                            <Fragment key={index}>
                              <ListItem
                                button
                                component="lis"
                                onClick={() => onToggleCollapseMenu(index)}
                                className={`list-item ${classNames({
                                  "item-active": subMenuOpen === index,
                                })}`}
                              >
                                <span className="menu">
                                  <IntlMessages id={subMenu.menu_title} />
                                  {menu.new_item && menu.new_item === true ? (
                                    <Chip
                                      label="new"
                                      className="new-item"
                                      color="secondary"
                                    />
                                  ) : null}
                                </span>
                              </ListItem>
                              <Collapse
                                in={subMenuOpen === index}
                                timeout="auto"
                              >
                                <List className="list-unstyled py-0">
                                  {subMenu.child_routes.map(
                                    (nestedMenu, nestedKey) => (
                                      <ListItem
                                        button
                                        component="lis"
                                        key={nestedKey}
                                      >
                                        <NavLink
                                          activeClassName="item-active"
                                          to={nestedMenu.path}
                                        >
                                          <span className="menu pl-10 d-inline-block">
                                            <IntlMessages
                                              id={nestedMenu.menu_title}
                                            />
                                            {menu.new_item &&
                                              menu.new_item === true ? (
                                              <Chip
                                                label="new"
                                                className="new-item"
                                                color="secondary"
                                              />
                                            ) : null}
                                          </span>
                                        </NavLink>
                                      </ListItem>
                                    )
                                  )}
                                </List>
                              </Collapse>
                            </Fragment>
                          );
                        })}
                      </List>
                    )}
                  </Fragment>
                </Collapse>
              </React.Fragment>
            );
          })}
      </Fragment>
    );
  }
  return (
    <ListItem button component="li">
      <NavLink activeClassName="item-active" to={menu.path}>
        <ListItemIcon className="menu-icon">
          <i className={menu.menu_icon}></i>
        </ListItemIcon>
        <span className="menu">
          <IntlMessages id={menu.menu_title} />
        </span>
      </NavLink>
    </ListItem>
  );
}

export default withRouter(NavMenuItem);
