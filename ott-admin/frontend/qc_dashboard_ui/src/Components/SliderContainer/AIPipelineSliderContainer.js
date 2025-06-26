import React from 'react';
import Slider from "react-slick";
import { Box, Tooltip } from "@material-ui/core";
import SimpleBarChart from './SimpleBarChart'
import StackedAreaChart from './StackedAreaChart'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Link } from 'react-router-dom';
import { isValidPermission } from 'Constants/constant';

function AIPipelineSliderContainer(props) {
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

   const getData = (name) => {
      return {
         labels: [10, 11, 12, 13, 14, 15, 16],
         datasets: [
            {
               label: name,
               fill: false,
               lineTension: 0.1,
               borderColor: '#0292ED',
               backgroundColor: '#FF4D7D',
               pointRadius: 3,
               pointHitRadius: 0,
               data: [100, 240, 300, 290, 300, 440, 232]
            },
         ]
      }
   }
   
   return (
      <div className='slideContainer'>
         <div className='col-md-12'>
            <div className='col-md-12'>
               <h5 className="component_heading mb-20">AI Pipeline Insights(Expert system dashboard) <br/><span>Charts are showing 24hrs data</span>
               
               <Link to={isValidPermission("READ_AI_PIPELINE_INSIGHT")?'/dashboard/crm/detectedanomalies':null}>View All
                     <i className="zmdi zmdi-chevron-right"></i>
                  </Link>
               </h5>
            </div>
         </div>

         <Slider {...settings}>
            <div className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Total Anomalies Detected <Tooltip title="Total Anomalies Detected of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>225</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={getData('Total Anomalies Detected').labels} datasets={getData('Total Anomalies Detected').datasets} />
               </div>
            </div>
            <div className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Total Anomalies in RCA Buckets <Tooltip title="Total Anomalies in RCA Buckets of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>125</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={getData('Total Anomalies in RCA Buckets').labels} datasets={getData('Total Anomalies in RCA Buckets').datasets} />
               </div>
            </div>
            <div className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Total Mitigation Applied <Tooltip title="Total Mitigation Applied of last 24 hr." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>26%</h2>
               </Box>
               <div className="slidechart-chart">
                  <StackedAreaChart labels={getData('Total Mitigation Applied').labels} datasets={getData('Total Mitigation Applied').datasets} />
               </div>
            </div>
            <div className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Reviewed Anomalies <Tooltip title="Reviewed Anomalies of last 24 hr" arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>18%</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart labels={getData('Anomalies Cluster').labels} datasets={getData('Anomalies Cluster').datasets} />
               </div>
            </div>
         </Slider>
      </div>
   );
}

export default AIPipelineSliderContainer