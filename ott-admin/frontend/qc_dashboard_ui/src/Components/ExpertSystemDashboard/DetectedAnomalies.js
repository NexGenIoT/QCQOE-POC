import {
  Box, 
  Grid,
  Tab,
  Tabs,
  Typography,
} from "@material-ui/core"; 
import React, {useState} from "react";
import PropTypes from 'prop-types';
import EstimatedRootCauses from "./EstimatedRootCauses";
import AnomaliesTable from './AnomaliesTable'
import ConfigureMitigation from './ConfigureMitigation'
import { useDispatch, useSelector } from "react-redux";
import { setTabsValueExpert } from "Store/Actions";
import AiPipelineInsight from "./AiPipelineInsight";
import ConfigureRCA from "./ConfigureRCA";
import { isValidPermission } from "Constants/constant";

export default function DetectedAnomalies() {
  const dispatch = useDispatch()
  const handleChange = (event, newValue) => {
    dispatch(setTabsValueExpert(newValue))
  };
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
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const stylee = {
    color: 'white',
    background: '#1992fb',
    width: '83px',
    height: '28px',
    fontSize: '1rem',
    fontWeigth: '100',
  }
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
                 <Tab disabled={!isValidPermission("READ_DETECTED_ANOMALIES")} label="DETECTED ANOMALIES" {...a11yProps(0)} />
                 <Tab disabled={!isValidPermission("READ_ESTIMATED_ROOT_CAUSE")} label="ESTIMATED ROOT CAUSES" {...a11yProps(1)} />  
                 <Tab disabled={!isValidPermission("READ_CONFIGURE_RCA")}  label="CONFIGURE RCA" {...a11yProps(2)} />  
                 <Tab disabled={!isValidPermission("READ_CONFIGURE_MITIGATION")}  label="CONFIGURE MITIGATION" {...a11yProps(3)} /> 
                 <Tab disabled={!isValidPermission("READ_AI_PIPELINE_INSIGHT")}  label="AI PIPELINE INSIGHT" {...a11yProps(4)} /> 
                </Tabs>
              </Box>
            </Grid>  
          </Grid>
        </Box>

        <TabPanel value={data?.tabValueExpert} index={0}>
          <div className="anomalies-wraper" >
           <div className="detectedanomalies">
           <AnomaliesTable/>   
            </div>
          </div>
          
        </TabPanel>
        <TabPanel value={data?.tabValueExpert} index={1}>        
        <div className="anomalies-wraper" >
           <div className="detectedanomalies">
           <EstimatedRootCauses/>
            </div>
          </div>
        </TabPanel> 
        <TabPanel value={data?.tabValueExpert} index={2}>        
        <div className="anomalies-wraper" >
           <div className="detectedanomalies">
            <ConfigureRCA/>
            </div>
          </div>
        </TabPanel> 
        <TabPanel value={data?.tabValueExpert} index={3}>        
        <div className="anomalies-wraper" >
           <div className="detectedanomalies">
            <ConfigureMitigation/>
            </div>
          </div>
        </TabPanel> 
        <TabPanel value={data?.tabValueExpert} index={4}>  
            <AiPipelineInsight/> 
        </TabPanel>
      </div>
    </>
  );
}
