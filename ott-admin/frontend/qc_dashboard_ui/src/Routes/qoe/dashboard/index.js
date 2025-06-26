import React, { useEffect, useState } from 'react';
import { Grid } from "@material-ui/core";
import RealTimeSliderContainer from 'Components/SliderContainer/RealTimeSliderContainer';
import UserEngagementSliderContainer from 'Components/SliderContainer/UserEngagementSliderContainer';
import QualityOfExperienceSliderContainer from 'Components/SliderContainer/QualityOfExperienceSliderContainer';
import VideoQCSliderContainer from 'Components/SliderContainer/VideoQCSliderContainer';
import MitigationSliderContainer from 'Components/SliderContainer/MitigationSliderContainer';
import AIPipelineSliderContainer from 'Components/SliderContainer/AIPipelineSliderContainer';
import { useDispatch, useSelector } from "react-redux";
import DashboardAnalysis from 'Components/DashboardAnalysis/DashboardAnalysis';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import { clearAllMetrics, clearAssetInfoData, getWidgetDataRequest, setMetricType, setMetricTypeFullName } from 'Store/Actions';
import CircularProgress from '@mui/material/CircularProgress';
import DashboardLocation from '../dashboardLocation';
import Location from '../location';

export default function Dashboard(props) {

   const dispatch = useDispatch()
   localStorage.removeItem('contentPartner')
   useEffect(() => {
      return () => {
         dispatch(clearAllMetrics())
      }
   }, [dispatch])

   useEffect(() => {

      const interval = setInterval(() => {
         // localStorage.removeItem('contentPartner')
         // console.log("abcd--",window.location.href,window.location.href.includes('dashboard/crm/dashboard')+"--"+window.location.origin);
         if (window.location.href.includes('dashboard/crm/dashboard')) {
            dispatch(setMetricType(''))
            dispatch(setMetricTypeFullName(''));
            dispatch(getWidgetDataRequest("attempts", dispatch, false))
            dispatch(getWidgetDataRequest("average_bitrate", dispatch, false))
            dispatch(getWidgetDataRequest("average_framerate", dispatch, false))
            dispatch(getWidgetDataRequest("average_percentage_completion", dispatch, false))
            dispatch(getWidgetDataRequest("bandwidth", dispatch, false))
            dispatch(getWidgetDataRequest("exit_before_video_starts", dispatch, false))
            dispatch(getWidgetDataRequest("minutes_per_unique_devices", dispatch, false))
            dispatch(getWidgetDataRequest("rebuffering_percentage", dispatch, false))
            dispatch(getWidgetDataRequest("rebuffering_ratio", dispatch, false))
            dispatch(getWidgetDataRequest("succesful_plays", dispatch, false))
            dispatch(getWidgetDataRequest("total_minutes_watched", dispatch, false))
            dispatch(getWidgetDataRequest("user_attrition", dispatch, false))
            dispatch(getWidgetDataRequest("video_playback_failures", dispatch, false))
            dispatch(getWidgetDataRequest("video_start_failures", dispatch, false))
            dispatch(getWidgetDataRequest("video_start_time", dispatch, false))
            dispatch(getWidgetDataRequest("video_restart_time", dispatch, false))
            dispatch(getWidgetDataRequest("rendering_quality", dispatch, false))
            dispatch(getWidgetDataRequest("concurrent_plays", dispatch, false))
            dispatch(getWidgetDataRequest("connection_induced_rebuffering_ratio", dispatch, false))
            dispatch(getWidgetDataRequest("unique_devices", dispatch, false))
            dispatch(getWidgetDataRequest("unique_viewers", dispatch, false))
            dispatch(getWidgetDataRequest("ended_plays", dispatch, false))
            dispatch(getWidgetDataRequest("ended_plays_per_unique_devices", dispatch, false))
            dispatch(getWidgetDataRequest("play_attempts", dispatch, false))

            dispatch(clearAssetInfoData())
         } else {
            clearInterval(interval)
         }
         return () => clearInterval(interval)
      }, 60000);

   }, []);

   useEffect(() => {
      localStorage.removeItem('contentPartner')
      dispatch(setMetricType(''))
      dispatch(setMetricTypeFullName(''));
      dispatch(getWidgetDataRequest("attempts", dispatch, true))
      dispatch(getWidgetDataRequest("average_bitrate", dispatch, true))
      dispatch(getWidgetDataRequest("average_framerate", dispatch, true))
      dispatch(getWidgetDataRequest("average_percentage_completion", dispatch, true))
      dispatch(getWidgetDataRequest("bandwidth", dispatch, true))
      dispatch(getWidgetDataRequest("exit_before_video_starts", dispatch, true))
      dispatch(getWidgetDataRequest("minutes_per_unique_devices", dispatch, true))
      dispatch(getWidgetDataRequest("rebuffering_percentage", dispatch, true))
      dispatch(getWidgetDataRequest("rebuffering_ratio", dispatch, true))
      dispatch(getWidgetDataRequest("succesful_plays", dispatch, true))
      dispatch(getWidgetDataRequest("total_minutes_watched", dispatch, true))
      dispatch(getWidgetDataRequest("user_attrition", dispatch, true))
      dispatch(getWidgetDataRequest("video_playback_failures", dispatch, true))
      dispatch(getWidgetDataRequest("video_start_failures", dispatch, true))
      dispatch(getWidgetDataRequest("video_start_time", dispatch, true))
      dispatch(getWidgetDataRequest("video_restart_time", dispatch, true))
      dispatch(getWidgetDataRequest("rendering_quality", dispatch, true))
      dispatch(getWidgetDataRequest("concurrent_plays", dispatch, true))
      dispatch(getWidgetDataRequest("connection_induced_rebuffering_ratio", dispatch, true))
      dispatch(getWidgetDataRequest("unique_devices", dispatch, true))
      dispatch(getWidgetDataRequest("unique_viewers", dispatch, true))
      dispatch(getWidgetDataRequest("ended_plays", dispatch, true))
      dispatch(getWidgetDataRequest("ended_plays_per_unique_devices", dispatch, true))
      dispatch(getWidgetDataRequest("play_attempts", dispatch, true))

      dispatch(clearAssetInfoData())
   }, [])

   useEffect(() => {
      localStorage.removeItem('contentPartner')
      dispatch(setMetricType(''))
      dispatch(setMetricTypeFullName(''));
   }, [dispatch])


   const data = useSelector(state => state.qoeReducer);
   // function round(num, digits, metricname) {
   //    // if (num > 1000) {
   //    //    const lookup = [
   //    //       { value: 1, symbol: "" },
   //    //       { value: 1e3, symbol: "k" },
   //    //       { value: 1e6, symbol: "M" },
   //    //       { value: 1e9, symbol: "G" },
   //    //       { value: 1e12, symbol: "T" },
   //    //       { value: 1e15, symbol: "P" },
   //    //       { value: 1e18, symbol: "E" }
   //    //    ];
   //    //    const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
   //    //    var item = lookup.slice().reverse().find(function (item) {
   //    //       return num >= item.value;
   //    //    });
   //    //    return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
   //    // } else if (num < 0) {
   //    //    if (metricname === "CIRR") {
   //    //       return num.toPrecision(3);//= Math.floor((Math.random()*1000000)+1);
   //    //    } else {
   //    //       return num.toPrecision(2);//= Math.floor((Math.random()*1000000)+1);
   //    //    }

   //    // } else {
   //    //    if (num == "-") {
   //    //       return num
   //    //    } else {

   //    //       return Number(num).toFixed(2)

   //    //    }
   //    // }
   //    return num;
   // }

   function round(num, digits) {
      const lookup = [
         { value: 1, symbol: "" },
         { value: 1e3, symbol: "k" },
         { value: 1e6, symbol: "M" },
         { value: 1e9, symbol: "G" },
         { value: 1e12, symbol: "T" },
         { value: 1e15, symbol: "P" },
         { value: 1e18, symbol: "E" }
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function (item) {
         return num >= item.value;
      });
      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : parseFloat(num).toFixed(digits);
   }

   return (

      <div className="dashboard-wrapper numberofMetrices" style={{ minHeight: 'calc(100vh - 170px)' }}>
         {data?.loading ? <div style={{ height: 'calc(100vh - 170px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><RctPageLoader /></div> :
            <>
               <Grid container>
                  {data?.widgetData?.length > 0 && data?.widgetData.map((item, index) =>
                     <Grid key={index} item xs={2} className="count-grid">
                        <div className="summaryVal card bg-light p-2 m-2 border-0 shadow rounded min-vh-24">
                           {/* {item?.hrs_change_24hrs && item?.hrs_change_24hrs === "-" ? <div style={{ height: 'calc(60vh - 130px)' }}><RctPageLoader /></div> : */}
                           <div style={{ display: 'flex', flexDirection: 'row' }}>
                              {
                                 item?.hrs_change_24hrs && (item?.hrs_change_24hrs) % 1 !== 0 ?
                                    <h3> {item?.hrs_change_24hrs ? round(item?.hrs_change_24hrs, 2, item?.metricname) : 0.00}</h3> :
                                    <h3>{item?.hrs_change_24hrs ? round(item?.hrs_change_24hrs, 2, item?.metricname) : 0}</h3>
                              }
                              <h4>{item?.unit}</h4>

                           </div>
                           {/* } */}
                           {/* {item?.metricname === "Video Playback Failures" || item?.metricname === "Video Start Failures"
                              || item?.metricname === "User Attrition" || item?.metricname === "Video Start Time" || item?.metricname === "Video Restart Time"
                              || item?.metricname === "EBVS" || item?.metricname === "ReBuff. Ratio" || item?.metricname === "Ended Plays" ||
                              item?.metricname === "Ended Plays/ Unique Devices" || item?.metricname === "CIRR" ?
                              <div className={item?.percentage > 0 ?
                                 'text-danger' : item?.percentage === 0 ? "text-grey" : "text-success"}>{round(item?.percentage, 1, item?.metricname) + '%'}

                                 {item?.percentage > 0 || item?.percentage === 0 ? item?.percentage === 0 ? '' : <div className='triangleDown' /> : <div className='triangle' />}</div> : */}
                               {/* <div className={item?.percentage > 0 || item?.percentage === 0 ? item?.percentage === 0 ? "text-grey" : "text-success" : 'text-danger'}>
                                  {round(item?.percentage, 1, item?.metricname) + '%'}  {item?.percentage > 0 || item?.percentage === 0 ? item?.percentage === 0 ? '' : <div className='triangle' /> :
                                     <div className='triangleDown' />}</div> */}
                                    
                                    <div className ={item?.color == true && item?.percentage > 0 ?"text-success":item?.percentage==0?"text-grey":"text-danger"}>
                                    {round(item?.percentage, 1, item?.metricname) + '%'}
                                    {item?.color == true && item?.percentage > 0 ? <div className='triangle' /> : item?.percentage==0?"":<div className='triangleDown' />}
                                  </div>
                                    
                           
                                

                           {item?.metric_key_name == "rebuffering_ratio" ? <p>Rebuffering Ratio</p> : item?.metric_key_name == "total_minutes_watched" ? <p>Total Mins Watched</p> :
                              item?.metric_key_name == "video_start_time" ? <p>Video Startup Time</p> : item?.metric_key_name == "rebuffering_percentage" ? <p>Rebuffering %</p> :
                                 item?.metric_key_name == "minutes_per_unique_devices" ? <p>Mins/Unique Devices</p> : item?.metric_key_name == "bandwidth" ? <p>Avg Bandwidth</p> :
                                    item?.metric_key_name == "average_percentage_completion" ? <p>Avg % Completion</p> : <p>{item?.metricname}</p>}

                        </div>
                     </Grid>
                  )}
               </Grid>
               <DashboardLocation />
               {/* <Location dashboardRow={true}/> */}
               <RealTimeSliderContainer partnerDetail={false} />
               <UserEngagementSliderContainer partnerDetail={false} />
               <QualityOfExperienceSliderContainer partnerDetail={false} />
               {/* <VideoQCSliderContainer /> */}
               <MitigationSliderContainer partnerDetail={false} />
               <AIPipelineSliderContainer />
               <DashboardAnalysis />
            </>
         }
      </div>

   )
}
