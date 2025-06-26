import React from 'react';
import { Doughnut, Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const SpacePieChartIssue = (props) => {
   const colors = ['#cab577', '#d64161', '#6b5b95', '#c1946a']
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
   let dataToCalculateIssue = {} 
   var typeofIssues 
   if (props.type === 'issue') {
      let labels = []
      let dataPoints = []
      props?.response?.isueTypes?.map(g => {
         return (
            [
               labels.push(g.issueType),
               dataPoints.push(g.count)
            ]
         )

      })
      dataToCalculateIssue = {
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
               // props.handleChangeContentPartner(['Fail', 'Pass', 'In-Progress', 'Pending'][index])
               // const dataFinal = [...finalColors]
               // dataFinal[index] = 'red'
               // setColors(dataFinal)
            }
             
         }} data={dataToCalculateIssue} options={options} plugins={[ChartDataLabels]} />  
         {dataToCalculateIssue.datasets[0].data.length == 0 ? <h2>No Data</h2> : null }
      </div>
      <h3 style={{ textAlign: 'center', marginTop:'13px' }}>Issue Type</h3>
      </>
   );
}

export default SpacePieChartIssue;
