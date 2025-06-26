import {
  Box,
  Grid,
  Tab,
  Tabs,
} from "@material-ui/core";
import React from "react";
import PropTypes from 'prop-types';
import EstimatedRootCauses from 'Components/ExpertSystemDashboard/EstimatedRootCauses';
import AnomaliesTable from 'Components/ExpertSystemDashboard/AnomaliesTable';
import ConfigureMitigation from 'Components/ExpertSystemDashboard/ConfigureMitigation';
import { useDispatch, useSelector } from "react-redux";
import { setTabsValueExpert } from "Store/Actions";
import AiPipelineInsight from 'Components/ExpertSystemDashboard/AiPipelineInsight';
import ConfigureRCA from "./ExpertSystemDashboard/ConfigureRCA";
import AnomalieCSVUpload from "./ExpertSystemDashboard/AnomalieCSVUpload";
import AnomalyPlayBackFailure from "./ExpertSystemDashboard/AnomalyPlayBackFailure";
import AnomalyTab from "./ExpertSystemDashboard/AnomalyTab";

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
        <>
          {children}
        </>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function BasicTabExpertSystem() {
  const dispatch = useDispatch()
  const handleChange = (event, newValue) => {
    dispatch(setTabsValueExpert(newValue))
  };
  const data = useSelector(state => state.qoeReducer);
  return (
    <>
      <div className="mitigation-summary ecom-dashboard-wrapper">
        <Box
          className="insightTabs"
          style={{ marginBottom: "0px", background: "transparent" }}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={12}>
              <Box
                style={{
                  background: "transparent",
                  paddingBottom: "2px",
                  marginBottom: "0px",
                }} className="tab-heading"
              >
                <Tabs
                  onChange={handleChange}
                  value={data?.tabValueExpert}
                  className="tabs"
                  style={{ alignItems: "start" }}
                >
                  <Tab label="DETECTED ANOMALIES" {...a11yProps(0)} />
                  <Tab label="ESTIMATED ROOT CAUSES" {...a11yProps(1)} />
                  <Tab label="CONFIGURE RCA" {...a11yProps(2)} />
                  <Tab label="CONFIGURE MITIGATION" {...a11yProps(3)} />
                  <Tab label="AI PIPELINE INSIGHT" {...a11yProps(4)} />
                </Tabs>
              </Box>
            </Grid>
          </Grid>
        </Box>

        <TabPanel value={data?.tabValueExpert} index={0}>
          <div className="anomalies-wraper" >
            <div className="detectedanomalies2">
              <AnomalyTab/>
            </div>
          </div>

        </TabPanel>
        <TabPanel value={data?.tabValueExpert} index={1}>
          <div className="anomalies-wraper" >
            <div className="detectedanomalies">
              <EstimatedRootCauses />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={data?.tabValueExpert} index={2}>
          <div className="anomalies-wraper" >
            <div className="detectedanomalies">
              <ConfigureRCA />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={data?.tabValueExpert} index={3}>
          <div className="anomalies-wraper" >
            <div className="detectedanomalies">
              <ConfigureMitigation />
            </div>
          </div>
        </TabPanel>
        <TabPanel value={data?.tabValueExpert} index={4}>
          <AiPipelineInsight />
        </TabPanel>
      </div>
    </>
  );
}
