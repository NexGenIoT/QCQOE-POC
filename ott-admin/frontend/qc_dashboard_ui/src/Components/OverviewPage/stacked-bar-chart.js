import React from 'react';
import {
	ResponsiveContainer,
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend
} from 'recharts';
import ChartConfig, { tooltipStyle, tooltipTextStyle } from 'Constants/chart-config';
import { useSelector } from 'react-redux';

function StackedBarChartComponent(props) {
   const data = useSelector(state => state.overviewReducer);
   let averageRpiData = []
   props?.data.length > 0 ? props?.data.map(d=>{
      return d?.values.map(data=>{
         if(data.type === 'RPI'){
            return averageRpiData.push({
               name: d.category,
               RPI: data.time ? data.time.toFixed(2) : '0.00'
            })
         }
         else{
            return null
         }
      })
   }) : 
   data?.contentTypes.length > 0 && data?.contentTypes.map(d=>{
      return averageRpiData.push({
         name: d.name,
         RPI: 0
      })
   })
   function formatYAxis(value) {
      return `${value}S`
   }
   // function formatXAxis(value) {
   //    return `${value}(S)`
   // }
   return (
      <ResponsiveContainer width='100%' height={300}>
         <BarChart data={averageRpiData}>
            <Legend layout="horizontal" verticalAlign="top" align="right" />
            <Tooltip cursor={{fill: '#FFFFFF'}} />
            <XAxis style={{fontSize: 12}} dataKey="name" stroke={ChartConfig.axesColor} />
            <YAxis tickFormatter={formatYAxis} style={{fontSize: 12}} stroke={ChartConfig.axesColor} />
            <CartesianGrid vertical={false} stroke={ChartConfig.chartGridColor} />
            <Tooltip wrapperStyle={tooltipStyle} cursor={false} itemStyle={tooltipTextStyle} />
            
            <Bar dataKey="RPI" barSize={20} stackId="a" fill={'#E10092'}  />
            {/* <Bar dataKey="DetailVideoQCTime" stackId="a" fill={'#f8cf4b'}  width={ChartConfig.with}/> */}
         </BarChart>
      </ResponsiveContainer>
   );
}

export default StackedBarChartComponent;
