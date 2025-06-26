import React, { useState, useEffect } from "react";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import {
  FormControlLabel,
  Grid,
  ListItem,
  TextField,
  Paper,
  Snackbar,
} from "@material-ui/core";
import Switch from "react-switch";
import GlobalSettingDialog from "./GlobalSettingDialog";
import MatButton from "@material-ui/core/Button";
import Scrollbars from "react-custom-scrollbars";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalSetting, setGlobalsettingPost } from "Store/Actions";
import { NotificationManager } from "react-notifications";

function GlobalSetting(props) {
  const dispatch = useDispatch();
  const data = useSelector((state) => state.qoeReducer);

  const [open, setOpen] = useState(false);
  const [openLocalInt, setLocalInt] = useState(false);
  const [openAndroidProb, setAndroidProb] = useState(false);
  const [openAndroidMitigation, setAndroidMitigation] = useState(false);
  const [openWebMitigation, setWebMitigation] = useState(false);
  const [openWebProb, setWebProb] = useState(false);
  const [openFireTvProb, setFireTvProb] = useState(false);
  const [openFireTvMitigation, setFireTvMitigation] = useState(false);
  const [openiOSMitigation, setiOSMitigation] = useState(false);
  const [openiOSProb, setiOSProb] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [cnfText, setCnfText] = useState("");

  const handleOpen = (checked) => setLocalInt(checked);

  const clickOnCnf = () => {
    if (cnfText.trim() === "I confirm the configuration changes") {
      applyGlobalSetting();
      setOpenDialog(false);
      setOpen(false);
      setCnfText("");
    } else {
      NotificationManager.success(
        `Please enter the correct text given in the box`,
        "",
        1000
      );
    }
  };

  useEffect(() => {
    dispatch(getGlobalSetting(dispatch));
  }, []);

  useEffect(() => {
    if (data?.globalSetting != undefined) {
      data?.globalSetting?.local_intelligence == "OFF"
        ? setLocalInt(false)
        : setLocalInt(true);
      data?.globalSetting?.android_probe == "OFF"
        ? setAndroidProb(false)
        : setAndroidProb(true);
      data?.globalSetting?.android_mitigation == "OFF"
        ? setAndroidMitigation(false)
        : setAndroidMitigation(true);
      data?.globalSetting?.web_mitigation == "OFF"
        ? setWebMitigation(false)
        : setWebMitigation(true);
      data?.globalSetting?.web_probe == "OFF"
        ? setWebProb(false)
        : setWebProb(true);
      data?.globalSetting?.firetv_probe == "OFF"
        ? setFireTvProb(false)
        : setFireTvProb(true);
      data?.globalSetting?.firetv_mitigation == "OFF"
        ? setFireTvMitigation(false)
        : setFireTvMitigation(true);
      data?.globalSetting?.ios_probe == "OFF"
        ? setiOSProb(false)
        : setiOSProb(true);
      data?.globalSetting?.ios_mitigation == "OFF"
        ? setiOSMitigation(false)
        : setiOSMitigation(true);
    }
  }, [data?.globalSetting]);

  const applyGlobalSetting = async () => {
    let payload = {
      local_intelligence: openLocalInt ? "ON" : "OFF",
      android_probe: openAndroidProb ? "ON" : "OFF",
      android_mitigation: openAndroidMitigation ? "ON" : "OFF",
      web_probe: openWebProb ? "ON" : "OFF",
      web_mitigation: openWebMitigation ? "ON" : "OFF",
      firetv_probe: openFireTvProb ? "ON" : "OFF",
      firetv_mitigation: openFireTvMitigation ? "ON" : "OFF",
      ios_probe: openiOSProb ? "ON" : "OFF",
      ios_mitigation: openiOSMitigation ? "ON" : "OFF",
      // "created_by": "admin@qoe.com",
      updated_by: localStorage.getItem("firstName"),
      // "created_at": "2022-06-12",
      updated_at: new Date().toLocaleDateString(),
    };

    await dispatch(
      setGlobalsettingPost(
        dispatch,
        payload.local_intelligence,
        payload.android_probe,
        payload.android_mitigation,
        payload.web_probe,
        payload.web_mitigation,
        payload.firetv_probe,
        payload.firetv_mitigation,
        payload.ios_probe,
        payload.ios_mitigation,
        payload.updated_by,
        payload.updated_at
      )
    );

    await dispatch(getGlobalSetting(dispatch));
  };

  const manualStylee = {
    color: "white",
    background: "#1992fb",
    width: "83px",
    height: "28px",
    fontSize: "1rem",
    fontWeigth: "100",
  };
  return (
    <>
      <div>
        <UncontrolledDropdown
          isOpen={open}
          nav
          className="list-inline-item notification-dropdown"
        >
          <DropdownToggle nav className="p-0">
            <Tooltip title="Global Setting" placement="bottom">
              <IconButton
                onClick={() => {
                  open == false && dispatch(getGlobalSetting(dispatch));
                  setOpen(true);
                }}
                className="custom-notification"
                aria-label="bell"
              >
                <i className="zmdi zmdi-settings"></i>
              </IconButton>
            </Tooltip>
          </DropdownToggle>
          <DropdownMenu right>
            <div className="dropdown-content notification-content">
              <div className="dropdown-top d-flex justify-content-between rounded-top ">
                <span>
                  <i className="zmdi zmdi-settings"></i> Global Setting
                </span>
                <i
                  style={{ cursor: "pointer" }}
                  onClick={() => setOpen(false)}
                  className="zmdi zmdi-close"
                ></i>
              </div>
              <div className="dropdown-foot p-2 bg-white rounded-bottom">
                <Button
                  variant="contained"
                  color="primary"
                  className="mr-10  bg-primary"
                  style={{
                    float: "left",
                    marginBottom: "20px",
                    marginLeft: "20px",
                    width: "110px",
                  }}
                  onClick={() => {
                    setOpenDialog(true);
                  }}
                >
                  Apply
                </Button>
              </div>
              <Scrollbars
                className="rct-scroll removeBtmLine"
                autoHeight
                autoHeightMin={100}
                autoHeightMax={300}
                style={{ marginBottom: "20px" }}
              >
                <div className="removeBtmLine">
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    {/* <Grid item xs={10} md={10} style={{ textAlign: 'end' }} className="switch-label">
                      <FormControlLabel
                        label="Local Intelligence"
                        labelPlacement="start"
                        onChange={handleOpen}
                        control={<Switch onColor="#E10092" onChange={(checked) =>{
                          setLocalInt(checked)
                        } } uncheckedIcon={false}
                          checkedIcon={false} checked={openLocalInt} />}
                      />
                    </Grid> */}
                  </ListItem>
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="Android Prob"
                        labelPlacement="start"
                        onChange={(checked) => setAndroidProb(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setAndroidProb(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openAndroidProb}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="Android Mitigation"
                        labelPlacement="start"
                        onChange={(checked) => setAndroidMitigation(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setAndroidMitigation(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openAndroidMitigation}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="Web Prob"
                        labelPlacement="start"
                        onChange={(checked) => setWebProb(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setWebProb(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openWebProb}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>

                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="Web Mitigation"
                        labelPlacement="start"
                        onChange={(checked) => setWebMitigation(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setWebMitigation(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openWebMitigation}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="Firestick Prob"
                        labelPlacement="start"
                        onChange={(checked) => setFireTvProb(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setFireTvProb(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openFireTvProb}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="Firestick Mitigation"
                        labelPlacement="start"
                        onChange={(checked) => setFireTvMitigation(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setFireTvMitigation(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openFireTvMitigation}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="iOS Prob"
                        labelPlacement="start"
                        onChange={(checked) => setiOSProb(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setiOSProb(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openiOSProb}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>
                  <ListItem
                    style={{
                      borderBottomWidth: 0,
                      paddingTop: 7,
                      paddingBottom: 0,
                    }}
                  >
                    <Grid
                      item
                      xs={10}
                      md={10}
                      style={{ textAlign: "end" }}
                      className="switch-label"
                    >
                      <FormControlLabel
                        label="iOS Mitigation"
                        labelPlacement="start"
                        onChange={(checked) => setiOSMitigation(checked)}
                        control={
                          <Switch
                            onColor="#E10092"
                            onChange={(checked) => {
                              setiOSMitigation(checked);
                            }}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            checked={openiOSMitigation}
                          />
                        }
                      />
                    </Grid>
                  </ListItem>
                </div>
              </Scrollbars>
            </div>
          </DropdownMenu>
        </UncontrolledDropdown>

        <GlobalSettingDialog
          assetid=""
          title="User Consent"
          isOpen={openDialog}
          onClose={() => {
            setOpenDialog(false);
            if (data?.globalSetting != undefined) {
              data?.globalSetting?.local_intelligence == "OFF"
                ? setLocalInt(false)
                : setLocalInt(true);
              data?.globalSetting?.android_probe == "OFF"
                ? setAndroidProb(false)
                : setAndroidProb(true);
              data?.globalSetting?.android_mitigation == "OFF"
                ? setAndroidMitigation(false)
                : setAndroidMitigation(true);
              data?.globalSetting?.web_mitigation == "OFF"
                ? setWebMitigation(false)
                : setWebMitigation(true);
              data?.globalSetting?.web_probe == "OFF"
                ? setWebProb(false)
                : setWebProb(true);
              data?.globalSetting?.firetv_probe == "OFF"
                ? setFireTvProb(false)
                : setFireTvProb(true);
              data?.globalSetting?.firetv_mitigation == "OFF"
                ? setFireTvMitigation(false)
                : setFireTvMitigation(true);
              data?.globalSetting?.ios_probe == "OFF"
                ? setiOSProb(false)
                : setiOSProb(true);
              data?.globalSetting?.ios_mitigation == "OFF"
                ? setiOSMitigation(false)
                : setiOSMitigation(true);
            }
          }}
        >
          <Paper style={{ padding: "0 2em 2em 2em" }}>
            <div>
              <ListItem style={{ display: "block", marginTop: "15px" }}>
                <h3 style={{ fontSize: "15px", color: "#404040" }}>
                  Please type{" "}
                  <span style={{ color: "#f606a9" }}>
                    I confirm the configuration changes
                  </span>{" "}
                  in the message below and then click Confirm to Apply the
                  global change.
                </h3>
                <TextField
                  value={cnfText}
                  id="outlined-basic"
                  label=""
                  variant="outlined"
                  size="small"
                  type={"text"}
                  onChange={(e) => {
                    setCnfText(e.target.value);
                  }}
                  style={{
                    background: "#f7f7f7",
                    border: "1",
                    borderRadius: "4px",
                    width: "100%",
                  }}
                />
              </ListItem>
              <div style={{ float: "right", marginTop: "10px" }}>
                <MatButton onClick={clickOnCnf} style={manualStylee}>
                  {"Confirm"}
                </MatButton>
              </div>
            </div>
          </Paper>
        </GlobalSettingDialog>

        {/* <Snackbar
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            open={isStatusUpdated}
            onClose={() => setIsStatusUpdated(false)}
            autoHideDuration={2000}
            message={<span id="message-id">{successMessage}</span>}
          /> */}
      </div>
    </>
  );
}
export default GlobalSetting;
