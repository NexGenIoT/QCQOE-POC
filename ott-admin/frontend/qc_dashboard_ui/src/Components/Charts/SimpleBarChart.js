import React, { Component } from 'react';
import { Bar } from 'react-chartjs-2';
import ChartConfig from 'Constants/chart-config';
import { CircularProgress } from '@material-ui/core';



const options = {
	plugins:{
		legend: {
			labels: {
				fontColor: ChartConfig.legendFontColor
			}
		},	
	},
	scales: {
		x: {
			grid: {
				color: ChartConfig.chartGridColor,
				display:false
			},
			ticks: {
				fontColor: ChartConfig.axesColor
			}
		},
		y: {
			grid: {
				color: ChartConfig.chartGridColor
			},
			ticks: {
				fontColor: ChartConfig.axesColor
			}
		}
	}
};

export default class BarChart extends Component {

	render() {
		console.log(this.props,'ww2')

		var lebelArray=[];
		var datasetsData=[];
		if(this.props?.data?.data!=undefined){
			this.props?.data?.data.map((value,index)=>{
				lebelArray.push(value.interval)
				datasetsData.push(value.issueCount)
			})
		}

		const data = {
			labels: lebelArray , 
			datasets: [
				{
					label:this.props?.filterType,
					backgroundColor: ChartConfig.color.primary,
					borderColor: ChartConfig.color.primary,
					borderWidth:0,
					hoverBackgroundColor: ChartConfig.color.primary,
					hoverBorderColor: ChartConfig.color.primary, 
			  maxBarThickness:9, 
					data: datasetsData
				}
			]
		}
			return (
				<Bar data={data} options={options} width={100}
				height={50}
			/>
			//</div>
			
			
		);
	}
}

