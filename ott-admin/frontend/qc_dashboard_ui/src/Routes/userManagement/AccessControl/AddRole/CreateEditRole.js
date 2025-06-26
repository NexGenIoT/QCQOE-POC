import { React, useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import { Input, Row, Button, FormGroup, Label } from "reactstrap";
// import RctModel from "../../../../Pages/Components/Modal/Examples/Modal";
// import { callAPI } from "../../../../axios";
import { Switch } from "@material-ui/core";
import { Link } from "react-router-dom";
import "./CreateEditRole.scss";
import RctModel from "Util/Modal";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { NotificationManager } from "react-notifications";
import RctPageLoader from "Components/RctPageLoader/RctPageLoader";
const user = localStorage.getItem("user_id");
const CreateEditRole = (props) => {
  const history = useHistory();
  const [validateFlag, setValidateFlag] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorRole, setErrorRole] = useState("");
  const [errorRoleCode, setErrorRoleCode] = useState("");
  const [apiSuccessMessage, setApiSuccessMessage] = useState();
  const [apiErrorMessage, setApiErrorMessage] = useState();
  const [errorRoleCodeFormat, setErrorRoleCodeFormat] = useState("");
  const [errorRoleFormat, setErrorRoleFormat] = useState("");
  const [reset, setReset] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formValue, setformValue] = useState({
    role: props?.location?.state?.role ?? "",
    roleCode: props?.location?.state?.rolecode ?? "",
    active: props?.location?.state?.active ?? false,
  });
  console.log({ location: props });
  //For initial validation
  const validateError = () => {
    formValue.role !== ""
      ? setErrorRole("")
      : setErrorRole("Please Enter Role");
  };
  useEffect(() => {
    if (validateFlag) {
      validateError();
    }
  }, [validateFlag, formValue]);

  //for Validating Role
  const validRole = () => {
    // const validRegex = "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$";
    if (/^\s+$/.test(formValue.role)) {
      setErrorRoleFormat("Enter Role in Alphanumeric");
    } else {
      setErrorRoleFormat("");
    }
  };
  useEffect(() => {
    validRole();
  }, [formValue.role]);

  //for Validating Role Code
  const validRoleCode = () => {
    // const validRegex = "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$";
    if (/^\s+$/.test(formValue.roleCode)) {
      setErrorRoleCodeFormat("Enter Role Code in Alphanumeric");
    } else {
      setErrorRoleCodeFormat("");
    }
  };
  // useEffect(() => {
  //     validRoleCode();
  // }, [formValue.roleCode]);
  //For Handle change
  const handleChange = (e) => {
    setformValue({
      ...formValue,
      [e.target.id]: e.target.value,
    });
  };
  //Reset form feilds
  const resetHandle = () => {
    if (props.editRole) {
      setReset(!reset);
    } else {
      setformValue({
        role: "",
        roleCode: "",
        active: true,
      });
    }
  };
  //For Handling Cancel
  const handleCancel = () => {
    props.history.goBack();
  };
  //For navigating User Management
  const navigateToUserManagement = () => {
    setShowPopup(false);
    props.history.push("/app/useruanagement/roles");
  };
  //For Close PopUPHandler
  const closePopupHandler = () => {
    setShowPopup(false);
    setApiSuccessMessage(null);
    setApiErrorMessage(null);
  };
  //For handling Check box
  const handleChangeCheckbox = (e) => {
    setformValue({
      ...formValue,
      [e.target.id]: e.target.checked,
    });
  };
  //onSubmit
  const onSubmit = (e) => {
    e.preventDefault();
    setValidateFlag(true);
    if (formValue.role === "" || errorRoleFormat !== "") {
      return;
    }
    // console.log("role",formValue)
    let method = "POST";
    let url = "/role";
    setIsLoading(true);
    const data = {
      role: formValue.role,
      roleCode: `ROLE_${formValue.role}`,
      active: formValue.active,
    };
    if (props.editRole) {
      method = "PUT";
      url = `role?sid=${props?.location?.state?.sid}`;
      axios
        .put(
          `https://qcotp.qoetech.com/role?sid=${props?.location?.state?.sid}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${user}`,
            },
          }
        )
        .then((response) => {
          setIsLoading(false);
          NotificationManager.success(response.data.message);
          history.push("/dashboard/crm/access-control");
          // console.log({ role: response });
        })
        .catch((error) => {
          setIsLoading(false);
          NotificationManager.error(error.response.data.details[0]);
        });
    } else {
      axios
        .post("https://qcotp.qoetech.com/role", data, {
          headers: {
            Authorization: `Bearer ${user}`,
          },
        })
        .then((response) => {
          setIsLoading(false);
          NotificationManager.success(response.data.message);
          history.push("/dashboard/crm/access-control");
          // console.log({ role: response });
        })
        .catch((error) => {
          setIsLoading(false);
          NotificationManager.error(error.response.data.details[0]);
        });
    }

    // callAPI(url, method, formValue)
    //   .then((response) => {
    //     setShowPopup(true);
    //     setApiSuccessMessage(response.message);
    //   })
    //   .catch((error) => {
    //     setShowPopup(true);
    //     setApiErrorMessage(error.response?.data?.errorMessage);
    //   });
  };
  //   useEffect(() => {
  //     props.editRole &&
  //       callAPI(`role?sid=${props?.location?.state?.sid}`, "GET")
  //         .then((response) => {
  //           setformValue({
  //             role: response.role,
  //             roleCode: response.roleCode,
  //             active:response.active
  //           });
  //         })
  //         .catch((error) => {
  //           console.log(error.response?.data?.errorMessage);
  //           setShowPopup(true);
  //           setApiErrorMessage(error.response?.data?.errorMessage);
  //         });
  //   }, [reset]);
  return (
    <div className="mx-3 px-1 mt-2">
      <div className="sub-header">
        <h1>{props.editRole ? "Edit Role" : "Add New Role"}</h1>
      </div>
      <Row className="mx-0 create-user">
        <div className="col-12 px-0">
          <Grid item lg={12}>
            <div className="center-container">
              <form className="createuser-form">
                <div className="row-user form-list mb-5">
                  <div className="col-md-4">
                    <label className="form-label">
                      Role<span className="required">*</span>
                    </label>
                    <Input
                      id="role"
                      type="text"
                      errorMessage="errorRole"
                      maxlength="15"
                      onChange={handleChange}
                      value={formValue.role}
                      inputProps={{ maxLength: 13 }}
                      placeholder="Enter Role"
                    />
                    {errorRoleFormat ? (
                      <p className="required">{errorRoleFormat}</p>
                    ) : (
                      <p className="required">{errorRole}</p>
                    )}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className="col-8"
                >
                  {props?.location?.state?.rolecode !== "ROLE_ADMIN" ? (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: -25,
                      }}
                      className="col-2"
                    >
                      <label className="form-check-label">Status</label>
                      <Switch
                        id="active"
                        onChange={handleChangeCheckbox}
                        inputProps={{ "aria-label": "controlled" }}
                        checked={formValue.active}
                        className={`${
                          formValue.active === false
                            ? "switchStyle switchuser-inactive"
                            : "switchStyle switchuser-active"
                        }`}
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginLeft: -25,
                      }}
                      className="col-2"
                    ></div>
                  )}
                  <div
                    className="col-6"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "start",
                      marginRight: 0,
                    }}
                  >
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleCancel}
                      className="Status-btn-user cancel-btn mr-2"
                    >
                      Cancel
                    </Button>
                    {/* <Button
                                            onClick={resetHandle}
                                            variant="contained"
                                            size="small"
                                            className="reset-btn mr-2"
                                        >
                                            Reset
                                        </Button> */}
                    {isLoading ? (
                      <RctPageLoader />
                    ) : (
                      <Button
                        variant="contained"
                        size="small"
                        type="submit"
                        className="mr-3 create-btn"
                        onClick={onSubmit}
                      >
                        {props.editRole ? "Update Role" : "Add Role"}
                      </Button>
                    )}
                  </div>
                </div>

                <RctModel
                  isOpen={showPopup}
                  footer={{
                    secondaryButton: {
                      action: apiSuccessMessage
                        ? navigateToUserManagement
                        : closePopupHandler,
                      name: "OK",
                      addClass: "btn btn-success px-4",
                    },
                  }}
                >
                  {apiSuccessMessage && apiSuccessMessage !== "" && (
                    <span className="d-block">
                      <img
                        src="../../Images/approve-qc.png"
                        style={{ width: 60 }}
                      />
                      <h3 className="mt-2">{apiSuccessMessage}</h3>
                    </span>
                  )}
                  {apiErrorMessage && apiErrorMessage !== "" && (
                    <span className="d-block">
                      <img
                        src="../../Images/Rejected.png"
                        style={{ width: 60 }}
                      />
                      <p className="mt-2">{apiErrorMessage}</p>
                    </span>
                  )}
                </RctModel>
              </form>
            </div>
          </Grid>
        </div>
      </Row>
    </div>
  );
};

export default CreateEditRole;
