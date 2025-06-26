import React from 'react';
import { Pie } from 'react-chartjs-2';

const SpacePieChart = ({ labels, datasets, width, height }) => {
   const data = {
      labels,
      datasets
   };
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
         textAlign: 'center',
         backgroundColor: '#ccc',
         color: '#fff',
          font: {
             weight: 'bold',
             size: 10,
          }
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
      <Pie height={100} data={data} options={options} />
   );
}

export default SpacePieChart;
