/*eslint react-hooks/exhaustive-deps: "off"*/
import * as React from "react";
import { useState, useEffect } from "react";
import { createFileName } from "use-react-screenshot";
import AppliedFilters from "Components/QualityExperience/AppliedFilters";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FilterLayout from "Components/QualityExperience/FilterLayout";
import LeftMenu from "Components/QualityExperience/LeftMenu";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import TextField from "@mui/material/TextField";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  getFavoriteMetrics,
  getMitigationAnalyticsPage,
  getUniqueFilters,
  setMetricType,
  setMetricTypeFullName,
} from "Store/Actions";
import { useDispatch, useSelector } from "react-redux";
import domtoimage from "dom-to-image";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Button from "@mui/material/Button";
// import exportFromJSON from 'export-from-json'
import Histogram from "./Histogram";
import exportFromJSON from "export-from-json";
import { Tooltip } from "@material-ui/core";
import { array } from "@amcharts/amcharts4/core";

const Analytics = () => {
  const dispatch = useDispatch();
  const realdata = useSelector((state) => state.qoeReducer);
  const metric_type = realdata?.metricType;
  const metric_type_fullname = realdata?.metricTypefulname;
  const favorite = realdata?.favoriteMetric;
  const cdnVal = realdata?.filters?.cdn;
  const contentTypeVal = realdata?.filters?.content_type;
  const contentPartnetVal = realdata?.filters?.content_partner;
  const locationVal = realdata?.filters?.location;
  const [unit, setUnit] = useState("");
  const [isLoadingData, setisLoadingData] = useState(false);
  const [cdn, setCdn] = useState([]);
  const [contentType, setContentType] = useState([]);
  const [contentPartner, setContentPartner] = useState([]);
  const [location, setLocation] = useState([]);
  const [metric, setMetric] = useState(
    metric_type ? metric_type : "number_of_mitigations_applied"
  );
  const [metricHeader, setMetricHeader] = useState(
    metric_type_fullname ? metric_type_fullname : "Number Of Mitigations Applied"
  );
  const [metricsList, setMetricList] = useState([]);
  const [aggregationInterval, setAggregationInterval] = useState("1h");
  const [devicePlatform, setDevicePlatform] = useState(["dummy"]);
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
  const [AndroidSmartTvDataPoints, setAndroidSmartTvDataPoints] = useState();
  const [AndroidSmartTvGraphPoints, setAndroidSmartTvGraphPoints] = useState([]);

  const [iosDataPoints, setIosDataPoints] = useState();
  const [chromeDataPoints, setChromeDataPoints] = useState();
  const [tvDataPoints, setTvDataPoints] = useState();
  const [firestickDataPoints, setFirestickDataPoints] = useState();
  const [selectVal, setSelectVal] = useState("1d");
  const [xAxis, setXAxis] = useState("hour");
  const [metricsListLoading, setisMetricsListLoading] = useState(false);
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
  const [refresh, setRefresh] = useState(10);
  const [sourceD, setSourceData] = useState([]);
  useEffect(() => {
    if (realdata?.device_platform.length > 0) {
      setDevicePlatform(realdata?.device_platform);
    }
  }, [realdata?.device_platform]);

  useEffect(() => {
    setMetricList([
      "Number of Mitigation Applied",
      "Improvement in UEI",
      "Degradation in UEI",
      "Average Startup Buffer Length",
      "Average Rebuffering Buffer Length",
    ]);
  }, []);

  const getReportValue = (reportData,totalLength) => {
    if(metric.includes("average") && reportData){
      return Number(reportData/totalLength)
    }else{
      return reportData
    }
    
  };

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


  const getSourceData = (val) => {
    setSourceData(val);
  };
  // useEffect(() => {
  //   setSourceData(sourceD);
  // }, [sourceD]);

  const getLocationWithoutState = (val) => {
    let temparray = [];
    val.forEach((element) => {
      temparray.push(element.split("(")[0]);
    });
    return temparray;
  };
  const updateMetricHeader = (data) => {
    setMetricHeader(data)
  }
  const updateMetric = (metricName) => {
    setXAxis("hour");
    setDevicePlatform(realdata?.device_platform);
    setMetric(metricName);
    setStartDate();
    setEndDate();
    setRange([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: "selection",
      },
    ]);
    setFromDate(Math.floor(new Date().getTime() / 1000.0) - 24 * 3600);
    setToDate(Math.floor(new Date().getTime() / 1000.0));
    setAggregationInterval("1h")
    setRefresh(10)
    setSelectVal('1d')
    setIosDataPoints([])
    setAndroidDataPoints([])
    setChromeDataPoints([])
    setFirestickDataPoints([])
    setTvDataPoints([])
    setAndroidSmartTvDataPoints([])
  };

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

  const removeSourceData = (type) => {
    if(type && typeof type =='string'){
      const data = sourceD;
      const final = data.filter((d) => d !== type);
      setSourceData(final);
    }else{
      setSourceData([]);
    }

  };

  const removeContentType = (type) => {
    const dataType = contentType;
    const final = dataType.filter((d) => d !== type);
    setContentType(final);
  };

  const removeLocation = (type) => {
    if(Array.isArray(type)){
      setLocation([]);
    }
    else{
      const dataType = location;
      const final = dataType.filter((d) => d !== type);
      setLocation(final);
    }
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
  const changeRefresh = (e) => {
    setRefresh(e.target.value);
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
        return;
      }
      case "5min": {
        aggrInterval = "10s";
        setAggregationInterval(aggrInterval);
        setXAxis("sec");
        calculateDateRange("5min");
        return;
      }
      case "1h": {
        aggrInterval = "1m";
        setAggregationInterval(aggrInterval);
        setXAxis("hour");
        calculateDateRange("1h");
        return;
      }
      case "1d": {
        aggrInterval = "1h";
        setAggregationInterval(aggrInterval);
        setXAxis("hour");
        calculateDateRange("1d");
        return;
      }
      case "1w": {
        aggrInterval = "1d";
        setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("1w");
        return;
      }
      case "1m": {
        aggrInterval = "2d";
        setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("1m");
        return;
      }
      case "1y": {
        aggrInterval = "30d";
        setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("1y");
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

  useEffect(() => {
    if (realdata && realdata.mitigationAnalysis) {
      setisLoadingData(false);
      setUpdatedGraphData(realdata.mitigationAnalysis);
    }
  }, [realdata.mitigationAnalysis]);

  const fetchTheRequest = (
    cdn,
    contentType,
    contentPartner,
    location,
    metric,
    toDate,
    fromDate,
    aggregationInterval,
    devicePlatform,
    sourceD
  ) => {
    setAndroidGraphPoints([]);
    setAndroidDataPoints([]);
    setIosGraphPoints([]);
    setIosDataPoints([]);
    setChromeGraphPoints([]);
    setChromeDataPoints([]);
    setAllGraphPoints([]);
    setMetricGraphPoints([]);
    setTvGraphPoints([]);
    setTvDataPoints([]);
    setFirestickGraphPoints([]);
    setFirestickDataPoints([]);
    setAndroidSmartTvDataPoints([])
    setAndroidSmartTvGraphPoints([])
    setisLoadingData(true);
    if (devicePlatform[0] === "dummy") {
      return null;
    }
    dispatch(
      getMitigationAnalyticsPage(
        dispatch,
        cdn,
        contentType,
        contentPartner,
        getLocationWithoutState(location), //  location,,
        metric,
        toDate,
        fromDate,
        aggregationInterval,
        devicePlatform,
        sourceD
      )
    );
  };

  const handleReload = () => {
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
    fetchTheRequest(
      cdn,
      contentType,
      contentPartner,
      getLocationWithoutState(location), //  location,,
      metric,
      startDate ? toDate : ts,
      endDate ? fromDate : fromDateInfo,
      aggregationInterval,
      devicePlatform,
      sourceD
    );
  };

  useEffect(() => {
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
    fetchTheRequest(
      cdn,
      contentType,
      contentPartner,
      getLocationWithoutState(location), //  location,,
      metric,
      toDate,
      startDate && endDate?fromDate:fromDateInfo,
      aggregationInterval,
      devicePlatform,
      sourceD
    );
  }, [
    cdn,
    contentType,
    contentPartner,
    location,
    metric,
    toDate,
    fromDate,
    aggregationInterval,
    devicePlatform,
    sourceD
  ]);

  useEffect(() => {
    if (updatedGraphData) {
      //   setisLoadingData(true);
      let datas = [];
      let time = [];
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      if (devicePlatform) {
        if (devicePlatform.length === 0) {
          datas =
            updatedGraphData.length > 0
              ? metric && metric.length !== 0
                ? updatedGraphData[0].all[metric]
                : updatedGraphData[0].all.rebuffering_percentage
              : [];
          let timestampArr =
            updatedGraphData.length > 0 && updatedGraphData[0].all.TimeStamp;
          setUnit(
            updatedGraphData.length > 0 ? updatedGraphData[0].all.unit : ""
          );
          for (let i = 0; i < timestampArr.length; i++) {
            if (xAxis === "hour")
              time.push(
                monthNames[new Date(timestampArr[i]).getMonth()] +
                  " " +
                  new Date(timestampArr[i]).getDate() +
                  "," +
                  moment(timestampArr[i]).format("hh:mm")
              );
            else if (xAxis === "date")
              time.push(
                monthNames[new Date(timestampArr[i]).getMonth()] +
                  " " +
                  new Date(timestampArr[i]).getDate()
              );
            else if (xAxis === "sec")
              time.push(
                monthNames[new Date(timestampArr[i]).getMonth()] +
                  " " +
                  new Date(timestampArr[i]).getDate() +
                  "," +
                  new Date(timestampArr[i]).getHours() +
                  ":" +
                  new Date(timestampArr[i]).getMinutes() +
                  ":" +
                  new Date(timestampArr[i]).getSeconds()
              );
          }
          setAllGraphPoints(time);
          setMetricGraphPoints(datas);
        } else {
          let androidData;
          let iosData;
          let chromeData;
          let tvData;
          let firestickData;
          let AndroidSmartTvData;
          if (updatedGraphData.message == "Internal server error.") {
            return;
          }
          if (devicePlatform.includes("Android")) {
            androidData = updatedGraphData?.find((item) => item.android);
            if (androidData) {
              let datas = [];
              let time = [];
              datas =
                metric && metric.length !== 0
                  ? androidData.android[metric]
                  : androidData.android.rebuffering_percentage;

              let timestampArr = androidData.android.TimeStamp;
              setUnit(androidData.android.unit);
              for (let i = 0; i < timestampArr.length; i++) {
                if (xAxis === "hour")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      moment(timestampArr[i]).format("hh:mm")
                  );
                else if (xAxis === "date")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate()
                  );
                else if (xAxis === "sec")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      new Date(timestampArr[i]).getHours() +
                      ":" +
                      new Date(timestampArr[i]).getMinutes() +
                      ":" +
                      new Date(timestampArr[i]).getSeconds()
                  );
              }

              setAndroidGraphPoints(time);
              setAndroidDataPoints(datas);
            }
          }
          if (devicePlatform.includes("iOS")) {
            iosData = updatedGraphData?.find((item) => item.ios);
            if (iosData) {
              let datas = [];
              let time = [];
              datas =
                metric && metric.length !== 0
                  ? iosData.ios[metric]
                  : iosData.ios.rebuffering_percentage;
              let timestampArr = iosData.ios.TimeStamp;
              setUnit(iosData.ios.unit);
              for (let i = 0; i < timestampArr.length; i++) {
                if (xAxis === "hour")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      moment(timestampArr[i]).format("hh:mm")
                  );
                else if (xAxis === "date")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate()
                  );
                else if (xAxis === "sec")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      new Date(timestampArr[i]).getHours() +
                      ":" +
                      new Date(timestampArr[i]).getMinutes() +
                      ":" +
                      new Date(timestampArr[i]).getSeconds()
                  );
              }
              setIosGraphPoints(time);
              setIosDataPoints(datas);
            }
          }
          if (devicePlatform.includes("Web")) {
            chromeData = updatedGraphData?.find((item) => item.web);
            if (chromeData) {
              let datas = [];
              let time = [];
              datas =
                metric && metric.length !== 0
                  ? chromeData.web[metric]
                  : chromeData.web.rebuffering_percentage;
              let timestampArr = chromeData.web.TimeStamp;
              setUnit(chromeData.web.unit);
              for (let i = 0; i < timestampArr.length; i++) {
                if (xAxis === "hour")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      moment(timestampArr[i]).format("hh:mm")
                  );
                else if (xAxis === "date")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate()
                  );
                else if (xAxis === "sec")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      new Date(timestampArr[i]).getHours() +
                      ":" +
                      new Date(timestampArr[i]).getMinutes() +
                      ":" +
                      new Date(timestampArr[i]).getSeconds()
                  );
              }
              setChromeGraphPoints(time);
              setChromeDataPoints(datas);
            }
          }
          if (devicePlatform.includes("FireTV")) {
            tvData = updatedGraphData?.find((item) => item.tv);
            if (tvData) {
              let datas = [];
              let time = [];
              datas =
                metric && metric.length !== 0
                  ? tvData.tv[metric]
                  : tvData.tv.rebuffering_percentage;
              let timestampArr = tvData.tv.TimeStamp;
              setUnit(tvData.tv.unit);
              for (let i = 0; i < timestampArr.length; i++) {
                if (xAxis === "hour")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      moment(timestampArr[i]).format("hh:mm")
                  );
                else if (xAxis === "date")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate()
                  );
                else if (xAxis === "sec")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      new Date(timestampArr[i]).getHours() +
                      ":" +
                      new Date(timestampArr[i]).getMinutes() +
                      ":" +
                      new Date(timestampArr[i]).getSeconds()
                  );
              }
              setTvGraphPoints(time);
              setTvDataPoints(datas);
            }
          }
          if (devicePlatform.includes("Firestick")) {
            firestickData = updatedGraphData?.find((item) => item.firestick);
            if (firestickData) {
              let datas = [];
              let time = [];
              datas =
                metric && metric.length !== 0
                  ? firestickData.firestick[metric]
                  : firestickData.firestick.rebuffering_percentage;
              let timestampArr = firestickData.firestick.TimeStamp;
              setUnit(firestickData.firestick.unit);
              for (let i = 0; i < timestampArr.length; i++) {
                if (xAxis === "hour")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      moment(timestampArr[i]).format("hh:mm")
                  );
                else if (xAxis === "date")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate()
                  );
                else if (xAxis === "sec")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      new Date(timestampArr[i]).getHours() +
                      ":" +
                      new Date(timestampArr[i]).getMinutes() +
                      ":" +
                      new Date(timestampArr[i]).getSeconds()
                  );
              }
              setFirestickGraphPoints(time);
              setFirestickDataPoints(datas);
            }
          }
          if (devicePlatform.includes("AndroidSmartTv")) {
            AndroidSmartTvData = updatedGraphData?.find((item) => item.androidsmarttv);
            if (AndroidSmartTvData) {
              let datas = [];
              let time = [];
              datas =
                metric && metric.length !== 0
                  ? AndroidSmartTvData.androidsmarttv[metric]
                  : AndroidSmartTvData.androidsmarttv.rebuffering_percentage;
              let timestampArr = AndroidSmartTvData.androidsmarttv.TimeStamp;
              setUnit(AndroidSmartTvData.androidsmarttv.unit);
              for (let i = 0; i < timestampArr.length; i++) {
                if (xAxis === "hour")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      moment(timestampArr[i]).format("hh:mm")
                  );
                else if (xAxis === "date")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate()
                  );
                else if (xAxis === "sec")
                  time.push(
                    monthNames[new Date(timestampArr[i]).getMonth()] +
                      " " +
                      new Date(timestampArr[i]).getDate() +
                      "," +
                      new Date(timestampArr[i]).getHours() +
                      ":" +
                      new Date(timestampArr[i]).getMinutes() +
                      ":" +
                      new Date(timestampArr[i]).getSeconds()
                  );
              }
              setAndroidSmartTvGraphPoints(time);
              setAndroidSmartTvDataPoints(datas);
            }
          }
          
        }
      }
    }
  }, [updatedGraphData]);

  useEffect(() => {
    const isEmpty = Object.keys(realdata?.filters).length === 0;
    if (isEmpty) {
      setisMetricsListLoading(true);
      dispatch(getUniqueFilters(dispatch));
      setisMetricsListLoading(false);
    }
  }, [dispatch, realdata?.filters]);

  useEffect(() => {
    if (!favorite) {
      dispatch(getFavoriteMetrics(dispatch));
    }
  }, [dispatch]);

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
          `${metric}-${moment().format("DD/MM/YYYY")}`
        );
        a.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  useEffect(() => {
    return () => {
      dispatch(setMetricType(""));
      dispatch(setMetricTypeFullName(""));
    };
  }, [dispatch]);

  useEffect(() => {
    const interval = setInterval(() => {
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
        fetchTheRequest(
          cdn,
          contentType,
          contentPartner,
          getLocationWithoutState(location), //  location,,
          metric,
          startDate ? toDate : ts,
          endDate ? fromDate : fromDateInfo,
          aggregationInterval,
          devicePlatform,
          sourceD
        );
    }, refresh * 1000);
    return () => clearInterval(interval);
  }, [
    refresh,
    cdn,
    contentType,
    contentPartner,
    location,
    metric,
    toDate,
    fromDate,
    aggregationInterval,
    devicePlatform,
    sourceD
  ]);

  const handle = useFullScreenHandle();

  let timeGraphDataPoints;
  let fullCombinationGraphPoints = [];
  fullCombinationGraphPoints.push(
    androidGraphPoints,
    iosGraphPoints,
    chromeGraphPoints,
    tvGraphPoints,
    firestickGraphPoints,
    allGraphPoints,
    AndroidSmartTvGraphPoints
  );
  const lengths = fullCombinationGraphPoints.map((a) => a.length);
  const index = lengths.indexOf(Math.max(...lengths));
  timeGraphDataPoints = fullCombinationGraphPoints[index];
  const submit = () => {
    // setSelectVal('')
    setXAxis("date");
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    setModalOpen(false);
    setToDate(
      Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
    );
    setAggregationInterval("1d");
   // setFromDate(Math.floor(range[0].startDate.getTime() / 1000.0));
    // setFromDate(Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0));

    if (Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0) == Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0)) {
      setFromDate(Math.floor((moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0) - (24 * 3600) + 60))

    } else {
      setFromDate(Math.floor((moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0) - (24 * 3600) + 60))
    }
  };

  const getExcelDownload = () => {
    const data = [];
    realdata.mitigationAnalysis.map((aa) => {
      if (Object.keys(aa).includes("android")) {
        return aa[Object.keys(aa)[0]].TimeStamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === gettitle
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].TimeStamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("ios")) {
        return aa[Object.keys(aa)[0]].TimeStamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === gettitle
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].TimeStamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("web")) {
        return aa[Object.keys(aa)[0]].TimeStamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === gettitle
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].TimeStamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("tv")) {
        return aa[Object.keys(aa)[0]].TimeStamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === gettitle
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].TimeStamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("firestick")) {
        return aa[Object.keys(aa)[0]].TimeStamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === gettitle
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].TimeStamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("androidsmarttv")) {
        return aa[Object.keys(aa)[0]].TimeStamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === gettitle
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].TimeStamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("all")) {
        return aa[Object.keys(aa)[0]].TimeStamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === gettitle
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].TimeStamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else {
        return null;
      }
    });
    const fileName = createFileName(
      "csv",
      `${metric}-${moment().format("DD/MM/YYYY")}`
    );
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };
  const gettitle = metric;
  return (
    <>
      <div className='row'>
        <div className='col-md-3'>
          <Paper className='SidePanel'>
            <h3 className='left-menu-title'>MITIGATION ANALYSIS</h3>
            {/* <div className='analysisHeaderRight search-insight-container'>
						<i className="zmdi zmdi-search"></i>
						<TextField onChange={searchMetricName} id="outlined-basic" className="search-insight" placeholder="Search..." variant="outlined" fullWidth />
					</div> */}
            {/* {!metricsListLoading && metricsList ? ( */}
              <LeftMenu
                updateMetricHeader={updateMetricHeader}
                favorite={favorite}
                leftMenuMetrics={metricsList}
                updateMetric={updateMetric}
              />
            {/* ) : (
              <RctPageLoader />
            )} */}
          </Paper>
        </div>
        <div className='col-md-9 right-insight'>
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Paper>
              <div className='graphcontentHead'>
                <span
                  style={{
                    fontSize: "18px",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {metricHeader}
                </span>
                <Stack direction='row' spacing={1} sx={{ float: "right" }}>
                  <IconButton
                    color='primary'
                    aria-label='screenshot'
                    onClick={getImage}
                  >
                     <Tooltip title="Take screenshot" placement="bottom">
                    <CameraAltOutlinedIcon color='disabled' />
                    </Tooltip>
                  </IconButton>
                  <IconButton
                    color='secondary'
                    aria-label='download'
                    onClick={getExcelDownload}
                  >
                     <Tooltip title="Download File" placement="bottom">
                    <FileDownloadOutlinedIcon color='disabled' />
                    </Tooltip>
                  </IconButton>
                  <IconButton aria-label='fullscreen' onClick={handle.enter}>
                  <Tooltip title="Full Screen" placement="bottom">
                    <FullscreenOutlinedIcon color='disabled' />
                    </Tooltip>
                  </IconButton>
                  <Box className='dropdownCont'>
                    <div className='interval-spase'>
                      <FormControl fullWidth className='intervalSelect'>
                        <InputLabel id='intervalSelect'>Interval</InputLabel>
                        <Select
                          labelId='intervalSelect'
                          id='demo-simple-select'
                          value={refresh}
                          label='Interval'
                          onChange={changeRefresh}
                          className='interSelect'
                        >
                          <MenuItem value={10}>10s</MenuItem>
                          <MenuItem value={20}>20s</MenuItem>
                          <MenuItem value={30}>30s</MenuItem>
                          <MenuItem value={40}>40s</MenuItem>
                          <MenuItem value={50}>50s</MenuItem>
                        </Select>
                      </FormControl>

                      <FormControl fullWidth className='intervalSelect'>
                        <InputLabel id='intervalSelect'>Interval</InputLabel>
                        <Select
                          labelId='intervalSelect'
                          id='demo-simple-select'
                          value={selectVal}
                          label='Interval'
                          onChange={setDataRange}
                          className='interSelect'
                        >
                          {/* <MenuItem value='5min'>5 Minute</MenuItem> */}
                          <MenuItem value='1h'>1 Hour</MenuItem>
                          <MenuItem value='1d'>Day</MenuItem>
                          <MenuItem value='1w'>Week</MenuItem>
                          <MenuItem value='1m'>Month</MenuItem>
                          <MenuItem value='1y'>Year</MenuItem>
                        </Select>
                      </FormControl>
                    </div>
                    <div className='dateCont'>
                      <span>Custom Date</span>
                      <TextField
                        onClick={() => setModalOpen(true)}
                        contentEditable={false}
                        value={
                          startDate
                            ? moment(startDate).format("DD/MM/YYYY")
                            : ""
                        }
                        placeholder='dd-mm-yyyy'
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
                        placeholder='dd-mm-yyyy'
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
                            variant='contained'
                            className='btn-danger text-white bg-danger'
                            
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={submit}
                            variant='contained'
                            color='primary'
                            className='text-white bg-primary'
                            style={{ marginLeft: 10 }}
                          >
                            Submit
                          </Button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  </Box>
                  <FilterLayout
                    metric={metric}
                    getCdn={getCdn}
                    getContentPartner={getContentPartner}
                    getContentType={getContentType}
                    getLocation={getLocation}
                    getSourceData={getSourceData}
                    savePlatformData={savePlatformData}
                    cdnVal={cdnVal}
                    contentTypeVal={contentTypeVal}
                    contentPartnetVal={contentPartnetVal}
                    locationVal={locationVal}
                    devicePlatform={devicePlatform}
                    contentPartner={contentPartner}
                    contentType={contentType}
                    location={location}
                    sourceData={sourceD}
                    updatePlatformData={updatePlatformData}
                  />
                </Stack>
              </div>
              <div className='take-screenshot'>
                <AppliedFilters
                  attemptsData={[]}
                  videoStartFailuresData={[]}
                  exitBeforeVideoStartsData={[]}
                  succesfullPlaysData={[]}
                  startDate={startDate}
                  endDate={endDate}
                  metric={metric}
                  removeDevicePlatform={removeDevicePlatform}
                  removeContentPartner={removeContentPartner}
                  removeContentType={removeContentType}
                  removeLocation={removeLocation}
                  devicePlatform={devicePlatform}
                  updatePlatformData={updatePlatformData}
                  handleReload={handleReload}
                  removeSource={removeSourceData}
                  contentPartner={contentPartner}
                  contentType={contentType}
                  location={location}
                  selectVal={selectVal}
                  sourceData={sourceD}
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
                  androidSmartTvDataPoints={
                    devicePlatform?.includes("AndroidSmartTv")
                      ? AndroidSmartTvDataPoints
                      : [0]
                  }
                  androidDataReport= {androidDataPoints ? getReportValue(androidDataPoints?.reduce((partialSum, a) => partialSum + a, 0),androidDataPoints.length):0}
                  iosDataReport={iosDataPoints ? getReportValue(iosDataPoints?.reduce((partialSum, a) => partialSum + a, 0),iosDataPoints.length) : 0}
                  firestickDataReport={firestickDataPoints ? getReportValue(firestickDataPoints?.reduce((partialSum, a) => partialSum + a, 0),firestickDataPoints.length):0}
                  webDataReport={chromeDataPoints ? getReportValue(chromeDataPoints?.reduce((partialSum, a) => partialSum + a, 0),chromeDataPoints.length):0}
                  androidSmartTvReport={AndroidSmartTvDataPoints ? getReportValue(AndroidSmartTvDataPoints?.reduce((partialSum, a) => partialSum + a, 0),AndroidSmartTvDataPoints.length):0}
                  totalDataReport={
                    (androidDataPoints ? getReportValue(androidDataPoints?.reduce((partialSum, a) => partialSum + a, 0),androidDataPoints.length):0)
                    +(iosDataPoints ?  getReportValue(iosDataPoints?.reduce((partialSum, a) => partialSum + a, 0),iosDataPoints.length) : 0)
                    +(firestickDataPoints ? getReportValue(firestickDataPoints?.reduce((partialSum, a) => partialSum + a, 0),firestickDataPoints.length):0)
                    +(chromeDataPoints ? getReportValue(chromeDataPoints?.reduce((partialSum, a) => partialSum + a, 0),chromeDataPoints.length):0)
                    +(AndroidSmartTvDataPoints ? getReportValue(AndroidSmartTvDataPoints?.reduce((partialSum, a) => partialSum + a, 0),AndroidSmartTvDataPoints.length):0)
                  }

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
                    <Histogram
                      devicePlatform={devicePlatform}
                      timeGraphDataPoints={timeGraphDataPoints}
                      androidDataPoints={androidDataPoints}
                      iosDataPoints={iosDataPoints}
                      chromeDataPoints={chromeDataPoints}
                      tvDataPoints={tvDataPoints}
                      firestickDataPoints={firestickDataPoints}
                      AndroidSmartTvDataPoints={AndroidSmartTvDataPoints}
                      metricGraphPoints={metricGraphPoints}
                      unit={unit}
                    />
                  </div>
                </FullScreen>
              </div>
            </Paper>
          </Box>
        </div>
      </div>
    </>
  );
};

export default Analytics;
