import React from 'react';
import copy from 'copy-to-clipboard';
import { useSelector } from 'react-redux';
import moment from "moment";

import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { NotificationManager } from 'react-notifications';

const QcAnalysisDetaileTable = (props) => {
   const qcAnalyticData = props.qcAnalyticData
   const dataOverview = useSelector(state => state.overviewReducer);
   const dataTable = useSelector(state => state.logReducer);

   var qcDetailData = {}
   qcDetailData = dataTable?.qcdetailed_data

   const clickOnItem = (item, value) => {
      if(value!=="NA"){
         copy(value);
         NotificationManager.success(item)
      }
    
   }
   function createData(QCname, status, date, dashboardurl) {
      return { QCname, status, date, dashboardurl };
    }
    let date ="NA"
    if(qcDetailData?.inserted_date_time!=undefined){
      date =  moment(Math.floor(new Date(qcDetailData?.inserted_date_time!=undefined?qcDetailData?.inserted_date_time:0).getTime())).format("DD/MM/YYYY")
    }
    
    const rows = [
      createData('RPI', qcDetailData?.rpi !=undefined? qcDetailData?.rpi : 'NA', date ? date : 'NA', "NA"),
      createData('Pillar Box', qcDetailData?.pillar_box !=undefined ? qcDetailData?.pillar_box : 'NA', date ? date : 'NA', qcDetailData?.piller_box_url!=undefined && qcDetailData?.piller_box_url[0] ? qcDetailData?.piller_box_url[0] : 'NA'),
      createData('Detailed QC', qcDetailData?.detailed_qc !=undefined ? qcDetailData?.detailed_qc : "NA", date ? date : 'NA',  qcDetailData?.detailed_qc_url!=undefined ? qcDetailData?.detailed_qc_url : 'NA'),
    ];



   const videoError = (title, data) => (
      <>
         {
            data && (
               <div>
                  <h1>{title}</h1>
                  {
                     Object.entries(data).map((key, i) => {
                        if (key[0] === 'black_screen' && key[1].length > 0) {
                           return (
                              <>
                                 <h1>Black Screen</h1>
                                 <div className='error-description'>
                                    {key[0] === 'black_screen' && key[1].length > 0 && key[1].map(data => {
                                       return (
                                          <div className='inner-block'>
                                             {
                                                data.image_name && (
                                                   <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                      <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`} />
                                                   </div>
                                                )
                                             }
                                             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                {
                                                   data.start_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <b>Start Time</b>
                                                         <span>{data.start_time}</span>
                                                      </div>
                                                   )
                                                }
                                                {
                                                   data.end_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <b>End Time</b>
                                                         <span>{data.end_time}</span>
                                                      </div>
                                                   )
                                                }
                                             </div>
                                          </div>
                                       )
                                    })}
                                 </div>
                              </>
                           )
                        }
                        if (key[0] === 'video_freeze' && key[1].length > 0) {
                           return (
                              <>
                                 <h1>Video Freeze</h1>
                                 <div className='error-description'>
                                    {key[0] === 'video_freeze' && key[1].length > 0 && key[1].map(data => {
                                       return (
                                          <div className='inner-block'>
                                             {
                                                data.image_name && (
                                                   <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                      <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`} />
                                                   </div>
                                                )
                                             }
                                             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                {
                                                   data.start_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <b>Start Time</b>
                                                         <span>{data.start_time}</span>
                                                      </div>
                                                   )
                                                }
                                                {
                                                   data.end_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <b>End Time</b>
                                                         <span>{data.end_time}</span>
                                                      </div>
                                                   )
                                                }
                                             </div>
                                          </div>
                                       )
                                    })}
                                 </div>
                              </>
                           )
                        }
                        if (key[0] === 'macro_block' && key[1].length > 0) {
                           return (
                              <>
                                 <h2>Macro Block</h2>
                                 <div className='error-description'>
                                    {key[0] === 'macro_block' && key[1].length > 0 && key[1].map(data => {
                                       return (
                                          <div className='inner-block'>
                                             {
                                                data.image_name && (
                                                   <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                      <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`} />
                                                   </div>
                                                )
                                             }
                                             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                {
                                                   data.start_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <b>Start Time</b>
                                                         <span>{data.start_time}</span>
                                                      </div>
                                                   )
                                                }
                                                {
                                                   data.end_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <b>End Time</b>
                                                         <span>{data.end_time}</span>
                                                      </div>
                                                   )
                                                }
                                             </div>
                                          </div>
                                       )
                                    })}
                                 </div>
                              </>
                           )
                        }
                        if (key[0] === 'policy_violation' && key[1].length > 0) {
                           return (
                              <>
                                 <h1>Policy Voilation</h1>
                                 <div style={{ display: 'flex', flexDirection: 'row', overflowX: 'auto' }}>
                                    {key[0] === 'policy_violation' && key[1].length > 0 && key[1].map(data => {
                                       return (
                                          <div style={{ width: '50%', border: '1px solid black' }}>
                                             {
                                                data.image_name && (
                                                   <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                      <img alt='vendor' src={`${process.env.PUBLIC_URL}/assets/images/img/vendor/${data.image_name}`} />
                                                   </div>
                                                )
                                             }
                                             <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                                                {
                                                   data.start_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <span style={{ fontWeight: 'bold' }}>Start Time</span>
                                                         <span>{data.start_time}</span>
                                                      </div>
                                                   )
                                                }
                                                {
                                                   data.end_time && (
                                                      <div style={{ display: 'flex', flexDirection: 'column', marginBottom: 5, paddingLeft: 5, paddingRight: 10 }}>
                                                         <span style={{ fontWeight: 'bold' }}>End Time</span>
                                                         <span>{data.end_time}</span>
                                                      </div>
                                                   )
                                                }
                                             </div>
                                          </div>
                                       )
                                    })}
                                 </div>
                              </>
                           )
                        }
                        else {
                           return null
                        }
                     })
                  }
               </div>
            )
         }
      </>

   )
   return (
      <>
         {qcDetailData && <>
             <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left">QC System</TableCell>
            <TableCell align="left">Status&nbsp;</TableCell>
            <TableCell align="left">Date&nbsp;</TableCell>
            <TableCell align="left">Dashboard URL&nbsp;</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
             key={row.QCname}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell align="left">{row.QCname}</TableCell>
              <TableCell align="left">{row.status?row.status:'NA'}</TableCell>
              <TableCell align="left">{row.date?row.date:'NA'}</TableCell>
              <TableCell style={{cursor: "pointer"}} className={row.dashboardurl!=='NA'?'copyqc':''} align="left" onClick={()=>clickOnItem(row.QCname +' URL copied',row.dashboardurl)}>{row.dashboardurl?row.dashboardurl:'NA'}</TableCell>
            </TableRow>
             ))}
        </TableBody>
      </Table>
    </TableContainer>


         </>

         }

         {qcAnalyticData && Object.keys(qcAnalyticData).length > 0 && <> <ul style={{ listStyleType: 'none', display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <li style={{ width: '50%', paddingBottom: 20, display: 'flex', flexDirection: 'row' }}>
               <p style={{ width: '50%' }}>QC Status</p>
               <b style={{ width: '50%', textAlign: 'left' }}>{qcAnalyticData?.qcStatus ? qcAnalyticData?.qcStatus : 'Not Done'}</b>
            </li>
            <li style={{ width: '50%', paddingBottom: 20, display: 'flex', flexDirection: 'row' }}>
               <p style={{ width: '50%' }}>Audio Type Errors</p>
               <b style={{ width: '50%', textAlign: 'left' }}>{qcAnalyticData?.audio_type_errors}</b>
            </li>
            <li style={{ width: '50%', paddingBottom: 20, display: 'flex', flexDirection: 'row' }}>
               <p style={{ width: '50%' }}>Video Type Errors</p>
               <b style={{ width: '50%', textAlign: 'left' }}>{qcAnalyticData?.video_type_errors}</b>
            </li>
         </ul>
            <div className='error-detail'>  {videoError("Video Errors", qcAnalyticData?.video_errors)}</div>
            <div className='error-detail'>  {videoError("Audio Errors", qcAnalyticData?.audio_errors)} </div>
         </>
         }
      </>
   )

}

export default QcAnalysisDetaileTable;