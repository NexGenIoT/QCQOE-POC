import React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const SpacePieChartContentType = (props) => {
   const colors = [ChartConfig.color.pink, ChartConfig.color.green, ChartConfig.color.blue, ChartConfig.color.yellow]
   const options = {
      plugins: {
         datalabels: {
            formatter: (value, ctx) => {
               if (value === 0) {
                  return null;
               }
               else {
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
            color: 'black',
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
   let dataToCalculateContentType = {}
   if (props.type === 'content-type') {
      let labels = []
      let dataPoints = []
      props?.response?.contentTypes?.map(g => {
         return (
            [
               labels.push(g.contentType),
               dataPoints.push(g.count)
            ]
         )

      })
      dataToCalculateContentType = {
         labels: labels,
         datasets: [{
            data: dataPoints,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
         }]
      };
   }
   return (
      <> 
      <div  className='conectd-graph'>
         <Pie style={{ marginTop: 50 }} getElementAtEvent={(data) => {
            if (data.length >= 1) {
               // const dataItem = data[0]
               // const index = dataItem.index
            }
         }} data={dataToCalculateContentType} options={options} plugins={[ChartDataLabels]} />    
         {dataToCalculateContentType.datasets[0].data.length == 0 ? <h2>No Data</h2> : null }    
      </div>
      <h3 style={{ textAlign: 'center', marginTop: '13px' }}>Content Type</h3>
      </>
   );
}

export default SpacePieChartContentType;
