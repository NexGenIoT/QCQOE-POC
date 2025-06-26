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
  getCSVAnomalies,
  getLabeledRecordCSV,
  getSecondAnomalies,
  getThirdAnomalies,
  getUniqueFilters,
  setAnomaliesDetectRecordCSV,
  setSecondAnomalies,
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
import { indexOf } from "@amcharts/amcharts4/.internal/core/utils/Array";
import FilterLayout from "Components/QualityExperience/FilterLayout";
import AppliedFilters from "Components/QualityExperience/AppliedFilters";
import FilterDetectedAnamoliesLayout from "Components/QualityExperience/FilterDetectedAnamoliesLayout";
import { adminMessage, isValidPermission } from "Constants/constant";
import { isMatch } from "date-fns";

const AnomaliesTable = () => {
  const dispatch = useDispatch();
  const anomData = useSelector((state) => state.qoeReducer);
  const cdnVal = anomData?.filters?.cdn;
  const contentTypeVal = anomData?.filters?.content_type;
  const contentPartnetVal = anomData?.filters?.content_partner;
  const locationVal = anomData?.filters?.location;
  const errorCodeVal = anomData?.filters?.error_codes;
  const errorRecordData = anomData?.errorRecordData?.items;
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [fromSessionDate, setFromSessionDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [toDateCSV, setToDateCSV] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );

  const [btn, setBtn] = useState("24hr");
  const [customDateValue, setCustomDateValue] = useState([null, null]);
  const [dashboardLoader, setDashboardLoader] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [indexes, setIndexes] = useState(-1);
  const [indexestrhee, setIndexesthree] = useState(-1);
  const [isUpload, setIsUpload] = useState(false);
  // const [devicePlatform, setDevicePlatform] = useState(["dummy"]);
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
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);

  const [thirdIds, setThirdIds] = useState([]);
  const [selectAllThirdCheckbox, setSelectAllThirdCheckbox] = useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [buttonType, setButtonType] = React.useState("");
  // const [selectVal, setSelectVal] = useState("1d");
  const [selectValBelowGraph, setSelectValBelowGraph] = useState(
    "DURATION ( In 1 Day)"
  );
  const [xAxis, setXAxis] = useState("hour");
  const [tableData, setTableData] = useState([]);
  const [iOSErrorCount, setIOSErrorCount] = useState(0);
  const [androidErrorCount, setAndroidErrorCount] = useState(0);
  const [webErrorCount, setWebErrorCount] = useState(0);
  const [firestickCount, setFirestickErrorCount] = useState(0);
  const [isLoadingData, setisLoadingData] = useState(false);
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
  const [deviceUDID, setDeviceUDID] = useState();
  const [isEmptyFile, setIsEmptyFile] = useState(false);

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
  const [iSSecondLoader, setIsSecondLoader] = useState(false);
  const [iSThirdLoader, setIsThirdLoader] = useState(false);
  const [isLabelClicked, setIsLabelClicked] = useState(false);
  const applyManualMiti = () => {
    if (ids.length > 0) {
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
          ids,
          "insession",
          buttonType
        )
      );
      setTimeout(() => {
        dispatch(
          getAnomaliesDetect(
            dispatch,
            toDate,
            fromDate,
            anamolyScore,
            rowsPerPage,
            ""
          )
        );
        setIds([]);
        // NotificationManager.success("Data Submitted successfully", '', 2000);
      }, 1000);
      setIsPreview(false);
    }
  };
  const applyThirdManualMiti = () => {
    if (thirdIds.length > 0) {
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
          thirdIds,
          "insession",
          buttonType
        )
      );
      setTimeout(() => {
        dispatch(
          getAnomaliesDetect(
            dispatch,
            toDate,
            fromDate,
            anamolyScore,
            rowsPerPage,
            ""
          )
        );
        setThirdIds([]);
        // NotificationManager.success("Data Submitted successfully", '', 2000);
      }, 1000);
      setIsThirdPreview(false);
    }
  };

  const arrangeThirdIdData = (type) => {
    if (thirdIds.length > 0) {
      //TODO
      let tempArray = [];
      thirdIds.map((data) => {
        if (type == "approved") {
          data.is_approved = 1;
        } else {
          data.is_approved = 0;
        }
        data.error_count = 0;
        delete data.approved;
        delete data?.anomaly_description;
        delete data.uploadtime;
        delete data?.userid;
        if (selectAllThirdCheckbox) {
          var datemili = new Date(data.dts).getTime(); // some mock date
          data.dts = datemili;
        }
        tempArray.push(data);
      });
      return tempArray;
    }
  };

  const arrangeFirstdIdData = () => {
    if (ids.length > 0) {
      //TODO
      console.log("selectAllCheckbox-", selectAllCheckbox);
      let tempArray = [];
      ids.map((data) => {
        data.is_approved = 1;
        data.error_count = 0;
        delete data.approved;
        delete data?.anomaly_description;
        if (selectAllCheckbox) {
          var datemili = new Date(data.dts).getTime(); // some mock date
          data.dts = datemili;
        }
        tempArray.push(data);
      });
      return tempArray;
    }
  };

  const downloadLabelData = () => {
    setDownloadLoader(true);
    setIsLabelClicked(true);
    const filter = {
      anomaly_type: "insession",
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
      "labeled_data_insession_" +
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
          let fullDate = moment(
            Math.floor(new Date(parseInt(ERS_data.dts) * 1000))
          ).format("DD/MM/YYYY hh:mm a");
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
  const getDeviceId = (val) => {
    setDeviceId(val);
  };

  const getVideoId = (val) => {
    setVideoId(val);
  };

  const getLive = (val) => {
    setLive(val);
  };

  const getDrm = (val) => {
    setDrm(val);
  };

  const getHas = (val) => {
    setHas(val);
  };

  const getNetwork = (val) => {
    setNetwork(val);
  };

  const getManufacturer = (val) => {
    console.log({ manVal: val });
    setManufacturer(val);
  };

  const getLocationWithoutState = (val) => {
    let temparray = [];
    val.forEach((element) => {
      temparray.push(element.split("(")[0]);
    });
    return temparray;
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

  const calculateDateRange = (timestamp) => {
    let sd = new Date(); //current system date
    let toDate = Math.floor(sd.getTime() / 1000.0);
    // setToDate(toDate);
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

  //To handle selecting and removing  all filtered results
  const selectAll = () => {
    setSelectAllCheckbox(!selectAllCheckbox);
    let tempArray = [];

    if (!selectAllCheckbox) {
      // anomData?.anomaliesDetect?.map((m) => {
      //   return all.push(m);
      // });

      anomData?.anomaliesDetect?.data.map((res) => {
        // res.is_approved = 1
        tempArray.push(res);
      });
      setIds(tempArray);
    } else if (selectAllCheckbox) {
      setIds([]);
    }
  };

  const onChangeCheckbox = (data) => {
    console.log(data, "onchange data");
    setSelectAllCheckbox(false);
    var datemili = new Date(data.dts).getTime(); // some mock date
    data.dts = datemili;
    // delete data.sessionid;
    const currentIndex = ids.indexOf(data);
    const newChecked = [...ids];
    if (currentIndex === -1) {
      newChecked.push(data);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setIds(newChecked);
  };

  const nonAnomaly = (selectedData) => {
    console.log("abcd--", selectedData);
    if (selectedData.length > 0) {
      let rejectArray = [];
      selectedData.map((res) => {
        res.is_approved = 0;
        delete res.anomaly_description;
        if (selectAllCheckbox) {
          var datemili = new Date(res.dts).getTime(); // some mock date
          res.dts = datemili;
        }
        rejectArray.push(res);
      });
      setIds(rejectArray);
    }
  };

  //To handle selecting and removing  all filtered results
  const selectAllThird = () => {
    setSelectAllThirdCheckbox(!selectAllThirdCheckbox);
    if (!selectAllThirdCheckbox) {
      setThirdIds(anomData?.thirdAnomaliesData?.Items);
    } else if (selectAllThirdCheckbox) {
      setThirdIds([]);
    }
  };

  const onChangeThirdCheckbox = (data) => {
    console.log(data, "onchange third data");
    setSelectAllThirdCheckbox(false);
    var datemili = new Date(data.dts).getTime(); // some mock date
    data.dts = datemili;
    const currentIndex = thirdIds?.indexOf(data);
    const newChecked = [...thirdIds];
    if (currentIndex === -1) {
      newChecked.push(data);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setThirdIds(newChecked);
  };

  // for the Pop
  const confirmThirdApprove = () => {
    console.log("cnf apprv3-", selectAllThirdCheckbox);

    if (thirdIds.length > 0) {
      //setIsPreview(true)
      setThirdIds(arrangeThirdIdData("approved"));
      setButtonType("Approve1");
      setIsThirdPreview(true);
    } else {
      NotificationManager.error(
        "Please select anomaly to reject or approve ",
        "",
        2000
      );
    }
  };
  // for the Pop
  const confirmApprove = () => {
    console.log("cnf apprv-", selectAllCheckbox);
    if (ids.length > 0) {
      setIds(arrangeFirstdIdData());
      setIsPreview(true);
      setButtonType("Approve1");
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
    setEndSessionDate();
    setStartSessionDate();
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
    setArray([]);
    setFile(e.target.files[0]);

    if (e.target.files[0]) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        // if(csvOutput){
        csvFileToArray(csvOutput);
        // }
        // csvFileToJSON(e.target.files[0])
      };
    }
  };
  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (file) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput);
      };
      fileReader.readAsText(file);
      if (array.length > 0) {
        array.filter((res) => {
          //to avoid udefined
          if (res == undefined) {
            return array.splice(array.indexOf(res));
          }

          if (
            !res.m_video_start_time &&
            !res.networktype &&
            !res.dts &&
            !res.m_rebuffering_ratio &&
            !res.device_id &&
            !res.anomaly_score &&
            !res.device_platform &&
            !res.videoid &&
            !res.live &&
            !res.anomaly_explanation &&
            !res.sessionid &&
            !res.manufacturer &&
            !res.location_city &&
            !res.m_bandwidth &&
            !res.content_partner &&
            !res.has &&
            !res.anomaly_id &&
            !res.drm &&
            !res.error_count &&
            !res.anomaly_type &&
            !res.errorcode
          ) {
            return array.splice(array.indexOf(res));
          }
        });
        if (array.length > 0) {
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
            // "dts",
            "m_video_start_time",
            "networktype",
            "dts",
            "m_rebuffering_ratio",
            "device_id",
            "anomaly_score",
            "device_platform",
            "videoid",
            "live",
            "anomaly_explanation",
            "sessionid",
            "manufacturer",
            "location_city",
            "m_bandwidth",
            "content_partner",
            "has",
            "anomaly_id",
            "drm",
            "error_count",
            "anomaly_type",
            "is_approved",
            "errorcode",
          ];

          //resultArray = array[0].map(elm => ({ Name: elm.id, Data: elm.name}));

          const ArrayObjkeys = Object.keys(array[0]);

          const missingArray = mainArray.filter(
            (f) => !ArrayObjkeys.includes(f)
          );

          if (missingArray.length > 0) {
            // if(missingArray.length >= 21){
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
            setIds(array);
            setIsPreview(true);
            setIsUpload(false);
          }
          //  }
          //  else {
          //   NotificationManager.error("Valid data not found in CSV File", '', 2000);
          // }
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
    let regex = "^,\\r\\n$";

    const csvHeader = string.slice(0, string.indexOf("\n")).split(",");
    let csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    console.log("header csvRows--", csvRows, csvRows.length);

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
        const values = i.trim().split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
        console.log("header csvRows-i-", i);

        const obj = csvHeader.reduce((object, header, index) => {
          if (csvRows[index]) {
            rowArray.push(csvRows[index].split(","));
          }
          object[header.trim()] = values[index];
          return object;
        }, {});
        if (obj?.error_count) {
          obj.error_count =
            obj.error_count == "null" ? 0 : parseInt(obj.error_count);
        }
        if (obj?.is_approved) {
          obj.is_approved =
            obj.is_approved == "0\r"
              ? parseInt(0)
              : obj.is_approved == "" ||
                obj.is_approved == "null" ||
                obj.is_approved == undefined
              ? obj.is_approved
              : parseInt(1);
        }
        if (obj?.Date_Time) {
          let changedDate = moment(obj.Date_Time, "DD-MM-YYYY hh:mm").format(
            "MM/DD/YYYY HH:MM"
          );
          let mili = Math.floor(moment(changedDate).endOf("date")._d.getTime());
          obj.dts = mili;
          delete obj.Date_Time;
        }
        delete obj.uploadtime;
        delete obj.userid;
        return obj;
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
    setEndDate();
    setStartDate();
    setBtn("");
    setFromDate();
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

  useEffect(() => {
    const isEmpty = Object.keys(anomData?.filters).length === 0;
    if (isEmpty) {
      dispatch(getUniqueFilters(dispatch));
    }
  }, []);

  const setSessionDataRange = (e) => {
    setEndSessionDate();
    setStartSessionDate();
    setBtn("");
    setFromSessionDate();
    setSelectSessionVal(e.target.value);
    // for the dropdown
    //let ts = Math.floor(moment().endOf("date")._d.getTime() / 1000.0);
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

  const submit = () => {
    setSelectVal("");
    setSelectSessionVal("");
    console.log(
      "range--1",
      range,
      Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0),
      Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0)
    );
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    // setStartSessionDate(range[1].startSessionDate);
    // setEndSessionDate(range[1].endSessionDate);
    setModalOpen(false);
    setToDateCSV(
      Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
    );
    setFromDate(
      Math.floor(
        moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0
      ) -
        24 * 3600
    );
    // setDashboardLoader(true)
    // dispatch(getAnomaliesDetect(dispatch, Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0), anamolyScore, rowsPerPage, ""))
    // setTimeout(() => {
    //   setDashboardLoader(false)
    // }, 5000);
  };
  useEffect(() => {
    console.log("abcd--", location);
    setDashboardLoader(true);
    let filters = {
      drm,
      has,
      live,
      manufacturer,
      network,
      videoId,
      deviceId,
      contentPartner,
      contentType,
      location,
      devicePlatform,
    };
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    console.log(endDate, "endDate");
    // if(toDate == fromDate) {
    //   setFromDate(fromDate - (24 * 3600));
    // }
    console.log(
      Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0),
      "endDate2"
    );
    setToDateCSV(toDate);
    dispatch(
      getAnomaliesDetect(
        dispatch,
        toDate,
        fromDate,
        anamolyScore,
        rowsPerPage,
        "",
        filters
      )
    );
    setTimeout(() => {
      setDashboardLoader(false);
    }, [3000]);
  }, [
    fromDate,
    endDate,
    anamolyScore,
    drm,
    live,
    has,
    network,
    manufacturer,
    videoId,
    deviceId,
    contentPartner,
    location,
  ]);

  useEffect(() => {
    let toDate = endSessionDate
      ? Math.floor(
          moment(range[1].endSessionDate).endOf("date")._d.getTime() / 1000.0
        )
      : Math.floor(new Date().getTime() / 1000.0);
    dispatch(
      getSecondAnomalies(
        dispatch,
        deviceUDID,
        anamolyScore,
        toDate,
        fromSessionDate
      )
    );
    setTimeout(() => {
      setDashboardLoader(false);
    }, [3000]);
  }, [fromSessionDate, anamolyScore]);
  // useEffect(() => {
  //   if (customDateValue[0] !== null && customDateValue[1] !== null) {
  //     setDashboardLoader(true)
  //     let fdate = customDateValue[0];
  //     let tdate = customDateValue[1];
  //     dispatch(getAnomaliesDetect(dispatch, Math.floor(tdate.getTime() / 1000.0), Math.floor(fdate.getTime() / 1000.0)))
  //    // dispatch(getSecondAnomalies(dispatch, Math.floor(tdate.getTime() / 1000.0), Math.floor(fdate.getTime() / 1000.0)))

  //     setTimeout(() => {
  //       setDashboardLoader(false)
  //       setCustomDateValue([null, null])
  //    }, 2000);
  //   }
  // }, [customDateValue]);
  const getImage = () => {
    // console.log(fromDate)
    // var data1 = anomData?.anomaliesDetectCSVRecord
    // console.log('csv before set [] download data', data1);
    setDownloadLoader(true);
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    setToDateCSV(toDate);

    dispatch(setAnomaliesDetectRecordCSV([]));

    const fileName =
      "detected_anomalies_" +
      moment(Math.floor(new Date(fromDate).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      ) +
      "-" +
      moment(Math.floor(new Date(toDateCSV).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      ); /*createFileName(
      "csv",
      `${metric}-${moment().format("DD/MM/YYYY")}`
      );*/
    const exportType = exportFromJSON.types.csv;
    const newData = getDetailedAnomalyRecords(toDate, fromDate, anamolyScore);
    newData
      .then(function (res) {
        if (res?.Items.length > 0) {
          let data = [];
          data = res?.Items.map((ERS_data) => {
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
        } else {
          NotificationManager.error("Data not found !!", "", 2000);
        }
        setDownloadLoader(false);
      })
      .catch(function () {
        setDownloadLoader(false);
      });
  };

  const getDetailedAnomalyRecords = (to_time, from_time, anamolyScore) => {
    const headers = {
      // 'authorization': `bearer ${localStorage.getItem("authToken")}`,//`bearer S48TBplphIX3euvjJl2KnIJ6dvKcvCk6`,
      // 'subscriberId':`${localStorage.getItem("subscriberid")}`,
      contentType: "application/json",
    };
    let filter = {};
    if (drm.length > 0) {
      filter["drm"] = ["_in", drm];
    }
    if (has.length > 0) {
      filter["has"] = ["_in", has];
    }
    if (network.length > 0) {
      filter["networkType"] = ["_in", network];
    }
    if (live.length > 0) {
      let livedata = live.map((res) => {
        return res == "Yes" ? true : false;
      });
      filter["live"] = ["_in", livedata];
    }
    if (manufacturer.length > 0) {
      filter["manufacturer"] = ["_in", manufacturer];
    }
    if (Object.values(videoId).length > 0) {
      filter["videoid"] = ["_eq", videoId];
    }
    if (Object.values(deviceId).length > 0) {
      filter["device_id"] = ["_eq", deviceId];
    }
    if (location.length > 0) {
      let temploc = [];
      location.map((res) => {
        temploc.push(res.split("(")[0]);
      });
      filter["location_city"] = ["_in", temploc];
    }
    let abcd = anamolyScore.replace(/"/g, "");
    let abcdef = abcd.split(",");
    console.log("abcd--", parseInt(abcdef[0]), parseInt(abcdef[1]));
    filter["ANOMALY_SCORE"] = [
      "_range",
      [parseInt(abcdef[0]), parseInt(abcdef[1])],
    ];

    let filterBody = {
      filters: filter,
    };
    //  params = {'partner':'hoichoi'}
    return fetch(
      `http://3.6.164.157:8084/api/GetDetailedAnomalyRecords?to_time=${to_time}&from_time=${from_time}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(filterBody),
      }
    ).then((res) => res.json());
  };

  const clickOnSeconDrawer = (index, device_id, condition) => {
    // setDashboardLoader(true)
    let toDate = Math.floor(new Date().getTime() / 1000.0);
    setIndexesthree(-1);
    index === indexes ? setIndexes(-1) : setIndexes(index);
    dispatch(setSecondAnomalies([]));
    setDeviceUDID(device_id);
    setIsSecondLoader(true);
    condition &&
      dispatch(
        getSecondAnomalies(dispatch, device_id, anamolyScore, toDate, fromDate)
      );
    setTimeout(() => {
      setIsSecondLoader(false);
    }, 13000);
  };

  const clickOnSeconDrawerthree = (index, device_id, sessionId, condition) => {
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    index === indexestrhee ? setIndexesthree(-1) : setIndexesthree(index);
    dispatch(setThirdAnomalies([]));
    setIsThirdLoader(true);
    condition &&
      dispatch(
        getThirdAnomalies(
          dispatch,
          device_id,
          sessionId,
          anamolyScore,
          toDate,
          fromDate
        )
      );
    setTimeout(() => {
      setIsThirdLoader(false);
    }, 13000);
  };

  const rejectThirdData = () => {
    if (thirdIds.length > 0) {
      // setThirdIds([]);
      setIsThirdPreview(false);
      setButtonType("Reject1");
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
  const rejectData = () => {
    if (ids.length > 0) {
      // setIsPreview(false)
      // setArray([])
      setIsPreview(true);
      nonAnomaly(ids);
      setButtonType("Reject1");
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
        getAnomaliesDetect(
          dispatch,
          toDate,
          fromDate,
          anamolyScore,
          page,
          anomData?.anomaliesDetect?.next_iteration_id
            ? anomData?.anomaliesDetect?.next_iteration_id
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
        {anomData?.anomaliesDetect?.data &&
        anomData?.anomaliesDetect?.data.length ? (
          <div className="top-left-nav">
            <Typography
              variant="h5"
              style={{ fontSize: "1.2rem", paddingLeft: "13px" }}
            >
              In-Session ({anomData?.anomaliesDetect?.data.length})
            </Typography>
          </div>
        ) : null}
        <Box className="status-report">
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
                {/* change to 0,3 for temporary basis */}
                <MenuItem value={"0,3"}>0-3</MenuItem>
                <MenuItem value={"4,6"}>4-6</MenuItem>
                <MenuItem value={"7,8"}>7-8</MenuItem>
                <MenuItem value={"8,10"}>8-10</MenuItem>
                <MenuItem value={"10,12"}>10-12</MenuItem>
                {/* <MenuItem value={"5"}>5</MenuItem>
                <MenuItem value={"6"}>6</MenuItem>
                <MenuItem value={"7"}>7</MenuItem>
                <MenuItem value={"8"}>8</MenuItem>
                <MenuItem value={"9"}>9</MenuItem> */}
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
            // disabled={isValidPermission("WRITE_DETECTED_ANOMALIES")}
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
              <FilterDetectedAnamoliesLayout
                getContentPartner={getContentPartner}
                getContentType={getContentType}
                getLocation={getLocation}
                getDeviceId={getDeviceId}
                getVideoId={getVideoId}
                getHas={getHas}
                getDrm={getDrm}
                getNetwork={getNetwork}
                getManufacturer={getManufacturer}
                savePlatformData={savePlatformData}
                getLive={getLive}
                cdnVal={cdnVal}
                contentTypeVal={contentTypeVal}
                contentPartnetVal={contentPartnetVal}
                locationVal={locationVal}
                errorCodeVal={errorCodeVal}
                devicePlatform={devicePlatform}
                contentPartner={contentPartner}
                contentType={contentType}
                location={location}
                deviceId={deviceId}
                videoId={videoId}
                live={live}
                drm={drm}
                has={has}
                // metric={metric}
                manufacturer={manufacturer}
                network={network}
              />
            }
          ></Button>

          <div> </div>
        </Box>
        {/* <AppliedFilters
          startDate={startDate}
          endDate={endDate}
          removeDevicePlatform={removeDevicePlatform}
          removeContentPartner={removeContentPartner}
          removeContentType={removeContentType}
          removeLocation={removeLocation}
          removeErrorCode={removeErrorCode}
          removeDrm={removeDrm}
          removeLive={removeLive}
          removeHas={removeHas}
          removeNetwork={removeNetwork}
          removeVideoId={removeVideoId}
          removeManufacturer={removeManufacturer}
          // removeNetwork={removeNetwork}
          devicePlatform={devicePlatform}
          updatePlatformData={updatePlatformData}
          // handleReload={handleReload}
          contentPartner={contentPartner}
          contentType={contentType}
          location={location}
          errorCode={errorCode}
          selectVal={selectVal}
          deviceId={deviceId}
          videoId={videoId}
          live={live}
          drm={drm}
          has={has}
          manufacturer={manufacturer}
          network={network}
        /> */}
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
          {anomData?.anomaliesDetect?.data &&
          anomData?.anomaliesDetect?.data.length > 0 ? (
            <div className="full-table" style={{ marginTop: "26px" }}>
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead
                  // style={{ backgroundColor: "#ffffff", borderBottom: "#ffffff" }}
                  >
                    <TableRow
                      style={{
                        borderBottom: "1px solid white",
                        color: "rgb(151 151 151 / 87%)",
                      }}
                      sx={{ border: 0 }}
                    >
                      <TableCell></TableCell>
                      <TableCell>UDID</TableCell>
                      <TableCell>Anomaly ID</TableCell>

                      <TableCell>Date/Time</TableCell>
                      <TableCell>Anomaly Score</TableCell>
                      <TableCell>Anomaly Type</TableCell>
                      <TableCell>Rebuffering Ratio</TableCell>
                      <TableCell>Approval</TableCell>
                      <TableCell>Live</TableCell>
                      <TableCell>Video ID</TableCell>
                      <TableCell>Manufacturer</TableCell>
                      <TableCell>Has</TableCell>
                      <TableCell>Drm</TableCell>
                      <TableCell>Location City</TableCell>
                      <TableCell>Network</TableCell>
                      <TableCell>Video Start Time </TableCell>
                      <TableCell>Bandwith</TableCell>
                      <TableCell>Content Partner</TableCell>
                      <TableCell>Platform</TableCell>
                      <TableCell>Error Code</TableCell>
                      <TableCell>Error Count</TableCell>

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
                      <TableCell>Anomaly Description</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  {anomData?.anomaliesDetect?.data
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .sort((a, b) => b.ANOMALY_SCORE - a.ANOMALY_SCORE)
                    .map((list, index) => {
                      let fullDate = Math.floor(
                        new Date(list?.dts).getTime() * 1000.0
                      );
                      return (
                        <>
                          <TableRow sx={{ border: 0 }}>
                            <TableCell>
                              {index === indexes ? (
                                <i
                                  onClick={() => {
                                    setIsSecondLoader(true);

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
                                      list?.device_id,
                                      true
                                    );
                                  }}
                                  className="zmdi zmdi-plus-circle"
                                ></i>
                              )}
                            </TableCell>
                            <TableCell>{list?.device_id}</TableCell>
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

                            <TableCell>
                              {moment(fullDate / 1000).format("DD-MM-YYYY") +
                                " | " +
                                moment(fullDate / 1000)
                                  .utcOffset(330)
                                  .format("hh:mm:a")}
                            </TableCell>
                            <TableCell>{list?.ANOMALY_SCORE}</TableCell>
                            <TableCell>{list?.Anomaly_Type}</TableCell>
                            <TableCell>
                              {Number(list?.m_rebuffering_ratio).toFixed(5)}
                            </TableCell>
                            <TableCell>
                              {list?.is_approved == 0
                                ? "Not-Approved"
                                : list?.is_approved == 1
                                ? "Approved"
                                : "Pending-Approval"}
                            </TableCell>
                            <TableCell>{list?.live ? "Yes" : "No"}</TableCell>
                            <TableCell>{list?.videoid}</TableCell>
                            <TableCell>{list?.manufacturer}</TableCell>
                            <TableCell>{list?.has}</TableCell>
                            <TableCell>{list?.drm}</TableCell>
                            <TableCell>{list?.location_city}</TableCell>
                            <TableCell>{list?.networkType}</TableCell>
                            <TableCell>{list?.m_video_start_time}</TableCell>
                            <TableCell>{list?.m_bandwidth}</TableCell>
                            <TableCell>{list?.content_partner}</TableCell>
                            <TableCell>{list?.device_platform}</TableCell>
                            <TableCell>
                              {list?.error_code ? list?.error_code : "-"}
                            </TableCell>
                            <TableCell>
                              {list?.error_count ? list?.error_count : "-"}
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
                                  style={{ fontSize: "1.2rem" }}
                                ></span>{" "}
                                {list?.ANOMALY_EXPLANATION}
                              </p>
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
                              colSpan={12}
                            >
                              <Collapse
                                in={indexes === index}
                                timeout="auto"
                                unmountOnExit
                              >
                                <Box sx={{ margin: 1 }}>
                                  <Table>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell></TableCell>
                                        <TableCell style={{ color: "#bdb5b5" }}>
                                          Session ID
                                        </TableCell>
                                        <TableCell style={{ color: "#bdb5b5" }}>
                                          Session Duration
                                        </TableCell>
                                        <TableCell style={{ color: "#bdb5b5" }}>
                                          Anomaly Count
                                        </TableCell>
                                        <TableCell style={{ color: "#bdb5b5" }}>
                                          Date / Time
                                        </TableCell>
                                      </TableRow>
                                    </TableHead>
                                    {anomData?.secondAnomaliesData?.Items &&
                                    anomData?.secondAnomaliesData?.Items
                                      .length > 0 ? (
                                      anomData?.secondAnomaliesData?.Items.map(
                                        (second, index2) => {
                                          let fullDate = Math.floor(
                                            new Date(
                                              second?.datetime
                                            ).getTime() * 1000.0
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
                                                  {index2 === indexestrhee ? (
                                                    <i
                                                      onClick={() => {
                                                        setIsThirdLoader(false);
                                                        clickOnSeconDrawerthree(
                                                          index2,
                                                          second?.device_id,
                                                          second?.sessionid,
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
                                                        setIsThirdLoader(true);
                                                        clickOnSeconDrawerthree(
                                                          index2,
                                                          second?.device_id,
                                                          second?.sessionid,
                                                          true
                                                        );
                                                      }}
                                                      className="zmdi zmdi-plus-circle"
                                                    ></i>
                                                  )}
                                                </TableCell>
                                                <TableCell>
                                                  {second?.sessionid}
                                                </TableCell>
                                                <TableCell>
                                                  {second?.sessionduration}
                                                </TableCell>
                                                <TableCell>
                                                  {second?.anomaly_count >= 0
                                                    ? second?.anomaly_count
                                                    : "-"}
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
                                              </TableRow>

                                              {/* third trail---------------start------------------------- */}
                                              <TableRow>
                                                <TableCell
                                                  style={{
                                                    paddingBottom: 0,
                                                    paddingTop: 0,
                                                  }}
                                                  colSpan={12}
                                                >
                                                  <Collapse
                                                    in={indexestrhee === index2}
                                                    timeout="auto"
                                                    unmountOnExit
                                                  >
                                                    <Box sx={{ margin: 1 }}>
                                                      <Table>
                                                        <TableHead>
                                                          <TableRow>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Anomaly ID
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Anomaly Score
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Approval
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Rebuffering Ratio
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Startup Length
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Bandwidth
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Content Partner
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Platform
                                                            </TableCell>
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Location
                                                            </TableCell>
                                                            {/* <TableCell style={{ color: "#bdb5b5" }}>Anomaly Description</TableCell> */}
                                                            <TableCell
                                                              style={{
                                                                color:
                                                                  "#bdb5b5",
                                                              }}
                                                            >
                                                              Anomaly
                                                              Explanation
                                                            </TableCell>
                                                            <TableCell>
                                                              Anomaly
                                                              Description
                                                            </TableCell>
                                                            <TableCell></TableCell>
                                                          </TableRow>
                                                        </TableHead>
                                                        {anomData
                                                          ?.thirdAnomaliesData
                                                          ?.Items &&
                                                        anomData
                                                          ?.thirdAnomaliesData
                                                          ?.Items.length > 0 ? (
                                                          anomData?.thirdAnomaliesData?.Items.map(
                                                            (third, index3) => {
                                                              return (
                                                                <TableRow
                                                                  key={index3}
                                                                  style={{
                                                                    backgroundColor:
                                                                      "#ffffff",
                                                                    borderBottom:
                                                                      "0px",
                                                                  }}
                                                                >
                                                                  <TableCell>
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
                                                                          fontSize:
                                                                            "1.2rem",
                                                                        }}
                                                                      ></span>{" "}
                                                                      {third?.anomaly_id
                                                                        ? third?.anomaly_id
                                                                        : "-"}
                                                                    </p>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.anomaly_score
                                                                      ? third?.anomaly_score
                                                                      : "-"}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.is_approved ==
                                                                    0
                                                                      ? "Not-Approved"
                                                                      : third?.is_approved ==
                                                                        1
                                                                      ? "Approved"
                                                                      : "Pending-Approval"}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.m_rebuffering_ratio >=
                                                                    0
                                                                      ? third?.m_rebuffering_ratio
                                                                      : "-"}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.m_video_start_time >=
                                                                    0
                                                                      ? third?.m_video_start_time
                                                                      : "-"}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.m_bandwidth >=
                                                                    0
                                                                      ? third?.m_bandwidth
                                                                      : "-"}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.content_partner
                                                                      ? third?.content_partner
                                                                      : "-"}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.device_platform
                                                                      ? third?.device_platform
                                                                      : "-"}
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    {third?.location_city
                                                                      ? third?.location_city
                                                                      : "-"}
                                                                  </TableCell>
                                                                  {/* <TableCell><p className='anomalyptag' onClick={() => clickOnItem("Anomaly Description", list?.anomaly_description)}>
                                                                  {third?.anomaly_description
                                                                    ? 'N/A' :
                                                                    (<>
                                                                      <span className='zmdi zmdi-copy' style={{ 'fontSize': '1.2rem' }}></span>
                                                                      {list?.anomaly_description} </>)}
                                                                </p></TableCell> */}
                                                                  <TableCell>
                                                                    <p
                                                                      className="anomalyptag"
                                                                      onClick={() =>
                                                                        clickOnItem(
                                                                          "Anomaly Explanation",
                                                                          third?.anomaly_explanation
                                                                        )
                                                                      }
                                                                    >
                                                                      {" "}
                                                                      <span
                                                                        className="zmdi zmdi-copy"
                                                                        style={{
                                                                          fontSize:
                                                                            "1.2rem",
                                                                        }}
                                                                      ></span>{" "}
                                                                      {
                                                                        third?.anomaly_explanation
                                                                      }
                                                                    </p>
                                                                  </TableCell>
                                                                  <TableCell>
                                                                    <p
                                                                      className="anomalyptag"
                                                                      onClick={() =>
                                                                        clickOnItem(
                                                                          "Anomaly Description",
                                                                          third?.anomaly_description
                                                                        )
                                                                      }
                                                                    >
                                                                      {" "}
                                                                      {(third?.anomaly_description !==
                                                                        "-" ||
                                                                        third?.anomaly_description !==
                                                                          "") && (
                                                                        <span
                                                                          className="zmdi zmdi-copy"
                                                                          style={{
                                                                            fontSize:
                                                                              "1.2rem",
                                                                          }}
                                                                        ></span>
                                                                      )}{" "}
                                                                      {third?.anomaly_description !==
                                                                        "-" ||
                                                                      third?.anomaly_description !==
                                                                        ""
                                                                        ? third?.anomaly_description
                                                                        : "N/A"}
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
                                                                        onChangeThirdCheckbox(
                                                                          third
                                                                        )
                                                                      }
                                                                      edge="start"
                                                                      checked={
                                                                        thirdIds.indexOf(
                                                                          third
                                                                        ) !== -1
                                                                      }
                                                                    />
                                                                  </TableCell>
                                                                </TableRow>
                                                              );
                                                            }
                                                          )
                                                        ) : iSThirdLoader ? (
                                                          <span
                                                            style={{
                                                              height: 90,
                                                              alignSelf:
                                                                "center",
                                                              alignItems:
                                                                "center",
                                                              marginLeft: "50%",
                                                            }}
                                                          >
                                                            <img
                                                              src={loader}
                                                              style={{
                                                                marginLeft:
                                                                  "30%",
                                                              }}
                                                            />
                                                          </span>
                                                        ) : (
                                                          "Record Not Found"
                                                        )}
                                                      </Table>
                                                    </Box>
                                                    {thirdIds.length > 0 ? (
                                                      <div className="apply-container">
                                                        <Checkbox
                                                          disabled={
                                                            !isValidPermission(
                                                              "WRITE_DETECTED_ANOMALIES"
                                                            )
                                                          }
                                                          onChange={() =>
                                                            selectAllThird()
                                                          }
                                                          checked={
                                                            selectAllThirdCheckbox
                                                          }
                                                        />
                                                        <MatButton className="apply-filter-btn">
                                                          {" "}
                                                          Select All{" "}
                                                        </MatButton>
                                                        <div className="right-aligne-button">
                                                          <MatButton
                                                            className="apply-filter-btn"
                                                            onClick={() => {
                                                              // setThirdIds([])
                                                              // { selectAllCheckbox && setSelectAllCheckbox(false) }
                                                              setThirdIds(
                                                                arrangeThirdIdData(
                                                                  "reject"
                                                                )
                                                              );
                                                              setButtonType(
                                                                "Reject1"
                                                              );
                                                              setIsThirdPreview(
                                                                true
                                                              );
                                                            }}
                                                          >
                                                            Reject
                                                          </MatButton>

                                                          <MatButton
                                                            className="apply-btn"
                                                            onClick={
                                                              confirmThirdApprove
                                                            }
                                                            style={{
                                                              fontSize:
                                                                "0.875rem",
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
                                                    ) : (
                                                      ""
                                                    )}
                                                  </Collapse>
                                                </TableCell>
                                              </TableRow>
                                              {/* third trail---------------end------------------------- */}
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
                </Table>
              </TableContainer>
              {/* {anomData?.anomaliesDetect?.next_iteration_id == undefined ?  */}
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={anomData?.anomaliesDetect?.size}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="paginationstyle"
              />
              {/* : null } */}
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
                    //  onClick={applyManualMiti}
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

          <AnomalieCSVUpload
            title="Upload CSV File"
            isOpen={isUpload}
            onClose={() => {
              setIsUpload(false);
              setArray([]);
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
                  className="Status-btn checkButton"
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
          {/* for the Pop */}
          <Drawer
            anchor="bottom"
            open={isPreview}
            onClose={() => {
              setIds([]);
              setIsPreview(false);
              setArray([]);
            }}
            className="drawer-mitigation"
          >
            <div className="drawer-header">
              <span>
                {" "}
                <i
                  onClick={() => {
                    setIds([]);
                    setIsPreview(false);
                    setArray([]);
                  }}
                  className="zmdi zmdi-arrow-left"
                ></i>{" "}
                Preview Data ({ids?.length})
              </span>
            </div>
            <i
              onClick={() => {
                setIds([]);
                setIsPreview(false);
                setArray([]);
                {
                  selectAllCheckbox && setSelectAllCheckbox(false);
                }
              }}
              className="zmdi zmdi-close CloseNewPosition"
            ></i>
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
                  {/* <TableCell>UDID</TableCell>
                  <TableCell>Date/Time</TableCell>
                  <TableCell>Anomaly Score</TableCell>
                  <TableCell>Rebuffering Ratio</TableCell>
                  <TableCell>Startup Length </TableCell>
                  <TableCell>Bandwidth</TableCell>
                  <TableCell>Content Partner</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Anomaly Explanition</TableCell> */}
                  <TableCell>Anomaly ID</TableCell>
                  <TableCell>UDID</TableCell>
                  <TableCell>Date/Time</TableCell>
                  <TableCell>Anomaly Score</TableCell>
                  <TableCell>Anomaly Type</TableCell>
                  <TableCell>Rebuffering Ratio</TableCell>
                  <TableCell>Approval</TableCell>
                  <TableCell>Live</TableCell>
                  <TableCell>Video ID</TableCell>
                  <TableCell>Manufacturer</TableCell>
                  <TableCell>Has</TableCell>
                  <TableCell>Drm</TableCell>
                  <TableCell>Location City</TableCell>
                  <TableCell>Network</TableCell>
                  <TableCell>Video Start Time </TableCell>
                  <TableCell>Bandwith</TableCell>
                  <TableCell>Content Partner</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Anomaly Explanation</TableCell>
                  <TableCell>Anomaly Description</TableCell>
                </TableRow>
              </TableHead>
              {ids.length > 0 ? (
                ids.map((list, index) => {
                  console.log(list, "lists");
                  let fullDate = Math.floor(
                    new Date(list?.dts).getTime() * 1000.0
                  );
                  return (
                    // <TableContainer>
                    //   <Table sx={{ minWidth: 650 }}>

                    <TableRow
                      style={{
                        borderBottom: "1px solid white",
                        color: "rgb(151 151 151 / 87%)",
                      }}
                      sx={{ border: 0 }}
                    >
                      <TableCell>
                        <p className="anomalyptag">
                          {" "}
                          {list?.ANOMALY_ID || list?.anomaly_id}
                        </p>
                      </TableCell>
                      <TableCell>
                        {/* <i className='zmdi zmdi-plus-square'></i>4569 */}
                        {list?.device_id}
                      </TableCell>
                      <TableCell>
                        {moment(fullDate / 1000).format("DD-MM-YYYY") +
                          " | " +
                          moment(fullDate / 1000).format("hh:mm:a")}
                      </TableCell>
                      {/* <TableCell>{list?.anomaly_score}</TableCell>
                    <TableCell>{list?.m_rebuffering_ratio}</TableCell>
                    <TableCell>{list?.m_video_start_time}</TableCell>
                    <TableCell>{list?.m_bandwidth}</TableCell>
                    <TableCell>{list?.content_partner}</TableCell>
                    <TableCell>{list?.device_platform}</TableCell>
                    <TableCell>{list?.anomaly_explanation}</TableCell> */}
                      <TableCell>
                        {list?.ANOMALY_SCORE || list?.anomaly_score}
                      </TableCell>
                      <TableCell>
                        {list?.Anomaly_Type || list?.anomaly_type}
                      </TableCell>
                      <TableCell>
                        {Number(list?.m_rebuffering_ratio).toFixed(5)}
                      </TableCell>
                      <TableCell>
                        {list?.is_approved == 0
                          ? "Not-Approved"
                          : list?.is_approved == 1
                          ? "Approved"
                          : "Pending-Approval"}
                      </TableCell>
                      <TableCell>{list?.live ? "Yes" : "No"}</TableCell>
                      <TableCell>{list?.videoid}</TableCell>
                      <TableCell>{list?.manufacturer}</TableCell>
                      <TableCell>{list?.has}</TableCell>
                      <TableCell>{list?.drm}</TableCell>
                      <TableCell>{list?.location_city}</TableCell>
                      <TableCell>
                        {list?.networkType || list?.networktype}
                      </TableCell>
                      <TableCell>{list?.m_video_start_time}</TableCell>
                      <TableCell>{list?.m_bandwidth}</TableCell>
                      <TableCell>{list?.content_partner}</TableCell>
                      <TableCell>{list?.device_platform}</TableCell>
                      <TableCell>
                        <p className="anomalyptag">
                          {" "}
                          {list?.ANOMALY_EXPLANATION ||
                            list?.anomaly_explanation}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="anomalyptag">
                          {" "}
                          {list?.anomaly_description
                            ? list?.anomaly_description
                            : "-"}
                        </p>
                      </TableCell>
                    </TableRow>

                    // </Table>
                    //</TableContainer>
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
            <div className="check2" style={{ display: "flex", margin: "auto" }}>
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
                  setIsPreview(false);
                  setArray([]);
                  {
                    selectAllCheckbox && setSelectAllCheckbox(false);
                  }
                }}
              >
                {"No"}
              </MatButton>
            </div>
          </Drawer>
          {/* for the Pop */}
          <Drawer
            anchor="bottom"
            open={isThirdPreview}
            onClose={() => setIsThirdPreview(false)}
            className="drawer-mitigation"
          >
            <div className="drawer-header">
              <span>
                {" "}
                <i
                  onClick={() => setIsThirdPreview(false)}
                  className="zmdi zmdi-arrow-left"
                ></i>{" "}
                Preview Data ({thirdIds?.length})
              </span>
              <i
                onClick={() => {
                  setIsThirdPreview(false);
                  setIsThirdPreview(false);
                  setButtonType("Reject1");
                  {
                    selectAllCheckbox && setSelectAllCheckbox(false);
                  }
                  // rejectThirdData()
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
                  {/* <TableCell>Anomaly ID</TableCell>
                  <TableCell>Anomaly Score</TableCell>
                  <TableCell>Rebuffering Ratio</TableCell>
                  <TableCell>Startup Length </TableCell>
                  <TableCell>Bandwidth</TableCell>
                  <TableCell>Content Partner</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Anomaly Explanition</TableCell> */}
                  <TableCell>Anomaly ID</TableCell>
                  <TableCell>UDID</TableCell>
                  <TableCell>Date/Time</TableCell>
                  <TableCell>Anomaly Score</TableCell>
                  <TableCell>Anomaly Type</TableCell>
                  <TableCell>Rebuffering Ratio</TableCell>
                  <TableCell>Approval</TableCell>
                  <TableCell>Live</TableCell>
                  <TableCell>Video ID</TableCell>
                  <TableCell>Manufacturer</TableCell>
                  <TableCell>Has</TableCell>
                  <TableCell>Drm</TableCell>
                  <TableCell>Location City</TableCell>
                  <TableCell>Network</TableCell>
                  <TableCell>Video Start Time </TableCell>
                  <TableCell>Bandwith</TableCell>
                  <TableCell>Content Partner</TableCell>
                  <TableCell>Platform</TableCell>
                  <TableCell>Anomaly Explanation</TableCell>
                  <TableCell>Anomaly Description</TableCell>
                </TableRow>
              </TableHead>
              {thirdIds.length > 0 ? (
                thirdIds.map((list, index) => {
                  let fullDate = Math.floor(
                    new Date(list?.dts).getTime() * 1000.0
                  );
                  return (
                    // <TableContainer>
                    //   <Table sx={{ minWidth: 650 }}>

                    <TableRow
                      style={{
                        borderBottom: "1px solid white",
                        color: "rgb(151 151 151 / 87%)",
                      }}
                      sx={{ border: 0 }}
                    >
                      <TableCell>
                        <p
                          className="anomalyptag"
                          onClick={() =>
                            clickOnItem("Anomaly ID", list?.anomaly_id)
                          }
                        >
                          {" "}
                          <span
                            className="zmdi zmdi-copy"
                            style={{ fontSize: "1.2rem" }}
                          ></span>{" "}
                          {list?.anomaly_id}
                        </p>
                      </TableCell>

                      <TableCell key={list?.device_id}>
                        {/* <i className='zmdi zmdi-plus-square'></i>4569 */}
                        {list?.device_id}
                      </TableCell>
                      <TableCell>
                        {moment(fullDate / 1000).format("DD-MM-YYYY") +
                          " | " +
                          moment(fullDate / 1000)
                            .utcOffset(330)
                            .format("hh:mm:a")}
                      </TableCell>
                      {/* <TableCell>{list?.anomaly_score}</TableCell>
                    <TableCell>{list?.m_rebuffering_ratio}</TableCell>
                    <TableCell>{list?.m_video_start_time}</TableCell>
                    <TableCell>{list?.m_bandwidth}</TableCell>
                    <TableCell>{list?.content_partner}</TableCell>
                    <TableCell>{list?.device_platform}</TableCell>
                    <TableCell>{list?.anomaly_explanation}</TableCell> */}
                      <TableCell>{list?.anomaly_score}</TableCell>
                      <TableCell>{list?.anomaly_type}</TableCell>
                      <TableCell>{list?.m_rebuffering_ratio}</TableCell>
                      <TableCell>
                        {list?.is_approved == 0
                          ? "Not-Approved"
                          : list?.is_approved == 1
                          ? "Approved"
                          : "Pending-Approval"}
                      </TableCell>
                      <TableCell>{list?.live ? "Yes" : "No"}</TableCell>
                      <TableCell>{list?.videoid}</TableCell>
                      <TableCell>{list?.manufacturer}</TableCell>
                      <TableCell>{list?.has}</TableCell>
                      <TableCell>{list?.drm}</TableCell>
                      <TableCell>{list?.location_city}</TableCell>
                      <TableCell>{list?.networktype}</TableCell>
                      <TableCell>{list?.m_video_start_time}</TableCell>
                      <TableCell>{list?.m_bandwidth}</TableCell>
                      <TableCell>{list?.content_partner}</TableCell>
                      <TableCell>{list?.device_platform}</TableCell>
                      <TableCell>
                        <p className="anomalyptag">
                          {" "}
                          {list?.anomaly_explanation
                            ? list?.anomaly_explanation
                            : "-"}
                        </p>
                      </TableCell>
                      <TableCell>
                        <p className="anomalyptag">
                          {" "}
                          {list?.anomaly_description
                            ? list?.anomaly_description
                            : "-"}
                        </p>
                      </TableCell>

                      {/* <TableCell>
                            <Checkbox
                              onChange={() => onChangeCheckbox(list)}
                              edge='start'
                              checked={ids.indexOf(list) !== -1} />
                          </TableCell> */}
                    </TableRow>

                    // </Table>
                    //</TableContainer>
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
            <div style={{ display: "flex", margin: "auto" }}>
              <MatButton
                className="Status-btn"
                style={{
                  fontSize: "10px",
                  color: "#ffffff",
                  backgroundColor: "#e20092",
                }}
                onClick={applyThirdManualMiti}
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
                  setIsThirdPreview(false);
                  setButtonType("Reject1");
                  {
                    selectAllCheckbox && setSelectAllCheckbox(false);
                  }
                  // rejectThirdData
                }}
              >
                {"No"}
              </MatButton>
            </div>
          </Drawer>
        </>
      )}
    </>
  );
};

export default AnomaliesTable;
