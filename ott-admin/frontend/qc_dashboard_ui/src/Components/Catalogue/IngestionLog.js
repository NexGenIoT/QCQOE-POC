import MUIDataTable from "mui-datatables";
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getContentTypes, getIngestionLogData, getPartnerDetails, getUniqueFilters } from "Store/Actions";
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import { Table, TableContainer, TableRow, TableCell, Tooltip, TableHead, TablePagination } from '@mui/material';
import { Box, Collapse, Paper, Drawer, FormControl, Grid, IconButton, ListItem, MenuItem, Select, Typography, List, CircularProgress } from "@material-ui/core";
import { Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';

import MatButton from "@material-ui/core/Button";
import { DateRange } from "react-date-range";
import TextField from '@mui/material/TextField';
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import moment from "moment";
import Button from '@mui/material/Button';
import { Close } from "@material-ui/icons";
import ContentPartnerFilter from "Components/QualityExperience/ContentPartnerFilter";
import ContentTypeFilter from "Components/QualityExperience/ContentTypeFilter";
import ContentCatalogueFilter from "./ContentCatalogueFilter";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import domtoimage from "dom-to-image";
import { createFileName } from "use-react-screenshot";
import exportFromJSON from "export-from-json";



const IngestionLog = () => {


    const dataTable = useSelector(state => state.logReducer);
    const dataOverview = useSelector(state => state.overviewReducer);
    const dataDisplay = useSelector((state) => state.qoeReducer);
    const dispatch = useDispatch()
    const [IngestionLogData, setIngestionLogAllData] = useState([]);
    const [colOrder, setColOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7])
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [filterList, setFilterList] = useState([])
    const [downloadLoader, setDownloadLoader] = useState(true);
    const [btn, setBtn] = useState('24hr')
    const [mobileMenu, setMobileMenu] = useState(false);
    const [fromDate, setFromDate] = useState(Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600))

    const [range, setRange] = useState([
        {
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
        },
    ]);
    const [openModal, setModalOpen] = useState(false);
    const [startDate, setStartDate] = useState();
    const [endDate, setEndDate] = useState();


    const [rights, setRights] = useState(false);
    const [listNamePartner, setlistNamePartner] = useState([]);
    const [contentPartnerData, saveContentPartnerData] = useState([]);
    const [contentTypeData, saveContentTypeData] = useState([]);
    const [checkedItemsContentPartner, setCheckedItemsContentPartner] = useState(
        []
    );
    const [checkedItemsContentType, setCheckedItemsContentType] = useState([]);
    const [contentPartner, setContentPartner] = useState([]);
    const [contentType, setContentType] = useState([]);


    useEffect(() => {
        setDownloadLoader(true);
        let toDate = Math.floor((new Date()).getTime() / 1000.0);
        dispatch(getIngestionLogData("", "", fromDate, toDate, dispatch));
        setTimeout(() => {
            setDownloadLoader(false);
        }, 6000)
    }, [fromDate, dispatch])

    useEffect(() => {
        const isEmpty = dataOverview?.partnerInfo.length === 0;
        if (isEmpty) {
            dispatch(getContentTypes(dispatch))
            dispatch(getPartnerDetails(dispatch))
        }
    }, [dispatch]);

    useEffect(() => {
        // setDownloadLoader(true);
        let tempArray = []
        let obj = {}
        setIngestionLogAllData(tempArray)
        // setDownloadLoader(false);
    }, [dataTable?.Ingestion_log_data])

    useEffect(() => {
        console.log("abcd---", dataOverview?.partnerInfo)
        if (dataOverview?.partnerInfo?.length > 0) {
            console.log({ dataDisplay })
            let partnername = []
            dataOverview?.partnerInfo.map(res => {
                partnername.push(res.name)
            })
            setlistNamePartner(partnername);
        }
    }, [dataOverview?.partnerInfo]);

    useEffect(() => {
        if (dataOverview?.contentTypes?.length > 0) {
            let partnertype = []
            dataOverview?.contentTypes.map(res => {
                partnertype.push(res.name)
            })
            setContentType(partnertype)

            // setCheckedItemsContentType(partnertype);
            // saveContentTypeData(partnertype);
        }
    }, [dataOverview?.contentTypes]);

    useEffect(() => {
        setCheckedItemsContentPartner(contentPartner);
        saveContentPartnerData(contentPartner);
    }, [contentPartner]);

    const toggleDrawer = (side, open) => {
        side(open)
    };
    const applyFilters = () => {


        setStartDate(range[0].startDate);
        setEndDate(range[0].endDate);
        dispatch(getIngestionLogData(contentPartnerData, contentTypeData, Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), dispatch))



        setDownloadLoader(true);

        setCheckedItemsContentPartner(contentPartnerData);
        setCheckedItemsContentType(contentTypeData);
        toggleDrawer(setRights, false);
        let toDate = endDate ? Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0) : Math.floor((new Date()).getTime() / 1000.0);
        let fromdate = startDate ? Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0) : fromDate;


        // if (contentPartnerData.length > 0 || contentTypeData.length > 0) {
        dispatch(getIngestionLogData(contentPartnerData, contentTypeData, fromdate, toDate, dispatch))
        setTimeout(() => {
            setDownloadLoader(false);
        }, [6000])
        // }
    }

    const closeflyout = () => {
        toggleDrawer(setRights, false);
        // document.getElementsByClassName('MuiPopover-root')[0].style.display = 'none';
    }
    const submit = () => {
        setDownloadLoader(true)
        setBtn("");
        console.log("range--", range, Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0));
        setStartDate(range[0].startDate);
        setEndDate(range[0].endDate);
        dispatch(getIngestionLogData(contentPartnerData, contentTypeData, Math.floor(moment(range[0].startDate).endOf("date")._d.getTime() / 1000.0), Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0), dispatch))

        setModalOpen(false);
        setTimeout(() => {
            setDownloadLoader(false);
        }, [6000])

    }


    const getImage = () => {
        var node = document.querySelector(".take-screenshot");
        var options = {
            quality: 1,
            bgcolor: "#ffffff",
        };
        domtoimage
            .toPng(node, options)
            .then(function (dataUrl) {
                const a = document.createElement("a");
                a.href = dataUrl;
                a.download = createFileName(
                    "png",
                    `IngestionLog-${moment().format("DD/MM/YYYY")}`
                );
                a.click();
            })
            .catch(function (error) {
                console.error("oops, something went wrong!", error);
            });
    };

    const getExcelDownload = () => {
        const data = [];
        dataTable?.Ingestion_log_data && dataTable?.Ingestion_log_data.map(res => {

            const sumOfCount = res.contentList.reduce((sum, currentValue) => {
                return sum + currentValue.count;
            }, 0);
            let obj = {}
            if (res?.contentList.length > 0 && sumOfCount > 0) {
                obj = {
                    PROVIDER: res.provider,
                    MOVIES: res.contentList[0]?.content == "MOVIES" ? res.contentList[0]?.count : 0 || res.contentList[1]?.content == "MOVIES" ? res.contentList[1]?.count : 0 || res.contentList[2]?.content == "MOVIES" ? res.contentList[2]?.count : 0,
                    WEB_SHORTS: res.contentList[0]?.content == "WEB_SHORTS" ? res.contentList[0]?.count : 0 || res.contentList[1]?.content == "WEB_SHORTS" ? res.contentList[1]?.count : 0 || res.contentList[2]?.content == "WEB_SHORTS" ? res.contentList[2]?.count : 0,
                    TV_SHOWS: res.contentList[0]?.content == "TV_SHOWS" ? res.contentList[0]?.count : 0 || res.contentList[1]?.content == "TV_SHOWS" ? res.contentList[1]?.count : 0 || res.contentList[2]?.content == "TV_SHOWS" ? res.contentList[2]?.count : 0,
                    TOTAL: sumOfCount
                }
            }
            //show partner having data
            //    else{
            //     obj = {
            //         PROVIDER:res.provider,
            //         MOVIES:0,
            //         WEB_SHORTS:0,
            //         TV_SHOWS:0,
            //         TOTAL:0
            //     }
            //    }

            data.push(obj)

        })

        if (data.length > 0) {
            const fileName = createFileName(
                "csv",
                `IngestionLog-${moment().format("DD/MM/YYYY")}`
            );
            const exportType = exportFromJSON.types.csv;
            exportFromJSON({ data, fileName, exportType });
        }
    }
    return (<>
        <div className='cta-btn'>
            <div className='top-left-nav'>
                <Typography
                    variant='h5'
                    style={{ fontSize: "1.2rem", paddingLeft: "13px" }}
                >
                    Total Providers {dataTable?.Ingestion_log_data && dataTable?.Ingestion_log_data.length}
                    {/* {dataTable?.Ingestion_log_data && dataTable?.Ingestion_log_data.length} */}
                </Typography>
            </div>
            <div className='status-report'>
                <MatButton
                    onClick={() => {
                        setFromDate(
                            Math.floor(new Date().getTime() / 1000.0) - 24 * 3600
                        );
                        setBtn("24hr");
                        setStartDate()
                        setEndDate()
                        // dispatch(getIngestionLogData(contentPartnerData, contentTypeData, dispatch))
                        setDownloadLoader(true)
                    }}
                    className={btn === "24hr" ? "Status-btn-active" : "Status-btn"}
                >
                    24hrs
                </MatButton>
                <MatButton
                    onClick={() => {
                        setFromDate(
                            Math.floor(new Date().getTime() / 1000.0) - 2 * 24 * 3600
                        );
                        setBtn("weekly");
                        setStartDate()
                        setEndDate()
                        // dispatch(getIngestionLogData(contentPartnerData, contentTypeData, dispatch))
                        setDownloadLoader(true)
                    }}
                    className={btn === "weekly" ? "Status-btn-active" : "Status-btn"}
                >
                    48hrs
                </MatButton>
                <MatButton
                    onClick={() => {
                        setFromDate(
                            Math.floor(new Date().getTime() / 1000.0) - 3 * 24 * 3600
                        );
                        setBtn("monthly");
                        // dispatch(getIngestionLogData(contentPartnerData, contentTypeData, dispatch))
                        setDownloadLoader(true)
                        setStartDate()
                        setEndDate()

                    }}
                    className={btn === "monthly" ? "Status-btn-active" : "Status-btn"}
                >
                    72hrs
                </MatButton>

                <div className='dateCountcustom'>
                    <div className='row eds-dateCont'>
                        <span>Custom Date</span>
                        <TextField
                            onClick={() => setModalOpen(true)}
                            contentEditable={false}
                            value={
                                startDate
                                    ? moment(startDate).format("DD/MM/YYYY")
                                    : ""
                            }
                            placeholder='dd-mm-yyyy'
                        />
                        <Box className='to' sx={{ mx: 2 }}> to </Box>
                        <TextField
                            onClick={() => setModalOpen(true)}
                            contentEditable={false}
                            value={
                                endDate ? moment(endDate).format("DD/MM/YYYY") : ""
                            }
                            placeholder='dd-mm-yyyy'
                        />
                    </div>
                    <Modal
                        isOpen={openModal}
                        toggle={() => setModalOpen(false)}
                        centered
                    >
                        <ModalHeader>
                            <h3>Date Picker</h3>
                        </ModalHeader>
                        <ModalBody>
                            <div
                                style={{
                                    display: "flex",
                                    flexDirection: "row",
                                    justifyContent: "center",
                                }}
                            >
                                <DateRange
                                    onChange={(item) => setRange([item.selection])}
                                    ranges={range}
                                    editableDateInputs={true}
                                    moveRangeOnFirstSelection={false}
                                    maxDate={new Date()}
                                />
                            </div>
                        </ModalBody>
                        <ModalFooter>
                            <div>
                                <Button
                                    onClick={() => setModalOpen(false)}
                                    variant='contained'
                                    className='btn-danger text-white bg-danger'
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={submit}
                                    variant='contained'
                                    color='primary'
                                    className='text-white bg-primary'
                                    style={{ marginLeft: 10 }}

                                >
                                    Submit
                                </Button>

                            </div>
                        </ModalFooter>
                    </Modal>
                </div>
                <MatButton
                    className='Status-btn'
                    style={{ fontSize: "19px", color: "#E10092", paddingRight: "20px" }}
                    onClick={getImage}
                    endIcon={<CameraAltOutlinedIcon />}
                >
                </MatButton>
                <MatButton
                    className='Status-btn'
                    style={{ fontSize: "19px", color: "#E10092", paddingRight: "20px" }}
                    onClick={getExcelDownload}
                    endIcon={<FileDownloadOutlinedIcon />}
                >
                </MatButton>
                <Button
                    variant='contained'
                    className='btnFilter'
                    size='small'
                    onClick={() => setRights(true)}
                    endIcon={<FilterAltOutlinedIcon />}
                />
            </div>
        </div>
        <div className="data-table-wraper-ingestion take-screenshot">
            <div>
                <TableContainer>
                    <Table sx={{ minWidth: 650 }}>
                        <TableHead
                            style={{ marginTop: "10px" }}
                        >
                            <TableRow
                                style={{
                                    borderBottom: "1px solid white",
                                    color: "rgb(151 151 151 / 87%)",
                                }}
                                sx={{ border: 0 }}
                            >
                                <TableCell>PROVIDER</TableCell>
                                <TableCell>MOVIES</TableCell>
                                <TableCell>WEB SHORTS</TableCell>
                                <TableCell>TV SHOWS</TableCell>
                                <TableCell>TOTAL</TableCell>
                            </TableRow>
                        </TableHead>

                        {dataTable?.Ingestion_log_data && dataTable?.Ingestion_log_data.map(res => {
                            const sumOfCount = res.contentList.reduce((sum, currentValue) => {
                                return sum + currentValue.count;
                            }, 0);
                            return (
                                <>
                                    {res?.contentList.length > 0 && sumOfCount > 0 ? <>
                                        <TableRow style={{ "border-bottom": "6px solid white" }}>
                                            <TableCell className='tablecell' style={{ "width": "152px !important" }}>{res.provider}</TableCell>
                                            <TableCell style={{ "padding": "10px" }}>{res.contentList[0]?.content == "MOVIES" ? res.contentList[0]?.count : 0 || res.contentList[1]?.content == "MOVIES" ? res.contentList[1]?.count : 0 || res.contentList[2]?.content == "MOVIES" ? res.contentList[2]?.count : 0}</TableCell>
                                            <TableCell style={{ "padding": "10px" }}>{res.contentList[0]?.content == "WEB_SHORTS" ? res.contentList[0]?.count : 0 || res.contentList[1]?.content == "WEB_SHORTS" ? res.contentList[1]?.count : 0 || res.contentList[2]?.content == "WEB_SHORTS" ? res.contentList[2]?.count : 0}</TableCell>
                                            <TableCell style={{ "padding": "10px" }}>{res.contentList[0]?.content == "TV_SHOWS" ? res.contentList[0]?.count : 0 || res.contentList[1]?.content == "TV_SHOWS" ? res.contentList[1]?.count : 0 || res.contentList[2]?.content == "TV_SHOWS" ? res.contentList[2]?.count : 0}</TableCell>
                                            <TableCell style={{ "padding": "10px" }}>{sumOfCount}</TableCell>
                                        </TableRow>


                                    </> : null

                                    }



                                    {/* <TableRow>
                        <TableCell></TableCell>
                            <TableCell className='tablecell'>WEB_SERIES</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>4</TableCell>
                            <TableCell>10</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                        <TableRow>
                        <TableCell></TableCell>
                        <TableCell className='tablecell'>TV_SHOWS</TableCell>
                            <TableCell>3</TableCell>
                            <TableCell>1</TableCell>
                            <TableCell>0</TableCell>
                            <TableCell>4</TableCell>
                            <TableCell>10</TableCell>
                        </TableRow> */}
                                </>
                            )


                        })

                        }
                        {
                            !downloadLoader ? null : <CircularProgress className="progress-primary mr-30 mb-10" size={60} mode="determinate" value={75} />
                        }

                    </Table>
                </TableContainer>

                {/* <MUIDataTable 
                     title={`Total Ingestion ${IngestionLogData.length}`}
                     data={IngestionLogData}
                     columns={columns}
                     options={options}
                     className={"filter-btn"}
                    /> */}
            </div>
        </div>

        <div className="FilterContainer">
            <Drawer anchor="right" open={rights} onClose={() => closeflyout()}>
                <div style={{ height: '90%', overflowY: 'scroll' }} className="rightSidebar">
                    <div className='SideBarHeader' style={{ marginBottom: "-30px" }}>
                        <h3>Filter</h3>
                        <IconButton onClick={() => closeflyout()} > <Close /></IconButton>
                    </div>
                    <List dense className='filtersCont'>
                        <ListItem>
                            <h3>Content Partner</h3>
                            <ContentCatalogueFilter
                                listName={listNamePartner}
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
                        <ListItem>
                            <h3>Content Type</h3>
                            <ContentTypeFilter
                                listName={contentType}
                                // getContentType={getContentType}
                                saveContentTypeData={saveContentTypeData}
                                checkedItemsContentType={checkedItemsContentType}
                            />
                        </ListItem>
                    </List>
                </div>
                <div className="rightSidebar" style={{ height: '10%' }}>
                    <Button variant="contained" onClick={applyFilters} size="small" className='btnApply' >
                        Apply
                    </Button>
                </div>
            </Drawer>
        </div>
    </>)

}

export default IngestionLog