import React from 'react';
import PropTypes from 'prop-types';
import SwipeableViews from 'react-swipeable-views';
import { useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AssetdetailTable from './AssetdetailTable'
import IntlMessages from 'Util/IntlMessages';
import { Grid } from '@material-ui/core';
import VideoPlayer from '../VideoPlayer/VideoPlayer';
import { useSelector, useDispatch } from 'react-redux';
import { sendNotification } from 'Store/Actions';
import QcAnalysisDetaileTable from './QcAnalysis';

function TabPanel(props) {
   const { children, value, index, ...other } = props;

   return (
      <div
         role="tabpanel"
         hidden={value !== index}
         id={`full-width-tabpanel-${index}`}
         aria-labelledby={`full-width-tab-${index}`}
         {...other}
      >
         {value === index && (
            <Box p={3}>
               <Typography>{children}</Typography>
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
      id: `full-width-tab-${index}`,
      'aria-controls': `full-width-tabpanel-${index}`,
   };
}


export default function LogdetailModeltab() {
   const dispatch = useDispatch()
   const data = useSelector(state => state.logReducer);
   const { qcAnalyticData } = data
   const theme = useTheme();
   const [value, setValue] = React.useState(0);

   const handleChange = (event, newValue) => {
      setValue(newValue);
   };

   const handleChangeIndex = (index) => {
      setValue(index);
   };

   const info = useSelector(state => state.logReducer);
   const createNotification = (data) => {
        let assetId = ''
        data.map(d=>{
            if(d.key === "Asset Id"){
                return assetId = d.value
            }
            else{
                return null
            }
        })
        dispatch(sendNotification(assetId))
   };

   

   return (
      <>
         <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="full width tabs example"
         >
            <Tab label="ASSET DETAILS" {...a11yProps(0)} />
            <Tab label="QC ANALYSIS" {...a11yProps(1)} />
            <Tab label="SNAPSHOT" {...a11yProps(2)} />
         </Tabs>
         <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
         >
            <TabPanel value={value} index={0} dir={theme.direction}>
               <AssetdetailTable />
            </TabPanel>
            <TabPanel value={value} index={1} dir={theme.direction}>
            <QcAnalysisDetaileTable qcAnalyticData={qcAnalyticData}/>
            </TabPanel>
            <TabPanel value={value} index={2} dir={theme.direction}>
               <Grid>
                  <div style={{ textAlign: 'end' }}>
                     <button onClick={()=> createNotification(info?.logAssetData?.data)} type="button" className="btn btn-primary btn-sm mr-10" style={{ background: 'linear-gradient(45deg, #2fafff, #1a8cd4)', border: '0px' }}>
                        <IntlMessages id="Send Notification" />
                     </button>
                  </div>
                  <Grid>
                     <div style={{ marginTop: '35px', borderRadius: '0px' }}>
                        <VideoPlayer />
                     </div>
                  </Grid>
               </Grid>
            </TabPanel>
         </SwipeableViews>
      </>
   );
}
