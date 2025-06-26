/**
 * Login Page
 */
//Sarthak Saxena
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input } from "reactstrap";
import LinearProgress from "@material-ui/core/LinearProgress";
import QueueAnim from "rc-queue-anim";

// redux action
import { signinUserInFirebase } from "Store/Actions";
import RctModel from "Util/Modal";
import { userResetPassword } from "Store/Actions/UserManagementActions";
import { useHistory } from "react-router-dom";

function ResetPassword(props) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [password, setPassword] = useState("");
  const [error, showError] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  const history = useHistory();
  /**
   * On User Login
   */
  const onUserLogin = () => {
    showError(true);
    if (password !== "" || confirmPassword !== "") {
      if (password === confirmPassword) {
        dispatch(
          userResetPassword(dispatch, { password, key: "123" }, history)
        );
      }
    }
  };

  const closePopup = () => {
    setShowPopup(false);
    props.history.push("/signin");
    // setApiSuccessMessage(null);
    // setApiErrorMessage(null);
  };

  return (
    <QueueAnim type="bottom" duration={2000}>
      <div className="rct-session-wrapper">
        {loading && <LinearProgress />}
        <div className="session-inner-wrapper">
          <div className="container">
            <div className="row row-eq-height">
              <div className="col-sm-4 col-md-4 col-lg-7"> </div>
              <div className="col-sm-4 col-md-4 col-lg-5">
                <div className="session-body text-center">
                  <div className="login-logo">
                    <img
                      src={`${process.env.PUBLIC_URL}/assets/images/img/qoe.png`}
                      className="img-fluid"
                      alt="site-logo"
                      width="148"
                      height="31"
                    />
                  </div>
                  <div>
                    <h2 className="forgot-wording">Create New Password </h2>
                    <p>
                      Your new password must be different from previous used
                      passwords.
                    </p>
                  </div>
                  <Form>
                    <label>Password</label>
                    <FormGroup className="has-wrapper">
                      <Input
                        value={password}
                        type="Password"
                        name="user-pwd"
                        id="pwd"
                        className="has-input input-lg"
                        placeholder="Password"
                        onChange={(event) => setPassword(event.target.value)}
                      />
                      <span className="has-icon">
                        <i className="ti-lock"></i>
                      </span>
                      {!password && error && (
                        <div>
                          <p
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              fontSize: 15,
                              textAlign: "left",
                              paddingTop: 10,
                            }}
                          >
                            Enter valid password
                          </p>
                        </div>
                      )}
                    </FormGroup>
                    <label>Confirm Password</label>
                    <FormGroup className="has-wrapper">
                      <Input
                        value={confirmPassword}
                        type="Password"
                        name="user-pwd"
                        id="pwdConf"
                        className="has-input input-lg"
                        placeholder="Confirm Password"
                        onChange={(event) =>
                          setConfirmPassword(event.target.value)
                        }
                      />
                      <span className="has-icon">
                        <i className="ti-lock"></i>
                      </span>
                      {!confirmPassword && error && (
                        <div>
                          <p
                            style={{
                              color: "red",
                              fontWeight: "bold",
                              fontSize: 15,
                              textAlign: "left",
                              paddingTop: 10,
                            }}
                          >
                            Enter valid password
                          </p>
                        </div>
                      )}
                    </FormGroup>
                    <RctModel
                      isOpen={showPopup}
                      footer={{
                        primaryButton: {
                          action: closePopup,
                          name: "Cancel",
                          addClass: "btn btn-danger login-button",
                        },
                        secondaryButton: {
                          action: closePopup,
                          name: "Yes",
                          addClass: "btn btn-success px-4 login-button",
                        },
                      }}
                    >
                      {/* <span className='d-block'><img src="../Images/change-password.png" style={{width:60}} /></span><br/> */}
                      <h5>
                        Do you really want to Change Password, This will Logout
                        You From Application?
                      </h5>
                    </RctModel>
                  </Form>
                  <Button
                    className="btn-bg submit-back-login-btn"
                    onClick={onUserLogin}
                  >
                    Create New Password
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
}

export default ResetPassword;
