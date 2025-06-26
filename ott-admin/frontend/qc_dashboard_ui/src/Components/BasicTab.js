import React, { useEffect } from "react";
import PropTypes from "prop-types";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import AssetsCount from "./OverviewPage/AssetsCount";
import AssetsOverview from "./OverviewPage/AssetsOverview";
import ContentPartner from "./OverviewPage/ContentPartner";
import LogDetail from "./Logdetail-Page/LogDetail";
import PendingData from "./PendingDataPage/PendingData";
import IssueAnalysis from "./IssueAnalysis/IssueAnalysis";
import { useDispatch, useSelector } from "react-redux";

import {
  getAssetDetails,
  setTabValue,
  clearAssetInfoData
} from 'Store/Actions';
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { useState } from "react";
import ManagementDetail from "ResourceManagement/managementTable";
import Catalogue from "./Catalogue/Catalogue";
import { isValidPermission } from "Constants/constant";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


export default function SimpleTabs() {
  const finalData = useSelector(state => state.overviewReducer);
  const dispatch = useDispatch();
  const [totalQoeCount, setTotalQoeCount] = useState(0);

  const handleChange = (event, newValue) => {
    dispatch(setTabValue(newValue))
    if (newValue === 1) {
      localStorage.removeItem('overview')
      localStorage.removeItem('btnType')
      dispatch(clearAssetInfoData())
    }
    if (newValue === 0) {
      localStorage.removeItem('overview')
      localStorage.removeItem('btnType')
    }
  };
  useEffect(() => {
    localStorage.removeItem('overview')
    localStorage.removeItem('btnType')
    dispatch(getAssetDetails(dispatch))
  }, [dispatch])

  useEffect(() => {
    return () => {
      localStorage.removeItem('overview')
      localStorage.removeItem('btnType')
    }
  }, [])

  useEffect(() => {

    let tempCount = 0;
    if (finalData?.analysisCounts) {

      for (let index = 0; index < Object.keys(finalData?.analysisCounts).length; index++) {

        tempCount = tempCount + parseInt(finalData?.analysisCounts[Object.keys(finalData?.analysisCounts)[index]])
        setTotalQoeCount(tempCount)


      }
    }


  }, [finalData?.analysisCounts, finalData.imageInfo])
  const data = useSelector(state => state.overviewReducer);


  return (
    <>
      <AppBar position="static" className="tab-heading">
        <Tabs
          value={data?.tabValue}
          onChange={handleChange}
          aria-label="simple tabs example"
        >
          <Tab label="OVERVIEW" {...a11yProps(0)} />
          <Tab disabled={!isValidPermission("READ_LOG_DETAIL")} label="LOG DETAILS" {...a11yProps(1)} />
          <Tab  disabled={!isValidPermission("READ_ISSUE_ANALYSIS")} label="ISSUE ANALYSIS" {...a11yProps(2)} />
          <Tab  disabled={!isValidPermission("READ_PENDING_IN_QUEUE")} label="PENDING IN QUEUE " {...a11yProps(3)} />
          <Tab disabled={!isValidPermission("READ_RESOURCE_MANAGEMENT")} label="RESOURCE MANAGEMENT " {...a11yProps(4)} />
          <Tab disabled={!isValidPermission("READ_INGESTION_INSIGHT")} label="INGESTION INSIGHT " {...a11yProps(5)} />
        </Tabs>
      </AppBar>
      <TabPanel value={data?.tabValue} index={0}>
        {/* <div style={{'text-align':'end'}}>
        <Tooltip title="Refresh Overview" placement="bottom">
          <IconButton style={{'align-items': 'center','position': 'absolute','right': '60px','top': '40px'}}  className="custom-notification" aria-label="bell">
            <i className="zmdi zmdi-settings"></i>
          </IconButton>
        </Tooltip>
        </div> */}
        <AssetsCount info={data.assetInfo} qoeCount={totalQoeCount} />
        <AssetsOverview />
        <ContentPartner />

      </TabPanel>
      <TabPanel value={data?.tabValue} index={1}>
        <LogDetail />
      </TabPanel>
      <TabPanel value={data?.tabValue} index={2}>
        <IssueAnalysis />
      </TabPanel>
      <TabPanel value={data?.tabValue} index={3}>
        <PendingData />
      </TabPanel>
      <TabPanel value={data?.tabValue} index={4}>
        <ManagementDetail />
      </TabPanel>
      <TabPanel value={data?.tabValue} index={5}>
        <Catalogue />
      </TabPanel>

    </>
  );
}
