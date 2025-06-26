import { React, useState, useEffect, useMemo } from "react";
// import { callAPI } from "../../../axios";
import moment from "moment";
import { Grid, Switch } from "@material-ui/core";
import { Input, Row, Button } from "reactstrap";
import { useHistory } from "react-router-dom";
import "./CreateUser.scss";
import { Link } from "react-router-dom";
import {
  getUserAccount,
  getUserRoles,
  setCreatedUserManagementList,
} from "Store/Actions/UserManagementActions";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { NotificationManager } from "react-notifications";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
const user = localStorage.getItem("user_id");
const CreateEditUser = (props) => {
  const dispatch = useDispatch();
  const userReducer = useSelector((state) => state.userReducer);
  const [clickOnValidate, setClickOnValidate] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [apiSuccessMessage, setApiSuccessMessage] = useState();
  const [apiErrorMessage, setApiErrorMessage] = useState();
  const [apiError, setApiError] = useState();
  const [errorPhone, setErrorPhone] = useState("");
  const [errorDate, setErrorDate] = useState("");
  const [errorEmail, setErrorEmail] = useState("");
  const [errorFirstName, seterrorFirstName] = useState("");
  const [errorLastName, seterrorLastName] = useState("");
  const [reset, setReset] = useState(false);
  const [userRoles, setUserRoles] = useState([""]);
  const [isLoading, setIsLoading] = useState(false);
  // const [flag, setFlag] = useState(0)
  const [cancelPopup, setCancelPopup] = useState();
  const [formValue, setformValue] = useState({
    userName: "",
    firstName: "",
    lastName: "",
    phoneNo: "",
    roles: "",
    accessTillDate: "",
    enabled: true,
  });
  let userDetails = localStorage.getItem("userDetails")
    ? JSON.parse(localStorage.getItem("userDetails"))
    : {};
  const mySid = userDetails.sid;
  console.log({ userReducer }, mySid);
  console.log("user--", props);
  useEffect(() => {
    dispatch(getUserRoles(dispatch));
    //props.myaccount || props.editUser
    if (props.myaccount) {
      dispatch(getUserAccount(dispatch, mySid));
    } else {
      dispatch(getUserAccount(dispatch, props.sid));
    }
  }, [userReducer.userAccount == {}]);
  useEffect(() => {
    if (props.myaccount || props.editUser) {
      setUserRoles(userReducer.userRoleList);
      setformValue({
        userName: userReducer?.userAccount?.userName,
        firstName: userReducer?.userAccount?.firstName,
        lastName: userReducer?.userAccount?.lastName,
        phoneNo: userReducer?.userAccount?.phoneNo,
        roles:
          userReducer?.userAccount?.roles &&
          userReducer?.userAccount?.roles.length !== 0
            ? getSelectedValue(userReducer?.userAccount?.roles)
            : "",
        accessTillDate:
          moment(userReducer?.userAccount?.accessTillDate).format(
            "YYYY-MM-DD"
          ) === "Invalid date"
            ? null
            : moment(userReducer?.userAccount?.accessTillDate).format(
                "YYYY-MM-DD"
              ),

        enabled: userReducer?.userAccount?.enabled,
      });
    } else {
      setformValue({
        userName: "",
        firstName: "",
        lastName: "",
        phoneNo: "",
        roles: "",
        accessTillDate: "",
        enabled: true,
      });
    }
    setUserRoles(userReducer.userRoleList);
  }, [userReducer.userAccount]);
  // console.log(`Hi my sid ${mySid}`)
  let today = new Date().toLocaleDateString();
  const history = useHistory();

  const handleDateError = () => {
    if (
      formValue.accessTillDate &&
      formValue.accessTillDate < moment(today).format("YYYY-MM-DD")
    ) {
      setErrorDate("Please enter future Date");
    } else {
      setErrorDate("");
    }
  };

  const validEmail = () => {
    // const validRegex = "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$";
    if (!props.myaccount || !props.editUser) {
      if (
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/.test(
          formValue.userName
        )
      ) {
        setErrorEmail("");
      } else if (formValue.userName === "") {
        setErrorEmail("");
      } else {
        setErrorEmail("Enter Email in correct format");
      }
    }
  };

  const validFirstName = () => {
    if (/^[a-zA-z]+([\s][a-zA-Z]+)*$/.test(formValue.firstName)) {
      seterrorFirstName("");
    } else if (/^[a-zA-Z]*$/.test(formValue.firstName)) {
      seterrorFirstName("");
    } else {
      seterrorFirstName("Enter Alphabets only");
    }
  };

  const validLastName = () => {
    if (/^[a-zA-z]+([\s][a-zA-Z]+)*$/.test(formValue.lastName)) {
      seterrorLastName("");
    } else if (/^[a-zA-Z]*$/.test(formValue.lastName)) {
      seterrorLastName("");
    } else {
      seterrorLastName("Enter Alphabets only");
    }
  };

  const validateForm = (e) => {
    e.preventDefault();
    setClickOnValidate(true);
    console.log({ formValue, roles: formValue.roles });
    if (props.myaccount || props.editUser) {
      if (
        formValue.phoneNo !== "" &&
        formValue.roles !== "" &&
        errorPhone === "" &&
        errorDate === "" &&
        errorEmail === "" &&
        errorLastName === ""
      ) {
        const createEditUserRequest = {
          userName: userReducer?.userAccount?.userName,
          firstName: formValue.firstName
            ? formValue.firstName
            : userReducer?.userAccount?.firstName,
          lastName: formValue.lastName
            ? formValue.lastName
            : userReducer?.userAccount?.lastName,
          phoneNo: formValue.phoneNo
            ? formValue.phoneNo
            : userReducer?.userAccount?.phoneNo,
          accessTillDate: formValue.accessTillDate
            ? moment(formValue.accessTillDate).format("YYYY-MM-DD")
            : moment(userReducer?.userAccount?.accessTillDate).format(
                "YYYY-MM-DD"
              ),
          roleSids: formValue.roles
            ? getSelectedValueCreate(formValue.roles)
            : [userReducer?.userAccount?.roles[0].id],
          enabled: formValue.enabled
            ? formValue.enabled
            : userReducer?.userAccount?.enabled,
        };
        delete createEditUserRequest.roles;
        let method = "POST";
        let url = "https://qcotp.qoetech.com/qcuser";
        if (props.myaccount) {
          method = "PUT";
          url = `user?sid=${mySid}`;
        }
        let isApprovalPending = false;
        if (props.location?.state?.isApprovalPending) {
          isApprovalPending = true;
        }
        if (props.editUser || isApprovalPending) {
          method = "PUT";
          url = `/qcuser?sid=${props?.location?.state?.sid}`;
          setIsLoading(true);
          axios
            .put(url, createEditUserRequest, {
              headers: {
                Authorization: `Bearer ${user}`,
              },
            })
            .then(function (response) {
              if (response) {
                setIsLoading(false);
                setCreatedUserManagementList(response);
                NotificationManager.success("User updated successfully!");
                history.push("/dashboard/crm/user-list");
              }

              // navigateToUserManagement()
            })
            .catch(function (error) {
              setIsLoading(false);
              console.log({ error });
              NotificationManager.error(error.response.data.details[0]);
              // setShowPopup(true);
              // setApiError(error.response?.data?.errorMessage);
            });
        }
      }
    } else {
      if (
        formValue.userName !== "" &&
        formValue.firstName !== "" &&
        formValue.phoneNo !== "" &&
        formValue.roles !== "" &&
        errorPhone === "" &&
        errorDate === "" &&
        errorEmail === "" &&
        errorFirstName === "" &&
        errorLastName === ""
      ) {
        const createEditUserRequest = {
          ...formValue,
          roleSids: formValue.roles
            ? getSelectedValueCreate(formValue.roles)
            : [],
        };
        delete createEditUserRequest.roles;
        let method = "POST";
        let url = "https://qcotp.qoetech.com/qcuser";
        if (props.myaccount) {
          method = "PUT";
          url = `user?sid=${mySid}`;
        }
        let isApprovalPending = false;
        if (props.location?.state?.isApprovalPending) {
          isApprovalPending = true;
        }
        if (props.editUser || isApprovalPending) {
          method = "PUT";
          url = `/qcuser?sid=${props?.location?.state?.sid}`;
          axios
            .put(url, createEditUserRequest, {
              headers: {
                Authorization: `Bearer ${user}`,
              },
            })
            .then(function (response) {
              if (response) {
                setCreatedUserManagementList(response);
                NotificationManager.success("User updated successfully!");
                history.push("/dashboard/crm/user-list");
              }

              // navigateToUserManagement()
            })
            .catch(function (error) {
              console.log({ error });
              NotificationManager.error(error.response.data.details[0]);
              // setShowPopup(true);
              // setApiError(error.response?.data?.errorMessage);
            });
          if (props.location?.state?.isApprovalPending) {
            url = `user/signup-approve?sid=${props?.location?.state?.sid}`;
          }
        }
        if (!props.editUser || !props.myaccount) {
          axios
            .post(url, createEditUserRequest, {
              headers: {
                Authorization: `Bearer ${user}`,
              },
            })
            .then(function (response) {
              if (response) {
                setCreatedUserManagementList(response);
                NotificationManager.success("User created successfully!");
                history.push("/dashboard/crm/user-list");
              }

              // navigateToUserManagement()
            })
            .catch(function (error) {
              NotificationManager.error(error.response.data.details[0]);
              console.log({ error });
              // setShowPopup(true);
              // setApiError(error.response?.data?.errorMessage);
            });
        }
      }
    }
  };

  // const getUserRoles = () => {
  //   // callAPI(`master?type=ROLES`, "GET").then((response) => {
  //   //   setUserRoles(response.data);
  //   // });
  // };

  useEffect(() => {
    let isApprovalPending = false;
    if (props.location?.state?.isApprovalPending) {
      isApprovalPending = true;
    }
    let api = `user?sid=${props?.location?.state?.sid}`;
    if (props.myaccount) {
      api = `user?sid=${mySid}`;
    }
    //    ((props.editUser || isApprovalPending || props.myaccount) &&
    //       callAPI(api, "GET")
    //         .then(function (response) {
    //           // setFlag(1)
    //           setformValue({
    //             userName: response.userName,
    //             firstName: response.firstName,
    //             lastName: response.lastName,
    //             phoneNo: response.phoneNo,
    //             roles: response.roles.length !== 0?getSelectedValue(response.roles):'',
    //             accessTillDate:
    //               moment(response.accessTillDate).format("YYYY-MM-DD") ===
    //                 "Invalid date"
    //                 ? null
    //                 : moment(response.accessTillDate).format("YYYY-MM-DD"),

    //             enabled: response.enabled,
    //           });
    //         })
    //         .catch(function (error) {
    //           console.log(error.response?.data?.errorMessage);
    //           setShowPopup(true);
    //           setApiErrorMessage(error.response?.data?.errorMessage);
    //         }));
  }, [reset]);

  useEffect(() => {
    validEmail();
  }, [formValue.userName]);

  useEffect(() => {
    validFirstName();
  }, [formValue.firstName]);

  useEffect(() => {
    validLastName();
  }, [formValue.lastName]);

  const handleChange = (e) => {
    setformValue({
      ...formValue,
      [e.target.id]: e.target.value,
    });
  };

  const handleDateChange = (e) => {
    setformValue({
      ...formValue,
      [e.target.id]: e.target.value,
    });
  };

  useEffect(() => {
    handleDateError();
  }, [formValue.accessTillDate]);

  const handleChangeCheckbox = (e) => {
    setformValue({
      ...formValue,
      [e.target.id]: e.target.checked,
    });
  };

  const PhoneHandler = (e) => {
    if (/^[0-9]+$/.test(e.target.value)) {
      setformValue({
        ...formValue,
        [e.target.id]: e.target.value,
      });
      setErrorPhone("");
      if (e.target.value.length < 10) {
        setErrorPhone("Please enter 10 or more digits");
      }
    } else {
      setErrorPhone("Enter numbers only");
    }
  };

  const phoneBlurHandler = (e) => {
    if (formValue.phoneNo.length < 10 && formValue.phoneNo.length > 0) {
      setErrorPhone("Please enter more than 10 digits");
    } else {
      setErrorPhone("");
    }
  };

  const onUserRoleChange = (userRole) => {
    console.log({ [userRole.target.name]: userRole.target.value });
    setformValue((prev) => ({
      ...prev,
      [userRole.target.name]: userRole.target.value,
    }));
  };

  const resetHandle = () => {
    if (props.editUser || props.myaccount) {
      setReset(!reset);
    } else {
      setformValue({
        userName: "",
        firstName: "",
        lastName: "",
        phoneNo: "",
        roles: "",
        accessTillDate: "",
        enabled: true,
      });
    }
  };

  const handleCancel = () => {
    history.goBack();
    setCancelPopup(true);
  };
  const handleClose = () => {
    setCancelPopup(false);
  };
  const navigatedashboard = () => {
    history.goBack();
  };
  const closePopupHandler = () => {
    setShowPopup(false);
    setApiSuccessMessage(null);
    setApiErrorMessage(null);
  };
  const navigateToUserManagement = () => {
    if (props.myaccount) {
      history.push("/dashboard");
    } else {
      history.push("/UserManagement/userlist");
    }
  };

  const getSelectedValue = (items) => {
    if (items && items.length > 0) {
      const tempNum = items && items.map((e) => e["role"]); //Array with numbers
      // console.log(tempNum)
      // console.log(tempNum)
      return tempNum;
    } else {
      return [];
    }
  };

  const getSelectedValueCreate = (role) => {
    if (role !== "") {
      const tempRole = userRoles.filter((data) => role === data["name"]); //Array with numbers
      const tempNum = tempRole && tempRole.map((e) => e["sid"]); //Array with numbers
      // console.log(tempNum)
      // console.log(tempNum)
      return tempNum;
    } else {
      return [];
    }
  };

  if (
    (props.myaccount || props.editUser) &&
    Object.values(userReducer.userAccount).length > 0
  ) {
    return (
      <div className="mx-3 mt-2 px-1">
        <div className="sub-header mb-3">
          <h1>
            {props.myaccount ? (
              <>
                <span className="d-inline-flex">
                  <span>My Account</span>
                </span>
              </>
            ) : props.location?.state?.isApprovalPending ? (
              "Approve User"
            ) : props.editUser ? (
              "Edit User"
            ) : (
              "Create User"
            )}
          </h1>
        </div>
        <Row className="mx-0 create-user">
          <div className="col-12 px-0">
            <Grid item lg={12}>
              <div className="center-container">
                <form className="createuser-form">
                  <div className="row-user form-list mb-3">
                    <div className="col-md-4">
                      <label className="form-label">
                        Email
                        {!props.myaccount && (
                          <>
                            <span className="required">*</span>
                          </>
                        )}
                      </label>
                      <Input
                        id="userName"
                        type="email"
                        // error={errorEmail}
                        disabled={props.editUser || props.myaccount}
                        onChange={handleChange}
                        value={formValue.userName}
                        // inputProps={{ maxLength: 35 }}
                        maxLength={40}
                        placeholder="Enter Email"
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        First Name
                        {!props.myaccount && (
                          <>
                            <span className="required">*</span>
                          </>
                        )}
                      </label>
                      <Input
                        id="firstName"
                        onChange={handleChange}
                        // disabled={props.myaccount}
                        value={formValue.firstName}
                        // inputProps={{ maxLength: 35 }}
                        maxLength={30}
                        placeholder="Enter First Name"
                      />
                      {errorFirstName !== "" && (
                        <p className="required">{errorFirstName}</p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">Last Name</label>
                      <Input
                        id="lastName"
                        onChange={handleChange}
                        value={formValue.lastName}
                        // inputProps={{ maxLength: 35 }}
                        // disabled={props.myaccount}
                        maxLength={30}
                        placeholder="Enter Last Name"
                        // className={"form-control "}
                      />
                      {errorLastName !== "" && (
                        <p className="required">{errorLastName}</p>
                      )}
                    </div>
                  </div>
                  <div className="row-user form-list mb-5">
                    <div className="col-md-4">
                      <label className="form-label">
                        Phone{" "}
                        {!props.myaccount && (
                          <>
                            <span className="required">*</span>
                          </>
                        )}
                      </label>
                      <Input
                        id="phoneNo"
                        onChange={PhoneHandler}
                        onBlur={phoneBlurHandler}
                        // disabled={props.myaccount}
                        // className="form-control"
                        value={formValue.phoneNo}
                        maxLength={12}
                        minLength={10}
                        placeholder="Enter Phone Number"
                        // inputProps={{
                        //   maxLength: 14,
                        //   minLength: 10,
                        // }}
                        // error={errorPhone}
                      />
                      <p className="required">
                        {clickOnValidate &&
                          !(formValue.phoneNo !== "") &&
                          "Please Enter Phone Number"}
                      </p>
                      {errorPhone !== "" && (
                        <p className="required">{errorPhone}</p>
                      )}
                    </div>
                    <div className="col-md-4">
                      <label className="form-label">
                        User Role
                        {!props.myaccount && (
                          <>
                            <span className="required">*</span>
                          </>
                        )}
                      </label>
                      <Input
                        disabled={props.myaccount}
                        className={`form-control ${
                          !props.myaccount ? "cursor-pointer" : ""
                        }`}
                        value={formValue.roles}
                        type="select"
                        name="roles"
                        // disabled={props.myaccount}
                        onChange={onUserRoleChange}
                      >
                        <option value="" selected disabled hidden>
                          Select Roles
                        </option>
                        {userRoles.map((role) => (
                          <option key={role.sid}>{role.name}</option>
                        ))}
                      </Input>
                      <p className="required">
                        {clickOnValidate &&
                          !(formValue.roles !== "") &&
                          "Please Select Role"}
                      </p>
                    </div>
                    <div className="col-md-4 input-container sd-container">
                      <label className="form-label">Access Till Date</label>
                      <Input
                        onChange={handleDateChange}
                        // error="error"
                        type="date"
                        className="form-control"
                        id="accessTillDate"
                        value={formValue.accessTillDate}
                        disabled={props.myaccount}
                        style={{
                          border: "1px solid",
                          borderColor: "#babdbd",
                          width: "100%",
                        }}
                      />
                      {/* <span class="open-button">
                          <button type="button"><img src='../Images/dateicon.png' style={{width:25}} /></button>
                        </span> */}
                      <p className="required">{errorDate} </p>
                    </div>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      {/* <label className="form-check-label ml-3">User {formValue.enabled === false ? "Disabled" : "Enabled"} </label>
                      <Switch
                        id="enabled"
                        onChange={handleChangeCheckbox}
                        inputProps={{ "aria-label": "controlled" }}
                        checked={formValue.enabled}
                        disabled={props.myaccount || props.createUser}
                        className={`${formValue.enabled === false ? 'switchuser-inactive' : 'switchuser-active'}`}
                      /> */}
                    </div>
                    <div>
                      {mySid && props.myaccount && (
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            type="reset"
                            onClick={navigatedashboard}
                            className="Status-btn-user mr-md-3 back-btn"
                          >
                            Back
                          </Button>
                        </>
                      )}
                      {
                        <>
                          <Button
                            variant="contained"
                            size="small"
                            type="reset"
                            onClick={handleCancel}
                            className="Status-btn-user mr-2 cancel-btn"
                          >
                            Cancel
                          </Button>

                          {/* <Button
                          onClick={resetHandle}
                          variant="contained"
                          size="small"
                          className="reset-btn"
                        >
                          Reset
                        </Button> */}

                          <Button
                            variant="contained"
                            size="small"
                            type="submit"
                            className="ml-2 create-btn mr-md-3"
                            onClick={validateForm}
                          >
                            {isLoading ? <RctPageLoader /> : "Update"}
                          </Button>
                        </>
                      }
                    </div>
                  </div>
                  {/* <RctModel
                    isOpen={showPopup}
                    footer={{
                      secondaryButton: {
                        action: apiSuccessMessage
                          ? navigateToUserManagement
                          : closePopupHandler,
                        name: "OK",
                        addClass:'btn btn-success px-4'
                      },
                    }}
                  >                  
                    {apiSuccessMessage && <span className='d-block'><img src='../Images/approve-qc.png' className="image-style" /><p className="mt-2">{apiSuccessMessage}</p></span>}
                    {(apiErrorMessage && apiErrorMessage!=='') && <span>{apiErrorMessage}</span>}
                    {(apiError && apiError!=='') && <span className='d-block'><img src='../Images/Rejected.png' className="image-style" /><p className="mt-2">{apiError}</p></span>}
                  </RctModel>
                  {cancelPopup &&<RctModel
                    isOpen={cancelPopup}
                    footer={{
                      primaryButton: {
                        action: handleClose,
                        name: 'Cancel',
                        addClass:'btn btn-cancel mr-3'
                    },
                      secondaryButton: {
                        action: navigatedashboard,
                        name: "Yes",
                        addClass:'btn btn-success px-4'
                      },
                    }}
                  >
                    <span className='d-block mb-3'>
                      <img src='../Images/Rejected.png' className="image-style" />
                    </span>
                    <p>Do you really want to cancel it?</p>
                  </RctModel>} */}
                </form>
              </div>
            </Grid>
          </div>
        </Row>
      </div>
    );
  }

  return (
    <div className="mx-3 mt-2 px-1">
      <div className="sub-header mb-3">
        <h1>
          {props.myaccount ? (
            <>
              <span className="d-inline-flex">
                <span>My Account</span>
              </span>
            </>
          ) : props.location?.state?.isApprovalPending ? (
            "Approve User"
          ) : props.editUser ? (
            "Edit User"
          ) : (
            "Create User"
          )}
        </h1>
      </div>
      <Row className="mx-0 create-user">
        <div className="col-12 px-0">
          <Grid item lg={12}>
            <div className="center-container">
              <form className="createuser-form">
                <div className="row-user form-list mb-3">
                  <div className="col-md-4">
                    <label className="form-label">
                      Email
                      {!props.myaccount && (
                        <>
                          <span className="required">*</span>
                        </>
                      )}
                    </label>
                    <Input
                      id="userName"
                      type="email"
                      // error={errorEmail}
                      disabled={props.editUser || props.myaccount}
                      onChange={handleChange}
                      className={
                        clickOnValidate && !formValue.userName === true
                          ? " error"
                          : " "
                      }
                      value={formValue.userName}
                      // inputProps={{ maxLength: 35 }}
                      maxLength={40}
                      placeholder="Enter Email"
                    />
                    <p className="required">
                      {errorEmail === ""
                        ? clickOnValidate &&
                          !formValue.userName &&
                          "Please Enter Your Email "
                        : "Please Enter Email in correct format "}
                    </p>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      First Name
                      {!props.myaccount && (
                        <>
                          <span className="required">*</span>
                        </>
                      )}
                    </label>
                    <Input
                      id="firstName"
                      style={{ "margin-bottom": "15px" }}
                      onChange={handleChange}
                      disabled={props.myaccount}
                      className={
                        clickOnValidate && !formValue.firstName === true
                          ? " error"
                          : " "
                      }
                      value={formValue.firstName}
                      // inputProps={{ maxLength: 35 }}
                      maxLength={30}
                      placeholder="Enter First Name"
                    />

                    {clickOnValidate && !formValue.firstName && (
                      <p className="required">Enter First Name </p>
                    )}
                    {errorFirstName !== "" && (
                      <p className="required">{errorFirstName}</p>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Last Name</label>
                    <Input
                      id="lastName"
                      style={{ "margin-bottom": "15px" }}
                      onChange={handleChange}
                      value={formValue.lastName}
                      // inputProps={{ maxLength: 35 }}
                      disabled={props.myaccount}
                      maxLength={30}
                      placeholder="Enter Last Name"
                      // className={"form-control "}
                    />
                    {errorLastName !== "" && (
                      <p className="required">{errorLastName}</p>
                    )}
                  </div>
                </div>
                <div className="row-user form-list mb-5">
                  <div className="col-md-4">
                    <label className="form-label">
                      Phone{" "}
                      {!props.myaccount && (
                        <>
                          <span className="required">*</span>
                        </>
                      )}
                    </label>
                    <Input
                      id="phoneNo"
                      onChange={PhoneHandler}
                      onBlur={phoneBlurHandler}
                      disabled={props.myaccount}
                      // className="form-control"
                      value={formValue.phoneNo}
                      maxLength={12}
                      minLength={10}
                      placeholder="Enter Phone Number"
                      // inputProps={{
                      //   maxLength: 14,
                      //   minLength: 10,
                      // }}
                      // error={errorPhone}
                    />
                    <p className="required">
                      {clickOnValidate &&
                        !(formValue.phoneNo !== "") &&
                        "Please Enter Phone Number"}
                    </p>
                    {errorPhone !== "" && (
                      <p className="required">{errorPhone}</p>
                    )}
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      User Role
                      {!props.myaccount && (
                        <>
                          <span className="required">*</span>
                        </>
                      )}
                    </label>
                    <Input
                      className={`form-control ${
                        !props.myaccount ? "cursor-pointer" : ""
                      }`}
                      value={formValue.roles}
                      type="select"
                      name="roles"
                      // disabled={props.myaccount}
                      onChange={onUserRoleChange}
                    >
                      <option value="" selected disabled hidden>
                        Select Roles
                      </option>
                      {userRoles?.map((role) => (
                        <option key={role.sid}>{role.name}</option>
                      ))}
                    </Input>
                    <p className="required">
                      {clickOnValidate &&
                        !(formValue.roles !== "") &&
                        "Please Select Role"}
                    </p>
                  </div>
                  <div className="col-md-4 input-container sd-container">
                    <label className="form-label">Access Till Date</label>
                    <Input
                      onChange={handleDateChange}
                      // error="error"
                      type="date"
                      className="form-control"
                      id="accessTillDate"
                      value={formValue.accessTillDate}
                      disabled={props.myaccount}
                      style={{
                        border: "1px solid",
                        borderColor: "#babdbd",
                        width: "100%",
                      }}
                    />
                    {/* <span class="open-button">
                        <button type="button"><img src='../Images/dateicon.png' style={{width:25}} /></button>
                      </span> */}
                    <p className="required">{errorDate} </p>
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <label className="form-check-label ml-3">
                      User{" "}
                      {formValue.enabled === false ? "Disabled" : "Enabled"}{" "}
                    </label>
                    <Switch
                      id="enabled"
                      onChange={handleChangeCheckbox}
                      inputProps={{ "aria-label": "controlled" }}
                      checked={formValue.enabled}
                      disabled={props.myaccount || props.createUser}
                      className={`${
                        formValue.enabled === false
                          ? "switchuser-inactive switchStyle"
                          : "switchuser-active switchStyle"
                      }`}
                    />
                  </div>
                  <div>
                    {mySid && props.myaccount && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          type="reset"
                          onClick={navigatedashboard}
                          className="Status-btn-user mr-md-3 back-btn"
                        >
                          Back
                        </Button>
                      </>
                    )}
                    {!props.myaccount && (
                      <>
                        <Button
                          variant="contained"
                          size="small"
                          type="reset"
                          onClick={handleCancel}
                          className="Status-btn-user mr-2 cancel-btn"
                        >
                          Cancel
                        </Button>

                        <Button
                          onClick={resetHandle}
                          variant="contained"
                          size="small"
                          className="reset-btn"
                        >
                          Reset
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          type="submit"
                          className="ml-2 create-btn mr-md-3"
                          onClick={validateForm}
                        >
                          {isLoading ? <RctPageLoader /> : "Create"}
                        </Button>
                      </>
                    )}
                  </div>
                </div>
                {/* <RctModel
                  isOpen={showPopup}
                  footer={{
                    secondaryButton: {
                      action: apiSuccessMessage
                        ? navigateToUserManagement
                        : closePopupHandler,
                      name: "OK",
                      addClass:'btn btn-success px-4'
                    },
                  }}
                >                  
                  {apiSuccessMessage && <span className='d-block'><img src='../Images/approve-qc.png' className="image-style" /><p className="mt-2">{apiSuccessMessage}</p></span>}
                  {(apiErrorMessage && apiErrorMessage!=='') && <span>{apiErrorMessage}</span>}
                  {(apiError && apiError!=='') && <span className='d-block'><img src='../Images/Rejected.png' className="image-style" /><p className="mt-2">{apiError}</p></span>}
                </RctModel>
                {cancelPopup &&<RctModel
                  isOpen={cancelPopup}
                  footer={{
                    primaryButton: {
                      action: handleClose,
                      name: 'Cancel',
                      addClass:'btn btn-cancel mr-3'
                  },
                    secondaryButton: {
                      action: navigatedashboard,
                      name: "Yes",
                      addClass:'btn btn-success px-4'
                    },
                  }}
                >
                  <span className='d-block mb-3'>
                    <img src='../Images/Rejected.png' className="image-style" />
                  </span>
                  <p>Do you really want to cancel it?</p>
                </RctModel>} */}
              </form>
            </div>
          </Grid>
        </div>
      </Row>
    </div>
  );
};

export default CreateEditUser;
