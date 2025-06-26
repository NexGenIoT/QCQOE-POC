import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Tooltip,
  TablePagination,
} from "@mui/material";
import {
  Box,
  Typography,
  Collapse,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import MatButton from "@material-ui/core/Button";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import domtoimage from "dom-to-image";
import { createFileName } from "use-react-screenshot";
import {
  getAnomaliesDetect,
  getAnomaliesDetectRecordCSV,
  getAnomalyPlayBackFailure,
  getCSVAnomalies,
  getLabeledRecordCSV,
  getSecondAnomalies,
  getSecondPlayBackFailureAnomalies,
  getThirdAnomalies,
  getUniqueFilters,
  setAnomaliesDetectRecordCSV,
  setSecondAnomalies,
  setSecondPlayBackFailureAnomalies,
  setThirdAnomalies,
} from "Store/Actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import { List } from "@amcharts/amcharts4/core";
import AnomalieCSVUpload from "./AnomalieCSVUpload";
import { NotificationManager } from "react-notifications";
import exportFromJSON from "export-from-json";
// for the Pop up
import Drawer from "@material-ui/core/Drawer";
import Paper from "@mui/material/Paper";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import loader from "../../Assets/img/react-spinner.gif";
import copy from "copy-to-clipboard";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DateRange } from "react-date-range";
import FilterLayout from "Components/QualityExperience/FilterLayout";
import FilterDetectedAnamoliesLayout from "Components/QualityExperience/FilterDetectedAnamoliesLayout";
import FilterAnomalyPlayback from "Components/QualityExperience/FilterAnomalyPlayback";
import { adminMessage, isValidPermission } from "Constants/constant";

const AnomalyPlayBackFailure = () => {
  const dispatch = useDispatch();
  const anomData = useSelector((state) => state.qoeReducer);
  const cdnVal = anomData?.filters?.cdn;
  const contentTypeVal = anomData?.filters?.content_type;
  const contentPartnetVal = anomData?.filters?.content_partner;
  const locationVal = anomData?.filters?.location;
  const errorCodeVal = anomData?.filters?.error_codes;
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [toDateCSV, setToDateCSV] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );
  const [fromSessionDate, setFromSessionDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [btn, setBtn] = useState("24hr");
  const [customDateValue, setCustomDateValue] = useState([null, null]);
  const [dashboardLoader, setDashboardLoader] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [indexes, setIndexes] = useState(-1);
  const [indexestrhee, setIndexesthree] = useState(-1);
  const [isUpload, setIsUpload] = useState(false);
  // for the POP UP
  const [isPreview, setIsPreview] = useState(false);

  // for the POP UP
  const [isThirdPreview, setIsThirdPreview] = useState(false);
  // for the dropdown
  const [selectVal, setSelectVal] = useState("1d");
  const [selectSessionVal, setSelectSessionVal] = useState("1d");

  const [isButtonUpload, setButtonUpload] = useState(false);
  const [array, setArray] = useState([]);
  const [file, setFile] = useState();
  const fileReader = new FileReader();
  const [anamolyScore, setAnamolyScore] = useState("0,3");
  const [ids, setIds] = useState([]);
  const [checkids, setCheckIds] = useState([]);
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);

  const [thirdIds, setThirdIds] = useState([]);
  const [selectAllThirdCheckbox, setSelectAllThirdCheckbox] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
    {
      startSessionDate: new Date(),
      endSessionDate: new Date(),
      key: "sessionSelection",
    },
  ]);
  const [openModal, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [startSessionDate, setStartSessionDate] = useState();
  const [endSessionDate, setEndSessionDate] = useState();
  const [cdn, setCdn] = useState([]);
  const [contentType, setContentType] = useState([]);
  const [contentPartner, setContentPartner] = useState([]);
  const [location, setLocation] = useState([]);
  const [errorCode, setErrorCode] = useState([]);
  const [deviceId, setDeviceId] = useState([]);
  const [videoId, setVideoId] = useState([]);
  const [live, setLive] = useState([]);
  const [has, setHas] = useState([]);
  const [drm, setDrm] = useState([]);
  const [network, setNetwork] = useState([]);
  const [manufacturer, setManufacturer] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [aggregationInterval, setAggregationInterval] = useState("1h");
  const [devicePlatform, setDevicePlatform] = useState([
    "Android",
    "iOS",
    "Web",
    "Firestick",
  ]);
  const [videoPlaybackId, setVideoPlaybackId] = useState();
  const [errorCount, setErrorCount] = useState("");
  const [errorName, setErrorName] = useState([]);
  const [errorCountSign, setErrorCountSign] = useState("");
  const [iSSecondLoader, setIsSecondLoader] = useState(false);
  const [iSThirdLoader, setIsThirdLoader] = useState(false);
  const [isEmptyFile, setIsEmptyFile] = useState(false);
  const [isLabelClicked, setIsLabelClicked] = useState(false);

  const applyManualMiti = () => {
    if (checkids.length > 0) {
      let toDate = endDate
        ? Math.floor(
            moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0
          )
        : Math.floor(new Date().getTime() / 1000.0);
      dispatch(
        getCSVAnomalies(
          dispatch,
          "admin",
          toDate,
          toDate,
          fromDate,
          checkids,
          "playbackfailure"
        )
      );
      setTimeout(() => {
        dispatch(
          getAnomalyPlayBackFailure(
            dispatch,
            toDate,
            fromDate,
            anamolyScore,
            rowsPerPage,
            ""
          )
        );
        setIds([]);
        setCheckIds([]);
      }, 1000);
      setIsPreview(false);
    }
  };
  const downloadLabelData = () => {
    setDownloadLoader(true);
    setIsLabelClicked(true);
    const filter = {
      anomaly_type: "playback",
    };
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    dispatch(getLabeledRecordCSV(dispatch, toDate, fromDate, filter));

    setTimeout(() => {
      setDownloadLoader(false);
    }, 7000);
  };

  useEffect(() => {
    const fileName =
      "labeled_data_playback_" +
      moment(Math.floor(new Date(fromDate).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      ) +
      "-" +
      moment(Math.floor(new Date(toDateCSV).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      );
    const exportType = exportFromJSON.types.csv;
    if (anomData?.labeledCSVRecord && isLabelClicked) {
      console.log("alabeled data--", anomData);

      if (anomData?.labeledCSVRecord?.Items.length > 0) {
        let data = [];
        data = anomData?.labeledCSVRecord?.Items.map((ERS_data) => {
          let fullDate = moment(Math.floor(new Date(ERS_data.dts))).format(
            "DD/MM/YYYY hh:mm a"
          );
          delete ERS_data.dts;
          ERS_data.Date_Time = "  " + fullDate.toString();
          return ERS_data;
        });

        exportFromJSON({
          data: data,
          fileName: fileName,
          exportType: exportType,
        });
        setIsLabelClicked(false);
      } else {
        setIsLabelClicked(false);
        NotificationManager.error("Data not found !!", "", 2000);
      }
    }
  }, [anomData?.labeledCSVRecord]);
  //To handle selecting and removing  all filtered results
  const selectAll = () => {
    setSelectAllCheckbox(!selectAllCheckbox);
    let tempArray = [];
    let all = [];
    if (!selectAllCheckbox) {
      // anomData?.anomaliesPlayBlackFailure?.data.map((m) => {
      //   return all.push(m);
      // });
      anomData?.anomaliesPlayBlackFailure?.data.map((res) => {
        // res.is_approved = 1
        // delete res.anomaly_description
        tempArray.push(res);
      });
      setIds(anomData?.anomaliesPlayBlackFailure?.data);
      setCheckIds(tempArray);
    } else if (selectAllCheckbox) {
      all = [];
      setIds([]);
      setCheckIds([]);
    }
  };

  const rejectData = () => {
    // setIds([]);
    if (ids.length > 0) {
      setIsPreview(true);
      nonAnomaly(ids);
      {
        selectAllCheckbox && setSelectAllCheckbox(false);
      }
    } else {
      NotificationManager.error(
        "Please select anomaly to reject or approve ",
        "",
        2000
      );
    }
  };
  useEffect(() => {
    const isEmpty = Object.keys(anomData?.filters).length === 0;
    if (isEmpty) {
      dispatch(getUniqueFilters(dispatch));
    }
  }, []);

  const onChangeCheckbox = (data1) => {
    let data = data1;
    setSelectAllCheckbox(false);
    // data.is_approved = 1;
    var datemili = new Date(data.dts).getTime(); // some mock date
    data.dts = datemili;
    data.error_count = 0;
    data.errorname = "";
    // delete data.approved;
    // delete data.anomaly_description;

    // delete data.sessionid;
    const currentIndex = ids.indexOf(data);
    const newChecked = [...ids];
    if (currentIndex === -1) {
      newChecked.push(data);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setIds(newChecked);
    //delete newChecked[0].anomaly_description
    setCheckIds(newChecked);
  };

  const arrangeFirstdTrailData = () => {
    if (checkids.length > 0) {
      //TODO
      let tempArray = [];
      checkids.map((data) => {
        data.is_approved = 1;
        data.errorname = "";
        delete data.approved;
        delete data.anomaly_description;
        if (selectAllCheckbox) {
          var datemili = new Date(data.dts).getTime(); // some mock date
          data.dts = datemili;
        }
        tempArray.push(data);
      });
      return tempArray;
    }
  };

  const nonAnomaly = (selectedData) => {
    if (selectedData.length > 0) {
      setIds(selectedData);

      let rejectArray = [];
      selectedData.map((res) => {
        res.is_approved = 0;
        res.errorname = "";
        delete res.anomaly_description;
        rejectArray.push(res);
      });
      setCheckIds(rejectArray);
      console.log("nonAnomaly--", rejectArray);
    }
  };

  // useEffect(() => {
  //   const isEmpty = Object.keys(anomData?.filters).length === 0;
  //   if (isEmpty) {
  //     dispatch(getUniqueFilters(dispatch));
  //   }
  // }, [dispatch, anomData?.filters]);

  // for the Pop
  // const confirmApprove = () => {
  //   setIsPreview(true)
  // }

  const confirmApprove = () => {
    if (checkids.length > 0) {
      setIsPreview(true);
      //setButtonType("Approve1")
      setCheckIds(arrangeFirstdTrailData());
    } else {
      NotificationManager.error(
        "Please select anomaly to reject or approve ",
        "",
        2000
      );
    }
  };

  const changeRefresh = (e) => {
    setEndDate();
    setStartDate();
    setAnamolyScore(e.target.value);
  };
  const uploadCsvFile = () => {
    console.log("call");
    setArray([]);
    setIsUpload(true);
  };
  const handleOnChange = (e) => {
    setIsEmptyFile(false);
    setArray([]); // for empty array
    setFile(e.target.files[0]);

    if (e.target.files[0]) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput);
        // csvFileToJSON(e.target.files[0])
      };
    }
  };
  const handleOnSubmit = (e) => {
    console.log("abcd--anomalie--", file);

    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput);

        // csvFileToJSON(file)
      };
      fileReader.readAsText(file);
      // let toDate =  endDate?Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0): Math.floor((new Date()).getTime() / 1000.0);
      console.log("abcd--handleOnSubmit--", array);

      if (array.length > 0) {
        array.filter((res) => {
          //to avoid udefined
          //if (res.anomaly_id == undefined) {
          if (res == undefined) {
            return array.splice(array.indexOf(res));
          }

          if (
            !res.anomaly_id &&
            !res.networktype &&
            !res.anomaly_explanation &&
            !res.anomaly_score &&
            !res.anomaly_type &&
            !res.content_partner &&
            !res.device_platform &&
            !res.dts &&
            !res.errorcode &&
            !res.error_count &&
            !res.location_city &&
            !res.videoid &&
            !res.errorname
          ) {
            return array.splice(array.indexOf(res));
          }
        });
        if (array.length > 0) {
          // setIds(array)
          const mainArray = [
            // "device_platform",
            // "content_partner",
            // "videoid",
            // "location_city",
            // "anomaly_score",
            // "anomaly_explanation",
            // "anomaly_id",
            // "error_count",
            // "anomaly_type",
            // "is_approved",
            // "errorcode",
            // "errorname",
            // "dts"
            "anomaly_id",
            "anomaly_explanation",
            "anomaly_score",
            "anomaly_type",
            "content_partner",
            "device_platform",
            "dts",
            "errorcode",
            "error_count",
            "is_approved",
            "location_city",
            "videoid",
            "errorname",
          ];
          const ArrayObjkeys = Object.keys(array[0]);

          console.log(ArrayObjkeys, "missing Arrays ArrayObjkeys");

          console.log(ArrayObjkeys.length, "check array");

          console.log(typeof ArrayObjkeys);
          const missingArray = mainArray.filter(
            (f) => !ArrayObjkeys.includes(f)
          );
          console.log(missingArray, "missing Arrays");
          if (missingArray.length > 0) {
            // if(missingArray.length>=12){
            //   NotificationManager.error("No Record Found","",2000);
            // }else{
            if (missingArray.includes("dts")) {
              missingArray[missingArray.indexOf("dts")] = "Date_Time";
            }
            const missingElements = missingArray.join(",\r\n");
            NotificationManager.error(
              `The following required colomns are missing in excel : ${missingElements}`,
              "",
              2000
            );

            // }
          } else {
            array.filter((res) => {
              //to avoid udefined
              if (res.anomaly_id == undefined) {
                // if (res == undefined) {
                return array.splice(array.indexOf(res));
              }
            });
            setCheckIds(array);
            setIsPreview(true);
            setIsUpload(false);
          }
        } else {
          NotificationManager.error(
            "Valid data not found in CSV File",
            "",
            2000
          );
        }
      } else if (!isEmptyFile) {
        NotificationManager.success(
          "File takes time to convert from csv to json format ! Please wait for sometime",
          "",
          3000
        );
      }
    }
  };
  const csvFileToArray = (string) => {
    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    let csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    let rowArray = [];
    if (csvRows.length == 1) {
      csvRows.map((res) => {
        if (res == "") {
          csvRows = [];
          setIsEmptyFile(true);
        } else {
          setIsEmptyFile(false);
        }
      });
    }
    if (csvRows.length > 0) {
      const array = csvRows.map((i) => {
        const values = i.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
        const obj = csvHeader.reduce((object, header, index) => {
          if (csvRows[index]) {
            rowArray.push(csvRows[index].split(","));
          }
          object[header.trim()] = values[index];
          return object;
        }, {});
        //obj.dts = parseInt(obj.dts)
        obj.error_count =
          obj.error_count == "null" ? 0 : parseInt(obj.error_count);
        // delete obj.anomaly_description;
        delete obj.manufacturer;
        delete obj.networktype;
        delete obj.live;
        delete obj.drm;
        delete obj.has;
        delete obj.device_id;
        delete obj.sessionid;
        delete obj.m_rebuffering_ratio;
        delete obj.m_bandwidth;
        delete obj.m_video_start_time;
        obj.errorname = "";
        obj.content_partner = "";
        // delete obj.is_approved;
        if (obj?.is_approved) {
          obj.is_approved =
            obj.is_approved == "0\r" ||
            obj.is_approved == "null" ||
            obj.is_approved == undefined
              ? parseInt(0)
              : parseInt(1);
        }
        // let mili = Math.floor(moment(obj.Date_Time).endOf("date")._d.getTime() / 1000.0)
        if (obj?.Date_Time) {
          let changedDate = moment(obj.Date_Time, "DD-MM-YYYY hh:mm").format(
            "MM/DD/YYYY HH:MM"
          );
          let mili = Math.floor(moment(changedDate).endOf("date")._d.getTime());
          obj.dts = mili;
          delete obj.Date_Time;
        }

        //if (obj?.anomaly_id != undefined) {
        return obj;
        //}
      });
      setArray(array);
    } else {
      setTimeout(() => {
        NotificationManager.error("No Record Found", "", 2000);
      }, 2000);
    }
  };

  // for the dropdown Date

  const setDataRange = (e) => {
    //setBtn("");
    setFromDate();
    setEndDate();
    setStartDate();
    setSelectVal(e.target.value);
    // for the dropdown
    let ts = Math.floor(moment().endOf("date")._d.getTime() / 1000.0);
    let fromDateRange;
    switch (e.target.value) {
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

      // case "1y": {

      //   fromDateRange = ts - 12 * 30 * 24 * 3600;

      //   setFromDate(fromDateRange);

      //   return;

      // }

      default:
        return;
    }
  };
  const setSessionDataRange = (e) => {
    setEndSessionDate();
    setStartSessionDate();
    setBtn("");
    setFromSessionDate();
    setSelectSessionVal(e.target.value);
    // for the dropdown
    // let ts = Math.floor(moment().endOf("date")._d.getTime() / 1000.0);
    let ts = Math.floor(new Date().getTime() / 1000.0);
    let fromSessionDateRange;
    switch (e.target.value) {
      case "1h": {
        fromSessionDateRange = ts - 3600;
        setFromSessionDate(fromSessionDateRange);
        return;
      }
      case "1d": {
        fromSessionDateRange = ts - 24 * 3600;
        setFromSessionDate(fromSessionDateRange);
        return;
      }
      case "1w": {
        fromSessionDateRange = ts - 7 * 24 * 3600;
        setFromSessionDate(fromSessionDateRange);
        return;
      }
      case "1m": {
        fromSessionDateRange = ts - 30 * 24 * 3600;
        setFromSessionDate(fromSessionDateRange);
        return;
      }
      default:
        return;
    }
  };
  useEffect(() => {
    setDashboardLoader(true);
    let filters = {
      videoId,
      deviceId,
      contentPartner,
      location,
      devicePlatform,
      errorCount,
      errorName,
      errorCode,
      errorCountSign,
      anamolyScore,
    };
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    setToDateCSV(toDate);
    dispatch(
      getAnomalyPlayBackFailure(
        dispatch,
        toDate,
        fromDate,
        anamolyScore,
        rowsPerPage,
        "",
        filters
      )
    );
    setTimeout(
      () => {
        setDashboardLoader(false);
      },
      btn == "weekly" ? 6000 : btn == "monthly" ? 6000 : 6000
    );
  }, [
    fromDate,
    endDate,
    anamolyScore,
    videoId,
    errorCode,
    errorCount,
    errorName,
    contentPartner,
    location,
    devicePlatform,
    errorCountSign,
  ]);

  const getImage = () => {
    setDownloadLoader(true);
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    setToDateCSV(toDate);

    //dispatch(setAnomaliesDetectRecordCSV([]));

    const fileName =
      "playback_failure_anomalies_" +
      moment(Math.floor(new Date(fromDate).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      ) +
      "-" +
      moment(Math.floor(new Date(toDateCSV).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      );
    const exportType = exportFromJSON.types.csv;
    const newData = getDetailedPlaybackAnomalyRecords(
      toDate,
      fromDate,
      anamolyScore
    );
    newData
      .then(function (res) {
        //console.log('csv data123', res);
        if (res?.Items.length > 0) {
          let data = [];
          data = res?.Items.map((ERS_data) => {
            let fullDate = moment(Math.floor(new Date(ERS_data.dts))).format(
              "DD/MM/YYYY hh:mm a"
            );
            console.log("  " + fullDate.toString(), "fullDate1");
            delete ERS_data.dts;
            ERS_data.Date_Time = "  " + fullDate.toString();
            return ERS_data;
          });
          exportFromJSON({
            data: data,
            fileName: fileName,
            exportType: exportType,
          });
        } else {
          NotificationManager.error("Data not found !!", "", 2000);
        }
        setDownloadLoader(false);
      })
      .catch(function () {
        setDownloadLoader(false);
      });
  };

  const savePlatformData = (val) => {
    setDevicePlatform(val);
  };

  const getDetailedPlaybackAnomalyRecords = (
    to_time,
    from_time,
    anamolyScore
  ) => {
    let filters = {
      videoId,
      contentPartner,
      contentType,
      location,
      devicePlatform,
      errorCode,
      errorCount,
      errorName,
      errorCountSign,
    };
    let filter = {};
    if (filters?.contentPartner.length > 0) {
      filter["content_partner"] = ["_in", filters.contentPartner];
    }
    if (filters?.devicePlatform.length > 0) {
      filter["device_platform"] = ["_in", filters.devicePlatform];
    }
    if (filters?.location.length > 0) {
      let temploc = [];
      filters.location.map((res) => {
        temploc.push(res.split("(")[0]);
      });
      filter["location_city"] = ["_in", temploc];
    }

    if (filters?.errorCode.length > 0) {
      filter["errorcode"] = ["_in", filters.errorCode];
    }
    //   if (Object.values(anamolyScore).length > 0) {
    let abcd = anamolyScore.replace(/"/g, "");
    let abcdef = abcd.split(",");
    filter["ANOMALY_SCORE"] = [
      "_range",
      [parseInt(abcdef[0]), parseInt(abcdef[1])],
    ];
    // }
    if (Object.values(filters.videoId).length > 0) {
      filter["videoid"] = ["_eq", filters.videoId];
    }
    // if (Object.values(filters?.errorName).length > 0) {
    //     filter["errorname"]  = ["_in", filters.errorName];
    // }
    if (
      Object.values(filters?.errorCount).length > 0 &&
      Object.values(filters?.errorCountSign).length > 0
    ) {
      filter["error_count"] = [filters.errorCountSign, [filters.errorCount]];
    }

    if (Object.values(filters?.errorName).length > 0) {
      filter["errorname"] = ["_in", [filters.errorName]];
    }

    let filterBody = {
      filters: filter,
    };
    const headers = {
      contentType: "application/json",
    };
    return fetch(
      `http://3.6.164.157:8084/api/GetDetailedPlaybackRecords?to_time=${to_time}&from_time=${from_time}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(filterBody),
      }
    ).then((res) => res.json());
  };

  const clickOnSeconDrawer = (index, video_id, condition) => {
    // setDashboardLoader(true)
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    // setIndexesthree(-1)
    setVideoPlaybackId(video_id);
    index === indexes ? setIndexes(-1) : setIndexes(index);
    setIsSecondLoader(true);
    dispatch(setSecondPlayBackFailureAnomalies([]));
    condition &&
      dispatch(
        getSecondPlayBackFailureAnomalies(
          dispatch,
          video_id,
          anamolyScore,
          toDate,
          fromDate
        )
      );
    setTimeout(() => {
      setIsSecondLoader(false);
    }, 12000);
  };
  const clickOnItem = (item, value) => {
    if (item) {
      NotificationManager.success(`${item} copied`, "", 200);
      copy(value);
    }
  };

  const handleChangePage = (event, newPage) => {
    console.log("handleChangePage---abc--", newPage, anomData?.anomaliesDetect);
    //setDashboardLoader(true)
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    if (newPage > page) {
      dispatch(
        getAnomalyPlayBackFailure(
          dispatch,
          toDate,
          fromDate,
          anamolyScore,
          page,
          anomData?.anomaliesPlayBlackFailure?.next_iteration_id
            ? anomData?.anomaliesPlayBlackFailure?.next_iteration_id
            : ""
        )
      ); //this will run when next_iteration_id have data to show pagination
    }
    setPage(newPage);
    setTimeout(() => {
      //  setDashboardLoader(false)
    }, 6000);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const submit = () => {
    setSelectVal("");
    setSelectSessionVal("");
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    setModalOpen(false);
    // setStartSessionDate(range[1].startSessionDate);
    // setEndSessionDate(range[1].endSessionDate);
    setToDateCSV(
      Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
    );
    setFromDate(
      Math.floor(
        moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0
      ) -
        24 * 3600
    );
    // setToDateCSV(Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0))
    //setFromDate(Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0))
    // setDashboardLoader(true)
    // dispatch(getAnomalyPlayBackFailure(dispatch, Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0), anamolyScore, rowsPerPage, ""))
    // setTimeout(() => {
    //   setDashboardLoader(false)
    // }, 5000);
  };

  const getVideoId = (val) => {
    setVideoId(val);
  };

  const getErrorCode = (val) => {
    setErrorCode(val);
  };

  const getErrorCountSign = (val) => {
    setErrorCountSign(val);
  };

  const getContentPartner = (val) => {
    setContentPartner(val);
  };
  const getLocation = (val) => {
    setLocation(val);
  };

  const getErrorCount = (val) => {
    setErrorCount(val);
  };

  const getErrorNameData = (val) => {
    setErrorName(val);
  };

  const removeDeviceId = (type) => {
    const data = deviceId;
    const final = data.filter((d) => d !== type);
    setDeviceId(final);
  };

  const removeVideoId = (type) => {
    const data = videoId;
    const final = data.filter((d) => d !== type);
    setVideoId(final);
  };

  const removeLive = (type) => {
    const data = live;
    const final = data.filter((d) => d !== type);
    setLive(final);
  };

  const removeHas = (type) => {
    const data = has;
    const final = data.filter((d) => d !== type);
    setHas(final);
  };

  const removeDrm = (type) => {
    const data = drm;
    const final = data.filter((d) => d !== type);
    setDrm(final);
  };

  const removeManufacturer = (type) => {
    const data = manufacturer;
    const final = data.filter((d) => d !== type);
    setManufacturer(final);
  };

  const removeNetwork = (type) => {
    const data = network;
    const final = data.filter((d) => d !== type);
    setNetwork(final);
  };

  const removeErrorCode = (type) => {
    const data = errorCode;
    const final = data.filter((d) => d !== type);
    setErrorCode(final);
  };

  useEffect(() => {
    let filters = {
      videoId,
      contentPartner,
      contentType,
      location,
      devicePlatform,
      errorCode,
      errorCount,
      errorName,
      errorCountSign,
      anamolyScore,
    };
    let toDate = endSessionDate
      ? Math.floor(
          moment(range[1].endSessionDate).endOf("date")._d.getTime() / 1000.0
        )
      : Math.floor(new Date().getTime() / 1000.0);
    dispatch(
      getSecondPlayBackFailureAnomalies(
        dispatch,
        videoPlaybackId,
        anamolyScore,
        toDate,
        fromSessionDate,
        filters
      )
    );
    setTimeout(() => {
      setDashboardLoader(false);
    }, [3000]);
  }, [
    fromSessionDate,
    anamolyScore,
    videoId,
    contentPartner,
    location,
    devicePlatform,
    errorCount,
    errorCode,
    errorName,
    errorCountSign,
  ]);

  const checkpermission = () => {
    if (isValidPermission("WRITE_DETECTED_ANOMALIES")) {
      uploadCsvFile();
    } else {
      NotificationManager.error(adminMessage.message);
    }
  };

  return (
    <>
      <div className="cta-btn">
        {anomData?.anomaliesPlayBlackFailure?.data &&
        anomData?.anomaliesPlayBlackFailure?.data.length ? (
          <div className="top-left-nav">
            <Typography
              variant="h5"
              style={{ fontSize: "1.2rem", paddingLeft: "13px" }}
            >
              Playblack Failure (
              {anomData?.anomaliesPlayBlackFailure?.data.length})
            </Typography>
          </div>
        ) : null}
        <div className="status-report">
          {/* <Box className='anomalyScorefilter'> */}
          <div className="interval-spase">
            <FormControl className="intervalSelect-eds ">
              <InputLabel className="intervalSelectSub" id="intervalSelect">
                Anomaly Score Range
              </InputLabel>
              <Select
                labelId="intervalSelect"
                id="demo-simple-select"
                value={anamolyScore}
                label="Interval"
                onChange={changeRefresh}
                className="interSelect"
              >
                <MenuItem value={"0,3"}>0-3</MenuItem>
                <MenuItem value={"4,6"}>4-6</MenuItem>
                <MenuItem value={"7,8"}>7-8</MenuItem>
                <MenuItem value={"8-10"}>8-10</MenuItem>
                <MenuItem value={"10,12"}>10-12</MenuItem>
              </Select>
            </FormControl>
          </div>
          {/* </Box> */}
          <FormControl className="intervalSelect-eds">
            <InputLabel className="intervalSelectSub" id="intervalSelect">
              Session Interval
            </InputLabel>
            <Select
              labelId="intervalSelect"
              id="demo-simple-select"
              value={selectSessionVal}
              label="Interval"
              onChange={setSessionDataRange}
              className="interval-spase anomalyScorefilter"
            >
              <MenuItem value="1h">1 Hour</MenuItem>
              <MenuItem value="1d">Day</MenuItem>
              <MenuItem value="1w">Week</MenuItem>
              <MenuItem value="1m">Month</MenuItem>
              {/* <MenuItem value='1y'>Year</MenuItem> */}
            </Select>
          </FormControl>
          <FormControl className="intervalSelect-eds">
            <InputLabel className="intervalSelectSub" id="intervalSelect">
              Anomaly Date
            </InputLabel>
            <Select
              labelId="intervalSelect"
              id="demo-simple-select"
              value={selectVal}
              label="Interval"
              onChange={setDataRange}
              className="interval-spase anomalyScorefilter"
            >
              <MenuItem value="1d">Day</MenuItem>
              <MenuItem value="1w">Week</MenuItem>
              <MenuItem value="1m">Month</MenuItem>
              {/* <MenuItem value='1y'>Year</MenuItem> */}
            </Select>
          </FormControl>
          {/* <MatButton
            onClick={() => {
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
              );
              setBtn("24hr");
              setIndexesthree(-1)
              setIndexes(-1)
              setDashboardLoader(true)
              setSelectVal('');
              setEndDate()
              setStartDate()
            }}
            className={btn === "24hr" ? "Status-btn-active" : "Status-btn"}
          >
            24hrs
          </MatButton>
          <MatButton
            onClick={() => {
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 7 * 24 * 3600
              );
              setBtn("weekly");
              setIndexesthree(-1)
              setIndexes(-1)
              setDashboardLoader(true)
              setSelectVal('');
              setEndDate()
              setStartDate()
            }}
            className={btn === "weekly" ? "Status-btn-active" : "Status-btn"}
          >
            48hrs
          </MatButton>
          <MatButton
            onClick={() => {
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 30 * 24 * 3600
              );
              setBtn("monthly");
              setIndexesthree(-1)
              setIndexes(-1)
              setDashboardLoader(true)
              setSelectVal('');
              setEndDate()
              setStartDate()
            }}
            className={btn === "monthly" ? "Status-btn-active" : "Status-btn"}
          >
            72hrs
          </MatButton> */}
          <div className="dateCountcustom">
            <div className="row eds-dateCont">
              <span>Custom Date</span>
              <TextField
                onClick={() => setModalOpen(true)}
                contentEditable={false}
                value={startDate ? moment(startDate).format("DD/MM/YYYY") : ""}
                placeholder="dd-mm-yyyy"
              />
              <Box className="to" sx={{ mx: 2 }}>
                {" "}
                to{" "}
              </Box>
              <TextField
                onClick={() => setModalOpen(true)}
                contentEditable={false}
                value={endDate ? moment(endDate).format("DD/MM/YYYY") : ""}
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
          </div>
          <MatButton
            className="Status-btn"
            style={{ fontSize: "19px", color: "#e20092" }}
            onClick={getImage}
          >
            {" "}
            <Tooltip title="Download Anomaly Data Not Labeled" arrow>
              <i className="zmdi zmdi-download"></i>
            </Tooltip>
          </MatButton>
          <MatButton
            className="Status-btn"
            style={{ fontSize: "19px", color: "#e20092" }}
            onClick={checkpermission}
          >
            {" "}
            <Tooltip title="Upload CSV File" arrow>
              <i className="zmdi zmdi-upload"></i>
            </Tooltip>
          </MatButton>
          <Tooltip title="Download Anomaly Labeled Data" arrow>
            <MatButton
              className="Status-btn"
              style={{ fontSize: "13px", color: "#e20092" }}
              onClick={downloadLabelData}
            >
              {"Labeled "}
              <i
                style={{ margin: "0 0 0 7px" }}
                className="zmdi zmdi-download"
              ></i>
            </MatButton>
          </Tooltip>
          <Button
            variant="contained"
            className="btnFilter"
            size="small"
            endIcon={
              <FilterAnomalyPlayback
                getContentPartner={getContentPartner}
                getLocation={getLocation}
                getVideoId={getVideoId}
                contentPartnetVal={contentPartnetVal}
                locationVal={locationVal}
                errorCodeVal={errorCodeVal}
                devicePlatform={devicePlatform}
                contentPartner={contentPartner}
                location={location}
                videoId={videoId}
                errorCountSign={errorCountSign}
                savePlatformData={savePlatformData}
                getErrorCount={getErrorCount}
                getErrorNameData={getErrorNameData}
                getErrorCountSign={getErrorCountSign}
                errorCount={errorCount}
                errorName={errorName}
                getErrorCode={getErrorCode}
                errorCode={errorCodeVal}
              />
            }
          />
        </div>
      </div>
      {downloadLoader ? (
        <div
          style={{
            height: "100vh",
            width: "100vw",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "rgb(0, 0, 0,0.3)",
            zIndex: 5,
          }}
        >
          <RctPageLoader />
        </div>
      ) : (
        ""
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
          {anomData?.anomaliesPlayBlackFailure?.data &&
          anomData?.anomaliesPlayBlackFailure?.data.length > 0 ? (
            <div className="full-table" style={{ marginTop: "10px" }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead style={{ marginTop: "10px" }}>
                    <TableRow
                      style={{
                        borderBottom: "1px solid white",
                        color: "rgb(151 151 151 / 87%)",
                      }}
                      sx={{ border: 0 }}
                    >
                      <TableCell></TableCell>
                      <TableCell>Video ID</TableCell>
                      <TableCell>Anomaly ID</TableCell>
                      <TableCell>Anomaly Score</TableCell>
                      <TableCell>Anomaly Type</TableCell>
                      <TableCell>Date/Time</TableCell>
                      <TableCell>Approval</TableCell>
                      <TableCell>Location City</TableCell>
                      <TableCell>Content Partner</TableCell>
                      <TableCell>Platform</TableCell>
                      <TableCell>Error Count</TableCell>
                      <TableCell>Error Name</TableCell>
                      <TableCell>Error Code</TableCell>
                      <TableCell>Anomaly Description</TableCell>
                      <TableCell>
                        Anomaly Explanation
                        <Tooltip
                          title="Attribution score: A nonnegative number that indicates how much this column has contributed to the anomaly score of the record. In other words, it indicates how different the value of this column is from what’s expected based on the recently observed trend. The sum of the attribution scores of all columns for the record is equal to the anomaly score.
                                        Strength: A nonnegative number representing the strength of the directional recommendation. A high value for strength indicates a high confidence in the directionality that is returned by the function. During the learning phase, the strength is 0.
                                        Directionality: This is either HIGH if the value of the column is above the recently observed trend or LOW if it’s below the trend. During the learning phase, this defaults to LOW."
                          arrow
                        >
                          <InfoOutlinedIcon />
                        </Tooltip>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  {anomData?.anomaliesPlayBlackFailure?.data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((list, index) => {
                      let fullDate = Math.floor(
                        new Date(list?.dts).getTime() * 1000.0
                      );
                      return (
                        <>
                          <TableRow
                            // style={{
                            //   borderBottom: "1px solid white",
                            //   color: "rgb(151 151 151 / 87%)",
                            // }}
                            sx={{ border: 0 }}
                          >
                            <TableCell>
                              {index === indexes ? (
                                <i
                                  onClick={() => {
                                    setIsSecondLoader(false);
                                    clickOnSeconDrawer(
                                      index,
                                      list?.device_id,
                                      false
                                    );
                                  }}
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "24px",
                                  }}
                                  className="zmdi zmdi-minus-circle"
                                ></i>
                              ) : (
                                <i
                                  style={{
                                    cursor: "pointer",
                                    fontSize: "24px",
                                  }}
                                  onClick={() => {
                                    setIsSecondLoader(true);
                                    clickOnSeconDrawer(
                                      index,
                                      list?.videoid,
                                      true
                                    );
                                  }}
                                  className="zmdi zmdi-plus-circle"
                                ></i>
                              )}
                            </TableCell>
                            <TableCell>{list?.videoid}</TableCell>
                            <TableCell>
                              {" "}
                              <p
                                className="anomalyptag"
                                onClick={() =>
                                  clickOnItem("Anomaly ID", list?.ANOMALY_ID)
                                }
                              >
                                {" "}
                                <span
                                  className="zmdi zmdi-copy"
                                  style={{ fontSize: "1.2rem" }}
                                ></span>{" "}
                                {list?.ANOMALY_ID}
                              </p>
                            </TableCell>
                            <TableCell>{list?.ANOMALY_SCORE}</TableCell>
                            <TableCell>{list?.Anomaly_Type}</TableCell>
                            <TableCell>
                              {moment(fullDate / 1000).format("DD-MM-YYYY") +
                                " | " +
                                moment(fullDate / 1000)
                                  .utcOffset(330)
                                  .format("hh:mm:a")}
                            </TableCell>
                            <TableCell>
                              {list?.is_approved == 0
                                ? "Not-Approved"
                                : list?.is_approved == 1
                                ? "Approved"
                                : "Pending-Approval"}
                            </TableCell>
                            <TableCell>{list?.location_city}</TableCell>
                            <TableCell>{list?.content_partner}</TableCell>
                            <TableCell>{list?.device_platform}</TableCell>
                            <TableCell>{list?.error_count}</TableCell>
                            <TableCell>
                              {list?.errorname ? list?.errorname : "--"}
                            </TableCell>
                            <TableCell>{list?.errorcode}</TableCell>
                            <TableCell>
                              <p
                                className="anomalyptag"
                                onClick={() =>
                                  clickOnItem(
                                    "Anomaly Description",
                                    list?.anomaly_description
                                  )
                                }
                              >
                                {" "}
                                {list?.anomaly_description !== "-" && (
                                  <span
                                    className="zmdi zmdi-copy"
                                    style={{ fontSize: "1.2rem" }}
                                  ></span>
                                )}{" "}
                                {list?.anomaly_description !== "-"
                                  ? list?.anomaly_description
                                  : "N/A"}
                              </p>
                            </TableCell>
                            <TableCell>
                              <p
                                className="anomalyptag"
                                onClick={() =>
                                  clickOnItem(
                                    "Anomaly Explanation",
                                    list?.ANOMALY_EXPLANATION
                                  )
                                }
                              >
                                {" "}
                                <span
                                  className="zmdi zmdi-copy"
                                  style={{ "font-size": "1.2rem" }}
                                ></span>{" "}
                                {list?.ANOMALY_EXPLANATION}
                              </p>
                            </TableCell>
                            <TableCell>
                              <Checkbox
                                disabled={
                                  !isValidPermission("WRITE_DETECTED_ANOMALIES")
                                }
                                onChange={() => onChangeCheckbox(list)}
                                edge="start"
                                checked={ids.indexOf(list) !== -1}
                              />
                            </TableCell>
                          </TableRow>

                          {/* second trail---------------start------------------------- */}
                          <TableRow>
                            <TableCell
                              style={{ paddingBottom: 0, paddingTop: 0 }}
                              colSpan={15}
                            >
                              <Collapse
                                in={indexes === index}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box sx={{ margin: 1 }}>
                                  <Table>
                                    {/*  */}
                                    <TableHead>
                                      <TableRow>
                                        <TableCell>Video ID</TableCell>
                                        <TableCell>Anomaly ID</TableCell>
                                        <TableCell>Anomaly Score</TableCell>
                                        <TableCell>Anomaly Type</TableCell>
                                        <TableCell>Date/Time</TableCell>
                                        <TableCell>Approval</TableCell>
                                        <TableCell>Location City</TableCell>
                                        <TableCell>Content Partner</TableCell>
                                        <TableCell>Platform</TableCell>
                                        <TableCell>Error Count</TableCell>
                                        <TableCell>Error Name</TableCell>
                                        <TableCell>Error Code</TableCell>
                                        <TableCell>
                                          Anomaly Description
                                        </TableCell>
                                        <TableCell>
                                          Anomaly Explanation{" "}
                                        </TableCell>
                                        <TableCell></TableCell>
                                      </TableRow>
                                    </TableHead>
                                    {anomData?.anomaliesPlayBlackFailureByVid
                                      ?.Items &&
                                    anomData?.anomaliesPlayBlackFailureByVid
                                      ?.Items.length > 0 ? (
                                      anomData?.anomaliesPlayBlackFailureByVid?.Items.map(
                                        (list, index2) => {
                                          let fullDate = Math.floor(
                                            new Date(list?.dts).getTime() *
                                              1000.0
                                          );
                                          return (
                                            <>
                                              <TableRow
                                                key={index2}
                                                style={{
                                                  backgroundColor: "#ffffff",
                                                  borderBottom: "0px",
                                                }}
                                              >
                                                <TableCell>
                                                  {list?.videoid}
                                                </TableCell>
                                                <TableCell>
                                                  {" "}
                                                  <p
                                                    className="anomalyptag"
                                                    onClick={() =>
                                                      clickOnItem(
                                                        "Anomaly ID",
                                                        list?.anomaly_id
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    <span
                                                      className="zmdi zmdi-copy"
                                                      style={{
                                                        "font-size": "1.2rem",
                                                      }}
                                                    ></span>{" "}
                                                    {list?.anomaly_id}
                                                  </p>
                                                </TableCell>
                                                <TableCell>
                                                  {list?.anomaly_score}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.anomaly_type}
                                                </TableCell>
                                                <TableCell>
                                                  {moment(
                                                    fullDate / 1000
                                                  ).format("DD-MM-YYYY") +
                                                    " | " +
                                                    moment(fullDate / 1000)
                                                      .utcOffset(330)
                                                      .format("hh:mm:a")}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.is_approved == 0
                                                    ? "Not-Approved"
                                                    : list?.is_approved == 1
                                                    ? "Approved"
                                                    : "Pending-Approval"}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.location_city}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.content_partner}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.device_platform}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.error_count}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.errorname
                                                    ? list?.errorname
                                                    : "--"}
                                                </TableCell>
                                                <TableCell>
                                                  {list?.errorcode}
                                                </TableCell>
                                                <TableCell>
                                                  <p
                                                    className="anomalyptag"
                                                    onClick={() =>
                                                      clickOnItem(
                                                        "Anomaly Description",
                                                        list?.anomaly_description
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    {list?.anomaly_description !==
                                                      "-" && (
                                                      <span
                                                        className="zmdi zmdi-copy"
                                                        style={{
                                                          fontSize: "1.2rem",
                                                        }}
                                                      ></span>
                                                    )}{" "}
                                                    {list?.anomaly_description !==
                                                    "-"
                                                      ? list?.anomaly_description
                                                      : "N/A"}
                                                  </p>
                                                </TableCell>
                                                <TableCell>
                                                  <p
                                                    className="anomalyptag"
                                                    onClick={() =>
                                                      clickOnItem(
                                                        "Anomaly Explanation",
                                                        list?.anomaly_explanation
                                                      )
                                                    }
                                                  >
                                                    {" "}
                                                    <span
                                                      className="zmdi zmdi-copy"
                                                      style={{
                                                        "font-size": "1.2rem",
                                                      }}
                                                    ></span>{" "}
                                                    {list?.anomaly_explanation}
                                                  </p>
                                                </TableCell>
                                                <TableCell>
                                                  <Checkbox
                                                    disabled={
                                                      !isValidPermission(
                                                        "WRITE_DETECTED_ANOMALIES"
                                                      )
                                                    }
                                                    onChange={() =>
                                                      onChangeCheckbox(list)
                                                    }
                                                    edge="start"
                                                    checked={
                                                      ids.indexOf(list) !== -1
                                                    }
                                                  />
                                                </TableCell>
                                              </TableRow>
                                            </>
                                          );
                                        }
                                      )
                                    ) : iSSecondLoader ? (
                                      <span
                                        style={{
                                          height: 90,
                                          alignSelf: "center",
                                          alignItems: "center",
                                          marginLeft: "50%",
                                        }}
                                      >
                                        <img
                                          src={loader}
                                          style={{ marginLeft: "30%" }}
                                        />
                                      </span>
                                    ) : (
                                      "Record Not Found"
                                    )}
                                  </Table>
                                </Box>
                              </Collapse>
                            </TableCell>
                          </TableRow>
                          {/* second trail---------------end------------------------- */}
                        </>
                      );
                    })}
                  {/* </> */}
                </Table>
              </TableContainer>
              {/* {anomData?.anomaliesPlayBlackFailure?.next_iteration_id !== "" ? */}
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={anomData?.anomaliesPlayBlackFailure?.size}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="paginationstyle"
              />
              {/* : null */}
              {/* } */}

              <div className="apply-container">
                <Checkbox
                  disabled={!isValidPermission("WRITE_DETECTED_ANOMALIES")}
                  onChange={() => selectAll()}
                  checked={selectAllCheckbox}
                />
                <MatButton className="apply-filter-btn"> Select All </MatButton>
                <div className="right-aligne-button">
                  <MatButton className="apply-filter-btn" onClick={rejectData}>
                    Reject
                  </MatButton>

                  <MatButton
                    onClick={confirmApprove}
                    className="apply-btn"
                    style={{
                      fontSize: "0.875rem",
                      color: "#008eff",
                      width: "100px",
                      height: "28px",
                      fontWeight: "600",
                    }}
                  >
                    Approve
                  </MatButton>
                </div>
              </div>
            </div>
          ) : (
            <h2
              style={{
                textAlign: "center",
                marginLeft: "112px",
                marginTop: "113px",
              }}
            >
              {" "}
              No Records Found
            </h2>
          )}

          <Drawer
            anchor="bottom"
            open={isPreview}
            onClose={() => setIsPreview(false)}
            className="drawer-mitigation"
          >
            <div className="drawer-header">
              <span>
                {" "}
                <i
                  onClick={() => setIsPreview(false)}
                  className="zmdi zmdi-arrow-left"
                ></i>{" "}
                Preview Data ({checkids?.length})
              </span>
              <i
                onClick={() => {
                  setIds([]);
                  setCheckIds([]);
                  setIsPreview(false);
                  {
                    selectAllCheckbox && setSelectAllCheckbox(false);
                  }
                }}
                className="zmdi zmdi-close"
              ></i>
            </div>

            <Table>
              <TableHead
                style={{ backgroundColor: "#ffffff", borderBottom: "#ffffff" }}
              >
                <TableRow
                  style={{
                    borderBottom: "1px solid white",
                    color: "rgb(151 151 151 / 87%)",
                  }}
                  sx={{ border: 0 }}
                >
                  <TableCell>Video ID</TableCell>
                  <TableCell>Anomaly ID</TableCell>
                  <TableCell>Anomaly Score</TableCell>
                  <TableCell>Anomaly Type</TableCell>
                  <TableCell>Date/Time</TableCell>
                  <TableCell>Approval</TableCell>
                  <TableCell>Location City</TableCell>
                  <TableCell>Content Partner</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Error Count</TableCell>
                  <TableCell>Error Name</TableCell>
                  <TableCell>Error Code</TableCell>
                  {/* <TableCell>Anomaly Description</TableCell> */}
                  <TableCell>Anomaly Explanation </TableCell>
                </TableRow>
              </TableHead>
              {console.log("checkids--", checkids)}
              {checkids.length > 0 ? (
                checkids.map((list, index) => {
                  let fullDate = Math.floor(
                    new Date(list?.dts).getTime() * 1000.0
                  );
                  return (
                    <TableRow
                      style={{
                        borderBottom: "1px solid white",
                        color: "rgb(151 151 151 / 87%)",
                      }}
                      sx={{ border: 0 }}
                    >
                      <TableCell>{list?.videoid}</TableCell>
                      <TableCell>
                        {" "}
                        <p className="anomalyptag">
                          {" "}
                          {list?.ANOMALY_ID || list?.anomaly_id}
                        </p>
                      </TableCell>
                      <TableCell>
                        {list?.ANOMALY_SCORE || list?.anomaly_score}
                      </TableCell>
                      <TableCell>
                        {list?.Anomaly_Type || list?.anomaly_type}
                      </TableCell>
                      <TableCell>
                        {moment(fullDate / 1000).format("DD-MM-YYYY") +
                          " | " +
                          moment(fullDate / 1000)
                            .utcOffset(330)
                            .format("hh:mm:a")}
                      </TableCell>
                      <TableCell>
                        {list?.is_approved == 0
                          ? "Not-Approved"
                          : list?.is_approved == 1
                          ? "Approved"
                          : "Pending-Approval"}
                      </TableCell>
                      <TableCell>{list?.location_city}</TableCell>
                      <TableCell>{list?.content_partner}</TableCell>
                      <TableCell>{list?.device_platform}</TableCell>
                      <TableCell>{list?.error_count}</TableCell>
                      <TableCell>
                        {list?.errorname ? list?.errorname : "--"}
                      </TableCell>
                      <TableCell>{list?.errorcode}</TableCell>
                      {/* <TableCell><p className='anomalyptag' >{list?.anomaly_description}</p></TableCell> */}
                      <TableCell>
                        <p className="anomalyptag">
                          {" "}
                          {list?.ANOMALY_EXPLANATION ||
                            list?.anomaly_explanation}
                        </p>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <span
                  style={{
                    height: 90,
                    alignSelf: "center",
                    alignItems: "center",
                    marginLeft: "50%",
                  }}
                >
                  <img src={loader} style={{ marginLeft: "30%" }} />
                </span>
              )}
            </Table>
            {/* <div className='apply-container'>
                <Checkbox
                  onChange={() => selectAll()}
                  checked={selectAllCheckbox}
                />
                <MatButton className='apply-filter-btn'
                > Select All </MatButton>
                <div className='right-aligne-button'>
                  <MatButton
                    className='apply-filter-btn'
                    onClick={rejectData}
                  >Reject</MatButton>

                  <MatButton
                    onClick={confirmApprove}
                    className='apply-btn'
                    style={{
                      fontSize: "0.875rem",
                      color: "#008eff",
                      width: "100px",
                      height: "28px",
                      fontWeight: "600",
                    }}
                  >
                    Approve
                  </MatButton>
                </div>
              </div>  */}
            <div style={{ display: "flex", margin: "auto" }}>
              <MatButton
                className="Status-btn"
                style={{
                  fontSize: "10px",
                  color: "#ffffff",
                  backgroundColor: "#e20092",
                }}
                onClick={applyManualMiti}
              >
                {"Yes"}
              </MatButton>{" "}
              &nbsp;&nbsp;&nbsp;
              <MatButton
                className="Status-btn"
                style={{
                  fontSize: "10px",
                  color: "#ffffff",
                  backgroundColor: "#e20092",
                }}
                onClick={() => {
                  setIds([]);
                  setCheckIds([]);
                  setIsPreview(false);
                  {
                    selectAllCheckbox && setSelectAllCheckbox(false);
                  }
                }}
              >
                {"No"}
              </MatButton>
            </div>
          </Drawer>
          <AnomalieCSVUpload
            title="Upload CSV File"
            isOpen={isUpload}
            onClose={() => {
              setIsUpload(false);
            }}
          >
            <div style={{ textAlign: "center", margin: "20px" }}>
              <form>
                <input
                  type={"file"}
                  id={"csvFileInput"}
                  accept={".csv"}
                  onChange={handleOnChange}
                />
                <MatButton
                  className="Status-btn"
                  style={{
                    fontSize: "10px",
                    color: "#ffffff",
                    backgroundColor: "#e20092",
                  }}
                  onClick={(e) => {
                    handleOnSubmit(e);
                  }}
                >
                  {"UPLOAD CSV"}
                </MatButton>
              </form>
            </div>
          </AnomalieCSVUpload>
        </>
      )}
    </>
  );
};

export default AnomalyPlayBackFailure;
