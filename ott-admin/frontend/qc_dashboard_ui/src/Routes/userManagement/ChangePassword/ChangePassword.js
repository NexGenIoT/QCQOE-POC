
import React, { Fragment, useState, useEffect } from "react";
import './ChangePassword.scss';
import {
  Col, Row, Card, CardBody,
  CardTitle, Button, Form, FormGroup, Label, Input
} from 'reactstrap';
// import KeyIcon from '@mui/icons-material/Key';
// import { callAPI } from '../../../axios/index';
// import { useDispatch } from 'react-redux';
// import { BsEyeSlashFill } from "react-icons/bs";
// import { BsEyeSlash } from "react-icons/bs";
// import { useHistory } from "react-router-dom";
// import RctModel from '../../Components/Modal/Examples/Modal';
// import {logout} from "../../../utils/utils"
import { Link } from "react-router-dom";
import RctModel from "Util/Modal";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { userChangePassword } from "Store/Actions/UserManagementActions";
//  
const ChangePassword = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  // const [showYesPopup, setYesShowPopup] = useState(false);
  const [validateFlag, setValidateFlag] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [apiSuccessMessage, setApiSuccessMessage] = useState("");
  const [validationError, setValidationError] = useState("");
  // const [apiError, setApiError]=useState("");
  const [toggle, setToggleEye] = useState(true);
  const [confirmToggle, setConfirmToggle] = useState(true);
  const [yesPopup, setYesPopup] = useState();
  const [showPopup, setShowPopup] = useState(false);
  const [formValue, setformValue] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });
  //Error validation
  const validateError = () => {
    formValue.oldPassword !== ""
      ? setOldPassword("")
      : setOldPassword("Please Enter Old Password");
    formValue.password !== ""
      ? setNewPassword("")
      : setNewPassword("Please Enter New Password");
    formValue.confirmPassword !== "" && formValue.confirmPassword === formValue.password
      ? setConfirmPassword("")
      : setConfirmPassword("Please Enter Confirm Password");
  }
  //Password validation
  const validatePassword = () => {
    if (/^([a-zA-Z0-9-&@#$!])*$/.test(formValue.password) && formValue.password.length >= 4) {
      setValidationError("");
    } else if (formValue.password == "") {
      setValidationError("");
    } else {
      setValidationError("Enter minimum 4 characters password in correct format(Alphanumeric and @,#,$-! allowed)");
    }
  };

  useEffect(() => {
    validatePassword();
  }, [formValue.password]);

  useEffect(() => {
    if (validateFlag) {
      validateError()
    }
  }, [validateFlag, formValue])

  //For onChanging password
  const onChangePassword = (e) => {
    e.preventDefault();
    setShowPopup(false)
    // setYesPopup(true)
    if(formValue.password == formValue.confirmPassword){
      let url = "/user/change-password";
      dispatch(userChangePassword(dispatch, { oldPassword: formValue.oldPassword, password: formValue.password }, history));
  
    }else{
      handlePosswordButton()
    }
 
    //   callAPI(url, "PUT", {password:formValue.password})
    //   .then((response) => {
    //     // setYesShowPopup(true)
    //     // setChangeShowPopup(true);
    //     setApiSuccessMessage(response.message);
    //     // console.log(response.message)
    //   })
    //   .catch((error) => {
    //     // setYesPopup(false);
    //     setShowPopup(true);
    //     // setApiError(error.response?.data?.errorMessage);
    //     // console.log(error.response?.data?.errorMessage)
    //   });

  };
  //handle change
  const handleChange = (e) => {
    setformValue({
      ...formValue,
      [e.target.id]: e.target.value,
    });
  };
  //For Togling eye
  const newPasswordEye = () => {
    setToggleEye(!toggle)
  }

  const newConfirmPasswordEye = () => {
    setConfirmToggle(!confirmToggle)
  }
  //Cancel button
  const handleCancelButton = (e) => {
    e.preventDefault()
    props.history.goBack();
    // setYesPopup(true)
  };
  //For Logout
  const handleLogout = () => {
    setYesPopup(false)
    // logout()
  };
  const closePopup = () => {
    setShowPopup(false)
  }
  //For handling password
  const handlePosswordButton = () => {
    // e.preventDefault()
    setValidateFlag(true)

    if (formValue.password === "" ||
      formValue.confirmPassword === "" ||
      validationError !== ""
    ) {
      return;
    }
    if (formValue.password !== formValue.confirmPassword) {
      setConfirmPassword("Password and confirm password not matched");
      return;
    }
    setShowPopup(true);
  };
  // const handleClose =()=>{
  // setYesPopup(false)
  // }
  // const navigatedashboard = () => {
  // props.history.goBack();
  // };
  return (
    <Fragment>
      {/* <div className="breadcrumb">
    <ul>
      <li>
        <Link to="/dashboards/home">Dashboard </Link> <span className="arrow-color"> &#62; </span>
      </li>
      <li>Change Password</li>
    </ul>
  </div> */}
      <div className="sub-header">
        <h1> Change Password</h1>
      </div>
      <div className="center-container p-3">
        <Form>
          <Row form>
            <Col md={4}>
              <FormGroup>
                <Label for="password"><b>Enter Old Password</b><span className="validationerror">*</span></Label>
                {/* {!toggle?<BsEyeSlashFill className="on-off-eye cursor-pointer" onClick={newPasswordEye}/>:<BsEyeSlash onClick={newPasswordEye} className="on-off-eye cursor-pointer"/>} */}
                <Input
                  //  type="password"
                  className="newpassword"
                  value={formValue.oldPassword}
                  onChange={handleChange}
                  id="oldPassword"
                  type={toggle ? 'password' : 'text'}
                  placeholder="Enter password" />
                {validationError ? <p className="validationerror">{validationError}</p> : oldPassword ? <p className="validationerror">{oldPassword}</p> : <p></p>}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="password"><b>New Password</b><span className="validationerror">*</span></Label>
                {/* {!toggle?<BsEyeSlashFill className="on-off-eye cursor-pointer" onClick={newPasswordEye}/>:<BsEyeSlash onClick={newPasswordEye} className="on-off-eye cursor-pointer"/>} */}
                <Input
                  //  type="password"
                  className="newpassword"
                  value={formValue.password}
                  onChange={handleChange}
                  id="password"
                  type={toggle ? 'password' : 'text'}
                  placeholder="Enter password" />
                {validationError ? <p className="validationerror">{validationError}</p> : newPassword ? <p className="validationerror">{newPassword}</p> : <p></p>}
              </FormGroup>
            </Col>
            <Col md={4}>
              <FormGroup>
                <Label for="confirmPassword"><b>Confirm Password</b><span className="validationerror">*</span></Label>
                {/* {!confirmToggle?<BsEyeSlashFill className="on-off-eye cursor-pointer" onClick={newConfirmPasswordEye}/>:<BsEyeSlash onClick={newConfirmPasswordEye} className="on-off-eye cursor-pointer"/>} */}
                <Input
                  className="newpassword"
                  value={formValue.confirmPassword}
                  type={confirmToggle ? 'password' : 'text'}
                  onChange={handleChange}
                  id="confirmPassword"
                  placeholder="Enter Confirm password" />
                {confirmPassword ? <p className="validationerror">
                  {confirmPassword}
                </p> :  <p className="validationerror text-left" >{confirmPassword}</p>}
               
              </FormGroup>
            </Col>

          </Row>
          <div className="row">
            <div className="col-12 mt-3">
              <div className="d-flex justify-content-end">
                <button
                  // variant="contained"
                  size="small"
                  onClick={handleCancelButton}
                  className="cancel-btn-chng"
                >
                  Cancel
                </button>

                <button
                  variant="contained"
                  size="small"
                  // type="submit"
                  className="Status-btn-user cancel-btn"
                  onClick={(e) => onChangePassword(e)}
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
          <RctModel
            isOpen={showPopup}
            footer={{
              primaryButton: {
                action: closePopup,
                name: 'Cancel',
                addClass: "btn btn-danger login-button"
              },
              secondaryButton: {
                action:onChangePassword,
                name: 'Yes',
                addClass: "btn btn-success px-4 login-button"
              }
            }}
          >
            {/* <span className='d-block'><img src="../Images/change-password.png" style={{width:60}} /></span><br/> */}
            <h5>Do you really want to Change Password, This will Logout You From Application?</h5>
          </RctModel>
          <RctModel
            isOpen={yesPopup}
            footer={{
              secondaryButton: {
                // action:apiError !=='' ? ()=>{props.history.push('/ChangePassword');setShowPopup(false)}:apiSuccessMessage!==''?handleLogout:'',
                action: apiSuccessMessage !== '' ? handleLogout : '',
                name: "Login",
                addClass: "btn btn-success px-4 login-button"
              },
            }}
          >
            <span className='d-block'><img src='../Images/approve-qc.png' style={{ width: 60 }} /><p className="mt-2"></p></span><br />
            <h5>{apiSuccessMessage} </h5><br /><br />
          </RctModel>
        </Form>
      </div>
    </Fragment>
  )
}
export default ChangePassword;