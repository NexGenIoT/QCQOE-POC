import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
// import { callAPI } from "../../../../axios/index";
// import { getMasterPermissions } from "../../../../store/actions/RolesAndPermissionActions";
import { Grid } from "@mui/material";
import AddPermission from "../AddPermission/AddPermission";
import PermissionBlock from "../PermissionBlock/PermissionBlock";
// import RctModel from "../../../Components/Modal/Examples/Modal";
import AddIcon from "@mui/icons-material/Add";
import { useHistory } from "react-router-dom";
import { Row, Col, Card, Button } from "reactstrap";
import { Link } from "react-router-dom";
// import "../../../../assets/common.scss";
import Controls from "Routes/userManagement/controls/Controls";
import RctModel from "Util/Modal";
import {
  getPermissionList,
  getProject,
  getRolePermission,
  getUserRoles,
} from "Store/Actions/UserManagementActions";
import { NotificationManager } from "react-notifications";
import axios from "axios";
const RoleAndPermission = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const userReducer = useSelector((state) => state.userReducer);
  const { userRoleList } = userReducer || {};
  const [addPermission, setAddPermission] = useState(false);
  const [error, setError] = useState("");
  const [projectError, setProjectError] = useState("");
  const [selectedModule, setSelectedModule] = useState(0);
  const [userList, setUserList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [userInfo, setUserInfo] = useState({});
  const [roleInfo, setRoleInfo] = useState([]);
  const [selectedPermissions, setSelectedPermissions] = useState({});
  const [userPermissionSuccess, setUserPermissionSuccess] = useState();
  const [userPermissionError, setUserPermissionError] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const { state } = props.location;
  const { roleSelected } = state !== undefined ? state : 0;
  const [user, setUser] = useState(roleSelected);
  const [projectValue, setProjectValue] = useState("");
  const [flag, setFlag] = useState(false);
  const [selectRoles, setSelectRoles] = useState(false);
  const [selectProject, setSelectProject] = useState(false);

  const userDetails = JSON.parse(localStorage.getItem("userDetails"));
  useEffect(() => {
    dispatch(getUserRoles(dispatch));
    // setUserList(userReducer?.userRoleList);
  }, [dispatch]);
  useEffect(() => {
    setUserList(userReducer?.userRoleList);
  }, [userReducer?.userRoleList]);

  useEffect(() => {
    dispatch(getUserRoles(dispatch));
    dispatch(getProject(dispatch));
    if (user) {
      dispatch(getRolePermission(dispatch, user));
    }
  }, [user]);
  useEffect(() => {
    setProjectList(userReducer?.projectData);
    setProjectValue(userReducer?.projectData[0]?.sid);
  }, [userReducer.projectData]);
  // alert(userDetails.userName)
  const userRole = userDetails?.roles[0]?.role;
  console.log(
    "role new",
    userRole,
    { userDetails },
    { userList, userRoleList, userReducer, projectList, projectValue }
  );

  const populateGridData = (userList) => {
    let rows = [];
    if (userList !== undefined && userList !== "") {
      userList.forEach((u) => {
        rows.push({ ...u, id: u.sid, title: u.name });
      });
    }
    setUserList(rows);
  };

  const getUserList = () => {
    const apiPath = `/master?type=ROLES`;
    populateGridData(userList);
    // callAPI(apiPath, "GET")
    //   .then((res) => {
    //     const data = res.data;
    //     populateGridData(data);
    //   })
    //   .catch((err) => {
    //     console.log(err.message);
    //   })
    //   .finally((_) => {});
  };

  // const getUserRole = () => {
  //   const apiPath = `/role/permission?roleSid=${user}`;
  //   // // api.get(apiPath)
  //   // callAPI(apiPath, "GET")
  //   //   .then((res) => {
  //   //     // console.log("getuserole",res)
  //   //     setRoleInfo(res);
  //   //   })
  //   //   .catch((err) => {
  //   //     console.log(err.message);
  //   //   })
  //   //   .finally((_) => {});
  // };

  const addPermissionHandler = (args) => {
    const temp = { ...selectedPermissions };
    if (
      args.selectedPermission &&
      args.selectedPermission.some((x) => x.checked == true)
    ) {
      temp[args.module] = args;
    } else {
      delete temp[args.module];
    }
    setUserInfo({
      ...userInfo,
      tempPermissions: temp,
    });
    setSelectedPermissions(temp);
  };

  const showPermissionModal = () => {
    if (user && projectValue) {
      setSelectedModule(0);
      setAddPermission(true);
    } else if (projectValue) {
      setError("Please Select Role");
    } else if (user) {
      setProjectError("Please Select Project");
    } else {
      setError("Please Select Role.");
      setProjectError("Please Select Project.");
    }
  };

  const updatePermissionHandler = (item) => {
    setFlag(true);
    setSelectedModule(item.module);
    setAddPermission(true);
  };

  const deletePermissionHandler = (item) => {
    const temp = { ...selectedPermissions };
    delete temp[item.module];
    setSelectedPermissions(temp);
  };

  const resetData = () => {
    setUser(0);
    setSelectedPermissions({});
    getUserList();
  };

  const saveData = () => {
    const userSid = user;
    const permissionSids = [];
    Object.keys(selectedPermissions).forEach((moduleId) => {
      selectedPermissions[moduleId].selectedPermission.forEach((per) => {
        if (per.checked) {
          permissionSids.push(per.id);
        }
      });
    });
    if (userSid === 0) {
      //   toast(<Toaster msgType={'error'} message='Please select User' />);
    } else {
      const user = localStorage.getItem("user_id");
      const apiPath = `https://qc8.qoeqoe.com/role/permission`;
      axios
        .put(
          apiPath,
          { roleSid: userSid, permissionSids: permissionSids },
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        )
        .then((res) => {
          NotificationManager.success("Role updated successfully !");
          history.goBack();
        })
        .catch((err) => {
          NotificationManager.error("Error while updating role.");
        });
      //   callAPI(apiPath, "PUT", {
      //     roleSid: userSid,
      //     permissionSids: permissionSids,
      //   })
      //     .then((res) => {
      //       setShowPopup(true);
      //       setUserPermissionSuccess(res.message);
      //       resetData();
      //     })
      //     .catch((err) => {
      //       setShowPopup(true);
      //       setUserPermissionError(err.message);
      //     })
      //     .finally((_) => {});
    }
  };

  useEffect(() => {
    const userInfo = userList.find((u) => u.sid === user);
    const tempPermissions = {};
    if (userInfo) {
      const savedPermissions = userReducer?.rolePermission?.permissions; //roleInfo.permissions;
      if (savedPermissions) {
        savedPermissions.forEach((sp) => {
          if (tempPermissions[sp.parentPermissionSid] === undefined) {
            tempPermissions[sp.parentPermissionSid] = {};
            tempPermissions[sp.parentPermissionSid].module =
              sp.parentPermissionSid;
            tempPermissions[sp.parentPermissionSid].selectedPermission = [];
          }
          tempPermissions[sp.parentPermissionSid].selectedPermission.push({
            ...sp,
            checked: true,
            title: sp.permission,
          });
        });
      }
    }
    console.log({ tempPermissions }, "roleandpermission");

    setSelectedPermissions(tempPermissions);
    setUserInfo({
      ...userInfo,
      tempPermissions: tempPermissions,
    });
  }, [userReducer?.permissionList]);

  useEffect(() => {
    setRoleInfo(userReducer.rolePermission);
  }, [userReducer?.rolePermission?.permissions]);

  useEffect(() => {
    if (projectValue) {
      dispatch(getPermissionList(dispatch, projectValue));
    }
  }, [projectValue]);

  const closePopupHandler = () => {
    setShowPopup(false);
    setUserPermissionSuccess(null);
    setUserPermissionError(null);
  };

  return (
    <div className="mx-3 px-1 mt-2">
      <div className="sub-header">
        <h1>Role & Permission</h1>
      </div>
      <div className="roles-and-permission">
        <div className="d-flex justify-content-between">
          <div className="position-relative">
            <label className="d-block">Roles</label>
            <Controls.Select
              className={
                "control-select position-relative customdropdown drop-padding"
              }
              name={"userrolesandpermissions"}
              value={user}
              items={userList}
              optionDisabledProp={userRole}
              placeholder="Please Select Role"
              onChange={(e) => {
                setUser(e.target.value);
                e.target.value !== 0 && setError("");
                setSelectRoles(true);
              }}
              error={error}
            />
            <span className="pe-7s-angle-down rolesdown"></span>
            {/* {!selectRoles && <p className="">Please Select Role</p>} */}
          </div>
          <div className="position-relative">
            <label className="d-block">Select Project</label>
            <Controls.Select
              className={
                "control-select position-relative customdropdown drop-padding"
              }
              name={"userrolesandpermissions"}
              value={projectValue}
              items={projectList}
              optionDisabledProp={userRole}
              placeholder="Please Select Project"
              onChange={(e) => {
                setProjectValue(e.target.value);
                e.target.value !== 0 && setProjectError("");
                setSelectProject(true);
              }}
              error={projectError}
            />
            <span className="pe-7s-angle-down rolesdown"></span>
            {/* {!selectRoles && <p className="">Please Select Role</p>} */}
          </div>
          <div>
            <div
              className="createuser mt-3 cursor-pointer"
              onClick={showPermissionModal}
            >
              {/* <span > */}
              {/* <AddIcon className="add-icon-style" /> */}
              <span className="add-icon-style" style={{ "font-size": "20px" }}>
                +
              </span>
              <span> Add Permission</span>
              {/* </span> */}
            </div>
          </div>
        </div>
        {user > 0 && (
          <>
            <Grid item xs={12} className="permission-list px-0">
              {Object.keys(selectedPermissions).length > 0 ? (
                <PermissionBlock
                  items={selectedPermissions}
                  updateHandler={updatePermissionHandler}
                  deleteHandler={deletePermissionHandler}
                />
              ) : (
                <div
                  className=" roles-permission-bg perm-list"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginTop: 30,
                  }}
                >
                  No Permissions available.
                </div>
              )}
            </Grid>
            <div className="d-flex justify-content-end mt-3">
              <button
                onClick={resetData}
                size="small"
                type="submit"
                className="reset-btn cursor-pointer"
              >
                Reset
              </button>
              <button
                onClick={saveData}
                size="small"
                type="submit"
                className="create-btn ml-3 cursor-pointer"
              >
                Update
              </button>
            </div>
          </>
        )}

        <RctModel
          isOpen={showPopup}
          isBackDropEnabled={false}
          // closeModal={closePopupHandler}
          footer={{
            secondaryButton: {
              action: closePopupHandler,
              name: "OK",
              addClass: "btn btn-success px-4",
            },
          }}
        >
          {userPermissionSuccess && (
            <span className="d-block">
              <img src="../Images/approve-qc.png" style={{ width: 60 }} />
              <h3 className="mt-2">{userPermissionSuccess}</h3>
            </span>
          )}
          {userPermissionError && userPermissionError !== "" && (
            <h3>{userPermissionError}</h3>
          )}
        </RctModel>
      </div>
      {addPermission && (
        <AddPermission
          edit={flag}
          open={addPermission}
          closeHandler={() => {
            setAddPermission(false);
            setFlag(false);
          }}
          onClickHandler={addPermissionHandler}
          selectedModule={selectedModule}
          setSelectedModule={setSelectedModule}
          selectedPermissions={selectedPermissions}
          user={user}
          userInfo={userInfo}
          setUserInfo={setUserInfo}
          projectValue={projectValue}
        />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  //   console.log("map",state)
  return {
    // permissions: state.permissionReducer.permissions,
  };
};

const mapDispatcherToProps = (dispatch) => {
  return {
    // getMasterPermissions: () => dispatch(getMasterPermissions()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatcherToProps
)(RoleAndPermission);

const userListData = [
  {
    sid: 1,
    name: "ADMIN",
    code: "ROLE_ADMIN",
  },
  {
    sid: 40,
    name: "admin_ 3",
    code: "ROLE_TESTER56",
  },
  {
    sid: 95,
    name: "admin572",
    code: "ROLE_TESTER57",
  },
  {
    sid: 73,
    name: "Admini",
    code: "ROLE_AD_MIN",
  },
  {
    sid: 34,
    name: "Editor",
    code: "ROLE_EDITOU",
  },
  {
    sid: 42,
    name: "MENU_TESTER1",
    code: "ROLE_TESTER12",
  },
  {
    sid: 94,
    name: "QA",
    code: "ROLE_AD_MINU",
  },
  {
    sid: 37,
    name: "Role2",
    code: "ROLE_R1",
  },
  {
    sid: 41,
    name: "stb1",
    code: "ROLE_ST11",
  },
  {
    sid: 35,
    name: "Tester",
    code: "ROLE_TESTER",
  },
  {
    sid: 38,
    name: "Tester 3",
    code: "ROLE_TESTER 2",
  },
  {
    sid: 96,
    name: "Tester 37",
    code: "ROLE_TEST12",
  },
  {
    sid: 36,
    name: "tester1",
    code: "ROLE_TESTER1",
  },
];
