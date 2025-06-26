import React from 'react';
import { Line } from 'react-chartjs-2';
function StackedAreaChartComponent(props) {
   const { labels, datasets } = props;
   const data = {
      labels,
      datasets
   };
   const options = {
    // plugins: {
    //   legend: {
    //     display: false
    //   },
    // },
    // scales: {
    //   yAxes: {
    //     title: {
    //       display: true,
    //       text: 'yAxisTitle',
    //       font: {
    //         size: 15
    //       }
    //     },
    //     ticks: {
    //       precision: 0
    //     }
    //   },
    //   xAxes: {
    //     title: {
    //       display: true,
    //       text: 'xAxisTitle',
    //       font: {
    //         size: 15
    //       }
    //     },
    //     ticks: {
    //       precision: 0
    //     }
    //   },
    // }
      plugins: {
        legend: {
          display: false
        },
      },
      scales: {
         x: {
           display: false
         },
         y: {
           display: false
         }
       }
    }
   return (
      <Line data={data} options={options} height={100} />
   );
}

export default StackedAreaChartComponent;