import React, { useEffect, useState } from 'react';
import Slider from "react-slick";
import { Box, Tooltip } from "@material-ui/core";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SimpleBarChart from './SimpleBarChart'
import SpacePieChart from './SpacePieChart'
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';

function VideoQCSliderContainer(props) {
   const history = useHistory()
   const [dataToFetch, setDataToFetch] = useState([])
   const [totalAssetsNumber, setTotalAssetsNumber] = useState(0)
   const [totalAssetsPassNumber, setTotalAssetsPassNumber] = useState(0)
   const [totalAssetsFailNumber, setTotalAssetsFailNumber] = useState(0)
   const [totalAssetsPendingNumber, setTotalAssetsPendingNumber] = useState(0)
   const colors = ['#FCE5AD', '#F3A9D4', '#72B7E2', '#C4ADF5', '#9AEDF1', '#ff6384', "#220046", 'red', 'brown', 'green']
   const settings = {
      dots: false,
      infinite: false,
      speed: 300,
      slidesToShow: 3,
      slidesToScroll: 1,
      autoplay: false,
      //arrows: true,
      centerMode: false,
      prevArrow: <img alt='left-arrow' src={`${process.env.PUBLIC_URL}/assets/left-arrow.svg`} width="15" height="27" />,
      nextArrow: <img alt='right-arrow' src={`${process.env.PUBLIC_URL}/assets/right-arrow.svg`} width="15" height="27" />
   };

   useEffect(() => {
      const fetchData = async () => {
         const response = await axios.get('/api/assets/summary')
         setDataToFetch(response.data)
         let totalAssets = 0
         response.data.map(total => {
            return totalAssets = totalAssets + total.total
         })
         setTotalAssetsNumber(totalAssets)
         let totalPassAssets = 0
         response.data.map(total => {
            return total.status.map(t => {
               if (t.status === 'Pass') {
                  return totalPassAssets = totalPassAssets + t.count
               }
               else{
                  return null
               }
            })
         })
         setTotalAssetsPassNumber(totalPassAssets)
         let totalFailAssets = 0
         response.data.map(total => {
            return total.status.map(t => {
               if (t.status === 'Fail') {
                  return totalFailAssets = totalFailAssets + t.count
               }
               else{
                  return null
               }
            })
         })
         setTotalAssetsFailNumber(totalFailAssets)
         let totalPendingAssets = 0
         response.data.map(total => {
            return total.status.map(t => {
               if (t.status === 'Pending') {
                  return totalPendingAssets = totalPendingAssets + t.count
               }
               else{
                  return null
               }
            })
         })
         setTotalAssetsPendingNumber(totalPendingAssets)

      }
      fetchData()
   }, [])

   const getTotalAssetLabels = () => {
      let allLabel = []
      dataToFetch.map(d => {
         return allLabel.push(d.partner)
      })
      return allLabel
   }

   const getTotalAssetDataSets = () => {
      let allDataSet = []
      dataToFetch.map((d, i) => {
         return allDataSet.push(d.total)
      })
      return allDataSet
   }

   const getTotalAssetPassDataSets = () => {
      let allPassDataSet = []
      dataToFetch.map((d, i) => {
         const include = d.status.find(s => s.status === 'Pass')
         if (include) {
            return allPassDataSet.push(include.count)
         }
         else {
            return allPassDataSet.push(0)
         }
      })
      return allPassDataSet
   }

   const getTotalAssetPendingDataSets = () => {
      let allPendingDataSet = []
      dataToFetch.map((d, i) => {
         const include = d.status.find(s => s.status === 'Pending')
         if (include) {
            return allPendingDataSet.push(include.count)
         }
         else {
            return allPendingDataSet.push(0)
         }
      })
      return allPendingDataSet
   }

   const getTotalAssetFailDataSets = () => {
      let allFailDataSet = []
      dataToFetch.map((d, i) => {
         const include = d.status.find(s => s.status === 'Fail')
         if (include) {
            return allFailDataSet.push(include.count)
         }
         else {
            return allFailDataSet.push(0)
         }
      })
      return allFailDataSet
   }

   const totalAssets = {
      labels: getTotalAssetLabels(),
      datasets: [
         {
            label: 'Total Assets',
            fill: false,
            lineTension: 0.1,
            backgroundColor: colors,
            borderColor: '#220046',
            pointRadius: 3,
            pointHitRadius: 0,
            barPercentage: 0.5,
            barThickness: 20,
            data: getTotalAssetDataSets()
         },
      ],
   }

   const totalAssetsPass = {
      labels: getTotalAssetLabels(),
      datasets: [
         {
            label: 'Pass',
            fill: false,
            lineTension: 0.1,
            backgroundColor: colors,
            borderColor: '#220046',
            pointRadius: 3,
            pointHitRadius: 0,
            data: getTotalAssetPassDataSets()
         },
      ]
   }

   const totalAssetsFail = {
      labels: getTotalAssetLabels(),
      datasets: [
         {
            label: 'Fail',
            fill: false,
            lineTension: 0.1,
            backgroundColor: colors,
            borderColor: '#220046',
            pointRadius: 3,
            pointHitRadius: 0,
            data: getTotalAssetFailDataSets()
         },
      ]
   }

   const totalAssetsPending = {
      labels: getTotalAssetLabels(),
      datasets: [
         {
            label: 'Pending',
            fill: false,
            lineTension: 0.1,
            backgroundColor: colors,
            borderColor: '#220046',
            pointRadius: 3,
            pointHitRadius: 0,
            barPercentage: 0.5,
            barThickness: 20,
            data: getTotalAssetPendingDataSets()
         },
      ],
   }

   const clickOnMetric = () => {
      history.push('/dashboard/crm/overview')
   }

   return (
      <div className='slideContainer'>
         <div className='col-md-12'>
            <div className='col-md-12'>
               <h5 className="component_heading mb-20">Video QC <span>Charts are showing 24hrs data</span>
                  <Link to={'/dashboard/crm/overview'}>View All
                     <i className="zmdi zmdi-chevron-right"></i>
                  </Link>
               </h5>
            </div>
         </div>

         <Slider {...settings}>
            <div onClick={() => clickOnMetric()} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Asset <Tooltip title="Info Content..." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{totalAssetsNumber}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart isConfig={true} labels={totalAssets.labels} datasets={totalAssets.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric()} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Pass <Tooltip title="Info Content..." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{totalAssetsPassNumber}</h2>
               </Box>
               <div className="slidechart-chart dashbord-pi-chart">
                  <SpacePieChart labels={totalAssetsPass.labels} datasets={totalAssetsPass.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric()} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Fail <Tooltip title="Info Content..." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{totalAssetsFailNumber}</h2>
               </Box>
               <div className="slidechart-chart dashbord-pi-chart">
                  <SpacePieChart labels={totalAssetsFail.labels} datasets={totalAssetsFail.datasets} />
               </div>
            </div>
            <div onClick={() => clickOnMetric()} className="slidechart-item">
               <Box className='slidechart-header'>
                  <h3>Pending <Tooltip title="Info Content..." arrow><InfoOutlinedIcon /></Tooltip></h3>
                  <h2>{totalAssetsPendingNumber}</h2>
               </Box>
               <div className="slidechart-chart">
                  <SimpleBarChart isConfig={true} labels={totalAssetsPending.labels} datasets={totalAssetsPending.datasets} />
               </div>
            </div>
         </Slider>
         <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', marginTop: 20 }}>
            {
               totalAssets?.labels?.map((lab, index) => {
                  return (
                     <div key={index} style={{ display: 'flex', flexDirection: 'row', marginRight: 20, height: '100%', alignItems: 'center' }}>
                        <span style={{ borderRadius: '16px', backgroundColor: colors[index], border: '1px solid #ccc', width: '16px', height: '16px', marginRight: 10 }}></span>
                        <h5 style={{ height: '100%', marginTop: 8 }}>{lab}</h5>
                     </div>
                  )

               })
            }
         </div>
      </div>
   );
}

export default VideoQCSliderContainer 