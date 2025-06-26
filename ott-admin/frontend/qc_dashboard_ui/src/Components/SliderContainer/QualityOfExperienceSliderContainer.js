/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useEffect } from 'react';
import Slider from "react-slick";
import { Box, Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SimpleBarChart from './SimpleBarChart'
import StackedAreaChart from './StackedAreaChart'
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAttempts, getAverageFramrate, getBandwith, getEndedPlay, getEndedPlaysPerUniqueDevice, getRebufferingRatio, setMetricType, setMetricTypeFullName } from 'Store/Actions';
import moment from 'moment';
import { adminMessage, isValidPermission } from 'Constants/constant';
import { NotificationManager } from 'react-notifications';

function QualityOfExperienceSliderContainer(props) {
   const history = useHistory()
   const dispatch = useDispatch()
   const dataQOE = useSelector(state => state.qoeReducer);
   const endedPlays = dataQOE?.ended_plays[0]?.all
   const endedPlaysUnit = dataQOE?.ended_plays[0]?.all?.unit
   const averageBitrate = dataQOE?.average_bitrate[0]?.all
   const averageBitrateUnit = dataQOE?.average_bitrate[0]?.all?.unit
   const rebufferingRatio = dataQOE?.rebuffering_ratio[0]?.all
   const rebufferingRatioUnit = dataQOE?.rebuffering_ratio[0]?.all?.unit
   const bandwidthNew = dataQOE?.bandwidth[0]?.all
   const bandwidthUnit = dataQOE?.bandwidth[0]?.all?.unit
   const averageFramrate = dataQOE?.average_framerate[0]?.all
   const averageFramrateUnit = dataQOE?.average_framerate[0]?.all?.unit
   const endedPlaysPerUniqueDevices = dataQOE?.ended_plays_per_unique_devices[0]?.all
   const endedPlaysPerUniqueDevicesUnit = dataQOE?.ended_plays_per_unique_devices[0]?.all?.unit
   const attemptsNew = dataQOE?.attempts[0]?.all
   const attemptsUnit = dataQOE?.attempts[0]?.all?.unit

   const videoPlaybackFailures = dataQOE?.video_playback_failures[0]?.all
   const videoPlaybackFailuresUnit = dataQOE?.video_playback_failures[0]?.all?.unit
   const averageVideoStartTime = dataQOE?.video_start_time[0]?.all
   const averageVideoStartTimeUnit = dataQOE?.video_start_time[0]?.all?.unit
   const averageVideoReStartTime = dataQOE?.video_restart_time[0]?.all
   const averageVideoReStartTimeUnit = dataQOE?.video_restart_time[0]?.all?.unit
   const averageRenderingQuality = dataQOE?.rendering_quality[0]?.all
   const averageRenderingQualityUnit = dataQOE?.rendering_quality[0]?.all?.unit
   const userAttrition = dataQOE?.user_attrition[0]?.all
   const userAttritionUnit = dataQOE?.user_attrition[0]?.all?.unit


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

   const bandwidthData = {
      labels: formatDataAndTime(bandwidthNew?.time_stamp),
      datasets: [
         {
            label: 'Bandwidth',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: bandwidthNew?.bandwidth
         },
      ]
   };

   const averageFramerateData = {
      labels: formatDataAndTime(averageFramrate?.time_stamp),
      datasets: [
         {
            label: 'AVerage Framerate',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#66F5AE',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            data: averageFramrate?.average_framerate
         },
      ]
   };

   const endedPlaysPerUniqueDevicesData = {
      labels: formatDataAndTime(endedPlaysPerUniqueDevices?.time_stamp),
      datasets: [
         {
            label: 'Ended Plays Per Unique Device',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: endedPlaysPerUniqueDevices?.ended_plays_per_unique_devices
         },
      ]
   };

   const attemptsData = {
      labels: formatDataAndTime(attemptsNew?.time_stamp),
      datasets: [
         {
            label: 'Play Attempts',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            data: attemptsNew?.attempts
         },
      ]
   };

   const endedPlaysData = {
      labels: formatDataAndTime(endedPlays?.time_stamp),
      datasets: [
         {
            label: 'Ended Plays',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: endedPlays?.ended_plays
         },
      ]
   };

   const rebufferingRatioData = {
      labels: formatDataAndTime(rebufferingRatio?.time_stamp),
      datasets: [
         {
            label: 'Rebuffering Ratio',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#0092ED',
            pointRadius: 3,
            pointHitRadius: 0,
            data: rebufferingRatio?.rebuffering_ratio
         },
      ]
   };

   const averageBitrateData = {
      labels: formatDataAndTime(averageBitrate?.time_stamp),
      datasets: [
         {
            label: 'Avergae Bitrate',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: averageBitrate?.average_bitrate
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
   const averageVideoStartTimeData = {
      labels: formatDataAndTime(averageVideoStartTime?.time_stamp),
      datasets: [
         {
            label: 'Video Start Time',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: averageVideoStartTime?.video_start_time
         },
      ]
   };

   const averageVideoReStartTimeData = {
      labels: formatDataAndTime(averageVideoReStartTime?.time_stamp),
      datasets: [
         {
            label: 'Video Restart Time',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#0092ED',
            pointRadius: 3,
            pointHitRadius: 0,
            data: averageVideoReStartTime?.video_restart_time
         },
      ]
   };

   const averageRenderingQualityData = {
      labels: formatDataAndTime(averageRenderingQuality?.time_stamp),
      datasets: [
         {
            label: 'Rendering Quality',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: averageRenderingQuality?.rendering_quality
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
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: userAttrition?.user_attrition
         },
      ]
   };


   useEffect(() => {
      if (props.partnerDetail) {
         dispatch(getEndedPlay(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getRebufferingRatio(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getBandwith(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getAverageFramrate(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getEndedPlaysPerUniqueDevice(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getAttempts(dispatch, props.toDate, props.fromDate, props.agr,props.location))
      }
   }, [props.agr,props.location])

   useEffect(() => {
      if (dataQOE?.ended_plays.length > 0 && dataQOE?.average_bitrate.length > 0 && dataQOE?.rebuffering_ratio.length > 0 && dataQOE?.bandwidth.length > 0 && dataQOE?.average_framerate.length > 0 && dataQOE?.ended_plays_per_unique_devices?.length > 0 && dataQOE?.attempts?.length > 0) {
      }
      else {
         if (!props.partnerDetail) {
            let toDate = Math.floor((new Date()).getTime() / 1000.0);
            let fromDate = Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600);
            let aggregation = '1h'
            dispatch(getEndedPlay(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getRebufferingRatio(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getBandwith(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getAverageFramrate(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getEndedPlaysPerUniqueDevice(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getAttempts(dispatch, toDate, fromDate, aggregation,"all"))
         }
      }
   }, [])

   const clickOnMetric = (type,fulname) => {
   //   if(isValidPermission("READ_QUALITY_OF_EXPERIENCE")){
      history.push('/dashboard/crm/quality-of-experience')
      dispatch(setMetricType(type))
      dispatch(setMetricTypeFullName(fulname));
   //   }else{
   //     NotificationManager.error(adminMessage.message)
   //   }
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
               <h5 className="component_heading mb-20">Quality of Experience (QoE) <br/> <span>Charts are showing  {props.agr === '1h'?"24hrs":props.agr === '1d'?"Weekly":props.agr === '2d'?"Monthly":props.agr === '6d'?"3 Month":"24hrs"}  data</span>
                  <Link to={isValidPermission("READ_QUALITY_OF_EXPERIENCE")?'/dashboard/crm/quality-of-experience':null}>View All
                     <i className="zmdi zmdi-chevron-right"></i>
                  </Link>
               </h5>
            </div>
         </div>

         <Slider {...settings}>
            <div onClick={() => clickOnMetric('ended_plays','Ended Plays')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Ended Plays <Tooltip title="An ended play is a play that ended during a specific period." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(endedPlays?.total_sum,2)} {endedPlaysUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={endedPlaysData.labels} datasets={endedPlaysData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('rebuffering_ratio','Rebuffering Ratio')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Rebuffering Ratio <Tooltip title="Rebuffering occurs when the video stalls during playback and the viewer must wait for the video to resume playing" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(rebufferingRatio?.total_sum,2)} {rebufferingRatioUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={rebufferingRatioData.labels} datasets={rebufferingRatioData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('average_bitrate','Average Bitrate')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Bitrate <Tooltip title="Average Bitrate of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageBitrate?.total_sum,2)} {averageBitrateUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={averageBitrateData.labels} datasets={averageBitrateData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('bandwidth','Bandwidth')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Bandwidth <Tooltip title="Bandwidth of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(bandwidthNew?.total_sum,2)} {bandwidthUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={bandwidthData.labels} datasets={bandwidthData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('average_framerate','Average Framerate')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Framerate <Tooltip title="Average Framerate of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageFramrate?.total_sum,2)} {averageFramrateUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={averageFramerateData.labels} datasets={averageFramerateData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('ended_plays_per_unique_devices','Ended Plays Per Unique Devices')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Ended Plays / Device <Tooltip title="Ended Plays Per Unique Devices of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(endedPlaysPerUniqueDevices?.total_sum,2)} {endedPlaysPerUniqueDevicesUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={endedPlaysPerUniqueDevicesData.labels} datasets={endedPlaysPerUniqueDevicesData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('attempts','Play Attempts')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Play Attempts <Tooltip title="Play Attempts of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(attemptsNew?.total_sum,2)} {attemptsUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={attemptsData.labels} datasets={attemptsData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('user_attrition','User Attrition')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>User Attrition <Tooltip title="User Attrition of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(userAttrition?.total_sum,2)} {userAttritionUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={userAttritionData.labels} datasets={userAttritionData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('video_playback_failures','Video Playback Failures')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Video Playback Failures <Tooltip title="Video playback failure occurs when video play terminates due to a playback error, such as video file corruption, insufficient streaming resources, or a sudden interruption in the video stream." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(videoPlaybackFailures?.total_sum,2)} {videoPlaybackFailuresUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={videoPlaybackFailuresData.labels} datasets={videoPlaybackFailuresData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('video_start_time','Average Video Start Time')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Video Start Time <Tooltip title="Average Video Start Time of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageVideoStartTime?.total_sum,2)} {averageVideoStartTimeUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={averageVideoStartTimeData.labels} datasets={averageVideoStartTimeData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('video_restart_time','Average Video Restart Time')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Video Restart Time <Tooltip title="Average Video Restart Time of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageVideoReStartTime?.total_sum,2)} {averageVideoReStartTimeUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={averageVideoReStartTimeData.labels} datasets={averageVideoReStartTimeData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('rendering_quality','Average Rendering Quality')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Rendering Quality <Tooltip title="Average Rendering Quality of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageRenderingQuality?.total_sum,2)} {averageRenderingQualityUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={averageRenderingQualityData.labels} datasets={averageRenderingQualityData.datasets} />
               </div>
            </div>
         </Slider>
      </div>
   );
}

export default QualityOfExperienceSliderContainer