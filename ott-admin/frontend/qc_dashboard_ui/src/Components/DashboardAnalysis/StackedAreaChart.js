import React from 'react';
import { Line } from 'react-chartjs-2';

function StackedAreaChartComponent(props) {
   const { labels, datasets } = props;
   const data = {
      labels,
      datasets
   };

   console.log("abcd---",props);
   const options = {
        elements: {
          point:{
              radius: 0
          }
      },
      tooltips: {
        enabled: false
      },
      plugins: {
        tooltip: {
          enabled: false
        },
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
      <Line data={data} options={options} />
   );
}

export default StackedAreaChartComponent;