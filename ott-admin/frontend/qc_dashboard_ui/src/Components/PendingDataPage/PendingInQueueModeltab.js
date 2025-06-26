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


export default function PendingInQueueModeltab() {
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

   // const videoError = (title, data) => (
   //    <>
   //       {
   //          data && (
   //             <div>
   //                <h1>{title}</h1>
   //                {
   //                   Object.entries(data).map((key, i) => {
   //                      if (key[0] === 'black_screen' && key[1].length > 0) {
   //                         return (
   //                            <>
   //                               <h1>Black Screen</h1>
   //                               <div className='error-description'>
   //                                  {key[0] === 'black_screen' && key[1].length > 0 && key[1].map(data => {
   //                                     return (
   //                                        <div className='inner-block'>
   //                                           {
   //                                              data.image_name && (
   //                                                 <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                    <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`}/>
   //                                                 </div>
   //                                              )
   //                                           }
   //                                           <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
   //                                              {
   //                                                 data.start_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <b>Start Time</b>
   //                                                       <span>{data.start_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                              {
   //                                                 data.end_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <b>End Time</b>
   //                                                       <span>{data.end_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                           </div>
   //                                        </div>
   //                                     )
   //                                  })}
   //                               </div>
   //                            </>
   //                         )
   //                      }
   //                      if (key[0] === 'video_freeze' && key[1].length > 0) {
   //                         return (
   //                            <>
   //                               <h1>Video Freeze</h1>
   //                               <div className='error-description'>
   //                                  {key[0] === 'video_freeze' && key[1].length > 0 && key[1].map(data => {
   //                                     return (
   //                                        <div className='inner-block'>
   //                                           {
   //                                              data.image_name && (
   //                                                 <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                    <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`}/>
   //                                                 </div>
   //                                              )
   //                                           }
   //                                           <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
   //                                              {
   //                                                 data.start_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <b>Start Time</b>
   //                                                       <span>{data.start_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                              {
   //                                                 data.end_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <b>End Time</b>
   //                                                       <span>{data.end_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                           </div>
   //                                        </div>
   //                                     )
   //                                  })}
   //                               </div>
   //                            </>
   //                         )
   //                      }
   //                      if (key[0] === 'macro_block' && key[1].length > 0) {
   //                         return (
   //                            <>
   //                               <h2>Macro Block</h2>
   //                               <div className='error-description'>
   //                                  {key[0] === 'macro_block' && key[1].length > 0 && key[1].map(data => {
   //                                     return (
   //                                        <div className='inner-block'>
   //                                           {
   //                                              data.image_name && (
   //                                                 <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                    <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`}/>
   //                                                 </div>
   //                                              )
   //                                           }
   //                                           <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
   //                                              {
   //                                                 data.start_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <b>Start Time</b>
   //                                                       <span>{data.start_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                              {
   //                                                 data.end_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <b>End Time</b>
   //                                                       <span>{data.end_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                           </div>
   //                                        </div>
   //                                     )
   //                                  })}
   //                               </div>
   //                            </>
   //                         )
   //                      }
   //                      if (key[0] === 'policy_violation' && key[1].length > 0) {
   //                         return (
   //                            <>
   //                               <h1>Policy Voilation</h1>
   //                               <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
   //                                  {key[0] === 'policy_violation' && key[1].length > 0 && key[1].map(data => {
   //                                     return (
   //                                        <div style={{ width: '50%', border: '1px solid black' }}>
   //                                           {
   //                                              data.image_name && (
   //                                                 <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                    <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`}/>
   //                                                 </div>
   //                                              )
   //                                           }
   //                                           <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'space-between'}}>
   //                                              {
   //                                                 data.start_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <span style={{ fontWeight: 'bold' }}>Start Time</span>
   //                                                       <span>{data.start_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                              {
   //                                                 data.end_time && (
   //                                                    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
   //                                                       <span style={{ fontWeight: 'bold' }}>End Time</span>
   //                                                       <span>{data.end_time}</span>
   //                                                    </div>
   //                                                 )
   //                                              }
   //                                           </div>
   //                                        </div>
   //                                     )
   //                                  })}
   //                               </div>
   //                            </>
   //                         )
   //                      }
   //                      else{
   //                         return null
   //                      }
   //                   })
   //                }
   //             </div>
   //          )
   //       }
   //    </>

   // )

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
            {/* <Tab label="QC ANALYSIS" {...a11yProps(1)} />
            <Tab label="SNAPSHOT" {...a11yProps(2)} /> */}
         </Tabs>
         <SwipeableViews
            axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
            index={value}
            onChangeIndex={handleChangeIndex}
         >
            <TabPanel value={value} index={0} dir={theme.direction}>
               <AssetdetailTable />
            </TabPanel>
            {/* <TabPanel value={value} index={1} dir={theme.direction}>
               <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                  <li style={{ width: '50%', paddingBottom: 20, display: 'flex', flexDirection: 'row' }}>
                     <p style={{ width: '50%' }}>QC Status</p>
                     <b style={{ width: '50%', textAlign: 'left' }}>{qcAnalyticData?.qcStatus ? qcAnalyticData?.qcStatus : 'Not Done'}</b>
                  </li>
                  <li style={{ width: '50%', paddingBottom: 20, display: 'flex', flexDirection: 'row' }}>
                     <p style={{ width: '50%' }}>Audio Type Errors</p>
                     <b style={{ width: '50%', textAlign: 'left' }}>{qcAnalyticData?.audio_type_errors}</b>
                  </li>
                  <li style={{ width: '50%', paddingBottom: 20, display: 'flex', flexDirection: 'row' }}>
                     <p style={{ width: '50%' }}>Video Type Errors</p>
                     <b style={{ width: '50%', textAlign: 'left' }}>{qcAnalyticData?.video_type_errors}</b>
                  </li>
               </ul>
             <div className='error-detail'>  {videoError("Video Errors", qcAnalyticData?.video_errors)}</div>
             <div className='error-detail'>  {videoError("Audio Errors", qcAnalyticData?.audio_errors)} </div>
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
            </TabPanel> */}
         </SwipeableViews>
      </>
   );
}
