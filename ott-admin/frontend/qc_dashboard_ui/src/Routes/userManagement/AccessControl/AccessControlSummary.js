import React from "react";
import {
    TableCell,
    TableRow,
    Box,
    Grid,
    Collapse,
} from '@mui/material';
import moment from "moment";
import GlobalProps from "../UserList/GlobalProps";


const AccessControlRowSummary = (props) => {
    const { row, columns, open } = props;

    return <TableRow>
        <TableCell style={{ padding: 0, margin: 0, border: 0 }} colSpan={columns.length + 1}>
            <Collapse in={open} timeout="auto" unmountOnExit>
                 <Box className={'row-details'} padding={2} paddingTop={4} paddingBottom={3} style={{backgroundColor:"#eceef8"}} >
                        <Grid container justifyContent='space-between' spacing={2}>
                          <Grid item container spacing={0} xs={12} className='grid-block-section'>
                            <Grid item xs={3}>
                                <div className='row-summary-title'>Created By</div>
                                <div className='row-summary-value'>{row.createdBy?row.createdBy:""}</div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className='row-summary-title'>Created Date</div>
                                <div className='row-summary-value'>{row.createdDate?`${moment(row.createdDate).format(GlobalProps.dateTimeFormat) !== "Invalid date" && moment(row.createdDate).format(GlobalProps.dateTimeFormat)}`:""}</div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className='row-summary-title'>Modified By</div>
                                <div className='row-summary-value'>{row.modifiedBy?row.modifiedBy:""}</div>
                            </Grid>
                            <Grid item xs={3}>
                                <div className='row-summary-title'>Modified Date</div>
                                <div className='row-summary-value'>{row.modifiedDate?`${moment(row.modifiedDate).format(GlobalProps.dateTimeFormat) !== "Invalid date" && moment(row.modifiedDate).format(GlobalProps.dateTimeFormat)}`:""}</div>
                            </Grid>      
                      </Grid>
                    </Grid>
                </Box>
            </Collapse>
        </TableCell>
    </TableRow>
    }

export default AccessControlRowSummary;