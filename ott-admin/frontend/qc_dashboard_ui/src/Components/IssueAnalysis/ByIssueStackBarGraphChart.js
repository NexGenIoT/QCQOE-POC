import { Legend } from "chart.js"
import RctPageLoader from "Components/RctPageLoader/RctPageLoader"
import { useEffect, useState } from "react"
import { FullScreen, useFullScreenHandle } from "react-full-screen"
import { useSelector } from "react-redux"
import { Tooltip } from "reactstrap"
import {
    BarChart,
    CartesianGrid,
    Label,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip as ToolTipChart,
    Bar
} from "recharts"

const ByIssueStackBarGraphChart = (props) => {
    const data = useSelector(state => state.overviewReducer);
    const handle = useFullScreenHandle();
    const [isLoadingData, setisLoadingData] = useState(false);
    const [chartData, setChartData] = useState([]);
    const [selectValBelowGraph, setSelectValBelowGraph] = useState("DURATION ( In 1 Day)");

    const chartDataaa = props?.data?.data
    const issueTypeLabel = {
        Playability: "playabilityCount",
        Rechability: "reachabilityCount",
        UrlGenerationFailed: "urlGenerationFailedCount",

        //  Integrity: "integrityCount"
    }
    const issueTypeColorcode = {
        Playability: "#fe6700",
        Rechability: "#54bcf9",
        UrlGenerationFailed: "#cab576",

        //  Integrity: "#FB2576"
    }
    const renderBarChartEnum = () => {
        var barArr = [];
        if (props?.data?.data?.length > 0 && props?.issueTYpe != '') {
            barArr.push(
                <Bar
                    dataKey={issueTypeLabel[props?.issueTYpe]}
                    stackId="a"
                    barSize={40}
                    fill={issueTypeColorcode[props?.issueTYpe]}
                />
            )
        } else {
            barArr = [
                <Bar dataKey="urlGenerationFailedCount" barSize={40} stackId="a" fill="#cab576" label={"abcd3"} />,
                <Bar dataKey="reachabilityCount" barSize={40} stackId="a" fill="#54bcf9" label={"abcd2"} />,
                <Bar dataKey="playabilityCount" barSize={40} stackId="a" fill="#fe6700" label={"abcd1"} />,

            ]
        }
        return barArr
    }

    useEffect(() => {

        setChartData(chartDataaa)
        if (props.frequency == "DAILY") {
            setSelectValBelowGraph(`DURATION ( In 1 Day)`)
        } else if (props?.frequency == "WEEKLY") {
            setSelectValBelowGraph(`DURATION ( In 1 Week)`)
        } else if (props?.frequency == "MONTHLY") {
            setSelectValBelowGraph(`DURATION ( In 1 Month)`)
        } else if (props?.frequency == "MONTHLY_3") {
            setSelectValBelowGraph(`DURATION ( In 3 Month)`)

        }

        if (props?.data?.data) {
            setisLoadingData(true)
        } else {
            setisLoadingData(false)

        }
    }, [props?.data?.data])


    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload?.length) {
            return (
                <div className="custom-tooltip" style={{ background: "#fff" }}>
                    {payload.map(res => {
                        return (<div style={{ margin: "10px" }}>
                            <p className="label" style={{ color: "#fe6700" }}>{res.name == "playabilityCount" ? "Playability Fail :" : null} {res.name == "playabilityCount" ? res.payload.playabilityCount : null}</p>
                            <p className="label" style={{ color: "#54bcf9" }}>{res.name == "reachabilityCount" ? "Reachability Fail :" : null} {res.name == "reachabilityCount" ? res.payload.reachabilityCount : null}</p>
                            <p className="label" style={{ color: "#cab576" }}>{res.name == "urlGenerationFailedCount" ? "URL Generation Fail :" : null} {res.name == "urlGenerationFailedCount" ? res.payload.urlGenerationFailedCount : null}</p>

                        </div>
                        )
                    })}
                </div>
            );
        }

        return null;
    };
    return <>
        <FullScreen handle={handle}>
            <div
                style={{
                    padding: "10px",
                    backgroundColor: "white",
                    height: "100%",
                }}
            >
                {!isLoadingData && <RctPageLoader />}
                <ResponsiveContainer width={'100%'} height={300}>
                    <BarChart
                        data={chartData}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey='interval' >
                            <Label value={selectValBelowGraph} offset={0} position="insideBottom" fontSize="12" margin={{ top: 20, bottom: 20 }} />
                        </XAxis>
                        <YAxis label={{ value: 'ISSUE COUNT', angle: -90, position: 'left', fontSize: 12 }} />
                        {/* <ToolTipChart style={{ zIndex: '1000 !important' }} /> */}
                        <ToolTipChart content={<CustomTooltip />} />
                        <Legend />
                        <>
                            {renderBarChartEnum()}
                        </>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </FullScreen>
    </>
}
export default ByIssueStackBarGraphChart