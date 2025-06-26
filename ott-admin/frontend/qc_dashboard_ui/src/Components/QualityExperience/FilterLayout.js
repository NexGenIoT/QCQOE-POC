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
import { getCities } from "Store/Actions";
import Drawer from "@material-ui/core/Drawer";
import { useDispatch, useSelector } from "react-redux";
import ErrorFilter from "./ErrorFilter";
import DeviceIdFilter from "./DeviceIdFilter";
import VideoIdFilter from "./VideoIdFilter";
import LiveFilter from "./LiveFilter";
import HasFilter from "./HasFilter";
import DrmFilter from "./DrmFilter";
import NetworkFilter from "./NetworkFIlter";
import ManufacturerFilter from "./ManufacturerFilter";
import SourceFilter from "Components/MitigationSummaryDashboard/SourceFilter";

export default function FilterLayout(props) {
  const dispatch = useDispatch();
  const dataDisplay = useSelector((state) => state.qoeReducer);

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
    getContentType,
    getLocation,
    getErrorCode,
    savePlatformData,
    contentPartner,
    contentType,
    location = [],
    devicePlatform = [],
    errorCode = [],
    metric = [],
    getSourceData,
    sourceData = [],
    } = props;
  // const listNameCdn = ["cdn1", "cdn2", "cdn3", "cdn4", "Akamai"]
  const listNameType = ["Web_Shorts", "Movies", "TV_Shows"];
  const [listNameLocation, setListNameLocation] = useState([]);
  const [listNamePartner, setlistNamePartner] = useState([]);
  const [listNameErrorCode, setListNameErrorCode] = useState([]);
  const [mobileMenu, setFilterMenu] = useState(false);
  // const [cdnData, saveCdnData] = useState([]);
  const [contentPartnerData, saveContentPartnerData] = useState([]);
  const [contentTypeData, saveContentTypeData] = useState([]);
  const [locationData, saveLocationData] = useState([]);
  const [errorCodeData, saveErrorCodeData] = useState([]);
  // const [checkedItemsCdn, setCheckedItemsCdn] = useState([]);
  const [checkedItemsContentPartner, setCheckedItemsContentPartner] = useState(
    []
  );
  const [checkedItemsContentType, setCheckedItemsContentType] = useState([]);
  const [checkedItemsLocation, setCheckedItemsLocation] = useState([]);
  const [checkedItemsErrorCode, setCheckedItemsErrorCode] = useState([]);
  const [device, setDevice] = useState(devicePlatform);
// checkedSourceData, saveSourceData
const [checkedSourceData, setCheckedSourceData] = useState([]);
const [sourceDataa, saveSourceData] = useState([]);

  useEffect(() => {
    setDevice(devicePlatform);
  }, [devicePlatform]);

  useEffect(() => {
    setCheckedItemsContentPartner(contentPartner);
    saveContentPartnerData(contentPartner);
  }, [contentPartner]);

  useEffect(() => {
    setCheckedItemsContentType(contentType);
    saveContentTypeData(contentType);
  }, [contentType]);

  useEffect(() => {
    let temparray = [];
    location.forEach((element) => {
      temparray.push(element);
    });
    setCheckedItemsLocation(temparray);
    saveLocationData(temparray);
  }, [location]);

  useEffect(() => {
    // console.log({listNameErrorCode},"error code")
    setCheckedItemsErrorCode(errorCode);
    saveErrorCodeData(errorCode);
  }, [errorCode !== []]);

  useEffect(() => {
    if(sourceData.length>0){
      setCheckedSourceData(sourceData);
      saveSourceData(sourceData);
    }
}, [sourceData])

  useEffect(() => {
    if (dataDisplay?.filters?.error_codes) {
      setListNameErrorCode(dataDisplay?.filters?.error_codes);
      console.log({ first: dataDisplay?.filters?.error_code, str: 'from error' })
    }
  }, [dataDisplay?.filters?.error_codes]);

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

  const applyFilters = () => {
    // getCdn(cdnData);
    // setCheckedItemsCdn(cdnData);
    getContentPartner(contentPartnerData);
    setCheckedItemsContentPartner(contentPartnerData);
    getContentType(contentTypeData);
    setCheckedItemsContentType(contentTypeData);
    getLocation(locationData);
    setCheckedItemsLocation(locationData);
    getSourceData(sourceDataa)
    setFilterMenu(false);
    savePlatformData(device);
    setCheckedSourceData(sourceDataa);
    if (errorCode !== [] && window.location.href.includes("error-screen")) {
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
            {metric !== "video_plays_and_failures" && (
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
            )}

            {/* <ListItem>
              <h3>CDN</h3>
              <CdnFilter listName={listNameCdn} getCdn={getCdn} saveCdnData={saveCdnData}
                checkedItemsCdn={checkedItemsCdn} />
            </ListItem> */}
            {window.location.href.includes("mitigation") ? null : (
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
            )}
            {window.location.href.includes("mitigation") ? null : (
              <ListItem>
                <h3>Content Type</h3>
                <ContentTypeFilter
                  listName={listNameType}
                  getContentType={getContentType}
                  saveContentTypeData={saveContentTypeData}
                  checkedItemsContentType={checkedItemsContentType}
                />
              </ListItem>
            )}
            
            <ListItem>
              <h3>Source</h3>
              <SourceFilter
                saveSourceData={saveSourceData}
                checkedSourceData={checkedSourceData}
                getSourceData={getSourceData}
                clear={false}
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


            {
              !window.location.href.includes("error-screen") ? null : (
                <ListItem>
                  <h3>Error codes</h3>
                  <ErrorFilter
                    listName={Object.keys(listNameErrorCode || {})}
                    getErrorCode={getErrorCode}
                    saveErrorCodeData={saveErrorCodeData}
                    checkedItemsErrorCode={checkedItemsErrorCode}
                  />
                </ListItem>
              )
            }
          </List>
        </div>
        <div className='rightSidebar'>
          <Button
            variant='contained'
            size='small'
            className='btnApply'
            onClick={applyFilters}
          >
            Apply
          </Button>
        </div>
      </Drawer>
    </div>
  );
}
