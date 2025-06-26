import {
  Box,
  Drawer,
  FormControl,
  Grid,
  IconButton,
  ListItem,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MitigationTable from "./Table";
import MatButton from "@material-ui/core/Button";
import exportFromJSON from "export-from-json";
import moment from "moment";
//import { getAutoMitigationStatus } from "Store/Actions";
import { Close } from "@material-ui/icons";
import { List } from "react-content-loader";
import {
  Button,
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";

import { LocalizationProvider } from "@mui/lab";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import Stack from "@mui/material/Stack";
import DatePicker from "@mui/lab/DatePicker";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import { createFileName } from "use-react-screenshot";
import { setAllMitigationData } from "Store/Actions";

const MitigationDashboard = () => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.qoeReducer);
  const [mitigationList, setMitigationList] = useState([]);
  const [fromDate, setFromDate] = useState(
    Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
  );
  const [showSearchTextField, setShowSearchTextField] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [btn, setBtn] = useState("24hr");
  const [filterbtn, setFilterBtn] = useState("24hr");

  const [searchText, setSearchText] = useState("");
  const [mobileMenu, setFilterMenu] = useState(false);
  const [last_time, setlast_time] = useState("");
  const [selectedField, setSelectedField] = useState("24hr");

  const [impectSessionDd, setImpectSessionDd] = useState("");
  const [impectSession, setImpectSession] = useState();
  const [previousUEIDd, setPreviousUEIDd] = useState("");
  const [previousUEI, setPreviousUEI] = useState();
  const [currentUEIDd, setCurrentUEIDd] = useState("");
  const [currentUEI, setCurrentUEI] = useState();
  const [dateValue, setDateValue] = useState(null);
  const [apply, setApply] = useState(false);
  const [openModal, setModalOpen] = useState(false);
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [toDates, setToDates] = useState(
    Math.floor(new Date().getTime() / 1000.0)
  );
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);
  const [sourceDd, setSourceDd] = useState("");
  const [isRefresh, setRefresh] = useState(false);

  //let toDate = Math.floor(new Date().getTime() / 1000.0);

  // useEffect(() => {
  //   dispatch(getAutoMitigationStatus(dispatch));
  // }, [dispatch]);
  
  useEffect(() => {
    var filtered = filterByApply();
    setMitigationList(filtered);
    
  }, [apply, data?.mitigationList,isRefresh]);

  // useEffect(() => {
  //        setMitigationList(data?.mitigationList)
  // }, [data?.mitigationList])

  const searchMetricName = (e) => {
    setAutoFocus(true);
    setSearchText(e.target.value);
    const backupYesterdayData = data?.mitigationList;
    if (e.target.value !== "") {
      const finalList = backupYesterdayData.filter(
        (a) =>
          a.GroupMitigationID.toLowerCase().includes(
            e.target.value.toLowerCase()
          ) || a.Source.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setMitigationList(finalList);
    } else {
      setMitigationList(data?.mitigationList);
    }
  };
  const closeTextField = (e) => {
    setAutoFocus(false);
    setSearchText("");
    setShowSearchTextField(false);
    setMitigationList(data?.mitigationList);
  };
  const getImage = () => {
    let data = [];
    mitigationList.map((list) => {
      let fullDate = Math.floor(new Date(list?.Time_Stamp).getTime() * 1000.0);
      return data.push({
        "Action ID": list?.GroupMitigationID,
        "Date/Time":
          moment(fullDate).format("DD-MM-YYYY") +
          " | " +
          moment(fullDate).format("hh:mm"),
        ImpactedSessions: list?.ImpactedSessions,
        AppliedOn: list?.AppliedOn,
        PreviousUEI: list?.PreviousUEI,
        CurrentUEI: list?.CurrentUEI,
        Source: list?.Source,
      });
    });
    const fileName = "mitigation"; /*createFileName(
      "csv",
      `${metric}-${moment().format("DD/MM/YYYY")}`
    );*/
    const exportType = exportFromJSON.types.csv;
    exportFromJSON({ data, fileName, exportType });
  };

  const lastTimeHandler = (e) => {
    setlast_time(e.target.value);
  };

  const filterByApply = () => {
    // Avoid filter for null value
    setFilterBtn("");

    if (!apply) {
      setMitigationList(data?.mitigationList);
      return data?.mitigationList;
    }
    const filteredData = data?.mitigationList.filter((mlist) => {
      return (
        (impectSessionDd !== ""
          ? eval(
              `${parseFloat(
                mlist.ImpactedSessions
              )} ${impectSessionDd} ${parseFloat(impectSession)}`
            )
          : true) &&
        (previousUEIDd !== ""
          ? eval(
              `${parseFloat(mlist.PreviousUEI)} ${previousUEIDd} ${parseFloat(
                previousUEI
              )}`
            )
          : true) &&
        (currentUEIDd !== ""
          ? eval(
              `${parseFloat(mlist.CurrentUEI)} ${currentUEIDd} ${parseFloat(
                currentUEI
              )}`
            )
          : true) &&
        // (dateValue !== null? moment.unix(mlist.Time_Stamp).format("YYYYMMDD") == moment(dateValue).format("YYYYMMDD"): true) &&
        (sourceDd !== "" ? mlist.Source == sourceDd : true)
      );
    });
    return filteredData;
  };

  const clickOnApply = () => {
    if (
      (impectSession && impectSessionDd) ||
      (previousUEI && previousUEIDd) ||
      (currentUEI && currentUEIDd) ||
      sourceDd
    ) {
      setFilterMenu(false);
      setApply(true);
      var filtered = filterByApply();
      setMitigationList(filtered);
    } else if (dateValue) {
      setApply(true);
      setFilterMenu(false);
    } else {
      setApply(false);
    }
  };

  const clearAll = () => {
    setApply(false);
    setlast_time("");
    setImpectSessionDd("");
    setImpectSession("");
    setPreviousUEIDd("");
    setPreviousUEI("");
    setCurrentUEIDd("");
    setCurrentUEI("");
    setDateValue(null);
    setSourceDd("");
  };

  const submit = () => {
    setBtn("");
    setStartDate(range[0].startDate);
    setEndDate(range[0].endDate);
    setModalOpen(false);
    // setToDates(Math.floor(range[0].endDate.getTime() / 1000.0));
    setToDates(Math.floor(range[0].endDate.getTime() / 1000.0));
    setFromDate(Math.floor(range[0].startDate.getTime() / 1000.0));

    clearAll();
    setMitigationList(data?.mitigationList);
  };

  const durationValue = (value) => {
    switch (value.toString()) {
      case "24hr":
        return 24 * 3600;
        break;
      case "3":
        return 90 * 24 * 3600;
        break;
      case "monthly":
        return 30 * 24 * 3600;
        break;
      case "weekly":
        return 7 * 24 * 3600;
        break;
      default:
        return 24 * 3600;
    }
  };

  const stylee = {
    color: "white",
    background: "#1992fb",
    width: "100px",
    height: "28px",
    fontSize: "1rem",
    fontWeigth: "600",
  };
  return (
    <>
      <div
        className='issue-wraper'
        style={{
          background: "white",
          height: "62px",
          paddingTop: "20px",
          marginBottom: "0px",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className='top-left-nav'>
          <Typography
            variant='h5'
            style={{ fontSize: "1.2rem", paddingLeft: "13px" }}
          >
            Total Mitigation({mitigationList?.length})
          </Typography>
        </div>
        {showSearchTextField && (
          <div style={{ width: "30%", position: "relative" }}>
            <TextField
              autoFocus={autoFocus}
              onChange={searchMetricName}
              value={searchText}
              type='text'
              id='outlined-basic'
              className='search-insight'
              placeholder='Search...'
              variant='outlined'
              fullWidth
            />
            <i
              onClick={closeTextField}
              style={{
                position: "absolute",
                top: "40%",
                right: -20,
                cursor: "pointer",
              }}
              className='zmdi zmdi-close'
            ></i>
          </div>
        )}
        <div className='status-report dropdownCont'>
          <MatButton
            onClick={() => {
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
              );
              setBtn("24hr");
              setSelectedField("24hr");
              //clearAll();
              setMitigationList(data?.mitigationList);
              setFilterBtn("");
              setStartDate();
              setEndDate();
              setRange([
                {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                },
              ]);
            }}
            className={btn === "24hr" ? "Status-btn-active" : "Status-btn"}
          >
            24Hr
          </MatButton>
          <MatButton
            onClick={() => {
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 7 * 24 * 3600
              );
              setBtn("weekly");
              setSelectedField("weekly");
              setFilterBtn("");
              dispatch(setAllMitigationData([]))

              //clearAll();
              setMitigationList(data?.mitigationList);
              setStartDate();
              setEndDate();
              setRange([
                {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                },
              ]);
            }}
            className={btn === "weekly" ? "Status-btn-active" : "Status-btn"}
          >
            Weekly
          </MatButton>
          <MatButton
            onClick={() => {
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 30 * 24 * 3600
              );
              setBtn("monthly");
              setSelectedField("monthly");
              setFilterBtn("");

             // clearAll();
             dispatch(setAllMitigationData([]))
              setMitigationList(data?.mitigationList);
              setStartDate();
              setEndDate();
              setRange([
                {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                },
              ]);
            }}
            className={btn === "monthly" ? "Status-btn-active" : "Status-btn"}
          >
            Monthly
          </MatButton>
          <MatButton
            onClick={() => {
              setBtn("3");
              setSelectedField("3");
              setFilterBtn("");

              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) - 90 * 24 * 3600
              );
             // clearAll();
             dispatch(setAllMitigationData([]))
              setMitigationList(data?.mitigationList);
              setStartDate();
              setEndDate();
            }}
            className={btn === "3" ? "Status-btn-active" : "Status-btn"}
          >
            3 Months
          </MatButton>
          {/* <MatButton className="Status-btn">Date Range</MatButton> */}
          {/* <MatButton
                        className="Status-btn"
                        style={{ fontSize: "19px", color: "#008eff" }}
                        onClick={() => setShowSearchTextField(true)}
                    >
                        {" "}
                        <i className="zmdi zmdi-search"></i>
                    </MatButton> */}
          <div className='dateCont'>
            <span>Custom Date</span>
            <TextField
              onClick={() => setModalOpen(true)}
              contentEditable={false}
              value={startDate ? moment(startDate).format("DD/MM/YYYY") : ""}
              placeholder='dd-mm-yyyy'
            />
            <Box sx={{ mx: 2 }}> to </Box>
            <TextField
              onClick={() => setModalOpen(true)}
              contentEditable={false}
              value={endDate ? moment(endDate).format("DD/MM/YYYY") : ""}
              placeholder='dd-mm-yyyy'
            />
          </div>
          <MatButton
            className='Status-btn'
            style={{fontSize: "19px", color: "#E10092",marginLeft:'10px' }}
            onClick={getImage}
          >
            {" "}
            <i  className='zmdi zmdi-download'></i>
          </MatButton>
          <MatButton
            className='Status-btn'
            style={{ fontSize: "19px", color: "#E10092" }}
            onClick={() => {
              setBtn(selectedField);
              setFilterBtn("");
              setRefresh(true);
              setToDates(Math.floor(new Date().getTime() / 1000.0));
              setFromDate(
                Math.floor(new Date().getTime() / 1000.0) -
                  durationValue(selectedField)
              );
             // clearAll();
              setMitigationList(data?.mitigationList);
              setStartDate();
              setEndDate();
            }}
          >
            {" "}
            <i className='zmdi zmdi-refresh'></i>
          </MatButton>
          <MatButton
            onClick={() => {
              setFilterBtn("4");
              setFilterMenu(true);
            }}
            className={filterbtn === "4" ? "Status-btn-active" : "Status-btn"}
          >
            Filter
          </MatButton>
          {/* <IssueFilter /> */}
        </div>
      </div>
      <MitigationTable
        mitigationList={mitigationList}
        toDate={toDates}
        fromDate={fromDate}
      />

      <Drawer
        open={mobileMenu}
        onClose={() => {
          setFilterBtn("");
          setFilterMenu(false);
        }}
        anchor={"right"}
      >
        <div style={{ width: "480px" }}>
          <div className='SideBarHeader' style={{ marginBottom: "-10px" }}>
            <h3>Filter</h3>
            <IconButton
              onClick={() => {
                setFilterBtn("");
                setFilterMenu(false);
              }}
            >
              {" "}
              <Close />
            </IconButton>
          </div>
          <div
            style={{ padding: "10px" }}
            sx={{
              "& .MuiTextField-root": { m: 1, height: "25px" },
            }}
          >
            <ListItem style={{ display: "block", marginTop: "10px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                Impact Session
              </h3>

              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={impectSessionDd}
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      variant='outlined'
                      style={{ height: "40px" }}
                      onChange={(e) => setImpectSessionDd(e.target.value)}
                    >
                      <MenuItem key='>=' value='>='>
                        &gt;=
                      </MenuItem>
                      <MenuItem key='<=' value='<='>
                        &#60;=
                      </MenuItem>
                      <MenuItem key='>' value='>'>
                        &gt;
                      </MenuItem>
                      <MenuItem key='<' value='<'>
                        {" "}
                        &#60;
                      </MenuItem>
                      <MenuItem key='==' value='=='>
                        =
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField
                    value={impectSession}
                    id='outlined-basic'
                    label=''
                    variant='outlined'
                    size='small'
                    type={"number"}
                    style={{
                      background: "#f7f7f7",
                      border: "1",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                    onChange={(e) => setImpectSession(e.target.value)}
                  />
                </Grid>
              </Grid>
            </ListItem>

            <ListItem style={{ display: "block", marginTop: "10px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                Previous UEI
              </h3>

              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={previousUEIDd}
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      variant='outlined'
                      style={{ height: "40px" }}
                      onChange={(e) => setPreviousUEIDd(e.target.value)}
                    >
                      <MenuItem key='>=' value='>='>
                        &gt;=
                      </MenuItem>
                      <MenuItem key='<=' value='<='>
                        &#60;=
                      </MenuItem>
                      <MenuItem key='>' value='>'>
                        &gt;
                      </MenuItem>
                      <MenuItem key='<' value='<'>
                        {" "}
                        &#60;
                      </MenuItem>
                      <MenuItem key='==' value='=='>
                        =
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField
                    value={previousUEI}
                    id='outlined-basic'
                    label=''
                    variant='outlined'
                    size='small'
                    type={"number"}
                    style={{
                      background: "#f7f7f7",
                      border: "1",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                    onChange={(e) => setPreviousUEI(e.target.value)}
                  />
                </Grid>
              </Grid>
            </ListItem>

            <ListItem style={{ display: "block", marginTop: "10px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                Current UEI
              </h3>

              <Grid container spacing={2}>
                <Grid item xs={6} md={6}>
                  <FormControl fullWidth>
                    <Select
                      value={currentUEIDd}
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      variant='outlined'
                      style={{ height: "40px" }}
                      onChange={(e) => setCurrentUEIDd(e.target.value)}
                    >
                      <MenuItem key='>=' value='>='>
                        &gt;=
                      </MenuItem>
                      <MenuItem key='<=' value='<='>
                        &#60;=
                      </MenuItem>
                      <MenuItem key='>' value='>'>
                        &gt;
                      </MenuItem>
                      <MenuItem key='<' value='<'>
                        {" "}
                        &#60;
                      </MenuItem>
                      <MenuItem key='==' value='=='>
                        =
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6} md={6}>
                  <TextField
                    value={currentUEI}
                    id='outlined-basic'
                    label=''
                    variant='outlined'
                    size='small'
                    type={"number"}
                    style={{
                      background: "#f7f7f7",
                      border: "1",
                      borderRadius: "4px",
                      width: "100%",
                    }}
                    onChange={(e) => setCurrentUEI(e.target.value)}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <ListItem style={{ display: "block", marginTop: "10px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>Source</h3>

              <Grid container spacing={2}>
                <Grid item xs={12} md={12}>
                  <FormControl fullWidth>
                    <Select
                      value={sourceDd}
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      variant='outlined'
                      style={{ height: "40px" }}
                      onChange={(e) => setSourceDd(e.target.value)}
                    >
                      <MenuItem key='Manual' value='Manual'>
                        Manual
                      </MenuItem>
                      <MenuItem
                        key='Local Intelligence'
                        value='Local Intelligence'
                      >
                        Local Intelligence
                      </MenuItem>
                      <MenuItem key='AI' value='AI'>
                        AI
                      </MenuItem>
                      <MenuItem key='AIMitigation' value='AIMitigation'>
                      AIMitigation
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </ListItem>
            {/* <ListItem style={{ display: "block", marginTop: "10px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>Date</h3>
              <LocalizationProvider dateAdapter={AdapterDateFns} fullWidth>
                <DatePicker
                  label=''
                  inputFormat='dd/MM/yyyy'
                  value={dateValue}
                  onChange={(newValue) => {
                    setDateValue(newValue);
                  }}
                  style={{
                    background: "#f7f7f7",
                    border: "1",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                  fullWidth
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </ListItem> */}

            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "center",
                marginTop: "45px",
                marginRight: "14px",
              }}
            >
              <MatButton
                className='Status-btn'
                onClick={clearAll}
                style={{
                  fontSize: "0.875rem",
                  color: "#008eff",
                  width: "100px",
                  height: "28px",
                  fontWeight: "600",
                }}
              >
                {"CLEAR ALL"}
              </MatButton>
              <MatButton onClick={clickOnApply} style={stylee}>
                {"Apply"}
              </MatButton>
            </div>
            {/* </List> */}
          </div>
        </div>
      </Drawer>
      <Modal isOpen={openModal} toggle={() => setModalOpen(false)} centered>
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
    </>
  );
};

export default MitigationDashboard;
