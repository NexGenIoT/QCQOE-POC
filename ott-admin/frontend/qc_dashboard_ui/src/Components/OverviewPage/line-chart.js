 import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';

export default class LineChartComponent extends Component {
  render() {
    function compare( a, b ) {
      if ( a.interval < b.interval ){
        return -1;
      }
      if ( a.interval > b.interval ){
        return 1;
      }
      return 0;
    }
    let finalData = []
    let labels = []
    let totalData = []
    let passData = []
    let failData = []
    let inProgress = []
    let pendingData = []
    let verifyData = []

    this.props?.data?.map(d=>{
      if(d.interval.includes(":")){
        return finalData = this.props?.data.sort(compare)
      }
      else{
        return finalData = this.props?.data
      }
    })
    finalData.length > 0 && finalData.map(d=>{
      return labels.push(d.interval)
    })
    finalData.length > 0 && finalData.map(da=>{
      if(da.values.length > 0){
          return da.values.map(d=>{
              if(d.status === 'Total'){
                  return totalData.push(d.counts)
              }
              else{
                return null
              }
          })
      }
      else{
          return totalData.push(0)
      }
    })
    finalData.length > 0 && finalData.map((da, index) => {
      if (da.values.length > 0) {
        const p = da.values.find(d => d.status === 'Pass')
        if (p) {
          return passData.push(p.counts)
        }
        else {
          return passData.push(0)
        }
      }
      else {
        return passData.push(0)
      }
    })
    finalData.length > 0 && finalData.map((da, index) => {
      if (da.values.length > 0) {
        const f = da.values.find(d => d.status === 'Fail')
        if (f) {
          return failData.push(f.counts)
        }
        else {
          return failData.push(0)
        }
      }
      else {
        return failData.push(0)
      }
    })
    finalData.length > 0 && finalData.map((da, index) => {
      if (da.values.length > 0) {
        const i = da.values.find(d => d.status === 'In-Progress')
        if (i) {
          return inProgress.push(i.counts)
        }
        else {
          return inProgress.push(0)
        }
      }
      else {
        return inProgress.push(0)
      }
    })
    finalData.length > 0 && finalData.map((da, index) => {
      if (da.values.length > 0) {
        const p = da.values.find(d => d.status === 'Pending')
        if (p) {
          return pendingData.push(p.counts)
        }
        else {
          return pendingData.push(0)
        }
      }
      else {
        return pendingData.push(0)
      }
    })
    finalData.length > 0 && finalData.map((da, index) => {
      if (da.values.length > 0) {
        const p = da.values.find(d => d.status === 'Unpublished')
        if (p) {
          return verifyData.push(p.counts)
        }
        else {
          return verifyData.push(0)
        }
      }
      else {
        return verifyData.push(0)
      }
    })
    const data = {
      labels: labels,
      datasets: [
        {
          label: 'Total',
          fill: false,
          lineTension: 0.1,
          backgroundColor:'#56bcfc',
          borderColor:'#56bcfc',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor:'#56bcfc',
          pointBackgroundColor:'#56bcfc',
          pointBorderWidth:1,
          pointHoverRadius:1,
          pointHoverBackgroundColor: ChartConfig.color.info,
          pointHoverBorderColor: ChartConfig.color.info,
          pointHoverBorderWidth:0,
          pointRadius:4,
          pointHitRadius:0,
          data: totalData
        },
        {
          label: 'Pass',
          fill: false,
          lineTension: 0.1,
          backgroundColor:'#66f5ae',
          borderColor:'#66f5ae',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor:'#66f5ae',
          pointBackgroundColor:'#66f5ae',
          pointBorderWidth:1,
          pointHoverRadius:1,
          pointHoverBackgroundColor: ChartConfig.color.info,
          pointHoverBorderColor: ChartConfig.color.info,
          pointHoverBorderWidth:0,
          pointRadius:4,
          pointHitRadius:0,
          data: passData
        },
        {
          label: 'Un-Published',
          fill: false,
          lineTension: 0.1,
          backgroundColor:'#896BD6',
          borderColor:'#896BD6',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor:'#896BD6',
          pointBackgroundColor:'#896BD6',
          pointBorderWidth:1,
          pointHoverRadius:1,
          pointHoverBackgroundColor: ChartConfig.color.info,
          pointHoverBorderColor: ChartConfig.color.info,
          pointHoverBorderWidth:0,
          pointRadius:4, 
          pointHitRadius:0,
          data: verifyData
        },
        {
          label: 'Fail',
          fill: false,
          lineTension: 0.1,
          backgroundColor:'#ff4d7d',
          borderColor:'#ff4d7d',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor:'#ff4d7d',
          pointBackgroundColor:'#ff4d7d',
          pointBorderWidth:1,
          pointHoverRadius:1,
          pointHoverBackgroundColor: ChartConfig.color.info,
          pointHoverBorderColor: ChartConfig.color.info,
          pointHoverBorderWidth:0,
          pointRadius:4,
          pointHitRadius:0,
          data: failData
        },
        {
          label: 'In-Progress',
          fill: false,
          lineTension: 0.1,
          backgroundColor:'#f566f5',
          borderColor:'#f566f5',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor:'#f566f5',
          pointBackgroundColor:'#f566f5',
          pointBorderWidth:1,
          pointHoverRadius:1,
          pointHoverBackgroundColor: ChartConfig.color.info,
          pointHoverBorderColor: ChartConfig.color.info,
          pointHoverBorderWidth:0,
          pointRadius:4,
          pointHitRadius:0,
          data: inProgress
        },
        {
          label: 'Pending',
          fill: false,
          lineTension: 0.1,
          backgroundColor:'#f8cf4b',
          borderColor:'#f8cf4b',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          pointBorderColor:'#f8cf4b',
          pointBackgroundColor:'#f8cf4b',
          pointBorderWidth:1,
          pointHoverRadius:1,
          pointHoverBackgroundColor: ChartConfig.color.info,
          pointHoverBorderColor: ChartConfig.color.info,
          pointHoverBorderWidth:0,
          pointRadius:4, 
          pointHitRadius:0,
          data: pendingData
        },
       
      ]
    };
    
    const options = {
      legend: {
        display: false,
        labels: {
          display: false,
          usePointStyle: true,
          boxWidth: 6,
          fontColor: ChartConfig.legendFontColor
        }
      },
      scales: {
        x: {
            ticks: {
                font: {
                    size: 12,
                }
            }
        },
        y: {
          ticks: {
              font: {
                  size: 12,
              }
          }
      }
    }
    };
    return (
      <Line data={data} options={options}/>
    );
  }
}
