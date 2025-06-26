import { Legend } from "chart.js";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import { useEffect, useState } from "react";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import {
  BarChart,
  CartesianGrid,
  Label,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip as ToolTipChart,
  Bar,
} from "recharts";

const ByContentStackBarGraphChart = (props) => {
  const handle = useFullScreenHandle();
  const [isLoadingData, setisLoadingData] = useState(false);
  const [chartData, setChartData] = useState([]);
  const [selectValBelowGraph, setSelectValBelowGraph] = useState(
    "DURATION ( In 1 Day)"
  );

  useEffect(() => {
    let temparray = [];
    let partnerparray = [];
    if (props?.data?.data && props?.data?.data.length > 0) {
      props?.data?.data.map((element) => {
        let obj = {
          interval: element.issueType,
          ...element.partners,
        };
        temparray.push(obj);

        // Object.entries(element.partners)
        //.sort(([,a],[,b]) => b-a)
        //.reduce((r, [k, v]) => ({ ...r, [k]: v }), {})
        // partnerparray.push(Object.keys(element.partners))
      });
    }
    setChartData(temparray);
    if (props.frequency == "DAILY") {
      setSelectValBelowGraph(`DURATION ( In 1 Day)`);
    } else if (props?.frequency == "WEEKLY") {
      setSelectValBelowGraph(`DURATION ( In 1 Week)`);
    } else if (props?.frequency == "MONTHLY") {
      setSelectValBelowGraph(`DURATION ( In 1 Month)`);
    } else if (props?.frequency == "MONTHLY_3") {
      setSelectValBelowGraph(`DURATION ( In 3 Month)`);
    }

    if (props?.data?.data) {
      setisLoadingData(true);
    } else {
      setisLoadingData(false);
    }
  }, [props?.data?.data]);

  const colorCodeWithPartner = {
    AHA: "#46C7C7",
    CHAUPAL: "#f58231",
    CURIOSITYSTREAM: "#e6194b",
    DOCUBAY: "#4363d8",
    EPICON: "#ffe119",
    EROSNOW: "#911eb4",
    HALLMARKMOVIESNOW: "#2E8B57",
    HOICHOI: "#641E16",
    HOTSTAR: "#46f0f0",
    HUNGAMA: "#3cb44b",
    JIOCINEMA: "#AAF0D1",
    KOODE: "#f032e6",
    LIONSGATE: "#52595D",
    MANORAMAMAX: "#512b50", //"#d2691e",
    MXPLAYER: "#B0E0E6",
    NAMMAFLIX: "#BF360C",
    PLANETMARATHI: "#7D6608",
    PRIME: "#ff4d4d",
    REELDRAMA: "#bcf60c",
    SHEMAROOME: "#CD5C5C",
    SONYLIV: "#fabebe",
    SUNNXT: "#243763",
    TARANGPLUS: "#008080",
    qoe: "#c56cf0",
    TRAVELXP: "#9AFEFF",
    VOOTKIDS: "#e6beff",
    VOOTSELECT: "#66ff00",
    ZEE5: "#ffa700",
  };
  var partnerArray = [];

  const renderBarChartEnum = () => {
    if (props?.data?.data) {
      props?.data?.data.map((element) => {
        const entries = Object.entries(element.partners);
        // .sort(([,a],[,b]) => b-a);
        for (const [partner, count] of entries) {
          let obj = {
            value: count,
            id: partner,
          };
          partnerArray.push(obj);
        }

        console.log("abcd-2-", partnerArray);
      });
    }
    //.sort(function(a, b) { return (b.value - a.value) })
    let partnerrows = Array.from(new Set(partnerArray.map((s) => s.id)))
      // .sort((a,b) => b.value>a.value?1:b.value===a.value?0:-1)
      // .sort((a,b) => b.id>a.id?1:b.id===a.id?0:-1)

      .map((lab) => {
        let obj1 = {
          label: lab,
        };
        return obj1.label;
      });
    const barArr = [];
    console.log("abcd-3-", partnerrows);
    if (chartData.length > 0) {
      // .sort(function(a, b) { return (a > b ? 1 : (a === b ? 0 : -1)) })

      partnerrows
        .sort(function (a, b) {
          return a > b ? 1 : a === b ? 0 : -1;
        })
        .map((element) => {
          barArr.push(
            <Bar
              dataKey={element}
              stackId="a"
              barSize={40}
              //key={element + index}
              fill={colorCodeWithPartner[element]}
            />
          );
        });
    }
    return barArr;
  };

  return (
    <>
      <FullScreen handle={handle}>
        <div
          style={{
            padding: "10px",
            backgroundColor: "white",
            height: "100%",
          }}
        >
          {!isLoadingData && <RctPageLoader />}
          {console.log("abcd---", chartData)}
          <ResponsiveContainer width={"100%"} height={300}>
            <BarChart data={chartData} margin={{ left: 30 }}>
              <CartesianGrid strokeDasharray="2 2" />
              <XAxis dataKey="interval">
                <Label
                  value={selectValBelowGraph}
                  offset={0}
                  position="insideBottom"
                  fontSize="12"
                />
              </XAxis>
              <YAxis
                label={{
                  value: "PARTNER COUNT",
                  angle: -90,
                  position: "left",
                  fontSize: 12,
                }}
              />
              <ToolTipChart style={{ zIndex: "1000 !important" }} />
              <Legend />
              {renderBarChartEnum()}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </FullScreen>
    </>
  );
};
export default ByContentStackBarGraphChart;
// sort(function(a, b) { return (a > b ? 1 : (a === b ? 0 : -1)) })
