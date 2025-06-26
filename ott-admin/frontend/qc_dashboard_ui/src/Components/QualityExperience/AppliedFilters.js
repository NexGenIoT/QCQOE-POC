import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import RefreshOutlinedIcon from '@mui/icons-material/RefreshOutlined';
import { Tooltip } from '@material-ui/core';
import DropDown from 'Components/QualityExperience/DropDown';

export default function AppliedFilters(props) {
  const {
    succesfullPlaysData = [],
    exitBeforeVideoStartsData,
    videoStartFailuresData,
    attemptsData,
    startDate,
    endDate,
    removeDevicePlatform,
    devicePlatform,
    androidDataPoints,
    iosDataPoints,
    chromeDataPoints,
    tvDataPoints,
    firestickDataPoints,
    handleReload,
    selectVal,
    contentPartner = [],
    location = [],
    contentType,
    removeContentPartner,
    removeContentType,
    removeLocation,
    removeErrorCode,
    errorCode,
    iOSErrorCount,
    androidErrorCount,
    webErrorCount,
    firestickCount,
    metric = [],
    totalErrorCount,
    androidDataReport,
    iosDataReport,
    firestickDataReport,
    webDataReport,
    totalDataReport,
    sourceData,
    removeSource,
    androidSmartTvReport,
    androidSmartTvDataPoints
  } = props;

   
  const handleDelete = (e) => {
    if (e === "clearAll") {
      removeDevicePlatform([])
      removeLocation([])
      removeSource([])
      if(errorCode){
        removeErrorCode([])
      }
  
    }
    else {
      removeDevicePlatform(e)
    }
  };

  return (
    <>
      <Stack direction="row" spacing={1} className="appliedFilter">
        <div>
          <span>Filters Applied:</span>
          {
            <>
              {
                metric !== 'video_plays_and_failures' && (
                  <>
                    {
                      devicePlatform?.length > 0 && devicePlatform?.map((d, i) => {
                        return (
                          <Button
                            key={i}
                            className="Status-btn"
                            value="web"
                            onClick={() => handleDelete(d)}
                            size="small"
                            endIcon={<CloseOutlinedIcon onClick={() => handleDelete(d)} />}>{d}</Button>
                        )

                      })
                    }
                  </>
                )
              }
            </>
          }
          {contentPartner.length === 0 && localStorage.getItem('contentPartner') && (
            <Button
              className="Status-btn"
              size="small"
              endIcon={<CloseOutlinedIcon onClick={() => {
                removeContentPartner(localStorage.getItem('contentPartner'))
                localStorage.removeItem('contentPartner')
              }} />}
            >
              {localStorage.getItem('contentPartner')}
            </Button>
          )}
          {
            contentPartner.length > 0 && (
              <>
                {
                  contentPartner.map((c, i) => {
                    return (
                      <Button
                        key={i}
                        className="Status-btn"
                        size="small"
                        endIcon={<CloseOutlinedIcon onClick={() => {
                          c === localStorage.getItem('contentPartner') && localStorage.removeItem('contentPartner')
                          removeContentPartner(c)
                        }} />
                        }
                      >
                        {c}
                      </Button>
                    )
                  })
                }
              </>
            )
          }
          {
            contentType.length > 0 && (
              <>
                {
                  contentType.map((c, i) => {
                    return (
                      <Button
                        key={i}
                        className="Status-btn"
                        size="small"
                        endIcon={<CloseOutlinedIcon onClick={() => removeContentType(c)} />}
                      >
                        {c}
                      </Button>
                    )
                  })
                }
              </>
            )
          }
          {
            sourceData?.length > 0 && (
              <>
                {
                  sourceData?.map((c, i) => {
                    return (
                      <Button
                        key={i}
                        className="Status-btn"
                        size="small"
                        endIcon={<CloseOutlinedIcon onClick={() => removeSource(c)} />}
                      >
                        {c}
                      </Button>
                    )
                  })
                }
              </>
            )
          }

          {
            location?.length > 0 && (
              <>
                {
                  location?.map((c, i) => {
                    return (
                      <Button
                        key={i}
                        className="Status-btn"
                        size="small"
                        endIcon={<CloseOutlinedIcon onClick={() => removeLocation(c)} />}
                      >
                        {c}
                      </Button>
                    )
                  })
                }
              </>
            )
          }
          {
            errorCode && errorCode.length > 0 && (
              <>
                {
                  errorCode.map((item, index) => {
                    return (
                      <Button
                        key={index}
                        className="Status-btn"
                        size='small'
                        endIcon={<CloseOutlinedIcon onClick={() => removeErrorCode(item)} />}
                      >
                        {item}
                      </Button>
                    )
                  })
                }
              </>
            )
          }
          {devicePlatform.length === 0 && contentPartner.length === 0 && contentType.length === 0 && location.length === 0 ? null : <Button className='btnclear' color="primary" size="small" onClick={() => handleDelete('clearAll')} value="clearAll">Clear All</Button>}
        </div>
        <div className='FilterContainer flex-display'>
          <Button className='btnReload' size="small" endIcon={<Tooltip title="Reload this page" arrow><RefreshOutlinedIcon /></Tooltip>} onClick={handleReload} />
          {devicePlatform.length > 0 && <DropDown
            succesfullPlaysData={succesfullPlaysData}
            exitBeforeVideoStartsData={exitBeforeVideoStartsData}
            videoStartFailuresData={videoStartFailuresData}
            attemptsData={attemptsData}
            startDate={startDate}
            endDate={endDate}
            metric={metric}
            devicePlatform={devicePlatform}
            chromeDataPoints={chromeDataPoints}
            tvDataPoints={tvDataPoints}
            firestickDataPoints={firestickDataPoints}
            androidSmartTvDataPoints={androidSmartTvDataPoints}
            iosDataPoints={iosDataPoints}
            selectVal={selectVal}
            androidDataPoints={androidDataPoints}
            androidDataReport={androidDataReport}
            iosDataReport={iosDataReport}
            firestickDataReport={firestickDataReport}
            webDataReport={webDataReport}
            totalDataReport={totalDataReport}
            androidSmartTvReport={androidSmartTvReport}
          />
          }
        </div>
      </Stack>
    </>
  );
}

