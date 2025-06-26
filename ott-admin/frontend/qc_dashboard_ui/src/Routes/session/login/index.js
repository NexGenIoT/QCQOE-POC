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

function Signin(props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, showError] = useState(false);
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.loading);
  /**
   * On User Login
   */
  const onUserLogin = () => {
    showError(true);
    if (email !== "" && password !== "") {
      dispatch(
        signinUserInFirebase(
          { email: email, password: password },
          props.history,
          dispatch
        )
      );
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
                  <div className="session-head mb-30">
                    <h1>Video qc & self-healing </h1>
                    <p>DASHBOARD</p>
                    <h2>SIGN-IN</h2>
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
                    <FormGroup className="mb-15">
                      <Button className="sign-in-btn" onClick={onUserLogin}>
                        SUBMIT
                      </Button>
                      <p
                        onClick={() => props.history.push("/forgot-password")}
                        className="forgot"
                      >
                        Forgot Password ?
                      </p>
                    </FormGroup>
                  </Form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </QueueAnim>
  );
}

export default Signin;
