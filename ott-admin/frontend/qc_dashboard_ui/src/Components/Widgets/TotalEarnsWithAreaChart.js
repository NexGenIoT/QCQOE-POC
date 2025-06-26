/**
 * Total Earns With Area Chart
 */
import React, { Fragment } from 'react';
// chart
import { Line } from 'react-chartjs-2';
import ChartConfig from "Constants/chart-config";
function TotalEarnsWithAreaChart(props) {
   const { datasets, labels } = props.chartData;
   const xAxesTitle = () => {
      if (props.selectVal === "5m") {
        return `DURATION (In 5 Minutes)`;
      }
      if (props.selectVal === "1h") {
        return `DURATION (In 1 Hour)`;
      } else if (props.selectVal === "1d") {
        return `DURATION (In 1 Day)`;
      } else if (props.selectVal === "1w") {
        return `DURATION (In 1 Week)`;
      } else if (props.selectVal === "1m") {
        return `DURATION (In 1 Month)`;
      } else if (props.selectVal === "1y") {
        return `DURATION (In 1 Year)`;
      } else if (props.selectVal === "date-range") {
        return `DURATION (In Days)`;
      }
    };

   const dataToShow = {
      options: {
        legend: {
          display: false,
          labels: {
            fontColor: ChartConfig.legendFontColor,
          },
        },
        scales: {
          yAxes: {
            title: {
              display: true,
              text: "COUNT",
              font: {
                size: 12,
              },
            },
            ticks: {
              precision: 0,
            },
          },
          xAxes: {
            title: {
              display: true,
              text: xAxesTitle(),
              font: {
                size: 12,
              },
            },
            ticks: {
              precision: 0,
            },
          },
        },
      },
      labels: labels,
      datasets: datasets,
    };

   return (
      <Fragment>
         <div className="chart-top total-earn-chart d-flex justify-content-between mb-50">
            <div className="d-flex align-items-end">
               {/* <span className="badge-primary badge-sm">&nbsp;</span><span className="fs-12">Sales</span>
                   <span className="badge-warning badge-sm">&nbsp;</span><span className="fs-12">Visitors</span> */}
            </div>
         </div>
         {
            datasets &&  <Line redraw data={dataToShow} options={dataToShow.options}></Line> 
          }
      </Fragment>
   );
}

export default TotalEarnsWithAreaChart;
