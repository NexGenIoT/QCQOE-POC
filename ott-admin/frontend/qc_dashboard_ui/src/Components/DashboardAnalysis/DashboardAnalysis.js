/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useState, useEffect } from "react";
import {
  TextField,
  MenuItem,
  IconButton,
  ButtonGroup,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@material-ui/core";
import DownloadIcon from "@mui/icons-material/Download";
import StackedAreaChart from "./StackedAreaChart";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
//import { getUniqueFilters, getWidgetDataRequest } from 'Store/Actions';
import {
  checkVideoFailure,
  getAttempts,
  getAverageBitRate,
  getAverageFramrate,
  getAveragePercentCompletion,
  getBandwith,
  getConcurrentPlays,
  getConnectionInducedRebufferingRatio,
  getEndedPlay,
  getEndedPlaysPerUniqueDevice,
  getExitBeforeVideoStart,
  getMinutesPerUniqueDevices,
  getRebufferingPercentage,
  getRebufferingRatio,
  getRenderingQuality,
  getTotalMinutesWatched,
  getUniqueDevices,
  getUniqueFilters,
  getUniqueViewers,
  getUserAttrition,
  getVideoFailures,
  getVideoPlaysAndFailure,
  getVideoRestartTime,
  getVideoStartTime,
  getWidgetDataRequest,
  successfullPlays,
} from "Store/Actions";

import { useDispatch, useSelector } from "react-redux";
import domtoimage from "dom-to-image";
import { createFileName } from "use-react-screenshot";
import { formatTime } from "Constants/constant";
import metricsJsonData from "../../Routes/qoe/dashboard/matric.json";
import axios from "axios";

const allMatrics = [
  {
    value: "sort",
    label: "All",
  },
  {
    value: "realtime",
    label: "Real-Time Key Insights",
  },
  {
    value: "userengagement",
    label: "User Engagement Metrics",
  },
  {
    value: "qualityexperience",
    label: "Quality Of Experience",
  },
];

function DashboardAnalysis(props) {
  const dispatch = useDispatch();
  const realdata = useSelector((state) => state.qoeReducer);
  const [yesterdayData, setYesterdayData] = useState([]);
  const [backupYesterdayData, setBackupYesterdayData] = useState([]);
  const [selectedDevices, setSelectedDevices] = useState("All");
  const [selectedDates, setSelectedDates] = useState("24hr");
  const [current, setCurrent] = useState("1d");
  const [last, setLast] = useState("7d");
  const [yesterdayDate, setYesterdayDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 48 * 3600
  );
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [loading, isLoading] = useState(false);
  const [sortMatrics, setSortMatrics] = useState("sort");
  const [filterMetric, setFilterMetric] = useState("sort");
  const [searchText, setSearchText] = useState("");
  const [analysisBtn, setanalysisBtn] = useState(false);
  const [dashboardAnalysisCharData, setDashboardAnalysisCharData] = useState(
    []
  );
  const [agrr, setAgr] = useState("1h");
  const [dashboardLoader, setDashboardLoader] = useState(false);

  let toDate = Math.floor(new Date().getTime() / 1000.0);
  let baseURL = "http://3.6.164.157:8080/"; //"https://qc7.qoeqoe.com/"//"https://qoe.qoetech.com:8005/"--replica of dev//"https://qc7.qoeqoe.com/"//"https://qcotp.qoetech.com:4444/"//"http://3.108.121.176:5002/" --prev//
  let widgetArray = [];

  const handleChange = (event) => {
    setSortMatrics(event.target.value);
    if (event.target.value === "realtime") {
      setFilterMetric(event.target.value);
    } else if (event.target.value === "userengagement") {
      setFilterMetric(event.target.value);
    } else if (event.target.value === "qualityexperience") {
      setFilterMetric(event.target.value);
    } else {
      setFilterMetric(event.target.value);
    }
  };

  const updateDate = (val) => {
    setDashboardLoader(true);
    setFilterMetric("sort");
    setSortMatrics("sort");
    setSearchText("");
    setSelectedDates(val);
    setanalysisBtn(true);
    setTimeout(() => {
      setDashboardLoader(false);
    }, 5000);
    switch (val) {
      case "Yearly": {
        setCurrent("365d");
        setLast("730d");
        let currentDate = Math.floor(new Date().getTime() / 1000.0);
        let fromDate =
          Math.floor(new Date().getTime() / 1000.0) - 12 * 30 * 24 * 3600;
        let yesterdayDate =
          Math.floor(new Date().getTime() / 1000.0) - 24 * 30 * 24 * 3600;
        setYesterdayDate(yesterdayDate);
        setFromDate(fromDate);
        setAgr("30d");
        if (selectedDevices !== "All") {
          setMetricesDevicesData(
            selectedDevices,
            "365d",
            "730d",
            fromDate,
            yesterdayDate,
            true
          );
          commonApiMetrices(
            selectedDevices,
            true,
            "30d",
            currentDate,
            fromDate
          );
        } else {
          setTimeMetricesData("365d", "730d", fromDate, yesterdayDate, true);
          commonApiMetrices("", true, "30d", currentDate, fromDate);
        }
        return;
      }

      case "Monthly": {
        setCurrent("30d");
        setLast("60d");
        let currentDate = Math.floor(new Date().getTime() / 1000.0);
        let fromDate =
          Math.floor(new Date().getTime() / 1000.0) - 30 * 24 * 3600;
        let yesterdayDate =
          Math.floor(new Date().getTime() / 1000.0) - 60 * 24 * 3600;
        setYesterdayDate(yesterdayDate);
        setFromDate(fromDate);
        setAgr("2d");
        if (selectedDevices !== "All") {
          setMetricesDevicesData(
            selectedDevices,
            "30d",
            "60d",
            fromDate,
            yesterdayDate,
            true
          );
          commonApiMetrices(selectedDevices, true, "2d", currentDate, fromDate);
        } else {
          setTimeMetricesData("30d", "60d", fromDate, yesterdayDate, true);
          commonApiMetrices("", true, "2d", currentDate, fromDate);
        }
        return;
      }
      case "15days": {
        setCurrent("15d");
        setLast("30d");
        let currentDate = Math.floor(new Date().getTime() / 1000.0);
        let fromDate =
          Math.floor(new Date().getTime() / 1000.0) - 15 * 24 * 3600;
        let yesterdayDate =
          Math.floor(new Date().getTime() / 1000.0) - 30 * 24 * 3600;
        //temporary ----------
        // let fromDate = Math.floor((new Date()).getTime() / 1000.0) - (15  * 3600)
        // let yesterdayDate = Math.floor((new Date()).getTime() / 1000.0) - (30  * 3600);
        //-------------------------------------------------------------
        setYesterdayDate(yesterdayDate);
        setFromDate(fromDate);
        setAgr("2d");
        if (selectedDevices !== "All") {
          setMetricesDevicesData(
            selectedDevices,
            "15d",
            "30d",
            fromDate,
            yesterdayDate,
            true
          );
          commonApiMetrices(selectedDevices, true, "2d", currentDate, fromDate);
        } else {
          setTimeMetricesData("15d", "30d", fromDate, yesterdayDate, true);
          commonApiMetrices("", true, "2d", currentDate, fromDate);
        }
        return;
      }
      case "7days": {
        setCurrent("7d");
        setLast("14d");
        let currentDate = Math.floor(new Date().getTime() / 1000.0);
        let fromDate =
          Math.floor(new Date().getTime() / 1000.0) - 7 * 24 * 3600;
        let yesterdayDate =
          Math.floor(new Date().getTime() / 1000.0) - 14 * 24 * 3600;
        //temporary
        // let fromDate = Math.floor((new Date()).getTime() / 1000.0) - (7 * 3600);
        // let yesterdayDate = Math.floor((new Date()).getTime() / 1000.0) - (14 * 3600);
        // //-------------
        setYesterdayDate(yesterdayDate);
        setFromDate(fromDate);
        setAgr("1d");

        console.log("7d", currentDate, fromDate);
        if (selectedDevices !== "All") {
          setMetricesDevicesData(
            selectedDevices,
            "7d",
            "14d",
            fromDate,
            yesterdayDate,
            true
          );
          commonApiMetrices(selectedDevices, true, "1d", currentDate, fromDate);
        } else {
          setTimeMetricesData("7d", "14d", fromDate, yesterdayDate, true);
          commonApiMetrices("", true, "1d", currentDate, fromDate);
        }
        return;
      }
      case "24hr": {
        setCurrent("1d");
        setLast("7d");
        let currentDate = Math.floor(new Date().getTime() / 1000.0);
        let fromDate = Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
        let yesterdayDate =
          Math.floor(new Date().getTime() / 1000.0) - 48 * 3600;
        setYesterdayDate(yesterdayDate);
        setFromDate(fromDate);
        setAgr("1h");
        if (selectedDevices !== "All") {
          setMetricesDevicesData(
            selectedDevices,
            "1d",
            "7d",
            fromDate,
            yesterdayDate,
            true
          );
          commonApiMetrices(selectedDevices, true, "1h", currentDate, fromDate);
        } else {
          setTimeMetricesData("1d", "7d", fromDate, yesterdayDate, true);
          commonApiMetrices("", true, "1h", currentDate, fromDate);
        }
        return;
      }
      default:
        return;
    }
  };

  const setTimeMetricesData = async (
    current,
    last,
    fromDate,
    yesterdayDate,
    showLoader
  ) => {
    showLoader && isLoading(true);

    // let  toDateShow = toDate
    let fromDateShow = fromDate;
    let yesterdayDateShow = yesterdayDate;
    await getWidget(
      "attempts",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "average_bitrate",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "average_framerate",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "average_percentage_completion",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "bandwidth",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "exit_before_video_starts",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "minutes_per_unique_devices",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "rebuffering_percentage",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "rebuffering_ratio",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "succesful_plays",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "total_minutes_watched",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "user_attrition",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_playback_failures",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_start_failures",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_start_time",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_restart_time",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "rendering_quality",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "concurrent_plays",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "connection_induced_rebuffering_ratio",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "unique_devices",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "unique_viewers",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "ended_plays",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "ended_plays_per_unique_devices",
      "",
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    //  await getWidget("play_attempts", "", fromDateShow, yesterdayDateShow, showLoader)
    // await getWidget("play_attempts", "", fromDateShow, yesterdayDateShow, showLoader)

    // await getWidget("ended_plays_per_unique_devices", "", fromDateShow, yesterdayDateShow, showLoader)
    // await getWidget("ended_plays_per_unique_devices", "", fromDateShow, yesterdayDateShow, showLoader)
  };

  const commonApiMetrices = async (
    d,
    showLoader,
    agrr,
    currenttime,
    fromtime
  ) => {
    // setDashboardAnalysisCharData([])
    showLoader && isLoading(true);
    await getMetrices("attempts", agrr, d, showLoader, currenttime, fromtime);
    await getMetrices(
      "average_bitrate",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "average_framerate",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "average_percentage_completion",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices("bandwidth", agrr, d, showLoader, currenttime, fromtime);
    await getMetrices(
      "exit_before_video_starts",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "minutes_per_unique_devices",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "rebuffering_percentage",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "rebuffering_ratio",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "succesful_plays",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "total_minutes_watched",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "user_attrition",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "video_playback_failures",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "video_start_failures",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "video_start_time",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "video_restart_time",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "rendering_quality",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "concurrent_plays",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "connection_induced_rebuffering_ratio",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "unique_devices",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "unique_viewers",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "ended_plays",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    await getMetrices(
      "ended_plays_per_unique_devices",
      agrr,
      d,
      showLoader,
      currenttime,
      fromtime
    );
    //await getMetrices("play_attempts", agrr, d, showLoader)
  };

  const getWidget = async (
    metrices_name,
    selectedDevices,
    fromDate,
    yesterdayDate,
    showLoader
  ) => {
    showLoader && isLoading(true);
    let toDateShow;
    let fromDateShow;
    let yesterdayDateShow;
    if (metrices_name == "concurrent_plays" && selectedDates == "24hr") {
      fromDateShow = Math.floor(new Date().getTime() / 1000.0) - 1 * 60;
      toDateShow = Math.floor(new Date().getTime() / 1000.0);
      yesterdayDateShow = Math.floor(new Date().getTime() / 1000.0) - 2 * 60;
    } else {
      fromDateShow = fromDate;
      toDateShow = toDate;
      yesterdayDateShow = yesterdayDate;
    }

    const requestBodyAnother = {
      device_platform: selectedDevices,
      metrices_name: metrices_name,
    };

    const requestOptAnother = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBodyAnother),
    };
    try {
      fetch(
        `${baseURL}api/v2/percentage_change?to_time=${toDateShow}&from_time_24hrs=${fromDateShow}&from_time_48hrs=${yesterdayDateShow}`,
        requestOptAnother
      )
        .then((response) => response.json())
        .then((res) => {
          if (res.length != 0) {
            widgetArray.push(res[0]);
            // var res = metricsJsonData.map(obj => data.find(o => o.metricname == obj.metricname) || obj);
            var arr = metricsJsonData.concat(widgetArray).reduce(
              function (prev, current, index, array) {
                if (!(current?.metric_key_name in prev?.keys)) {
                  prev.keys[current?.metric_key_name] = index;
                  prev.result.push(current);
                } else {
                  prev.result[prev.keys[current?.metric_key_name]] = current;
                }

                return prev;
              },
              { result: [], keys: {} }
            ).result;
          }

          setYesterdayData(arr);
          setBackupYesterdayData(arr);
          showLoader && isLoading(false);
        });
    } catch (error) {
      console.log("getWidget", error);
    }
  };

  const getMetrices = async (
    metricName,
    agr,
    platform,
    showLoader,
    currenttime,
    fromtime
  ) => {
    if (currenttime == undefined && fromtime == undefined) {
      return;
    }
    showLoader && isLoading(true);
    const requestBody = {
      metricname: metricName,
      content_partner: localStorage.getItem("contentPartner")
        ? [localStorage.getItem("contentPartner")]
        : [],
      device_model: [],
      device_platform: platform ? [platform] : [],
      content_type: [],
      cdn: [],
      location: [],
      aggregation_interval: agr,
    };
    const url = `${baseURL}api/metrics?to_time=${currenttime}&from_time=${fromtime}`;
    try {
      const response = await axios.post(url, requestBody);
      const { data } = response;
      if (platform) {
        setDashboardAnalysisCharData((d) => d.concat({ [metricName]: data }));
      } else {
        setDashboardAnalysisCharData((d) => d.concat({ [metricName]: data }));
      }
      if ((metricName = "ended_plays_per_unique_devices"))
        showLoader && isLoading(false);
    } catch (error) {
      console.log("getMetrices", error);
    }
  };

  const setMetricesDevicesData = async (
    selectedDevices,
    current,
    last,
    fromDate,
    yesterdayDate,
    showLoader
  ) => {
    showLoader && isLoading(true);
    //let toDateShow = toDate
    let fromDateShow = fromDate;
    let yesterdayDateShow = yesterdayDate;
    await getWidget(
      "average_bitrate",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "attempts",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "average_framerate",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "average_percentage_completion",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "bandwidth",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "exit_before_video_starts",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "minutes_per_unique_devices",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "rebuffering_percentage",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "rebuffering_ratio",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "succesful_plays",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "total_minutes_watched",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "user_attrition",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_playback_failures",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_start_failures",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_start_time",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "video_restart_time",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "rendering_quality",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "concurrent_plays",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "connection_induced_rebuffering_ratio",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "unique_devices",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "unique_viewers",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "ended_plays",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    await getWidget(
      "ended_plays_per_unique_devices",
      selectedDevices,
      fromDateShow,
      yesterdayDateShow,
      showLoader
    );
    // await getWidget("play_attempts", selectedDevices, fromDateShow, yesterdayDateShow, showLoader)
  };

  useEffect(() => {
    if (selectedDevices !== "All") {
      setMetricesDevicesData(
        selectedDevices,
        current,
        last,
        fromDate,
        yesterdayDate,
        true
      );
    } else {
      setTimeMetricesData(current, last, fromDate, yesterdayDate, true);
    }
  }, [selectedDevices]);

  useEffect(() => {
    setanalysisBtn(false);
    const isEmpty = Object.keys(realdata?.filters).length === 0;
    if (isEmpty) {
      dispatch(getUniqueFilters(dispatch));
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (window.location.href.includes("dashboard/crm/dashboard")) {
        if (selectedDevices !== "All") {
          setMetricesDevicesData(
            selectedDevices,
            current,
            last,
            fromDate,
            yesterdayDate,
            false
          );
          //  dispatch(getWidgetDataRequest(dispatch, false))
          switch (selectedDates) {
            case "Yearly": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 12 * 30 * 24 * 3600;
              commonApiMetrices(
                selectedDevices,
                false,
                "30d",
                currentDate,
                fromDate
              );
              return;
            }

            case "Monthly": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 30 * 24 * 3600;
              commonApiMetrices(
                selectedDevices,
                false,
                "2d",
                currentDate,
                fromDate
              );
              return;
            }
            case "15days": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 15 * 24 * 3600;
              commonApiMetrices(
                selectedDevices,
                false,
                "1d",
                currentDate,
                fromDate
              );
              return;
            }
            case "7days": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 7 * 24 * 3600;
              commonApiMetrices(
                selectedDevices,
                false,
                "1d",
                currentDate,
                fromDate
              );
              return;
            }
            case "24hr": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
              commonApiMetrices(
                selectedDevices,
                false,
                "1h",
                currentDate,
                fromDate
              );
              return;
            }
            default:
              return;
          }
        } else {
          setTimeMetricesData(current, last, fromDate, yesterdayDate, false);
          switch (selectedDates) {
            case "Yearly": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 12 * 30 * 24 * 3600;
              commonApiMetrices("", false, "30d", currentDate, fromDate);
              return;
            }

            case "Monthly": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 30 * 24 * 3600;
              commonApiMetrices("", false, "2d", currentDate, fromDate);
              return;
            }
            case "15days": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 15 * 24 * 3600;
              commonApiMetrices("", false, "1d", currentDate, fromDate);
              return;
            }
            case "7days": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 7 * 24 * 3600;
              commonApiMetrices("", false, "1d", currentDate, fromDate);
              return;
            }
            case "24hr": {
              let currentDate = Math.floor(new Date().getTime() / 1000.0);
              let fromDate =
                Math.floor(new Date().getTime() / 1000.0) - 24 * 3600;
              commonApiMetrices("", false, "1h", currentDate, fromDate);
              return;
            }
            default:
              return;
          }
          //  dispatch(getWidgetDataRequest(dispatch, false))
        }
      } else {
        clearInterval(interval);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [selectedDevices, current, last, fromDate, yesterdayDate]);

  const searchMetricName = (e) => {
    setSearchText(e.target.value);
    // setFilterMetric('sort')
    // setSortMatrics('sort')
    if (e.target.value !== "") {
      const data = backupYesterdayData.filter((a) =>
        a.metricname.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setYesterdayData(data);
    } else {
      setYesterdayData(backupYesterdayData);
    }
  };

  const getImage = () => {
    var node = document.querySelector(".full-table");
    var options = {
      quality: 1,
      bgcolor: "#ffffff",
    };
    domtoimage
      .toPng(node, options)
      .then(function (dataUrl) {
        const a = document.createElement("a");
        a.href = dataUrl;
        a.download = createFileName("png", "Analysis");
        a.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const findChartData = (name, color, change_24hrs, change_48hrs) => {
    const arrayToObject3 = (arr) =>
      Object.assign({}, ...arr.map((item) => item));
    let finalchartData = {};
    finalchartData = dashboardAnalysisCharData; //arrayToObject3(dashboardAnalysisCharData);
    finalchartData = arrayToObject3(dashboardAnalysisCharData);

    if (analysisBtn && Object.keys(finalchartData).length > 0) {
      if (selectedDevices == "Android") {
        // console.log("--chart1-android22",finalchartData[name][selectedDevices][name]);
        return (
          <>
            {name &&
            finalchartData[name] &&
            finalchartData[name][1]?.[selectedDevices]?.time_stamp.length >
              0 ? (
              <div className="chartBox">
                <StackedAreaChart
                  labels={formatTime(
                    finalchartData[name][1]?.[selectedDevices]?.time_stamp
                  )}
                  datasets={[
                    {
                      borderColor:
                        change_24hrs == change_48hrs
                          ? "#404040"
                          : color
                          ? "#90EE90"
                          : "#FF7F7F",
                      data: finalchartData[name][1]?.[selectedDevices][name],
                    },
                  ]}
                />
              </div>
            ) : (
              <span className="stright-line">na</span>
            )}
          </>
        );
      } else if (selectedDevices == "iOS") {
        return (
          <>
            {name &&
            finalchartData[name] &&
            finalchartData[name][1]?.[selectedDevices]?.time_stamp.length >
              0 ? (
              <div className="chartBox">
                <StackedAreaChart
                  labels={formatTime(
                    finalchartData[name][1]?.[selectedDevices]?.time_stamp
                  )}
                  datasets={[
                    {
                      borderColor:
                        change_24hrs == change_48hrs
                          ? "#404040"
                          : color
                          ? "#90EE90"
                          : "#FF7F7F",
                      data: finalchartData[name][1]?.[selectedDevices][name],
                    },
                  ]}
                />
              </div>
            ) : (
              <span className="stright-line">na</span>
            )}
          </>
        );
      } else if (selectedDevices == "Web") {
        return (
          <>
            {name &&
            finalchartData[name] &&
            finalchartData[name][1]?.[selectedDevices]?.time_stamp.length >
              0 ? (
              <div className="chartBox">
                <StackedAreaChart
                  labels={formatTime(
                    finalchartData[name][1]?.[selectedDevices]?.time_stamp
                  )}
                  datasets={[
                    {
                      borderColor:
                        change_24hrs == change_48hrs
                          ? "#404040"
                          : color
                          ? "#90EE90"
                          : "#FF7F7F",
                      data: finalchartData[name][1]?.[selectedDevices][name],
                    },
                  ]}
                />
              </div>
            ) : (
              <span className="stright-line">na</span>
            )}
          </>
        );
      } else if (selectedDevices == "Firestick") {
        return (
          <>
            {name &&
            finalchartData[name] &&
            finalchartData[name][1]?.[selectedDevices]?.time_stamp.length >
              0 ? (
              <div className="chartBox">
                <StackedAreaChart
                  labels={formatTime(
                    finalchartData[name][1]?.[selectedDevices]?.time_stamp
                  )}
                  datasets={[
                    {
                      borderColor:
                        change_24hrs == change_48hrs
                          ? "#404040"
                          : color
                          ? "#90EE90"
                          : "#FF7F7F",
                      data: finalchartData[name][1]?.[selectedDevices][name],
                    },
                  ]}
                />
              </div>
            ) : (
              <span className="stright-line">na</span>
            )}
          </>
        );
      } else if (selectedDevices == "AndroidSmartTv") {
        return (
          <>
            {name &&
            finalchartData[name] &&
            finalchartData[name][1]?.[selectedDevices]?.time_stamp.length >
              0 ? (
              <div className="chartBox">
                <StackedAreaChart
                  labels={formatTime(
                    finalchartData[name][1]?.[selectedDevices]?.time_stamp
                  )}
                  datasets={[
                    {
                      borderColor:
                        change_24hrs == change_48hrs
                          ? "#404040"
                          : color
                          ? "#90EE90"
                          : "#FF7F7F",
                      data: finalchartData[name][1]?.[selectedDevices][name],
                    },
                  ]}
                />
              </div>
            ) : (
              <span className="stright-line">na</span>
            )}
          </>
        );
      } else if (selectedDevices == "All" && finalchartData[name]) {
        return (
          <>
            {name &&
            finalchartData[name] &&
            finalchartData[name][0]?.all?.time_stamp.length > 0 ? (
              <div className="chartBox">
                <StackedAreaChart
                  labels={formatTime(finalchartData[name][0]?.all?.time_stamp)}
                  datasets={[
                    {
                      borderColor:
                        change_24hrs == change_48hrs
                          ? "#404040"
                          : color
                          ? "#90EE90"
                          : "#FF7F7F",
                      data: finalchartData[name][0]?.all[name],
                    },
                  ]}
                />
              </div>
            ) : (
              <span className="stright-line">na</span>
            )}
          </>
        );
      }
    } else {
      if (realdata[name]) {
        return (
          <>
            {name &&
            realdata[name] &&
            realdata[name][0]?.all?.time_stamp.length > 0 ? (
              <div className="chartBox">
                <StackedAreaChart
                  labels={formatTime(realdata[name][0]?.all?.time_stamp)}
                  datasets={[
                    {
                      borderColor:
                        change_24hrs == change_48hrs
                          ? "#404040"
                          : color
                          ? "#90EE90"
                          : "#FF7F7F",
                      data: realdata[name][0]?.all[name],
                    },
                  ]}
                />
              </div>
            ) : (
              <span className="stright-line">na</span>
            )}
          </>
        );
      } else {
        return <span className="stright-line">na</span>;
      }
    }

    // console.log((finalchartData, "--chart"));
  };

  const get48HoursData = (hrs, unit) => {
    if (hrs === "-" || typeof hrs === "string") {
      return "0.00";
    } else {
      if (Boolean(hrs > 1000 && !unit)) {
        return `${(hrs / 1000).toFixed(2)} k`;
      } else {
        return `${hrs ? Number(hrs) : "0.00"} ${unit}`;
      }
    }
  };

  const get24HoursData = (hrs, unit) => {
    if (hrs === "-" || typeof hrs === "string") {
      return "0.00";
    } else {
      if (Boolean(hrs > 1000 && !unit)) {
        return `${(Number(hrs) / 1000).toFixed(2)} k`;
      } else {
        return `${hrs ? Number(hrs).toFixed(2) : "0.00"} ${unit}`;
      }
    }
  };

  return (
    <div className="analysisContainer">
      <div className="col-md-12">
        <div>
          <h2>Analysis</h2>
        </div>
        {dashboardLoader ? (
          <div
            style={{
              height: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <RctPageLoader />
          </div>
        ) : (
          <>
            <div className="analysisHeader">
              <div className="analysisHeaderRight 44">
                <TextField
                  value={searchText}
                  onChange={searchMetricName}
                  id="outlined-basic"
                  className="mr-20"
                  placeholder="Search..."
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <IconButton>
                        <i
                          style={{ cursor: "pointer" }}
                          onClick={() => {
                            setSearchText("");
                            setYesterdayData(backupYesterdayData);
                          }}
                          className="zmdi zmdi zmdi-close"
                        ></i>
                      </IconButton>
                    ),
                  }}
                  fullWidth
                />
                <TextField
                  id="outlined-select-currency"
                  variant="outlined"
                  fullWidth
                  select
                  // label="All"
                  placeholder="All"
                  value={sortMatrics}
                  onChange={handleChange}
                >
                  {allMatrics.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <IconButton
                  color="primary"
                  aria-label="download"
                  onClick={getImage}
                >
                  <Tooltip title="Download Table" placement="bottom">
                    <DownloadIcon />
                  </Tooltip>
                </IconButton>
              </div>
            </div>
            <div className="analysisBtnGroup">
              <Box className="analysisBtnGroupCont">
                <p>Timeline</p>
                <ButtonGroup
                  variant="contained"
                  aria-label="outlined primary button group"
                >
                  <Button
                    className={selectedDates === "Yearly" ? "active" : null}
                    value="Yearly"
                    onClick={() => updateDate("Yearly")}
                    disabled
                    style={{ color: "#bcb7b7 !important" }}
                  >
                    Yearly
                  </Button>
                  <Button
                    className={selectedDates === "Monthly" ? "active" : null}
                    value="Monthly"
                    onClick={() => updateDate("Monthly")}
                  >
                    Monthly
                  </Button>
                  <Button
                    className={selectedDates === "15days" ? "active" : null}
                    value="15days"
                    onClick={() => updateDate("15days")}
                  >
                    15days
                  </Button>
                  <Button
                    className={selectedDates === "7days" ? "active" : null}
                    value="7days"
                    onClick={() => updateDate("7days")}
                  >
                    7days
                  </Button>
                  <Button
                    className={selectedDates === "24hr" ? "active" : null}
                    value="24hr"
                    onClick={() => updateDate("24hr")}
                  >
                    24hr
                  </Button>
                </ButtonGroup>
              </Box>
              <Box className="analysisBtnGroupCont">
                <p>Device</p>
                <ButtonGroup variant="contained">
                  <Button
                    className={selectedDevices === "All" ? "active" : null}
                    onClick={() => {
                      setDashboardLoader(true);
                      setTimeout(() => {
                        setDashboardLoader(false);
                      }, 5000);
                      // setSelectedDates("24hr")
                      setSelectedDevices("All");
                      setFilterMetric("sort");
                      setSortMatrics("sort");
                      setSearchText("");
                      setCurrent("1d");
                      setLast("7d");
                      setYesterdayDate(
                        Math.floor(new Date().getTime() / 1000.0) - 48 * 3600
                      );
                      setFromDate(
                        Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
                      );
                      setanalysisBtn(true);
                      switch (selectedDates) {
                        case "Yearly": {
                          let currentDate = Math.floor(
                            new Date().getTime() / 1000.0
                          );
                          let fromDate =
                            Math.floor(new Date().getTime() / 1000.0) -
                            12 * 30 * 24 * 3600;
                          commonApiMetrices(
                            "",
                            true,
                            "30d",
                            currentDate,
                            fromDate
                          );
                          return;
                        }

                        case "Monthly": {
                          let currentDate = Math.floor(
                            new Date().getTime() / 1000.0
                          );
                          let fromDate =
                            Math.floor(new Date().getTime() / 1000.0) -
                            30 * 24 * 3600;
                          commonApiMetrices(
                            "",
                            true,
                            "2d",
                            currentDate,
                            fromDate
                          );
                          return;
                        }
                        case "15days": {
                          let currentDate = Math.floor(
                            new Date().getTime() / 1000.0
                          );
                          let fromDate =
                            Math.floor(new Date().getTime() / 1000.0) -
                            15 * 24 * 3600;
                          commonApiMetrices(
                            "",
                            true,
                            "1d",
                            currentDate,
                            fromDate
                          );
                          return;
                        }
                        case "7days": {
                          let currentDate = Math.floor(
                            new Date().getTime() / 1000.0
                          );
                          let fromDate =
                            Math.floor(new Date().getTime() / 1000.0) -
                            7 * 24 * 3600;
                          commonApiMetrices(
                            "",
                            true,
                            "1d",
                            currentDate,
                            fromDate
                          );
                          return;
                        }
                        case "24hr": {
                          let currentDate = Math.floor(
                            new Date().getTime() / 1000.0
                          );
                          let fromDate =
                            Math.floor(new Date().getTime() / 1000.0) -
                            24 * 3600;
                          commonApiMetrices(
                            "",
                            true,
                            "1h",
                            currentDate,
                            fromDate
                          );
                          return;
                        }
                        default:
                          return;
                      }
                      //  commonApiMetrices("", true, agrr,)
                    }}
                  >
                    All
                  </Button>
                  {realdata?.device_platform &&
                    realdata?.device_platform.length > 0 &&
                    realdata?.device_platform?.map((d, index) => {
                      return (
                        <Button
                          className={selectedDevices === d ? "active" : null}
                          key={index}
                          onClick={() => {
                            setDashboardLoader(true);
                            setTimeout(() => {
                              setDashboardLoader(false);
                            }, 5000);
                            //setSelectedDates("24hr")
                            setDashboardAnalysisCharData([]);
                            setSelectedDevices(d);
                            setFilterMetric("sort");
                            setSortMatrics("sort");
                            setSearchText("");
                            setCurrent("1d");
                            setLast("7d");
                            setYesterdayDate(
                              Math.floor(new Date().getTime() / 1000.0) -
                                48 * 3600
                            );
                            setFromDate(
                              Math.floor(new Date().getTime() / 1000.0) -
                                24 * 3600
                            );
                            setanalysisBtn(true);
                            commonApiMetrices(d, true, agrr);
                            console.log("selectedDates--", selectedDates);

                            switch (selectedDates) {
                              case "Yearly": {
                                let currentDate = Math.floor(
                                  new Date().getTime() / 1000.0
                                );
                                let fromDate =
                                  Math.floor(new Date().getTime() / 1000.0) -
                                  12 * 30 * 24 * 3600;
                                commonApiMetrices(
                                  d,
                                  true,
                                  "30d",
                                  currentDate,
                                  fromDate
                                );
                                return;
                              }

                              case "Monthly": {
                                let currentDate = Math.floor(
                                  new Date().getTime() / 1000.0
                                );
                                let fromDate =
                                  Math.floor(new Date().getTime() / 1000.0) -
                                  30 * 24 * 3600;
                                commonApiMetrices(
                                  d,
                                  true,
                                  "2d",
                                  currentDate,
                                  fromDate
                                );
                                return;
                              }
                              case "15days": {
                                let currentDate = Math.floor(
                                  new Date().getTime() / 1000.0
                                );
                                let fromDate =
                                  Math.floor(new Date().getTime() / 1000.0) -
                                  15 * 24 * 3600;
                                commonApiMetrices(
                                  d,
                                  true,
                                  "1d",
                                  currentDate,
                                  fromDate
                                );
                                return;
                              }
                              case "7days": {
                                let currentDate = Math.floor(
                                  new Date().getTime() / 1000.0
                                );
                                let fromDate =
                                  Math.floor(new Date().getTime() / 1000.0) -
                                  7 * 24 * 3600;
                                commonApiMetrices(
                                  d,
                                  true,
                                  "1d",
                                  currentDate,
                                  fromDate
                                );
                                return;
                              }
                              case "24hr": {
                                let currentDate = Math.floor(
                                  new Date().getTime() / 1000.0
                                );
                                let fromDate =
                                  Math.floor(new Date().getTime() / 1000.0) -
                                  24 * 3600;
                                commonApiMetrices(
                                  d,
                                  true,
                                  "1h",
                                  currentDate,
                                  fromDate
                                );
                                return;
                              }
                              default:
                                return;
                            }
                          }}
                        >
                          {d}
                        </Button>
                      );
                    })}
                </ButtonGroup>
              </Box>
            </div>
            <div className="full-table">
              <div style={{ paddingLeft: "15px", paddingRight: "10px" }}>
                {dashboardLoader ? (
                  <div
                    style={{
                      height: "250px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <RctPageLoader />
                  </div>
                ) : (
                  <>
                    {Boolean(
                      filterMetric === "realtime" || filterMetric === "sort"
                    ) && (
                      <div className="tableCont">
                        <TableContainer>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>Real-Time Key Insights</TableCell>
                                <TableCell>Last Analysis</TableCell>
                                <TableCell>{selectedDates}</TableCell>
                                <TableCell>Charts</TableCell>
                              </TableRow>
                            </TableHead>

                            {selectedDevices !== "All" ? (
                              <TableBody>
                                {yesterdayData.length > 0 &&
                                  yesterdayData.map((item, i) => {
                                    if (
                                      realdata?.filters?.realtime_metrices.includes(
                                        item?.metric_key_name
                                      )
                                    ) {
                                      return (
                                        <TableRow
                                          key={item.metricname}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              { border: 0 },
                                          }}
                                        >
                                          {/* item?.color ? { color: 'green' } : { color: 'red' } */}
                                          <TableCell>
                                            {item.metricname}
                                          </TableCell>
                                          <TableCell>
                                            {get48HoursData(
                                              item?.hrs_change_48hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              item?.hrs_change_24hrs ==
                                              item?.hrs_change_48hrs
                                                ? { color: "grey" }
                                                : item?.color
                                                ? { color: "green" }
                                                : { color: "red" }
                                            }
                                          >
                                            {get24HoursData(
                                              item?.hrs_change_24hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {findChartData(
                                              item.metric_key_name,
                                              item?.color,
                                              item?.hrs_change_24hrs,
                                              item?.hrs_change_48hrs
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                              </TableBody>
                            ) : (
                              <TableBody>
                                {yesterdayData?.length > 0 &&
                                  yesterdayData.map((item, i) => {
                                    if (
                                      realdata?.filters?.realtime_metrices?.includes(
                                        item?.metric_key_name
                                      )
                                    ) {
                                      return (
                                        <TableRow
                                          key={item.metricname}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              { border: 0 },
                                          }}
                                        >
                                          <TableCell>
                                            {item.metricname}
                                          </TableCell>
                                          <TableCell>
                                            {get48HoursData(
                                              item?.hrs_change_48hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              item?.hrs_change_24hrs ==
                                              item?.hrs_change_48hrs
                                                ? { color: "grey" }
                                                : item?.color
                                                ? { color: "green" }
                                                : { color: "red" }
                                            }
                                          >
                                            {get24HoursData(
                                              item?.hrs_change_24hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {findChartData(
                                              item.metric_key_name,
                                              item?.color,
                                              item?.hrs_change_24hrs,
                                              item?.hrs_change_48hrs
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                              </TableBody>
                            )}
                          </Table>
                        </TableContainer>
                      </div>
                    )}
                  </>
                )}
                {dashboardLoader ? (
                  <div
                    style={{
                      height: "250px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <RctPageLoader />
                  </div>
                ) : (
                  <>
                    {Boolean(
                      filterMetric === "userengagement" ||
                        filterMetric === "sort"
                    ) && (
                      <div className="tableCont">
                        <TableContainer>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>User Engagement Matrics</TableCell>
                                <TableCell>Last Analysis</TableCell>
                                <TableCell>{selectedDates}</TableCell>
                                <TableCell>Charts</TableCell>
                              </TableRow>
                            </TableHead>
                            {selectedDevices !== "All" ? (
                              <TableBody>
                                {yesterdayData.length > 0 &&
                                  yesterdayData.map((item, i) => {
                                    if (
                                      realdata?.filters?.user_metrices?.includes(
                                        item?.metric_key_name
                                      )
                                    ) {
                                      return (
                                        <TableRow
                                          key={item.metricname}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              { border: 0 },
                                          }}
                                        >
                                          <TableCell>
                                            {item.metricname}
                                          </TableCell>
                                          <TableCell>
                                            {get48HoursData(
                                              item?.hrs_change_48hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              item?.hrs_change_24hrs ==
                                              item?.hrs_change_48hrs
                                                ? { color: "grey" }
                                                : item?.color
                                                ? { color: "green" }
                                                : { color: "red" }
                                            }
                                          >
                                            {get24HoursData(
                                              item?.hrs_change_24hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {findChartData(
                                              item.metric_key_name,
                                              item?.color,
                                              item?.hrs_change_24hrs,
                                              item?.hrs_change_48hrs
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                              </TableBody>
                            ) : (
                              <TableBody>
                                {yesterdayData?.length > 0 &&
                                  yesterdayData?.map((item, i) => {
                                    if (
                                      realdata?.filters?.user_metrices?.includes(
                                        item?.metric_key_name
                                      )
                                    ) {
                                      return (
                                        <TableRow
                                          key={item.metricname}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              { border: 0 },
                                          }}
                                        >
                                          <TableCell>
                                            {item.metricname}
                                          </TableCell>
                                          <TableCell>
                                            {get48HoursData(
                                              item?.hrs_change_48hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              item?.hrs_change_24hrs ==
                                              item?.hrs_change_48hrs
                                                ? { color: "grey" }
                                                : item?.color
                                                ? { color: "green" }
                                                : { color: "red" }
                                            }
                                          >
                                            {get24HoursData(
                                              item?.hrs_change_24hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {findChartData(
                                              item.metric_key_name,
                                              item?.color,
                                              item?.hrs_change_24hrs,
                                              item?.hrs_change_48hrs
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                              </TableBody>
                            )}
                          </Table>
                        </TableContainer>
                      </div>
                    )}
                  </>
                )}
                {dashboardLoader ? (
                  <div
                    style={{
                      height: "250px",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <RctPageLoader />
                  </div>
                ) : (
                  <>
                    {Boolean(
                      filterMetric === "qualityexperience" ||
                        filterMetric === "sort"
                    ) && (
                      <div className="tableCont">
                        <TableContainer>
                          <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                              <TableRow>
                                <TableCell>
                                  Quality of Experience (QoE)
                                </TableCell>
                                <TableCell>Last Analysis</TableCell>
                                <TableCell>{selectedDates}</TableCell>
                                <TableCell>Charts</TableCell>
                              </TableRow>
                            </TableHead>
                            {selectedDevices !== "All" ? (
                              <TableBody>
                                {yesterdayData.length > 0 &&
                                  yesterdayData.map((item, i) => {
                                    if (
                                      realdata?.filters?.qoe_metrics?.includes(
                                        item?.metric_key_name
                                      )
                                    ) {
                                      return (
                                        <TableRow
                                          key={item.metricname}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              { border: 0 },
                                          }}
                                        >
                                          <TableCell>
                                            {item.metricname}
                                          </TableCell>
                                          <TableCell>
                                            {get48HoursData(
                                              item?.hrs_change_48hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              item?.hrs_change_24hrs ==
                                              item?.hrs_change_48hrs
                                                ? { color: "grey" }
                                                : item?.color
                                                ? { color: "green" }
                                                : { color: "red" }
                                            }
                                          >
                                            {get24HoursData(
                                              item?.hrs_change_24hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {findChartData(
                                              item.metric_key_name,
                                              item?.color,
                                              item?.hrs_change_24hrs,
                                              item?.hrs_change_48hrs
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                              </TableBody>
                            ) : (
                              <TableBody>
                                {yesterdayData?.length > 0 &&
                                  yesterdayData.map((item, i) => {
                                    if (
                                      realdata?.filters?.qoe_metrics?.includes(
                                        item?.metric_key_name
                                      )
                                    ) {
                                      return (
                                        <TableRow
                                          key={item.metricname}
                                          sx={{
                                            "&:last-child td, &:last-child th":
                                              { border: 0 },
                                          }}
                                        >
                                          <TableCell>
                                            {item.metricname}
                                          </TableCell>
                                          <TableCell>
                                            {get48HoursData(
                                              item?.hrs_change_48hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell
                                            style={
                                              item?.hrs_change_24hrs ==
                                              item?.hrs_change_48hrs
                                                ? { color: "grey" }
                                                : item?.color
                                                ? { color: "green" }
                                                : { color: "red" }
                                            }
                                          >
                                            {get24HoursData(
                                              item?.hrs_change_24hrs,
                                              item?.unit
                                            )}
                                          </TableCell>
                                          <TableCell>
                                            {findChartData(
                                              item.metric_key_name,
                                              item?.color,
                                              item?.hrs_change_24hrs,
                                              item?.hrs_change_48hrs
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    } else {
                                      return null;
                                    }
                                  })}
                              </TableBody>
                            )}
                          </Table>
                        </TableContainer>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DashboardAnalysis;