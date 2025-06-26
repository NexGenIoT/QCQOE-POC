import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  Paper,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  TableSortLabel,
} from "@mui/material";
// import TableWrapper from "../../UserList/TableWrapper";
// import GlobalProps from "../../UserList/Global.props";
import EditIcon from "@mui/icons-material/Edit";
import { useHistory } from "react-router-dom";
// import { callAPI } from "../../../../axios/index";
// import {  getRoleList } from "../../../../store/actions/RoleAction";
import PlaylistAddIcon from "@mui/icons-material/PlaylistAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import "./AccessControl.scss";
import { dateAndTimeFormatter } from "../UserList/UserList";
// import SearchForm from "Components/SearchForm/SearchForm";
import Row from "../UserList/Row";
import RctModel from "Util/Modal";
import GlobalProps from "../UserList/GlobalProps";
import SearchForm from "../UserList/SearchForm";
import {
  getUserRoleList,
  setUserRoleList,
} from "Store/Actions/UserManagementActions";
import axios from "axios";
import Approve from "../../../Assets/Images/approve-qc.png";
import Delete from "../../../Assets/Images/delete.png";
import Rejected from "../../../Assets/Images/Rejected.png";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";

const DEFAULT_PAGE_OPTION = GlobalProps.DEFAULT_PAGE_OPTION;

const RoleList = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const userRoleReducer = useSelector((state) => state.userReducer);
  console.log({ userRoleReducer });
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [roleList, setRolelist] = useState({});
  const [isSearch, setIsSearch] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchFlag, setSearchFlag] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [apiSuccessMessage, setApiSuccessMessage] = useState("");
  const [apiErrorMessage, setApiErrorMessage] = useState("");
  const [deleteSid, setDeleteSid] = useState();
  const [yesPopup, setYesPopup] = useState();
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [recordData, setRecordData] = useState(
    DEFAULT_PAGE_OPTION.recordsPerPage
  );
  const [pageOptions, setPageOptions] = useState(DEFAULT_PAGE_OPTION);
  const [isLoading, setIsLoading] = useState(false);
  // const [filterData, setFilterData] = useState({
  //   broadcasterSids: [],
  //   freeText: null,});
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, [5000]);
  }, []);
  useEffect(() => {
    dispatch(getUserRoleList(dispatch));
  }, [dispatch]);

  const toggleDrawer = (side, open) => () => {
    side(open);
  };
  //For Rendering Status button
  const renderStatusActionIcon = (row) => {
    let status = "Active";
    if (!row.active) {
      status = "Inactive";
    }
    return (
      <label
        className={`user-status ${
          status === "Active" ? "useractive" : "userdeactiverole"
        }`}
      >
        {status}
      </label>
    );
  };
  //For Rendering Permission Icon
  const renderPermissionsIcon = (row) => {
    return (
      <div>
        {row.active ? (
          <Tooltip title="Permissions" arrow>
            <span
              onClick={() => navigatToPermission(row)}
              className="icon record_permission"
            >
              PERMISSIONS
            </span>
          </Tooltip>
        ) : (
          <Tooltip title="" arrow>
            <span className="icon metadataevent record_permission">
              PERMISSIONS
            </span>
          </Tooltip>
        )}
      </div>
    );
  };
  //For Rendering Edit Icon
  const renderEditIcon = (row) => {
    return (
      <div className="icon-resolution">
        <Tooltip title="Edit Role" className="cursor-pointer" arrow>
          <EditIcon
            onClick={() =>
              history.push({
                pathname: `/dashboard/crm/edit-role`,
                state: {
                  sid: row.id,
                  role: row.role,
                  rolecode: row.roleCode,
                  active: row.active,
                },
              })
            }
            className="icon delete-dot edit-icon"
          />
        </Tooltip>
        <Tooltip title="Delete" className="cursor-pointer" arrow>
          <DeleteIcon
            className="delete-dot del-icon ml-3"
            onClick={() => {
              setShowPopup(true);
              setDeleteSid(row.id);
            }}
          />
        </Tooltip>
      </div>
    );
  };
  //For Rendering Delete Icon
  // const renderDeleteIcon = (row) => {
  //   return <div>
  //       {
  //       <Tooltip title="Delete" arrow>
  //       <DeleteIcon className="delete-dot del-icon ml-3" onClick={()=>{setShowPopup(true);setDeleteSid(row.id)}} />
  //       </Tooltip>
  //       }
  // </div>
  // }
  //For Navigating Edit role page for selected Id by clicking edit icon
  const navigatToPermission = (row) => {
    history.push({
      pathname: "/dashboard/crm/roles-permissions",
      state: {
        roleSelected: row.id,
        // workflowId : row.sid
      },
    });
  };

  //Rows For Table
  let test;
  test = [
    { field: "role", headerName: "Role", flex: 1 },
    // { field: "createdDate", headerName: "Created Date & Time", flex: 1, renderCell: dateAndTimeFormatter },
    {
      field: "modifiedDate",
      headerName: "Updated Date & Time",
      flex: 1,
      renderCell: dateAndTimeFormatter,
    },

    // { field: "roleCode", headerName: "Role Code", flex: 1 },
    {
      field: "active",
      headerName: "Status",
      row: true,
      flex: 0.5,
      renderCell: renderStatusActionIcon,
      sortDirection: false,
      disableSortIcon: true,
    },
    {
      field: "active",
      headerName: "Permissions",
      row: true,
      flex: 0.5,
      renderCell: renderPermissionsIcon,
      sortDirection: false,
      disableSortIcon: true,
    },
    {
      field: "actionCell",
      row: true,
      headerName: "Edit & Delete",
      flex: 0.2,
      renderCell: renderEditIcon,
      sortDirection: false,
      disableSortIcon: true,
    },
  ];
  //For setting Column
  const [columnSetting] = useState(test);
  //For Setting Pages
  const setPage = (_, newPage) => {
    const temp = {
      ...pageOptions,
      recordsPerPage: recordData,
      pageSize: recordData,
      pageNo: newPage + 1,
    };
    setPageOptions(temp);
    // props.getRoleList(temp, props.moduleType);
  };
  //For Populating Grid Data
  const populateGridData = () => {
    const list = props.roleList;
    let rows = [];
    if (list !== undefined && list.roles !== undefined && list.roles !== "") {
      rows = list.roles.map((role) => ({
        ...role,
        // status: userStatusFormatter(user),
        id: (pageOptions.pageNo - 1) * pageOptions.pageSize + role.id,
      }));
      list.rows = rows;
      setRolelist(props.roleList);
    }
    setData(rows);
  };
  //Calling Papulategrid data
  useEffect(() => {
    if (props.roleList !== roleList) {
      populateGridData();
    }
  }, [props.roleList]);

  useEffect(() => {
    // props.getRoleList(pageOptions, props.moduleType);
  }, [pageOptions]);
  //For Handling selected per page
  const handleselectedPerPage = (data) => {
    setRecordData(data);

    let filters = {};

    filters = pageOptions.filter;
    filters.freeText = search;
    // filters.fromDate = formatCalendarDateRange(props.calendarData.fromDate);
    // filters.toDate = formatCalendarDateRange(props.calendarData.toDate);

    let newPageOptions = {
      ...DEFAULT_PAGE_OPTION,
      recordsPerPage: data,
      pageSize: data,
      filter: filters,
    };
    // props.getRoleList(newPageOptions, props.moduleType);
  };
  //Free Search
  const freeSearch = (search) => {
    let filters = {};
    filters = pageOptions.filter;
    filters.freeText = search;
    // filters.fromDate = formatCalendarDateRange(props.calendarData.fromDate);
    // filters.toDate = formatCalendarDateRange(props.calendarData.toDate);

    const pageOptionsTemp = pageOptions;
    const newPageOptions = {
      ...pageOptionsTemp,
      filter: filters,
    };
    setPageOptions(newPageOptions);
    if (search.trim().length === 0) {
      dispatch(getUserRoleList(dispatch));
    } else {
      setIsSearch(search);
      const v = userRoleReducer?.userRoles.filter((val) =>
        val.role.toLocaleLowerCase().includes(search)
      );
      dispatch(setUserRoleList(v));
    }

    // props.getRoleList(newPageOptions, props.moduleType);
  };
  //For Handling Search
  const handleSearch = (search) => {
    freeSearch(search);
    // setFilterData({
    //   broadcasterSids: [],
    //   freeText: null,})
  };
  //For Deleting API
  const deleteAPI = (id) => {
    setShowPopup(false);
    let APIpath = "role";
    console.log("sdfshdf---", id);
    axios
      .delete(`https://qcotp.qoetech.com/role?sid=${id}`)
      .then((response) => {
        setYesPopup(true);
        setApiSuccessMessage(response.data.message);
        dispatch(getUserRoleList(dispatch));
      })
      .catch((error) => {
        setYesPopup(true);
        setApiErrorMessage(error.response?.data?.details);
      });
    // callAPI(`${APIpath}?sid=${id}`, "DELETE")
    // .then((response) => {
    //     setYesPopup(true);
    //  setApiSuccessMessage(response.message);
    // //  props.getRoleList(pageOptions, props.moduleType);
    // })
    // .catch((error) => {
    //     setYesPopup(true);
    //     setApiErrorMessage(error.response?.data?.errorMessage);
    // });
  };
  //For closing Popup
  const closePopupHandler = () => {
    setShowPopup(false);
    setApiSuccessMessage("");
    // setshowDeletePopup(false);
  };
  //For Navigating To Role List
  const NavigateToRoleList = () => {
    setYesPopup(false);
    setApiSuccessMessage("");
    setApiErrorMessage("");
  };
  let first;

  let second;
  const descendingComparator = (a, b, orderBy) => {
    first = a[orderBy];

    second = b[orderBy];

    if (first && typeof first === "string") {
      first = first.toLocaleLowerCase();
    }

    if (second && typeof second === "string") {
      second = second.toLocaleLowerCase();
    }

    if (
      first &&
      first.props &&
      first.props.children &&
      typeof first.props.children === "string" &&
      typeof first === "object"
    ) {
      first = first.props.children.toLocaleLowerCase();
    }

    if (
      second &&
      second.props &&
      second.props.children &&
      typeof second.props.children === "string" &&
      typeof second === "object"
    ) {
      second = second.props.children.toLocaleLowerCase();
    }

    if (second < first) {
      return -1;
    }

    if (second > first) {
      return 1;
    }

    return 0;
  };
  const getComparator = (order, orderBy) => {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  };

  const stableSort = (array, comparator) => {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order != 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };

  return (
    <div className="mx-3 px-1 mt-2">
      <div>
        <div className="d-flex justify-content-between">
          <div className="mt-2 sub-header mb-3">
            <h1>Roles ({userRoleReducer?.userRoles.length})</h1>
          </div>
          <div>
            <div
              className="d-inline-block createuser cursor-pointer mr-2"
              onClick={() => history.push(`/dashboard/crm/add-role`)}
            >
              <span>Add Role</span>
            </div>
            <div className="d-inline-block search-responsive search">
              <SearchForm
                handleSearch={handleSearch}
                searchText={searchText}
                flag={searchFlag}
                placeHolderText="Search Role..."
              />
            </div>
          </div>
        </div>
        {/* <div className="d-flex justify-content-between">
            <div className="mt-2 sub-header">
           <h1>Roles ({roleList.totalCount})</h1>
           </div>
           <div>
                     <div
                       className="inline-block createuser cursor-pointer"
                        onClick={() => history.push(`/UserManagement/add-role`)}
                        >
         
                          <span >Add Role</span>
                        </div> 
                        <div className="inline-block search-responsive search">
                          <SearchForm handleSearch={handleSearch} searchText={searchText} flag={searchFlag} placeHolderText='Search Role...'/>
                        </div>
                        </div>
            </div> */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {columnSetting.map((headCell) => (
                  <TableCell
                    key={headCell.field}
                    align={headCell.numeric ? "right" : "left"}
                    padding={headCell.disablePadding ? "none" : "normal"}
                    sortDirection={orderBy === headCell.field ? order : false}
                    style={{ paddingLeft: 10, whiteSpace: "nowrap" }}
                  >
                    <div>
                      <TableSortLabel
                        active={orderBy === headCell.field}
                        direction={orderBy === headCell.field ? order : "asc"}
                        // onClick={createSortHandler(headCell.field)}
                      >
                        <span
                          style={{ fontWeight: "bold" }}
                          className="font-resolution"
                        >
                          {headCell.headerName}
                        </span>
                        {/* {orderBy === headCell.field ? (
                      <Box component="span">
                        {order === "desc"
                          ? "sorted descending"
                          : "sorted ascending"}
                      </Box>
                    ) : null} */}
                      </TableSortLabel>
                    </div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {userRoleReducer?.userRoles.length === 0 ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={columnSetting.length + 1}>
                    <Typography
                      variant="subtitle2"
                      className="text-center my-3"
                    >
                      {isLoading ? <RctPageLoader /> : "No Roles Found."}
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {stableSort(
                  userRoleReducer?.userRoles,
                  getComparator(order, orderBy)
                )
                  // .slice(props.pageNo * rowsPerPage, props.pageNo * rowsPerPage + rowsPerPage)
                  .map((row, index) => {
                    // const isItemSelected = isSelected(row.sid);
                    // const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <Row
                        key={row.id}
                        columns={columnSetting}
                        row={row}
                        data={userRoleReducer?.userRoles}
                        module="rolesList"
                        // isItemSelected={isItemSelected}
                        // handleCheckboxClick={selectRowClick}
                        // {...rest}
                      />
                    );
                  })}
              </TableBody>
            )}
          </Table>
        </TableContainer>
      </div>
      <RctModel
        isOpen={showPopup}
        footer={{
          primaryButton: {
            action: closePopupHandler,
            name: "Cancel",
            addClass: "btn btn-danger login-button mr-3",
          },
          secondaryButton: {
            action: () => deleteAPI(deleteSid),
            name: "Yes",
            addClass: "btn btn-success px-4 login-button",
          },
        }}
      >
        <span className="d-block">
          <img src={Delete} style={{ width: 60 }} />
          <p className="mt-2"></p>
        </span>
        <br />
        <h5>Do you really want to Delete Role ?</h5>
      </RctModel>
      <RctModel
        isOpen={yesPopup}
        footer={{
          secondaryButton: {
            action:
              apiSuccessMessage || setApiErrorMessage
                ? NavigateToRoleList
                : " ",
            name: "OK",
            addClass: "btn btn-success px-4 login-button ",
          },
        }}
      >
        {apiSuccessMessage && (
          <div className="bottom-style">
            <span className="d-block">
              <img src={Approve} style={{ width: 60 }} />
              <p className="mt-2"></p>
            </span>
            <br />
            <h5>{apiSuccessMessage} </h5>
            <br />
          </div>
        )}
        {apiErrorMessage && (
          <div className="bottom-style">
            <span className="d-block">
              <img src={Rejected} style={{ width: 60 }} />
              <p className="mt-2"></p>
            </span>
            <br />
            <h5>{apiErrorMessage} </h5>
            <br />
          </div>
        )}
      </RctModel>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    // roleList: state.RolesReducer.roleList
  };
};

const mapDispatcherToProps = (dispatch) => {
  return {
    // getRoleList: (pageOptions, type) => dispatch(getRoleList(pageOptions, type)),
  };
};

export default connect(mapStateToProps, mapDispatcherToProps)(RoleList);

const rolesData = [
  {
    id: 94,
    role: "QA",
    roleCode: "ROLE_AD_MINU",
    createdBy: "qoe@gmail.com",
    createdDate: 1682333784000,
    modifiedBy: "qoe@gmail.com",
    modifiedDate: 1682406054000,
    active: true,
  },
  ,
];
