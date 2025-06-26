import * as React from "react";
import { useState, useEffect } from "react";
import ContentPartnerFilter from "./ContentPartnerFilter";
import ContentTypeFilter from "./ContentTypeFilter";
import LocationFilter from "./LocationFilter";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { FormControl, Grid, IconButton, MenuItem, Select, TextField } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { getCities } from "Store/Actions";
import Drawer from "@material-ui/core/Drawer";
import { useDispatch, useSelector } from "react-redux";
import DeviceIdFilter from "./DeviceIdFilter";
import VideoIdFilter from "./VideoIdFilter";
import LiveFilter from "./LiveFilter";
import HasFilter from "./HasFilter";
import DrmFilter from "./DrmFilter";
import NetworkFilter from "./NetworkFIlter";
import ManufacturerFilter from "./ManufacturerFilter";
import ErrorFilter from "./ErrorFilter";
import Paper from "@mui/material/Paper";
export default function FilterAnomalyPlayback(props) {
    const dispatch = useDispatch();
    const dataDisplay = useSelector((state) => state.qoeReducer);
    console.log({ dataDisplay })
    useEffect(() => {
        if (dataDisplay?.cities?.length > 0) {
            return null;
        } else {
            dispatch(getCities(dispatch));
        }
    }, [dispatch]);
    const {
        // getCdn,
        getContentPartner,
        getLocation,
        savePlatformData,
        contentPartner,
        location = [],
        devicePlatform = [],
        videoId = [],
        getVideoId,
        getErrorCode,
        errorCode = [],
        getErrorNameData,
        errorName,
        errorCount,
        errorCountSign,
        getErrorCount,
        getErrorCountSign,
    } = props;
    const [listNameLocation, setListNameLocation] = useState([]);
    const [listNamePartner, setlistNamePartner] = useState([]);
    const [listNameErrorCode, setListNameErrorCode] = useState([]);
    const [mobileMenu, setFilterMenu] = useState(false);
    const [errorCodeData, saveErrorCodeData] = useState([]);
    const [errorCountData, saveErrorCountData] = useState('');
    const [errorCountSignData, saveErrorCountSignData] = useState('');
    const [inputError, setInputError] = useState('');
    const [checkedItemsLocation, setCheckedItemsLocation] = useState([]);
    // const [cdnData, saveCdnData] = useState([]);
    const [contentPartnerData, saveContentPartnerData] = useState([]);
    const [locationData, saveLocationData] = useState([]);
    const [videoIdData, saveVideoIdData] = useState([]);
    // const [errorCount, saveErrorCount] = useState();
    const [errorNameData, saveErrorNameData] = useState();
    const [checkedItemsContentPartner, setCheckedItemsContentPartner] = useState(
        []
    );
    const [device, setDevice] = useState(devicePlatform);
    const [checkedItemsErrorCode, setCheckedItemsErrorCode] = useState([]);
    const [checkedItemsErrorName, setCheckedItemsErrorName] = useState([]);
    const [checkedItemVideoId, setCheckedItemVideoId] = useState([]);
    const [checkedItemErrorCount, setCheckedItemErrorCount] = useState([]);
    const [checkedItemErrorCountSign, setCheckedItemErrorCountSign] = useState([])
    useEffect(() => {
        setDevice(devicePlatform);
    }, [devicePlatform]);

    useEffect(() => {
        setCheckedItemsContentPartner(contentPartner);
        saveContentPartnerData(contentPartner);
    }, [contentPartner]);
    useEffect(() => {
        // console.log({listNameErrorCode},"error code")
        if (errorCode !== []) {
            setCheckedItemsErrorCode(errorCodeData);
            getErrorCode(errorCodeData ? errorCodeData : []);
        }
    }, [errorCode !== []]);
    useEffect(() => {
        setCheckedItemsErrorName(errorName);
        saveErrorNameData(errorName);
    }, [errorName]);

    useEffect(() => {
        let temparray = [];
        location.forEach((element) => {
            temparray.push(element);
        });
        setCheckedItemsLocation(temparray);
        saveLocationData(temparray);
    }, [location]);

    useEffect(() => {
        setCheckedItemVideoId(videoId);
        saveVideoIdData(videoId);
    }, [videoId]);

    useEffect(() => {
        saveErrorCountData(errorCount);
        saveErrorCountSignData(errorCountSign);
        setCheckedItemErrorCountSign(errorCountSign);
        setCheckedItemErrorCount(errorCount);
    }, [errorCount, errorCountSign]);

    useEffect(() => {
        if (Object.keys(dataDisplay?.cities)?.length > 0) {
            setListNameLocation(dataDisplay?.cities);
        }
    }, [dataDisplay?.cities]);

    useEffect(() => {
        if (dataDisplay?.filters?.content_partner?.length > 0) {
            console.log({ dataDisplay })
            setlistNamePartner(dataDisplay?.filters?.content_partner);
        }
    }, [dataDisplay?.filters?.content_partner]);
    useEffect(() => {
        if (dataDisplay?.filters?.error_codes) {
            setListNameErrorCode(dataDisplay?.filters?.error_codes);
            console.log({ first: dataDisplay?.filters?.error_code, str: 'from error' })
        }
    }, [dataDisplay?.filters?.error_codes]);

    const clearFilters = () => {
        saveContentPartnerData([]);
        saveVideoIdData([]);
        saveLocationData([]);
        setCheckedItemsLocation([]);
        setCheckedItemsContentPartner([]);
        saveErrorCodeData([]);
        setCheckedItemsErrorCode([]);
        saveErrorNameData([]);
        setInputError([]);
        //setCurrentUEIDd("");
        saveErrorCountSignData('');
        //setCurrentUEI('');
        saveErrorCountData("");
        // setCheckedItemErrorCountSign("");
        // setCheckedItemErrorCount("");
    };

    const applyFilters = () => {
        // getCdn(cdnData);
        // setCheckedItemsCdn(cdnData);
        getContentPartner(contentPartnerData);
        setCheckedItemsContentPartner(contentPartnerData);
        // setCheckedItemsErrorCode(errorCodeData);
        // getErrorCode(errorCodeData);
        getLocation(locationData);
        setCheckedItemsLocation(locationData);
        getVideoId(videoIdData);
        getErrorNameData(errorNameData);
        getErrorCount(errorCountData);
        getErrorCountSign(errorCountSignData);
        setCheckedItemVideoId(videoIdData);
        setCheckedItemsErrorName(errorNameData);
        setFilterMenu(false);
        savePlatformData(device);
        if (errorCode !== []) {

            setCheckedItemsErrorCode(errorCodeData);

            getErrorCode(errorCodeData ? errorCodeData : []);

        }
    };

    const addToPlatformList = (e) => {
        let platFormArr = device;
        let selectedPlatform = e.target.value;
        if (platFormArr.indexOf(selectedPlatform) === -1) {
            let data = platFormArr.concat(selectedPlatform);
            setDevice(data);
        } else {
            let data = platFormArr.filter((s) => s !== selectedPlatform);
            setDevice(data);
        }
    };



    return (
        <div className='FilterContainer'>
            <Button
                variant='contained'
                className='btnFilter'
                size='small'
                endIcon={<FilterAltOutlinedIcon />}
                onClick={() => setFilterMenu(true)}
            />
            <Drawer
                open={mobileMenu}
                onClose={() => {
                    setDevice(devicePlatform);
                    setFilterMenu(false)
                }}
                anchor={"right"}
            >
                <div
                    className='rightSidebar'
                    style={{ height: "90%", overflowY: "auto" }}
                >
                    <div className='SideBarHeader' style={{ marginBottom: "-30px" }}>
                        <h3>FILTER</h3>
                        <IconButton onClick={() => setFilterMenu(false)}>
                            {" "}
                            <Close />
                        </IconButton>
                    </div>
                    <List dense className='filtersCont'>
                        <ListItem>
                            <h3>Device (Multiple Selection)</h3>
                            <div className='filter-wrap'>
                                {dataDisplay?.device_platform &&
                                    dataDisplay?.device_platform?.length > 0 &&
                                    dataDisplay?.device_platform?.map((d) => {
                                        return (
                                            <Button
                                                className={
                                                    device.indexOf(d) >= 0
                                                        ? "Filter-active"
                                                        : "Filter-inactive"
                                                }
                                                key={d}
                                                variant='outlined'
                                                size='small'
                                                value={d}
                                                onClick={addToPlatformList}
                                            >
                                                {d}
                                            </Button>
                                        );
                                    })}
                            </div>
                        </ListItem>
                        <ListItem>
                            <h3>Content Partner</h3>
                            <ContentPartnerFilter
                                listName={listNamePartner}
                                getContentPartner={getContentPartner} //Not
                                saveContentPartnerData={saveContentPartnerData}
                                checkedItemsContentPartner={
                                    localStorage.getItem("contentPartner")
                                        ? checkedItemsContentPartner.concat(
                                            localStorage.getItem("contentPartner")
                                        )
                                        : checkedItemsContentPartner
                                }
                            />
                        </ListItem>
                        <ListItem>
                            <h3>Location</h3>
                            <LocationFilter
                                listName={listNameLocation}
                                getLocation={getLocation}
                                saveLocationData={saveLocationData}
                                checkedItemsLocation={checkedItemsLocation}
                            />
                        </ListItem>
                        
                        <ListItem>
                            <h3>Error Code</h3>
                            <ErrorFilter
                                listName={Object.keys(listNameErrorCode || {})}
                                getErrorCode={getErrorCode}
                                saveErrorCodeData={saveErrorCodeData}
                                checkedItemsErrorCode={checkedItemsErrorCode}
                            />
                        </ListItem>
                        <ListItem style={{ display: "block", marginTop: "10px" }}>
                            <h3 style={{ fontSize: "15px", color: "#404040" }}>
                                Error count
                            </h3>
                            <ErrorCountAndSignFilter
                            
                                errorCountData ={errorCountData}
                                errorCountSignData={errorCountSignData}
                                saveErrorCountData={saveErrorCountData}
                                saveErrorCountSignData={saveErrorCountSignData}
                            />

                        </ListItem>
                        
                        <ListItem>
                            <h3>Error Name</h3>
                            <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                                <input type="text"
                                    value={inputError}
                                    onChange={(e) => {
                                        setInputError(e.target.value);
                                        saveErrorNameData(e.target.value);
                                    }}
                                    className="filterSearch" placeholder='Enter Error Name'
                                />
                            </Paper>
                        </ListItem>

                        <ListItem>
                            <h3>Video ID</h3>
                            <VideoIdFilter
                                videoIdData ={videoIdData}
                                saveVideoIdData={saveVideoIdData}
                            />
                        </ListItem>
                        
                    </List>
                </div>
                <div className='rightSidebar'>
                <Button
                        variant='contained'
                        size='small'
                        className='btnFilterApply'
                        onClick={clearFilters}
                    >
                        Clear All
                    </Button>
                    <Button
                        variant='contained'
                        size='small'
                        className='btnFilterApply'
                        onClick={applyFilters}
                    >
                        Apply
                    </Button>
                </div>
            </Drawer>
        </div>
    );
}


const ErrorCountAndSignFilter = (props) => {
    console.log(props,"ppp");
    const { saveErrorCountData, saveErrorCountSignData,errorCountData,errorCountSignData } = props;
    const [currentUEIDd, setCurrentUEIDd] = useState('');
    const [currentUEI, setCurrentUEI] = useState("");

    useEffect(()=> {
		if(errorCountData.length==0)  {
            saveErrorCountData("");
            setCurrentUEI("");
        }
        if(errorCountSignData.length==0) {
            saveErrorCountSignData('');
            setCurrentUEIDd("");
		}  // on click of clear button
	},[errorCountData,errorCountSignData])

    return (
        <Grid container spacing={2}>
            <Grid item xs={6} md={6}>
                <FormControl fullWidth>
                    <Select
                        value={currentUEIDd}
                        labelId='demo-simple-select-label'
                        id='demo-simple-select'
                        variant='outlined'
                        style={{ height: "40px" }}
                        onChange={(e) => {
                            setCurrentUEIDd(e.target.value);
                            saveErrorCountSignData(e.target.value);
                        }}
                    >
                        <MenuItem key='>=' value='_gte'>
                            &gt;=
                        </MenuItem>
                        <MenuItem key='<=' value='_lte'>
                            &#60;=
                        </MenuItem>
                        <MenuItem key='>' value='_gt'>
                            &gt;
                        </MenuItem>
                        <MenuItem key='<' value='_lt'>
                            {" "}
                            &#60;
                        </MenuItem>
                        <MenuItem key='==' value='_eq'>
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
                    onChange={(e) => {
                        setCurrentUEI(e.target.value);
                        saveErrorCountData(e.target.value)
                    }}
                />
            </Grid>
        </Grid>
    )
}