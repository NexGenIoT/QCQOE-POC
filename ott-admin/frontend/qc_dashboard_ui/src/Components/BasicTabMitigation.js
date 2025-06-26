import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Grid from '@material-ui/core/Grid'
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { useDispatch, useSelector } from "react-redux";
import { getCities, setTabValueMitigation } from 'Store/Actions';
import Analytics from "./MitigationSummaryDashboard/Analytics";
import MitigationDashboard from "./MitigationSummaryDashboard/MitigationDashboard";
import { FormControlLabel, Typography } from "@material-ui/core";
import Switch from "react-switch";
import AnnualMitigation from "Components/MitigationSummaryDashboard/AnnualMitigation";
import MatButton from "@material-ui/core/Button";
import Modal from '@mui/material/Modal';
import { isValidPermission } from "Constants/constant";

function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <>
                    {children}
                </>
            )}
        </div>
    );
}
TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};
function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function SimpleTabsMitigation() {
    const stylee = {
        color: 'white',
        background: '#1992fb',
        width: '83px',
        height: '28px',
        fontSize: '1rem',
        fontWeigth: '100',
    }
    const data = useSelector(state => state.qoeReducer);
    const dispatch = useDispatch()
    const [open, setOpen] = useState(false);
    useEffect(()=>{
        console.log("abcd--2--",localStorage.getItem('newValue'));
        if(localStorage.getItem('newValue')){
            dispatch(setTabValueMitigation(Number(localStorage.getItem('newValue'))))

        }

        if(data?.cities?.length > 0){
            return null
        }else{
            dispatch(getCities(dispatch))
        }
    }, [dispatch])
    const handleChange = (event, newValue) => {
        localStorage.setItem("newValue",newValue)
        dispatch(setTabValueMitigation(newValue))
    };
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    // const enableDisableMitigation = () => {
    //     dispatch(toggleMitigation(data?.mitigationStatus, dispatch, () => {
    //         setOpen(false)
    //     }))
    // }
    const manualStyle = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      }
    return (
        <>
            <div className="mitigation-summary  full-table ecom-dashboard-wrapper fixed-pagination">
                <Box
                    className="insightTabs"
                    style={{ marginBottom: "0px", background: "transparent" }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={6} md={4} className="tab-heading">
                            <Box
                                style={{
                                    background: "transparent",
                                    paddingBottom: "2px",
                                    marginBottom: "0px",
                                }}
                            >
                                <Tabs
                                    onChange={handleChange}
                                    value={data?.tabValueMitigation}
                                    className="tabs"
                                    style={{ alignItems: "start" }}
                                >
                                    <Tab  disabled={!isValidPermission("READ_MITIGATION")} label="MITIGATION" {...a11yProps(0)} />
                                    <Tab disabled={!isValidPermission("READ_ANALYTICS")} label="ANALYTICS" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                        </Grid>
                        {
                            data?.tabValueMitigation === 0 && (
                                <>
                                    {/* <Grid item xs={5} md={5} style={{ textAlign: 'end' }} className="switch-label">
                                        <FormControlLabel
                                            label="AUTO MITIGATION"
                                            labelPlacement="start"
                                            onChange={handleOpen}
                                            control={<Switch onColor="#E10092" onChange={handleOpen} uncheckedIcon={false}
                                                checkedIcon={false} checked={data?.mitigationStatus === 'on' ? true : false} />}
                                        />
                                    </Grid> */}
                                    <Grid item xs={8} md={8} style={{ textAlign: 'start', paddingTop: '9px' }}>
                                        <AnnualMitigation />
                                    </Grid>
                                </>
                            )
                        }
                    </Grid>
                </Box>
                <TabPanel value={data?.tabValueMitigation} index={0}>
                    <MitigationDashboard />
                </TabPanel>
                <TabPanel value={data?.tabValueMitigation} index={1}>
                    <Analytics />
                </TabPanel>
                {/* <Modal onClose={handleClose} open={open}>
                    <Box sx={manualStyle}>
                        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                            {
                                data?.mitigationStatus === 'on' ? 'Are you sure you want to disable auto migitation ?' : 'Are you sure you want to enable auto migitation ?'
                            }
                            
                        </Typography>
                        <div style={{ float: 'right', marginTop: '10px' }}>
                            <MatButton
                                onClick={() => setOpen(false)}
                                className="Status-btn"
                                style={{ fontSize: "1rem", color: "#008eff", width: '83px', height: '28px', fontWeight: '100' }}>
                                {"No"}
                            </MatButton>
                            <MatButton
                                onClick={enableDisableMitigation}
                                style={stylee} >
                                {"Yes"}
                            </MatButton>
                        </div>
                    </Box>
                </Modal> */}
            </div>
        </>
    );
}
