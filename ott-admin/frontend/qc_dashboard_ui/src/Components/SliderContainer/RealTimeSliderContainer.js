/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useEffect } from 'react';
import Slider from "react-slick";
import { Box, Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SimpleBarChart from './SimpleBarChart'
import StackedAreaChart from './StackedAreaChart'
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { checkVideoFailure, successfullPlays, getRebufferingPercentage, getVideoPlaysAndFailure, getAverageBitRate, setMetricType, getExitBeforeVideoStart, getConnectionInducedRebufferingRatio, getVideoStartTime, getVideoRestartTime, getRenderingQuality, getVideoFailures, setMetricTypeFullName } from 'Store/Actions';
import moment from 'moment';
import { adminMessage, isValidPermission } from 'Constants/constant';
import { NotificationManager } from 'react-notifications';
import LoadingSkeleton from 'Components/LoadingSkeleton/LoadingSkeleton';

function RealTimeSliderContainer(props) {
   const dispatch = useDispatch()
   const data = useSelector(state => state.qoeReducer);
   const videoFailure = data?.video_start_failures[0]?.all;
   const videoFailureUnit = data?.video_start_failures[0]?.all?.unit;
   const succesfulPlays = data?.succesful_plays[0]?.all;
   const succesfulPlaysUnit = data?.succesful_plays[0]?.all?.unit;
   const rebufferingPercentage = data?.rebuffering_percentage[0]?.all;
   const rebufferingPercentageUnit = data?.rebuffering_percentage[0]?.all?.unit;
   const videoPlaybackFailures = data?.video_playback_failures[0]?.all
   const videoPlaybackFailuresUnit = data?.video_playback_failures[0]?.all?.unit
   const averageBitrate = data?.average_bitrate[0]?.all
   const averageBitrateUnit = data?.average_bitrate[0]?.all?.unit
   const exitBeforeVideoStart = data?.exit_before_video_starts[0]?.all
   const exitBeforeVideoStartUnit = data?.exit_before_video_starts[0]?.all?.unit
   const connectionInducedRebufferingDuration = data?.connection_induced_rebuffering_ratio[0]?.all
   const connectionInducedRebufferingDurationUnit = data?.connection_induced_rebuffering_ratio[0]?.all?.unit
  
   const playAttempts = data?.play_attempts[0]?.all;
   const playAttemptsUnit = data?.play_attempts[0]?.all?.unit;
   const concurrentPlay = data?.concurrent_plays[0]?.all;
  // const concurrentPlayUnit = data?.video_start_failures[0]?.all?.unit;
   const history = useHistory()
   const settings = {
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      centerMode: false,
      prevArrow: <img alt='left-arrow' src={`${process.env.PUBLIC_URL}/assets/left-arrow.svg`} width="15" height="27" />,
      nextArrow: <img alt='left-arrow' src={`${process.env.PUBLIC_URL}/assets/right-arrow.svg`} width="15" height="27" />
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
            data: videoPlaybackFailures?.video_playback_failures,
         },
      ],
   };

   const videoFailureData = {
      labels: formatDataAndTime(videoFailure?.time_stamp),
      datasets: [
         {
            label: 'Video Failure',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            pointBorderWidth: 0,
            borderWidth: 2,
            data: videoFailure?.video_start_failures
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

   const connectionInducedRebufferingDurationData = {
      labels: formatDataAndTime(connectionInducedRebufferingDuration?.time_stamp),
      datasets: [
         {
            label: 'Connection Induced Rebuffer Duration',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: connectionInducedRebufferingDuration?.connection_induced_rebuffering_ratio
         },
      ]
   };

   const rebufferingPercentageData = {
      labels: formatDataAndTime(rebufferingPercentage?.time_stamp),
      datasets: [
         {
            label: 'Rebuffering Percentage',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#66F5AE',
            pointRadius: 3,
            pointHitRadius: 0,
            data: rebufferingPercentage?.rebuffering_percentage
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
   const concurrentPlayData = {
      labels: formatDataAndTime(concurrentPlay?.time_stamp),
      datasets: [
         {
            label: 'Max Concurrent Plays',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#0092ED',
            pointRadius: 3,
            pointHitRadius: 0,
            data: concurrentPlay?.concurrent_plays
         },
      ]
   };
   // const videosPlaysandFailuresData = {
   //    labels: formatDataAndTime(videosPlaysandFailures?.time_stamp),
   //    datasets: [
   //       {
   //          label: 'Videos plays and Failures',
   //          fill: false,
   //          lineTension: 0.1,
   //          backgroundColor: '#66F5AE',
   //          pointRadius: 3,
   //          pointHitRadius: 0,
   //          data: videosPlaysandFailures?.video_playback_failures
   //       },
   //    ]
   // };
   const exitBeforeVideoStartData = {
      labels: formatDataAndTime(exitBeforeVideoStart?.time_stamp),
      datasets: [
         {
            label: 'Exit Before Video Start',
            fill: false,
            lineTension: 0.1,
            backgroundColor: '#66F5AE',
            pointRadius: 3,
            pointHitRadius: 0,
            data: exitBeforeVideoStart?.exit_before_video_starts
         },
      ]
   };

   useEffect(() => {
      if (props.partnerDetail) {
         dispatch(getVideoPlaysAndFailure(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(successfullPlays(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(checkVideoFailure(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getRebufferingPercentage(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getAverageBitRate(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getExitBeforeVideoStart(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getConnectionInducedRebufferingRatio(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getVideoPlaysAndFailure(dispatch, props.toDate, props.fromDate, props.agr,props.location))
        // dispatch(getVideoFailures(dispatch, props.toDate, props.fromDate, props.agr,props.location))
         dispatch(getRenderingQuality(dispatch, props.toDate, props.fromDate, props.agr,props.location))

         
      }
   }, [props.agr,props.location])


   useEffect(() => {
      if (data?.video_start_failures.length > 0 && data?.succesful_plays.length > 0 && data?.rebuffering_percentage.length > 0 && data?.video_playback_failures.length > 0 && data?.average_bitrate.length > 0 && data?.exit_before_video_starts?.length > 0 && data?.connection_induced_rebuffering_ratio?.length > 0) {
      }
      else {
         if (!props.partnerDetail) {
            let toDate = Math.floor((new Date()).getTime() / 1000.0);
            let fromDate = Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600);
            let aggregation = '1h'
            dispatch(getVideoPlaysAndFailure(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(successfullPlays(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(checkVideoFailure(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getRebufferingPercentage(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getAverageBitRate(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getExitBeforeVideoStart(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getConnectionInducedRebufferingRatio(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getVideoStartTime(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getVideoRestartTime(dispatch, toDate, fromDate, aggregation,"all"))
            dispatch(getRenderingQuality(dispatch, toDate, fromDate, aggregation,"all"))
         }
      }
   }, []);

   const clickOnMetric = (type,fulname) => {
      // if(isValidPermission("READ_REAL_TIME_KEY_INSIGHTS")){
         history.push('/dashboard/crm/realtime-key-insights')
         dispatch(setMetricType(type))
         dispatch(setMetricTypeFullName(fulname));
      // }else{
         // NotificationManager.error(adminMessage.message)
      // }

   }

   return (
      <div className='slideContainer'>
         <div className='col-md-12'>
            <div className='col-md-12'>
               <h5 className="component_heading mb-20 ">Real-Time Key Insights <br/><span>Charts are showing {props.agr === '1h'?"24hrs":props.agr === '1d'?"Weekly":props.agr === '2d'?"Monthly":props.agr === '6d'?"3 Month":"24hrs"} data</span>
                  <Link to={isValidPermission("READ_REAL_TIME_KEY_INSIGHTS")?'/dashboard/crm/realtime-key-insights':null}>View All
                     <i className="zmdi zmdi-chevron-right"></i>
                  </Link>
               </h5>
            </div>
         </div>
         <Slider {...settings}>
            <div onClick={() => clickOnMetric('rebuffering_percentage','Average Re-buffering ')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Re-buffering <Tooltip title="Average re-buffering of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(rebufferingPercentage?.total_sum,2)} {rebufferingPercentageUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={rebufferingPercentageData.labels} datasets={rebufferingPercentageData.datasets} />
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
            <div onClick={() => clickOnMetric('video_playback_failures','Average Video Playback Failure')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Video Playback Failure <Tooltip title="Video Playback Failure of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(videoPlaybackFailures?.total_sum,2)} {videoPlaybackFailuresUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={videoPlaybackFailuresData.labels} datasets={videoPlaybackFailuresData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('succesful_plays','Successful Plays')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Successful Plays <Tooltip title="Attempts counts all attempts to play a video which are initiated when a viewer clicks play or a video auto-plays. " arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(succesfulPlays?.total_sum,2)} {succesfulPlaysUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={succesfulPlaysData.labels} datasets={succesfulPlaysData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('connection_induced_rebuffering_ratio','Connection Induced Rebuffering Ratio')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Connection Induced Rebuffering Ratio <Tooltip title="Connection Induced Rebuffering Ratio of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(connectionInducedRebufferingDuration?.total_sum,2)} {connectionInducedRebufferingDurationUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={connectionInducedRebufferingDurationData.labels} datasets={connectionInducedRebufferingDurationData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('video_start_failures','Average Video Start Failures')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Video Start Failures <Tooltip title="VSF measures how often attempts terminated during video startup before the first video frame was played and a fatal error was reported. " arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(videoFailure?.total_sum,2)} {videoFailureUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={videoFailureData.labels} datasets={videoFailureData.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('exit_before_video_starts','Exit Before Video Start')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Exit Before Video Start <Tooltip title="Exit Before Video Start of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(exitBeforeVideoStart?.total_sum,2)} {exitBeforeVideoStartUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={exitBeforeVideoStartData.labels} datasets={exitBeforeVideoStartData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('play_attempts','Play Attempts ')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Play Attempts <Tooltip title="Play Attempts of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(playAttempts?.total_sum,2)} {playAttemptsUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={playAttemptsData.labels} datasets={playAttemptsData.datasets} />
               </div>
            </div>

            <div onClick={() => clickOnMetric('concurrent_plays','Max Concurrent Plays')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Max Concurrent Plays <Tooltip title="Max Concurrent Plays of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(concurrentPlay?.total_sum,2)} </h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={concurrentPlayData.labels} datasets={concurrentPlayData.datasets} />
               </div>
            </div>

            {/* <div onClick={() => clickOnMetric('video_playback_failures')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Videos plays and Failures<Tooltip title="Videos plays and Failures of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{videosPlaysandFailures?.total_sum} {vvideosPlaysandFailuresUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={videosPlaysandFailuresData.labels} datasets={videosPlaysandFailuresData.datasets} />
               </div>
            </div> */}
         </Slider>
      </div>
   );
}

export default RealTimeSliderContainer