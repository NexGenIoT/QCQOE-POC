
import React, { useEffect, useState } from 'react';
import { TextField, MenuItem, ListItem, Button } from "@material-ui/core";
import MatButton from "@material-ui/core/Button";
import RealTimeSliderContainer from 'Components/SliderContainer/RealTimeSliderContainer';
import UserEngagementSliderContainer from 'Components/SliderContainer/UserEngagementSliderContainer';
import QualityOfExperienceSliderContainer from 'Components/SliderContainer/QualityOfExperienceSliderContainer';
import { clearAllMetrics } from 'Store/Actions';
import { useDispatch, useSelector } from 'react-redux';
import LocationFilter from 'Components/QualityExperience/LocationFilter';
import { getCities } from "Store/Actions";
import { Autocomplete, createFilterOptions } from '@mui/material';
import { Image } from '@material-ui/icons';
import FilterLayout from 'Components/QualityExperience/FilterLayout';

const filter = createFilterOptions();



export default function PartnerDetail(props) {
  const dispatch = useDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearAllMetrics());
    };
  }, [dispatch]);
  const [toDate, setToDate] = useState(Math.floor((new Date()).getTime() / 1000.0));
  const [fromDate, setFromDate] = useState(Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600));
  const [agr, setAgr] = useState('1h');
  const [sortMatrics, setSortMatrics] = useState('all');
  const [listNameLocation, setListNameLocation] = useState([]);
  const [location, setLocation] = useState([]);
  const [contentType, setContentType] = useState([]);
  const [contentPartner, setContentPartner] = useState([]);
  const [devicePlatform, setDevicePlatform] = useState(["dummy"]);
  const [locationData, saveLocationData] = useState([]);
  const [checkedItemsLocation, setCheckedItemsLocation] = useState([]);
  const dataDisplay = useSelector((state) => state.qoeReducer);


  // const cityarray = [];
  // for (var key in dataDisplay?.cities) {
  //   if (dataDisplay?.cities.hasOwnProperty(key)) {
  //     if (dataDisplay?.cities[key] != NaN) {
  //       var nameabcd = dataDisplay?.cities[key].toString();
  //       var nameed = ([] = nameabcd.split(","));
  //       for (let j of nameed) {
  //         //cityarray.push(j+"("+key+")")
  //         cityarray.push(j);
  //       }
  //     }
  //   }
  // }
  const getContentType = (val) => {
    setContentType(val);
  };
  const getContentPartner = (val) => {
    setContentPartner(val);
  };
  const getLocation = (val) => {

   
    let temparray = [];
    val.forEach((element) => {
      temparray.push(element.split("(")[0]);
    });
    setLocation(temparray);
  };
  const savePlatformData = (val) => {
    setDevicePlatform(val);
  };


  useEffect(() => {
    if (dataDisplay?.cities?.length > 0) {
      return null;
    } else {
      dispatch(getCities(dispatch));
    }
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(dataDisplay?.cities)?.length > 0) {
      setListNameLocation(dataDisplay?.cities);
    }
  }, [dataDisplay?.cities]);

  const handleChange = (event) => {
    // setSortMatrics(event.target.value);
    setLocation(event.target.value);
  };

  return (
    <div className="detail-wraper">
      <div className='row'>
        <div className='col-md-3'>
          <h2>{localStorage.getItem('contentPartner')}</h2>
          {/* <Image source={{ uri: 'https://qoe-favorite-screen.s3.amazonaws.com/hungama.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAWZG524Z4CC7IGFSP%2F20220919%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20220919T125850Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=bed94b9d266a573c6351391af78fa8124cd97157614649d802eb054a1b2aba80' }}
            style={{ width: 55, height: 55 }} /> */}
        </div>
        <div className='col-md-9'>
          <div className='monthely-status'>
            <MatButton className={agr === '1h' ? 'Status-btn-active' : ''} onClick={() => {
              setToDate(Math.floor((new Date()).getTime() / 1000.0));
              setFromDate(Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600));
              setAgr('1h');
              setLocation([]);
            }}>24 Hr</MatButton>
            <MatButton className={agr === '1d' ? 'Status-btn-active' : ''} onClick={() => {
              setToDate(Math.floor((new Date()).getTime() / 1000.0));
              setFromDate(Math.floor((new Date()).getTime() / 1000.0) - (7 * 24 * 3600));
              setAgr('1d');
              setLocation([]);
            }}>Weekly</MatButton>
            <MatButton className={agr === '2d' ? 'Status-btn-active' : ''} onClick={() => {
              setToDate(Math.floor((new Date()).getTime() / 1000.0));
              setFromDate(Math.floor((new Date()).getTime() / 1000.0) - (30 * 24 * 3600));
              setAgr('2d');
              setLocation([]);
            }}>Monthly</MatButton>
            <MatButton className={agr === '6d' ? 'Status-btn-active' : ''} onClick={() => {
              setToDate(Math.floor((new Date()).getTime() / 1000.0));
              setFromDate(Math.floor((new Date()).getTime() / 1000.0) - (30 * 3 * 24 * 3600));
              setAgr('6d');
              setLocation([]);
            }} disabled>3 Months</MatButton>
            {/* <TextField
              style={{ width: '20%' }}
              id="outlined-select-currency"
              variant="outlined" fullWidth
              select
              label="Select Location"
              placeholder='Select Location'
              value={location}
              onChange={handleChange}
              className="location-Filter"
            >
              <MenuItem key='all' value='all'>
                All
              </MenuItem>
              {cityarray.map((option, key) => (
                <MenuItem key={option.key} value={option}>
                  {option}
                </MenuItem>
              ))}

            </TextField> */}
             <FilterLayout
                    metric={sortMatrics}
                    getCdn={[]}
                    getContentPartner={getContentPartner}
                    getContentType={getContentType}
                    getLocation={getLocation}
                    savePlatformData={savePlatformData}
                    cdnVal={[]}
                    contentTypeVal={[]}
                    contentPartnetVal={[]}
                    locationVal={[]}
                    devicePlatform={[]}
                    contentPartner={[]}
                    contentType={[]}
                    location={location}
                    updatePlatformData={[]}
                  />
          </div>
        </div>

      </div>
      <RealTimeSliderContainer partnerDetail={true} toDate={toDate} fromDate={fromDate} agr={agr} location={location} />
      <UserEngagementSliderContainer partnerDetail={true} toDate={toDate} fromDate={fromDate} agr={agr} location={location} />
      <QualityOfExperienceSliderContainer partnerDetail={true} toDate={toDate} fromDate={fromDate} agr={agr} location={location} />
    </div>
  );
}
