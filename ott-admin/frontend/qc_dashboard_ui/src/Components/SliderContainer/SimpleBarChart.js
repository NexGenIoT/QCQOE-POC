/**
 * Simple Bar Chart Component
 */
import React from 'react';
import { Bar } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

function BarChart(props) {
   const { labels, datasets } = props;
   const data = {
      labels,
      datasets
   }
   let options;
   if(!props.isConfig){
    options = {
      plugins: {
        datalabels: {
          display: false
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
   }
   else{
     options = {
      scales: {
         x: {
           ticks: {
             autoSkip: false,
             maxRotation: 30,
             minRotation: 30,
             font: {
              size: 8,
            },
           }
         },
         y: {
          ticks: {
            autoSkip: false,
            font: {
             size: 12,
           },
          }
        }
       },
      plugins: {
        datalabels: {
          formatter: (value, ctx) => {
             return value
         },
          color: "black",
          align: "end",
          anchor: "end",
          font: { size: "10", weight: 'bold' }
        //  align: 'end',
        //  backgroundColor: '#ccc',
        //  color: '#fff',
        //   font: {
        //      weight: 'bold',
        //      size: 10,
        //   }
       },
        legend: {
          display: false
        },
      },
     }
   }
   return (
      <Bar plugins={[ChartDataLabels]} data={data} options={options} height={100} />
   );
}

export default BarChart;