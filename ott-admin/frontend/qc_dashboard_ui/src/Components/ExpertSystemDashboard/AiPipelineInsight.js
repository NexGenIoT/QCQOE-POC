/* eslint-disable */
import * as React from "react";
import { useState, useEffect } from "react";
import { createFileName } from "use-react-screenshot";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import FilterLayout from "../QualityExperience/FilterLayout";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import FullscreenOutlinedIcon from "@mui/icons-material/FullscreenOutlined";
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import TextField from "@mui/material/TextField";
import LeftMenu from "Components/QualityExperience/LeftMenu";
import moment from "moment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TotalEarnsWithAreaChart from "Components/Widgets/TotalEarnsWithAreaChart";
import exportFromJSON from "export-from-json";

import {
  getFavoriteMetrics,
  getAnomaliesDetectedPage,
  getAnomaliesRCAPage,
  getAnomaliesMitigationPage,
  getAnomaliesClusterPage,
  getAnomaliesClusterSessionPage,
  getUniqueFilters,
  setMetricType,
  setMetricTypeFullName,
  getConfigMitiListBucket,
  getEstimatedRootRcaBucket,
  setAnomaliesDetectedPage,
} from "Store/Actions";
import { useDispatch, useSelector } from "react-redux";
import domtoimage from "dom-to-image";
import ChartConfig from "Constants/chart-config";
import { hexToRgbA } from "Helpers/helpers";
import AppliedFilters from "Components/QualityExperience/AppliedFilters";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import { DateRange } from "react-date-range";
import Button from '@mui/material/Button';
import PieChartCluster from './PieChartCluster'
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import FilterDetectedAnamoliesGraph from "Components/QualityExperience/FilterDetectedAnamoliesGraph";
import { removeDuplicates } from "Constants/constant";
import BarGraph from "./BarGraph";
import { NotificationManager } from "react-notifications";


const AiPipelineInsight = () => {
  const leftAnomolies = [
    "Total Anomalies Detected",
    "Total Anomalies RCA Buckets",
    "Email Mitigation Applied",
    "Anomalies Cluster Playback Failure",
    "Anomalies Cluster In Session",
  ];
  const dispatch = useDispatch();
  const realdata = useSelector((state) => state.qoeReducer);
  const favorite = realdata?.favoriteMetric;
  const metric_type = realdata?.metricType;
  const metric_type_fullname = realdata?.metricTypefulname;
  let bucketNameVal = []
  const [metricsList, setMetricList] = useState([]);
  const cdnVal = realdata?.filters?.cdn;
  const contentTypeVal = realdata?.filters?.content_type;
  const contentPartnetVal = realdata?.filters?.content_partner;
  const locationVal = realdata?.filters?.location;
  const [isLoadingData, setisLoadingData] = React.useState(false);
  const [cdn, setCdn] = useState([]);
  const [contentType, setContentType] = useState([]);
  const [contentPartner, setContentPartner] = useState([]);
  const [location, setLocation] = useState([]);
  const [metric, setMetric] = useState(
    metric_type ? metric_type : "Total Anomalies Detected"
  );
  const [metricHeader, setMetricHeader] = useState(
    metric_type_fullname ? metric_type_fullname : "Total Anomalies Detected"
  );
  const [aggregationInterval, setAggregationInterval] = useState("1h");
  const [devicePlatform, setDevicePlatform] = useState([
    "Android",
    "iOS",
    "Web",
    "Firestick"
  ]);
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [toDate, setToDate] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );

  const [updatedGraphData, setUpdatedGraphData] = useState();
  const [updatedGraphRCAData, setUpdatedGraphRCAData] = useState();
  const [updatedGraphMitigationData, setUpdatedGraphMitigationData] = useState();
  const [updatedGraphClusterData, setUpdatedGraphClusterData] = useState();
  const [updatedGraphClusterSessionData, setUpdatedGraphClusterSessionData] = useState();
  const [pieLabelData, setPieLabelData] = useState();
  const [pieValueData, setPieValueData] = useState();
  const [pieLabelData2, setPieLabelData2] = useState();
  const [pieValueData2, setPieValueData2] = useState();
  const [pieLabelData3, setPieLabelData3] = useState();
  const [pieValueData3, setPieValueData3] = useState();
  const [allGraphPoints, setAllGraphPoints] = useState([]);
  const [androidGraphPoints, setAndroidGraphPoints] = useState([]);
  const [iosGraphPoints, setIosGraphPoints] = useState([]);
  const [chromeGraphPoints, setChromeGraphPoints] = useState([]);
  const [tvGraphPoints, setTvGraphPoints] = useState([]);
  const [firestickGraphPoints, setFirestickGraphPoints] = useState([]);
  const [selectVal, setSelectVal] = useState("1d");
  const [xAxis, setXAxis] = useState("hour");
  const [customDateValue, setCustomDateValue] = useState([null, null]);
  const [openModal, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [network, setNetwork] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [bucketname, setBucketname] = useState([]);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  var totalDetectedAnomalyGraph = {}
  var totalEarnsRcaGraph = {}
  var totalMitigationsAppliedGraph = {}

  const updateMetricHeader = (data) => {
    toDate ? setToDate(toDate) : setToDate(Math.floor(new Date().getTime() / 1000.0))
    let filters = {
      manufacturer,
      network,
      contentPartner,
      location,
      devicePlatform,
      bucketname,
      selectVal
    };
    setMetricHeader(data)

    setManufacturer([])
    setNetwork([])
    setContentPartner([])
    setLocation([])
    setDevicePlatform([])
    setBucketname([])


    // if (data == "Total Anomalies Detected") {
    //   fetchTheRequest(
    //     fromDate,
    //     toDate?toDate: Math.floor(new Date().getTime() / 1000.0),
    //     filters,
    //   );

    // } else if (data == "Total Anomalies RCA Buckets") {
    //   setisLoadingData(true);
    //   dispatch(
    //     getAnomaliesRCAPage(
    //       dispatch, 
    //       toDate?toDate: Math.floor(new Date().getTime() / 1000.0),
    //       fromDate,
    //       filters,
    //     )
    //   );
    // } else if (data == "Email Mitigation Applied") {
    //   setisLoadingData(true);
    //   dispatch(
    //     getAnomaliesMitigationPage(
    //       dispatch,
    //       toDate?toDate: Math.floor(new Date().getTime() / 1000.0),
    //       fromDate,
    //       selectVal
    //     )
    //   );
    // } else if (data == "Anomalies Cluster Playback Failure") {
    //   setisLoadingData(true);
    //   dispatch(
    //     getAnomaliesClusterPage(
    //       dispatch,
    //       toDate?toDate: Math.floor(new Date().getTime() / 1000.0),
    //       fromDate,
    //     )
    //   );
    // } else if (data == "Anomalies Cluster In Session") {
    //   setisLoadingData(true);
    //   dispatch(
    //     getAnomaliesClusterSessionPage(
    //       dispatch,
    //       toDate?toDate: Math.floor(new Date().getTime() / 1000.0),
    //       fromDate,
    //     )
    //   );
    // }
  }
  const updateMetric = (metricName) => {
    setDevicePlatform(["Android", "iOS"]);
    setMetric(metricName);
  };


  const savePlatformData = (val) => {
    setDevicePlatform(val);
  };

  useEffect(() => {
    if (!favorite) {
      dispatch(getFavoriteMetrics(dispatch));
    }
  }, [dispatch]);

  useEffect(() => {
    if (realdata && realdata.anamaliesDetected) {
      // setisLoadingData(false);
      setUpdatedGraphData(realdata.anamaliesDetected?.Items);
    }
    if (realdata && realdata.anamaliesRca) {
      // setisLoadingData(false);
      setUpdatedGraphRCAData(realdata.anamaliesRca?.Items);
    }
    if (realdata && realdata.anamaliesMitigation) {
      // setisLoadingData(false);
      setUpdatedGraphMitigationData(realdata.anamaliesMitigation);
    }
    if (metricHeader == "Anomalies Cluster Playback Failure") {
      if (realdata?.anamaliesCluster?.data != undefined) {
        // setisLoadingData(false);
        // setUpdatedGraphClusterData(realdata?.anamaliesCluster?.data);
        const myObjectLabels = Object.keys(realdata?.anamaliesCluster?.data);
        const myObjectVal = Object.values(realdata?.anamaliesCluster?.data);
        setPieValueData(myObjectVal)
        setPieLabelData(myObjectLabels)
      }

    } else if (metricHeader == "Anomalies Cluster In Session") {
      if (realdata?.anamaliesClusterSession?.data != undefined) {
        // setisLoadingData(false);
        // setUpdatedGraphClusterData(realdata?.anamaliesClusterSession);
        const myObjectLabels2 = Object.keys(realdata?.anamaliesClusterSession?.data).slice(0, 10);
        const myObjectVal2 = Object.values(realdata?.anamaliesClusterSession?.data).slice(0, 10);
        setPieValueData2(myObjectVal2)
        setPieLabelData2(myObjectLabels2)
      }
    }

    if (realdata?.anamaliesClusterSession?.data != undefined || realdata?.anamaliesCluster?.data != undefined || realdata && realdata.anamaliesMitigation || realdata && realdata.anamaliesRca || realdata.anamaliesDetected) {
      setisLoadingData(false);
    }


  }, [realdata?.anamaliesClusterSession?.data, realdata?.anamaliesCluster?.data, realdata.anamaliesMitigation, realdata.anamaliesRca?.Items, realdata.anamaliesDetected?.Items]);

  const fetchTheRequest = (
    startDate,
    endDate,
    aggregationInterval
  ) => {
    setisLoadingData(true);
    dispatch(
      getAnomaliesDetectedPage(
        dispatch,
        startDate,
        endDate,
        aggregationInterval,
      )
    );
  };

  const changeInterval = (e) => {
    console.log("abcd--", e);
    setAggregationInterval(e.target.value);
  };

  const setDataRange = (e) => {
    setEndDate()
    setStartDate()
    setCustomDateValue([null, null]);
    setSelectVal(e.target.value);
    // setAggregationInterval('1h');

    let aggrInterval = "";
    switch (e.target.value) {
      case "min": {
        // aggrInterval = "10s";
        // setAggregationInterval(aggrInterval);
        setXAxis("sec");
        calculateDateRange("min");
        return;
      }
      case "1h": {
        // aggrInterval = "1m";
        // setAggregationInterval(aggrInterval);
        setXAxis("hour");
        calculateDateRange("hour");
        return;
      }
      case "1d": {
        // aggrInterval = "1h";
        // setAggregationInterval(aggrInterval);
        setXAxis("hour");
        calculateDateRange("day");
        return;
      }
      case "1w": {
        // aggrInterval = "1d";
        // setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("week");
        return;
      }
      case "1m": {
        // aggrInterval = "1m";
        // setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("month");
        return;
      }
      case "1y": {
        // aggrInterval = "1y";
        // setAggregationInterval(aggrInterval);
        setXAxis("date");
        calculateDateRange("year");
        return;
      }
    }
  };

  const calculateDateRange = (timestamp) => {
    let sd = new Date(); //current system date
    let toDate = Math.floor(sd.getTime() / 1000.0);
    setToDate(toDate);
    let ts = Math.floor(new Date().getTime() / 1000);
    let fromDateRange;

    switch (timestamp) {
      case "min": {
        fromDateRange = ts - 60;
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
    }
  };

  useEffect(() => {
    if (customDateValue[0] !== null && customDateValue[1] !== null) {
      let fdate = customDateValue[0];
      let tdate = customDateValue[1];
      setToDate(Math.floor(tdate.getTime() / 1000.0));
      setAggregationInterval("1d");
      setFromDate(Math.floor(fdate.getTime() / 1000.0));
    }
  }, [customDateValue]);


  useEffect(() => {
    setMetricList(leftAnomolies);
    dispatch(getEstimatedRootRcaBucket(dispatch))

  }, []);

  useEffect(() => {
    let uniqueData = []
    realdata?.estimatedRootRcaBucket?.Items.map(res => {

      uniqueData.push(res.bucket_name.trim())
    })
    bucketNameVal = removeDuplicates(uniqueData)

  }, [realdata?.estimatedRootRcaBucket?.Items])


  const submit = () => {
    setSelectVal('')
    // setStartDate(Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0));
    // setEndDate(Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0));
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    setModalOpen(false);
    setToDate(Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)-(24 * 3600) +60);
    console.log(Math.floor((moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0) - (24 * 3600)), "fromdate");

    if (Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0) == Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0)) {
      setFromDate(Math.floor((moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0) - (24 * 3600) + 60))

    } else {
      setFromDate(Math.floor((moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0) - (24 * 3600) + 60))
    }
    // setDashboardLoader(true)
  };

  useEffect(() => {
    return () => {
      dispatch(setMetricType(""));
      dispatch(setMetricTypeFullName(""));
    };
  }, [dispatch]);

  useEffect(() => {
    let filters = {
      manufacturer,
      network,
      contentPartner,
      location,
      devicePlatform,
      bucketname,
      selectVal: aggregationInterval
    };

    let ts = Math.floor(new Date().getTime() / 1000);
    let fromDateInfo;
    switch (selectVal) {
      case "1min": {
        fromDateInfo = ts - 60;
        break;
      }
      // case "5min": {
      //   fromDateInfo = ts - 300;
      //   break;
      // }
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
    setisLoadingData(true)
    toDate ? setToDate(toDate) : setToDate(ts)

    if (metricHeader == "Total Anomalies Detected") {
      setAnomaliesDetectedPage([])
      setisLoadingData(true);
      fetchTheRequest(
        toDate ? toDate : ts,
        selectVal ? fromDateInfo : fromDate,
        filters,
      );

    } else if (metricHeader == "Total Anomalies RCA Buckets") {
      setisLoadingData(true);
      dispatch(
        getAnomaliesRCAPage(
          dispatch,
          toDate ? toDate : ts,
          selectVal ? fromDateInfo : fromDate,
          filters,
        )
      );
    } else if (metricHeader == "Email Mitigation Applied") {
      setisLoadingData(true);
      dispatch(
        getAnomaliesMitigationPage(
          dispatch,
          toDate ? toDate : ts,
          selectVal ? fromDateInfo : fromDate,
          aggregationInterval
        )
      );
    } else if (metricHeader == "Anomalies Cluster Playback Failure") {
      setisLoadingData(true);
      dispatch(
        getAnomaliesClusterPage(
          dispatch,
          toDate ? toDate : ts,
          selectVal ? fromDateInfo : fromDate,

        )
      );
    } else if (metricHeader == "Anomalies Cluster In Session") {
      setisLoadingData(true);
      dispatch(
        getAnomaliesClusterSessionPage(
          dispatch,
          toDate ? toDate : ts,
          selectVal ? fromDateInfo : fromDate,

        )
      );
    }
  }, [
    //toDate,
    fromDate,
    selectVal,
    manufacturer,
    network,
    contentPartner,
    location,
    devicePlatform,
    bucketname,
    metricHeader,
    aggregationInterval
  ]);


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
          `${"expert-system-dashboard"}-${moment().format("DD/MM/YYYY")}`
        );
        a.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const downloadFile = () => {
    const fileName = metricHeader + moment(Math.floor(new Date(fromDate).getTime() * 1000.0)).format("DD/MM/YYYY") + "-" + moment(Math.floor(new Date(toDate).getTime() * 1000.0)).format("DD/MM/YYYY");
    const exportType = exportFromJSON.types.csv;

    if (metricHeader == "Total Anomalies Detected") {
      if (realdata.anamaliesDetected?.Items?.Timestamp?.length > 0) {
        let data = [];
        data = realdata?.anamaliesDetected?.Items?.Timestamp?.map((time, i) => {
          let obj = {
            Date_Time: time,
            InSession: realdata?.anamaliesDetected?.Items?.InSession[i],
            Playback: realdata?.anamaliesDetected?.Items?.Playback[i]
          }
          return obj;
        });

        exportFromJSON({ data: data, fileName: fileName, exportType: exportType });

      } else {
        NotificationManager.error("Data not found !!", '', 2000);

      }

    } else if (metricHeader == "Total Anomalies RCA Buckets") {
      if (realdata?.anamaliesRca?.Items?.Bucket_info.length > 0) {
        let data = [];
        data = realdata?.anamaliesRca?.Items?.Bucket_info.map((ERS_data, i) => {
          let obj = {
            Bucket_Name: ERS_data,
            Count: realdata?.anamaliesRca?.Items?.Label_Count[i]
          }
          return obj;
        });

        exportFromJSON({ data: data, fileName: fileName, exportType: exportType });
      } else {
        NotificationManager.error("Data not found !!", '', 2000);
      }


    } else if (metricHeader == "Email Mitigation Applied") {
      if (realdata.anamaliesMitigation?.data?.uncategorized?.time_stamp?.length > 0) {
        let data = [];
        data = realdata.anamaliesMitigation?.data?.uncategorized?.time_stamp.map((time, i) => {
          let obj = {
            Date_Time: time,
            Count: realdata.anamaliesMitigation?.data?.uncategorized?.count[i]
          }
          return obj;
        });

        exportFromJSON({ data: data, fileName: fileName, exportType: exportType });
      } else {
        NotificationManager.error("Data not found !!", '', 2000);
      }

    } else if (metricHeader == "Anomalies Cluster Playback Failure") {
      if (realdata?.anamaliesCluster?.data != undefined) {
        let data = [];
        data = Object.keys(realdata?.anamaliesCluster?.data).map((res,i) => {
          let obj = {
            Playback_Failure_Name: res,
            Count:  Object.values(realdata?.anamaliesCluster?.data)[i],
          }
          return obj
        })
        exportFromJSON({ data: data, fileName: fileName, exportType: exportType });
      } else {
        NotificationManager.error("Data not found !!", '', 2000);
      }


    } else if (metricHeader == "Anomalies Cluster In Session") {
      if (realdata?.anamaliesClusterSession?.data != undefined) {
        let data = [];
        data = Object.keys(realdata?.anamaliesClusterSession?.data).map((res,i) => {
          let obj = {
            Diemension:res,
            Count: Object.values(realdata?.anamaliesClusterSession?.data)[i],
          }
          return obj
        })
        exportFromJSON({ data: data, fileName: fileName, exportType: exportType });
      } else {
        NotificationManager.error("Data not found !!", '', 2000);
      }
    }

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

  const searchMetricName = (e) => {
    const fullData = leftAnomolies;
    if (e.target.value !== "") {
      const data = fullData.filter((a) =>
        a.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setMetricList(data);
    } else {
      setMetricList(fullData);
    }
  };
  // useEffect(() => {
  if (metricHeader == "Total Anomalies Detected" && Object.keys(realdata.anamaliesDetected?.Items ? realdata.anamaliesDetected?.Items : {}).length > 0) {
    // total earns
    totalDetectedAnomalyGraph = {
      labels: realdata.anamaliesDetected?.Items && realdata.anamaliesDetected?.Items?.InSession?.length > 0 ? realdata.anamaliesDetected?.Items?.Timestamp : 0,
      datasets: [
        {
          label: "In Session",
          // fill: true,
          // lineTension: 0,
          // fillOpacity: 0.5,
          backgroundColor: "rgba(255, 0, 0, 0.2)",
          borderColor: ChartConfig.color.warning,
          // pointBorderColor: ChartConfig.color.white,
          // pointBackgroundColor: ChartConfig.color.white,
          // pointBorderWidth: 0,
          // pointHoverRadius: 5,
          // pointHoverBackgroundColor: hexToRgbA(ChartConfig.color.warning, 1),
          // pointHoverBorderColor: hexToRgbA(ChartConfig.color.warning, 1),
          // pointHoverBorderWidth: 8,
          // pointRadius: 0,
          // pointHitRadius: 10,
          data: realdata.anamaliesDetected?.Items && realdata.anamaliesDetected?.Items?.InSession?.length > 0 ? realdata.anamaliesDetected?.Items?.InSession : [],
        },
        {
          label: "Playback",
          // fill: true,
          // lineTension: 0,
          // fillOpacity: 0.5,
          backgroundColor: "rgba(0,0,255, 0.2)",
          borderColor: ChartConfig.color.info,
          // pointBorderColor: ChartConfig.color.white,
          // pointBackgroundColor: ChartConfig.color.white,
          // pointBorderWidth: 0,
          // pointHoverRadius: 5,
          // pointHoverBackgroundColor: hexToRgbA(ChartConfig.color.info, 1),
          // pointHoverBorderColor: hexToRgbA(ChartConfig.color.info, 1),
          // pointHoverBorderWidth: 8,
          // pointRadius: 0,
          // pointHitRadius: 10,
          data: realdata.anamaliesDetected?.Items && realdata.anamaliesDetected?.Items?.Playback.length > 0 ? realdata.anamaliesDetected?.Items?.Playback : [],
        },
      ],
    };
  } else if (metricHeader == "Total Anomalies RCA Buckets" && Object.keys(realdata.anamaliesRca?.Items ? realdata.anamaliesRca?.Items : {}).length > 0 && updatedGraphRCAData?.Label_Count) {
    let colorCode = [
      ' #800000',
      '#FF0000',
      '#800080',
      '#FF00FF',
      '#008000',
      '#00FF00',
      '#808000',
      '#FFFF00',
      '#000080',
      '#0000FF',
      '#008080',
      '#00FFFF',
    ]
    // total earns RCA Graph
    let rcaDataset = []
    let index = 0
    for (const key in realdata?.anamaliesRca?.Items?.Bucket_info) {
      index++;
      let obj = {
        label: key,
        // fill: true,
        // lineTension: 0,
        // fillOpacity: 0.5,
        backgroundColor: "rgba(0,0,255, 0.2)",
        borderColor: colorCode[index],
        // pointBorderColor: ChartConfig.color.white,
        // pointBackgroundColor: ChartConfig.color.white,
        // pointBorderWidth: 0,
        // pointHoverRadius: 5,
        // pointHoverBackgroundColor: hexToRgbA(colorCode[index], 1),
        // pointHoverBorderColor: hexToRgbA(colorCode[index], 1),
        // pointHoverBorderWidth: 8,
        // pointRadius: 0,
        // pointHitRadius: 10,
        data: realdata?.anamaliesRca?.Items?.Bucket_info[key],
      }
      rcaDataset.push(obj)

    }
    totalEarnsRcaGraph = {
      labels: updatedGraphRCAData?.Label_Count,

      datasets: rcaDataset,
    };
  } else if (metricHeader == "Email Mitigation Applied" && Object.keys(realdata.anamaliesMitigation?.data?.uncategorized ? realdata.anamaliesMitigation?.data?.uncategorized : {}).length > 0) {

    totalMitigationsAppliedGraph = {
      labels: realdata.anamaliesMitigation?.data?.uncategorized?.time_stamp.map(res => {
        return res.replace('T', ' ').replace('Z', '')
      }),
      datasets: [
        {
          label: "Email Mitigation Applied",
          backgroundColor: "rgba(0,255,0, 0.2)",
          borderColor: ChartConfig.color.primary,
          data: realdata.anamaliesMitigation?.data?.uncategorized?.count,
        }]
    }

  }
  console.log("abcd--", realdata.anamaliesMitigation);




  //filter-------------------------------------------

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
    // setErrorCode(val);
  };
  const getDeviceId = val => {
    // setDeviceId(val);
  };

  const getVideoId = val => {
    // setVideoId(val);
  };

  const getLive = val => {
    //  setLive(val);
  };

  const getDrm = val => {
    //setDrm(val);
  };

  const getHas = val => {
    // setHas(val);
  };

  const getNetwork = val => {
    setNetwork(val);
  };

  const getManufacturer = val => {
    setManufacturer(val);
  };

  const getBucketName = val => {
    setBucketname(val);
  };
  //-------------end--------------------------------------
  function isEmptyObject(obj) {
    return JSON.stringify(obj) === '{}';
  }

  return (
    <>
      <div className='row'>
        <div className='col-md-3'>
          <Paper className='SidePanel'>
            <h3 className='left-menu-title'>AI PIPELINE INSIGHTS</h3>
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

            <LeftMenu
              updateMetricHeader={updateMetricHeader}
              favorite={favorite}
              leftMenuMetrics={metricsList}
              updateMetric={updateMetric}
            />
          </Paper>
        </div>
        <div className='col-md-9 right-insight'>
          <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
            <Paper>
              <div className='graphcontentHead'>
                <span
                  style={{
                    fontSize: "12.5px",
                    fontWeight: 500,
                    textTransform: "capitalize",
                  }}
                >
                  {metricHeader}
                </span>
                <Stack direction='row' spacing={1} sx={{ float: "right" }} style={{ alignItems: 'center' }}>
                  <IconButton
                    color='primary'
                    aria-label='screenshot'
                    onClick={getImage}
                  >
                    <CameraAltOutlinedIcon color='disabled' />
                  </IconButton>
                  <IconButton
                    color='secondary'
                    aria-label='download'
                    onClick={downloadFile}
                  >
                    <FileDownloadOutlinedIcon color='disabled' />
                  </IconButton>
                  <IconButton aria-label='fullscreen' onClick={handle.enter}>
                    <FullscreenOutlinedIcon color='disabled' />
                  </IconButton>
                  {metricHeader == "Total Anomalies Detected" || metricHeader == "Total Anomalies RCA Buckets" || metricHeader == "Email Mitigation Applied" ?
                    <Box className='dropdownCont'>
                      <FormControl fullWidth className='intervalSelectwithLabel'>
                        <InputLabel id='intervalSelectwithLabel'>Interval</InputLabel>
                        <Select
                          labelId='intervalSelectwithLabel'
                          id='demo-simple-select'
                          value={aggregationInterval}
                          label='Interval'
                          onChange={changeInterval}
                          className='interSelect'
                        >
                          <MenuItem value='1s'>Sec</MenuItem>
                          <MenuItem value='1min'>Min</MenuItem>
                          <MenuItem value='1h'>Hour</MenuItem>
                          <MenuItem value='1d'>Day</MenuItem>
                          <MenuItem value='1w'>Week</MenuItem>
                          <MenuItem value='1m'>Month</MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                    : null}
                  <Box className='dropdownCont'>
                    <FormControl fullWidth className='intervalSelectwithLabel'>
                      <InputLabel id='intervalSelectwithLabel'>Date</InputLabel>
                      <Select
                        labelId='intervalSelectwithLabel'
                        id='demo-simple-select'
                        value={selectVal}
                        label='Interval'
                        onChange={setDataRange}
                        className='interSelect'
                      >
                        {/* <MenuItem value='min'>Min</MenuItem>*/}
                        <MenuItem value='1h'>Hour</MenuItem>
                        <MenuItem value='1d'>Day</MenuItem>
                        <MenuItem value='1w'>Week</MenuItem>
                        <MenuItem value='1m'>Month</MenuItem>
                        <MenuItem value='1y' disabled>Year</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box>
                    <div className='dateCountcustom'>
                      <div className='row eds-dateCont'>
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
                        <Box className='to' sx={{ mx: 2 }}> to </Box>
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
                    </div>
                  </Box>
                  {metricHeader == "Total Anomalies Detected" || metricHeader == "Total Anomalies RCA Buckets" ?
                    <Button
                      variant='contained'
                      className='btnFilter'
                      size='small'
                      endIcon={
                        <FilterDetectedAnamoliesGraph
                          getContentPartner={getContentPartner}
                          // getContentType={getContentType}
                          getLocation={getLocation}
                          // getDeviceId={getDeviceId}
                          // getVideoId={getVideoId}
                          // getHas={getHas}
                          // getDrm={getDrm}
                          getNetwork={getNetwork}
                          getManufacturer={getManufacturer}
                          getBucketName={getBucketName}
                          savePlatformData={savePlatformData}
                          // getLive={getLive}
                          // cdnVal={cdnVal}
                          // contentTypeVal={contentTypeVal}
                          contentPartnetVal={contentPartnetVal}
                          locationVal={locationVal}
                          devicePlatform={devicePlatform}
                          contentPartner={contentPartner}
                          // contentType={contentType}
                          location={location}
                          metricname={metricHeader}
                          manufacturer={manufacturer}
                          network={network}
                          bucketname={bucketname}
                        />}
                    ></Button> : null
                  }

                </Stack>
              </div>

              <FullScreen handle={handle}>
                <div className='wraper-graph take-screenshot'>
                  {!isLoadingData ? <>
                    {metricHeader == "Total Anomalies Detected" ? Object.keys(totalDetectedAnomalyGraph).length == 0 ? "Record Not Found" : <TotalEarnsWithAreaChart selectVal={aggregationInterval} chartData={totalDetectedAnomalyGraph} /> :
                      metricHeader == "Total Anomalies RCA Buckets" ? Object.keys(totalEarnsRcaGraph).length == 0 ? "Record Not Found" : <BarGraph selectVal={aggregationInterval} chartData={totalEarnsRcaGraph} type={"RCA_Bucket"} /> :
                        metricHeader == "Email Mitigation Applied" ? Object.keys(totalMitigationsAppliedGraph).length == 0 ? "Record Not Found" : <BarGraph selectVal={aggregationInterval} chartData={totalMitigationsAppliedGraph} type={"Mitigation"} /> :
                          metricHeader == "Anomalies Cluster Playback Failure" ? isEmptyObject(realdata?.anamaliesCluster?.data) ? "Record Not Found" : <div><PieChartCluster datasets={pieValueData} labels={pieLabelData} type={"playback"} /></div> :
                            isEmptyObject(realdata?.anamaliesClusterSession?.data) ? "Record Not Found" : <div><PieChartCluster datasets={pieValueData2} labels={pieLabelData2} type={"insession"} /></div>}
                  </> : <RctPageLoader />
                  }
                  {/* {realdata?.anamaliesClusterSession?.data==undefined && !isLoadingData ?"Record Not Found":null} */}

                </div>


              </FullScreen>
            </Paper>
          </Box>
        </div>
      </div>
    </>
  );
};

export default AiPipelineInsight;
