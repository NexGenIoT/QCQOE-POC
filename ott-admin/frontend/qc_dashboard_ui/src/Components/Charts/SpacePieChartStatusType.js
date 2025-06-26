import React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const SpacePieChartStatusTypes = (props) => {
   const colors = ['#DB4437', '#0F9D58', '#F4B400', '#4285F4']
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
         hoverOffset:10,
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
   let dataToCalculateStatus = {}
   if (props.type === 'status') {
      let labels = []
      let dataPoints = []
      props?.response?.status?.map(g => {
         return ([
            labels.push(g.status),
            dataPoints.push(g.count)
         ])
      })
      dataToCalculateStatus = {
         labels: labels,
         datasets: [{
            data: dataPoints,
            backgroundColor: colors,
            hoverBackgroundColor: colors
         }]
      };
   }
   return (
      <> 
      <div className='conectd-graph'>
         <Pie style={{ marginTop: 50 }} getElementAtEvent={(data) => {
            if (data.length >= 1) {
               // const dataItem = data[0]
               // const index = dataItem.index
               // // props.handleChangeContentPartner(['Fail', 'Pass', 'In-Progress', 'Pending'][index])
            }
         }} data={dataToCalculateStatus} options={options} plugins={[ChartDataLabels]} />
         {dataToCalculateStatus.datasets[0].data.length == 0 ? <h2>No Data</h2> : null }
      </div>
      <h3 style={{textAlign: 'center', marginTop:'13px'}}>QC Status</h3>
      </>
   );
}

export default SpacePieChartStatusTypes;
