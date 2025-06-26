import * as React from 'react';
import ListItemIcon from '@mui/material/ListItemIcon';
import StarIcon from '@mui/icons-material/Star';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import './styles/Metrics.css'
import { markMetricAsFavorite, getFavoriteMetrics } from 'Store/Actions';
import { useDispatch } from 'react-redux';

export default function LeftMenu(props) {
  const dispatch = useDispatch()
  const {
    updateMetric,
    leftMenuMetrics,
    favorite,
    updateMetricHeader,
    updateParentMetric,
    toggleDateRange,
  } = props;


  const findMetricAttributeName = (metricName) => {
    switch (metricName) {
      case "Average Bitrate":
        return "average_bitrate";
      case "Connection Induced Re-buffering - CIRR (%)":
        return "connection_induced_rebuffering";
      case "Play Attempts":
        return "play_attempts";
      case "Video plays and failures":
        return "video_play_failures";
      case "Exit Before Video Starts":
        return "exit_before_video_starts";
      case "Video start Failures":
        return "video_start_failures";
      case "Video Playback Failures":
        return "video_playback_failures";
      case "Video Restart Time (VRT)":
        return "video_restart_time";
      case "Ended Plays":
        return "ended_plays";
      case "Max Concurrent Plays":
        return "concurrent_plays";
      case "Attempts":
        return "attempts";
      case "Plays":
        return "plays";
      case "Total Minutes Watched":
        return "total_minutes_watched";
      case "Unique Devices":
        return "unique_devices";
      case "Unique Viewers":
        return "unique_viewers";
      case "Minutes Per Unique Devices":
        return "minutes_per_unique_devices";
      case "Average Percent Completion":
        return "average_percent_completion";
      case "Ended Plays Per Unique Devices":
        return "ended_plays_per_unique_devices";
      case "Video Startup Time (VST)":
        return "video_startup_time";
      case "Rebuffering Ratio":
        return "rebuffering_ratio";
      case "Average Framerate":
        return "average_framerate";
      case "Rendering Quality":
        return "rendering_quality";
      case "Bandwidth":
        return "bandwidth";
      case "Rebuffering Percentage":
        return "rebuffering_percentage";
      case "User Attrition":
        return "user_attrition";
      case "Successful Plays":
        return "succesful_plays";
      case "Average Percentage Completion":
        return "average_percentage_completion";
      case "Video Start Time":
        return "video_start_time";
      case "Video Restart Time":
        return "video_restart_time";
      case "Video Plays And Failures":
        return "video_plays_and_failures";
      case "Connection Induced Rebuffering Ratio":
        return "connection_induced_rebuffering_ratio";
      case "Number of Mitigation Applied":
        return "number_of_mitigations_applied";
      case "Improvement in UEI":
        return "improvement_in_uei";
      case "Degradation in UEI":
        return "degradation_in_uei";
      case "Average Startup Buffer Length":
        return "average_startup_buffer_length";
      case "Average Rebuffering Buffer Length":
        return "average_rebuffering_buffer_length";
      case "Average Video Start Time":
        return "video_start_time";
      case "Average Video Restart Time":
        return "video_restart_time";
      case "Average Rendering Quality":
        return "rendering_quality";
      default:
        return "";
    }
  };
  const fetchMetricData = (e) => {
    console.log("fetchMetricData---",e.target.value);
    let attributeName = findMetricAttributeName(e.target.value);
    updateMetric(attributeName);
    updateMetricHeader(e.target.value)
  };
  // const addToFavorite = (value) => {
  //   const isFav = favorite.find((f) => f === value);
  //   let favInfo;
  //   if (isFav) {
  //     favInfo = favorite.filter((f) => f !== value);
  //   } else {
  //     favInfo = favorite.concat(value);
  //   }
  //   dispatch(
  //     markMetricAsFavorite(favInfo, () => {
  //       updateParentMetric(favInfo);
  //       dispatch(getFavoriteMetrics(dispatch));
  //     })
  //   );
  // };
  return (
    <MenuList dense className='menu-one'>
      {leftMenuMetrics &&
        leftMenuMetrics.length > 0 &&
        leftMenuMetrics.map((value, index) => {
          return (
            <MenuItem key={index}>
              <ListItemIcon>
                {/* <StarIcon style={{ color: favorite && favorite.indexOf(value) >=0 ? "#FFD700" : null }}/> */}
                <StarIcon
                  style={{
                    color:
                      favorite != null &&
                      favorite?.indexOf(value) >= 0
                        ? "#FFD700"
                        : null,
                  }}
                />
              </ListItemIcon>
              <Button
                variant='text'
                disableTouchRipple
                className='left-menu-options'
                onClick={fetchMetricData}
                value={value}
              >
                {value}
              </Button>
            </MenuItem>
          );
        })}
    </MenuList>
  );
}
