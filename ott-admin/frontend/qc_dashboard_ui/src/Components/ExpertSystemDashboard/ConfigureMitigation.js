import { Table, TableContainer, TableRow, TableCell, TableHead, Box } from '@mui/material';
import { Drawer, IconButton, ListItem, MenuItem, Paper, TextareaAutosize, TextField, Typography } from "@material-ui/core";
import MatButton from "@material-ui/core/Button";
import React from "react";
import { deletConfigMitiListAndRcaBucket, getConfigMitiListBucket, getmitigationType, postAddMitigation, postUpdateMitigation, setmitigationType } from 'Store/Actions';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import { Close } from '@material-ui/icons';
import { NotificationManager } from 'react-notifications';

// for the enter functionality in Recepients
import { WithContext as ReactTags } from "react-tag-input";
import DeleteDialogue from './deleteDialogue';
import { adminMessage, isValidPermission } from 'Constants/constant';


const ConfigureMitigation = () => {

  const dispatch = useDispatch()
  const rcaData = useSelector(state => state.qoeReducer);
  const [dashboardLoader, setDashboardLoader] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mitigationBucket, setMitigationBucket] = useState("");
  const [receptients, setreceptients] = useState([]);
  const [planname, setplanname] = useState("");
  const [subject, setsubject] = useState("");
  const [configure, setConfigure] = useState(false);
  const [deletePlanname, setDeletePlanname] = useState("");
  const [runUseEffect, setrunUseEffect] = useState("");
  const [receptientsText, setreceptientsText] = useState([]);



  const [btnNameConfig, setBtnNameConfig] = useState("CREATE PLAN");
  // const [receptientsText, setreceptientsText] = useState([]);
  // FOR THE ENTER Recepients 
  var inputtag = "";
  const KeyCodes = {
    comma: 188,
    enter: 13,
  };
  const manualStylee = {
    color: "white",
    background: "#E10092",
    width: "83px",
    height: "28px",
    fontSize: "1rem",
    fontWeigth: "100",
  };
  const manualStyleeCancele = {
    color: "#E10092",
    width: "83px",
    height: "28px",
    fontSize: "1rem",
    border: "1px solid #E10092",
    marginRight: "10px",
  };

  const regex = /\s/g;
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  const [tags, setTags] = useState([]);
  const delimiters = [KeyCodes.comma, KeyCodes.enter];
  const handleDelete = (i) => {
    setreceptients(receptients.filter((tag, index) => index !== i));
    setreceptientsText([receptientsText.filter((tag, index) => index !== i)])
    const delimiters = [KeyCodes.comma, KeyCodes.enter];
  }
  // const handleDelete = (i) => {
  //   setreceptients(receptients.filter((tag, index) => index !== i));
  //   setreceptientsText([receptientsText.filter((tag, index) => index !== i)])
  // };
  const handleAddition = (tag) => {
    console.log('tag', tag);
    if(tag?.text.match(emailRegex)){
      setreceptients([...receptients, tag]);
      let newArray = receptientsText.toString();
      setreceptientsText([newArray, tag.text])
    }
  };

  // const handleAddition = (tag) => {
  //   console.log('tag', tag);
  //   setreceptients([...receptients, tag]);
  //   setreceptientsText([tag.text])
  // };
  const handleTagClick = (index) => {

  };
  const handleInputChange = (val) => {
    console.log('val', val);
    inputtag = val
  }

  // end 

  const handleMitigationChange = (event) => {
    setMitigationBucket(event.target.value);
  };

  const addMitigation = () => {

    console.log("add space abcd--",regex.test(planname));
    if (mitigationBucket != "" && receptients != "" && planname != "" && subject != "") {
      if(planname.length>25 || regex.test(planname)){
        return;
      }else{

      if (btnNameConfig == 'UPDATE PLAN') {

        dispatch(postUpdateMitigation(dispatch, mitigationBucket, receptientsText, planname, subject))
        setMobileMenu(false)
        dispatch(getConfigMitiListBucket(dispatch))
        dispatch(getmitigationType(dispatch))

      } else {
        if (mitigationBucket != "" && receptients != "" && planname != "" && subject != "") {
          dispatch(postAddMitigation(dispatch, mitigationBucket, receptientsText, planname, subject))
          setMobileMenu(false)
          setrunUseEffect("add")
        } else {
          NotificationManager.console.error("Please fill all the fields", "", 1000)
        }

      }
    }


    } else {
      NotificationManager.error("Please fill all the fields", "", 1000)
    }

  };

  // for the UpdateConfigMitiData
  const UpdateConfigMitiData = (option) => {


    if (isValidPermission("WRITE_CONFIGURE_MITIGATION")) {
      console.log(option, 'option');
      setBtnNameConfig("UPDATE PLAN");


      setMobileMenu(true)
      console.log(mitigationBucket, "option12");

      setMitigationBucket(option.mitigationType.toLowerCase());
      setplanname(option.plan_name)
      setsubject(option.Subject)
      setreceptientsText(option.Recepients);
      var arrRec = [];
      option.Recepients.forEach(opn => {
        let objRec = { id: opn, text: opn }
        arrRec.push(objRec);
      });
      console.log(arrRec, "arrRec");
      setreceptients(arrRec)
    } else {
      NotificationManager.error(adminMessage.message)
    }


  }



  useEffect(() => {
    setDashboardLoader(true)
    dispatch(getConfigMitiListBucket(dispatch))
    dispatch(getmitigationType(dispatch))
    setTimeout(() => {
      setDashboardLoader(false)
    }, 4000);
  }, [runUseEffect])

  const clearAll = () => {
    setplanname("")
    setMitigationBucket("")
    setreceptients([])
    setsubject("")
  }

  const checkpermissionAdd = () => {
    if (isValidPermission("WRITE_CONFIGURE_MITIGATION")) {
      setreceptients([])
      setplanname()
      setsubject()
      setMitigationBucket()
      setBtnNameConfig('CREATE PLAN')
      setMobileMenu(true)
    } else {
      NotificationManager.error(adminMessage.message)
    }

  }


  const checkPermissionDelete = (option) => {
    if (isValidPermission("WRITE_CONFIGURE_MITIGATION")) {
      setConfigure(true)
      setDeletePlanname(option.plan_name)
    } else {
      NotificationManager.error(adminMessage.message)
    }

  }


  return (
    <>
      <div className="cta-btn">
        <div className="top-left-nav">
          <Typography
            variant="h5"
          >
            Configure Mitigation ({rcaData?.configMitiBucketPlan && rcaData?.configMitiBucketPlan.length})
          </Typography>
          <MatButton className='addnew-config' onClick={() => { checkpermissionAdd() }}>ADD NEW <i className="zmdi zmdi-plus"></i></MatButton>
        </div>
      </div>
      <div className='col-md-12'>  </div>
      <div className='wraper-config'>
        {rcaData?.configMitiBucketPlan && rcaData?.configMitiBucketPlan.length > 0 ?
          (<TableContainer>
            <Table>
              <TableHead style={{ backgroundColor: '#ffffff', borderBottom: '#ffffff' }} >
                <TableRow style={{ borderBottom: '1px solid white', color: 'rgb(151 151 151 / 87%)' }} sx={{ border: 0 }}>
                  <TableCell>Plan Name</TableCell>
                  <TableCell>Mitigation Type</TableCell>
                  <TableCell>Recepients</TableCell>
                  <TableCell>Subject</TableCell>
                </TableRow>
              </TableHead>

              {dashboardLoader ? <div style={{ height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><RctPageLoader /></div> :
                <>
                  {rcaData.configMitiBucketPlan.map((option) => (
                    <TableRow style={{ borderBottom: '1px solid white', color: 'rgb(151 151 151 / 87%)' }} sx={{ border: 0 }}>
                      <TableCell>{option.plan_name}</TableCell>
                      <TableCell>{option.mitigationType}</TableCell>
                      <TableCell>{option.Recepients.toString()}</TableCell>
                      <TableCell>{option.Subject}</TableCell>
                      <TableCell><i className="zmdi zmdi-edit" onClick={() => { UpdateConfigMitiData(option) }}></i> </TableCell>
                      <TableCell><i className="zmdi zmdi-delete" onClick={() => {
                        checkPermissionDelete(option)

                      }}></i> </TableCell>
                    </TableRow>
                  ))}

                </>
              }
            </Table>
          </TableContainer>) : (<h2 style={{ textAlign: 'center', marginLeft: '112px' }}> No Records Found</h2>)}

        <Drawer
          open={mobileMenu}
          onClose={() => {
            setMobileMenu(false)
          }}
          anchor={"right"}
        >
          <div className='SideBarHeader' style={{ marginBottom: "-30px" }}>
            <h3>Configure Mitigation Plan</h3>
            <IconButton onClick={() => setMobileMenu(false)}>
              {" "}
              <Close />
            </IconButton>
          </div>
          <ListItem style={{ display: "block", marginTop: "15px" }}>
            <h3 style={{ fontSize: "15px", color: "#404040" }}>
              {" "}
              Plan Name
            </h3>
            {
              btnNameConfig == 'UPDATE PLAN' ? <h3>{planname}</h3> : <> <TextField
                value={planname}
                id='outlined-basic'
                label=''
                variant='outlined'
                size='small'
                type={"text"}
                style={{
                  background: "#f7f7f7",
                  border: "1",
                  borderRadius: "4px",
                  width: "100%",
                }}
                onChange={(e) => {
                  setplanname(e.target.value);
                }}
              />
                {planname && planname.length > 25 && <p style={{ "color": "red", "font-size": "13px", "margin": "0" }}>Name length should not be greater than 25 </p>}
                {planname && regex.test(planname) && <p style={{ "color": "red", "font-size": "13px", "margin": "0" }}>Name should not have space</p>}

              </>
            }

          </ListItem>

          <ListItem style={{ display: "block", marginTop: "15px" }} className="eds-dropdown">
            <h3 style={{ fontSize: "15px", color: "#404040" }}>
              {" "}
              Mitigation Type
            </h3>

            <TextField
              id="outlined-select-currency"
              variant="outlined"
              fullWidth
              select
              // label="All"
              placeholder='mitigation plan'
              value={mitigationBucket}
              onChange={handleMitigationChange}
            >
              {rcaData?.mitigationType && rcaData?.mitigationType.map((option) => (
                <MenuItem key={option} value={option} >
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </ListItem>

          <ListItem style={{ display: "block", marginTop: "15px" }}>
            <h3 style={{ fontSize: "15px", color: "#404040" }}>
              {" "}
              Recepients
            </h3>
            <p style={{ fontSize: "12px" }}>Enter Recepients Email and then Press <b>Enter</b></p>
            {/* <TextField
               value={receptients}
                id='outlined-basic'
                label=''
                variant='outlined'
                size='small'
                type={"text"}
                style={{
                  background: "#f7f7f7",
                  border: "1",
                  borderRadius: "4px",
                  width: "100%",
                }}
                onChange={(e) => {
                 // if (e.target.value >= 0 || re.test(e.target.value)) {
                    setreceptients(e.target.value);
                 // }
                }}
              /> */}
            <ReactTags
              classNames={{
                tags: "tagsClass",
                tagInput: "tagInputClass",
                tagInputField: "tagInputFieldClass",
                selected: "selectedClass",
                tag: "tagClass",
                remove: "removeClass",
                suggestions: "suggestionsClass",
                activeSuggestion: "activeSuggestionClass",
                editTagInput: "editTagInputClass",
                editTagInputField: "editTagInputField",
                clearAll: "clearAllClass",
              }}
              tags={receptients}
              delimiters={delimiters}
              handleDelete={handleDelete}
              handleAddition={handleAddition}
              handleTagClick={handleTagClick}
              handleInputChange={handleInputChange}
              autocomplete
              allowDragDrop={false}
              placeholder='Enter Recepients Email'
              inputFieldPosition='inline'
            />
          </ListItem>

          <ListItem style={{ display: "block", marginTop: "15px" }}>
            <h3 style={{ fontSize: "15px", color: "#404040" }}>
              {" "}
              Subject
            </h3>
            <TextareaAutosize
              value={subject}
              id='outlined-basic'
              label=''
              variant='outlined'
              size='small'
              type={"text"}
              style={{
                background: "#f7f7f7",
                border: "1",
                borderRadius: "4px",
                width: "100%",
                height: "40px"
              }}
              onChange={(e) => {
                setsubject(e.target.value);
              }}
            />
          </ListItem>
          <ListItem style={{ display: "block", marginTop: "15px" }}>
            <MatButton
              onClick={clearAll}
              className='Status-btn'
              style={{
                fontSize: "0.875rem",
                color: "#008eff",
                width: "100px",
                height: "28px",
                fontWeight: "600",
              }}
            >
              {"CLEAR ALL"}
            </MatButton>
            <MatButton className='addnew-config' onClick={addMitigation}>{btnNameConfig}</MatButton>
          </ListItem>
        </Drawer>
      </div>

      <DeleteDialogue
        assetid=''
        title='Delete'
        isOpen={configure}
        onClose={() => {
          setConfigure(false);
        }}
      >
        <Paper style={{ padding: "0 2em 2em 2em" }}>
          <div>
            <Typography id='modal-modal-description' sx={{ mt: 2 }}>
              Are you sure you want to delete Mitigations plan ?
              <p style={{ "color": "red" }}>{deletePlanname}</p>
            </Typography>
            <div style={{ float: "right", marginTop: "10px" }}>
              <MatButton
                onClick={() => {
                  setConfigure(false);
                }}
                style={manualStyleeCancele}
              >
                {"No"}
              </MatButton>
              <MatButton style={manualStylee} onClick={() => {
                setConfigure(false);
                dispatch(deletConfigMitiListAndRcaBucket(dispatch, deletePlanname, "mitigation_plan", "mitigationrca"))
                setTimeout(() => {
                  setrunUseEffect("delete")
                }, 2000);
              }}>
                {"Yes"}
              </MatButton>
            </div>
          </div>
        </Paper>
      </DeleteDialogue>
    </>
  )
}

export default ConfigureMitigation;