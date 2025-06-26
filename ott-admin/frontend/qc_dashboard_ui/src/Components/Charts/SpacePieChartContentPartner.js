import React from 'react';
import { Doughnut, Pie} from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';

const SpacePieChartContentPartner = (props) => {
   const colors = ['#66cc01','#019a00','#00ccce','#0065ce','#fc9a00','#ff6600','#ff0100','#cd009a','#f99d5a','#ee446b','#f99d5a','#01ad88','#014769','#ab2522']
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

         // beforeDraw: function(chart) {
         //    var width = chart.width,
         //        height = chart.height,
         //        ctx = chart.ctx;
         //        ctx.restore();
         //        var fontSize = (height / 160).toFixed(2);
         //        ctx.font = fontSize + "em sans-serif";
         //        ctx.textBaseline = "top";
         //        var text = "30",
         //        textX = Math.round((width - ctx.measureText(text).width) / 2),
         //        textY = height / 2.4;
         //        ctx.fillText(text, textX, textY);
         //        ctx.save();
         //   } 
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
        chart.data.datasets.forEach(function(el) {
          const hOffset = el.hoverOffset || 0;
          pb = Math.max(hOffset / 1 + 5, pb)
        });
        return pb;
      }
    },
  },
       
   }
   let dataToCalculateContentPartner = {}
   if(props.type === 'content-partner'){
      let labels = []
      let dataPoints = []
      props?.response?.partners?.map(g=>{
         return(
            [
               labels.push(g.partner),
               dataPoints.push(g.count)
            ]
         )
         
      })
      dataToCalculateContentPartner = {
         labels: labels,
         datasets: [{
            data: dataPoints,
            backgroundColor: colors,
            hoverBackgroundColor: colors,
            borderWidth: 1,
            hoverOffset:10
         }]
      };
   }
   const legends = []
   dataToCalculateContentPartner?.labels.map((cp, index)=>{
      return legends.push({
         partner: cp,
         color: colors[index]
      })
   })
   return (
      <>
         {/* <div style={{ display: 'flex', flexDirection: 'row', position: 'absolute'}}>
            {
               legends?.map((lab, index) => {
                  return (
                     <div key={index} style={{ display: 'flex', flexDirection: 'row', marginRight: 20, height: '100%', alignItems: 'center' }}>
                        <span style={{ borderRadius: '16px', backgroundColor: lab.color, border: '1px solid #ccc', width: '16px', height: '16px', marginRight: 10 }}></span>
                        <h5 style={{ height: '100%', marginTop: 8 }}>{lab.partner}</h5>
                     </div>
                  )
               })
            }
         </div> */}
         <div style={{width: 245}}>
            <Pie style={{marginTop: 50, borderRadius:'100%',cursor:'pointer'}} getElementAtEvent={(data) => {
               if (data.length >= 1) {
                  const dataItem = data[0]
                  const index = dataItem.index
                 props.handleChangeContentPartner(dataToCalculateContentPartner.labels[index])
               }
            }} data={dataToCalculateContentPartner} options={options} plugins={[ChartDataLabels,options.plugins]} />
            <h3 style={{textAlign: 'center', marginTop:'13px'}}>Content Partner</h3>
         </div>
      </>
   );
}

export default SpacePieChartContentPartner;
