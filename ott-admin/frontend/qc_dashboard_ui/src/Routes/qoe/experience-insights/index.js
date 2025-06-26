/*eslint no-useless-concat: "off"*/
import React, { useState, useEffect } from 'react';
import {TextField, MenuItem, Typography } from "@material-ui/core";
import InsightTabs from "./InsightTabs"
import InsightTable from "./InsightTable"
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import { experienceData, getThresholds, getUniqueFilters } from 'Store/Actions';
import moment from 'moment';
import { useDispatch, useSelector } from "react-redux";

const allMatrics = [
   {
     value: 'realtime',
     label: 'Real-Time Key Insights',
   },
   {
     value: 'userengagement',
     label: 'User Engagement Metrics',
   },
   {
     value: 'qualityexperience',
     label: 'Quality Of Experience (QoE)',
   },
 ];
export default function ExperienceInsights(props){   
   const dispatch = useDispatch()
   const data = useSelector(state => state.qoeReducer);
   const [sortMatrics, setSortMatrics] = useState('userengagement');
   const [insightData, setInsightData] = useState([]);
   const [headData, setHeadData] = useState([]); 
   const [head, setHead] = useState([]); 
   const [headWithout, setHeadWithout] = useState([]); 
   const [matricsName, setMatricsName] = useState("user_engagement_metrices");

   const handleChange = (event) => {
      setInsightData([])
      setSortMatrics(event.target.value);
   };

   useEffect(() => {
      if(sortMatrics === "userengagement"){
         setHeadData(data?.filters?.user_metrices_name)
         setHeadWithout(data?.filters?.user_metrices)
         let filter = data?.filters?.user_metrices
         const myData = filter && [...filter]
         myData && myData.forEach((element, index) => {
            myData[index] = `m_${element}`;
          });
         setHead(myData)
         setMatricsName("user_engagement_metrices")
      } else if(sortMatrics === "qualityexperience"){
         setHeadData(data?.filters?.qoe_metrics_name)
         setHeadWithout(data?.filters?.qoe_metrics)
         let filter = data?.filters?.qoe_metrics
         const myData = filter && [...filter]
         myData && myData.forEach((element, index) => {
            myData[index] = `m_${element}`;
          });
         setHead(myData)
         setMatricsName("quality_of_experience")
      }else{
         setHeadData(data?.filters?.realtime_metrices_name)
         setHeadWithout(data?.filters?.realtime_metrices)
         let filter = data?.filters?.realtime_metrices
         const myData = filter && [...filter]
         myData && myData.forEach((element, index) => {
            myData[index] = `m_${element}`;
          });
         setHead(myData)
         setMatricsName("real_time_key_insights")
      }
   },[sortMatrics, data?.filters])

   useEffect(() => {
      dispatch(experienceData(matricsName, 'device_platform', true, dispatch))
      dispatch(experienceData(matricsName, 'content_partner', false, dispatch))
    }, [dispatch, matricsName]);

    useEffect(() => {
      const isEmpty = Object.keys(data?.filters).length === 0;
		if(isEmpty){
			dispatch(getUniqueFilters(dispatch))
		}
      dispatch(getThresholds(dispatch))
    }, [dispatch, data?.filters]);

   const selectedTabs=(d)=>{
      if(d===0){
         setInsightData(data?.contentPartnerData);
     } else if(d===1){ 
         setInsightData(data?.devicePlatformData);
     }
   }
   return (
      <div className="ecom-dashboard-wrapper 44"> 
         <div className='insightheader'>
               <Typography variant="h4">Experience Insight</Typography >
               <div className='analysisHeaderRight'>
                  <p>Last updated {new Date().getDate() + " " + moment().format('MMM') + " " + new Date().getFullYear() + " " + "|" + " " + moment().format('hh:mm')}</p>
                  <TextField
                     className="dropdown"
                     variant="outlined"
                     select
                    // label="Sort"
                     placeholder='Sort'
                     value={sortMatrics}
                     onChange={handleChange}
                  >
                     {allMatrics.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                        {option.label}
                        </MenuItem>
                     ))}
                  </TextField>
               </div>
            </div>
            {data?.loading ? <RctPageLoader /> :
            <div className='insightContainer'>
               <InsightTabs tabsData={insightData.length === 0 ? data?.contentPartnerData : insightData} selectedTabs={selectedTabs} />
               <InsightTable headWithout={headWithout} head={head} tableData={insightData.length === 0 ? data?.contentPartnerData : insightData} tableHeadData={headData} throshold={data?.threshHold} selectedMatrics={matricsName}/>
            </div>
            }
      </div>
   )
}
