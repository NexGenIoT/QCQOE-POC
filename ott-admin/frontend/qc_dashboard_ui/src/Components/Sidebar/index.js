/**
 * Reactify Sidebar
 */
import React, { Component, Fragment } from "react"; 
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Scrollbars } from "react-custom-scrollbars";

// redux actions
import { collapsedSidebarAction } from "Store/Actions";

// components
import SidebarContent from "./SidebarContent";
import AgencySidebar from "../AgencyMenu/AgencySidebar";

class Sidebar extends Component {
  UNSAFE_componentWillMount() {
    this.updateDimensions();
  }

  shouldComponentUpdate(nextProps) {
    const {
      enableSidebarBackgroundImage,
      selectedSidebarImage,
      isDarkSidenav,
      locale,
    } = this.props;
    if (
      enableSidebarBackgroundImage !== nextProps.enableSidebarBackgroundImage ||
      selectedSidebarImage !== nextProps.selectedSidebarImage ||
      isDarkSidenav !== nextProps.isDarkSidenav ||
      locale
    ) {
      return true;
    } else {
      return false;
    }
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { windowWidth } = this.state;
    if (nextProps.location !== this.props.location) {
      if (windowWidth <= 1199) {
        this.props.collapsedSidebarAction(false);
      }
    }
  }

  updateDimensions = () => {
    this.setState({
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
    });
  };

  render() {
    const {
      agencySidebar,
    } = this.props;
    return (
      <Fragment>
        <div className="rct-sidebar sidebar-nav">
          <div
            className="rct-sidebar-content">
            <div className="rct-sidebar-wrap">
              <Scrollbars
                className="rct-scroll"
                autoHide
                autoHideDuration={100}
                style={{ height: "calc(100vh - 60px)" }}
              >
                {!agencySidebar ? <SidebarContent /> : <AgencySidebar />}
              </Scrollbars>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }
}

// map state to props
const mapStateToProps = ({ settings }) => {
  const {
    enableSidebarBackgroundImage,
    selectedSidebarImage,
    collapsedSidebar,
    isDarkSidenav,
    locale,
  } = settings;
  return {
    enableSidebarBackgroundImage,
    selectedSidebarImage,
    collapsedSidebar,
    isDarkSidenav,
    locale,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    collapsedSidebarAction,
  })(Sidebar)
);
