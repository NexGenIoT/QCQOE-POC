import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { Tooltip } from "@material-ui/core";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import domtoimage from "dom-to-image";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ToolTipChart,
  Legend,
  ComposedChart,
  // BarChart,
  Line,
  Label,
} from "recharts";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import { createFileName } from "use-react-screenshot";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import TextField from "@mui/material/TextField";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Button from "@mui/material/Button";
import { DateRange } from "react-date-range";
import exportFromJSON from "export-from-json";
import AppliedFilters from "Components/QualityExperience/AppliedFilters";
import FilterLayout from "Components/QualityExperience/FilterLayout";
import Histogram from "Components/MitigationSummaryDashboard/Histogram";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import {
  getFavoriteMetrics,
  getMitigationAnalyticsPage,
  getUniqueFilters,
  setMetricType,
  setMetricTypeFullName,
  getErrorRecord,
  setErrorRecord,
} from "Store/Actions";
import MUIDataTable from "mui-datatables";
import * as _ from "lodash";
import { fontSize } from "@mui/system";
import { NotificationManager } from "react-notifications";

function groupBy(objectArray, property) {
  return objectArray.reduce((acc, obj) => {
    const key = obj[property];
    const curGroup = acc[key] || [];

    return { ...acc, [key]: [...curGroup, obj] };
  }, {});
}

export default function ErrorScreen() {
  const dispatch = useDispatch();
  const realdata = useSelector((state) => state.qoeReducer);
  const cdnVal = realdata?.filters?.cdn;
  const contentTypeVal = realdata?.filters?.content_type;
  const contentPartnetVal = realdata?.filters?.content_partner;
  const locationVal = realdata?.filters?.location;
  const errorCodeVal = realdata?.filters?.error_codes;
  const errorRecordData = realdata?.errorRecordData?.items;
  const [unit, setUnit] = useState("");
  const [isLoadingData, setisLoadingData] = useState(false);
  const [cdn, setCdn] = useState([]);
  const [contentType, setContentType] = useState([]);
  const [contentPartner, setContentPartner] = useState([]);
  const [location, setLocation] = useState([]);
  const [errorCode, setErrorCode] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [aggregationInterval, setAggregationInterval] = useState("1h");
  const [devicePlatform, setDevicePlatform] = useState(["Android", "iOS"]);
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [toDate, setToDate] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );
  const [updatedGraphData, setUpdatedGraphData] = useState();
  const [allGraphPoints, setAllGraphPoints] = useState([]);
  const [androidGraphPoints, setAndroidGraphPoints] = useState([]);
  const [iosGraphPoints, setIosGraphPoints] = useState([]);
  const [chromeGraphPoints, setChromeGraphPoints] = useState([]);
  const [tvGraphPoints, setTvGraphPoints] = useState([]);
  const [firestickGraphPoints, setFirestickGraphPoints] = useState([]);
  const [metricGraphPoints, setMetricGraphPoints] = useState();
  const [androidDataPoints, setAndroidDataPoints] = useState();
  const [iosDataPoints, setIosDataPoints] = useState();
  const [chromeDataPoints, setChromeDataPoints] = useState();
  const [tvDataPoints, setTvDataPoints] = useState();
  const [firestickDataPoints, setFirestickDataPoints] = useState();
  const [selectVal, setSelectVal] = useState("1d");
  const [selectValBelowGraph, setSelectValBelowGraph] = useState(
    "DURATION ( In 1 Day)"
  );
  const [xAxis, setXAxis] = useState("hour");
  const [tableData, setTableData] = useState([]);
  const [iOSErrorCount, setIOSErrorCount] = useState(0);
  const [androidErrorCount, setAndroidErrorCount] = useState(0);
  const [webErrorCount, setWebErrorCount] = useState(0);
  const [firestickCount, setFirestickErrorCount] = useState(0);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [openModal, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [colOrder, setColOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7]);

  const options = {
    count: errorRecordData?.length,
    pagination: true,
    selectableRows: false,
    rowsPerPageOptions: [10, 50, 100],
    filter: false,
    search: false,
  };

  useEffect(() => {
    if (realdata?.device_platform.length > 0) {
      setDevicePlatform(realdata?.device_platform);
    }
  }, [realdata?.device_platform]);

  const getCdn = (val) => {
    setCdn(val);
  };
  const getContentType = (val) => {
    setContentType(val);
  };
  const getContentPartner = (val) => {
    setContentPartner(val);
  };
  const getLocation = (val) => {
    setLocation(val);
  };
  const getErrorCode = (val) => {
    setErrorCode(val);
  };
  const getLocationWithoutState = (val) => {
    let temparray = [];
    val.forEach((element) => {
      temparray.push(element.split("(")[0]);
    });
    return temparray;
  };
  const date = (val) => moment(val * 1000).format("DD MMM YYYY | hh:mm"); //moment(data).format('DD MMM YYYY | hh:mm')

  useEffect(() => {
    console.log("first errorRecord");
    const tableV = [];
    let tempArr = [];

    let chartArr = [];

    if (errorRecordData?.length > 0) {
      setisLoadingData(false);
      errorRecordData
        ?.sort((a, b) => b.dts_es - a.dts_es)
        ?.forEach((items) => {
          // const {ErrorCode, ErrorDetails, ErrorName, location, dts_es, id, provider, platform, ueid} = items || {};
          const {
            udid,
            ueid,
            ErrorName,
            ErrorCode,
            ErrorDetails,
            dts_es,
            platform,
            provider,
            location,
            videoId = "",
            videoTitle = "",
          } = items || {};

          let obj = {
            date: moment.unix(dts_es).format("DD-MM-YYYY"), //dts_es,//
            provider: provider,
            errorCode: ErrorCode,
            platform: platform,
          };
          tempArr.push(obj);
          tableV.push([
            udid,
            ueid,
            provider,
            platform,
            videoTitle,
            videoId,
            location,
            date(dts_es),
            ErrorName,
            ErrorCode,
            ErrorDetails,
          ]);
          // tableV.push([id, ueid, ErrorName, ErrorCode, ErrorDetails, date(dts_es), platform, provider, ErrorDetails, location]);
          setTableData(tableV);
        });

      var grouped = tempArr.reduce(function (obj, product) {
        obj[product.date] = obj[product.date] || [];

        obj[product.date].push(product.provider);
        obj[product.date].push(product.errorCode);

        return obj;
      }, {});

      // console.log("final grouped--",grouped);

      var groups = Object.keys(grouped).map(function (key) {
        return {
          date: key,
          provider: grouped[key].reduce(function (obj, product, key) {
            obj[product] = obj[product] || [];
            obj[product].push(product);
            return obj;
          }, {}),
        };
      });

      // console.log("final groups--",groups);

      let objp = {};
      groups.map((item, index) => {
        Object.values(item.provider).map((item2, index2) => {
          // console.log("chart-objp-final-",item.provider ,"--",Object.values(item.provider));
          objp[Object.keys(item.provider)[index2]] = Object.values(
            item.provider
          )[index2].length;
        });
        // if(Object.values(item.provider)){
        // objp={}
        // for (let i = 0; i < Object.values(item.provider).length; i++) {
        //   objp[Object.keys(item.provider)[i]]  = Object.values(item.provider)[i].length
        // }
        let obj = {
          date: item.date,
          ...objp,
        };
        chartArr.push(obj);
        setChartData(chartArr);
        console.log("-chart-obj-", { chartArr });

        objp = {};
        // }
      });

      const platformData = errorRecordData.map((item) => item.platform);
      const countedPlatforms = platformData.reduce(
        (allPlatforms, platformName) => {
          const currCount = allPlatforms[platformName] || 0;
          return {
            ...allPlatforms,
            [platformName]: currCount + 1,
          };
        },
        {}
      );
      console.log(
        { tempArr: tempArr, chartArr, countedPlatforms },
        "final pppp"
      );

      const {
        iOS = 0,
        Android = 0,
        Web = 0,
        Firestick = 0,
      } = countedPlatforms || {};

      setIOSErrorCount(iOS);
      setAndroidErrorCount(Android);
      setWebErrorCount(Web);
      setFirestickErrorCount(Firestick);
    } else {
      setChartData([]);
      setTableData([]);
    }

    setTimeout(() => {
      setisLoadingData(false);
    }, 20000);
  }, [realdata?.errorRecordData]);

  const updatePlatformData = (layout, itemsToRemove) => {
    let dpl = devicePlatform;

    if (layout === "AppliedFilters") {
      // remove the elemets you got
      for (var j = 0; j < itemsToRemove.length; j++) {
        for (var i = 0; i < dpl.length; i++) {
          if (dpl[i] === itemsToRemove[j]) {
            dpl.splice(i, 1);
          }
        }
      }
      setDevicePlatform(dpl);
    } else if (layout === "FilterLayout") {
      // add the element you get
    }
  };

  const savePlatformData = (val) => {
    setDevicePlatform(val);
  };

  const removeContentPartner = (type) => {
    const data = contentPartner;
    const final = data.filter((d) => d !== type);
    setContentPartner(final);
  };

  const removeContentType = (type) => {
    const dataType = contentType;
    const final = dataType.filter((d) => d !== type);
    setContentType(final);
  };

  const removeLocation = (type) => {
    if (Array.isArray(type)) {
      setLocation([]);
    } else {
      const dataType = location;
      const final = dataType.filter((d) => d !== type);
      setLocation(final);
    }
  };

  const removeErrorCode = (type) => {
    const data = errorCode;
    const final = data.filter((d) => d !== type);
    setErrorCode(final);
  };

  const removeDevicePlatform = (platform) => {
    if (Array.isArray(platform)) {
      setDevicePlatform([]);
      setContentPartner([]);
      setContentType([]);
      localStorage.removeItem("contentPartner");
    } else {
      const dpa = devicePlatform;
      const final = dpa.filter((d) => d !== platform);
      setDevicePlatform(final);
    }
  };

  const setDataRange = (e) => {
    setStartDate();
    setEndDate();
    setRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setSelectVal(e.target.value);
    let aggrInterval = "";
    switch (e.target.value) {
      case "1min": {
        aggrInterval = "10s";
        setAggregationInterval(aggrInterval);
        setXAxis("sec");
        calculateDateRange("1min");
        setSelectValBelowGraph(`DURATION ( In 1 Min)`);

        return;
      }
      case "5min": {
        aggrInterval = "10s";
        setAggregationInterval(aggrInterval);
        setXAxis("sec");
        calculateDateRange("5min");
        setSelectValBelowGraph(`DURATION ( In 5 Min)`);

        return;
      }
      case "1h": {
        aggrInterval = "1m";
        setAggregationInterval(aggrInterval);
        setXAxis("hour");
        calculateDateRange("1h");
        setSelectValBelowGraph(`DURATION ( In 1 Hour)`);

        return;
      }
      case "1d": {
        aggrInterval = "1h";
        setAggregationInterval(aggrInterval);
        setXAxis("hour");
        calculateDateRange("1d");
        setSelectValBelowGraph(`DURATION ( In 1 Day)`);

        return;
      }
      case "1w": {
        aggrInterval = "1d";
        setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("1w");
        setSelectValBelowGraph(`DURATION ( In 1 Week)`);

        return;
      }
      case "1m": {
        aggrInterval = "2d";
        setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("1m");
        setSelectValBelowGraph(`DURATION ( In 1 Month)`);

        return;
      }
      case "1y": {
        aggrInterval = "30d";
        setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("1y");
        setSelectValBelowGraph(`DURATION ( In 1 Year)`);

        return;
      }
      default:
        return;
    }
  };

  const calculateDateRange = (timestamp) => {
    let sd = new Date(); //current system date
    let toDate = Math.floor(sd.getTime() / 1000.0);
    setToDate(toDate);
    // let ts = Math.floor(new Date().getTime() / 1000);
    let ts = Math.floor(moment().endOf("date")._d.getTime() / 1000.0);
    let fromDateRange;

    switch (timestamp) {
      case "1min": {
        fromDateRange = ts - 60;
        setFromDate(fromDateRange);
        return;
      }
      case "5min": {
        fromDateRange = ts - 300;
        setFromDate(fromDateRange);
        return;
      }
      case "1h": {
        fromDateRange = ts - 3600;
        setFromDate(fromDateRange);
        return;
      }
      case "1d": {
        fromDateRange = ts - 24 * 3600;
        setFromDate(fromDateRange);
        return;
      }
      case "1w": {
        fromDateRange = ts - 7 * 24 * 3600;
        setFromDate(fromDateRange);
        return;
      }
      case "1m": {
        fromDateRange = ts - 30 * 24 * 3600;
        setFromDate(fromDateRange);
        return;
      }
      case "1y": {
        fromDateRange = ts - 12 * 30 * 24 * 3600;
        setFromDate(fromDateRange);
        return;
      }
      default:
        return;
    }
  };

  // useEffect(() => {
  // 	dispatch(getErrorRecord(dispatch, {}));
  // }, [])

  const handleReload = () => {
    setChartData([]);
    let ts = Math.floor(new Date().getTime() / 1000);
    let fromDateInfo;
    switch (selectVal) {
      case "1min": {
        fromDateInfo = ts - 60;
        break;
      }
      case "5min": {
        fromDateInfo = ts - 300;
        break;
      }
      case "1h": {
        fromDateInfo = ts - 3600;
        break;
      }
      case "1d": {
        fromDateInfo = ts - 24 * 3600;
        break;
      }
      case "1w": {
        fromDateInfo = ts - 7 * 24 * 3600;
        break;
      }
      case "1m": {
        fromDateInfo = ts - 30 * 24 * 3600;
        break;
      }
      case "1y": {
        fromDateInfo = ts - 12 * 30 * 24 * 3600;
        break;
      }
      default:
        break;
    }
    const params = {
      provider: contentPartner,
      platform: devicePlatform,
      ErrorCode: errorCode,
      location: getLocationWithoutState(location),
      from_time: fromDateInfo, //1668685068,
      to_time: toDate, //1669033317,
    };
    dispatch(getErrorRecord(dispatch, params));
  };

  // useEffect(() => {
  //   console.log('first params');
  //   const params = {
  //     provider: contentPartner,
  //     platform: devicePlatform,
  //     ErrorCode: errorCode,
  //     location: getLocationWithoutState(location),
  //     from_time: fromDate, //1668685068,
  //     to_time: toDate, //1669033317,
  //   };

  //   dispatch(getErrorRecord(dispatch, params));

  // }, [
  //   contentPartner,
  //   contentType,
  //   errorCode,
  //   location,
  //   fromDate,
  //   toDate,
  //   devicePlatform,
  //   selectVal,
  // ])

  // useEffect(()=>{

  //    setInterval(() => {
  //     if(window.location.href.includes("error-screen")){
  //       let ts = Math.floor(new Date().getTime() / 1000);
  //       let fromDateInfo;
  //       switch (selectVal) {
  //         // case "1min": {
  //         //   fromDateInfo = ts - 60;
  //         //   break;
  //         // }
  //         case "5min": {
  //           fromDateInfo = ts - 300;
  //           break;
  //         }
  //         case "1h": {
  //           fromDateInfo = ts - 3600;
  //           break;
  //         }
  //         case "1d": {
  //           fromDateInfo = ts - 24 * 3600;
  //           break;
  //         }
  //         case "1w": {
  //           fromDateInfo = ts - 7 * 24 * 3600;
  //           break;
  //         }
  //         case "1m": {
  //           fromDateInfo = ts - 30 * 24 * 3600;
  //           break;
  //         }
  //         case "1y": {
  //           fromDateInfo = ts - 12 * 30 * 24 * 3600;
  //           break;
  //         }
  //         default:
  //           fromDateInfo = fromDate//Math.floor(new Date().getTime() / 1000)
  //           break;
  //       }
  //       const params = {
  //         provider: contentPartner,
  //         platform: devicePlatform,
  //         ErrorCode: errorCode,
  //         location: getLocationWithoutState(location),
  //         from_time: fromDateInfo, //1668685068,
  //         to_time: toDate, //1669033317,
  //       };
  //       dispatch(getErrorRecord(dispatch, params));
  //     }

  //    }, 60000);
  // },[])

  useEffect(() => {
    setChartData([]);
    setTableData([]);
    dispatch(setErrorRecord([]));
    setisLoadingData(true);
    console.log("first aggregationInterval");
    let ts = Math.floor(new Date().getTime() / 1000);
    let fromDateInfo;
    switch (selectVal) {
      // case "1min": {
      //   fromDateInfo = ts - 60;
      //   break;
      // }
      case "5min": {
        fromDateInfo = ts - 300;
        break;
      }
      case "1h": {
        fromDateInfo = ts - 3600;
        break;
      }
      case "1d": {
        fromDateInfo = ts - 24 * 3600;
        break;
      }
      case "1w": {
        fromDateInfo = ts - 7 * 24 * 3600;
        break;
      }
      case "1m": {
        fromDateInfo = ts - 30 * 24 * 3600;
        break;
      }
      case "1y": {
        fromDateInfo = ts - 12 * 30 * 24 * 3600;
        break;
      }
      default:
        fromDateInfo = fromDate; //Math.floor(new Date().getTime() / 1000)
        break;
    }
    const params = {
      provider: contentPartner,
      platform: devicePlatform,
      ErrorCode: errorCode,
      location: getLocationWithoutState(location),
      from_time: fromDateInfo, //1668685068,
      to_time: toDate, //1669033317,
    };
    dispatch(getErrorRecord(dispatch, params));
  }, [
    aggregationInterval,

    contentPartner,
    contentType,
    errorCode,
    location,
    fromDate,
    toDate,
    devicePlatform,
    selectVal,
  ]);

  useEffect(() => {
    const isEmpty = Object.keys(realdata?.filters).length === 0;
    if (isEmpty) {
      dispatch(getUniqueFilters(dispatch));
    }
  }, [dispatch, realdata?.filters]);

  const getImage = () => {
    var node = document.querySelector(".take-screenshot");
    var options = {
      quality: 1,
      bgcolor: "#ffffff",
    };
    domtoimage
      .toPng(node, options)
      .then(function (dataUrl) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = createFileName(
          "png",
          `by-content-partner-${moment().format("DD/MM/YYYY")}`
        );
        a.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const handle = useFullScreenHandle();

  let timeGraphDataPoints;
  let fullCombinationGraphPoints = [];
  fullCombinationGraphPoints.push(
    androidGraphPoints,
    iosGraphPoints,
    chromeGraphPoints,
    tvGraphPoints,
    firestickGraphPoints,
    allGraphPoints
  );
  const lengths = fullCombinationGraphPoints.map((a) => a.length);
  const index = lengths.indexOf(Math.max(...lengths));
  timeGraphDataPoints = fullCombinationGraphPoints[index];

  const submit = () => {
    // let diff = ((range[0].endDate - range[0].startDate)/ (1000 * 60 * 60 * 24)+1)% 365
    // if (diff > 31) {
    // 	NotificationManager.error("To-Date and From-Date Should be of 31 days of Gap", "", 2000)
    // 	return;
    // }
    setSelectVal("");
    setXAxis("date");
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    setModalOpen(false);
    let customeDate = `${moment(range[0].startDate).format(
      "DD/MM/YYYY"
    )}-${moment(range[0].endDate).format("DD/MM/YYYY")}`;
    setSelectValBelowGraph(`DURATION (${customeDate})`);
    setToDate(
      Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
    );
    setAggregationInterval("1d");
    setFromDate(Math.floor(range[0].startDate.getTime() / 1000.0));
  };

  const getExcelDownload = () => {
    const data = [];
    const fileName = createFileName(
      "csv",
      `error-insight-${moment().format("DD/MM/YYYY")}`
    );
    const exportType = exportFromJSON.types.csv;
    if (errorRecordData.length > 0) {
      errorRecordData.map((res) => {
        return (res.dts_es = moment(res.dts_es * 1000).format("DD/MM/YYYY")); //convert date in epoc to DD/MM/YYYY formate
      });
    }
    exportFromJSON({ data: errorRecordData, fileName, exportType });
  };

  const renderChart = () => {
    const barArr = [];
    const lineArr = [];
    if (chartData.length > 0) {
      const keysArr = chartData?.map((item) => {
        const { date, ...val } = item;
        return val;
      });
      const keys = keysArr?.reduce(function (result, current) {
        return Object.assign(result, current);
      }, {});
      console.log({
        keysArrChck: Array.isArray(keysArr),
        keysArr,
        keyData: keys,
      });
      if (keysArr.length > 0) {
        keysArr.forEach((item) => console.log({ keysItem: item }));
      }
      Object.keys(keys)?.map((item, index) => {
        console.log({ itemBar: item }, "dddddddd");
        // if (item.match(/^\d/)) {
        //   barArr.push(
        //     <Line

        //       dataKey={item} fill={colors[index]} type="monotone"
        //     />
        //   );
        // }
        // else {

        // }
        if (
          item != "undefined" &&
          !item.match(/^\d/) &&
          !typeof item !== "number" &&
          item !== "" &&
          item
        ) {
          barArr.push(
            <Bar
              dataKey={item}
              stackId="a"
              barSize={40}
              key={item + index}
              fill={colorCodeWithPartner[item]}
            />
          );
        }
      });
    }
    console.log({ barArr, chartData }, "ddd");
    return barArr;
  };

  const renderBarChartEnum = () => {
    const barArr = [];
    const uniqueIds = [];
    if (tableData.length > 0) {
      const unique = tableData.filter((element) => {
        const isDuplicate = uniqueIds.includes(element[2]);

        if (!isDuplicate) {
          uniqueIds.push(element[2]);

          return true;
        }

        return false;
      });
      unique.forEach((element) => {
        barArr.push(
          <Bar
            dataKey={element[2]}
            stackId="a"
            barSize={40}
            //key={element + index}
            fill={colorCodeWithPartner[element[2]]}
          />
        );
      });
    }
    return barArr;
  };
  return (
    <>
      <div className="row">
        <div className="col-md right-insight">
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Paper>
              <div className="graphcontentHead">
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {"SSO & PLAYBACK ERRORS"}
                </span>
                <Stack direction="row" spacing={1} sx={{ float: "right" }}>
                  <IconButton
                    color="primary"
                    aria-label="screenshot"
                    onClick={getImage}
                  >
                    <Tooltip title="Take screenshot" placement="bottom">
                      <CameraAltOutlinedIcon color="disabled" />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    color="secondary"
                    aria-label="download"
                    onClick={getExcelDownload}
                  >
                    <Tooltip title="Download File" placement="bottom">
                      <FileDownloadOutlinedIcon color="disabled" />
                    </Tooltip>
                  </IconButton>
                  <IconButton aria-label="fullscreen" onClick={handle.enter}>
                    <Tooltip title="Full Screen" placement="bottom">
                      <FullscreenOutlinedIcon color="disabled" />
                    </Tooltip>
                  </IconButton>
                  <Box className="dropdownCont">
                    <div className="interval-spase">
                      <FormControl fullWidth className="intervalSelect">
                        <InputLabel id="intervalSelect">Interval</InputLabel>
                        <Select
                          labelId="intervalSelect"
                          id="demo-simple-select"
                          value={selectVal}
                          label="Interval"
                          onChange={setDataRange}
                          className="interSelect"
                        >
                          <MenuItem value="5min">5 Minute</MenuItem>
                          <MenuItem value="1h">1 Hour</MenuItem>
                          <MenuItem value="1d">Day</MenuItem>
                          <MenuItem value="1w">Week</MenuItem>
                          <MenuItem value="1m">Month</MenuItem>
                          <MenuItem value="1y">Year</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className="dateCont">
                      <span>Custom Date</span>
                      <TextField
                        onClick={() => setModalOpen(true)}
                        contentEditable={false}
                        value={
                          startDate
                            ? moment(startDate).format("DD/MM/YYYY")
                            : ""
                        }
                        placeholder="dd-mm-yyyy"
                      />
                      <Box style={{ "margin-bottom": "0px" }} sx={{ mx: 2 }}>
                        {" "}
                        to{" "}
                      </Box>
                      <TextField
                        onClick={() => setModalOpen(true)}
                        contentEditable={false}
                        value={
                          endDate ? moment(endDate).format("DD/MM/YYYY") : ""
                        }
                        placeholder="dd-mm-yyyy"
                      />
                    </div>
                    <Modal
                      isOpen={openModal}
                      toggle={() => setModalOpen(false)}
                      centered
                    >
                      <ModalHeader>
                        <h3>Date Picker</h3>
                      </ModalHeader>
                      <ModalBody>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "center",
                          }}
                        >
                          <DateRange
                            onChange={(item) => setRange([item.selection])}
                            ranges={range}
                            editableDateInputs={true}
                            moveRangeOnFirstSelection={false}
                            maxDate={new Date()}
                          />
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <div>
                          <Button
                            onClick={() => setModalOpen(false)}
                            variant="contained"
                            className="btn-danger text-white bg-danger"
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={submit}
                            variant="contained"
                            color="primary"
                            className="text-white bg-primary"
                            style={{ marginLeft: 10 }}
                          >
                            Submit
                          </Button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  </Box>
                  <FilterLayout
                    getCdn={getCdn}
                    getContentPartner={getContentPartner}
                    getContentType={getContentType}
                    getLocation={getLocation}
                    getErrorCode={getErrorCode}
                    savePlatformData={savePlatformData}
                    cdnVal={cdnVal}
                    contentTypeVal={contentTypeVal}
                    contentPartnetVal={contentPartnetVal}
                    locationVal={locationVal}
                    errorCodeVal={errorCodeVal}
                    devicePlatform={devicePlatform}
                    contentPartner={contentPartner}
                    contentType={contentType}
                    location={location}
                    errorCode={errorCode}
                    iOSErrorCount={iOSErrorCount}
                    androidErrorCount={androidErrorCount}
                    webErrorCount={webErrorCount}
                    firestickCount={firestickCount}
                    updatePlatformData={updatePlatformData}
                  />
                </Stack>
              </div>
              <div className="take-screenshot">
                <AppliedFilters
                  attemptsData={[]}
                  videoStartFailuresData={[]}
                  exitBeforeVideoStartsData={[]}
                  succesfullPlaysData={[]}
                  startDate={startDate}
                  endDate={endDate}
                  removeDevicePlatform={removeDevicePlatform}
                  removeContentPartner={removeContentPartner}
                  removeContentType={removeContentType}
                  removeLocation={removeLocation}
                  removeErrorCode={removeErrorCode}
                  devicePlatform={devicePlatform}
                  updatePlatformData={updatePlatformData}
                  handleReload={handleReload}
                  contentPartner={contentPartner}
                  contentType={contentType}
                  location={location}
                  errorCode={errorCode}
                  selectVal={selectVal}
                  androidDataPoints={
                    devicePlatform?.includes("Android")
                      ? androidDataPoints
                      : [0]
                  }
                  iosDataPoints={
                    devicePlatform?.includes("iOS") ? iosDataPoints : [0]
                  }
                  chromeDataPoints={
                    devicePlatform?.includes("Web") ? chromeDataPoints : [0]
                  }
                  tvDataPoints={
                    devicePlatform?.includes("FireTV") ? tvDataPoints : [0]
                  }
                  firestickDataPoints={
                    devicePlatform?.includes("Firestick")
                      ? firestickDataPoints
                      : [0]
                  }
                  androidDataReport={androidErrorCount}
                  iosDataReport={iOSErrorCount}
                  firestickDataReport={firestickCount}
                  webDataReport={webErrorCount}
                  totalDataReport={
                    errorRecordData ? errorRecordData?.length : 0
                  }

                  // iOSErrorCount={iOSErrorCount}
                  // androidErrorCount={androidErrorCount}
                  // webErrorCount={webErrorCount}
                  // firestickCount={firestickCount}
                  // totalErrorCount={errorRecordData?.length}
                />
                <FullScreen handle={handle}>
                  <div
                    style={{
                      padding: "10px",
                      backgroundColor: "white",
                      height: "100%",
                    }}
                  >
                    {isLoadingData && <RctPageLoader />}
                    <ResponsiveContainer width={"100%"} height={300}>
                      <BarChart
                        data={chartData}
                        margin={{ left: 30, bottom: 20, top: 20 }}
                      >
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="date">
                          <Label
                            value={selectValBelowGraph}
                            position="bottom"
                            fontSize="12"
                            padding={{ top: 20, bottom: 20 }}
                          />
                        </XAxis>
                        <YAxis
                          label={{
                            value: "ERROR COUNT",
                            angle: -90,
                            position: "left",
                            fontSize: 12,
                          }}
                        />
                        <ToolTipChart style={{ zIndex: "1000 !important" }} />
                        <Legend />
                        <>{renderBarChartEnum()}</>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </FullScreen>
              </div>
            </Paper>
          </Box>
        </div>
      </div>

      <MUIDataTable
        title={`Total Errors ${tableData?.length ?? 0}`}
        columns={columns}
        data={tableData}
        options={options}
      />
    </>
  );
}

const columns = [
  {
    label: "UDID",
    name: "udid",
    options: {
      sort: true,
      display: "none",
    },
  },
  {
    label: "Hashed-RMN", //"UEID",chnages as per feedback
    name: "ueid",
    options: {
      sort: true,
      display: "none",
    },
  },

  {
    label: "PROVIDER",
    name: "provider",
    options: {
      customBodyRender: (data, row) => {
        return <p>{data ? data : "NA"}</p>;
      },
    },
  },
  {
    label: "PLATFORM",
    name: "platform",
    options: {
      customBodyRender: (data, row) => {
        return <p>{data ? data : "NA"}</p>;
      },
    },
  },
  {
    label: "VIDEO TITLE",
    name: "videoTitle",
    options: {
      customBodyRender: (data, row) => {
        return <p>{data ? data : "NA"}</p>;
      },
    },
  },
  {
    label: "VIDEO ID",
    name: "videoId",
    options: {
      customBodyRender: (data, row) => {
        return <p>{data ? data : "NA"}</p>;
      },
    },
  },
  {
    label: "LOCATION",
    name: "location",
    options: {
      customBodyRender: (data, row) => {
        return <p>{data ? data : "NA"}</p>;
      },
    },
  },
  {
    label: "DATE/TIME",
    name: "dts_es",
    options: {
      customBodyRender: (data, row) => {
        return <p>{data ? data : "NA"}</p>;
      },
    },
  },
  {
    label: "ERROR NAME",
    name: "ErrorName",
    options: {
      customBodyRender: (data, row) => {
        return (
          <p
            style={{
              width: "150px",
              "white-space": "nowrap",
              overflow: "hidden",
              "text-overflow": "ellipsis",
            }}
          >
            {data}
          </p>
        );
      },
      // display: colOrder.indexOf(0) >= 0 ? true : false,
      sort: true,
    },
  },
  {
    label: "ERROR CODE",
    name: "ErrorCode",
    options: {
      // display: colOrder.indexOf(0) >= 0 ? true : false,
      sort: true,
    },
  },
  {
    label: "ERROR DETAILS",
    name: "ErrorDetails",
    options: {
      // display: colOrder.indexOf(0) >= 0 ? true : false,
      sort: true,
    },
  },
];

const chartData = [
  {
    name: "06-12-22",
    ErosNow: 4000,
    Hoichoi: 2400,
    EpicOn: 2400,
  },
  {
    name: "07-12-22",
    ErosNow: 3000,
    Hotstar: 1398,
    Voot: 2210,
  },
];

// const contentParnter = ['Chaupal', 'DocuBay', 'EpicOn', 'ErosNow', 'PlanetMarathi', 'ShemarooMe', 'Hoichoi', 'Tatalay', 'Voot', 'VootSelect'];

var myArray = [
  { provider: "EpicOn", date: "01-12-2022" },

  { provider: "ErosNow", date: "01-12-2022" },

  { provider: "ErosNow", date: "01-12-2022" },

  { provider: "EpicOn", date: "02-12-2022" },

  { provider: "ErosNow", date: "02-12-2022" },

  { provider: "EpicOn", date: "02-12-2022" },
];

const colors = [
  "#82ca9d",
  "#8884d8",
  "#66f5ae",
  "#ff4d7d",
  "purple",
  "#ffd700",
  "#165806",
  "#abc8c2",
  "#bf5700",
  "#c12400",
  "#75B69B",
  "#caf1de",
  "#FFE7C7",
  "#F35F96",
  "#84BA1D",
  "#A92B30",
  "#D3A9B4",
  "#FFA200",
  "#FFFF00",
  "#FABC96",
  "#FAEFBE",
  "#EFA492",
  "#D998A3",
  "#EBBEC4",
  "#D8A2A9",
  "#445152",
  "#006B3E",
  "#FFA3A3",
  "#F8B3CB",
  "#674928",
];

const colorCodeWithPartner = {
  Chaupal: "#CD5C5C",
  Curiosity: "#ff4d4d",
  DocuBay: "#c56cf0",
  EpicOn: "#3ae374",
  ErosNow: "#67e6dc",
  Hoichoi: "#ef5777",
  Hungama: "#ff9f1a",
  NammaFlix: "#243763",
  PlanetMarathi: "#F56EB3",
  ShemarooMe: "#FB2576",
  VootKids: "#285430",
  VootSelect: "#E14D2A",
  qoe: "#82CD47",
  Manormamax: "#e28743",
  Tarangplus: "#BF360C",
  Shortstv: "#4A235A",
  Koode: "#7D6608",
  Reelsdrama: "#641E16 ",
  Lionsgate: "#641E12",
};

var grouped = myArray.reduce(function (obj, product) {
  obj[product.date] = obj[product.date] || [];

  obj[product.date].push(product.provider);

  return obj;
}, {});

//console.log(grouped)

var groups = Object.keys(grouped).map(function (key) {
  return {
    date: key,
    provider: grouped[key].reduce(function (obj, product, key) {
      obj[product] = obj[product] || [];

      obj[product].push(product);

      return obj;
    }, {}),
  };
});

let objp = {};

groups.map((item, index) => {
  Object.values(item.provider).map((item2, index2) => {
    objp[Object.keys(item.provider)[index2]] = Object.values(item.provider)[
      index2
    ].length;
  });

  let obj = {
    date: item.date,

    ...objp,
  };
});
