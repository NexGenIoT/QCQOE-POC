/*eslint react-hooks/exhaustive-deps: "off"*/
import {
  Table,
  TableContainer,
  TableRow,
  TableCell,
  TableHead,
  Drawer,
  Typography,
  TextField,
  MenuItem,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAllMitigationData,
  getAllMitigation,
  getMitigationAI,
  getSecondMitigation,
  getThirdMitigation,
  setMitigationAIData,
  setSecondMitigationData,
  setThirdMitigationData,
} from "Store/Actions";
import moment from "moment";
import { Box, Collapse, makeStyles, TableFooter } from "@material-ui/core";
import Button from "@mui/material/Button";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import { Tooltip } from "@material-ui/core";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import TablePagination from "@mui/material/TablePagination";

const MitigationTable = (props) => {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.qoeReducer);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [mitigationId, setMititgationId] = useState("");
  const [indexes, setIndexes] = useState(-1);
  const [id, setId] = useState("");
  const [loader, setLoader] = useState(false);
  const [loader3, setLoader3] = useState(false);
  const [filterText, setFilterText] = useState("ALL");
  const [secondMitigationList, setsecondMitigationList] = useState(
    data?.mitigationSecondList
  );
  const [isLoadingData, setisLoadingData] = useState(false);


  //Pagination logics
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  const [isAIDrawerOpen, setAIIsDrawerOpen] = useState(false);


  ////////////////////

  const menustyle = {
    borderBottom: "1px solid white",
    color: "rgb(151 151 151 / 87%)",
    height: "35px",
    width: "125px",
    lineHeight: "4px",
    "margin-left": "10px",
    // '.MuiSelect-selectMenu':{
    //   'min-height': '0.1876em'
    // }
  };
  const useStyles = makeStyles({
    select: {
      '&:before': {
        borderColor: 'white',
      },
      '&:after': {
        borderColor: 'white',
      },
      '&:not(.Mui-disabled):hover::before': {
        borderColor: 'white',
      },
    },
    icon: {
      fill: 'white',
    },
    root: {
      color: 'white',
    },
  })



  const selectStyles = {
    borderBottom: "1px solid white",
    color: "rgb(151 151 151 / 87%)",
    height: "35px",
    width: "144px",
    paddingLeft: '2px',
    control: base => ({
      ...base,
      // width:"200px",
    }),
    MenuItem: base => ({
      //...base,
      fontSize: "10px"
    })
  };
  useEffect(() => {
    dispatch(getAllMitigation(dispatch, props.toDate, props.fromDate));
    if (data?.mitigationList) {
      setisLoadingData(true)
    } else {
      setisLoadingData(false)
    }
  }, [dispatch, props.fromDate]);

  useEffect(() => {
    if (filterText == "ALL") {
      setsecondMitigationList(data?.mitigationSecondList);
      if (data?.mitigationSecondList.length) {
        setsecondMitigationList(data?.mitigationSecondList);
      }
    }
  }, [data?.mitigationSecondList]);

  const closeDrawer = () => {
    setIsDrawerOpen(false);
  };
  const openFirstDrawer = (id, source) => {
    if (source == "AI") {
      console.log("id--", id);
      dispatch(getMitigationAI(dispatch, "", id))
      setAIIsDrawerOpen(true)
    } else {
      dispatch(setSecondMitigationData([]))
      setId(id);
      dispatch(clearAllMitigationData());
      setMititgationId(id);
      setIsDrawerOpen(true);
      setisLoadingData(true)
      setLoader(true);
      dispatch(getSecondMitigation(id, dispatch, () => {
        setLoader(false);
      }));
    }
  };
  var final = []
  final = props.mitigationList.length > 0
    ? props.mitigationList.sort(function (a, b) {
      return new Date(b.Time_Stamp) - new Date(a.Time_Stamp);
    })
    : [];

  useEffect(() => {
    if (data?.mitigationList.length > 0) {
      setisLoadingData(true)
    } else {
      setisLoadingData(false)
    }
    setTimeout(() => {
      setisLoadingData(true)
    }, 30000);
  }, [data?.mitigationList])

  const clickOnSeconDrawer = (index, device_id, condition) => {
    index === indexes ? setIndexes(-1) : setIndexes(index);
    setLoader3(condition)
    dispatch(setThirdMitigationData([]))
    condition && dispatch(getThirdMitigation(device_id, dispatch, () => { }));
    { console.log("loader3--", loader3, condition) }
  };

  useEffect(() => {
    if (data?.mitigationThirdList.length > 0) {
      setLoader3(false)
    }
  }, [data?.mitigationThirdList])


  const handleReload = () => {
    setLoader(true);
    dispatch(
      getSecondMitigation(id, dispatch, () => {
        setLoader(false);
      })
    );
  };

  const filterChange = (e) => {
    setFilterText(e.target.value);
    console.log("value--", e.target.value);
    setsecondMitigationList(data?.mitigationSecondList);

    let filteredData = [];
    if (e.target.value !== "ALL") {
      filteredData = data?.mitigationSecondList?.filter((mlist) => {
        return (
          mlist.mitigation_status.toLowerCase() == e.target.value.toLowerCase()
        );
      });
      setsecondMitigationList(filteredData);
    } else {
      setsecondMitigationList(data?.mitigationSecondList);
    }
  };
  return (
    <>
      <TableContainer>
        <Table sx={{ minWidth: 650 }}>
          <TableHead
            style={{ backgroundColor: "#ffffff", borderBottom: "#ffffff" }}
          >
            <TableRow
              style={{
                borderBottom: "1px solid white",
                color: "rgb(151 151 151 / 87%)",
              }}
              sx={{ border: 0 }}
            >
              <TableCell>Action ID</TableCell>
              <TableCell>Date/Time</TableCell>
              <TableCell>Impacted Sessions</TableCell>
              <TableCell>AppliedOn</TableCell>
              <TableCell>Previous UEI</TableCell>
              <TableCell>Current UEI</TableCell>
              <TableCell>Source</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          {!isLoadingData && <div><RctPageLoader /></div>}
          {final &&
            final?.length > 0 &&
            final
              ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              ?.map((list, index) => {
                let fullDate = Math.floor(
                  new Date(list?.Time_Stamp).getTime() * 1000.0
                );
                return (
                  <TableRow
                    key={index}
                    style={{ backgroundColor: "#ffffff" }}
                    sx={{ border: 0 }}
                  >

                    <TableCell>{list?.GroupMitigationID}</TableCell>
                    <TableCell>
                      {moment(fullDate).format("DD-MM-YYYY") +
                        " | " +
                        moment(fullDate).format("hh:mm")}
                    </TableCell>
                    <TableCell>{list?.ImpactedSessions}</TableCell>
                    <TableCell>
                      {list?.ImpactedSessions}/{list?.AppliedOn}
                    </TableCell>
                    <TableCell>{list?.PreviousUEI}</TableCell>
                    <TableCell>{list?.CurrentUEI}</TableCell>
                    <TableCell>{list?.Source}</TableCell>
                    <TableCell>
                      <ArrowForwardIosIcon
                        onClick={() => openFirstDrawer(list?.GroupMitigationID, list?.Source)}
                        style={{
                          fontSize: "15px",
                          color: " #2b90f7",
                          fontWeight: "600",
                          cursor: "pointer",
                        }}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
        </Table>
        <TablePagination
          style={{
            // backgroundColor: "rgb(248, 248, 248)",
            verticalAlign: "center",
          }}
          rowsPerPageOptions={[10, 20, 50]}
          component='div'
          count={final.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      <div className='FilterContainer'>
        <Drawer
          open={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          anchor={"bottom"}
          className='drawer-postion'
        >
          <div className='issue-wraper'>
            <div className='top-left-nav'>
              <Typography
                variant='h5'
                style={{ fontSize: "1.2rem", paddingLeft: "13px" }}
              >
                {" "}
                <span>
                  <ArrowBackIcon onClick={() => closeDrawer()} />
                </span>
                <span style={{ padding: "0px 0px 2px 17px" }}>
                  Mitigation Action ID : {mitigationId} (
                  {data?.mitigationSecondList?.length})
                </span>
              </Typography>
            </div>
            <div></div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                fontSize: "1.2rem",
                paddingRight: "13px",
              }}
            >
              {loader ? (
                <RctPageLoader />
              ) : (
                <Button
                  size='small'
                  endIcon={
                    <Tooltip title='Reload this page' arrow>
                      <RefreshOutlinedIcon
                        style={{ color: "#E10092" }}
                        onClick={handleReload}
                      />
                    </Tooltip>
                  }
                />
              )}
              <CloseIcon onClick={() => closeDrawer()} />
            </div>
          </div>
          <TableContainer>
            <Table sx={{ minWidth: 650 }} style={{ marginLeft: "50px" }}>
              <TableHead
                style={{ backgroundColor: "#ffffff", borderBottom: "#ffffff" }}
              >
                <TableRow
                  style={{
                    borderBottom: "0px solid white",
                    color: "rgb(151 151 151 / 87%)",
                  }}
                  sx={{
                    "&:last-cselectedld td, &:last-cselectedld th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell></TableCell>
                  <TableCell style={{ color: "#bdb5b5" }}>Device ID</TableCell>
                  <TableCell style={{ color: "#bdb5b5" }}>
                    Last Report Time
                  </TableCell>
                  <TableCell style={{ color: "#bdb5b5" }}>
                    Previous UEI
                  </TableCell>
                  <TableCell style={{ color: "#bdb5b5" }}>
                    Current UEI
                  </TableCell>
                  <TableCell style={{ color: "#bdb5b5", marginLeft: "0px" }}>
                    <FormControl fullWidth={false} className='SelectStatus'>
                      <InputLabel id='Select Status'>
                        Mitigation Status
                      </InputLabel>
                      <Select
                        labelId='intervalSelect'
                        id='demo-simple-select'
                        select
                        placeholder='Select'
                        style={selectStyles}
                        value={filterText}
                        onChange={filterChange}
                        sx={{
                          ".MuiSelect-icon": {},
                          ".MuiSelect-outlined": {},
                        }}
                      >
                        <MenuItem key='ALL' value='ALL'>
                          ALL
                        </MenuItem>
                        <MenuItem key='Dispatched' value='Dispatched'>
                          DISPATCHED
                        </MenuItem>
                        <MenuItem key='Missed' value='Missed'>
                          MISSED
                        </MenuItem>
                        <MenuItem key='Fixed' value='Fixed'>
                          FIXED
                        </MenuItem>
                        <MenuItem key='Pending' value='Pending'>
                          PENDING
                        </MenuItem>
                      </Select>
                    </FormControl>
                  </TableCell>
                </TableRow>
              </TableHead>
              {secondMitigationList && secondMitigationList.length > 0 ? (
                secondMitigationList?.map((second, index) => {
                  let intDate = parseInt(second?.last_report_time);
                  let fullDate = Math.floor(
                    new Date(intDate).getTime() * 1000.0
                  );
                  return (
                    <>
                      <TableRow
                        key={index}
                        style={{
                          backgroundColor: "#ffffff",
                          borderBottom: "0px",
                        }}
                      >
                        <TableCell>
                          {index === indexes ? (
                            <i
                              onClick={() =>
                                clickOnSeconDrawer(
                                  index,
                                  second?.device_id,
                                  false
                                )
                              }
                              style={{ cursor: "pointer", fontSize: "24px" }}
                              className='zmdi zmdi-minus-circle'
                            ></i>
                          ) : (
                            <i
                              style={{ cursor: "pointer", fontSize: "24px" }}
                              onClick={() =>
                                clickOnSeconDrawer(
                                  index,
                                  second?.device_id,
                                  true
                                )
                              }
                              className='zmdi zmdi-plus-circle'
                            ></i>
                          )}
                        </TableCell>
                        <TableCell>{second?.device_id}</TableCell>
                        <TableCell>
                          {moment(fullDate).format("DD-MM-YYYY") +
                            " | " +
                            moment(fullDate).format("hh:mm")}
                        </TableCell>
                        <TableCell>
                          {second?.previous_uei > -1
                            ? Number(second?.previous_uei).toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {second?.current_uei > -1
                            ? Number(second?.current_uei).toFixed(2)
                            : "-"}
                        </TableCell>
                        <TableCell>{second?.mitigation_status}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell
                          style={{ paddingBottom: 0, paddingTop: 0 }}
                          colSpan={6}
                        >
                          <Collapse
                            in={indexes === index}
                            timeout='auto'
                            unmountOnExit
                          >
                            <Box sx={{ margin: 1 }}>
                              {console.log("loader3-2-", loader3)}
                              {loader3 ? <RctPageLoader /> : null}
                              <Table size='small'>
                                <TableHead>
                                  <TableRow>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Current Session ID
                                    </TableCell>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Previous Session ID
                                    </TableCell>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Time Stamp
                                    </TableCell>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Local Migitation ID
                                    </TableCell>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Group Migitation ID
                                    </TableCell>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Previous UEI
                                    </TableCell>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Current UEI
                                    </TableCell>
                                    <TableCell style={{ color: "#bdb5b5" }}>
                                      Deployement Status
                                    </TableCell>
                                  </TableRow>
                                </TableHead>
                                {data?.mitigationThirdList &&
                                  data?.mitigationThirdList?.length > 0 ? (
                                  data?.mitigationThirdList?.map(
                                    (third, index) => {
                                      let intDate = parseInt(
                                        third?.last_report_time
                                      );
                                      let fullDate = Math.floor(
                                        new Date(intDate).getTime() * 1000.0
                                      );
                                      return (

                                        <TableRow
                                          key={index}
                                          style={{
                                            backgroundColor: "#ffffff",
                                            borderBottom: "0px",
                                          }}
                                        >
                                          <TableCell>
                                            {third?.current_session_id
                                              ? third?.current_session_id
                                              : "-"}
                                          </TableCell>
                                          <TableCell>
                                            {third?.last_session_id
                                              ? third?.last_session_id
                                              : "-"}
                                          </TableCell>
                                          <TableCell>
                                            {moment(fullDate).format(
                                              "DD-MM-YYYY"
                                            ) +
                                              " | " +
                                              moment(fullDate).format("hh:mm")}
                                          </TableCell>
                                          <TableCell>
                                            {third?.local_mitigation_id &&
                                              third?.local_mitigation_id !==
                                              "NULL"
                                              ? third?.local_mitigation_id
                                              : "-"}
                                          </TableCell>
                                          <TableCell>
                                            {third?.group_mitigation_id &&
                                              third?.group_mitigation_id !==
                                              "NULL"
                                              ? third?.group_mitigation_id
                                              : "-"}
                                          </TableCell>
                                          <TableCell>
                                            {third?.previous_uei > -1
                                              ? Number(
                                                third?.previous_uei
                                              ).toFixed(2)
                                              : "-"}
                                          </TableCell>
                                          <TableCell>
                                            {third?.current_uei > -1
                                              ? Number(
                                                third?.current_uei
                                              ).toFixed(2)
                                              : "-"}
                                          </TableCell>
                                          <TableCell>
                                            {third?.mitigation_status &&
                                              third?.mitigation_status !== "NULL"
                                              ? third?.mitigation_status
                                              : "-"}
                                          </TableCell>
                                        </TableRow>
                                      );
                                    }
                                  )
                                ) : (
                                  <p>{!loader3 && data?.mitigationThirdList.length == 0 ? "No Data Found" : ""}</p>
                                )}
                              </Table>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })
              ) : (
                <p>{!loader && secondMitigationList.length == 0 ? "No Data Found" : ""}</p>
              )}
            </Table>
          </TableContainer>
        </Drawer>
      </div>

      <div className='FilterContainer'>
        <Drawer
          open={isAIDrawerOpen}
          onClose={() => {
            setAIIsDrawerOpen(false)
            setMitigationAIData([])
          }}
          anchor={"bottom"}
          className='drawer-postion'
        >
          <div className='issue-wraper'>
            <div className='top-left-nav'>
              <Typography
                variant='h5'
                style={{ fontSize: "1.2rem", paddingLeft: "13px" }}
              >
                {" "}
                <span>
                  <ArrowBackIcon onClick={() => {
                    setAIIsDrawerOpen(false)
                    setMitigationAIData([])
                  }} />
                </span>
                <span style={{ padding: "0px 0px 2px 17px" }}>
                  Mitigation Action ID : {data?.aiMitigation ? data?.aiMitigation[0]?.GroupMitigationID:""}
                </span>
              </Typography>
            </div>
            <div>
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                fontSize: "1.2rem",
                paddingRight: "13px",
              }}
            >
              <CloseIcon onClick={() => {
                 setAIIsDrawerOpen(false)
                 setMitigationAIData([])
              }} />
            </div>
          </div>
          {data?.aiMitigation && data?.aiMitigation?.length>0 ? <div className="mitigationai">
            
            <div style={{ margin: '12px 0 0 2rem' }}>
              <h3>Plan Name</h3>
              <p>{data?.aiMitigation[0]?.Planname}</p>
              <h3>Recepient List</h3>
              <div className="recepient">
                <ul>
                  {data?.aiMitigation[0]?.Recipient_List?.map(res => {
                   return <li>{res}</li>
                  })}

                </ul>
              </div>
              <h3>Body</h3>
              <div className="body">
                {data?.aiMitigation[0]?.Body}
              </div>
              <p><span className="spanText">Number of Records : </span> <span>{data?.aiMitigation[0]?.NumOfRecords}</span></p>
              <p><span className="spanText">Created Date : </span><span>{moment(Math.floor(new Date(data?.aiMitigation[0]?.Created_At).getTime() * 1000.0)).format("DD-MM-YYYY")}</span></p>

            </div>

          </div>:<p style={{margin: "11px 0px 0 83px"}}>No Data Found</p>}
        </Drawer>
      </div>
    </>
  );
};
export default MitigationTable;
