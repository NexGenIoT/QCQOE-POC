import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  TablePagination,
} from "@mui/material";
import {
  Box,
  Drawer,
  IconButton,
  ListItem,
  MenuItem,
  Paper,
  TextareaAutosize,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import Checkbox from "@mui/material/Checkbox";
import MatButton from "@material-ui/core/Button";
import Button from "@mui/material/Button";
import { DateRange } from "react-date-range";
import React from "react";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import {
  deletConfigMitiListAndRcaBucket,
  getConfigMitiListBucket,
  getEstimatedRootRcaBucket,
  getRca,
  postAddToRCABuckets,
  postApplyMitigationForRCA,
  postUpdateToRCABuckets,
  postEstimatedRootLabeled,
} from "Store/Actions";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { Close } from "@material-ui/icons";
import { NotificationManager } from "react-notifications";
import AnomalieCSVUpload from "./AnomalieCSVUpload";
import DeleteDialogue from "./deleteDialogue";
import moment from "moment";
import exportFromJSON from "export-from-json";
import { adminMessage, isValidPermission } from "Constants/constant";

const ConfigureRCA = () => {
  const dispatch = useDispatch();
  const rcaData = useSelector((state) => state.qoeReducer);
  const [dashboardLoader, setDashboardLoader] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileMenuMDrawer, setMobileMenuMDrawer] = useState(false);
  const [btn, setBtn] = useState("24hr");
  //-------firts drawer-------------
  const [rcaBucketName, setrcaBucketName] = useState("");
  const [rcaMitigationBucketPlan, setrcaMitigationBucketPlan] = useState("");
  //-----------------------------
  //-------second drawer-------------
  const [rcaMitigationBucket, setrcaMitigationBucket] = useState("");
  const [mitigationBucket, setMitigationBucket] = useState("");
  const [mitigationBody, setmitigationBody] = useState("");
  const [records, setRecords] = useState([]);
  const [isUpload, setIsUpload] = useState(false);
  const [array, setArray] = useState([]);
  const [file, setFile] = useState();
  const [configure, setConfigure] = useState(false);
  const [deleteBucketname, setDeleteBucketname] = useState("");
  const [runUseEffect, setrunUseEffect] = useState("1");

  const fileReader = new FileReader();
  const [btnNameConfig, setBtnNameConfig] = useState("ADD NEW RCA");
  // for the POP UP
  const [isPreview, setIsPreview] = useState(false);

  const [isPreviewEstData, setIsPreviewEstData] = useState(false);

  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [page, setPage] = React.useState(0);
  const [rcaEditedData, setRcaEditedData] = useState(rcaData?.rcaDetect?.Items);
  const [ids, setIds] = useState([]);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);

  const [downloadLoader, setDownloadLoader] = useState(false);
  //---------------------------------------------

  // for the custom date Bar
  const [toDateCSV, setToDateCSV] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );
  const [openModal, setModalOpen] = useState(false);
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  //
  const manualStylee = {
    color: "white",
    background: "#E10092",
    width: "83px",
    height: "28px",
    fontSize: "1rem",
    fontWeigth: "100",
  };
  const manualStyleeCancele = {
    color: "#E10092",
    width: "83px",
    height: "28px",
    fontSize: "1rem",
    border: "1px solid #E10092",
    marginRight: "10px",
  };

  const regex = /\s/g;

  //----------------------firstDrwaer----------------
  const addRCAToBuckets = () => {
    console.log("add space abcd--", regex.test(rcaBucketName));

    if (rcaBucketName != "" && rcaMitigationBucketPlan != "") {
      if (rcaBucketName.length > 25 || regex.test(rcaBucketName)) {
        return;
      } else {
        if (btnNameConfig === "UPDATE RCA") {
          console.log("update side");
          dispatch(
            postUpdateToRCABuckets(
              dispatch,
              rcaBucketName,
              rcaMitigationBucketPlan
            )
          );
          setMobileMenu(false);
          dispatch(getConfigMitiListBucket(dispatch));
          setrunUseEffect("update");
        } else {
          console.log("Add side");
          dispatch(
            postAddToRCABuckets(
              dispatch,
              rcaBucketName,
              rcaMitigationBucketPlan
            )
          );
          setMobileMenu(false);
          dispatch(getConfigMitiListBucket(dispatch));
          setrunUseEffect("add");
          setMobileMenu(false);
        }
      }
    } else {
      NotificationManager.success("Please fill all the field", "", 1000);
    }
  };

  const handleMitigationRCAChange = (event) => {
    setrcaMitigationBucketPlan(event.target.value);
  };

  // const applyManualMiti = () => {
  //   if (ids.length > 0) {
  //     let toDate = Math.floor((new Date()).getTime() / 1000.0);
  //     dispatch(postEstimatedRootLabeled(dispatch, "admin", toDate, toDate, fromDate, ids))
  //   }
  //   setIsPreviewEstData(false);
  //   setIds([]);
  // }

  // const rejectDataAll = () => {
  //   setIds([]);
  //   setIsPreviewEstData(false);
  //   { selectAllCheckbox && setSelectAllCheckbox(false) }
  // }
  //------------end------------------------
  const handleBucketNameChange = (event) => {
    setrcaMitigationBucket(event.target.value);
    let abcd = rcaData?.estimatedRootRcaBucket?.Items.filter((res) => {
      if (res.bucket_name == event.target.value) {
        return res;
      }
    });
    setMitigationBucket(abcd[0].plan_name);
  };
  const handleLinkedMitigationChange = (event) => {
    setMitigationBucket(event.target.value);
  };
  const applyMitigation = () => {
    if (
      mitigationBucket != "" &&
      rcaMitigationBucket != "" &&
      mitigationBody != ""
    ) {
      if (records.length != 0) {
        dispatch(
          postApplyMitigationForRCA(
            dispatch,
            rcaMitigationBucket,
            mitigationBucket,
            mitigationBody,
            records
          )
        );
        setMobileMenuMDrawer(false);
      } else {
        NotificationManager.error("Please Link Records", "", 1000);
      }
    } else {
    }
  };

  // for the custom date
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
        24 * 3600
    );
    // setDashboardLoader(true)
    // dispatch(getAnomaliesDetect(dispatch, Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0), anamolyScore, rowsPerPage, ""))
    // setTimeout(() => {
    //   setDashboardLoader(false)
    // }, 5000);
  };

  // end of the custom date

  // for the download
  const getImage = () => {
    setDownloadLoader(true);
    const exportType = exportFromJSON.types.csv;
    const fileName = "Configure_RCA";
    //console.log(rcaData?.estimatedRootRcaBucket?.Items,"rcaData");
    if (rcaData?.estimatedRootRcaBucket?.Items.length > 0) {
      exportFromJSON({
        data: rcaData?.estimatedRootRcaBucket?.Items,
        fileName: fileName,
        exportType: exportType,
      });
      setDownloadLoader(false);
    } else {
      setDownloadLoader(false);
    }
  };

  const uploadCsvFile = () => {
    if (!rcaMitigationBucket || !mitigationBucket || !mitigationBody) {
      NotificationManager.error("Please fill the above field", "", 2000);
    } else {
      setIsUpload(true);
      setArray([]);
      setRecords([]);
      setIds([]);
      setRcaEditedData([]);
    }
  };
  const handleOnChange = (e) => {
    setArray([]); // for empty
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      fileReader.onload = function (event) {
        const csvOutput = event.target.result;
        csvFileToArray(csvOutput);
        console.log("abcd--handleOnChange--", array);
      };
    }
  };
  // const handleOnSubmit = (e) => {
  //   console.log("abcd--anomalie--", array.length);

  //   e.preventDefault();
  //   if (file) {
  //     fileReader.onload = function (event) {
  //       const csvOutput = event.target.result;
  //       csvFileToArray(csvOutput);
  //     };
  //     fileReader.readAsText(file);
  //     if (array.length > 0) {
  //       // array.pop()
  //       // console.log("data csv--", array);
  //       // setRecords(array)
  //       // setTimeout(() => {
  //       //   // NotificationManager.success("Data Submitted successfully", '', 2000);
  //       //   setIsUpload(false)
  //       // }, 1000);
  //       array.filter(res => { //to avoid udefined
  //         if (res == undefined) {
  //           return array.splice(array.indexOf(res));
  //         }
  //       })
  //       if (array.length > 0) {
  //         setRecords(array)
  //         setIsUpload(false)
  //       } else {
  //         NotificationManager.error("Valid data not found in CSV File", '', 2000);
  //       }

  //     } else {

  //       NotificationManager.error("File takes time to convert from csv to json format ! Please wait for sometime", '', 2000);

  //     }
  //   }
  // };

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
          if (res == undefined) {
            return array.splice(array.indexOf(res));
          }

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
        });
        if (array.length > 0) {
          // setIds(array)
          const mainArray = [
            "upper_threshold",
            "total_records",
            "analysis_window_hrs",
            "total_anomaly_records",
            "problem_score",
            "dimension",
            "rca_unique_id",
            "batch_time",
            "is_approved",
            "rca_bucket",
          ];
          const ArrayObjkeys = Object.keys(array[0]);
          const missingArray = mainArray.filter(
            (f) => !ArrayObjkeys.includes(f)
          );
          if (missingArray.length > 0) {
            if (missingArray.includes("batch_time")) {
              missingArray[missingArray.indexOf("batch_time")] = "Date_Time";
            }
            const missingElements = missingArray.join(",\r\n");
            NotificationManager.error(
              `The following required colomns are missing in excel : ${missingElements}`,
              "",
              2000
            );
          } else {
            array.pop();
            // array.filter(res => { //to avoid udefined
            //   if (res.rca_bucket ==" \r" || res.rca_bucket == "" || res.rca_bucket == undefined) {
            //   // if (res == undefined) {
            //     return array.splice(array.indexOf(res));
            //   }
            // })

            setMobileMenuMDrawer(false);
            setIds(array);
            setRcaEditedData(array);
            setRecords(array);
            setIsPreviewEstData(true);
            setIsUpload(false);
          }
        } else {
          NotificationManager.error(
            "Valid data not found in CSV File",
            "",
            2000
          );
        }
      } else {
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
    const csvRows = string.slice(string.indexOf("\n") + 1).split("\n");
    let rowArray = [];
    const array = csvRows.map((i) => {
      const values = i.split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/);
      const obj = csvHeader.reduce((object, header, index) => {
        if (csvRows[index]) {
          rowArray.push(csvRows[index].split(","));
        }
        object[header.trim()] = values[index];
        return object;
      }, {});
      if (obj.is_approved !== undefined) {
        obj.is_approved = obj.is_approved == 0 ? parseInt(0) : parseInt(1);
      }

      if (obj?.Date_Time) {
        let changedDate = moment(obj.Date_Time, "DD-MM-YYYY hh:mm").format(
          "MM/DD/YYYY HH:MM"
        );
        let mili = Math.floor(moment(changedDate).endOf("date")._d.getTime());
        obj.batch_time = mili;
        delete obj.Date_Time;
      }
      delete obj.type;
      return obj;
    });
    setArray(array);
  };

  useEffect(() => {
    setDashboardLoader(true);
    dispatch(getEstimatedRootRcaBucket(dispatch));
    dispatch(getConfigMitiListBucket(dispatch));

    setTimeout(() => {
      setDashboardLoader(false);
    }, 4000);
  }, [runUseEffect]);

  // for the UpdateConfigData
  const UpdateConfigData = (option) => {
    if (isValidPermission("WRITE_CONFIGURE_RCA")) {
      setBtnNameConfig("UPDATE RCA");

      setMobileMenu(true);
      console.log(option, "option");
      setrcaBucketName(option.bucket_name);
      setrcaMitigationBucketPlan(option.plan_name);
    } else {
      NotificationManager.error(adminMessage.message);
    }
  };

  const checkPermissionDelete = (option) => {
    if (isValidPermission("WRITE_CONFIGURE_RCA")) {
      setConfigure(true);
      setDeleteBucketname(option.bucket_name);
    } else {
      NotificationManager.error(adminMessage.message);
    }
  };

  useEffect(() => {
    if (isPreview) {
      setDashboardLoader(true);
      let toDate = Math.floor(new Date().getTime() / 1000.0);
      dispatch(
        getRca(
          dispatch,
          toDate,
          fromDate,
          page,
          rcaData?.rcaDetect?.next_iteration_id
            ? rcaData?.rcaDetect?.next_iteration_id
            : ""
        )
      );
      setTimeout(
        () => {
          setDashboardLoader(false);
        },
        btn == "weekly" ? 10000 : btn == "monthly" ? 10000 : 10000
      );
    }
  }, [fromDate, isPreview]);

  useEffect(() => {
    if (rcaData?.rcaDetect?.Items) {
      setRcaEditedData(rcaData?.rcaDetect?.Items);
    } else {
      setRcaEditedData([]);
    }
  }, [rcaData?.rcaDetect]);

  const handleRemarkChange = (event, list, objectclick) => {
    //let indexList = rcaEditedData.indexOf(objectclick)
    let clickListIndex = rcaEditedData.indexOf(objectclick);
    rcaEditedData[clickListIndex].rca_bucket = event.target.value;
    setRcaEditedData([...rcaEditedData]);
    // setrcaBucket(event.target.value);
  };
  const onChangeCheckbox = (data) => {
    // data.rca_bucket = "Testing";
    console.log("abcd--", data);
    if (data.rca_bucket != "") {
      data.is_approved = 1;
      // setSelectAllCheckbox(false);
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
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const linkRecord = () => {
    console.log(
      "abcd--",
      rcaMitigationBucket,
      mitigationBucket,
      mitigationBody
    );
    setRecords(ids);
    setIsPreview(false);
    setMobileMenuMDrawer(true);
  };

  const checkpermissionAdd = () => {
    if (isValidPermission("WRITE_CONFIGURE_RCA")) {
      setMobileMenu(true);
      setBtnNameConfig("ADD RCA");
    } else {
      NotificationManager.error(adminMessage.message);
    }
  };

  const checkpermissionMiti = () => {
    if (isValidPermission("WRITE_CONFIGURE_RCA")) {
      setMobileMenuMDrawer(true);
      setRecords([]);
    } else {
      NotificationManager.error(adminMessage.message);
    }
  };

  return (
    <>
      <div>
        <div>
          <Typography variant="h5">
            Configure RCA (
            {rcaData?.estimatedRootRcaBucket?.Items &&
              rcaData?.estimatedRootRcaBucket?.Items.length}
            )
          </Typography>
          <MatButton className="addnew-config" onClick={checkpermissionMiti}>
            APPLY MITIGATION
          </MatButton>

          <MatButton className="addnew-config" onClick={checkpermissionAdd}>
            ADD NEW <i className="zmdi zmdi-plus"></i>
          </MatButton>
          <MatButton
            className="Status-btn"
            style={{ fontSize: "19px", color: "#E10092", float: "right" }}
            onClick={getImage}
          >
            <i className="zmdi zmdi-download"></i>
          </MatButton>
        </div>
      </div>
      <div className="col-md-12"> </div>
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
      <div className="wraper-config">
        {rcaData?.estimatedRootRcaBucket?.Items &&
        rcaData?.estimatedRootRcaBucket?.Items.length > 0 ? (
          <TableContainer>
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
                  <TableCell>RCA Bucket Name</TableCell>
                  <TableCell>Plan Name</TableCell>
                  {/* <TableCell>Trigger API Endpoints</TableCell>*/}
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableHead>
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
                  {rcaData?.estimatedRootRcaBucket?.Items &&
                    rcaData?.estimatedRootRcaBucket?.Items.map(
                      (option, key) => (
                        <TableRow
                          style={{
                            borderBottom: "1px solid white",
                            color: "rgb(151 151 151 / 87%)",
                          }}
                          sx={{ border: 0 }}
                        >
                          <TableCell>{option.bucket_name}</TableCell>
                          <TableCell>{option.plan_name}</TableCell>
                          {/* <TableCell>{`//Email Alert To qoe`}</TableCell>*/}
                          <TableCell>
                            <i
                              className="zmdi zmdi-edit updateClass"
                              onClick={() => {
                                UpdateConfigData(option);
                              }}
                            ></i>{" "}
                          </TableCell>
                          <TableCell>
                            <i
                              className="zmdi zmdi-delete"
                              onClick={() => {
                                checkPermissionDelete(option);
                              }}
                            ></i>{" "}
                          </TableCell>
                        </TableRow>
                      )
                    )}
                </>
              )}
            </Table>
          </TableContainer>
        ) : (
          <h2 style={{ textAlign: "center", marginLeft: "112px" }}>
            {" "}
            No Records Found
          </h2>
        )}

        <Drawer
          open={mobileMenu}
          onClose={() => {
            setMobileMenu(false);
          }}
          anchor={"right"}
        >
          <div
            className="rightSidebar"
            style={{ height: "90%", overflowY: "auto" }}
          >
            <div className="SideBarHeader" style={{ marginBottom: "-30px" }}>
              <h3>Add New RCA</h3>
              <IconButton onClick={() => setMobileMenu(false)}>
                {" "}
                <Close />
              </IconButton>
            </div>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                {" "}
                RCA Bucket Name
              </h3>
              {btnNameConfig == "UPDATE RCA" ? (
                <h3> {rcaBucketName}</h3>
              ) : (
                <>
                  <TextField
                    value={rcaBucketName}
                    id="outlined-basic"
                    label=""
                    variant="outlined"
                    size="small"
                    type={"text"}
                    style={{
                      background: "#f7f7f7",
                      border: "1",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                    onChange={(e) => {
                      setrcaBucketName(e.target.value);
                    }}
                  />
                  {rcaBucketName && rcaBucketName.length > 25 && (
                    <p
                      style={{ color: "red", "font-size": "13px", margin: "0" }}
                    >
                      Name length should not be greater than 25{" "}
                    </p>
                  )}
                  {rcaBucketName && regex.test(rcaBucketName) && (
                    <p
                      style={{ color: "red", "font-size": "13px", margin: "0" }}
                    >
                      Name should not have space
                    </p>
                  )}
                </>
              )}
            </ListItem>

            <ListItem
              style={{ display: "block", marginTop: "15px" }}
              className="eds-dropdown"
            >
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                {" "}
                Mitigation Plan
              </h3>

              <TextField
                id="outlined-select-currency"
                variant="outlined"
                fullWidth
                select
                // label="All"
                placeholder="mitigation plan"
                value={rcaMitigationBucketPlan}
                onChange={handleMitigationRCAChange}
              >
                {rcaData?.configMitiBucketPlan &&
                  rcaData?.configMitiBucketPlan.map((option) => (
                    <MenuItem key={option.plan_name} value={option.plan_name}>
                      {option.plan_name}
                    </MenuItem>
                  ))}
              </TextField>
            </ListItem>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <MatButton className="addnew-config" onClick={addRCAToBuckets}>
                {btnNameConfig}{" "}
              </MatButton>
            </ListItem>
          </div>
        </Drawer>

        <Drawer
          open={mobileMenuMDrawer}
          onClose={() => {
            setMobileMenuMDrawer(false);
          }}
          anchor={"right"}
        >
          <div
            className="rightSidebar"
            style={{ height: "90%", overflowY: "auto" }}
          >
            <div className="SideBarHeader" style={{ marginBottom: "-30px" }}>
              <h3>APPLY MITIGATION RCA</h3>
              <IconButton onClick={() => setMobileMenuMDrawer(false)}>
                {" "}
                <Close />
              </IconButton>
            </div>

            <ListItem
              style={{ display: "block", marginTop: "15px" }}
              className="eds-dropdown"
            >
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                {" "}
                RCA Bucket Name
              </h3>

              <TextField
                id="outlined-select-currency"
                variant="outlined"
                fullWidth
                select
                // label="All"
                placeholder="mitigation plan"
                value={rcaMitigationBucket}
                onChange={handleBucketNameChange}
              >
                {rcaData?.estimatedRootRcaBucket?.Items &&
                  rcaData?.estimatedRootRcaBucket?.Items.map((option) => (
                    <MenuItem
                      key={option.bucket_name}
                      value={option.bucket_name}
                    >
                      {option.bucket_name}
                    </MenuItem>
                  ))}
              </TextField>
            </ListItem>

            <ListItem
              style={{ display: "block", marginTop: "15px" }}
              className="eds-dropdown"
            >
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                {" "}
                Linked Mitigation
              </h3>

              <TextField
                id="outlined-select-currency"
                variant="outlined"
                fullWidth
                select
                // label="All"
                placeholder="linked mitigation"
                value={mitigationBucket}
                onChange={handleLinkedMitigationChange}
              >
                {rcaData?.configMitiBucketPlan &&
                  rcaData?.configMitiBucketPlan.map((option) => (
                    <MenuItem key={option.plan_name} value={option.plan_name}>
                      {option.plan_name}
                    </MenuItem>
                  ))}
              </TextField>
            </ListItem>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}> Body</h3>
              <TextareaAutosize
                value={mitigationBody}
                id="outlined-basic"
                label=""
                variant="outlined"
                size="small"
                type={"text"}
                style={{
                  background: "#f7f7f7",
                  border: "1",
                  borderRadius: "4px",
                  width: "100%",
                  height: "50px",
                }}
                onChange={(e) => {
                  setmitigationBody(e.target.value);
                }}
              />
            </ListItem>

            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <Tooltip
                className="addnew-Link-config"
                title="link records before apply mitigation"
                arrow
              >
                <MatButton className="addLink-button" onClick={uploadCsvFile}>
                  Link Records{" "}
                  {records.length > 0 ? (
                    <span className="spanlinkrecords">{records.length}</span>
                  ) : null}
                </MatButton>
              </Tooltip>
            </ListItem>

            <ListItem style={{ display: "flow-root", marginTop: "15px" }}>
              <MatButton
                className="addnew-Link-config"
                onClick={applyMitigation}
              >
                APPLY MITIGATION{" "}
              </MatButton>
            </ListItem>
          </div>

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
                {/* <div style={{border:"1px solid #e20092"}}> */}
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
                {/* </div> */}

                <MatButton
                  className="Status-btn"
                  style={{
                    fontSize: "10px",
                    color: "#ffffff",
                    backgroundColor: "#e20092",
                    marginLeft: "10px",
                  }}
                  onClick={(e) => {
                    setIsPreview(true);
                    setIsUpload(false);
                    setMobileMenuMDrawer(false);
                    setBtn("24hr");
                    setFromDate(
                      Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
                    );
                  }}
                >
                  {"Link Records"}
                </MatButton>
              </form>
            </div>
          </AnomalieCSVUpload>
        </Drawer>
      </div>

      <DeleteDialogue
        assetid=""
        title="Delete"
        isOpen={configure}
        onClose={() => {
          setConfigure(false);
        }}
      >
        <Paper style={{ padding: "0 2em 2em 2em" }}>
          <div>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              Are you sure you want to delete RCA Bucket ?
              <p style={{ color: "red" }}>{deleteBucketname}</p>
            </Typography>
            <div style={{ float: "right", marginTop: "10px" }}>
              <MatButton
                onClick={() => {
                  setConfigure(false);
                }}
                style={manualStyleeCancele}
              >
                {"No"}
              </MatButton>
              <MatButton
                style={manualStylee}
                onClick={() => {
                  setConfigure(false);
                  dispatch(
                    deletConfigMitiListAndRcaBucket(
                      dispatch,
                      deleteBucketname,
                      "rca_buckets",
                      "rcaConfig"
                    )
                  );
                  setTimeout(() => {
                    setrunUseEffect("delete");
                  }, 2000);
                }}
              >
                {"Yes"}
              </MatButton>
            </div>
          </div>
        </Paper>
      </DeleteDialogue>

      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Drawer
          anchor="bottom"
          open={isPreview}
          onClose={() => {
            setIsPreview(false);
            setIds([]);
            setBtn("24hr");
          }}
          className="drawer-mitigation"
        >
          <div className="drawer-header">
            <span>
              {" "}
              <i
                onClick={() => {
                  setIsPreview(false);
                  setIds([]);
                  setBtn("24hr");
                }}
                className="zmdi zmdi-arrow-left"
              ></i>{" "}
              {/* {console.log("ids data",ids)} */}
              {/* ({ids?.length}) */}
            </span>

            <span className="status-report">
              <MatButton
                onClick={() => {
                  setFromDate(
                    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
                  );
                  setBtn("24hr");
                  // setDashboardLoader(true)
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
                  // setDashboardLoader(true)
                }}
                className={
                  btn === "weekly" ? "Status-btn-active" : "Status-btn"
                }
              >
                48hrs
              </MatButton>
              <MatButton
                onClick={() => {
                  setFromDate(
                    Math.floor(new Date().getTime() / 1000.0) - 30 * 24 * 3600
                  );
                  setBtn("monthly");
                  // setDashboardLoader(true)
                }}
                className={
                  btn === "monthly" ? "Status-btn-active" : "Status-btn"
                }
              >
                72hrs
              </MatButton>
            </span>
            <div className="dateCountcustom">
              <div className="row eds-dateCont">
                <span>Custom Date</span>
                <TextField
                  onClick={() => setModalOpen(true)}
                  contentEditable={false}
                  value={
                    startDate ? moment(startDate).format("DD/MM/YYYY") : ""
                  }
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

            <i
              onClick={() => {
                setIsPreview(false);
                setIds([]);
                setBtn("24hr");
                setStartDate();
                setEndDate();
              }}
              className="zmdi zmdi-close"
            ></i>
          </div>
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
                      <TableCell>Problematic Dimension</TableCell>
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
                      .map((list2, index) => {
                        let fullDate = Math.floor(
                          new Date(list2?.batch_time).getTime() * 1000.0
                        );

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
                                <p className="anomalyptag">{list2.dimension}</p>
                              </TableCell>
                              <TableCell>
                                {moment(fullDate / 1000).format("DD-MM-YYYY") +
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
                              <TableCell>{list2.total_records} </TableCell>
                              <TableCell>{list2.upper_threshold}</TableCell>
                              <TableCell>
                                {list2.rca_bucket ? list2.rca_bucket : "-"}

                                {/* <TextField
                              id="outlined-select-currency"
                              variant="standard"
                              fullWidth
                              select
                              placeholder='rca bucket'
                              className='rcabucketdd'
                              value={list2.rca_bucket}
                              onChange={(event) => {
                                handleRemarkChange(event, list2, list2)
                              }}
                            >
                              <MenuItem key={"None"} value={"None"}>{"None"}</MenuItem>

                              {rcaData?.estimatedRootRcaBucket?.Items.map((option) => (
                                <MenuItem key={option.bucket_name} value={option.bucket_name}>
                                  {option.bucket_name}
                                </MenuItem>
                              ))}
                            </TextField> */}
                              </TableCell>
                              <TableCell>
                                <Checkbox
                                  onChange={() => onChangeCheckbox(list2)}
                                  edge="start"
                                  checked={ids.indexOf(list2) !== -1}
                                />
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                  {/* </>
              } */}
                </Table>
              </TableContainer>
              {rcaEditedData && rcaEditedData.length > 0 ? (
                <TablePagination
                  rowsPerPageOptions={[10, 20, 50, 100]}
                  component="div"
                  count={4}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  className="paginationstyle"
                />
              ) : null}
              <div className="apply-container">
                <MatButton className="apply-filter-btn"> </MatButton>
                <div className="right-aligne-button">
                  <MatButton
                    className="apply-filter-btn"
                    onClick={() => {
                      setIsPreview(false);
                      setIds([]);
                      setRcaEditedData([]);
                      setBtn("24hr");
                      setStartDate();
                      setEndDate();
                    }}
                  >
                    Cancel
                  </MatButton>

                  <MatButton
                    className="apply-btn"
                    onClick={() => {
                      linkRecord();
                      setStartDate();
                      setEndDate();
                    }}
                    style={{
                      fontSize: "0.875rem",
                      color: "#008eff",
                      width: "100px",
                      height: "28px",
                      fontWeight: "600",
                    }}
                  >
                    Link
                  </MatButton>
                </div>
              </div>
            </div>
          ) : (
            <p>Data not found</p>
          )}
        </Drawer>
      </Paper>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <Drawer
          anchor="bottom"
          open={isPreviewEstData}
          onClose={() => setIsPreviewEstData(false)}
          className="drawer-mitigation"
        >
          <div className="drawer-header">
            <span>
              {" "}
              <i
                onClick={() => setIsPreviewEstData(false)}
                className="zmdi zmdi-arrow-left"
              ></i>{" "}
              Preview Data ({ids?.length})
            </span>
            <i
              onClick={() => {
                setIsPreviewEstData(false);
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
                    <TableCell>Problematic Dimension</TableCell>
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
              onClick={() => {
                setRecords(ids);
                setIsPreviewEstData(false);
                setMobileMenuMDrawer(true);
              }}
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
                setRecords([]);
                setIsPreviewEstData(false);
                setMobileMenuMDrawer(true);
              }}
            >
              {"No"}
            </MatButton>
          </div>
        </Drawer>
      </Paper>
    </>
  );
};

export default ConfigureRCA;
