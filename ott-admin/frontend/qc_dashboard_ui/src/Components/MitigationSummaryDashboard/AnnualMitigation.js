import React, { useState } from "react";
import Drawer from "@material-ui/core/Drawer";
import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
} from "@mui/material";
import {
  Box,
  Button,
  FormControl,
  Grid,
  IconButton,
  List,
  ListItem,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@material-ui/core";
import { Close, ContactlessOutlined } from "@material-ui/icons";
import MatButton from "@material-ui/core/Button";
import { WithContext as ReactTags } from "react-tag-input";
import {
  applyManualMitigation,
  getAllMitigation,
  getValidate,
} from "Store/Actions";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import Modal from "@mui/material/Modal";
import { NotificationManager } from "react-notifications";
import MitigationDialogue from "./mitigationDialogue";
//import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { adminMessage, isValidPermission } from "Constants/constant";
const filter = createFilterOptions();


const AnnualMitigation = () => {
  var inputtag = ""
  const dispatch = useDispatch();
  const data = useSelector((state) => state.qoeReducer);
  const [tags, setTags] = useState([]);
  const [platform, setPlatform] = useState([]);
  const [location, setLocation] = useState(null);

  const [mitigation_status, setMitigation_status] = useState("");

  const [bufferLength, setBufferLength] = useState(0);
  const [rebufferDuration, setRebufferDuration] = useState(0);
  const [bitrate, setBitrate] = useState(0);

  const [bottom, setBottom] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ids, setIds] = useState([]);
  const [apply, setApply] = useState(false);
  const [configure, setConfigure] = useState(false);
  const [selectAllCheckbox, setSelectAllCheckbox] = useState(false);
  const [clickOnValidate, setClickOnValidate] = useState(false);
  const [uei_conditionDd, setuei_conditionDd] = useState("");
  const [uei_condition, setuei_condition] = useState("");
  const [rebufferDurationFilterDd, setRebufferDurationFilterDd] = useState("");
  const [rebufferDurationFilter, setRebufferDurationFilter] = useState("");
  const [startBufferLengthFilterDd, setstartBufferLengthFilterDd] = useState("");
  const [startBufferLengthFilter, setstartBufferLengthFilter] = useState("");
  const [startBitrateFilterDd, setstartBitrateFilterDd] = useState("");
  const [startBitrateFilter, setstartBitrateFilter] = useState("");
  const [stallCountFilterDd, setstallCountFilterDd] = useState("");
  const [stallCountFilter, setstallCountFilter] = useState("");

  const exceptThisSymbols = ["e", "E", "+", "-", "."];
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  const [mobileMenu, setFilterMenu] = useState(false);
  const stylee = {
    color: "white",
    background: "#1992fb",
    width: "100px",
    height: "28px",
    fontSize: "1rem",
    fontWeigth: "600",
  };

  const handleDelete = (i) => {
    setTags(tags.filter((tag, index) => index !== i));
  };
  const handleAddition = (tag) => {
    setTags([...tags, tag]);
  };
  const handleTagClick = (index) => {

  };
  const handleInputChange = (val) => {
    inputtag = val
  }

  const cityarray = [];
  for (var key in data?.cities) {
    if (data?.cities.hasOwnProperty(key)) {
      if (data?.cities[key] != NaN) {
        var nameabcd = data?.cities[key].toString();
        var nameed = ([] = nameabcd.split(","));
        for (let j of nameed) {
          //cityarray.push(j+"("+key+")")
          cityarray.push(j);
        }
      }
    }
  }

  const validate = () => {
    setIds([]);
    setSelectAllCheckbox(false);
    //  setRebufferDuration();
    //  setBitrate();
    //  setBufferLength();
    // setClickOnValidate(true);
    // if (mitigation_status && uei_condition) {
    //setFilterMenu(false)
    // setConfigure(false)

    if (
      inputtag ||
      tags.length ||
      platform.length ||
      location ||
      mitigation_status ||
      uei_condition ||
      rebufferDurationFilterDd ||
      startBufferLengthFilterDd ||
      startBitrateFilterDd ||
      stallCountFilterDd
    ) {
     // setFilterMenu(false);

      setLoading(true);
      let totalTag = [];
      tags.length > 0 &&
        tags.map((t) => {
          return totalTag.push(t.text);
        });
      let uei_conditionss = uei_conditionDd + " " + uei_condition;
      let rebuffering_duration =
        rebufferDurationFilterDd + " " + rebufferDurationFilter;
      let startup_buffer_length =
        startBufferLengthFilterDd + " " + startBufferLengthFilter;
      let start_bitrate = startBitrateFilterDd + " " + startBitrateFilter;
      let stall_count = stallCountFilterDd + " " + stallCountFilter;

      dispatch(
        getValidate(
          totalTag.length == 0 ? (inputtag == "" ? [] : [inputtag]) : totalTag,
          platform,
          location,
          mitigation_status,
          uei_conditionss.trim(),
          rebuffering_duration.trim(),
          startup_buffer_length.trim(),
          start_bitrate.trim(),
          stall_count.trim(),
          dispatch,
          (val) => {
            if (!val.error) {
              setTags([]);
              setFilterMenu(false);
              setLoading(false);
              setBottom(true);
              localStorage.setItem("mitigation_status", mitigation_status);
              localStorage.setItem("uei_condition", uei_conditionss);
            } else {
              NotificationManager.error(val.message, "", 400);
              setLoading(false);
            }
          }
        )
      );
    } else {
      NotificationManager.error("Please Enter UEID/PLATFORM/LOCATION", '', 2000);
    }
    // }
  };
  const selectPlatform = (type) => {
    if (platform.indexOf(type) >= 0) {
      const info = platform.filter((p) => p !== type);
      setPlatform(info);
    } else {
      setPlatform((p) => p.concat(type));
    }
  };
  const locationHandler = (e) => {
    setLocation(e.target.value);
  };
  const Mitigation_statusHandler = (e) => {
    setMitigation_status(e.target.value);
  };
  const UEIHandler = (e) => {
    setuei_conditionDd(e.target.value);
  };
  const RebufferingHandler = (e) => {
    setRebufferDurationFilterDd(e.target.value);
  };
  const StartBufferHandler = (e) => {
    setstartBufferLengthFilterDd(e.target.value);
  };
  const StartBitrateHandler = (e) => {
    setstartBitrateFilterDd(e.target.value);
  };
  const StallCountHandler = (e) => {
    setstallCountFilterDd(e.target.value);
  };
  const clearAll = () => {
    setClickOnValidate(false);
    setLocation("");
    setMitigation_status("");
    setuei_conditionDd("");
    setuei_condition("");
    setTags([]);
    setPlatform([]);
    setRebufferDurationFilterDd("");
    setstartBufferLengthFilterDd("");
    setstartBitrateFilterDd("");
    setstallCountFilterDd("");
    setRebufferDurationFilter("");
    setstartBufferLengthFilter("");
    setstartBitrateFilter("");
    setstallCountFilter("");
  };
  const onChangeCheckbox = (data) => {
    setSelectAllCheckbox(false);
    const currentIndex = ids.indexOf(data.device_id);
    const newChecked = [...ids];
    if (currentIndex === -1) {
      newChecked.push(data.device_id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setIds(newChecked);
  };
  const applyManualMiti = () => {
    //  ids.length > 0 && setApply(true)
    setClickOnValidate(false);
    ids.length > 0 && setConfigure(true);
  };
  const clickOnConfirm = async () => {
    dispatch(
      applyManualMitigation(ids, () => {
        setTimeout(() => {
          dispatch(
            getAllMitigation(
              dispatch,
              Math.floor(new Date().getTime() / 1000.0),
              Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
            )
          );
        }, 1000*60*2);
        dispatch(
          getAllMitigation(
            dispatch,
            Math.floor(new Date().getTime() / 1000.0),
            Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
          )
        );


      })
    );
    setApply(false);
    //setConfigure(false)
    setBottom(false);
    setConfigure(false);

    localStorage.setItem("startup_buffer_length", "");
    localStorage.setItem("start_bit_rate", "");
    localStorage.setItem("rebuffer_duration", "");
    setBitrate(0);
    setRebufferDuration(0);
    setBufferLength(0);
  };

  const clickOnApply = () => {
   // validation of 2 to the power 62..reference--https://www.meracalculator.com/math/exponents.php
    if(bufferLength >= 4611686018427388000 || rebufferDuration >= 4611686018427388000 || bitrate >= 4611686018427388000){
      NotificationManager.error("Please Enter valide number its too large");
      return ;
    }
    
    if (bufferLength && rebufferDuration && bitrate) {
      localStorage.setItem("startup_buffer_length", bufferLength);
      localStorage.setItem("start_bit_rate", bitrate);
      localStorage.setItem("rebuffer_duration", rebufferDuration);
      setApply(true);

      // setIds([]);
    } else {
      setClickOnValidate(true);
      NotificationManager.error("Please Enter all the data");
    }
  };

  const manualStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  const manualStylee = {
    color: "white",
    background: "#1992fb",
    width: "83px",
    height: "28px",
    fontSize: "1rem",
    fontWeigth: "100",
  };
  const manualStyleeCancele = {
    color: "#020202",
    width: "83px",
    height: "28px",
    fontSize: "1rem",
    border: "1px solid #1992fb",
    marginRight: "10px",
  };

  //To handle selecting and removing  all filtered results
  const selectAll = () => {
    setSelectAllCheckbox(!selectAllCheckbox);
    let all = [];
    if (!selectAllCheckbox) {
      data?.mitigation?.map((m) => {
        return all.push(m.device_id);
      });
      setIds(all);
    } else if (selectAllCheckbox) {
      all = [];
      setIds([]);
    }
  };

  const preventMinus = (e) => {
    if (e.code === "Minus" || e.code == "e" || e.code == "E") {
      e.preventDefault();
    } else {
      exceptThisSymbols.includes(e.key) && e.preventDefault();
    }
  };
  const preventPasteNegative = (e) => {
    const clipboardData = e.clipboardData || window.clipboardData;
    const pastedData = parseFloat(clipboardData.getData("text"));

    if (pastedData < 0) {
      e.preventDefault();
    }
  };
  
  const openMenuFIlter=()=>{
    if(isValidPermission("WRITE_MITIGATION")){
      setFilterMenu(true)
    }else{
      NotificationManager.error(adminMessage.message)
    }

  }

  return (
    <div className='FilterContainer'>
      <Grid  item xs={12} md={12} onClick={() => openMenuFIlter()}>
        <h5>
          APPLY MANUAL MITIGATION <i className='zmdi zmdi-plus'></i>
        </h5>
      </Grid>
      <Drawer
        open={mobileMenu}
        onClose={() => setFilterMenu(false)}
        anchor={"right"}
      >
        <div style={{ width: "480px" }}>
          <div className='SideBarHeader' style={{ marginBottom: "-10px" }}>
            <h3>MITIGATION</h3>
            <IconButton onClick={() => setFilterMenu(false)}>
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
            <Box
              component='form'
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25px" },
              }}
              noValidate
              autoComplete='off'
              style={{ marginBottom: "2px" }}
            >
              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  {" "}
                  Enter UEID/RMN, Single or Multiple and (<b>Press Enter</b>)
                </h3>
                <ReactTags
                  classNames={{
                    tags: "tagsClass",
                    tagInput: "tagInputClass",
                    tagInputField: "tagInputFieldClass",
                    selected: "selectedClass",
                    tag: "tagClass",
                    remove: "removeClass",
                    suggestions: "suggestionsClass",
                    activeSuggestion: "activeSuggestionClass",
                    editTagInput: "editTagInputClass",
                    editTagInputField: "editTagInputField",
                    clearAll: "clearAllClass",
                  }}
                  tags={tags}
                  delimiters={delimiters}
                  handleDelete={handleDelete}
                  handleAddition={handleAddition}
                  handleTagClick={handleTagClick}
                  handleInputChange={handleInputChange}
                  autocomplete
                  allowDragDrop={false}
                  placeholder='Enter UEID or RMN and Press Enter'
                  inputFieldPosition='inline'
                />
              </ListItem>
            </Box>
            <List dense className='filtersCont'>
              <ListItem style={{ display: "block", marginTop: "7px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>Platform</h3>
                <div className='filter-wrap'>
                  {/* <Button onClick={() => selectPlatform('Chrome')} className={platform.indexOf('Chrome') >= 0 ? 'Filter-active' : 'Filter-inactive'} variant="outlined" size="small" value="Chrome" >Chrome</Button> */}
                  {/* <Button onClick={() => selectPlatform('Windows')} className={platform.indexOf('Windows') >= 0 ? 'Filter-active' : 'Filter-inactive'} variant="outlined" size="small" value="Windows" >Windows</Button> */}
                  <Button
                    onClick={() => selectPlatform("Android")}
                    className={
                      platform.indexOf("Android") >= 0
                        ? "Filter-active"
                        : "Filter-inactive"
                    }
                    variant='outlined'
                    size='small'
                    value='Android'
                  >
                    Android
                  </Button>
                  <Button
                    onClick={() => selectPlatform("iOS")}
                    className={
                      platform.indexOf("iOS") >= 0
                        ? "Filter-active"
                        : "Filter-inactive"
                    }
                    variant='outlined'
                    size='small'
                    value='iOS'
                  >
                    IOS
                  </Button>
                  {/* <Button
                    onClick={() => selectPlatform("TV")}
                    className={
                      platform.indexOf("TV") >= 0
                        ? "Filter-active"
                        : "Filter-inactive"
                    }
                    variant='outlined'
                    size='small'
                    value='TV'
                  >
                    TV
                  </Button> */}
                  <Button
                    onClick={() => selectPlatform("Firestick")}
                    className={
                      platform.indexOf("Firestick") >= 0
                        ? "Filter-active"
                        : "Filter-inactive"
                    }
                    variant='outlined'
                    size='small'
                    value='Firestick'
                  >
                    Firestick
                  </Button>
                  <Button
                    onClick={() => selectPlatform("Web")}
                    className={
                      platform.indexOf("Web") >= 0
                        ? "Filter-active"
                        : "Filter-inactive"
                    }
                    variant='outlined'
                    size='small'
                    value='Web'
                  >
                    Web
                  </Button>
                  <Button
                    onClick={() => selectPlatform("AndroidSmartTv")}
                    className={
                      platform.indexOf("AndroidSmartTv") >= 0
                        ? "Filter-active"
                        : "Filter-inactive"
                    }
                    variant='outlined'
                    size='small'
                    value='Web'
                  >
                    AndroidSmartTv
                  </Button>
                </div>
              </ListItem>
              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  {" "}
                  Location
                </h3>

                <FormControl fullWidth>
                 
                  <Autocomplete
                    value={location}
                    onChange={(event, newValue) => {
                      const results = cityarray.filter((a) =>
                      a.toLowerCase().includes(newValue.toLowerCase())
                    );
                      if (typeof newValue === 'string') {
                        setLocation(
                          results,
                        );
                      } else if (newValue && newValue.inputValue) {
                        // Create a new value from the user input
                        setLocation(
                          results,
                        );
                      } else {
                        setLocation(results);
                      }
                    }}
                    filterOptions={(options, params) => {
                      const filtered = filter(options, params);

                      const { inputValue } = params;
                      // Suggest the creation of a new value
                      const isExisting = options.some((option) => inputValue === option.title);
                      if (inputValue !== '' && !isExisting) {
                        filtered.push(inputValue);
                      }
                      return filtered;
                    }}
                    selectOnFocus
                    clearOnBlur
                    handleHomeEndKeys
                    id="free-solo-with-text-demo"
                    className='add-border-location'
                    options={cityarray}
                    getOptionLabel={(option) => {
                      // Value selected with enter, right from the input
                      if (typeof option === 'string') {
                        return option;
                      }
                      // Add "xxx" option created dynamically
                      if (option.inputValue) {
                        return option.inputValue;
                      }
                      // Regular option
                      return option;
                    }}
                    renderOption={(props, option) =>
                    //   const results = cityarray.filter((a) =>
                    //   a.toLowerCase().includes(option.toLowerCase())
                    // );
                       <li {...props}>{option}</li>
                      }
                    freeSolo
                    renderInput={(params) => (
                      <TextField {...params} label="" 
                      style={{
                        paddingLeft: "0px",
                        fontSize: "15px",
                        paddingRight: "0px",

                      }}
                      />
                    )}
                  />
                </FormControl>
              </ListItem>

              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  Mitigation status
                </h3>
                <FormControl fullWidth>
                  <Select
                    value={mitigation_status}
                    labelId='demo-simple-select-label'
                    id='demo-simple-select'
                    variant='outlined'
                    style={{ height: "40px" }}
                    onChange={Mitigation_statusHandler}
                  >
                    <MenuItem key='DISPATCHED' value='DISPATCHED'>
                      DISPATCHED
                    </MenuItem>
                    <MenuItem key='MISSED' value='MISSED'>
                      MISSED
                    </MenuItem>
                    <MenuItem key='FIXED' value='FIXED'>
                      FIXED
                    </MenuItem>
                    <MenuItem key='PENDING' value='Pending'>
                      PENDING
                    </MenuItem>
                  </Select>
                </FormControl>
              </ListItem>

              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  {" "}
                  UEI Condition
                </h3>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={uei_conditionDd}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        variant='outlined'
                        style={{ height: "40px" }}
                        onChange={UEIHandler}
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
                        <MenuItem key='=' value='='>
                          =
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      value={uei_condition}
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
                      onChange={(e) => setuei_condition(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  {" "}
                  Rebufferring Duration
                </h3>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={rebufferDurationFilterDd}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        variant='outlined'
                        style={{ height: "40px" }}
                        onChange={RebufferingHandler}
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
                        <MenuItem key='=' value='='>
                          =
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      value={rebufferDurationFilter}
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
                      onChange={(e) =>
                        setRebufferDurationFilter(e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </ListItem>

              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  Startup Buffer Length
                </h3>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={startBufferLengthFilterDd}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        variant='outlined'
                        style={{ height: "40px" }}
                        onChange={StartBufferHandler}
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
                        <MenuItem key='=' value='='>
                          =
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      value={startBufferLengthFilter}
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
                      onChange={(e) =>
                        setstartBufferLengthFilter(e.target.value)
                      }
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  Startup Bitrate
                </h3>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={startBitrateFilterDd}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        variant='outlined'
                        style={{ height: "40px" }}
                        onChange={StartBitrateHandler}
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
                        <MenuItem key='=' value='='>
                          =
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      value={startBitrateFilter}
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
                      onChange={(e) => setstartBitrateFilter(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </ListItem>
              <ListItem style={{ display: "block", marginTop: "10px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  Stall Count
                </h3>

                <Grid container spacing={2}>
                  <Grid item xs={6} md={6}>
                    <FormControl fullWidth>
                      <Select
                        value={stallCountFilterDd}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        variant='outlined'
                        style={{ height: "40px" }}
                        onChange={StallCountHandler}
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
                        <MenuItem key='=' value='='>
                          =
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} md={6}>
                    <TextField
                      value={stallCountFilter}
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
                      onChange={(e) => setstallCountFilter(e.target.value)}
                    />
                  </Grid>
                </Grid>
              </ListItem>

              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center",
                  marginTop: "10px",
                  marginRight: "14px",
                }}
              >
                <MatButton
                  onClick={clearAll}
                  className='Status-btn'
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
                {loading ? (
                  <h4>Loading...</h4>
                ) : (
                  <MatButton onClick={validate} style={stylee}>
                    {"Validate"}
                  </MatButton>
                )}
              </div>
            </List>
          </div>
        </div>
      </Drawer>

      <Drawer
        anchor='bottom'
        open={bottom}
        onClose={() => setBottom(false)}
        className='drawer-mitigation'
      >
        <div className='drawer-header'>
          <span>
            {" "}
            <i
              onClick={() => setBottom(false)}
              className='zmdi zmdi-arrow-left'
            ></i>{" "}
            Manual Mitigation Impacted Devices ({data?.mitigation?.length})
          </span>
          <i onClick={() => setBottom(false)} className='zmdi zmdi-close'></i>
        </div>
        <TableContainer>
          <Table sx={{ minWidth: 650 }}>
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
                <TableCell></TableCell>
                <TableCell>Device</TableCell>
                <TableCell>UEI</TableCell>
                <TableCell>Rebuffering Duration</TableCell>
                <TableCell>Stall</TableCell>
                <TableCell>Startup Buffer Length</TableCell>
                <TableCell>Start Bitrate</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Platform</TableCell>
              </TableRow>
            </TableHead>
            {data?.mitigation &&
              data?.mitigation?.length > 0 &&
              data?.mitigation?.map((data, index) => {
                return (
                  <TableRow
                    key={index}
                    style={{ backgroundColor: "#ffffff", borderBottom: "0px" }}
                  >
                    <TableCell>
                      <Checkbox
                        onChange={() => onChangeCheckbox(data)}
                        edge='start'
                        checked={ids.indexOf(data.device_id) !== -1}
                        disableRipple
                        size='small'
                        sx={{ minWidth: "18px" }}
                      />
                    </TableCell>
                    <TableCell>{data?.device_id}</TableCell>
                    <TableCell>{parseFloat(data?.current_uei)}</TableCell>
                    <TableCell>{data?.rebuffering_duration}</TableCell>
                    <TableCell>{data?.stall_count}</TableCell>
                    <TableCell>
                      {data?.startup_buffer_length == ""
                        ? "NA"
                        : data?.startup_buffer_length}
                    </TableCell>
                    <TableCell>{data?.start_bitrate}</TableCell>
                    <TableCell>{data?.location}</TableCell>
                    <TableCell>{data?.platform}</TableCell>
                  </TableRow>
                );
              })}
          </Table>
        </TableContainer>

        <div className='apply-container'>
          <Checkbox
            onChange={() => selectAll()}
            checked={selectAllCheckbox}
            edge='start'
            disableRipple
            size='small'
            sx={{ minWidth: "18px" }}
          />
          <MatButton className='apply-filter-btn'> Select All </MatButton>
          {/* <MatButton
            onClick={() => {
              setIds([])
              setSelectAllCheckbox(false)
            }}
            className="apply-filter-btn">
            Remove
          </MatButton> */}

          <MatButton
            onClick={applyManualMiti}
            className='apply-btn'
            style={{
              fontSize: "0.875rem",
              color: "#008eff",
              width: "100px",
              height: "28px",
              fontWeight: "600",
            }}
          >
            Configure
          </MatButton>
        </div>
      </Drawer>

      <Modal
        open={apply}
        onClose={() => {
          setApply(false);
          setRebufferDuration(0);
          setBitrate(0);
          setBufferLength(0);
        }}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={manualStyle}>
          <Typography id='modal-modal-description' sx={{ mt: 2 }}>
            Are you sure you want to apply Mitigations?
          </Typography>
          <p>Number of session : {ids.length}</p>
          <p>
            Start Buffer Length :{" "}
            {localStorage.getItem("startup_buffer_length")}
          </p>
          <p>
            Rebuffering Duration : {localStorage.getItem("rebuffer_duration")}
          </p>
          <p>Start Bitrate : {localStorage.getItem("start_bit_rate")}</p>
          <div style={{ float: "right", marginTop: "10px" }}>
            <MatButton
              onClick={() => {
                setApply(false);
                // setBitrate(0);
                // setRebufferDuration(0);
                // setBufferLength(0);
              }}
              className='Status-btn'
              style={{
                fontSize: "1rem",
                color: "#008eff",
                width: "83px",
                height: "28px",
                fontWeight: "100",
              }}
            >
              {"No"}
            </MatButton>
            <MatButton onClick={clickOnConfirm} style={manualStylee}>
              {"Yes"}
            </MatButton>
          </div>
        </Box>
      </Modal>

      <MitigationDialogue
        assetid=''
        title='Mitigations'
        isOpen={configure}
        onClose={() => {
          setConfigure(false);
          setBitrate(0);
          setRebufferDuration(0);
          setBufferLength(0);
        }}
      >
        <Paper style={{ padding: "0 2em 2em 2em" }}>
          <div>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                {" "}
                Startup Buffer Length
              </h3>
              <TextField
                value={bufferLength}
                id='outlined-basic'
                label=''
                variant='outlined'
                size='small'
                type={"number"}
                min='0'
                style={{
                  background: "#f7f7f7",
                  border: "1",
                  borderRadius: "4px",
                  width: "100%",
                }}
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value >= 0 || re.test(e.target.value)) {
                    setBufferLength(e.target.value);
                    
                  }
                }}
                onPaste={preventPasteNegative}
                onKeyPress={preventMinus}
                onKeyDown={(e) => {
                  if (e.keyCode === 38 || e.keyCode === 40) {
                    e.preventDefault();
                  }
                }}
              />
              {clickOnValidate && !bufferLength && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Please Enter Buffer Length
                </p>
              )}
               {bufferLength >=4611686018427388000 && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  You have Enter the maximum number
                </p>
              )}
            </ListItem>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                {" "}
                Rebuffering Duration
              </h3>
              <TextField
                value={rebufferDuration}
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
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value >= 0 || re.test(e.target.value)) {
                    setRebufferDuration(e.target.value);
                  }
                }}
                onPaste={preventPasteNegative}
                onKeyPress={preventMinus}
                onKeyDown={(e) => {
                  if (e.keyCode === 38 || e.keyCode === 40) {
                    e.preventDefault();
                  }
                }}
              />
              {clickOnValidate && !rebufferDuration && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Please Enter Rebuffer Duration
                </p>
              )}
               {rebufferDuration >=4611686018427388000 && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  You have Enter the maximum number
                </p>
              )}
            </ListItem>
            <ListItem style={{ display: "block", marginTop: "15px" }}>
              <h3 style={{ fontSize: "15px", color: "#404040" }}>
                {" "}
                Start Bitrate
              </h3>
              <TextField
                value={bitrate}
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
                onChange={(e) => {
                  const re = /^[0-9\b]+$/;
                  if (e.target.value >= 0 || re.test(e.target.value)) {
                    setBitrate(e.target.value);
                  }
                }}
                onPaste={preventPasteNegative}
                onKeyPress={preventMinus}
                onKeyDown={(e) => {
                  if (e.keyCode === 38 || e.keyCode === 40) {
                    e.preventDefault();
                  }
                }}
              />
              {clickOnValidate && !bitrate && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  Please Enter Bitrate
                </p>
              )}
              {bitrate >=4611686018427388000 && (
                <p style={{ color: "red", fontWeight: "bold" }}>
                  You have Enter the maximum number
                </p>
              )}
            </ListItem>
            <div style={{ float: "right", marginTop: "10px" }}>
              <MatButton
                onClick={() => {
                  setConfigure(false);
                  setBitrate(0);
                  setRebufferDuration(0);
                  setBufferLength(0);
                  // setIds([]);
                }}
                style={manualStyleeCancele}
              >
                {"Cancel"}
              </MatButton>
              <MatButton onClick={clickOnApply} style={manualStylee}>
                {"Apply"}
              </MatButton>
            </div>
          </div>
        </Paper>
      </MitigationDialogue>
    </div>
  );
};
export default AnnualMitigation;
