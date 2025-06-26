import React, { Component } from 'react';
import { Doughnut } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';
import ChartDataLabels from 'chartjs-plugin-datalabels';

export default class DoughnutChart extends Component {
   render() {
      const options = {
         plugins: {
            datalabels: {
               formatter: (value, ctx) => {
                  if(value === 0){
                     return null;
                  }
                  else{
                     return value
                  }
              },
               padding: {
                  top: 5,
                  bottom: 5,
                  left: 5,
                  right: 5
               },
               textAlign: 'center',
               // backgroundColor: '#ccc',
               color: 'black',
               font: {
                  weight: 'bold',
                  size: 20,
               }
            },
         },
         legend: {
            display: true,
            labels: {
               fontColor: ChartConfig.legendFontColor
            }
         },
         cutoutPercentage: 50,
         onClick(e){
            console.log(e)
         }
      };
      const data = {
         labels: ['Pass','Un-Published', 'Fail', 'In-Progress', 'Pending'],
         datasets: [{
            data: [
            this.props?.data?.data?.New?.Pass ? this.props?.data?.data?.New?.Pass : 0,
            this.props?.data?.data?.New?.Unpublished ? this.props?.data?.data?.New?.Unpublished : 0,
            this.props?.data?.data?.New?.Fail ? this.props?.data?.data?.New?.Fail : 0,
            this.props?.data?.data?.New?.['In-Progress'] ? this.props?.data?.data?.New?.['In-Progress'] : 0,
            this.props?.data?.data?.New?.Pending ? this.props?.data?.data?.New?.Pending : 0],
            backgroundColor: [
               ChartConfig.color.green,
               ChartConfig.color.purple,
               ChartConfig.color.pink,
               ChartConfig.color.blue,
               ChartConfig.color.yellow,

            ],
            hoverBackgroundColor: [
               ChartConfig.color.green,
               ChartConfig.color.purple,
               ChartConfig.color.pink,
               ChartConfig.color.blue,
               ChartConfig.color.yellow,

            ]
         }]
      };
      return (
         <Doughnut data={data} options={options} plugins={[ChartDataLabels]} height={100} />
         // <Doughnut data={data} options={options} height={100} />
      );
   }
}