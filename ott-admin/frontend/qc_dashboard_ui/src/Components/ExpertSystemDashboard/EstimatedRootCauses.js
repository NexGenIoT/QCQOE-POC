import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Tooltip,
  TableHead,
  TablePagination,
} from "@mui/material";
import {
  Box,
  Collapse,
  Paper,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  ListItem,
  MenuItem,
  Select,
  Typography,
  emphasize,
} from "@material-ui/core";
import Checkbox from "@mui/material/Checkbox";
import MatButton from "@material-ui/core/Button";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import DateRangePicker from "@mui/lab/DateRangePicker";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import TextField from "@mui/material/TextField";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import domtoimage from "dom-to-image";
import { createFileName } from "use-react-screenshot";
import {
  getCSVAnomalies,
  getERCauseCSV,
  getEstimatedRootRcaBucket,
  getEstimatedRootSecond,
  getLabeledRecordCSV,
  getRca,
  postEstimatedRootLabeled,
  setERCauseCSV,
  setEstimatedRootSecond,
} from "Store/Actions";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import exportFromJSON from "export-from-json";
import { NotificationManager } from "react-notifications";
import { Close } from "@material-ui/icons";
import CircularProgress from "@material-ui/core/CircularProgress";
import loader from "../../Assets/img/react-spinner.gif";
import { filter } from "@amcharts/amcharts4/.internal/core/utils/Iterator";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { DateRange } from "react-date-range";
// for the Pop up
// import Drawer from "@material-ui/core/Drawer";
// for the csv upload
import AnomalieCSVUpload from "./AnomalieCSVUpload";
import copy from "copy-to-clipboard";
import { adminMessage, isValidPermission } from "Constants/constant";

const EstimatedRootCauses = () => {
  const dispatch = useDispatch();
  const rcaData = useSelector((state) => state.qoeReducer);
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [toDateCSV, setToDateCSV] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );

  const [btn, setBtn] = useState("24hr");
  const [customDateValue, setCustomDateValue] = useState([null, null]);
  const [dashboardLoader, setDashboardLoader] = useState(false);
  const [downloadLoader, setDownloadLoader] = useState(false);
  const [rcaEditedData, setRcaEditedData] = useState([]);
  const [analysisWindowHours, setAnalysisWindowHours] = useState("");
  const [indexes, setIndexes] = useState(-1);
  const [rcaBucket, setrcaBucket] = useState("None");
  const [ids, setIds] = useState([]);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [secondIds, setSecondIds] = useState([]);
  const [secondCheckedIds, setSecondCheckedIds] = useState([]);
  const [selectAllSecondCheckbox, setSelectAllSecondCheckbox] = useState(false);
  const [totalAnomalyRecord, saveTotalAnomalyRecord] = useState("");
  const [totalAnomalyRecordSign, saveTotalAnomalyRecordSign] = useState("");
  const [problemScore, saveProblemScore] = useState("");
  const [problemScoreSign, saveProblemScoreSign] = useState("");
  const [totalRecords, saveTotalRecords] = useState("");
  const [totalRecordsSign, saveTotalRecordSign] = useState("");
  const [upperThresholdData, saveUpperThresholdData] = useState("");
  const [upperThresholdSign, saveUpperThresholdSign] = useState("");
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
  const [listDimension, setListDimension] = useState("");
  // for the POP UP
  const [isPreview, setIsPreview] = useState(false);

  // for the POP UP
  const [secondIsPreview, setSecondIsPreview] = useState(false);
  const [problematicText, setProblematicText] = useState();
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  // for the Upload functionality
  const [isUpload, setIsUpload] = useState(false);
  const [array, setArray] = useState([]);
  const [isEmptyFile, setIsEmptyFile] = useState(false);
  const [file, setFile] = useState();
  const fileReader = new FileReader();
  const [isFilterClick, setIsFilterClick] = React.useState(false);
  const [iSSecondLoader, setIsSecondLoader] = useState(false);
  const [isLabelClicked, setIsLabelClicked] = useState(false);

  const downloadLabelData = () => {
    setDownloadLoader(true);
    setIsLabelClicked(true);
    const filter = {
      anomaly_type: "erca",
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
      "labeled_data_ERC_" +
      moment(Math.floor(new Date(fromDate).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      ) +
      "-" +
      moment(Math.floor(new Date(toDateCSV).getTime() * 1000.0)).format(
        "DD/MM/YYYY"
      );
    const exportType = exportFromJSON.types.csv;
    if (rcaData?.labeledCSVRecord && isLabelClicked) {
      console.log("alabeled data--", rcaData);

      if (rcaData?.labeledCSVRecord?.Items.length > 0) {
        let data = [];
        data = rcaData?.labeledCSVRecord?.Items.map((ERS_data) => {
          let fullDate = moment(
            Math.floor(new Date(ERS_data.batch_time))
          ).format("DD/MM/YYYY hh:mm");
          delete ERS_data.batch_time;
          ERS_data.Date_Time = "  " + fullDate.toString();
          ERS_data.analysis_window_hrs =
            "  " + ERS_data.analysis_window_hrs.toString();
          if (ERS_data?.rca_bucket) {
            ERS_data.rca_bucket = ERS_data.rca_bucket;
          } else {
            ERS_data.rca_bucket = "";
          }
          if (ERS_data.is_approved) {
            ERS_data.is_approved = ERS_data.is_approved;
          } else {
            ERS_data.is_approved = 0;
          }

          return ERS_data;
        });
        if (data.length > 0) {
          setIsLabelClicked(false);
          exportFromJSON({
            data: data,
            fileName: fileName,
            exportType: exportType,
          });
        } else {
          setIsLabelClicked(false);
          NotificationManager.error("Data not found !!", "", 2000);
        }
      } else {
        setIsLabelClicked(false);
        NotificationManager.error("Data not found !!", "", 2000);
      }
    }
  }, [rcaData?.labeledCSVRecord]);

  const uploadCsvFile = () => {
    setArray([]);
    setIsUpload(true);
  };

  const handleOnChange = (e) => {
    setIsEmptyFile(false);
    setArray([]); // for empty
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

        // csvFileToJSON(file)
      };
      fileReader.readAsText(file);
      let toDate = Math.floor(new Date().getTime() / 1000.0);
      if (array.length > 0) {
        //  array.pop()
        array.filter((res) => {
          //to avoid udefined
          if (res == undefined || res == "") {
            return array.splice(array.indexOf(res));
          }
          //
          if (
            !res?.Date_Time &&
            !res?.analysis_window_hrs &&
            !res?.dimension &&
            !res?.problem_score &&
            !res?.rca_bucket &&
            !res?.rca_unique_id &&
            !res?.total_anomaly_records &&
            !res?.total_records &&
            !res?.upper_threshold
          ) {
            return array.splice(array.indexOf(res));
          }
          // const isEmpty = Object.values(res).every(x => x !== '' ||(x==0 || x==1))

          // console.log("aaaaa",isEmpty);
        });

        if (array.length > 0) {
          // setIds(array)
          const mainArray = [
            // "upper_threshold",
            // "total_records",
            // "analysis_window_hrs",
            // "total_anomaly_records",
            // "problem_score",
            // "dimension",
            // "rca_unique_id",
            // "batch_time",
            // "is_approved",
            // "rca_bucket"
            "rca_bucket",
            "upper_threshold",
            "total_records",
            "batch_time",
            "analysis_window_hrs",
            "total_anomaly_records",
            "problem_score",
            "dimension",
            "is_approved",
            "rca_unique_id",
          ];
          const ArrayObjkeys = Object.keys(array[0]);
          const missingArray = mainArray.filter(
            (f) => !ArrayObjkeys.includes(f)
          );

          if (missingArray.length > 0) {
            // if(missingArray.length>=9){
            //   NotificationManager.error("No Record Found","",2000);

            // }else{
            if (missingArray.includes("batch_time")) {
              missingArray[missingArray.indexOf("batch_time")] = "Date_Time";
            }
            const missingElements = missingArray.join(",\r\n");
            NotificationManager.error(
              `The following required colomns are missing in excel : ${missingElements}`,
              "",
              2000
            );

            // }
          } else {
            array.pop();
            // array.filter(res => { //to avoid udefined
            //   console.log(res,"rca bucket res");
            //   if (res.rca_bucket ==" \r" || res.rca_bucket == "" || res.rca_bucket == undefined) {
            //   // if (res == undefined) {
            //     return array.splice(array.indexOf(res));
            //   }
            // })
            setIds(array);
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
      const array =
        csvRows.length > 0
          ? csvRows.map((i) => {
              const values = i.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
              const obj = csvHeader.reduce((object, header, index) => {
                if (csvRows[index] !== undefined) {
                  rowArray.push(csvRows[index].split(","));
                }
                // if (values[index] !==undefined) {
                object[header.trim()] = values[index];
                // }
                return object;
              }, {});
              if (obj.is_approved !== undefined) {
                obj.is_approved =
                  obj.is_approved == 0 ? parseInt(0) : parseInt(1);
              }

              //obj.batch_time =  Math.floor(moment(changedDate).endOf("date")._d.getTime() / 1000.0)

              if (obj?.Date_Time) {
                let changedDate = moment(
                  obj.Date_Time,
                  "DD-MM-YYYY hh:mm"
                ).format("MM/DD/YYYY HH:MM");
                let mili = Math.floor(
                  moment(changedDate).endOf("date")._d.getTime()
                );
                obj.batch_time = mili;
                delete obj.Date_Time;
              }
              delete obj.type;
              /// commented check
              //if(obj.rca_bucket !=" \r" && obj.rca_bucket != ""){
              return obj;
              //}
              // else {
              //   NotificationManager.error("Please enter valid RCA Bucket name","",2000);
              // }
            })
          : [];
      console.log(array, "check array");
      setArray(array);
    } else {
      setTimeout(() => {
        NotificationManager.error("No Record Found", "", 2000);
      }, 2000);
    }
  };
  // end of file upload functionality
  const handleRemarkChange = (event, list, objectclick) => {
    let indexList = rcaEditedData.indexOf(list);
    let clickListIndex = rcaEditedData[indexList]?.value.indexOf(objectclick);
    rcaEditedData[indexList].value[clickListIndex].rca_bucket =
      event.target.value;
    setRcaEditedData([...rcaEditedData]);
  };
  const applyManualMiti = () => {
    if (ids.length > 0) {
      let toDate = Math.floor(new Date().getTime() / 1000.0);
      dispatch(
        postEstimatedRootLabeled(
          dispatch,
          "admin",
          toDate,
          toDate,
          fromDate,
          ids
        )
      );
    }
    setIsPreview(false);
    setIds([]);
  };

  // for the Pop
  const confirmApprove = () => {
    if (ids.length > 0) {
      setIsPreview(true);
      setIds(arrangeFirstTrailData());
      //setButtonType("Approve1")
    } else {
      NotificationManager.error(
        "Please select anomaly to reject or approve ",
        "",
        2000
      );
    }
  };
  //To handle selecting and removing  all filtered results
  const selectAll = () => {
    setSelectAllCheckbox(!selectAllCheckbox);
    let all = [];
    if (!selectAllCheckbox) {
      rcaEditedData.map((m) => {
        m.value.map((m2) => {
          return all.push(m2);
        });
      });

      setIds(all);
    } else if (selectAllCheckbox) {
      all = [];
      setIds([]);
    }
  };

  // loading estimated root second
  const { isSetEstimatedRootSecondLoader } = rcaData || {};

  const onChangeCheckbox = (data) => {
    // data.rca_bucket = "Testing";
    if (data.rca_bucket != "") {
      delete data.type;
      // for the batch Time
      var datemili = new Date(data.batch_time).getTime();

      data.batch_time = datemili;
      // data.is_approved = 1;
      setSelectAllCheckbox(false);
      const currentIndex = ids.indexOf(data);
      const newChecked = [...ids];
      if (currentIndex === -1) {
        newChecked.push(data);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setIds(newChecked);
    } else {
      NotificationManager.error("Please Select RCA Bucket First", "", 2000);
    }
  };

  const arrangeSecondTrailData = () => {
    if (secondIds.length > 0) {
      //TODO
      let tempArray = [];
      secondIds.map((data) => {
        data.is_approved = 1;
        tempArray.push(data);
      });
      return tempArray;
    }
  };

  const arrangeFirstTrailData = () => {
    if (secondIds.length > 0) {
      //TODO
      let tempArray = [];
      secondIds.map((data) => {
        data.is_approved = 1;
        if (selectAllCheckbox) {
          var datemili = new Date(data.batch_time).getTime();
          data.batch_time = datemili;
        }
        tempArray.push(data);
      });
      return tempArray;
    }
  };

  //To handle selecting and removing  all second filtered results
  const selectAllSecond = () => {
    setSelectAllSecondCheckbox(!selectAllSecondCheckbox);
    if (!selectAllSecondCheckbox) {
      setSecondIds(rcaData?.estimatedRootSecond?.Items);
    } else if (selectAllSecondCheckbox) {
      setSecondIds([]);
    }
  };

  const onChangeSecondCheckbox = (data) => {
    setSelectAllSecondCheckbox(false);
    // data.is_approved = 1;
    data.error_count = 0;
    // data.anomaly_type = "NA";

    const currentIndex = secondIds.indexOf(data);
    const newChecked = [...secondIds];
    if (currentIndex === -1) {
      newChecked.push(data);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setSecondIds(newChecked);
  };

  const getSecondData = (checkeddata) => {
    let array = checkeddata.map((data) => {
      data.errorname = "";
      delete data.m_bandwidth;
      delete data.m_rebuffering_ratio;
      delete data.networktype;
      delete data.device_id;
      delete data.drm;
      delete data.manufacturer;
      delete data.sessionid;
      delete data.live;
      delete data.has;
      delete data.m_video_start_time;
      delete data.userid;
      delete data.uploadtime;
      return data;
    });
    return array;
  };

  const applySecondManualMiti = () => {
    if (secondIds.length > 0) {
      setIndexes(-1);
      let toDate = Math.floor(new Date().getTime() / 1000.0);
      dispatch(
        getCSVAnomalies(
          dispatch,
          "admin",
          toDate,
          toDate,
          fromDate,
          getSecondData(secondIds)
        )
      );
      // dispatch(postEstimatedRootLabeled(dispatch, "admin", toDate, toDate, fromDate, secondIds))
      // setTimeout(() => {
      //   NotificationManager.success("Data Submitted successfully", '', 2000);
      // }, 1000);
    }
    setSecondIsPreview(false);
    setSecondIds([]);
  };

  // for the Pop
  // const confirmSecondApprove = () => {
  //   setSecondIsPreview(true)
  // }
  const clickOnSeconDrawer = (index, condition, list, plusMinusVal) => {
    if (plusMinusVal === "plus") {
      dispatch(setEstimatedRootSecond([]));
      let toDate = Math.floor(new Date().getTime() / 1000.0);
      index === indexes ? setIndexes(-1) : setIndexes(index);
      setAnalysisWindowHours(list?.analysis_window_hrs);
      setListDimension(list.dimension);
      condition &&
        dispatch(
          getEstimatedRootSecond(dispatch, toDate, fromDate, list.dimension)
        );
    } else {
      index === indexes ? setIndexes(-1) : setIndexes(index);
      setAnalysisWindowHours("");
      dispatch(setEstimatedRootSecond([]));
    }
  };

  useEffect(() => {
    setDashboardLoader(true);
    let filters = {
      totalAnomalyRecord,
      totalAnomalyRecordSign,
      problemScore,
      problemScoreSign,
      upperThresholdData,
      upperThresholdSign,
      totalRecords,
      totalRecordsSign,
    };
    //  let toDate = Math.floor((new Date()).getTime() / 1000.0);
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);
    dispatch(
      getEstimatedRootSecond(dispatch, toDate, fromDate, listDimension, filters)
    );
    setTimeout(() => {
      setDashboardLoader(false);
    }, [3000]);
    //problemScore, totalRecords, totalAnomalyRecord, upperThresholdData
  }, [fromDate, endDate]);

  const rejectDataAll = () => {
    setIds([]);
    setIsPreview(false);
    {
      selectAllCheckbox && setSelectAllCheckbox(false);
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

  const nonAnomaly = (selectedData) => {
    if (selectedData.length > 0) {
      let rejectArray = [];
      selectedData.map((res) => {
        res.is_approved = 1;
        rejectArray.push(res);
      });
      setIds(rejectArray);
    }
  };

  const rejectSecondData = () => {
    setSecondIds([]);
    setSecondIsPreview(false);
    {
      selectAllCheckbox && setSelectAllCheckbox(false);
    }
  };

  // const problematicFilter = (e) => {

  //   console.log("problematicFilter--", e);
  //   const keyword = e;

  //   if (keyword !== '') {
  //     const results = rcaData?.rcaDetect?.Items.filter((user) => {
  //       return user.dimension.toLowerCase().startsWith(keyword.toLowerCase());
  //       // Use the toLowerCase() method to make it case-insensitive
  //     });
  //     var output = results.reduce(function (o, cur) {

  //       // Get the index of the key-value pair.
  //       var occurs = o.reduce(function (n, item, i) {
  //         return (item.analysis_window_hrs === cur.analysis_window_hrs) ? i : n;
  //       }, -1);

  //       // If the name is found,
  //       if (occurs >= 0) {

  //         // append the current value to its list of values.
  //         cur["rca_bucket"] = "";
  //         o[occurs].value = o[occurs].value.concat(cur);

  //         // Otherwise,
  //       } else {

  //         // add the current item to o (but make sure the value is an array).
  //         cur["rca_bucket"] = "";
  //         var obj = {
  //           batch_time: cur?.batch_time,
  //           analysis_window_hrs: cur.analysis_window_hrs,
  //           value: [cur]
  //         };
  //         o = o.concat([obj]);
  //       }

  //       return o;
  //     }, []);

  //     setRcaEditedData(output);
  //   } else {
  //     var output = rcaData?.rcaDetect?.Items.reduce(function (o, cur) {

  //       // Get the index of the key-value pair.
  //       var occurs = o.reduce(function (n, item, i) {
  //         return (item.analysis_window_hrs === cur.analysis_window_hrs) ? i : n;
  //       }, -1);

  //       // If the name is found,
  //       if (occurs >= 0) {

  //         // append the current value to its list of values.
  //         cur["rca_bucket"] = "";
  //         o[occurs].value = o[occurs].value.concat(cur);

  //         // Otherwise,
  //       } else {

  //         // add the current item to o (but make sure the value is an array).
  //         cur["rca_bucket"] = "";
  //         var obj = {
  //           batch_time: cur?.batch_time,
  //           analysis_window_hrs: cur.analysis_window_hrs,
  //           value: [cur]
  //         };
  //         o = o.concat([obj]);
  //       }

  //       return o;
  //     }, []);
  //     setRcaEditedData(output);
  //     // If the text field is empty, show all users
  //   }

  //   setProblematicText(keyword);
  // };

  useEffect(() => {
    if (isFilterClick) {
      setDashboardLoader(true);
      let toDate = endDate
        ? Math.floor(
            moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0
          )
        : Math.floor(new Date().getTime() / 1000.0);
      setToDateCSV(toDate);
      let filters = {
        totalAnomalyRecord,
        totalAnomalyRecordSign,
        problemScore,
        problemScoreSign,
        upperThresholdData,
        upperThresholdSign,
        totalRecords,
        totalRecordsSign,
      };
      dispatch(
        getRca(
          dispatch,
          toDate,
          fromDate,
          page,
          rcaData?.rcaDetect?.next_iteration_id
            ? rcaData?.rcaDetect?.next_iteration_id
            : "",
          filters
        )
      );
      dispatch(getEstimatedRootRcaBucket(dispatch));

      setTimeout(
        () => {
          setIsFilterClick(false);
          setDashboardLoader(false);
        },
        btn == "weekly" ? 10000 : btn == "monthly" ? 10000 : 10000
      );
    }

    //totalAnomalyRecord, problemScore, upperThresholdData, totalRecords,
  }, [isFilterClick]);

  useEffect(() => {
    setDashboardLoader(true);
    //  let toDate = Math.floor((new Date()).getTime() / 1000.0);
    let toDate = endDate
      ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
      : Math.floor(new Date().getTime() / 1000.0);

    setToDateCSV(toDate);
    let filters = {
      totalAnomalyRecord,
      totalAnomalyRecordSign,
      problemScore,
      problemScoreSign,
      upperThresholdData,
      upperThresholdSign,
      totalRecords,
      totalRecordsSign,
    };
    dispatch(
      getRca(
        dispatch,
        toDate,
        fromDate,
        page,
        rcaData?.rcaDetect?.next_iteration_id
          ? rcaData?.rcaDetect?.next_iteration_id
          : "",
        filters
      )
    );
    dispatch(getEstimatedRootRcaBucket(dispatch));
    // dispatch(getERCauseCSV(dispatch, toDate, fromDate, 1))
    setTimeout(
      () => {
        setDashboardLoader(false);
      },
      btn == "weekly" ? 10000 : btn == "monthly" ? 10000 : 10000
    );
  }, [fromDate, endDate]);
  // useEffect(() => {
  //   if (customDateValue[0] !== null && customDateValue[1] !== null) {
  //     setDashboardLoader(true)
  //     let fdate = customDateValue[0];
  //     let tdate = customDateValue[1];
  //     dispatch(getRca(dispatch, Math.floor(tdate.getTime() / 1000.0), Math.floor(fdate.getTime() / 1000.0)))
  //     setTimeout(() => {
  //       setDashboardLoader(false)
  //       setCustomDateValue([null, null])
  //    }, 14000);
  //   }
  // }, [customDateValue]);
  useEffect(() => {
    if (rcaData?.rcaDetect?.Items) {
      var output = rcaData?.rcaDetect?.Items.reduce(function (o, cur) {
        // Get the index of the key-value pair.
        var occurs = o.reduce(function (n, item, i) {
          return item.analysis_window_hrs === cur.analysis_window_hrs ? i : n;
        }, -1);

        // If the name is found,
        if (occurs >= 0) {
          // append the current value to its list of values.
          cur["rca_bucket"] = "";
          o[occurs].value = o[occurs].value.concat(cur);

          // Otherwise,
        } else {
          // add the current item to o (but make sure the value is an array).
          cur["rca_bucket"] = "";
          var obj = {
            batch_time: cur?.batch_time,
            analysis_window_hrs: cur.analysis_window_hrs,
            value: [cur],
          };
          o = o.concat([obj]);
        }

        return o;
      }, []);
      setRcaEditedData(output.sort());
    }
  }, [rcaData?.rcaDetect]);

  const getImage = () => {
    // var data = rcaData.ercauseCSVRecord
    // var node = document.querySelector('.full-table');
    // domtoimage.toPng(node)
    //   .then(function (dataUrl) {
    //     const a = document.createElement('a')
    //     a.href = dataUrl
    //     a.download = createFileName('png', 'table')
    //     a.click()
    //   })
    //   .catch(function (error) {
    //     console.error('oops, something went wrong!', error);
    //   })
    setDownloadLoader(true);
    let toDate = Math.floor(new Date().getTime() / 1000.0);
    setToDateCSV(toDate);
    dispatch(setERCauseCSV([]));
    const exportType = exportFromJSON.types.csv;

    const fileName =
      "Estimated_Root_Cause_" +
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
    // dispatch(getERCauseCSV(dispatch, toDate, fromDate, 1))
    // var data = rcaData.ercauseCSVRecord
    // exportFromJSON({ data, fileName, exportType });

    const newData = getDetailedRCARecords(toDate, fromDate, 1);
    newData
      .then(function (res) {
        let data = [];
        data = res.Items.map((ERS_data) => {
          let fullDate = moment(
            Math.floor(new Date(ERS_data.batch_time))
          ).format("DD/MM/YYYY hh:mm");
          delete ERS_data.batch_time;
          ERS_data.Date_Time = "  " + fullDate.toString();
          ERS_data.analysis_window_hrs =
            "  " + ERS_data.analysis_window_hrs.toString();
          if (ERS_data?.rca_bucket) {
            ERS_data.rca_bucket = ERS_data.rca_bucket;
          } else {
            ERS_data.rca_bucket = "";
          }
          if (ERS_data.is_approved) {
            ERS_data.is_approved = ERS_data.is_approved;
          } else {
            ERS_data.is_approved = 0;
          }

          return ERS_data;
        });
        if (data.length > 0) {
          exportFromJSON({
            data: data,
            fileName: fileName,
            exportType: exportType,
          });
        }
        setDownloadLoader(false);
      })
      .catch(function () {
        setDownloadLoader(false);
      });
  };

  const getDetailedRCARecords = (to_time, from_time, upper_threshold) => {
    const headers = {
      contentType: "application/json",
    };
    let filter = {};
    if (
      Object.values(totalAnomalyRecord).length > 0 &&
      Object.values(totalAnomalyRecordSign).length > 0
    ) {
      filter["total_anomaly_records"] = [
        totalAnomalyRecordSign,
        Number(totalAnomalyRecord),
      ];
    }
    if (
      Object.values(problemScore).length > 0 &&
      Object.values(problemScoreSign).length > 0
    ) {
      filter["problem_score"] = [problemScoreSign, Number(problemScore)];
    }
    if (
      Object.values(totalRecords).length > 0 &&
      Object.values(totalRecordsSign).length > 0
    ) {
      filter["total_records"] = [totalRecordsSign, Number(totalRecords)];
    }
    if (
      Object.values(upperThresholdData).length > 0 &&
      Object.values(upperThresholdSign).length > 0
    ) {
      filter["upper_threshold"] = [
        upperThresholdSign,
        Number(upperThresholdData),
      ];
    }

    let filterBody = {
      filters: filter,
    };

    return fetch(
      `http://3.6.164.157:8084/api/GetDetailedRCARecords?to_time=${to_time}&from_time=${from_time}&upper_threshold=${upper_threshold}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify(filterBody),
      }
    ).then((res) => res.json());
  };

  // const submit = () => {
  //   console.log("range--",range,Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0),Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0));
  //   setStartDate(Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0));
  //   setEndDate(Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0));
  //   setModalOpen(false);
  //   setToDateCSV(Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0))
  //   setFromDate(Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0))
  //   setDashboardLoader(true)
  //   dispatch(getRca(dispatch, Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0), page, rcaData?.rcaDetect?.next_iteration_id ? rcaData?.rcaDetect?.next_iteration_id : ""))
  //   dispatch(getEstimatedRootRcaBucket(dispatch))

  //   setTimeout(() => {
  //     setDashboardLoader(false)
  //   }, 5000);
  //   // setToDate(
  //   //   Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
  //   // );
  //   // setFromDate(Math.floor(range[0].startDate.getTime() / 1000.0));
  // };

  const submit = () => {
    console.log(range[0], "ramge");
    setBtn("");
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    setModalOpen(false);
    setToDateCSV(
      Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
    );
    setFromDate(
      Math.floor(
        moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0
      ) -
        24 * 3600 +
        500
    );
    // setDashboardLoader(true)
    // dispatch(getAnomaliesDetect(dispatch, Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0), anamolyScore, rowsPerPage, ""))
    // setTimeout(() => {
    //   setDashboardLoader(false)
    // }, 5000);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const clearFilter = () => {
    //setIsFilterClick(true);
    saveTotalAnomalyRecord("");
    saveTotalAnomalyRecordSign("");
    saveProblemScoreSign("");
    saveProblemScore("");
    saveTotalRecordSign("");
    saveTotalRecords("");
    saveUpperThresholdSign("");
    saveUpperThresholdData("");

    // console.log({ totalAnomalyRecord, totalAnomalyRecordSign, problemScore, problemScoreSign, problematicText });
  };

  const applyFilter = () => {
    setIsFilterClick(true);
    console.log({
      totalAnomalyRecord,
      totalAnomalyRecordSign,
      problemScore,
      problemScoreSign,
      problematicText,
    });
  };

  const clickOnItem = (item, value) => {
    if (item) {
      NotificationManager.success(`${item} copied`, "", 200);
      copy(value);
    }
  };

  const checkpermission = () => {
    if (isValidPermission("WRITE_ESTIMATED_ROOT_CAUSE")) {
      uploadCsvFile();
    } else {
      NotificationManager.error(adminMessage.message);
    }
  };

  return (
    <>
      <div className="cta-btn">
        <div className="top-left-nav">
          <Typography
            variant="h5"
            style={{ fontSize: "1.2rem", paddingLeft: "13px" }}
          >
            Estimated Root Causes ({rcaEditedData.length})
          </Typography>
        </div>
        <div className="status-report">
          <MatButton
            onClick={() => {
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
              );
              setBtn("24hr");
              setDashboardLoader(true);
              setStartDate();
              setEndDate();
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
              setDashboardLoader(true);
              setStartDate();
              setEndDate();
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
              setDashboardLoader(true);
              setStartDate();
              setEndDate();
            }}
            className={btn === "monthly" ? "Status-btn-active" : "Status-btn"}
          >
            72hrs
          </MatButton>

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
            style={{ fontSize: "19px", color: "#E10092" }}
            onClick={getImage}
          >
            {" "}
            <Tooltip
              title="Download Estimated Root Cause Data Not Labeled"
              arrow
            >
              <i className="zmdi zmdi-download"></i>
            </Tooltip>
          </MatButton>
          <MatButton
            className="Status-btn"
            style={{ fontSize: "19px", color: "#e20092" }}
            onClick={checkpermission}
          >
            <Tooltip title="Upload CSV File" arrow>
              <i className="zmdi zmdi-upload"></i>
            </Tooltip>
          </MatButton>
          <Tooltip title="Download Estimated Root Cause Labeled Data" arrow>
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
            onClick={() => setMobileMenu(true)}
            endIcon={<FilterAltOutlinedIcon />}
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
          {rcaData?.rcaDetect?.Items && rcaData?.rcaDetect?.Items.length > 0 ? (
            <div className="full-table">
              <TableContainer>
                <Table sx={{ minWidth: 650 }}>
                  <TableHead
                    style={{
                      backgroundColor: "#ffffff",
                      borderBottom: "#ffffff",
                    }}
                  >
                    <TableRow
                      style={{
                        borderBottom: "1px solid white",
                        color: "rgb(151 151 151 / 87%)",
                      }}
                      sx={{ border: 0 }}
                    >
                      <TableCell></TableCell>
                      <TableCell>Dimension</TableCell>
                      <TableCell>RCA Unique ID</TableCell>
                      <TableCell>Batch Time</TableCell>
                      <TableCell>Analysis Window Hrs</TableCell>
                      <TableCell>Total Anomaly Records</TableCell>
                      <TableCell>Problem Score</TableCell>
                      <TableCell>Total Records </TableCell>
                      <TableCell>Upper Threshold</TableCell>
                      <TableCell>Rca Bucket</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  {rcaEditedData &&
                    rcaEditedData
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((list, index) => {
                        let fullDate = Math.floor(
                          new Date(list?.batch_time).getTime() * 1000.0
                        );

                        return (
                          <>
                            <TableRow style={{ background: "#ddd" }}>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell>
                                <p
                                  style={{ "font-size": "0.925rem !important" }}
                                >
                                  {moment(fullDate / 1000).format("DD-MM-YYYY")}{" "}
                                </p>
                              </TableCell>

                              <TableCell>
                                <h3>{list.analysis_window_hrs}</h3>
                              </TableCell>
                              <TableCell> </TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                            {list.value.map((list2, index) => {
                              return (
                                <>
                                  <TableRow
                                    style={{
                                      borderBottom: "1px solid white",
                                      color: "rgb(151 151 151 / 87%)",
                                    }}
                                    sx={{ border: 0 }}
                                  >
                                    <TableCell>
                                      {list2.analysis_window_hrs ===
                                        analysisWindowHours &&
                                      index === indexes ? (
                                        <i
                                          onClick={() => {
                                            clickOnSeconDrawer(
                                              index,
                                              false,
                                              list2,
                                              "minus"
                                            );
                                            setIsSecondLoader(false);
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
                                            clickOnSeconDrawer(
                                              index,
                                              true,
                                              list2,
                                              "plus"
                                            );
                                            setIsSecondLoader(true);
                                          }}
                                          className="zmdi zmdi-plus-circle"
                                        ></i>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <p className="anomalyptag">
                                        {list2.dimension}
                                      </p>
                                    </TableCell>
                                    <TableCell>
                                      {" "}
                                      <p
                                        className="anomalyptag"
                                        onClick={() =>
                                          clickOnItem(
                                            "RCA Unique Id",
                                            list2.rca_unique_id
                                          )
                                        }
                                      >
                                        {" "}
                                        <span
                                          className="zmdi zmdi-copy"
                                          style={{ "font-size": "1.2rem" }}
                                        ></span>{" "}
                                        {list2.rca_unique_id}
                                      </p>
                                    </TableCell>
                                    <TableCell>
                                      {moment(fullDate / 1000).format(
                                        "DD-MM-YYYY"
                                      ) +
                                        " | " +
                                        moment(fullDate / 1000)
                                          .utcOffset(330)
                                          .format("hh:mm:a")}
                                    </TableCell>
                                    <TableCell>
                                      {" "}
                                      {list2.analysis_window_hrs}
                                    </TableCell>
                                    <TableCell>
                                      {list2.total_anomaly_records}
                                    </TableCell>
                                    <TableCell>{list2.problem_score}</TableCell>
                                    <TableCell>
                                      {list2.total_records}{" "}
                                    </TableCell>
                                    <TableCell>
                                      {list2.upper_threshold}
                                    </TableCell>
                                    <TableCell>
                                      <TextField
                                        id="outlined-select-currency"
                                        variant="standard"
                                        fullWidth
                                        select
                                        placeholder="rca bucket"
                                        className="rcabucketdd"
                                        value={list2.rca_bucket}
                                        onChange={(event) => {
                                          handleRemarkChange(
                                            event,
                                            list,
                                            list2
                                          );
                                        }}
                                      >
                                        <MenuItem key={"None"} value={"None"}>
                                          {"None"}
                                        </MenuItem>

                                        {rcaData?.estimatedRootRcaBucket?.Items.map(
                                          (option) => (
                                            <MenuItem
                                              key={option.bucket_name}
                                              value={option.bucket_name}
                                            >
                                              {option.bucket_name}
                                            </MenuItem>
                                          )
                                        )}
                                      </TextField>
                                    </TableCell>
                                    <TableCell>
                                      <Checkbox
                                        disabled={
                                          !isValidPermission(
                                            "WRITE_ESTIMATED_ROOT_CAUSE"
                                          )
                                        }
                                        onChange={() => onChangeCheckbox(list2)}
                                        edge="start"
                                        checked={ids.indexOf(list2) !== -1}
                                      />
                                    </TableCell>
                                  </TableRow>

                                  {/* second trail---------------start------------------------- */}

                                  <TableRow>
                                    <TableCell
                                      style={{
                                        paddingBottom: 0,
                                        paddingTop: 0,
                                      }}
                                      colSpan={12}
                                    >
                                      <Collapse
                                        in={
                                          list2.analysis_window_hrs ===
                                            analysisWindowHours &&
                                          index === indexes
                                        }
                                        timeout="auto"
                                        unmountOnExit
                                      >
                                        <Box>
                                          <TableContainer>
                                            <Table sx={{ minWidth: 650 }}>
                                              <TableHead
                                                style={{ whiteSpace: "nowrap" }}
                                              >
                                                <TableRow>
                                                  <TableCell>
                                                    Anomaly Id
                                                  </TableCell>
                                                  <TableCell>
                                                    Anomaly Score
                                                  </TableCell>
                                                  <TableCell>
                                                    Anomaly Type
                                                  </TableCell>
                                                  <TableCell>
                                                    Content Partner
                                                  </TableCell>
                                                  <TableCell>
                                                    Device Id
                                                  </TableCell>
                                                  <TableCell>
                                                    Platform
                                                  </TableCell>
                                                  <TableCell>DRM</TableCell>
                                                  <TableCell>
                                                    Date/Time
                                                  </TableCell>
                                                  <TableCell> HAS</TableCell>
                                                  <TableCell>
                                                    {" "}
                                                    Approval
                                                  </TableCell>
                                                  <TableCell>
                                                    {" "}
                                                    Error Count
                                                  </TableCell>
                                                  <TableCell>
                                                    {" "}
                                                    Error Code
                                                  </TableCell>
                                                  <TableCell>Live</TableCell>
                                                  <TableCell>
                                                    Location
                                                  </TableCell>
                                                  <TableCell>
                                                    Bandwidth
                                                  </TableCell>
                                                  <TableCell>
                                                    Rebuffering Ratio{" "}
                                                  </TableCell>
                                                  <TableCell>
                                                    Video Start Time
                                                  </TableCell>
                                                  <TableCell>
                                                    Manufacturer
                                                  </TableCell>
                                                  <TableCell>
                                                    Network{" "}
                                                  </TableCell>
                                                  <TableCell>
                                                    Session Id{" "}
                                                  </TableCell>
                                                  <TableCell>
                                                    Video Id{" "}
                                                  </TableCell>
                                                  <TableCell>
                                                    Anomaly Explanation{" "}
                                                  </TableCell>
                                                  <TableCell></TableCell>
                                                </TableRow>
                                              </TableHead>
                                              {isSetEstimatedRootSecondLoader ? (
                                                index === indexes &&
                                                list2.analysis_window_hrs ===
                                                  analysisWindowHours &&
                                                iSSecondLoader ? (
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
                                                      style={{
                                                        marginLeft: "100%",
                                                      }}
                                                    />
                                                  </span>
                                                ) : (
                                                  "Record Not Found"
                                                )
                                              ) : rcaData?.estimatedRootSecond
                                                  ?.Items &&
                                                rcaData?.estimatedRootSecond
                                                  ?.Items.length > 0 ? (
                                                rcaData?.estimatedRootSecond?.Items.map(
                                                  (second, index2) => {
                                                    let fullDate = Math.floor(
                                                      new Date(
                                                        second?.dts
                                                      ).getTime() * 1000.0
                                                    );
                                                    return (
                                                      <TableRow
                                                        key={index2}
                                                        style={{
                                                          backgroundColor:
                                                            "#ffffff",
                                                          borderBottom: "0px",
                                                        }}
                                                      >
                                                        <TableCell>
                                                          {" "}
                                                          <p
                                                            className="anomalyptag"
                                                            onClick={() =>
                                                              clickOnItem(
                                                                "Anomaly ID",
                                                                second?.anomaly_id
                                                              )
                                                            }
                                                          >
                                                            {" "}
                                                            <span
                                                              className="zmdi zmdi-copy"
                                                              style={{
                                                                "font-size":
                                                                  "1.2rem",
                                                              }}
                                                            ></span>{" "}
                                                            {second?.anomaly_id}
                                                          </p>
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.anomaly_score}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.anomaly_type ==
                                                          null
                                                            ? "NA"
                                                            : second.anomaly_type}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {
                                                            second.content_partner
                                                          }
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.device_id}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {
                                                            second.device_platform
                                                          }
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.drm}
                                                        </TableCell>
                                                        <TableCell>
                                                          {moment(
                                                            fullDate / 1000
                                                          ).format(
                                                            "DD-MM-YYYY"
                                                          ) +
                                                            " | " +
                                                            moment(
                                                              fullDate / 1000
                                                            )
                                                              .utcOffset(330)
                                                              .format(
                                                                "hh:mm:a"
                                                              )}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.has}
                                                        </TableCell>
                                                        <TableCell>
                                                          {second?.is_approved ==
                                                          0
                                                            ? "Not-Approved"
                                                            : second?.is_approved ==
                                                              1
                                                            ? "Approved"
                                                            : "Pending-Approval"}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.error_count}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.errorcode}
                                                        </TableCell>
                                                        <TableCell>
                                                          {second?.live
                                                            ? "Yes"
                                                            : "No"}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.location_city}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.m_bandwidth}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {
                                                            second.m_rebuffering_ratio
                                                          }
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {
                                                            second.m_video_start_time
                                                          }
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.manufacturer}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.networktype}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.sessionid}
                                                        </TableCell>
                                                        <TableCell>
                                                          {" "}
                                                          {second.videoid}
                                                        </TableCell>
                                                        <TableCell>
                                                          <p
                                                            className="anomalyptag"
                                                            onClick={() =>
                                                              clickOnItem(
                                                                "Anomaly Explanation",
                                                                second?.anomaly_explanation
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
                                                              second?.anomaly_explanation
                                                            }
                                                          </p>
                                                        </TableCell>

                                                        <TableCell>
                                                          <Checkbox
                                                            disabled={
                                                              !isValidPermission(
                                                                "WRITE_ESTIMATED_ROOT_CAUSE"
                                                              )
                                                            }
                                                            onChange={() =>
                                                              onChangeSecondCheckbox(
                                                                second
                                                              )
                                                            }
                                                            edge="start"
                                                            checked={
                                                              secondIds.indexOf(
                                                                second
                                                              ) !== -1
                                                            }
                                                          />
                                                        </TableCell>
                                                      </TableRow>
                                                    );
                                                  }
                                                )
                                              ) : (
                                                // (
                                                //   // <span><CircularProgress /></span>
                                                //   <RctPageLoader />
                                                // )}
                                                <h2
                                                  style={{
                                                    textAlign: "center",
                                                    alignSelf: "center",
                                                  }}
                                                >
                                                  {" "}
                                                  No Data Found
                                                </h2>
                                              )}
                                            </Table>
                                          </TableContainer>
                                        </Box>
                                        {secondIds && secondIds.length > 0 ? (
                                          <div className="apply-container">
                                            <Checkbox
                                              disabled={
                                                !isValidPermission(
                                                  "WRITE_ESTIMATED_ROOT_CAUSE"
                                                )
                                              }
                                              onChange={() => selectAllSecond()}
                                              checked={selectAllSecondCheckbox}
                                            />
                                            <MatButton className="apply-filter-btn">
                                              {" "}
                                              Select All{" "}
                                            </MatButton>
                                            <div className="right-aligne-button">
                                              <MatButton
                                                className="apply-filter-btn"
                                                onClick={() => {
                                                  setSecondIds([]);
                                                  {
                                                    selectAllCheckbox &&
                                                      setSelectAllCheckbox(
                                                        false
                                                      );
                                                  }
                                                }}
                                              >
                                                Reject
                                              </MatButton>

                                              <MatButton
                                                className="apply-btn"
                                                onClick={() => {
                                                  setSecondIds(
                                                    arrangeSecondTrailData()
                                                  );
                                                  setSecondIsPreview(true);
                                                }}
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
                                        ) : (
                                          ""
                                        )}
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                  {/* second trail---------------end------------------------- */}
                                </>
                              );
                            })}
                          </>
                        );
                      })}
                  {/* </>
              } */}
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[10, 20, 50, 100]}
                component="div"
                count={rcaEditedData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                className="paginationstyle"
              />
              {rcaData?.rcaDetect?.Items.length > 0 ? (
                <div className="apply-container">
                  <Checkbox
                    disabled={!isValidPermission("WRITE_ESTIMATED_ROOT_CAUSE")}
                    onChange={() => selectAll()}
                    checked={selectAllCheckbox}
                  />
                  <MatButton className="apply-filter-btn">
                    {" "}
                    Select All{" "}
                  </MatButton>
                  <div className="right-aligne-button">
                    <MatButton
                      className="apply-filter-btn"
                      onClick={() => rejectData()}
                    >
                      Reject
                    </MatButton>

                    <MatButton
                      onClick={confirmApprove}
                      //onClick={applyManualMiti}
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
              ) : null}
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
          {/* for the Pop */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
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
                  {console.log("ids data", ids)}
                  Preview Data ({ids?.length})
                </span>
                <i
                  onClick={() => {
                    setIsPreview(false);
                    setIds([]);
                  }}
                  className="zmdi zmdi-close"
                ></i>
              </div>
              <div className="full-table">
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead
                      style={{
                        backgroundColor: "#ffffff",
                        borderBottom: "#ffffff",
                      }}
                    >
                      <TableRow
                        style={{
                          borderBottom: "1px solid white",
                          color: "rgb(151 151 151 / 87%)",
                        }}
                        sx={{ border: 0 }}
                      >
                        <TableCell> Dimension</TableCell>
                        <TableCell>Batch Time</TableCell>
                        <TableCell>Analysis Window Hrs</TableCell>
                        <TableCell>Total Anomaly Records</TableCell>
                        <TableCell>Approval</TableCell>
                        <TableCell>Problem Score</TableCell>
                        <TableCell>Total Records </TableCell>
                        <TableCell>Upper Threshold</TableCell>
                        <TableCell>Rca Bucket</TableCell>
                      </TableRow>
                    </TableHead>
                    {ids.length > 0 ? (
                      ids.map((list3, index) => {
                        let fullDate = Math.floor(
                          new Date(
                            list3?.batch_time || list3?.Date_Time
                          ).getTime() * 1000.0
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
                              <p className="anomalyptag">{list3.dimension}</p>
                            </TableCell>
                            <TableCell>
                              {moment(fullDate).format("DD-MM-YYYY") +
                                " | " +
                                moment(fullDate / 1000)
                                  .utcOffset(330)
                                  .format("hh:mm:a")}
                            </TableCell>
                            <TableCell> {list3.analysis_window_hrs}</TableCell>
                            <TableCell>{list3.total_anomaly_records}</TableCell>
                            <TableCell>
                              {list3?.is_approved == 0
                                ? "Not-Approved"
                                : list3?.is_approved == 1
                                ? "Approved"
                                : "Pending-Approval"}
                            </TableCell>
                            <TableCell>{list3.problem_score}</TableCell>
                            <TableCell>{list3.total_records} </TableCell>
                            <TableCell>{list3.upper_threshold}</TableCell>
                            <TableCell>{list3.rca_bucket}</TableCell>
                          </TableRow>

                          // </Table>
                          // </TableContainer>
                        );
                      })
                    ) : (
                      <h2 style={{ textAlign: "center", marginTop: "113px" }}>
                        {" "}
                        No Data Found
                      </h2>
                    )}
                  </Table>
                </TableContainer>
              </div>
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
                  onClick={() => rejectDataAll()}
                >
                  {"No"}
                </MatButton>
              </div>
            </Drawer>
          </Paper>

          {/* for the Pop second */}
          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <Drawer
              anchor="bottom"
              open={secondIsPreview}
              onClose={() => setSecondIsPreview(false)}
              className="drawer-mitigation"
            >
              <div className="drawer-header">
                <span>
                  {" "}
                  <i
                    onClick={() => setSecondIsPreview(false)}
                    className="zmdi zmdi-arrow-left"
                  ></i>{" "}
                  Preview Data ({secondIds?.length})
                </span>
                <i
                  onClick={() => {
                    setSecondIsPreview(false);
                    rejectDataAll();
                  }}
                  className="zmdi zmdi-close"
                ></i>
              </div>
              <div className="detectedanomalies">
                <TableContainer>
                  <Table sx={{ minWidth: 650 }}>
                    <TableHead
                      style={{
                        backgroundColor: "#ffffff",
                        borderBottom: "#ffffff",
                      }}
                    >
                      <TableRow
                        style={{
                          borderBottom: "1px solid white",
                          color: "rgb(151 151 151 / 87%)",
                        }}
                        sx={{ border: 0 }}
                      >
                        <TableCell>Anomaly Id</TableCell>
                        <TableCell>Anomaly Score</TableCell>
                        <TableCell>Anomaly Type</TableCell>
                        <TableCell>Content Partner</TableCell>
                        <TableCell>Device Id</TableCell>
                        <TableCell> Platform </TableCell>
                        <TableCell>DRM</TableCell>
                        <TableCell>Date/Time</TableCell>
                        <TableCell> HAS </TableCell>
                        <TableCell>Location</TableCell>
                        <TableCell>Bandwidth</TableCell>
                        <TableCell>Rebuffering Ratio </TableCell>
                        <TableCell>Video Start Time</TableCell>
                        <TableCell>Manufacturer</TableCell>
                        <TableCell>Network </TableCell>
                        <TableCell>Session Id </TableCell>
                      </TableRow>
                    </TableHead>
                    {secondIds.length > 0 ? (
                      secondIds.map((list4, index) => {
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
                              {" "}
                              <p className="anomalyptag"> {list4.anomaly_id}</p>
                            </TableCell>
                            <TableCell> {list4.anomaly_score}</TableCell>
                            <TableCell>
                              {" "}
                              {list4.anomaly_type == null
                                ? "NA"
                                : list4.anomaly_type}
                            </TableCell>
                            <TableCell> {list4.content_partner}</TableCell>
                            <TableCell> {list4.device_id}</TableCell>
                            <TableCell> {list4.device_platform}</TableCell>
                            <TableCell> {list4.drm}</TableCell>
                            <TableCell> {list4.dts}</TableCell>
                            <TableCell> {list4.has}</TableCell>
                            <TableCell> {list4.location_city}</TableCell>
                            <TableCell> {list4.m_bandwidth}</TableCell>
                            <TableCell> {list4.m_rebuffering_ratio}</TableCell>
                            <TableCell> {list4.m_video_start_time}</TableCell>
                            <TableCell> {list4.manufacturer}</TableCell>
                            <TableCell> {list4.networktype}</TableCell>
                            <TableCell> {list4.sessionid}</TableCell>
                          </TableRow>

                          // </Table>
                          //</TableContainer>
                        );
                      })
                    ) : (
                      <h2 style={{ textAlign: "center", marginTop: "113px" }}>
                        {" "}
                        No Data Found
                      </h2>
                    )}
                  </Table>
                </TableContainer>
              </div>
              <div style={{ display: "flex", margin: "auto" }}>
                <MatButton
                  className="Status-btn"
                  style={{
                    fontSize: "10px",
                    color: "#ffffff",
                    backgroundColor: "#e20092",
                  }}
                  onClick={applySecondManualMiti}
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
                  onClick={() => rejectSecondData()}
                >
                  {"No"}
                </MatButton>
              </div>
            </Drawer>
          </Paper>
        </>
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

      <div>
        <Drawer
          open={mobileMenu}
          onClose={() => {
            setMobileMenu(false);
          }}
          anchor={"right"}
        >
          <div
            className="FilterContainer"
            style={{ height: "90%", overflowY: "auto" }}
          >
            <div className="SideBarHeader" style={{ marginBottom: "-30px" }}>
              <h3>Filter</h3>
              <IconButton onClick={() => setMobileMenu(false)}>
                {" "}
                <Close />
              </IconButton>
            </div>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3>Total Anomaly Record</h3>
              <FilterSelectionInput
                setSignValue={totalAnomalyRecordSign}
                setInputValue={totalAnomalyRecord}
                saveSignValue={saveTotalAnomalyRecordSign}
                saveInputValue={saveTotalAnomalyRecord}
              />
            </ListItem>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3>Problem Score</h3>
              <FilterSelectionInput
                setSignValue={problemScoreSign}
                setInputValue={problemScore}
                saveSignValue={saveProblemScoreSign}
                saveInputValue={saveProblemScore}
              />
            </ListItem>

            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3>Total Records</h3>
              <FilterSelectionInput
                setSignValue={totalRecordsSign}
                setInputValue={totalRecords}
                saveSignValue={saveTotalRecordSign}
                saveInputValue={saveTotalRecords}
              />
            </ListItem>

            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3>Upper Threshold</h3>
              <FilterSelectionInput
                setSignValue={upperThresholdSign}
                setInputValue={upperThresholdData}
                saveSignValue={saveUpperThresholdSign}
                saveInputValue={saveUpperThresholdData}
              />
            </ListItem>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <MatButton
                onClick={() => {
                  clearFilter();
                  //setMobileMenu(false)
                }}
                className="addnew-config"
              >
                Clear
              </MatButton>
              <MatButton
                onClick={() => {
                  applyFilter();
                  setMobileMenu(false);
                }}
                className="addnew-config"
              >
                Filter
              </MatButton>
            </ListItem>
          </div>
        </Drawer>
      </div>
    </>
  );
};

export default EstimatedRootCauses;

const FilterSelectionInput = ({
  setInputValue,
  setSignValue,
  saveSignValue,
  saveInputValue,
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} md={6}>
        <FormControl fullWidth>
          <Select
            value={setSignValue}
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            variant="outlined"
            style={{ height: "40px" }}
            onChange={(e) => {
              saveSignValue(e.target.value);
            }}
          >
            <MenuItem key=">=" value="_gte">
              &gt;=
            </MenuItem>
            <MenuItem key="<=" value="_lte">
              &#60;=
            </MenuItem>
            <MenuItem key=">" value="_gt">
              &gt;
            </MenuItem>
            <MenuItem key="<" value="_lt">
              {" "}
              &#60;
            </MenuItem>
            <MenuItem key="==" value="_eq">
              =
            </MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={6} md={6}>
        <TextField
          value={setInputValue}
          id="outlined-basic"
          label=""
          variant="outlined"
          size="small"
          type={"number"}
          style={{
            background: "#f7f7f7",
            border: "1",
            borderRadius: "4px",
            width: "100%",
          }}
          onChange={(e) => {
            saveInputValue(e.target.value);
          }}
        />
      </Grid>
    </Grid>
  );
};
