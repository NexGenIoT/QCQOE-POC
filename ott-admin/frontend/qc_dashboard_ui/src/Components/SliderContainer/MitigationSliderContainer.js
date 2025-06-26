/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useEffect } from 'react';
import Slider from "react-slick";
import { Box, Tooltip } from "@material-ui/core";
import SimpleBarChart from './SimpleBarChart'
import StackedAreaChart from './StackedAreaChart'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getAverageRebufferingBufferLength, getAverageStartupBufferLength, getDegradationInUEI, getImprovementInUEI, getNumberOfMitigationApplied, setMetricType, setMetricTypeFullName, setTabValueMitigation } from 'Store/Actions';
import moment from 'moment';
import { adminMessage, isValidPermission } from 'Constants/constant';
import { NotificationManager } from 'react-notifications';

function MitigationSliderContainer(props) {
   const dispatch = useDispatch()
   const dataGraph = useSelector(state => state.qoeReducer);
   const numberOfMitigationApplied = dataGraph?.number_of_mitigations_applied[0]?.all;
   const numberOfMitigationAppliedUnit = dataGraph?.number_of_mitigations_applied[0]?.all?.unit;
   const improvementInUEIGraph = dataGraph?.improvement_in_uei[0]?.all;
   const improvementInUEIUnit = dataGraph?.improvement_in_uei[0]?.all?.unit;
   const degradationInUEI = dataGraph?.degradation_in_uei[0]?.all;
   const degradationInUEIUnit = dataGraph?.degradation_in_uei[0]?.all?.unit;
   const averageStartupBufferLength = dataGraph?.average_startup_buffer_length[0]?.all
   const averageStartupBufferLengthUnit = dataGraph?.average_startup_buffer_length[0]?.all?.unit
   const averageRebufferingBufferLength = dataGraph?.average_rebuffering_buffer_length[0]?.all
   const averageRebufferingBufferLengthUnit = dataGraph?.average_rebuffering_buffer_length[0]?.all?.unit
   
   const history = useHistory()
   
   const settings = {
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      autoplay: false,
      //arrows: true,
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

   const noOfMitigation = {
      labels: formatDataAndTime(numberOfMitigationApplied?.TimeStamp),
      datasets: [
         {
            label: 'Number Of Mitigation Applied',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: numberOfMitigationApplied?.number_of_mitigations_applied
         },
      ]
   };

   const dataOne = {
      labels: formatDataAndTime(degradationInUEI?.TimeStamp),
      datasets: [
         {
            label: 'Degradation in UEI',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: degradationInUEI?.degradation_in_uei
         },
      ]
   };

   const improvementInUEI = {
      labels: formatDataAndTime(improvementInUEIGraph?.TimeStamp),
      datasets: [
         {
            label: 'Improvement In UEI',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: improvementInUEIGraph?.improvement_in_uei
         },
      ]
   };

   const average_data = {
      labels: formatDataAndTime(averageStartupBufferLength?.TimeStamp),
      datasets: [
         {
            label: 'Average Startup Buffer Length',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: averageStartupBufferLength?.average_startup_buffer_length
         },
      ]
   };

   const meanStartupBitrate = {
      labels: formatDataAndTime(averageRebufferingBufferLength?.TimeStamp),
      datasets: [
         {
            label: 'Average Rebuffering Buffer Length',
            fill: false,
            lineTension: 0.1,
            borderColor: '#0292ED',
            backgroundColor: '#FF4D7D',
            pointRadius: 3,
            pointHitRadius: 0,
            data: averageRebufferingBufferLength?.average_rebuffering_buffer_length
         },
      ]
   };

   useEffect(() => {
      if (props.partnerDetail) {
            dispatch(getNumberOfMitigationApplied(dispatch, props.toDate, props.fromDate, props.agr))
            dispatch(getImprovementInUEI(dispatch, props.toDate, props.fromDate, props.agr))
            dispatch(getDegradationInUEI(dispatch, props.toDate, props.fromDate, props.agr))
            dispatch(getAverageStartupBufferLength(dispatch, props.toDate, props.fromDate, props.agr))
            dispatch(getAverageRebufferingBufferLength(dispatch, props.toDate, props.fromDate, props.agr))
      }
   }, [props.agr])


   useEffect(() => {
      if (dataGraph?.number_of_mitigations_applied.length > 0 && (Array.isArray(dataGraph?.improvement_in_uei) || dataGraph?.improvement_in_uei.length > 0) && (Array.isArray(dataGraph?.degradation_in_uei) || dataGraph?.degradation_in_uei.length > 0) && dataGraph?.average_startup_buffer_length.length > 0 && dataGraph?.average_rebuffering_buffer_length.length > 0) {
      }
      else {
         if (!props.partnerDetail) {
            let toDate = Math.floor((new Date()).getTime() / 1000.0);
            let fromDate = Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600);
            let aggregation = '1h'
            dispatch(getNumberOfMitigationApplied(dispatch, toDate, fromDate, aggregation))
            dispatch(getImprovementInUEI(dispatch, toDate, fromDate, aggregation))
            dispatch(getDegradationInUEI(dispatch, toDate, fromDate, aggregation))
            dispatch(getAverageStartupBufferLength(dispatch, toDate, fromDate, aggregation))
            dispatch(getAverageRebufferingBufferLength(dispatch, toDate, fromDate, aggregation))
         }
      }
   }, []);

   const clickOnMetric = (type,fulname) => {
   if(isValidPermission("READ_MITIGATION")){
      dispatch(setTabValueMitigation(1))
      history.push('/dashboard/crm/mitigation')
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
               <h5 className="component_heading mb-20">Mitigation <br/><span>Charts are showing 24hrs data</span>
                  <Link onClick={()=> dispatch(setTabValueMitigation(1))} to={isValidPermission("READ_MITIGATION")?'/dashboard/crm/mitigation':null}>View All
                     <i className="zmdi zmdi-chevron-right"></i>
                  </Link>
               </h5>
            </div>
         </div>

         <Slider {...settings}>
            <div onClick={() => clickOnMetric('number_of_mitigations_applied',"Number Of Mitigations Applied")} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Number Of Mitigation Applied <Tooltip title="Number Of Mitigation Applied of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                 
                  <h2>{round(numberOfMitigationApplied?.total_sum,2)} {numberOfMitigationAppliedUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={noOfMitigation.labels} datasets={noOfMitigation.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('degradation_in_uei','Degradation In UEI')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Degradation in UEI <Tooltip title="Degradation in UEI of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(degradationInUEI?.total_sum,2)} {degradationInUEIUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={dataOne.labels} datasets={dataOne.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('improvement_in_uei','Improvement In UEI')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Improvement in UEI <Tooltip title="Improvement in UEI of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(improvementInUEIGraph?.total_sum,2)} {improvementInUEIUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={improvementInUEI.labels} datasets={improvementInUEI.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('average_startup_buffer_length','Average Startup Buffer Length')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Startup Buffer Length <Tooltip title="Average Startup Buffer Length of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageStartupBufferLength?.total_sum,2)} {averageStartupBufferLengthUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={average_data.labels} datasets={average_data.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric('average_rebuffering_buffer_length','Average Rebuffering Buffer Length')} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Average Rebuffering Buffer Length <Tooltip title="Average Rebuffering Buffer Length of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{round(averageRebufferingBufferLength?.total_sum,2)} {averageRebufferingBufferLengthUnit}</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={meanStartupBitrate.labels} datasets={meanStartupBitrate.datasets} />
               </div>
            </div>
         </Slider>
      </div>
   );
}

export default MitigationSliderContainer