import * as React from "react";
import { useState, useEffect } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Cell,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

import ChartConfig, { tooltipStyle, tooltipTextStyle } from 'Constants/chart-config';
import { useSelector } from 'react-redux';

function CustomizedLabel(props) {
    console.log("abcd-1-charts-", props);
    const { x, y, fill, value } = props;
    return (
        <text
            x={x}
            y={y}
            dy={-4}
            fontSize="16"
            fontFamily="sans-serif"
            fill={fill}
            textAnchor="initial"
        >
            {value}
        </text>
    );

}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

function BarGraph(props) {
    console.log("abcd-2-charts-", props);



    let data = [
    ];

    if(props.type=="RCA_Bucket"){
        
    if (props?.chartData?.datasets.length > 0) {
        props?.chartData?.datasets.map((value, index) => {
            let obj = {
                count: props?.chartData?.labels[index],
                //   AnswerRef: "one",
                Text: value.data,
                // Score: 0,
                RespondentPercentage: 12,
                Rank: 1,
                color: `#e50394`,//`#e${index}0${index}9${index}`
            }

            data.push(obj)

        })
    } else {
        let obj = {
            count: 0,
            //   AnswerRef: "one",
            Text: "",
            // Score: 0,
            RespondentPercentage: 12,
            Rank: 1,
            color: `#e50394`
        }

        data.push(obj)
    }
    }else if(props.type=="Mitigation"){
        if (props?.chartData?.datasets.length > 0) {
            props?.chartData?.datasets[0].data.map((value, index) => {
                let obj = {
                    count:value,
                    //   AnswerRef: "one",
                    Text:props?.chartData?.labels[index],
                    // Score: 0,
                    RespondentPercentage: 12,
                    Rank: 1,
                    color:`#e50394`// index>9?`#e109${index}`:`#e${index}0${index}9${index}`
                }
    
                data.push(obj)
    
            })
        } else {
            let obj = {
                count: 0,
                //   AnswerRef: "one",
                Text: "",
                // Score: 0,
                RespondentPercentage: 12,
                Rank: 1,
                color: `#e50394`
            }
    
            data.push(obj)
        }
    }


    function formatYAxis(value) {
        return `${value}`
    }
    return (
        <>
          <div className="side-text">
          {props.type=="RCA_Bucket"?<p> Count</p>:<p>Count</p>}
            </div>
        <ResponsiveContainer width='100%' height={300}>
          
            <BarChart data={data}>
                {/* <Legend layout="horizontal" verticalAlign="top" align="right" /> */}
                <Tooltip cursor={{ fill: '#FFFFFF' }} />
                <XAxis dataKey="Text" fontFamily="sans-serif" fontSize='13px' tickSize dy="40" height={95} textAnchor= "end" sclaeToFit="true" verticalAnchor= "start"  interval={0} angle= "-40" stroke="#000000"/>
                <YAxis tickFormatter={formatYAxis} style={{ fontSize: 12 }} stroke={ChartConfig.axesColor} allowDecimals= {false}/>
                <CartesianGrid vertical={true} stroke={ChartConfig.chartGridColor} />
                <Tooltip wrapperStyle={tooltipStyle} cursor={false} itemStyle={tooltipTextStyle} />

                <Bar
                    dataKey="count"
                    barSize={40}
                    fontFamily="sans-serif"
                    label={<CustomizedLabel />}
                >
                    {data.map((entry, index) => (
                        <Cell fill={data[index].color} />
                    ))}
                </Bar>
                {/* <Bar dataKey="DetailVideoQCTime" stackId="a" fill={'#f8cf4b'}  width={ChartConfig.with}/> */}
            </BarChart>
        </ResponsiveContainer>
        <div className="down-text">
               {props.type=="RCA_Bucket"? <p>BUCKET NAME</p>: <p>DURATION In ({props.selectVal})</p>}
            </div>
        </>
    );
}

export default BarGraph;