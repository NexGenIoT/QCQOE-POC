/**
 * Login Page
 */
//Sarthak Saxena
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "@material-ui/core/Button";
import { Form, FormGroup, Input } from "reactstrap";
import LinearProgress from "@material-ui/core/LinearProgress";
import QueueAnim from "rc-queue-anim";
import { useHistory } from "react-router-dom";
// redux action
import { signinUserInFirebase } from "Store/Actions";
import { userResetEmail } from "Store/Actions/UserManagementActions";

function Forgotpwd(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, showError] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();
  const loading = useSelector((state) => state.loading);
  /**
   * On User Login
   */
  const validEmail = () => {
    // const validRegex = "^w+([.-]?w+)*@w+([.-]?w+)*(.w{2,3})+$";
    if (/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/.test(email)) {
      setErrorEmail("");
      return true;
    } else if (email === "") {
      setErrorEmail("");
      return true;
    } else {
      showError(true);
      setErrorEmail("Enter Email in correct format");
      return false;
    }
  };

  const onUserLogin = (e) => {
    e.preventDefault();
    showError(true);
    if (validEmail()) {
      dispatch(userResetEmail(dispatch, email, history));
    }
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
                    <h2 className="forgot-wording">Forgot Password ?</h2>
                    <p>No Worries, we'll send you reset instructions.</p>
                  </div>
                  <Form>
                    <label>User Name</label>
                    <FormGroup className="has-wrapper">
                      <Input
                        type="mail"
                        value={email}
                        name="user-mail"
                        id="user-mail"
                        className="has-input input-lg"
                        placeholder="Enter Email Address"
                        onChange={(event) => setEmail(event.target.value)}
                      />
                      <span className="has-icon">
                        <i className="ti-email"></i>
                      </span>
                      {!email && error && (
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
                            Enter valid username
                          </p>
                        </div>
                      )}
                    </FormGroup>
                  </Form>
                  <div className="submit-back-login-btn">
                    <Button className="sign-in-btn" onClick={onUserLogin}>
                      Reset Password
                    </Button>
                    {/* <p onClick={() => props.history.push('/signin')}>Back to login</p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
}

export default Forgotpwd;
