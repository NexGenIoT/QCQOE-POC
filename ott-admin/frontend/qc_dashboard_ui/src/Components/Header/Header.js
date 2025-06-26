/**
 * App Header
 */

import { useDispatch, useSelector } from "react-redux";
import { IconButton, AppBar, Toolbar, Tooltip } from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import MenuIcon from "@material-ui/icons/Menu";
import UserBlock from "../Sidebar/UserBlock";
import Notifications from "./Notifications";
// actions
import { collapsedSidebarAction, setTabsValueExpert, setTabValue, setTabValueMitigation } from "Store/Actions";
import ThemeOptions from "Components/ThemeOptions/ThemeOptions";
import GlobalSetting from "./GlobalSetting";
import siteLogo from '../../Assets/Images/NexgenLogo.png'

function Header(props) {
  const dispatch = useDispatch();
  const settings = useSelector((state) => state.settings);
  const onToggleNavCollapsed = (event) => {
    const val = settings.navCollapsed ? false : true;   
    dispatch(collapsedSidebarAction(val));
  };
  const setTabToDefault = () => {
    dispatch(setTabValue(0))
    dispatch(setTabsValueExpert(0))
    dispatch(setTabValueMitigation(0))
    localStorage.setItem("newValue",0)//set to 0 for mitgation tab
  }

  const closeAllModal=(e)=>{
    console.log("abcd",e);
  }
  const { horizontalMenu, agencyMenu } = props;
  return (
    <AppBar position="static" className="rct-header">
      <Toolbar className="d-flex justify-content-between w-100 pl-0">
        <div className="d-inline-flex align-items-center"> 
          {!agencyMenu && (
            <ul className="list-inline mb-0 navbar-left">
              {!horizontalMenu ? (
                <li
                  className="list-inline-item"
                  onClick={(e) => onToggleNavCollapsed(e)}
                >
                  <Tooltip title="Sidebar Toggle" placement="bottom">
                    <IconButton
                      color="inherit"
                      mini="true"
                      aria-label="Menu"
                      className="humburger p-0"
                    >
                      <MenuIcon />
                    </IconButton>
                  </Tooltip>
                </li>
              ) : (
                <li className="list-inline-item">
                  <Tooltip title="Sidebar Toggle" placement="bottom">
                    <IconButton
                      color="inherit"
                      aria-label="Menu"
                      className="humburger p-0"
                      component={Link}
                      to="/"
                    >
                      <i className="ti-layout-sidebar-left"></i>
                    </IconButton>
                  </Tooltip>
                </li>
              )}
            </ul>
          )}
          <div onClick={setTabToDefault} className="brand">
            <div className="logo">
              {" "}
              <Link to="/dashboard/crm/dashboard" className="logo-normal">
                <img
                  // src={`${process.env.PUBLIC_URL}/assets/images/img/black.png`}
                  src={siteLogo}
                  className="img-fluid"
                  alt="site-logo"
                  width="58"
                  height="41"
                />
              </Link>{" "}
            </div>
            {
              window.location.href.includes('overview') && <h1>Video QC Dashboard</h1>
            }
            {
              window.location.href.includes('mitigation') && <h1>MITIGATION SUMMARY DASHBOARD</h1>
            }
            {
              window.location.href.includes('detectedanomalies') && <h1>EXPERT SYSTEM DASHBOARD</h1>
            }
          </div>
        </div>
        <div className="right-component">
          <li>
            {" "}
            <UserBlock />{" "}
          </li>
          <li>
            {" "}
            <ThemeOptions />{" "}
          </li>
          <li>
            {" "}
            <Notifications />
          </li>
          {/* <li>
            {" "}
            <GlobalSetting closeAllModal={closeAllModal} />{" "}
          </li> */}
          <li>
            {" "}
            <Link to="faq" className="logo-normal">
              {" "}
              <i className="zmdi zmdi-help-outline"></i>{" "}
            </Link>{" "}
          </li>
        </div>
      </Toolbar>
    </AppBar>
  );
}

export default withRouter(Header);
