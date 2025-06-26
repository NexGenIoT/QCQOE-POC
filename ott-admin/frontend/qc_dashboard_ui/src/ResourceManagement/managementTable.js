import MUIDataTable from 'mui-datatables';
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getResourceManagementData, getResourceManagementDataForFilter, getSearchResourceManagementData, getUpdateResourceManagementData, startLoading, stopLoading } from 'Store/Actions';
import exportFromJSON from 'export-from-json';
import moment from 'moment';
// import { Button, Checkbox, Drawer, IconButton, InputBase, List, ListItem, ListItemButton, ListItemIcon, ListItemText, MenuList, Paper } from '@mui/material';
import { Button, Drawer, FormControl, IconButton, InputLabel, ListItem, ListItemIcon, MenuList, Paper, Select, TextareaAutosize } from '@material-ui/core';

import { Close } from '@mui/icons-material';
import MatButton from "@material-ui/core/Button";
import SearchIcon from '@mui/icons-material/Search';
import List from '@mui/material/List';
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { InputBase, ListItemButton } from "@mui/material";
import { NotificationManager } from 'react-notifications';
import MyDialog from 'Components/Tables/data-table/edit_dialoge';
import { green } from '@material-ui/core/colors';
import { isValidPermission, isValidRole } from 'Constants/constant';

const ManagementDetail = () => {
    const dispatch = useDispatch()
    const dataTable = useSelector(state => state.logReducer);
    const dataOverview = useSelector(state => state.overviewReducer);

    console.log("reduxx--",dataTable);
    const [contentPartner, setContentPartner] = useState(dataOverview?.partnerInfo)
    const [colOrder, setColOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7])
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [tableData, setTableData] = useState([])
    const [totalItems, settotalItems] = useState(0)
    const [searchAssetId, setSearchAssetId] = useState("");
    const [openSearch, setOpenSearch] = React.useState(false);
    const [checkedContent, setCheckedContent] = React.useState([]);
    const [rights, setRights] = useState(false);
    const [apply, setApply] = useState(false)
    const [searchByMobileNo, setSearchByMobileNo] = useState('')
    const [searchByKey, setSearchByKey] = useState('')
    const [runDashboardApi, setRunDashboardApi] = React.useState(false);
    const [selectedTableData, setSelectedTableData] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogDisbaleMessage, setDialogDisableMessage] = useState("");
    const [mobileCheckedContent, setMobileCheckedContent] = React.useState([]);
    const [sidCheckedContent, setSidCheckedContent] = React.useState([]);
    const [contentMobile, setContentMobile] = useState([])
    const [contentSid, setContentSid] = useState([])
    const [filterList, setFilterList] = useState([])

    useEffect(() => {
        dispatch(getResourceManagementData(page, rowsPerPage, dispatch))
        dispatch(getResourceManagementDataForFilter(page, rowsPerPage, dispatch))
    }, [])
    useEffect(() => {
        dispatch(startLoading())
        dispatch(getResourceManagementData(page, rowsPerPage, dispatch))
        dispatch(stopLoading())
    }, [runDashboardApi])

    useEffect(() => {
        setTableData(dataTable?.resource_manaement?.data)
        //   totalItems= dataTable?.resource_manaement.length
        if (dataTable?.resource_manaement?.data) {
            // settotalItems(dataTable?.resource_manaement?.tatalitems)
            // if(dataTable?.resource_manaement?.tatalitems==undefined){
                settotalItems(dataTable?.resource_manaement?.data.length)    
           // }
        }
    }, [dataTable?.resource_manaement?.data, runDashboardApi])
    useEffect(() => {

        setContentMobile(getUniqueListBy(dataTable?.resource_manaement_for_filter, 'mobile_no'))
        setContentSid(getUniqueListBy(dataTable?.resource_manaement_for_filter, 'sid'))
    }, [dataTable?.resource_manaement_for_filter])

    const columns = [

        {
            label: "SID",
            name: "sid",
            options: {
                customBodyRender: (data, row) => {
                    return <span>{data==null ? <span >NA</span> :<span >{data}</span>} </span>;
                },
                display: colOrder.indexOf(0) >= 0 ? true : false,
                sort: true
            }
        },
        {
            label: "MOBILE NO",
            name: "mobile_no",
            options: {
                 customBodyRender: (data, row) => {
                    return <span>{data==null ? <span >NA</span> :<span >{data}</span>} </span>;
                },
                display: colOrder.indexOf(0) >= 0 ? true : false,
                sort: true
            }
        },
        {
            label: "PARTNER NAME",
            name: "partner_name",
            options: {
                display: colOrder.indexOf(0) >= 0 ? true : false,
                sort: true
            }
        },
        {
            label: "MESSAGE",
            name: "message",
            options: {
                customBodyRender: (data, row) => {
                    return <span>{data==null ? <span >NA</span> :<span >{data}</span>} </span>;
                },
                display: colOrder.indexOf(0) >= 0 ? true : false,
                sort: true
            }
        },

        {
            label: "STATUS",
            name: "enabled",
            options: {
                customBodyRender: (data, row) => {
                    return <span>{data ? <span style={{color: "green"}}>Enabled</span> :<span style={{color: "red"}}>Disabled</span>} </span>;
                },
                display: colOrder.indexOf(0) >= 0 ? true : false,
                sort: true
            }
        },
        {
            label: "UPDATED DATE",
            name: "updated_at",
            options: {
                customBodyRender: (data, row) => {
                    return <span>{data==null ? <span >NA</span> :<span >{moment(data).format('DD MMM YYYY | hh:mm')}</span>} </span>;
                },
                display: colOrder.indexOf(0) >= 0 ? true : false,
                sort: true
            }
        },

        {
            label: "",
            name: "",
            options: {
                customBodyRender: (data, row) => {
                    if(isValidPermission('WRITE_RESOURCE_MANAGEMENT')){
                        return <i style={{ "color": "#e20092", "font-size": "21px" }} className="zmdi zmdi-edit icons"
                        onClick={() => {
                            setIsDialogOpen(true)
                            setDialogDisableMessage("")
                            setSelectedTableData("")
                            setSelectedTableData(row.rowData);
                        }}></i>;
                    }else{
                        return <i style={{ "color": "#b0b0b0", "font-size": "21px" }} className="zmdi zmdi-edit icons"></i>;  
                    }
                    // if (row.rowData[6] == "Verify") {
                   
                    //   } else {
                    //     return null
                    //   }

                },
                display: colOrder.length === 1 ? false : true
            }
        },
    ]

    const options = {
        filterType: 'checkbox',
        count: totalItems,
        pagination: true,
        // serverSide: server,
        rowsPerPage: rowsPerPage,
        rowsPerPageOptions: [10, 30, 50],
        page: page,
        //  searchOpen: search,
        //  searchText: searchText,
        search: false,
         filterList: filterList,
        // filterType: "dropdown",
        selectableRows: "none",// "multiple",
        textLabels: {
            body: {
                noMatch: dataTable.isLoading ?
                    null :
                    'Sorry, there is no matching data to display',
            },
        },

        onTableChange: (action, tableState) => {
            console.log("filter", action, tableState);

            if (action === 'onFilterDialogOpen') {
                setContentPartner(dataOverview?.partnerInfo)
                toggleDrawer(setRights, true)

            }
            if (action === 'changePage') {
                setPage(tableState.page)
                const arr = new Array(tableState.columns.length).fill([]);
                setFilterList(arr)
            }
            if (action === 'filterChange') {
               // setServer(false)
                setFilterList(tableState.filterList)
                function checkAge(age) {
                  return age.length > 0;
                }
                const final = tableState.filterList.some(checkAge)
                if (page > 0 && final) {
                  setPage(1)
                }
            }
            if (action === 'propsUpdate') {
                setPage(tableState.page)
                //   toggleDrawer(setRights, true)
            }
            window.scrollTo(0, 0)
            window.scrollTo({ top: 0, behavior: 'smooth' })
        },
        onDownload: () => {
            const downloadedData = dataTable?.resource_manaement?.data
            let data = downloadedData
            let myWindow = window.open('', '_blank')
            const fileName = `${moment().format('DD-MM-YYYY')}-resource-managment`
            const exportType = exportFromJSON.types.csv
            exportFromJSON({
                data,
                fileName,
                exportType,
                withBOM: true
            })
            myWindow.close()
            return false
        },
        onColumnSortChange: (changedColumn, direction) => {


        },
        onViewColumnsChange: (changedColumn, action) => {

        },
        onChangeRowsPerPage: (numberOfRows) => {
            //toggleDrawer(setRights, true)
            window.scrollTo(0, 0)
            window.scrollTo({ top: 0, behavior: 'smooth' })
            setRowsPerPage(numberOfRows)
            setPage(1)
        },
        onFilterChange: (changedColumn, filterList, type, changedColumnIndex, displayData) => {
            if (type === 'chip') {
                //  setServer(true)
            }

            console.log("filter");


        },
        onSearchOpen: () => {
            //  setSearch(true)
        },
        onSearchChange: (s) => {
            //   if (searchText) {
            //     setServer(false)
            //   }
            //   setSearchText(s)
        },
        onSearchClose: () => {
            //  setServer(true)
        },
    };
    const handleDropDownCahnge = (event) => {
        setSearchByKey(event.target.value);
    }

    const toggleDrawer = (side, open) => {
        side(open)
    };
    const closeflyout = () => {
        console.log("close");
        toggleDrawer(setRights, false);
        // document.getElementsByClassName('MuiPopover-root')[0].style.display = 'none';
    }

    function getUniqueListBy(arr, key) {
        if(arr==undefined){
            return;
        }
        let temparra=[]
        temparra = arr 
        return [...new Map(temparra.map(item => [item[key], item])).values()]
    }

    const contentPartnerChange = (e) => {
        if (e.target.value !== "") {
            const data = dataOverview?.partnerInfo.filter(a => a.name.toLowerCase().includes(e.target.value.toLowerCase()))
            setContentPartner(data)
        } else {
            setContentPartner(dataOverview?.partnerInfo)
        }
    }

    const contentMobileChange = (e) => {
        if (e.target.value !== "") {
            const data = dataTable?.resource_manaement.data.filter(a => a.mobile_no==e.target.value)
            setContentMobile(data)
        } else {
            setContentMobile(dataTable?.resource_manaement.data)
        }
    }
    const contentSidChange = (e) => {
        if (e.target.value !== "") {
            const data = dataTable?.resource_manaement.data.filter(a => a.sid==e.target.value)
            setContentSid(data)
        } else {
            setContentSid(dataTable?.resource_manaement.data)
        }
    }
    const handleToggleContentPartner = (value) => {
        const currentIndex = checkedContent.indexOf(value);
        const newChecked = [...checkedContent];
        console.log("currentIndex-checked", currentIndex);

        if (currentIndex === -1) {
            // newChecked[0] = value;
            newChecked.push(value);
        } else {
            if (value === dataOverview?.imageInfo) {
                // dispatch(clearAssetInfoData())
            }
            newChecked.splice(currentIndex, 1);
        }

        console.log("checked", newChecked);

        setCheckedContent(newChecked);
    };
    const handleToggleMobile = (value) => {
        const currentIndexmobile = mobileCheckedContent.indexOf(value);
        const newCheckedmobile = [...mobileCheckedContent];
        console.log("currentIndex-checked", currentIndexmobile);

        if (currentIndexmobile === -1) {
            // newCheckedmobile[0] = value;
            newCheckedmobile.push(value);
        } else {

            newCheckedmobile.splice(currentIndexmobile, 1);
        }

        console.log("checked", newCheckedmobile);

        setMobileCheckedContent(newCheckedmobile);
    };

    const handleToggleSID = (value) => {
        const currentIndexsid = sidCheckedContent.indexOf(value);
        const newCheckeedSid = [...sidCheckedContent];
        console.log("currentIndex-checked", currentIndexsid);

        if (currentIndexsid === -1) {
           // newCheckeedSid[0] = value;
            newCheckeedSid.push(value);
        } else {

            newCheckeedSid.splice(currentIndexsid, 1);
        }

        console.log("checked", newCheckeedSid);

        setSidCheckedContent(newCheckeedSid);
    };

    const applyFilters = () => {
        // setRunDashboardApi(true)
        setSearchAssetId("")
        closeflyout();
        setPage(0);
       // setRowsPerPage(10);
        setApply(true);
        // if (searchByKey == "Mobile" && searchByMobileNo != "") {
        //     setCheckedContent([])
        //     let endpoint = `key=mobile_no&value=${searchByMobileNo}&page_num=1&page_size=10`
        //     dispatch(getSearchResourceManagementData(1, endpoint, dispatch))
        // } else if (searchByKey == "Partner" && checkedContent.length > 0) {
          if(checkedContent.length != 0 || sidCheckedContent.length != 0 ||mobileCheckedContent.length != 0){
            //setSearchByMobileNo('')
            
            let endpoint = ''
            //`partner_name=${checkedContent}&sid=${sidCheckedContent}&mobile_no=${mobileCheckedContent}&enabled=&page_num=1&page_size=20`//`key=partner_name&value=${checkedContent}`
            
          
            if(sidCheckedContent.length > 0 ){
                endpoint = `sid=${sidCheckedContent}&enabled=`+`&`
             } 
              if(mobileCheckedContent.length > 0 ){
                endpoint =  endpoint +`mobile_no=${mobileCheckedContent}`+`&`
             }
             if(checkedContent.length > 0 ){
               endpoint =  endpoint+`partner_name=${checkedContent}`+`&`
            }
        
        
            dispatch(getSearchResourceManagementData(1, endpoint, dispatch))
          }
        // }
        if (checkedContent.length == 0 && sidCheckedContent.length == 0 && mobileCheckedContent.length == 0) {
            setCheckedContent([])
            setRunDashboardApi(true)
            dispatch(getResourceManagementData(page, 10, dispatch))
        }


    }

    const searchBySID = () => {
        // setApply(false)
        if (searchAssetId != "") {
            setCheckedContent([])
            setSearchByMobileNo('')
            let endpoint = `key=sid&value=${searchAssetId}`
            dispatch(getSearchResourceManagementData(1, endpoint, dispatch))
        } else {
            NotificationManager.error("Please enter valid SID to search")
        }

    }
    const handleDialogClose = event => {
        setDialogDisableMessage("")
        setIsDialogOpen(false);
    };

    return (
        <>
            <div className="data-table-wraper">
                <div >
                    <MUIDataTable
                        title={`Total Resource ${totalItems}`}
                        data={tableData}
                        columns={columns}
                        options={options}
                        className={"filter-btn"}
                    />
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
                                <h3>SID</h3>
                                <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                                    <input onChange={contentSidChange} type='text' name='filterSearch' className="filterSearch" placeholder='Search' />
                                </Paper>
                                <MenuList dense className="filterList">
                                    {contentSid && contentSid.map((value, index) => {
                                        const labelIdsid = value?.sid;
                                        return (
                                            <>
                                                {labelIdsid ? <MenuItem key={index}>
                                                    <ListItemButton onClick={() => handleToggleSID(labelIdsid)} role={undefined} dense>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={sidCheckedContent.indexOf(value?.sid) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelIdsid }}
                                                                size="small"
                                                                sx={{ minWidth: "18px" }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText id={labelIdsid} primary={labelIdsid} />
                                                    </ListItemButton>
                                                </MenuItem> : null}
                                            </>
                                        )

                                    })}
                                </MenuList>
                            </ListItem>
                            <ListItem>
                                <h3>Mobile</h3>
                                <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                                    <input onChange={contentMobileChange} type='text' name='filterSearch' className="filterSearch" placeholder='Search' />
                                </Paper>
                                <MenuList dense className="filterList">
                                    {contentMobile && contentMobile.map((value, index) => {
                                        const labelIdmobile = value?.mobile_no;
                                        return (
                                            <>
                                                {labelIdmobile ? <MenuItem key={index}>
                                                    <ListItemButton onClick={() => handleToggleMobile(labelIdmobile)} role={undefined} dense>
                                                        <ListItemIcon>
                                                            <Checkbox
                                                                edge="start"
                                                                checked={mobileCheckedContent.indexOf(value?.mobile_no) !== -1}
                                                                tabIndex={-1}
                                                                disableRipple
                                                                inputProps={{ 'aria-labelledby': labelIdmobile }}
                                                                size="small"
                                                                sx={{ minWidth: "18px" }}
                                                            />
                                                        </ListItemIcon>
                                                        <ListItemText id={labelIdmobile} primary={labelIdmobile} />
                                                    </ListItemButton>
                                                </MenuItem> : null}
                                            </>
                                        );
                                    })}
                                </MenuList>
                            </ListItem>
                            <ListItem>
                                <h3>Content Partner</h3>
                                <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                                    <input onChange={contentPartnerChange} type='text' name='filterSearch' className="filterSearch" placeholder='Search' />
                                </Paper>
                                <MenuList dense className="filterList">
                                    {contentPartner.map((value, index) => {
                                        const labelId = value?.name;
                                        return (
                                            <MenuItem key={index}>
                                                <ListItemButton onClick={() => handleToggleContentPartner(labelId)} role={undefined} dense>
                                                    <ListItemIcon>
                                                        <Checkbox
                                                            edge="start"
                                                            checked={checkedContent.indexOf(value?.name) !== -1}
                                                            tabIndex={-1}
                                                            disableRipple
                                                            inputProps={{ 'aria-labelledby': labelId }}
                                                            size="small"
                                                            sx={{ minWidth: "18px" }}
                                                        />
                                                    </ListItemIcon>
                                                    <ListItemText id={labelId} primary={labelId} />
                                                </ListItemButton>
                                            </MenuItem>
                                        );
                                    })}
                                </MenuList>
                            </ListItem>
                        </List>
                    </div>
                    <div className="rightSidebar" style={{ height: '10%' }}>
                        <Button variant="contained" size="small" className='btnApply' onClick={applyFilters} >
                            Apply
                        </Button>
                    </div>
                </Drawer>
            </div>


            <MyDialog
                assetid={selectedTableData[2]}
                title={selectedTableData[0]}
                isOpen={isDialogOpen}
                onClose={handleDialogClose}
            >
                <Paper style={{ padding: "2em" }}>
                    <div>

                        <FormControl fullWidth>
                            <TextareaAutosize
                                sx={{ ml: 2, flex: 1 }}
                                minRows={2}
                                placeholder="Enter message"
                                value={dialogDisbaleMessage}
                                onChange={(e) => {
                                    setDialogDisableMessage(e.target.value)
                                }}
                            />
                            {/* </Paper> */}
                        </FormControl>

                    </div>
                    <div style={{ marginTop: "3em", textAlign: "end" }}>
                        <Button onClick={() => {
                            if (dialogDisbaleMessage != "") {
                                console.log("abcd-button-", selectedTableData[4]);
                                 dispatch(getUpdateResourceManagementData(`partner_name=${selectedTableData[2]}&sid=${selectedTableData[0] == null ? selectedTableData[2] == "HOTSTAR" ? selectedTableData[1] : "" : selectedTableData[0]}&enabled=${selectedTableData[4] == true ? "False" : "True"}`, dialogDisbaleMessage, dispatch))
                                setIsDialogOpen(false);
                                dispatch(getResourceManagementData(1, 10, dispatch))
                                setTimeout(() => {
                                    setRunDashboardApi(true)
                                 //   dispatch(getResourceManagementData(1, 30, dispatch))
                                }, 2000);
                            } else {
                                NotificationManager.error("Please enter message")
                            }

                        }}>{selectedTableData[4] == true ? "Disabled" : "Enabled"}</Button>
                        <Button onClick={handleDialogClose}>Cancel</Button>
                    </div>
                </Paper>
            </MyDialog>
        </>

    )
}

export default ManagementDetail;