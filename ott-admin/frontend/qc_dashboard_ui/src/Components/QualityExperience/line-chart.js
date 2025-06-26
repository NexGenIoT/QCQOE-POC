/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import { useSelector } from 'react-redux';
import moment from "moment";

const LineChartComponent = (props) => {
  const realdata = useSelector(state => state.qoeReducer);
  const favorite = realdata?.favoriteMetric;
  const {
    timeGraphPoints,
    metricGraphPoints,
    androidDataPoints,
    chromeDataPoints,
    fireTvDataPoints,
    firestickDataPoints,
    iosDataPoints,
    graphPointsUpdated,
    isLoadingData,
    devicePlatform,
    selectVal,
    androidSmartTvDataPoints
  } = props;


  const xAxesTitle = () => {
    if (selectVal === "5min") {
      return `DURATION (In 5 Minutes)`;
    }
    else if (selectVal === '1h') {
      return `DURATION (In 1 Hour)`
    }
    else if (selectVal === '1d') {
      return `DURATION (In 1 Day)`
    }
    else if (selectVal === '1w') {
      return `DURATION (In 1 Week)`
    }
    else if (selectVal === '1m') {
      return `DURATION (In 1 Month)`
    }
    else if (selectVal === '1y') {
      return `DURATION (In 1 Year)`
    }
    else if (selectVal === 'date-range') {
      return `DURATION (In Days)`
    }else{
      return `DURATION(${moment(selectVal.startDate).format("DD/MM/yyyy")} - ${moment(selectVal.endDate).format("DD/MM/yyyy")})`
    }
  }
  let datasetSampleObj = {};

  let toConstructData = {
    options: {
      legend: {
        display: false,
        labels: {
          fontColor: ChartConfig.legendFontColor
        }
      },
      scales: {
        yAxes: {
          title: {
            display: true,
            text: `${props.settitle ? `${props.settitle.toUpperCase()} ${props.unit && `(${props.unit})`}` : 'In Ratio'}`,
            font: {
              size: 12
            }
          },
          ticks: {
            precision: 0
          }
        },
        xAxes: {
          title: {
            display: true,
            text: xAxesTitle(),
            font: {
              size: 12
            }
          },
          ticks: {
            precision: 0
          }
        },
      }
    },
    labels: timeGraphPoints,
    datasets: []
  }
  const constructGraphData = (ds, toConstructDataObj) => {
    const newObject = { ...toConstructDataObj };
    Object.keys(newObject).map((property) => {
      return newObject["datasets"] = ds;
    });
    return newObject;
  }
  const constructDatasets = (obj) => {
    let finalDatasetArray = [];
    if (devicePlatform) {
      if (devicePlatform.length === 0 && Array.isArray(metricGraphPoints)) {
        const newObject = { ...obj };
        newObject["label"] = "All";
        newObject["backgroundColor"] = "66f5ae";
        newObject["borderColor"] = "66f5ae";
        newObject["borderJoinStyle"] = "66f5ae";
        newObject["pointBackgroundColor"] = "66f5ae";
        newObject["data"] = metricGraphPoints;
        finalDatasetArray.push(newObject);
      }
      else {
        for (let i = 0; i < devicePlatform.length; i++) {
          const newObject = { ...obj };
          if (devicePlatform[i] === "Android") {
            newObject["label"] = "Android";
            newObject["backgroundColor"] = "#56bcfc";
            newObject["borderColor"] = "#56bcfc";
            newObject["borderJoinStyle"] = "#56bcfc";
            newObject["pointBackgroundColor"] = "#56bcfc";
            newObject["data"] = androidDataPoints;
          }
          else if (devicePlatform[i] === "Web") {
            newObject["label"] = "Web";
            newObject["backgroundColor"] = "#66f5ae";
            newObject["borderColor"] = "#66f5ae";
            newObject["borderJoinStyle"] = "#66f5ae";
            newObject["pointBackgroundColor"] = "#66f5ae";
            newObject["data"] = chromeDataPoints;
          }
          else if (devicePlatform[i] === "iOS") {
            newObject["label"] = "IOS";
            newObject["backgroundColor"] = "#ff4d7d";
            newObject["borderColor"] = " #ff4d7d";
            newObject["borderJoinStyle"] = "#ff4d7d";
            newObject["pointBackgroundColor"] = "#ff4d7d";
            newObject["data"] = iosDataPoints;
          }
          else if (devicePlatform[i] === "Firestick") {
            newObject["label"] = "Firestick";
            newObject["backgroundColor"] = "purple";
            newObject["borderColor"] = " purple";
            newObject["borderJoinStyle"] = "purple";
            newObject["pointBackgroundColor"] = "purple";
            newObject["data"] = firestickDataPoints;
          }
          else if (devicePlatform[i] === "AndroidSmartTv") {
            newObject["label"] = "AndroidSmartTv";
            newObject["backgroundColor"] = "yellow";
            newObject["borderColor"] = " yellow";
            newObject["borderJoinStyle"] = "yellow";
            newObject["pointBackgroundColor"] = "yellow";
            newObject["data"] = androidSmartTvDataPoints;
          }
        
          Object.keys(newObject).length > 0 && finalDatasetArray.push(newObject);
        }
      }
    }
    return finalDatasetArray;
  }
  let [data, setData] = useState();
  
  useEffect(() => {
    let constructedDataSets = constructDatasets(datasetSampleObj);
    if (constructedDataSets.length !== 0) {
      let constructedGraphData = constructGraphData(constructedDataSets, toConstructData)
      setData(constructedGraphData);
    }
  }, [])


  useEffect(() => {
    let ds = constructDatasets(datasetSampleObj)
    if (ds.length !== 0) {
      let gd = constructGraphData(ds, toConstructData);
      setData(gd);
    }
  }, [timeGraphPoints]);
  return (
    <div>
      {window.location.href.includes('favorite') && favorite?.length === 0 ? null :
        <>
          {(timeGraphPoints && graphPointsUpdated && !isLoadingData && data) ? <Line redraw data={data} options={data.options}></Line> : <RctPageLoader />}
        </>
      }
    </div>
  );
}
export default LineChartComponent;


