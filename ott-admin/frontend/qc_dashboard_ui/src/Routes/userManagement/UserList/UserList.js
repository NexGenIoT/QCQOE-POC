import React from "react";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Paper,
  Box,
  Typography,
  Tooltip,
  Switch,
} from "@mui/material";
// import { Switch } from "@material-ui/core";
import EditIcon from "@mui/icons-material/Edit";
import Row from "./Row";
import moment from "moment";
import GlobalProps from "./GlobalProps";
import { EditNotifications } from "@mui/icons-material";
import { useRef } from "react";
import "./userList.scss";
import SearchForm from "./SearchForm";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  getPermissionList,
  getRolePermission,
  getUserManagementList,
  getUserRolePermission,
  getUserRoles,
  setUserManagementList,
  userListStatus,
} from "Store/Actions/UserManagementActions";
import { Link, useHistory } from "react-router-dom";
import { isValidRole } from "Constants/constant";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";

const DEFAULT_ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 75, 100];
const DEFAULT_PAGE_OPTION = GlobalProps.DEFAULT_PAGE_OPTION;

let userDetails;
let availableRoles;
let availablePermissions;
let today = new Date().toLocaleDateString();

export const dateAndTimeFormatter = (params) => {
  if (params !== null) {
    return (
      moment(params).format(GlobalProps.dateFormat) +
      " | " +
      moment(params).format("HH:mm")
    );
  }
};
export default function UserList(props) {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [filterData, setFilterData] = useState([]);
  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, [5000]);
  }, []);

  useEffect(() => {
    dispatch(getUserManagementList(dispatch));
    dispatch(getUserRoles(dispatch));
    dispatch(userListStatus(dispatch, history));
    // dispatch(getRolePermission(dispatch, 1));
    // dispatch(getPermissionList(dispatch));
    // dispatch(getUserRolePermission(dispatch, 19));
  }, [dispatch]);
  console.log({ userReducer, isLoading });

  let validRoleClassName = isValidRole("USER_CREATE")
    ? "cursor-pointer"
    : "actionButtonDisable";
  let validRoleClassNamePending = isValidRole("USER_PENDING_APPROVAL")
    ? "cursor-pointer"
    : "actionButtonDisable";

  const isUserEnableModalRef = useRef({
    userConfirmationModalData: null,
    acknowledgementModalData: null,
  });
  const renderUserAccessIcon = (row) => {
    return (
      <span className={`${row.roles[0].role == "ADMIN" && "usertype-admin"}`}>
        <Link
          to={{
            pathname: "/dashboard/crm/roles-permissions",
            state: {
              roleSelected: row.roles[0].id,
            },
          }}
        >
          {row.roles[0].role}
        </Link>
      </span>
    );
  };
  const renderRoleIcon = (row) => {
    if (props.moduleType == "isApprovalPending") {
      return <span>{row.phoneNo} </span>;
    } else {
      return <span>{row.role}</span>;
    }
  };

  const handleToggleChange = (e, row) => {
    const sid = row.sid;
    const userName = row.firstName + " " + row.lastName;
    const { name, value } = e.target;
    const isEnabled = value !== "true";
    console.log({ e, row, isEnabled, rowEnable: value });
    setShowModal(true);
    const newModalRefData = {
      userConfirmationModalData: {
        sid,
        userName,
        isEnabled,
      },
      acknowledgementModalData: null,
    };
    isUserEnableModalRef.current = newModalRefData;
  };

  const renderStatusActionIcon = (row) => {
    let status = "Active";
    const expired =
      moment(row.accessTillDate).format("YYYY-MM-DD") <
      moment(today).format("YYYY-MM-DD");
    if (row.accountLocked) {
      status = "Account Locked";
    } else if (expired) {
      status = "Expired";
    } else if (!row.enabled) {
      status = "Inactive";
    }
    return (
      <label
        className={`user-status ${
          !row.enabled
            ? "userdeactive"
            : row.accountLocked
            ? "userdeactive userlocked"
            : ""
        } ${row.enabled ? "useractive" : ""} ${expired ? "userexpired" : ""}`}
      >
        {status}
      </label>
    );
  };
  const renderActionIcon = (row) => {
    return (
      <div className="actions d-flex align-items-center">
        {/* {<Tooltip title="Edit" arrow>
					<EditIcon className="cursor-pointer edit-icon" onClick={() =>
						{history.push({ pathname: `/dashboard/crm/edit-user`, state: { sid: row.sid }, isEditlist: true })}

					} />
				</Tooltip>} */}

        {
          isValidRole("ROLE_ADMIN") ? (
            <Tooltip title="Edit" arrow>
              <EditIcon
                className="cursor-pointer edit-icon"
                onClick={() =>
                  history.push({
                    pathname: `/dashboard/crm/edit-user`,
                    state: { sid: row.sid },
                    isEditlist: true,
                  })
                }
              />
            </Tooltip>
          ) : (
            <Tooltip title="" arrow>
              <EditIcon className="metadataevent" />
            </Tooltip>
          )
          //    : <Tooltip title="" arrow>
          //     <EditIcon className="metadataevent" />
          //    </Tooltip>
        }

        {/* {<Tooltip title={row.enabled ? "Active" : "Inactive"} arrow>
					<Switch
						name="enabled"
						onChange={(event) => handleToggleChange(event, row)}
						inputProps={{ "aria-label": "controlled" }}
						value={row.enabled}
						checked={row.enabled}
						className={`${row.enabled === false ? 'switchStyleuser switchuser-inactive' : 'switchStyleuser switchuser-active'}`}
					/>
				</Tooltip>} */}
      </div>
    );
  };
  const dateTime = (row) => {
    // console.log({ dateTime: row })

    if (row !== null) {
      return <span>{dateAndTimeFormatter(row)}</span>;
    } else {
      return <span>{dateAndTimeFormatter(row?.createdDate)}</span>;
    }
    // return userReducer.userManagementList.map((item) => {
    // 	console.log({ item })
    // 	if (item.modifiedDate) {
    // 		return <span>{dateAndTimeFormatter(item?.modifiedDate)}</span>
    // 	} else {
    // 		return <span>{dateAndTimeFormatter(item?.createdDate)}</span>
    // 	}
    // })
  };
  const [modal, setShowModal] = useState(false);
  const [isSearch, setIsSearch] = useState();
  const [searchText, setSearchText] = useState("");
  const [searchFlag, setSearchFlag] = useState(false);
  let test;
  test = [
    { field: "firstName", headerName: "First Name", flex: 1 },
    { field: "lastName", headerName: "Last Name", flex: 1 },
    { field: "userName", headerName: "Email", flex: 1 },
    { field: "phoneNo", headerName: "Phone", flex: 1 },
    // {
    //   field: "role",
    //   row: true,
    //   headerName: "Role",
    //   flex: 0.5,
    //   renderCell: renderRoleIcon,
    //   sortDirection: false,
    // },
    {
      field: "role",
      row: true,
      headerName: "Role",
      flex: 0.5,
      renderCell: renderUserAccessIcon,
      sortDirection: false,
    },
    // { field: "createdDate", headerName: "Created Date & Time", flex: 1, renderCell: dateAndTimeFormatter },
    {
      field: "modifiedDate",
      headerName: "Updated Date & Time",
      flex: 1,
      renderCell: dateTime,
    },

    {
      field: "status",
      headerName: "Status",
      row: true,
      flex: 0.5,
      renderCell: renderStatusActionIcon,
      sortDirection: false,
    },
    {
      field: "actionCell",
      row: true,
      headerName: "Actions",
      flex: 0.5,
      renderCell: renderActionIcon,
      sortDirection: false,
      disableSortIcon: true,
    },
  ];
  const [columnSetting] = useState(test);
  const [orderBy, setOrderBy] = useState("");
  const [order, setOrder] = useState("asc");
  const [pageOptions, setPageOptions] = useState(DEFAULT_PAGE_OPTION);
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
  const handleSearch = (search) => {
    // setPageOptions({
    //   ...pageOptions,
    //   filter: search,
    // });
    freeSearch(search);
    // setFilterData({
    //   broadcasterSids: [],
    //   channelSids: [],
    //   freeText: null,
    //   roleSids: [],
    //   userTypeSids: [],
    //   userStatus:[],
    // })
  };
  const freeSearch = (search) => {
    let filters = {};
    // masters.forEach((m) => {
    //   filters[m.filter] = [];
    //   filterMasterData[m.type].forEach((f) => {
    //     if (f.selected) {
    //       filters[m.filter].push(f[m.id]);
    //     }
    //   });
    // });
    filters = pageOptions.filter;
    filters.freeText = search;
    // filters.fromDate = formatCalendarDateRange(props.calendarData.fromDate);
    // filters.toDate = formatCalendarDateRange(props.calendarData.toDate);

    const pageOptionsTemp = pageOptions;
    const newPageOptions = {
      ...pageOptionsTemp,
      filter: filters,
    };
    // setPageOptions(newPageOptions);
    if (search.trim().length === 0) {
      console.log({ zero: "search o" });
      dispatch(getUserManagementList(dispatch));
    } else {
      setIsSearch(search);
      const v = userReducer?.userManagementList.filter((val) =>
        val.firstName.toLocaleLowerCase().includes(search)
      );
      dispatch(setUserManagementList(v));
      console.log({ searched: v });
    }

    // setLoading(true);
    // dispatch(getUserManagementList(dispatch, {freeSearch: filters.freeText}, 'search'))
  };

  return (
    <div className="dashboard-container workspace mt-2 mx-3 px-1">
      <div className="sub-header d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-md-0 mb-3">
          {"User Management List"}({userReducer?.userManagementList.length})
        </h1>

        <div className="d-flex align-items-center top-right-filter">
          {
            <>
              <div
                className={`mb-3 mb-md-0 mr-2 rounded-pill createuser ${validRoleClassName}`}
                onClick={() =>
                  props.history.push({
                    pathname: "/dashboard/crm/create-user",
                    isUserlist: true,
                  })
                }
              >
                {/* <FontAwesomeIcon icon={faUserEdit}/>  */}
                {/* <i className="fa-solid fa-user-pen"></i> */}
                Create User
              </div>
            </>
          }

          {/* className="has-search position-relative" */}
          {/* <img src="../Images/atIcon.png" className="form-control-feedback" /> */}
          {/* <Input
                      type="text"
                      name="search"
                      id="search"
                      placeholder="Search"
                      className="rounded-pill"
                      // onChange={handleChange}
                    /> */}
          <SearchForm
            handleSearch={handleSearch}
            searchText={searchText}
            flag={searchFlag}
            placeHolderText="Search User..."
          />

          {/* <div className="filter">
                          <FontAwesomeIcon icon={faUserEdit} />
                        </div> */}
        </div>
      </div>
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
          {userReducer?.userManagementList.length === 0 ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={columnSetting.length + 1}>
                  <Typography variant="subtitle2" className="text-center my-3">
                    {isLoading ? <RctPageLoader /> : "No Users Found"}
                  </Typography>
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {stableSort(
                userReducer.userManagementList,
                getComparator(order, orderBy)
              )
                // .slice(props.pageNo * rowsPerPage, props.pageNo * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  // const isItemSelected = isSelected(row.sid);
                  // const labelId = `enhanced-table-checkbox-${index}`;
                  return (
                    <Row
                      key={row.sid}
                      columns={columnSetting}
                      row={row}
                      data={userReducer.userManagementList}
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
  );
}

const tableDemoBody = [
  {
    sid: 91,
    firstName: "STB",
    lastName: "Monitoring",
    userName: "",
    phoneNo: "1234567890",
    accountLockedDate: null,
    wrongPwdConsecutiveAttempt: 0,
    accessTillDate: 1731887999000,
    gender: null,
    roles: [
      {
        id: 1,
        role: "ADMIN",
        roleCode: "ROLE_ADMIN",
        createdBy: null,
        createdDate: null,
        modifiedBy: "",
        modifiedDate: 1665728159000,
        active: true,
      },
    ],
    permissions: [],
    createdBy: "",
    createdDate: 1681731890000,
    modifiedBy: "",
    modifiedDate: 1681802521000,
    enabled: true,
    defaultPwdChanged: true,
    approvalPending: false,
    accountLocked: false,
  },
  {
    sid: 89,
    firstName: "Tester",
    lastName: "Name",
    userName: "qoe5@gmail.com",
    phoneNo: "",
    accountLockedDate: null,
    wrongPwdConsecutiveAttempt: 0,
    accessTillDate: 1682035199000,
    gender: null,
    roles: [
      {
        id: 35,
        role: "Tester",
        roleCode: "ROLE_TESTER",
        createdBy: "",
        createdDate: 1665729778000,
        modifiedBy: "",
        modifiedDate: 1672731419000,
        active: true,
      },
    ],
    permissions: [
      {
        id: 15,
        permission: "Average Network Speed",
        parentPermissionSid: 1,
        permissionCode: "MENU_AVERAGE_NETWORK_SPEED",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 13,
        permission: "Total App Version",
        parentPermissionSid: 1,
        permissionCode: "MENU_TOTAL_APP_VERSION",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 20,
        permission: "Enable/Disable User",
        parentPermissionSid: 16,
        permissionCode: "USER_ENABLE_DISABLE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 18,
        permission: "Create User",
        parentPermissionSid: 16,
        permissionCode: "USER_CREATE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 5,
        permission: "Create User",
        parentPermissionSid: 1,
        permissionCode: "MENU_USER_CREATE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 7,
        permission: "User Privileges",
        parentPermissionSid: 1,
        permissionCode: "MENU_USER_PRIVILEGES",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 17,
        permission: "User List",
        parentPermissionSid: 16,
        permissionCode: "USER_LIST",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 22,
        permission: "Pending Approval",
        parentPermissionSid: 16,
        permissionCode: "USER_PENDING_APPROVAL",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 2,
        permission: "User Management",
        parentPermissionSid: 1,
        permissionCode: "MENU_USER_MANAGEMENT",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 19,
        permission: "Update User",
        parentPermissionSid: 16,
        permissionCode: "USER_UPDATE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 8,
        permission: "Dashboard",
        parentPermissionSid: 1,
        permissionCode: "MENU_DASHBOARD",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 23,
        permission: "Total Launcher Crash",
        parentPermissionSid: 1,
        permissionCode: "TOTAL_LAUNCHER_CRASH",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 4,
        permission: "Roles",
        parentPermissionSid: 1,
        permissionCode: "MENU_ROLES",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 3,
        permission: "Users",
        parentPermissionSid: 1,
        permissionCode: "MENU_USERS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 9,
        permission: "Events Captured",
        parentPermissionSid: 1,
        permissionCode: "MENU_EVENT_CAPTURED",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 14,
        permission: "Average Battery Status",
        parentPermissionSid: 1,
        permissionCode: "MENU_BATTERY_STATUS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 6,
        permission: "Roles And Permissions",
        parentPermissionSid: 1,
        permissionCode: "MENU_ROLES_AND_PERMISSIONS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 11,
        permission: "Total No. of STB",
        parentPermissionSid: 1,
        permissionCode: "MENU_TOTAL_STB",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 21,
        permission: "Access Control",
        parentPermissionSid: 16,
        permissionCode: "USER_ACCESS_CONTROL",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 10,
        permission: "SID/CDSN Levels Details",
        parentPermissionSid: 1,
        permissionCode: "MENU_SID_CDSN_LEVELS_DETAILS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 12,
        permission: "Total Firmware Version",
        parentPermissionSid: 1,
        permissionCode: "MENU_FIRMWARE_VERSION",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
    ],
    createdBy: "qoe5@gmail.com",
    createdDate: 1681720763000,
    modifiedBy: "Rachana.Kottapotu@qoe.com",
    modifiedDate: 1681797121000,
    enabled: false,
    defaultPwdChanged: true,
    approvalPending: false,
    accountLocked: false,
  },
  {
    sid: 76,
    firstName: "Harsh",
    lastName: "Sharma",
    userName: "qoey@gmail.com",
    phoneNo: "9999999998",
    accountLockedDate: null,
    wrongPwdConsecutiveAttempt: 0,
    accessTillDate: 1681343999000,
    gender: null,
    roles: [
      {
        id: 35,
        role: "Tester",
        roleCode: "ROLE_TESTER",
        createdBy: "gaurav.kumar@qoe.com",
        createdDate: 1665729778000,
        modifiedBy: "Srinath.Reddy2@qoe.com",
        modifiedDate: 1672731419000,
        active: true,
      },
    ],
    permissions: [
      {
        id: 15,
        permission: "Average Network Speed",
        parentPermissionSid: 1,
        permissionCode: "MENU_AVERAGE_NETWORK_SPEED",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 20,
        permission: "Enable/Disable User",
        parentPermissionSid: 16,
        permissionCode: "USER_ENABLE_DISABLE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 7,
        permission: "User Privileges",
        parentPermissionSid: 1,
        permissionCode: "MENU_USER_PRIVILEGES",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 21,
        permission: "Access Control",
        parentPermissionSid: 16,
        permissionCode: "USER_ACCESS_CONTROL",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 2,
        permission: "User Management",
        parentPermissionSid: 1,
        permissionCode: "MENU_USER_MANAGEMENT",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 18,
        permission: "Create User",
        parentPermissionSid: 16,
        permissionCode: "USER_CREATE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 8,
        permission: "Dashboard",
        parentPermissionSid: 1,
        permissionCode: "MENU_DASHBOARD",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 13,
        permission: "Total App Version",
        parentPermissionSid: 1,
        permissionCode: "MENU_TOTAL_APP_VERSION",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 4,
        permission: "Roles",
        parentPermissionSid: 1,
        permissionCode: "MENU_ROLES",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 19,
        permission: "Update User",
        parentPermissionSid: 16,
        permissionCode: "USER_UPDATE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 23,
        permission: "Total Launcher Crash",
        parentPermissionSid: 1,
        permissionCode: "TOTAL_LAUNCHER_CRASH",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 3,
        permission: "Users",
        parentPermissionSid: 1,
        permissionCode: "MENU_USERS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 11,
        permission: "Total No. of STB",
        parentPermissionSid: 1,
        permissionCode: "MENU_TOTAL_STB",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 6,
        permission: "Roles And Permissions",
        parentPermissionSid: 1,
        permissionCode: "MENU_ROLES_AND_PERMISSIONS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 9,
        permission: "Events Captured",
        parentPermissionSid: 1,
        permissionCode: "MENU_EVENT_CAPTURED",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 14,
        permission: "Average Battery Status",
        parentPermissionSid: 1,
        permissionCode: "MENU_BATTERY_STATUS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 10,
        permission: "SID/CDSN Levels Details",
        parentPermissionSid: 1,
        permissionCode: "MENU_SID_CDSN_LEVELS_DETAILS",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 22,
        permission: "Pending Approval",
        parentPermissionSid: 16,
        permissionCode: "USER_PENDING_APPROVAL",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 12,
        permission: "Total Firmware Version",
        parentPermissionSid: 1,
        permissionCode: "MENU_FIRMWARE_VERSION",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 17,
        permission: "User List",
        parentPermissionSid: 16,
        permissionCode: "USER_LIST",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
      {
        id: 5,
        permission: "Create User",
        parentPermissionSid: 1,
        permissionCode: "MENU_USER_CREATE",
        createdBy: null,
        createdDate: null,
        modifiedBy: null,
        modifiedDate: null,
        active: true,
      },
    ],
    createdBy: "qoey@gmail.com",
    createdDate: 1681282444000,
    modifiedBy: "hemant.hs828@gmail.com",
    modifiedDate: 1681286693000,
    enabled: true,
    defaultPwdChanged: true,
    approvalPending: false,
    accountLocked: false,
  },
];
