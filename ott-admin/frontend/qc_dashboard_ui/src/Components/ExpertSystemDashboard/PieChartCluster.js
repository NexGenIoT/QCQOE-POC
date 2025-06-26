/**
 * Tiny Pie Chart
 */
import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Grid, Table, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { NotificationManager } from 'react-notifications';
import copy from 'copy-to-clipboard';

ChartJS.register(ArcElement, Tooltip, Legend);


const TinyPieChart = ({ labels, datasets, width, height, type }) => {

   console.log("TinyPieChart--", labels, datasets);
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
      },

      layout: {
         padding: {
            bottom(ctx) {
               const chart = ctx.chart;
               let pb = 0;
               chart.data.datasets.forEach(function (el) {
                  const hOffset = el.hoverOffset || 0;
                  pb = Math.max(hOffset / 1 + 5, pb)
               });
               return pb;
            }
         },
      },

   }
   const colors = ['#66cc01', '#019a00', '#00ccce', '#0065ce', '#fc9a00', '#ff6600', '#ff0100', '#cd009a', '#f99d5a', '#ee446b', '#f99d5a', '#01ad88', '#014769', '#ab2522']
   const data = {
      labels: labels ? labels : [],// ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [
         {
            label: '# of Votes',
            data: datasets ? datasets : [],
            backgroundColor: colors,
            borderColor: colors,
            borderWidth: 1,
         },
      ],
   };

   const clickOnItem = (item, value) => {
      if (item) {
         NotificationManager.success(`${item} copied`, '', 200);
         copy(value);
      }
   }
   return (
      <>


         {/* <Grid container spacing={2}>
            <Grid item xs={6} md={6}> */}
               <div style={{ height: 350, width: 350, margin: 'auto' }}>
                  <Pie height={height} width={width} data={data} options={options} plugins={[ChartDataLabels, options.plugins]} />
               </div>
            {/* </Grid> */}
            <Grid item xs={12} md={12}>
               {type == "insession" && labels && labels.length > 9 ? <h3>Top 10 Records</h3> : null}
               {labels && labels.length>0?<TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                     <TableHead
                        style={{ backgroundColor: "#ffffff", borderBottom: "#000000" }}
                     >
                        <TableRow
                           style={{
                              borderBottom: "1px solid #4a4444",
                              color: '#42444a',
                              background: '#f4f4f4',
                           }}
                           sx={{ border: 0 }}
                        >  <TableCell>Color</TableCell>
                           <TableCell>{type == "insession" ? "Dimension" : "Error Name"}</TableCell>
                           <TableCell>Count</TableCell>
                        </TableRow>
                     </TableHead>
                     {datasets && labels ? (datasets.map((value, index) => {
                        return (
                           <TableRow
                                 style={{
                                    borderBottom: "1px solid #4a4444",
                                    color: '#42444a',
                                 }}
                              sx={{ border: 0 }}
                           >
                              <TableCell style={{padding:'0 0 0 3px', backgroundColor: `${colors[index]}`, width: "52px"}}><p style={{color:`${colors[index]}`}}>.</p></TableCell>
                              <TableCell style={{padding:'0 0 0 5px'}}><p>{labels[index]}</p></TableCell>
                              <TableCell style={{padding:'0 0 0 25px',fontWeight:'600'}}>{value}</TableCell>
                           </TableRow>
                        )
                     })) : null}
                  </Table>
               </TableContainer>
               :null}
            {/* </Grid> */}
         </Grid >
      </>
   );
}

export default TinyPieChart;
