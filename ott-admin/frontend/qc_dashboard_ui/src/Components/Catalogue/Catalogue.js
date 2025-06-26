import { Box, Tab, Tabs, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import ContentCatalogue from "./ContentCatalogue";
import IngestionLog from "./IngestionLog";




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
    //  setApply(false)
    //  setCheckedContent([])
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

  const Catalogue = ()=>{
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
        if (value > 0) {
          
        }else{
        }
    
      };
    

    return <>

<div className="issue-wraper">
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"        >
        <Tab label="CONTENT CATALOGUE" {...a11yProps(0)} />
        <Tab label="INGESTION LOG" {...a11yProps(1)} />

        {/* {isValidPermission("CONTENT_CATALOGUE")?<Tab label="CONTENT CATALOGUE" {...a11yProps(0)} />:null}
        {isValidPermission("INGESTION_LOG")?<Tab label="INGESTION LOG" {...a11yProps(isValidPermission("CONTENT_CATALOGUE")?1:0)} />:null} */}

      </Tabs>

      <TabPanel value={value} index={0}>
        <ContentCatalogue/>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <IngestionLog/>
      </TabPanel>
      </div>
    </>

  }

  export default Catalogue