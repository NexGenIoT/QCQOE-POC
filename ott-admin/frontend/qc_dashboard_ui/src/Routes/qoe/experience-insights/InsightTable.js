/*eslint no-mixed-operators: "off"*/
import React from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Box, Tooltip } from "@material-ui/core";

export default function InsightTable(props) {
  const tableData = props.tableData !== undefined ? props.tableData : [];
  const tableHeadData = props.tableHeadData !== undefined ? ['SSO %', 'SSO Error'].concat(props.tableHeadData) : [];
  const selectedMatrics = props.selectedMatrics;
  const throshold = props.throshold;
  // function randomIntFromInterval(min, max) {
  //   return Math.floor(Math.random() * (max - min + 1) + min)
  // }
  const index = tableHeadData.indexOf("Video Plays And Failures");// Total Minutes Watched is not comming in tableData
if (index > -1) { // only splice array when item is found
  tableHeadData.splice(index, 1); // 2nd parameter means remove one item only
}
// const index2 = tableHeadData.indexOf("Concurrent Plays");
// if (index2 > -1) { // only splice array when item is found
//   tableHeadData[index2]="Avg Concurrent Play"; // 2nd parameter means remove one item only
// }

console.log(tableHeadData,"ppp")
function round(num, digits) {
  const lookup = [
     { value: 1, symbol: "" },
     { value: 1e3, symbol: "k" },
     { value: 1e6, symbol: "M" },
     { value: 1e9, symbol: "G" },
     { value: 1e12, symbol: "T" },
     { value: 1e15, symbol: "P" },
     { value: 1e18, symbol: "E" }
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup.slice().reverse().find(function (item) {
     return num >= item.value;
  });
  return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : parseFloat(num).toFixed(digits);
}
  
  return (
    <div className='insightTable'>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              {
                tableHeadData.map((item, index) => (
                  <React.Fragment key={index}>
                    {selectedMatrics === "real_time_key_insights" && <TableCell key={index}>{item}</TableCell>}
                    {selectedMatrics === "user_engagement_metrices" && <TableCell key={index}>{item}</TableCell>}
                    {selectedMatrics === "quality_of_experience" && <TableCell key={index}>{item}</TableCell>}
                  </React.Fragment>
                ))
              }
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.length > 0 && tableData.map((item, index) => (
              <React.Fragment key={index}>
                {selectedMatrics === "real_time_key_insights" ?
                  <TableRow
                    key={item.device_platform}
                    sx={{ '&:last-cselectedld td, &:last-cselectedld th': { border: 0 } }}
                  >
                    <TableCell><Box className={throshold && throshold?.sso_error_percentage?.lower < item.sso_error_percentage && throshold?.sso_error_percentage?.upper > item.sso_error_percentage ? "" : 'selected'}>{Math.floor(parseFloat(item.sso_error_percentage))}</Box></TableCell>
                    <TableCell><Box className={throshold && throshold?.sso_errors_count?.lower < item.sso_errors_count && throshold?.sso_errors_count?.upper > item.sso_errors_count ? "" : 'selected'}>{Math.floor(parseFloat(item.sso_errors_count))}</Box></TableCell>
                    {/* {props?.head?.indexOf('sso_errors_count') >= 0 && <TableCell><Box className={throshold && throshold?.sso_errors_count?.lower < item.sso_errors_count && throshold?.sso_errors_count?.upper > item.sso_errors_count ? "" : 'selected'}>{Math.floor(item.sso_errors_count)}</Box></TableCell>}
                    {props?.head?.indexOf('sso_error_percentage') >= 0 && <TableCell><Box className={throshold && throshold?.sso_error_percentage?.lower < item.sso_error_percentage && throshold?.sso_error_percentage?.upper > item.sso_error_percentage ? "" : 'selected'}>{Math.floor(item.sso_error_percentage)}</Box></TableCell>}
                 */}
                    {props?.head?.indexOf('m_average_bitrate') >= 0 && <TableCell><Box className={throshold && throshold?.m_average_bitrate?.lower < item.m_average_bitrate && throshold?.m_average_bitrate?.upper > item.m_average_bitrate ? "" : 'selected'}>{Math.floor(item.m_average_bitrate)}</Box></TableCell>}
                    {props?.head?.indexOf('m_attempts') >= 0 && <TableCell><Box className={throshold && throshold?.m_play_attempts?.lower < item.m_play_attempts || throshold?.m_play_attempts?.upper > item.m_play_attempts ? "" : 'selected'}>{item.m_play_attempts ? item.m_play_attempts.toFixed(1) : '0.0'}</Box></TableCell>}
                    {props?.head?.indexOf('m_concurrent_plays') >= 0 && <TableCell><Box className={throshold && throshold?.m_concurrent_plays?.lower < item.m_concurrent_plays || throshold?.m_concurrent_plays?.upper > item.m_concurrent_plays ? "" : 'selected'}>{item.m_concurrent_plays ? item.m_concurrent_plays.toFixed(1) : '0.0'}</Box></TableCell>}
                    {props?.head?.indexOf('m_exit_before_video_starts') >= 0 && <TableCell><Box className={throshold && throshold?.m_exit_before_video_starts?.lower < item.m_exit_before_video_starts || throshold?.m_exit_before_video_starts?.upper > item.m_exit_before_video_starts ? "" : 'selected'}>{item.m_exit_before_video_starts ? item.m_exit_before_video_starts.toFixed(1) : '0.0'}</Box></TableCell>}
                    {props?.head?.indexOf('m_rebuffering_percentage') >= 0 && <TableCell><Box className={throshold && throshold?.m_rebuffering_percentage?.lower < item.m_rebuffering_percentage || throshold?.m_rebuffering_percentage?.upper > item.m_rebuffering_percentage ? "" : 'selected'}>{item.m_rebuffering_percentage ? item.m_rebuffering_percentage.toFixed(1) : '0.0'}</Box></TableCell>}
                    {props?.head?.indexOf('m_succesful_plays') >= 0 && <TableCell><Box className={throshold && throshold?.m_succesful_plays?.lower < item.m_succesful_plays || throshold?.m_succesful_plays?.upper > item.m_succesful_plays ? "" : 'selected'}>{item.m_succesful_plays ? item.m_succesful_plays.toFixed(1) : '0.0'}</Box></TableCell>}
                    {props?.head?.indexOf('m_video_playback_failures') >= 0 && <TableCell><Box className={throshold && throshold?.m_video_playback_failures?.lower < item.m_video_playback_failures || throshold?.m_video_playback_failures?.upper > item.m_video_playback_failures ? "" : 'selected'}>{item.m_video_playback_failures ? item.m_video_playback_failures.toFixed(1) : '0.0'}</Box></TableCell>}
                    {props?.head?.indexOf('m_video_start_failures') >= 0 && <TableCell><Box className={throshold && throshold?.m_video_start_failures?.lower < item.m_video_start_failures || throshold?.m_video_start_failures?.upper > item.m_video_start_failures ? "" : 'selected'}>{item.m_video_start_failures ? item.m_video_start_failures.toFixed(1) : '0.0'}</Box></TableCell>}
                    {props?.head?.indexOf('m_connection_induced_rebuffering_ratio') >= 0 && <TableCell><Box className={throshold && throshold?.m_connection_induced_rebuffering_ratio?.lower < item.m_connection_induced_rebuffering_ratio || throshold?.m_connection_induced_rebuffering_ratio?.upper > item.m_connection_induced_rebuffering_ratio ? "" : 'selected'}>{item.m_connection_induced_rebuffering_ratio ? item.m_connection_induced_rebuffering_ratio.toFixed(1) : '0.0'}</Box></TableCell>}
                    {/* <TableCell><Box>{'0.0'}</Box></TableCell> */}
                  </TableRow>
                  : selectedMatrics === "user_engagement_metrices" ?
                    <TableRow
                      key={item.device_platform}
                      sx={{ '&:last-cselectedld td, &:last-cselectedld th': { border: 0 } }}
                    >
                      <TableCell><Box className={throshold && throshold?.sso_error_percentage?.lower < item.sso_error_percentage && throshold?.sso_error_percentage?.upper > item.sso_error_percentage ? "" : 'selected'}>{Math.floor(parseFloat(item.sso_error_percentage))}</Box></TableCell>   
                      <TableCell><Box className={throshold && throshold?.sso_errors_count?.lower < item.sso_errors_count && throshold?.sso_errors_count?.upper > item.sso_errors_count ? "" : 'selected'}>{Math.floor(parseFloat(item.sso_errors_count))}</Box></TableCell>
                      {props?.head?.indexOf('m_total_minutes_watched') >= 0 && <TableCell><Box className={throshold && throshold?.m_total_minutes_watched?.lower < item.m_total_minutes_watched && throshold?.m_total_minutes_watched?.upper > item.m_total_minutes_watched ? "" : 'selected'}>{item.m_total_minutes_watched ? <Tooltip title={item.m_total_minutes_watched}><span>{round(item.m_total_minutes_watched,2)}</span></Tooltip>: '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_average_percentage_completion') >= 0 && <TableCell><Box className={throshold && throshold?.m_average_percentage_completion?.lower < item.m_average_percentage_completion && throshold?.m_average_percentage_completion?.upper > item.m_average_percentage_completion ? "" : 'selected'}>{item.m_average_percentage_completion ? item.m_average_percentage_completion.toFixed(1) : '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_concurrent_plays') >= 0 && <TableCell><Box className={throshold && throshold?.m_concurrent_plays?.lower < item.m_concurrent_plays || throshold?.m_concurrent_plays?.upper > item.m_concurrent_plays ? "" : 'selected'}>{item.m_concurrent_plays ? item.m_concurrent_plays.toFixed(1) : '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_average_bitrate') >= 0 && <TableCell><Box className={throshold && throshold?.m_average_bitrate?.lower < item.m_average_bitrate && throshold?.m_average_bitrate?.upper > item.m_average_bitrate ? "" : 'selected'}>{Math.floor(item.m_average_bitrate)}</Box></TableCell>}
                      {props?.head?.indexOf('m_minutes_per_unique_devices') >= 0 && <TableCell><Box className={throshold && throshold?.m_minutes_per_unique_devices?.lower < item.m_minutes_per_unique_devices && throshold?.m_minutes_per_unique_devices?.upper > item.m_minutes_per_unique_devices ? "" : 'selected'}>{item.m_minutes_per_unique_devices ? item.m_minutes_per_unique_devices.toFixed(1) : '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_attempts') >= 0 && <TableCell><Box className={throshold && throshold?.m_play_attempts?.lower < item.m_play_attempts && throshold?.m_play_attempts?.upper > item.m_play_attempts ? "" : 'selected'}>{item.m_play_attempts ? item.m_play_attempts.toFixed(1) : '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_succesful_plays') >= 0 && <TableCell><Box className={throshold && throshold?.m_succesful_plays?.lower < item.m_succesful_plays && throshold?.m_succesful_plays?.upper > item.m_succesful_plays ? "" : 'selected'}>{item.m_succesful_plays ? item.m_succesful_plays.toFixed(1) : '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_unique_devices') >= 0 && <TableCell><Box className={throshold && throshold?.m_unique_devices?.lower < item.m_unique_devices && throshold?.m_unique_devices?.upper > item.m_unique_devices ? "" : 'selected'}>{item.m_unique_devices ? item.m_unique_devices.toFixed(1) : '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_unique_viewers') >= 0 && <TableCell><Box className={throshold && throshold?.m_unique_viewers?.lower < item.m_unique_viewers && throshold?.m_unique_viewers?.upper > item.m_unique_viewers ? "" : 'selected'}>{item.m_unique_viewers ? item.m_unique_viewers.toFixed(1) : '0.0'}</Box></TableCell>}
                      {props?.head?.indexOf('m_video_playback_failures') >= 0 && <TableCell><Box className={throshold && throshold?.m_video_playback_failures?.lower < item.m_video_playback_failures && throshold?.m_video_playback_failures?.upper > item.m_video_playback_failures ? "" : 'selected'}>{item.m_video_playback_failures ? item.m_video_playback_failures.toFixed(1) : '0.0'}</Box></TableCell>}
                    </TableRow>
                    : selectedMatrics === "quality_of_experience" ?
                      <TableRow
                        key={item.device_platform}
                        sx={{ '&:last-cselectedld td, &:last-cselectedld th': { border: 0 } }}
                      >
                        <TableCell><Box className={throshold && throshold?.sso_error_percentage?.lower < item.sso_error_percentage && throshold?.sso_error_percentage?.upper > item.sso_error_percentage ? "" : 'selected'}>{Math.floor(parseFloat(item.sso_error_percentage))}</Box></TableCell>
                        <TableCell><Box className={throshold && throshold?.sso_errors_count?.lower < item.sso_errors_count && throshold?.sso_errors_count?.upper > item.sso_errors_count ? "" : 'selected'}>{Math.floor(parseFloat(item.sso_errors_count))}</Box></TableCell>
                        {props?.head?.indexOf('m_average_framerate') >= 0 && <TableCell><Box className={throshold && throshold?.m_average_framerate?.lower < item.m_average_framerate && throshold?.m_average_framerate?.upper > item.m_average_framerate ? "" : 'selected'}>{Math.floor(item.m_average_framerate)}</Box></TableCell>}
                        {props?.head?.indexOf('m_bandwidth') >= 0 && <TableCell><Box className={throshold && throshold?.m_bandwidth?.lower < item.m_bandwidth && throshold?.m_bandwidth?.upper > item.m_bandwidth ? "" : 'selected'}>{Math.floor(item.m_bandwidth)}</Box></TableCell>}
                        {props?.head?.indexOf('m_attempts') >= 0 && <TableCell><Box className={throshold && throshold?.m_attempts?.lower < item.m_attempts && throshold?.m_attempts?.upper > item.m_attempts ? "" : 'selected'}>{item.m_attempts ? item.m_attempts.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_ended_plays') >= 0 && <TableCell><Box className={throshold && throshold?.m_ended_plays?.lower < item.m_ended_plays && throshold?.m_ended_plays?.upper > item.m_ended_plays ? "" : 'selected'}>{item.m_ended_plays ? item.m_ended_plays.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_ended_plays_per_unique_devices') >= 0 && <TableCell><Box className={throshold && throshold?.m_ended_plays_per_unique_devices?.lower < item.m_ended_plays_per_unique_devices && throshold?.m_ended_plays_per_unique_devices?.upper > item.m_ended_plays_per_unique_devices ? "" : 'selected'}>{item.m_ended_plays_per_unique_devices ? item.m_ended_plays_per_unique_devices.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_rebuffering_ratio') >= 0 && <TableCell><Box className={throshold && throshold?.m_rebuffering_ratio?.lower < item.m_rebuffering_ratio && throshold?.m_rebuffering_ratio?.upper > item.m_rebuffering_ratio ? "" : 'selected'}>{item.m_rebuffering_ratio ? item.m_rebuffering_ratio.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_user_attrition') >= 0 && <TableCell><Box className={throshold && throshold?.m_user_attrition?.lower < item.m_user_attrition && throshold?.m_user_attrition?.upper > item.m_user_attrition ? "" : 'selected'}>{item.m_user_attrition ? item.m_user_attrition.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_video_playback_failures') >= 0 && <TableCell><Box className={throshold && throshold?.m_video_playback_failures?.lower < item.m_video_playback_failures && throshold?.m_video_playback_failures?.upper > item.m_video_playback_failures ? "" : 'selected'}>{item.m_video_playback_failures ? item.m_video_playback_failures.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_video_start_time') >= 0 && <TableCell><Box className={throshold && throshold?.m_video_start_time?.lower < item.m_video_start_time && throshold?.m_video_start_time?.upper > item.m_video_start_time ? "" : 'selected'}>{item.m_video_start_time ? item.m_video_start_time.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_video_restart_time') >= 0 && <TableCell><Box className={throshold && throshold?.m_video_restart_time?.lower < item.m_video_restart_time && throshold?.m_video_restart_time?.upper > item.m_video_restart_time ? "" : 'selected'}>{item.m_video_restart_time ? item.m_video_restart_time.toFixed(1) : '0.0'}</Box></TableCell>}
                        {props?.head?.indexOf('m_rendering_quality') >= 0 && <TableCell><Box className={throshold && throshold?.m_rendering_quality?.lower < item.m_rendering_quality && throshold?.m_rendering_quality?.upper > item.m_rendering_quality ? "" : 'selected'}>{item.m_rendering_quality ? item.m_rendering_quality.toFixed(1) : '0.0'}</Box></TableCell>}
                      </TableRow>
                      : "real"}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}
