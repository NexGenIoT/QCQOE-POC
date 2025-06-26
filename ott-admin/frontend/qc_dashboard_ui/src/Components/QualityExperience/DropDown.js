import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));

export default function DropDown(props) {
  const {succesfullPlaysData, exitBeforeVideoStartsData, videoStartFailuresData, attemptsData, metric, selectVal, chromeDataPoints, iosDataPoints, androidDataPoints, tvDataPoints, firestickDataPoints, devicePlatform, startDate, endDate, androidDataReport,iosDataReport,firestickDataReport,webDataReport,totalDataReport,androidSmartTvReport} = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  let iosTotal = iosDataReport//iosDataPoints ? iosDataPoints : '0.00'
  let androidTotal =androidDataReport// androidDataPoints ? androidDataPoints : '0.00'
  let chromeTotal = webDataReport//chromeDataPoints ? chromeDataPoints : '0.00'
  let tvTotal = tvDataPoints ? tvDataPoints: '0.00'
  let firestickTotal = firestickDataReport//firestickDataPoints ? firestickDataPoints[0] : '0.00'
  let androidSmartTvTotal = androidSmartTvReport//firestickDataPoints ? firestickDataPoints[0] : '0.00'
  let totalReport = totalDataReport
  let succesfullPlaysDataTotal = succesfullPlaysData ? succesfullPlaysData : '0.00'
  let exitBeforeVideoStartsDataTotal = exitBeforeVideoStartsData ? exitBeforeVideoStartsData : '0.00'
  let videoStartFailuresDataTotal = videoStartFailuresData ? videoStartFailuresData : '0.00'
  let attemptsDataTotal = attemptsData ? attemptsData: '0.00'
  return (
    <div className='wrap-dropdown'>
      <Button
        id="demo-customized-button"
        aria-controls={open ? 'demo-customized-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        variant="contained"
        disableElevation
        onClick={metric !== 'video_plays_and_failures' ? handleClick : ()=>{}}
        endIcon={metric !== 'video_plays_and_failures' ? <KeyboardArrowDownIcon /> : null}
      >
        {
         metric !=undefined && metric === "video_plays_and_failures" ?
          <b>{Number(succesfullPlaysDataTotal + exitBeforeVideoStartsDataTotal + videoStartFailuresDataTotal + attemptsDataTotal) ? Number(succesfullPlaysDataTotal + exitBeforeVideoStartsDataTotal + videoStartFailuresDataTotal + attemptsDataTotal).toFixed(2) : '0.00'}</b> :
          metric !=undefined && (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && iosDataPoints && iosDataPoints.length > 0 && androidDataPoints && androidDataPoints.length > 0 && chromeDataPoints && chromeDataPoints.length > 0 && firestickDataPoints && firestickDataPoints.length > 0 && tvDataPoints && tvDataPoints.length > 0 ?
          <b>{Number(totalReport) ? Number(totalReport).toFixed(2) : '0.00'}</b> :
          <b>{Number(totalReport) ? Number(totalReport).toFixed(2) : '0.00'}</b>
        }
        
        <p>Total Report in {startDate && endDate ? 'Custom Date' : selectVal}</p>
      </Button>
      <StyledMenu
        id="demo-customized-menu" className="fixed-width"
        MenuListProps={{
          'aria-labelledby': 'demo-customized-button',
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {
          devicePlatform?.includes('iOS') && (
            <MenuItem onClick={handleClose} disableRipple className='list'>
              {
                // (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && iosDataPoints && iosDataPoints.length > 0 ?
                // <b>{iosTotal ? Number(iosTotal/iosDataPoints.length).toFixed(2) : '0.00'}</b> :
                // <b>{iosTotal ? Number(iosTotal).toFixed(2) : '0.00'}</b>
                // (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && iosDataPoints && iosDataPoints.length > 0 ?
                // <b>{iosTotal ? Number(iosTotal).toFixed(2) : '0.00'}</b> :
                <b>{iosTotal ? Number(iosTotal).toFixed(2) : '0.00'}</b>
              }
              <p>iOS</p>
            </MenuItem>
          )
        }
        {
          devicePlatform?.includes("Android") && (
            <MenuItem onClick={handleClose} disableRipple className='list'>
              {
                // (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && androidDataPoints && androidDataPoints.length > 0 ?
                // <b>{androidTotal ? Number(androidTotal).toFixed(2) : '0.00'}</b> :
                <b>{androidTotal ? Number(androidTotal).toFixed(2) : '0.00'}</b>
              }
              <p> Android</p>
            </MenuItem>
          )
        }
        {
          devicePlatform?.includes("Web") && (
            <MenuItem onClick={handleClose} disableRipple className='list'>
              {
                // (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && chromeDataPoints && chromeDataPoints.length > 0 ?
                // <b>{chromeTotal ? Number(chromeTotal).toFixed(2) : '0.00'}</b> :
                <b>{chromeTotal ? Number(chromeTotal).toFixed(2) : '0.00'}</b>
              }
              <p> Web </p>
            </MenuItem>
          )
        }
        {/* {
          devicePlatform?.includes("Tv") && (
            <MenuItem onClick={handleClose} disableRipple className='list'>
              {
                (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && tvDataPoints && tvDataPoints.length > 0 ?
                <b>{tvTotal ? Number(tvTotal/tvDataPoints.length).toFixed(2) : '0.00'}</b> :
                <b>{tvTotal ? Number(tvTotal).toFixed(2) : '0.00'}</b>
              }
              <p> Tv </p>
            </MenuItem>
          )
        } */}
        {
          devicePlatform?.includes("Firestick") && (
            <MenuItem onClick={handleClose} disableRipple className='list'>
              {
                // (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && firestickDataPoints && firestickDataPoints.length > 0 ?
                // <b>{firestickTotal ? Number(firestickTotal).toFixed(2) : '0.00'}</b> :
                <b>{firestickTotal ? Number(firestickTotal).toFixed(2) : '0.00'}</b>
              }
              <p> Firestick </p>
            </MenuItem>
          )
        }
         {
          devicePlatform?.includes("AndroidSmartTv") && (
            <MenuItem onClick={handleClose} disableRipple className='list'>
              {
                // (metric.includes("average") || metric === 'video_start_time' || metric === 'video_restart_time') && chromeDataPoints && chromeDataPoints.length > 0 ?
                // <b>{chromeTotal ? Number(chromeTotal).toFixed(2) : '0.00'}</b> :
                <b>{androidSmartTvTotal ? Number(androidSmartTvTotal).toFixed(2) : '0.00'}</b>
              }
              <p> AndroidSmartTv </p>
            </MenuItem>
          )
        }
      </StyledMenu>
    </div>
  );
}
