import * as React from "react";
import { useState, useEffect } from "react";
import ContentPartnerFilter from "./ContentPartnerFilter";
import ContentTypeFilter from "./ContentTypeFilter";
import LocationFilter from "./LocationFilter";
import FilterAltOutlinedIcon from "@mui/icons-material/FilterAltOutlined";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { IconButton } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { getCities, getConfigMitiListBucket, getEstimatedRootRcaBucket } from "Store/Actions";
import Drawer from "@material-ui/core/Drawer";
import { useDispatch, useSelector } from "react-redux";
import DeviceIdFilter from "./DeviceIdFilter";
import VideoIdFilter from "./VideoIdFilter";
import LiveFilter from "./LiveFilter";
import HasFilter from "./HasFilter";
import DrmFilter from "./DrmFilter";
import NetworkFilter from "./NetworkFIlter";
import ManufacturerFilter from "./ManufacturerFilter";
import BucketFilter from "./Bucketfilter";
import { removeDuplicates } from "Constants/constant";

export default function FilterDetectedAnamoliesGraph(props) {
    const dispatch = useDispatch();
    const dataDisplay = useSelector((state) => state.qoeReducer);
    useEffect(() => {
        if (dataDisplay?.cities?.length > 0) {
            return null;
        } else {
            dispatch(getCities(dispatch));
        }
    }, []);
    useEffect(() => {
        if (dataDisplay?.estimatedRootRcaBucket?.Items?.length > 0) {
            return null;
        } else {
            dispatch(getEstimatedRootRcaBucket(dispatch))
        }
    }, []);

    var {
        // getCdn,
        getContentPartner,
        getLocation,
        savePlatformData,
        contentPartner,
        location = [],
        devicePlatform = [],
        drm = [],
        manufacturer = [],
        network = [],
        getNetwork,
        getManufacturer,
        getBucketName,
        bucketname = []
    } = props;
    // const listNameCdn = ["cdn1", "cdn2", "cdn3", "cdn4", "Akamai"]
    const [listNameLocation, setListNameLocation] = useState([]);
    const [listNamePartner, setlistNamePartner] = useState([]);
    const [listBucketName, setlistBucketName] = useState([]);

    // const [listNameErrorCode, setListNameErrorCode] = useState([]);
    // const [listNameDeviceId, setListNameDeviceId] = useState([]);
    // const [listNameVideoId, setListNameVideoId] = useState([]);
    // const [listNameLive, setListNameLive] = useState([]);
    // const [listNamedrm, setListNameDrm] = useState([]);
    // const [listNameHas, setListNameHas] = useState([]);
    // const [listNameManufacturer, setListNameManufacturer] = useState([]);
    // const [listNameNetwork, setListNameNetwork] = useState([]);
    const [mobileMenu, setFilterMenu] = useState(false);
    // const [cdnData, saveCdnData] = useState([]);
    const [contentPartnerData, saveContentPartnerData] = useState([]);
    const [contentTypeData, saveContentTypeData] = useState([]);
    const [locationData, saveLocationData] = useState([]);
    const [deviceIdData, saveDeviceIdData] = useState([]);
    const [videoIdData, saveVideoIdData] = useState([]);
    const [liveData, saveLiveData] = useState([]);
    const [drmData, saveDrmData] = useState([]);
    const [hasData, saveHasData] = useState([]);
    const [manufacturerData, saveManufacturerData] = useState([]);
    const [networkData, saveNetworkData] = useState([]);
    const [bucketData, saveBucketData] = useState([]);

    const [checkedItemsContentPartner, setCheckedItemsContentPartner] = useState(
        []
    );
    const [checkedItemsContentType, setCheckedItemsContentType] = useState([]);
    const [checkedItemsLocation, setCheckedItemsLocation] = useState([]);
    const [checkedItemsDeviceId, setCheckedItemsDeviceId] = useState([]);
    const [checkedItemVideoId, setCheckedItemVideoId] = useState([]);
    const [checkedItemLiveData, setCheckedItemLiveData] = useState([]);
    const [checkedItemDrmData, setCheckedItemDrmData] = useState([]);
    const [checkedItemHasData, setCheckedItemHasData] = useState([]);
    const [checkedItemManufacturerData, setCheckedItemManufacturerData] = useState([]);
    const [checkedItemNetworkData, setCheckedItemItemNetworkData] = useState([]);
    const [checkedItemBucketData, setCheckedItemBucketData] = useState([]);

    const [device, setDevice] = useState(devicePlatform);
    const [isClear, setIsClear] = useState(false);
    console.log("useeffect-dataDisplay -", dataDisplay );

    useEffect(() => {
        setDevice(devicePlatform);
    }, [devicePlatform]);

    useEffect(() => {
        console.log("network 99--", contentPartner);

        setCheckedItemsContentPartner(contentPartner);
        saveContentPartnerData(contentPartner);
    }, [contentPartner]);

    // useEffect(() => {
    //   setCheckedItemsContentType(contentType);
    //   saveContentTypeData(contentType);
    // }, [contentType]);

    useEffect(() => {

        let temparray = [];
        location.forEach((element) => {
            temparray.push(element);
        });
        setCheckedItemsLocation(temparray);
        saveLocationData(temparray);
    }, [location]);


    useEffect(() => {
        console.log("network 99",network);

        setCheckedItemItemNetworkData(network);
        saveNetworkData(network);
    }, [network]);
    useEffect(() => {
        console.log("bucket 99",bucketname);
        setCheckedItemBucketData(bucketname);
        saveBucketData(bucketname);
    }, [bucketname]);

    useEffect(() => {
        setCheckedItemManufacturerData(manufacturer);
        saveManufacturerData(manufacturer);
    }, [manufacturer])

    useEffect(() => {
        if (Object.keys(dataDisplay?.cities)?.length > 0) {
            setListNameLocation(dataDisplay?.cities);
        }
    }, [dataDisplay?.cities]);

    useEffect(() => {
        let temparr=[]
                if (dataDisplay?.estimatedRootRcaBucket?.Items.length > 0) {
                    dataDisplay?.estimatedRootRcaBucket?.Items.map(res=>{
                        temparr.push(res.bucket_name.trim()) 
                    })
                    setlistBucketName(removeDuplicates(temparr));
        }
    }, [dataDisplay?.estimatedRootRcaBucket?.Items]);

    useEffect(() => {
        if (dataDisplay?.filters?.content_partner?.length > 0) {
            setlistNamePartner(dataDisplay?.filters?.content_partner);
        }
    }, [dataDisplay?.filters?.content_partner]);

    const clearFilters = () => {
        setCheckedItemManufacturerData([])
        setCheckedItemsContentPartner("");
        setCheckedItemItemNetworkData([]);
        saveContentPartnerData([]);
        saveManufacturerData([]);
        saveLocationData([]);
        setCheckedItemsLocation([]);
        setCheckedItemBucketData([]);
        saveNetworkData([])
        setDevice([]);
        saveBucketData([])

    };

    const applyFilters = () => {
        // getCdn(cdnData);
        // setCheckedItemsCdn(cdnData);
        let filters = {
            drm: drm,
        }
        getContentPartner(contentPartnerData);
        setCheckedItemsContentPartner(contentPartnerData);
        // getContentType(contentTypeData);
        // setCheckedItemsContentType(contentTypeData);
        getLocation(locationData);
        setCheckedItemsLocation(locationData);
        //getDeviceId(deviceIdData);
        // setCheckedItemsDeviceId(deviceIdData);
        // getVideoId(videoIdData);
        // setCheckedItemVideoId(videoIdData);
        //getDrm(drmData);
        //setCheckedItemDrmData(drmData);
        // getHas(hasData);
        // setCheckedItemHasData(hasData);
        getManufacturer(manufacturerData);
        setCheckedItemManufacturerData(manufacturerData);
        // getLive(liveData);
        //setCheckedItemLiveData(liveData);
        getNetwork(networkData);
        setCheckedItemItemNetworkData(networkData);
        setFilterMenu(false);
        savePlatformData(device);
        getBucketName(bucketData)
        setCheckedItemBucketData(bucketData)
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

                        {/* <ListItem>
                            <h3>Device ID</h3>
                            <DeviceIdFilter
                                // listName={Object.keys(listNameDeviceId || {})}
                                deviceIdData={deviceIdData}
                                saveDeviceIdData={saveDeviceIdData}
                            />
                        </ListItem> */}

                        {/* <ListItem>
                            <h3>Video ID</h3>
                            <VideoIdFilter
                                videoIdData ={videoIdData}
                                saveVideoIdData={saveVideoIdData}
                            />
                        </ListItem>


                        <ListItem>
                            <h3>Live </h3>
                            <LiveFilter
                                saveLiveData={saveLiveData}
                                checkedItemLiveData={checkedItemLiveData}
                            />
                        </ListItem> */}


                        {/* <ListItem>
                            <h3>Has </h3>
                            <HasFilter
                                checkedItemHasData={checkedItemHasData}
                                saveHasData={saveHasData}
                            />
                        </ListItem>


                        <ListItem>
                            <h3>Drm </h3>
                            <DrmFilter
                                checkedItemDrmData={checkedItemDrmData}
                                saveDrmData={saveDrmData}
                            />
                        </ListItem> */}
                        {props?.metricname == "Total Anomalies RCA Buckets" &&
                            <>
                                <ListItem>
                                    <h3>Bucket Name </h3>
                                   
                                    <BucketFilter
                                        listBucketName={listBucketName}
                                        saveBucketData={saveBucketData}
                                        checkedItemBucketData={checkedItemBucketData}
                                        clear={false}
                                    />
                                </ListItem>
                                <ListItem>
                                    <h3>Manufacturer </h3>
                                    <ManufacturerFilter
                                        saveManufacturerData={saveManufacturerData}
                                        checkedItemManufacturerData={checkedItemManufacturerData}
                                        clear={false}
                                    />
                                </ListItem>

                                <ListItem>
                                    <h3>Network </h3>
                                    <NetworkFilter
                                        saveNetworkData={saveNetworkData}
                                        checkedItemNetworkData={checkedItemNetworkData}
                                    />
                                </ListItem></>
                        }

                        <ListItem>
                            <h3>Location</h3>
                            <LocationFilter
                                listName={listNameLocation}
                                getLocation={getLocation}
                                saveLocationData={saveLocationData}
                                checkedItemsLocation={checkedItemsLocation}
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
                        Clear
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
