/*eslint react-hooks/exhaustive-deps: "off"*/
import * as React from "react";
import { useState, useEffect } from "react";
import { createFileName } from "use-react-screenshot";
import LineChartComponent from "./line-chart";
import AppliedFilters from "./AppliedFilters";
import domtoimage from "dom-to-image";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FilterLayout from "./FilterLayout";
import LeftMenu from "./LeftMenu";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import TextField from "@mui/material/TextField";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Tooltip } from "@material-ui/core";
import {
  getUserEngagementPage,
  getUniqueFilters,
  setMetricType,
  getFavoriteMetrics,
  setMetricTypeFullName,
} from "Store/Actions";
import { useDispatch, useSelector } from "react-redux";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import Button from "@mui/material/Button";
import exportFromJSON from "export-from-json";
import { NotificationManager } from "react-notifications";

const UserEngagementMetrics = () => {
  const dispatch = useDispatch();
  const realdata = useSelector((state) => state.qoeReducer);
  const metric_type = realdata?.metricType;
  const metric_type_fullname = realdata?.metricTypefulname;
  const favorite = realdata?.favoriteMetric;
  const cdnVal = realdata?.filters?.cdn;
  const contentTypeVal = realdata?.filters?.content_type;
  const contentPartnetVal = realdata?.filters?.content_partner;
  const locationVal = realdata?.filters?.location;
  const [metricsList, setMetricList] = useState([]);
  const [unit, setUnit] = useState("");
  const [isLoadingData, setisLoadingData] = React.useState(false);
  const [cdn, setCdn] = useState([]);
  const [contentType, setContentType] = useState([]);
  const [contentPartner, setContentPartner] = useState([]);
  const [location, setLocation] = useState([]);
  const [metric, setMetric] = useState(
    metric_type ? metric_type : "average_percentage_completion"
  );
  const [metricHeader, setMetricHeader] = useState(
    metric_type_fullname ? metric_type_fullname : "Average Percentage Completion"
  );
  const [aggregationInterval, setAggregationInterval] = useState("1h");
  const [devicePlatform, setDevicePlatform] = useState(["dummy"]);
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [toDate, setToDate] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );
  const [updatedGraphData, setUpdatedGraphData] = useState();
  const [metricGraphPoints, setMetricGraphPoints] = useState();
  const [allGraphPoints, setAllGraphPoints] = useState([]);
  const [androidGraphPoints, setAndroidGraphPoints] = useState([]);
  const [iosGraphPoints, setIosGraphPoints] = useState([]);
  const [chromeGraphPoints, setChromeGraphPoints] = useState([]);
  const [tvGraphPoints, setTvGraphPoints] = useState([]);
  const [firestickGraphPoints, setFirestickGraphPoints] = useState([]);
  const [androidDataPoints, setAndroidDataPoints] = useState();
  const [iosDataPoints, setIosDataPoints] = useState();
  const [chromeDataPoints, setChromeDataPoints] = useState();
  const [tvDataPoints, setTvDataPoints] = useState();
  const [firestickDataPoints, setFirestickDataPoints] = useState();
  const [graphPointsUpdated, setGraphPointsUpdated] = useState(true);
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
  const [tempLocation, setTempLocation] = useState([]);
  //f0r drop down-------------------
  const [androidDataReport, setAndroidDataReport] = useState();
  const [iosDataReport, setIosDataReport] = useState();
  const [webDataReport, setWebDataReport] = useState();
  const [firestickDataReport, setFirestickDataReport] = useState();
  const [totalDataReport, setTotalDataReport] = useState();
  //-----------------------------------
  const [AndroidSmartTvGraphPoints, setAndroidSmartTvGraphPoints] = useState([]);
  const [AndroidSmartTvDataPoints, setAndroidSmartTvDataPoints] = useState([]);
  const [AndroidSmartTvDataReport, setAndroidSmartTvDataReport] = useState([]);
//--------------------------------------------

  useEffect(() => {
    if (realdata) {
      setMetricList(realdata?.filters?.user_metrices_name);
    }
  }, [realdata?.filters?.user_metrices_name]);

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

    //reprt---data--------------
    setIosDataReport([]);
    setAndroidDataReport([]);
    setWebDataReport([]);
    setFirestickDataReport([]);
    setTotalDataReport([]);
    setAndroidSmartTvDataReport([])
    //------------------------------
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

  const removeLocation = (type) => {
    if (Array.isArray(type)) {
      setLocation([]);
    }
    else {
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
      // case "1min": {
      // 	fromDateRange = ts - 60;
      // 	setFromDate(fromDateRange);
      // 	return;
      // }
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

  const getLocationWithoutState = (val) => {
    let temparray = [];
    val.forEach((element) => {
      temparray.push(element.split("(")[0]);
    });
    return temparray;
  };

  useEffect(() => {
    if (realdata && realdata.userEngagementPageData) {
      setisLoadingData(false);
      setUpdatedGraphData(realdata.userEngagementPageData);
    }
  }, [realdata]);

  const fetchTheRequest = (
    cdn,
    contentType,
    contentPartner,
    location,
    metric,
    toDate,
    fromDate,
    aggregationInterval,
    devicePlatform
  ) => {
    setAndroidGraphPoints([]);
    setIosGraphPoints([]);
    setChromeGraphPoints([]);
    setAllGraphPoints([]);
    setTvGraphPoints([]);
    setFirestickGraphPoints([]);
    setAndroidSmartTvGraphPoints([])
    setisLoadingData(true);
    if (devicePlatform[0] === "dummy") {
      return null;
    }
    dispatch(
      getUserEngagementPage(
        dispatch,
        cdn,
        contentType,
        contentPartner,
        getLocationWithoutState(location), //  location,
        metric,
        toDate,
        fromDate,
        aggregationInterval,
        devicePlatform
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
      getLocationWithoutState(location), //  location,
      metric,
      startDate ? toDate : ts,
      endDate ? fromDate : fromDateInfo,
      aggregationInterval,
      devicePlatform
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
      getLocationWithoutState(location), //  location,
      metric,
      toDate,
      startDate && endDate ? fromDate : fromDateInfo,
      aggregationInterval,
      devicePlatform
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
  ]);

  useEffect(() => {
    if (updatedGraphData == undefined || Object.keys(updatedGraphData).length === 0) {
      return;
    }


    if (updatedGraphData) {
      //   setisLoadingData(true);
      let datas = [];
      let time = [];
      setGraphPointsUpdated(false);
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
            metric && metric.length !== 0
              ? updatedGraphData[0].all[metric]
              : updatedGraphData[0].all.total_minutes_watched;
          let timestampArr = updatedGraphData[0].all.time_stamp;
          setUnit(updatedGraphData[0].all.unit);
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
          if (devicePlatform.includes("Android")) {
            androidData = updatedGraphData.find((item) => item.Android);
            if (androidData) {
              let datas = [];
              let time = [];
              //report data platform wise
              let datasReport = 0;
              datasReport =
                metric && metric.length !== 0
                  ? androidData.Android["total_sum"]
                  : androidData.Android.total_sum;
              //report data platform wise

              datas =
                metric && metric.length !== 0
                  ? androidData.Android[metric]
                  : androidData.Android.total_minutes_watched;
              let timestampArr = androidData.Android.time_stamp;
              setUnit(androidData.Android.unit);
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
              setAndroidDataReport(datasReport)
            }
          }
          if (devicePlatform.includes("iOS")) {
            iosData = updatedGraphData.find((item) => item.iOS);
            if (iosData) {
              let datas = [];
              let time = [];
              //report data platform wise
              let datasReport = 0;
              datasReport =
                metric && metric.length !== 0
                  ? iosData.iOS["total_sum"]
                  : iosData.iOS.total_sum;
              //report data platform wise
              datas =
                metric && metric.length !== 0
                  ? iosData.iOS[metric]
                  : iosData.iOS.total_minutes_watched;
              let timestampArr = iosData.iOS.time_stamp;
              setUnit(iosData.iOS.unit);
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
              setIosDataReport(datasReport)
            }
          }
          if (devicePlatform.includes("Web")) {
            chromeData = updatedGraphData.find((item) => item.Web);
            if (chromeData) {
              let datas = [];
              let time = [];
              //report data platform wise
              let datasReport = 0;
              datasReport =
                metric && metric.length !== 0
                  ? chromeData.Web["total_sum"]
                  : chromeData.Web.total_sum;
              //report data platform wise
              datas =
                metric && metric.length !== 0
                  ? chromeData.Web[metric]
                  : chromeData.Web.total_minutes_watched;
              let timestampArr = chromeData.Web.time_stamp;
              setUnit(chromeData.Web.unit);
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
              setWebDataReport(datasReport)
            }
          }
          if (devicePlatform.includes("tv")) {
            tvData = updatedGraphData.find((item) => item.FireTV);
            if (tvData) {
              let datas = [];
              let time = [];
              datas =
                metric && metric.length !== 0
                  ? tvData.FireTV[metric]
                  : tvData.FireTV.rebuffering_percentage;
              let timestampArr = tvData.FireTV.time_stamp;
              setUnit(tvData.FireTV.unit);
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
            firestickData = updatedGraphData.find((item) => item.Firestick);
            if (firestickData) {
              let datas = [];
              let time = [];

              //report data platform wise
              let datasReport = 0;
              datasReport =
                metric && metric.length !== 0
                  ? firestickData.Firestick["total_sum"]
                  : firestickData.Firestick.total_sum;
              //report data platform wise
              datas =
                metric && metric.length !== 0
                  ? firestickData.Firestick[metric]
                  : firestickData.Firestick.rebuffering_percentage;
              let timestampArr = firestickData.Firestick.time_stamp;
              setUnit(firestickData.Firestick.unit);
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
              setFirestickDataReport(datasReport)
            }
          }
          if (devicePlatform.includes("AndroidSmartTv")) {
            AndroidSmartTvData = updatedGraphData.find((item) => item.AndroidSmartTv);
            if (AndroidSmartTvData) {
              let datas = [];
              let time = [];
              //report data platform wise
              let datasReport = 0;
              datasReport =
                metric && metric.length !== 0
                  ? AndroidSmartTvData.AndroidSmartTv["total_sum"]
                  : AndroidSmartTvData.AndroidSmartTv.total_sum;
              //report data platform wise

              datas =
                metric && metric.length !== 0
                  ? AndroidSmartTvData.AndroidSmartTv[metric]
                  : AndroidSmartTvData.AndroidSmartTv.total_minutes_watched;
              let timestampArr = AndroidSmartTvData.AndroidSmartTv.time_stamp;
              setUnit(AndroidSmartTvData.AndroidSmartTv.unit);
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
              setAndroidSmartTvDataReport(datasReport)
            }
          }

          try {
            let totalData = updatedGraphData.find((item) => item.all);
            //report data platform wise
            let datasReport = 0;
            datasReport =
              metric && metric.length !== 0
                ? totalData.all["total_sum"]
                : totalData.all.total_sum;
            setTotalDataReport(datasReport)
            //report data platform wise
          } catch (error) {

          }



        }
        setGraphPointsUpdated(true);
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
  }, []);

  useEffect(() => {
    if (!favorite) {
      dispatch(getFavoriteMetrics(dispatch));
    }
  }, []);

  useEffect(() => {
    return () => {
      dispatch(setMetricType(""));
      dispatch(setMetricTypeFullName(""));

    };
  }, []);

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
        getLocationWithoutState(location), //  location,
        metric,
        startDate ? toDate : ts,
        endDate ? fromDate : fromDateInfo,
        aggregationInterval,
        devicePlatform
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
  ]);

  const handle = useFullScreenHandle();

  // const gettitle = metric;
  // var settitle = gettitle.replace(/_/g, " ");
  const gettitle = metricHeader;
  var settitle = gettitle//.replace(/_/g, " ");

  let timeGraphDataPoints;
  let fullCombinationGraphPoints = [];
  fullCombinationGraphPoints.push(
    androidGraphPoints,
    iosGraphPoints,
    chromeGraphPoints,
    tvGraphPoints,
    firestickGraphPoints,
    AndroidSmartTvGraphPoints,
    allGraphPoints
  );
  const lengths = fullCombinationGraphPoints.map((a) => a.length);
  const index = lengths.indexOf(Math.max(...lengths));
  timeGraphDataPoints = fullCombinationGraphPoints[index];

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

  const searchMetricName = (e) => {
    const fullData = realdata?.filters?.user_metrices_name;
    if (e.target.value !== "") {
      const data = fullData.filter((a) =>
        a.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setMetricList(data);
    } else {
      setMetricList(fullData);
    }
  };

  const getExcelDownload = () => {
    const data = [];
    realdata.userEngagementPageData.map((aa) => {
      if (Object.keys(aa).includes("Android")) {
        return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === metric
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("iOS")) {
        return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === metric
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("Web")) {
        return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === metric
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("tv")) {
        return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === metric
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("Firestick")) {
        return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === metric
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("AndroidSmartTv")) {
        return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === metric
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
            [heading]: aa[Object.keys(aa)[0]][key][index],
            Unit: aa[Object.keys(aa)[0]].unit,
          });
        });
      } else if (Object.keys(aa).includes("all")) {
        return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
          let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
            (f) => f === metric
          );
          const heading = key.toString().replace(/_/g, " ");
          return data.push({
            Platform: Object.keys(aa)[0],
            Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
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
  const submit = () => {
    let diff = ((range[0].endDate - range[0].startDate) / (1000 * 60 * 60 * 24) + 1) % 365
    if (diff > 31) {
			NotificationManager.error("To-Date and From-Date Should be of 31 days of Gap", "", 2000)
			return;
		}
    setSelectVal(range[0])
    setXAxis("date");
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    setModalOpen(false);
    setToDate(Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0));
    setAggregationInterval("1d");
    setFromDate(Math.floor(range[0].startDate.getTime() / 1000.0));
  };

  const updateParentMetric = () => { };

  return (
    <>
      <div className='row'>
        <div className='col-md-3'>
          <Paper className='SidePanel'>
            <h3 className='left-menu-title'>USER ENGAGEMENT METRICS</h3>
            <div className='analysisHeaderRight search-insight-container'>
              <i className='zmdi zmdi-search'></i>
              <TextField
                onChange={searchMetricName}
                id='outlined-basic'
                className='search-insight'
                placeholder='Search...'
                variant='outlined'
                fullWidth
              />
            </div>
            {/* {!metricsListLoading && metricsList ? ( */}
            <LeftMenu
              updateMetricHeader={updateMetricHeader}
              updateParentMetric={updateParentMetric}
              favorite={favorite}
              leftMenuMetrics={metricsList}
              updateMetric={updateMetric}
            />
            {/* // ) : (
            //   <RctPageLoader />
            // )} */}
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
                        <MenuItem value='5min'>5 Minute</MenuItem>
                        <MenuItem value='1h'>1 Hour</MenuItem>
                        <MenuItem value='1d'>Day</MenuItem>
                        <MenuItem value='1w'>Week</MenuItem>
                        <MenuItem value='1m'>Month</MenuItem>
                        <MenuItem value='1y' disabled>Year</MenuItem>
                      </Select>
                    </FormControl>

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
                      <Box sx={{ mx: 2 }}> to </Box>
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
                    savePlatformData={savePlatformData}
                    cdnVal={cdnVal}
                    contentTypeVal={contentTypeVal}
                    contentPartnetVal={contentPartnetVal}
                    locationVal={locationVal}
                    devicePlatform={devicePlatform}
                    contentPartner={contentPartner}
                    contentType={contentType}
                    location={location}
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
                  contentPartner={contentPartner}
                  contentType={contentType}
                  location={location}
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
                  androidSmartTvDataPoints={
                    devicePlatform?.includes("AndroidSmartTv") ? AndroidSmartTvDataPoints : [0]
                  }
                  androidDataReport={androidDataReport}
                  iosDataReport={iosDataReport}
                  firestickDataReport={firestickDataReport}
                  webDataReport={webDataReport}
                  totalDataReport={totalDataReport}
                  androidSmartTvReport={AndroidSmartTvDataReport?AndroidSmartTvDataReport:0}

                />
                <FullScreen handle={handle}>
                  <div className='chartCont'>
                    {timeGraphDataPoints &&
                      graphPointsUpdated &&
                      !isLoadingData ? (
                      <LineChartComponent
                        selectVal={selectVal}
                        timeGraphPoints={timeGraphDataPoints}
                        metricGraphPoints={
                          metricGraphPoints ? metricGraphPoints : []
                        }
                        androidDataPoints={androidDataPoints}
                        iosDataPoints={iosDataPoints}
                        chromeDataPoints={chromeDataPoints}
                        tvDataPoints={tvDataPoints}
                        firestickDataPoints={firestickDataPoints}
                        graphPointsUpdated={graphPointsUpdated}
                        isLoadingData={isLoadingData}
                        settitle={settitle}
                        unit={unit}
                        devicePlatform={devicePlatform}
                        androidSmartTvDataPoints={AndroidSmartTvDataPoints}
                      />
                    ) : (
                      <RctPageLoader />
                    )}
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

export default UserEngagementMetrics;
