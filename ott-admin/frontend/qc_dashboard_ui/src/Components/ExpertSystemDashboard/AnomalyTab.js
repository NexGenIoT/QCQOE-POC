import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import AnomaliesTable from "./AnomaliesTable";
import AnomalyPlayBackFailure from "./AnomalyPlayBackFailure";


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
const AnomalyTab = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return <>
        <div className="issue-wraper">
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"        >
                <Tab label="IN-SESSION" {...a11yProps(0)} />
                <Tab label="PLAYBACK FAILURE" {...a11yProps(1)} />
            </Tabs>
            <TabPanel value={value} index={0}>
                {/* <div className='status-report'> */}
                    <AnomaliesTable />
                {/* </div> */}
            </TabPanel>

        </div>
        <TabPanel value={value} index={1}>
            {/* <div className='status-report'> */}
                <AnomalyPlayBackFailure />
            {/* </div> */}
        </TabPanel>
    </>
}
export default AnomalyTab;