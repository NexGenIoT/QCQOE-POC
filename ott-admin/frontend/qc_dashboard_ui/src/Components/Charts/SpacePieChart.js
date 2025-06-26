import React from 'react';
import { Pie } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { useSelector } from 'react-redux';

const SpacePieChart = () => {
   const finalData = useSelector(state => state.overviewReducer);
   // const finalColors = [ChartConfig.color.pink,
   // ChartConfig.color.green,
   // ChartConfig.color.blue,
   // ChartConfig.color.yellow]
   const colors = [ChartConfig.color.pink,
      ChartConfig.color.green,
      ChartConfig.color.blue,
      ChartConfig.color.yellow]
   // const [colors, setColors] = useState([
   //    ChartConfig.color.pink,
   //    ChartConfig.color.green,
   //    ChartConfig.color.blue,
   //    ChartConfig.color.yellow
   // ])
   const labels = ['Fail', 'Pass', 'In-Progress', 'Pending']
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
               size: 20,
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
   const getFailData = () => {
      return finalData?.connectedData?.data?.New?.Fail
   }
   const getPassData = () => {
      return finalData?.connectedData?.data?.New?.Pass
   }
   const getInProgressData = () => {
      return finalData?.connectedData?.data?.New?.['In-Progress']
   }
   const getPendingData = () => {
      return finalData?.connectedData?.data?.New?.Pending
   }
   const data = {
      labels: labels,
      datasets: [{
         data: [getFailData(), getPassData(), getInProgressData(), getPendingData()],
         backgroundColor: colors,
         hoverBackgroundColor: colors
      }]
   };
   return (
      <Pie getElementAtEvent={(data) => {
         if (data.length >= 1) {
            const dataItem = data[0]
            const index = dataItem.index
            // const dataFinal = [...finalColors]
            // dataFinal[index] = 'red'
            // setColors(dataFinal)
         }
      }} data={data} options={options} plugins={[ChartDataLabels]} />
   );
}

export default SpacePieChart;
