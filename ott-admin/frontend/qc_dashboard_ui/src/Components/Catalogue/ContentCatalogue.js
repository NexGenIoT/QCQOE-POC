import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { getContentCatalogueData, getContentTypes, getPartnerDetails, getUniqueFilters } from "Store/Actions"
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
import { Box, Button, CircularProgress, Collapse, Drawer, List, ListItem, Paper } from '@material-ui/core';
import { Close } from '@mui/icons-material';
import ContentPartnerFilter from 'Components/QualityExperience/ContentPartnerFilter';
import ContentTypeFilter from 'Components/QualityExperience/ContentTypeFilter';
import { Table, TableContainer, TableRow, TableCell, Tooltip, TableHead, TablePagination } from '@mui/material';
import { Tab, Typography } from '@material-ui/core';
import MatButton from "@material-ui/core/Button";
import { DateRange } from "react-date-range";
import FilterAltOutlinedIcon from '@mui/icons-material/FilterAltOutlined';
import ContentCatalogueFilter from './ContentCatalogueFilter';
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import IconButton from "@mui/material/IconButton";
import domtoimage from "dom-to-image";
import { createFileName } from "use-react-screenshot";
import exportFromJSON from "export-from-json";

const ContentCatalogue = () => {
    const dataDisplay = useSelector((state) => state.qoeReducer);

    const dataTable = useSelector(state => state.logReducer);
    const dataOverview = useSelector(state => state.overviewReducer);

    console.log("abcd--", dataTable);
    const dispatch = useDispatch()
    const [contentCatalogue, setContentCatalogue] = useState([]);
    const [colOrder, setColOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7])
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [page, setPage] = useState(0)
    const [filterList, setFilterList] = useState([]);
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
    const [downloadLoader, setDownloadLoader] = useState(true);
    const [indexes, setIndexes] = useState(-1);

    useEffect(() => {
        const isEmpty = dataOverview?.partnerInfo.length === 0;
        if (isEmpty) {
            dispatch(getContentTypes(dispatch))
            dispatch(getPartnerDetails(dispatch))
        }
    }, [dispatch]);

    useEffect(() => {
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
        setDownloadLoader(true)
        dispatch(getContentCatalogueData("", "", dispatch))

        setTimeout(() => {
            setDownloadLoader(false)

        }, 21000);
    }, []);

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

    // useEffect(() => {
    //     dispatch(getContentCatalogueData("", "", dispatch))
    // }, [])


    const toggleDrawer = (side, open) => {
        side(open)
    };

    const closeflyout = () => {
        toggleDrawer(setRights, false);
        // document.getElementsByClassName('MuiPopover-root')[0].style.display = 'none';
    }

    const applyFilters = () => {
        setDownloadLoader(true)

        setCheckedItemsContentPartner(contentPartnerData);
        setCheckedItemsContentType(contentTypeData);
        toggleDrawer(setRights, false);
        // if (contentPartnerData.length > 0 || contentTypeData.length > 0) {
        console.log('first helloooo');
        dispatch(getContentCatalogueData(contentPartnerData, contentTypeData, dispatch))

        setTimeout(() => {
            setDownloadLoader(false)
        }, 7000);

        // }
    }


    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const clickOnSeconDrawer = (index, condition, list, plusMinusVal) => {
        if (plusMinusVal === 'plus') {
            index === indexes ? setIndexes(-1) : setIndexes(index);
        }
        else {
            index === indexes ? setIndexes(-1) : setIndexes(index);
        }
    };

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
              `ContentCatalogue-${moment().format("DD/MM/YYYY")}`
            );
            a.click();
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      };

      const getExcelDownload = () => {
        const data = [];
        dataTable?.content_catalogue && dataTable?.content_catalogue.map((res, index1) => {
            res.contentList.map((res2, index) => {
                let total = res2.statusList.reduce((sum, currentValue) => {
                    return sum + currentValue.count;
                }, 0);
                let obj={}
                if(res?.contentList.length > 0 &&  total > 0){
                 obj = {
                    PROVIDER:res.provider,
                    CONTENT_TYPE:res2.content,
                    PASS:res2.statusList[0]?.status == "Pass" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Pass" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Pass" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Pass" ? res2.statusList[3]?.count : 0|| res2.statusList[4]?.status == "Pass" ? res2.statusList[4]?.count : 0,
                    FAIL:res2.statusList[0]?.status == "Fail" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Fail" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Fail" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Fail" ? res2.statusList[3]?.count : 0 || res2.statusList[4]?.status == "Fail" ? res2.statusList[4]?.count : 0,
                    IN_PROGRESS:res2.statusList[0]?.status == "In-Progress" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "In-Progress" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "In-Progress" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "In-Progress" ? res2.statusList[3]?.count : 0|| res2.statusList[4]?.status == "In-Progress" ? res2.statusList[4]?.count : 0,
                    UNPUBLISHED:res2.statusList[0]?.status == "Unpublished" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Unpublished" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Unpublished" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Unpublished" ? res2.statusList[3]?.count : 0|| res2.statusList[4]?.status == "Unpublished" ? res2.statusList[4]?.count : 0,
                    ARCHIVED:res2.statusList[0]?.status == "Archived" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Archived" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Archived" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Archived" ? res2.statusList[3]?.count : 0 || res2.statusList[4]?.status == "Archived" ? res2.statusList[4]?.count : 0,
                    TOTAL:total
                 }
                }
                // else{
                //  obj = {
                //     PROVIDER:res.provider,
                //     CONTENT_TYPE:res2.content,
                //     PASS:0,
                //     FAIL:0,
                //     IN_PROGRESS:0,
                //     UNPUBLISHED:0,
                //     ARCHIVED:0,
                //     TOTAL:0
                //  }
                // }

             data.push(obj)
            })

        })

        if(data.length>0){
            const fileName = createFileName(
                "csv",
                `ContentCatalogue-${moment().format("DD/MM/YYYY")}`
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
                    Total Providers  {dataTable?.content_catalogue?.length}
                </Typography>
            </div>
            <div className='status-report'>
                <MatButton
                    className='Status-btn'
                    style={{ fontSize: "19px", color: "#E10092", paddingRight: "20px"}}
                    onClick={getImage}
                    endIcon={<CameraAltOutlinedIcon />}
                >
                </MatButton>
                <MatButton
                    className='Status-btn'
                    style={{ fontSize: "19px", color: "#E10092", paddingRight: "20px"}}
                    onClick={getExcelDownload}
                    endIcon={<FileDownloadOutlinedIcon />}
                >
                </MatButton>
                <MatButton
                    className='btnFilter'
                    style={{ fontSize: "19px", color: "#FFFFFF"}}
                    size='small'
                    onClick={() => setRights(true)}
                    endIcon={<FilterAltOutlinedIcon />}></MatButton>

            </div>
        </div>
        <div className="data-table-wraper take-screenshot">

            <div >
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
                                <TableCell></TableCell>
                                <TableCell>PROVIDER</TableCell>
                                <TableCell>CONTENT TYPE</TableCell>
                                <TableCell>PASS</TableCell>
                                <TableCell>FAIL</TableCell>
                                <TableCell>IN PROGRESS</TableCell>
                                <TableCell>UNPUBLISHED</TableCell>
                                <TableCell>ARCHIVED</TableCell>
                                <TableCell>TOTAL</TableCell>
                            </TableRow>
                        </TableHead>

                        {dataTable?.content_catalogue && dataTable?.content_catalogue.map((res, index1) => {
                            const sumOfCount = res.totalStatusList.reduce((sum, currentValue) => {
                                return sum + currentValue.count;
                            }, 0);
                            
                            return (
                               
                                <>
                                {sumOfCount>0 &&
                                  <>
                                    <TableRow style={{ "background": "#ddd", "border-bottom": "6px solid white" }}>
                                        <TableCell>

                                            {(index1 === indexes) ? (
                                                <i
                                                    onClick={() =>
                                                        clickOnSeconDrawer(
                                                            index1,
                                                            false,
                                                            res,
                                                            'minus'
                                                        )
                                                    }
                                                    style={{ cursor: "pointer", fontSize: "24px", "padding": "2px 0 7px 0" }}
                                                    className='zmdi zmdi-minus-circle'
                                                ></i>
                                            ) : (
                                                <i
                                                    style={{ cursor: "pointer", fontSize: "24px", "padding": "2px 0 7px 0" }}
                                                    onClick={() =>
                                                        clickOnSeconDrawer(
                                                            index1,
                                                            true,
                                                            res,
                                                            'plus'
                                                        )
                                                    }
                                                    className='zmdi zmdi-plus-circle'
                                                ></i>
                                            )}
                                        </TableCell>
                                        <TableCell className='tablecell'>{res.provider}</TableCell>
                                        <TableCell style={{ "padding": "10px" }}>ALL</TableCell>
                                        <TableCell style={{ "padding": "10px" }}>{res.totalStatusList[0]?.status == "Pass" ? res.totalStatusList[0]?.count : 0 || res.totalStatusList[1]?.status == "Pass" ? res.totalStatusList[1]?.count : 0 || res.totalStatusList[2]?.status == "Pass" ? res.totalStatusList[2]?.count : 0 || res.totalStatusList[3]?.status == "Pass" ? res.totalStatusList[3]?.count : 0|| res.totalStatusList[4]?.status == "Pass" ? res.totalStatusList[4]?.count : 0}</TableCell>
                                        <TableCell style={{ "padding": "10px" }}>{res.totalStatusList[0]?.status == "Fail" ? res.totalStatusList[0]?.count : 0 || res.totalStatusList[1]?.status == "Fail" ? res.totalStatusList[1]?.count : 0 || res.totalStatusList[2]?.status == "Fail" ? res.totalStatusList[2]?.count : 0 || res.totalStatusList[3]?.status == "Fail" ? res.totalStatusList[3]?.count : 0|| res.totalStatusList[4]?.status == "Fail" ? res.totalStatusList[4]?.count : 0}</TableCell>
                                        <TableCell style={{ "padding": "10px" }}>{res.totalStatusList[0]?.status == "In-Progress" ? res.totalStatusList[0]?.count : 0 || res.totalStatusList[1]?.status == "In-Progress" ? res.totalStatusList[1]?.count : 0 || res.totalStatusList[2]?.status == "In-Progress" ? res.totalStatusList[2]?.count : 0 || res.totalStatusList[3]?.status == "In-Progress" ? res.totalStatusList[3]?.count : 0|| res.totalStatusList[4]?.status == "In-Progress" ? res.totalStatusList[4]?.count : 0}</TableCell>
                                        <TableCell style={{ "padding": "10px" }}>{res.totalStatusList[0]?.status == "Unpublished" ? res.totalStatusList[0]?.count : 0 || res.totalStatusList[1]?.status == "Unpublished" ? res.totalStatusList[1]?.count : 0 || res.totalStatusList[2]?.status == "Unpublished" ? res.totalStatusList[2]?.count : 0 || res.totalStatusList[3]?.status == "Unpublished" ? res.totalStatusList[3]?.count : 0|| res.totalStatusList[4]?.status == "Unpublished" ? res.totalStatusList[4]?.count : 0}</TableCell>
                                        <TableCell style={{ "padding": "10px" }}>{res.totalStatusList[0]?.status == "Archived" ? res.totalStatusList[0]?.count : 0 || res.totalStatusList[1]?.status == "Archived" ? res.totalStatusList[1]?.count : 0 || res.totalStatusList[2]?.status == "Archived" ? res.totalStatusList[2]?.count : 0 || res.totalStatusList[3]?.status == "Archived" ? res.totalStatusList[3]?.count : 0|| res.totalStatusList[4]?.status == "Archived" ? res.totalStatusList[4]?.count : 0}</TableCell>
                                        <TableCell style={{ "padding": "10px" }}>{sumOfCount}</TableCell>
                                    </TableRow>

                                    {res.contentList.map((res2, index) => {
                                        let total = res2.statusList.reduce((sum, currentValue) => {
                                            return sum + currentValue.count;
                                        }, 0);
                                        return (
                                            <>

                                                {index1 == indexes ? <>
                                                    <TableRow
                                                        sx={{ border: 0 }}
                                                    >
                                                        <TableCell></TableCell>
                                                        <TableCell></TableCell>
                                                        <TableCell className='tablecell'>{res2.content}</TableCell>
                                                        {/* {res2.map(res3=>{
                                                       return <> */}
                                                        <TableCell style={{ "padding": "10px" }}>{res2.statusList[0]?.status == "Pass" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Pass" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Pass" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Pass" ? res2.statusList[3]?.count : 0}</TableCell>
                                                        <TableCell style={{ "padding": "10px" }}>{res2.statusList[0]?.status == "Fail" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Fail" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Fail" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Fail" ? res2.statusList[3]?.count : 0}</TableCell>
                                                        <TableCell style={{ "padding": "10px" }}>{res2.statusList[0]?.status == "In-Progress" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "In-Progress" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "In-Progress" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "In-Progress" ? res2.statusList[3]?.count : 0}</TableCell>
                                                        <TableCell style={{ "padding": "10px" }}>{res2.statusList[0]?.status == "Unpublished" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Unpublished" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Unpublished" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Unpublished" ? res2.statusList[3]?.count : 0}</TableCell>
                                                        <TableCell style={{ "padding": "10px" }}>{res2.statusList[0]?.status == "Archived" ? res2.statusList[0]?.count : 0 || res2.statusList[1]?.status == "Archived" ? res2.statusList[1]?.count : 0 || res2.statusList[2]?.status == "Archived" ? res2.statusList[2]?.count : 0 || res2.statusList[3]?.status == "Archived" ? res2.statusList[3]?.count : 0}</TableCell>
                                                        <TableCell style={{ "padding": "10px" }}>{total}</TableCell>
                                                        {/* </>
                                                    })} */}


                                                    </TableRow>
                                                </> : null}
                                            </>
                                        )
                                    })}
                                  </>
                                }
                                </>
                                
                            )
                        })
                        }
                        {
                            !downloadLoader ? null : <CircularProgress className="progress-primary mr-30 mb-10" size={60} mode="determinate" value={75} />
                        }
                        {/* fsdf */}


                    </Table>
                </TableContainer>
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
    </>
    )
}
export default ContentCatalogue;
