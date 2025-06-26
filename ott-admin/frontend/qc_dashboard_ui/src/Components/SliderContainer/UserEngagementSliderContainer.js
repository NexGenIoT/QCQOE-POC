/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useEffect } from 'react';
import Slider from "react-slick";
import { Box, Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SimpleBarChart from './SimpleBarChart'
import StackedAreaChart from './StackedAreaChart'
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAveragePercentCompletion, getConcurrentPlays, getMinutesPerUniqueDevices, getTotalMinutesWatched, getUniqueDevices, getUniqueViewers, getUserAttrition, getVideoFailures, setMetricType, setMetricTypeFullName } from 'Store/Actions';
import moment from 'moment';
import { adminMessage, isValidPermission } from 'Constants/constant';
import { NotificationManager } from 'react-notifications';

function UserEngagementSliderContainer(props) {
   const history = useHistory()
   const data = useSelector(state => state.qoeReducer);
   const conncurrentPlays = data?.concurrent_plays[0]?.all
   const conncurrentPlaysUnit = data?.concurrent_plays[0]?.all?.unit
   const totalMinutesWatched = data?.total_minutes_watched[0]?.all
   const totalMinutesWatchedUnit = data?.total_minutes_watched[0]?.all?.unit
   const averagePercentageCompletion = data?.average_percentage_completion[0]?.all
   const averagePercentageCompletionUnit = data?.average_percentage_completion[0]?.all?.unit
   const videoPlaybackFailures = data?.video_playback_failures[0]?.all
   const videoPlaybackFailuresUnit = data?.video_playback_failures[0]?.all?.unit
   const uniqueViews = data?.unique_viewers[0]?.all
   const uniqueViewsUnit = data?.unique_viewers[0]?.all?.unit
   const userAttrition = data?.user_attrition[0]?.all
   const userAttritionUnit = data?.user_attrition[0]?.all?.unit
   const uniqueDevices = data?.unique_devices[0]?.all
   const uniqueDevicesUnit = data?.unique_devices[0]?.all?.unit
   const minutesPerUniqueDevice = data?.minutes_per_unique_devices[0]?.all
   const minutesPerUniqueDeviceUnit = data?.minutes_per_unique_devices[0]?.all?.unit

   const averageBitrate = data?.average_bitrate[0]?.all
   const averageBitrateUnit = data?.average_bitrate[0]?.all?.unit
   const playAttempts = data?.play_attempts[0]?.all;
   const playAttemptsUnit = data?.play_attempts[0]?.all?.unit;
   const succesfulPlays = data?.succesful_plays[0]?.all;
   const succesfulPlaysUnit = data?.succesful_plays[0]?.all?.unit;

   const dispatch = useDispatch()
   const settings = {
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      centerMode: false,
      prevArrow: <img alt='left-arrow' src={`${process.env.PUBLIC_URL}/assets/left-arrow.svg`} width="15" height="27" />,
      nextArrow: <img alt='right-arrow' src={`${process.env.PUBLIC_URL}/assets/right-arrow.svg`} width="15" height="27" />
   };
   
   const formatDataAndTime = (timestamp) => {
      if(props.partnerDetail){
         if(props.agr === '1h'){
            return timestamp && timestamp.map(name => `${moment(name).format('hh:mm A')}`);
         }
         else if(props.agr === '1d'){
            return timestamp && timestamp.map(name => `${moment(name).format('DD-MM-YYYY')}`);
         }
         else if(props.agr === '2d'){
            return timestamp && timestamp.map(name => `${moment(name).format('DD-MM-YYYY')}`);
         }
         else if(props.agr === '6d'){
            return timestamp && timestamp.map(name => `${moment(name).format('DD-MM-YYYY')}`);
         }
      }
      else{
         return timestamp && timestamp.map(name => `${moment(name).format('hh:mm A')}`);
      }
   }

   const conncurrentPlaysData = {
      labels: formatDataAndTime(conncurrentPlays?.time_stamp),
      datasets: [
         {
            label: 'Max Concurrent Plays',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: conncurrentPlays?.concurrent_plays
         },
      ]
   };

   const totalMinutesWatchedData = {
      labels: formatDataAndTime(totalMinutesWatched?.time_stamp),
      datasets: [
         {
            label: 'Total Minutes Watched',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#66F5AE',
            pointRadius: 3,
            pointHitRadius: 0,
            data: totalMinutesWatched?.total_minutes_watched
         },
      ]
   };

   const videoPlaybackFailuresData = {
      labels: formatDataAndTime(videoPlaybackFailures?.time_stamp),
      datasets: [
         {
            label: 'Video Playback Failures',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: videoPlaybackFailures?.video_playback_failures
         },
      ]
   };

   const averagePercentageCompletionData = {
      labels: formatDataAndTime(averagePercentageCompletion?.time_stamp),
      datasets: [
         {
            label: 'Average Percentage Completion',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#0092ED',
            pointRadius: 3,
            pointHitRadius: 0,
            data: averagePercentageCompletion?.average_percentage_completion
         },
      ]
   };

   const uniqueViewsData = {
      labels: formatDataAndTime(uniqueViews?.time_stamp),
      datasets: [
         {
            label: 'Unique Views',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: uniqueViews?.unique_viewers
         },
      ]
   };

   const userAttritionData = {
      labels: formatDataAndTime(userAttrition?.time_stamp),
      datasets: [
         {
            label: 'User Attrition',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#66F5AE',
            pointRadius: 3,
            pointHitRadius: 0,
            data: userAttrition?.user_attrition
         },
      ]
   };

   const uniqueDeviceData = {
      labels: formatDataAndTime(uniqueDevices?.time_stamp),
      datasets: [
         {
            label: 'Unique Devices',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: uniqueDevices?.unique_devices
         },
      ]
   };

   const minutesPerUniqueDeviceData = {
      labels: formatDataAndTime(minutesPerUniqueDevice?.time_stamp),
      datasets: [
         {
            label: 'Minutes Per Unique Device',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#0092ED',
            pointRadius: 3,
            pointHitRadius: 0,
            data: minutesPerUniqueDevice?.minutes_per_unique_devices
         },
      ]
   };
   const succesfulPlaysData = {
      labels: formatDataAndTime(succesfulPlays?.time_stamp),
      datasets: [
         {
            label: 'Sucessful Plays',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: succesfulPlays?.succesful_plays
         },
      ]
   };

   const averageBitrateData = {
      labels: formatDataAndTime(averageBitrate?.time_stamp),
      datasets: [
         {
            label: 'Average Bitrate',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#0092ED',
            pointRadius: 3,
            pointHitRadius: 0,
            data: averageBitrate?.average_bitrate
         },
      ]
   };

   const playAttemptsData = {
      labels: formatDataAndTime(playAttempts?.time_stamp),
      datasets: [
         {
            label: 'Play Attempts',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#66F5AE',
            pointRadius: 3,
            pointHitRadius: 0,
            data: playAttempts?.play_attempts
         },
      ]
   };

   useEffect(() => {
      if (props.partnerDetail) {
         dispatch(getConcurrentPlays(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getAveragePercentCompletion(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getTotalMinutesWatched(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getVideoFailures(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getUserAttrition(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getUniqueViewers(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getUniqueDevices(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getMinutesPerUniqueDevices(dispatch, props.toDate, props.fromDate, props.agr,props.location))
      }
   }, [props.agr,props.location])


   useEffect(() => {
      if (data?.video_start_failures.length > 0 && data?.succesful_plays.length > 0 && data?.rebuffering_percentage.length > 0 && data?.play_attempts.length > 0 && data?.average_bitrate.length > 0 && data?.unique_devices?.length > 0 && data?.minutes_per_unique_devices?.length > 0) {
      }
      else {
         if (!props.partnerDetail) {
            let toDate = Math.floor((new Date()).getTime() / 1000.0);
            let fromDate = Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600);
            let aggregation = '1h'
            dispatch(getConcurrentPlays(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getAveragePercentCompletion(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getTotalMinutesWatched(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getVideoFailures(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getUserAttrition(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getUniqueViewers(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getUniqueDevices(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getMinutesPerUniqueDevices(dispatch, toDate, fromDate, aggregation,"all"))
         }
      }
   }, []);

   const clickOnMetric = (type,fulname) => {
      if(isValidPermission("READ_USER_ENGAGEMENT_METRICS")){
         history.push('/dashboard/crm/user-engagement-metrics')
         dispatch(setMetricType(type))
         dispatch(setMetricTypeFullName(fulname));
      }else{
         NotificationManager.error(adminMessage.message)
      }

   }

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
      var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
      });
      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }
   return (
      <div className='slideContainer'>
         <div className='col-md-12'>
            <div className='col-md-12'>
               <h5 className="component_heading mb-20">User Engagement Metrics <br/> <span>Charts are showing  {props.agr === '1h'?"24hrs":props.agr === '1d'?"Weekly":props.agr === '2d'?"Monthly":props.agr === '6d'?"3 Month":"24hrs"}  data</span>
                  <Link  to={isValidPermission("READ_USER_ENGAGEMENT_METRICS")?'/dashboard/crm/user-engagement-metrics':null}>View All
                     <i className="zmdi zmdi-chevron-right"></i>
                  </Link>
               </h5>
            </div>
         </div>
         <Slider {...settings}>
            <div onClick={() => clickOnMetric('concurrent_plays','Max Concurrent Plays')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Max Concurrent Plays <Tooltip title="Max Concurrent Plays is the maximum number of simultaneously active sessions during a given interval. " arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(conncurrentPlays?.total_sum,2)} {conncurrentPlaysUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={conncurrentPlaysData.labels} datasets={conncurrentPlaysData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('average_percentage_completion','Average Percent Completion')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Percent Completion <Tooltip title="Average percent completion shows the duration viewed compared with the total length the content. " arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averagePercentageCompletion?.total_sum,1)} {averagePercentageCompletionUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={averagePercentageCompletionData.labels} datasets={averagePercentageCompletionData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('total_minutes_watched','Total Minutes Watched')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Total Minutes Watched <Tooltip title="Total minutes watched of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(totalMinutesWatched?.total_sum,2)} {totalMinutesWatchedUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={totalMinutesWatchedData.labels} datasets={totalMinutesWatchedData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('video_playback_failures','Video Playback Failures ')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Video Playback Failures <Tooltip title="Video playback failure occurs when video play terminates due to a playback error, such as video file corruption, insufficient streaming resources, or a sudden interruption in the video stream." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(videoPlaybackFailures?.total_sum,2)} {videoPlaybackFailuresUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={videoPlaybackFailuresData.labels} datasets={videoPlaybackFailuresData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('user_attrition','User Attrition ')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>User Attrition <Tooltip title="User Attrition of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(userAttrition?.total_sum,2)} {userAttritionUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={userAttritionData.labels} datasets={userAttritionData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('unique_viewers','Unique Viewers')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Unique Viewers <Tooltip title="Unique Viewers of last 24 hr " arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(uniqueViews?.total_sum,2)} {uniqueViewsUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={uniqueViewsData.labels} datasets={uniqueViewsData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('unique_devices','Unique Devices')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Unique Devices <Tooltip title="Unique Devices of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(uniqueDevices?.total_sum)} {uniqueDevicesUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={uniqueDeviceData.labels} datasets={uniqueDeviceData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('minutes_per_unique_devices','Minutes / Unique Device')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Minutes / Unique Device <Tooltip title="Minutes / Unique Device of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(minutesPerUniqueDevice?.total_sum,2)} {minutesPerUniqueDeviceUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={minutesPerUniqueDeviceData.labels} datasets={minutesPerUniqueDeviceData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('play_attempts','Play Attempts')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Play Attempts <Tooltip title="Play Attempts of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(playAttempts?.total_sum,2)} {playAttemptsUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={playAttemptsData.labels} datasets={playAttemptsData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('succesful_plays','Successful Plays')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Successful Plays <Tooltip title="Successful Plays counts all Successful Plays to play a video which are initiated when a viewer clicks play or a video auto-plays. " arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(succesfulPlays?.total_sum,2)} {succesfulPlaysUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={succesfulPlaysData.labels} datasets={succesfulPlaysData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('average_bitrate','Average Bitrate ')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Bitrate <Tooltip title="Average Bitrate of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageBitrate?.total_sum,2)} {averageBitrateUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={averageBitrateData.labels} datasets={averageBitrateData.datasets} />
               </div>
            </div>
         </Slider>
      </div>
   );
}

export default UserEngagementSliderContainer