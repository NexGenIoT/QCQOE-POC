import { Grid } from '@mui/material';
import React from 'react';
import { Bar } from 'react-chartjs-2';

const Histogram = (props) => {
    let datasetSampleObj = {};
    const dataSetsToDraw = (obj) => {
        let finalDatasetArray = [];
        if (props.devicePlatform) {
            if (props.devicePlatform.length === 0 && Array.isArray(props.metricGraphPoints)) {
                const newObject = { ...obj };
                newObject["barThickness"] = 15;
                newObject["label"] = "All";
                newObject["backgroundColor"] = "66f5ae";
                newObject["borderColor"] = "66f5ae";
                newObject["borderWidth"] = 1;
                newObject["stack"] = 1;
                newObject["hoverBackgroundColor"] = "66f5ae";
                newObject["hoverBorderColor"] = "66f5ae";
                newObject["data"] = props.metricGraphPoints ? props.metricGraphPoints : []
                finalDatasetArray.push(newObject);
            }
            else {
                for (let i = 0; i < props.devicePlatform.length; i++) {
                    const newObject = { ...obj };
                    if (props.devicePlatform[i] === "Android") {
                        newObject["barThickness"] = 15;
                        newObject["label"] = "Android";
                        newObject["backgroundColor"] = "#ed497b";
                        newObject["borderColor"] = "#ed497b";
                        newObject["borderWidth"] = 1;
                        newObject["stack"] = 1;
                        newObject["hoverBackgroundColor"] = "#ed497b";
                        newObject["hoverBorderColor"] = "#ed497b";
                        newObject["data"] = props.androidDataPoints ? props.androidDataPoints : []
                    }
                    else if (props.devicePlatform[i] === "Web") {
                        newObject["barThickness"] = 15;
                        newObject["label"] = "Web";
                        newObject["backgroundColor"] = "#56bcf8";
                        newObject["borderColor"] = "#56bcf8";
                        newObject["borderWidth"] = 1;
                        newObject["stack"] = 1;
                        newObject["hoverBackgroundColor"] = "#56bcf8";
                        newObject["hoverBorderColor"] = "#56bcf8";
                        newObject["data"] = props.chromeDataPoints ? props.chromeDataPoints : []
                    }
                    else if (props.devicePlatform[i] === "iOS") {
                        newObject["barThickness"] = 15;
                        newObject["label"] = "iOS";
                        newObject["backgroundColor"] = "#70f5ae";
                        newObject["borderColor"] = "#70f5ae";
                        newObject["borderWidth"] = 1;
                        newObject["stack"] = 1;
                        newObject["hoverBackgroundColor"] = "#70f5ae";
                        newObject["hoverBorderColor"] = "#70f5ae";
                        newObject["data"] = props.iosDataPoints ? props.iosDataPoints : []
                    }
                    else if (props.devicePlatform[i] === "AndroidSmartTv") {
                        newObject["barThickness"] = 15;
                        newObject["label"] = "AndroidSmartTv";
                        newObject["backgroundColor"] = "yellow";
                        newObject["borderColor"] = "yellow";
                        newObject["borderWidth"] = 1;
                        newObject["stack"] = 1;
                        newObject["hoverBackgroundColor"] = "yellow";
                        newObject["hoverBorderColor"] = "yellow";
                        newObject["data"] = props.AndroidSmartTvDataPoints ? props.AndroidSmartTvDataPoints : []
                    }
                    else if (props.devicePlatform[i] === "Firestick") {
                        newObject["barThickness"] = 15;
                        newObject["label"] = "Firestick";
                        newObject["backgroundColor"] = "purple";
                        newObject["borderColor"] = "purple";
                        newObject["borderWidth"] = 1;
                        newObject["stack"] = 1;
                        newObject["hoverBackgroundColor"] = "purple";
                        newObject["hoverBorderColor"] = "purple";
                        newObject["data"] = props.firestickDataPoints ? props.firestickDataPoints : []
                    }


                    Object.keys(newObject).length > 0 && finalDatasetArray.push(newObject);
                }
            }
        }
        return finalDatasetArray;
    }
    // var dateIST =[]
    // if(props.timeGraphDataPoints){
    //     props.timeGraphDataPoints.forEach(element => {
    //      dateIST.push(new Date(element).toLocaleString("en-IN", {timeZone: 'Asia/Kolkata'}));
    //     });
    //     //date shifting for IST timezone (+5 hours and 30 minutes)
    // }
   
    const dataDisplay = {
        labels: props.timeGraphDataPoints ? props.timeGraphDataPoints : [],// dateIST ? dateIST : [],
        datasets: dataSetsToDraw(datasetSampleObj)
    }
    return (
        <>
            <Grid container specing={1} >
                <Bar
                    data={dataDisplay}
                    width={300}
                    height={120}
                    options={{
                        scales: {
                            x: {
                                ticks: {
                                    autoSkip: true,
                                }
                            }
                        }
                    }}
                // options={{
                //     legend: {
                //         display: false
                //     },
                //     layout: {
                //         padding: {
                //             top: 25
                //         }
                //     },
                //     scales: {
                //         xAxes: [{
                //             gridLines: {
                //                 color: "rgba(0, 0, 0, 0)",
                //                 drawBorder: false,
                //                 display: true,
                //             },
                //             ticks: {
                //                 display: true
                //             },
                //         }],
                //         yAxes: [{
                //             barPercentage: 0.2,
                //             gridLines: {
                //                 color: "rgba(0, 0, 0, 0)",
                //                 drawBorder: false,
                //                 paddingTop: '10px'
                //             }
                //         }]
                //     }
                // }}
                />
            </Grid>
        </>
    );
}
export default Histogram;