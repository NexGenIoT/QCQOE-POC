import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
// import Modal from "react-modal";
// import RctModel from '../../../Components/Modal/Examples/Modal';
import { Grid } from "@mui/material";
// import Controls from "../../../Components/Controls/Controls";
import { FormControl, ListItem, MenuItem, Select } from "@mui/material";
import { Scrollbars } from "react-custom-scrollbars";
// import { useForm, Form } from "../../../Components/Controls/useForm";
import CloseIcon from "@mui/icons-material/Close";
import "./AddPermission.scss";
import Controls from "Routes/userManagement/controls/Controls";
import { useForm, Form } from "Routes/userManagement/controls/useForm";
import RctModel from "Util/Modal";
import axios from "axios";
import { getReadAndWrite } from "Constants/constant";

const AddPermission = (props) => {
  const userReducer = useSelector((state) => state.userReducer);
  let txt = props.edit ? "EDIT PERMISSION" : "ADD PERMISSION";
  let btnTxt = props.edit ? "UPDATE" : "ADD";
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: "15rem",
        // width: 250,
      },
    },
  };
  const { item } = props;
  const [moduleList, setModuleList] = useState([]);
  const [selectAllChecked, setSelectAllChecked] = useState(false);

  const initialValue = {
    module: props.selectedModule,
    selectedPermission: item ? item.selectedPermission : [],
  };

  const findError = (data) => {
    let flag = false;
    if (data.some((x) => x.checked == true)) {
      flag = true;
    }
    return flag;
  };

  const validate = (fieldValues = values) => {
    let temp = { ...errors };
    if ("module" in fieldValues) {
      temp.module = fieldValues.module ? "" : "Module required";
    }
    if ("selectedPermission" in fieldValues) {
      temp.selectedPermission = findError(fieldValues.selectedPermission)
        ? ""
        : "Please choose atleast one permission";
    }

    setErrors({
      ...temp,
    });

    if (fieldValues === values) {
      return Object.values(temp).every((x) => x === "");
    }
  };

  const { values, setValues, errors, setErrors, handleInputChanges } = useForm(
    initialValue,
    true,
    validate
  );

  const formSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      props.onClickHandler(values);
      props.closeHandler(false);
    }
  };

  const populateModuleList = () => {
    if (
      userReducer.permissionList !== undefined &&
      userReducer.permissionList.length > 0
    ) {
      const tempModuleList = userReducer.permissionList.map((mod) => {
        return {
          ...mod,
          title: mod.permission,
        };
      });
      setModuleList(tempModuleList);
    }
  };

  const populateModuleWisePermissionData = (data) => {
    console.log({ permissionData: data });
    if (data !== undefined && data.length > 0) {
      const tempModulePermissionList = data.map((per) => {
        return {
          ...per,
          title: per.permission,
        };
      });
      if (Object.keys(props.selectedPermissions).length > 0) {
        if (props.selectedPermissions[values.module]) {
          if (props.userInfo) {
            const savedPermissions = props.userInfo.tempPermissions;
            tempModulePermissionList.forEach((ele) => {
              if (savedPermissions[values.module]) {
                const itemIndex = savedPermissions[
                  values.module
                ].selectedPermission.findIndex((sp) => sp.id === ele.id);
                ele.checked = false;
                if (itemIndex > -1) {
                  if (
                    savedPermissions[values.module].selectedPermission[
                      itemIndex
                    ].checked
                  ) {
                    ele.checked = true;
                  }
                }
              }
            });
          }
        }
      }
      setValues({
        ...values,
        selectedPermission: tempModulePermissionList,
      });
    }
  };

  const getModulePermissions = () => {
    //   setLoading(true);
    const user = localStorage.getItem("user_id");
    const apiPath = `https://qcotp.qoetech.com/master/permission?loadChildPermission=true&parentPermissionSid=${values.module}&projectSid=${props.projectValue}`;
    axios
      .get(apiPath, {
        headers: {
          Authorization: `Bearer ${user}`,
        },
      })
      .then((res) => {
        populateModuleWisePermissionData(res.data);
      });
    // axios.get(`https://qcotp.qoetech.com/master/permission`).then((res) => console.log({ permission: res }))
    //   api
    //   callAPI(apiPath,"GET")
    //     .then((res) => {
    //       populateModuleWisePermissionData(res);
    //     })
    //     .catch((err) => {
    //       console.log(err.message);
    //     })
    //     .finally((_) => {
    //     //   setLoading(false);
    //     });
  };

  const updateSelectedPermissionList = (args, item) => {
    const currentValue = args.target.value;
    const temp = values.selectedPermission;
    temp.forEach((t) => {
      if (t.id === item.id) {
        t.checked = currentValue;
      }
    });
    // if(currentValue) {
    //     const valName = permissionList.find(i => i.id === item.id);
    //     temp.push(valName);
    // } else {
    //     const itemIndex = temp.findIndex(t => t.id === item.id);
    //     // temp.splice(itemIndex, 1);
    // }

    setValues({
      ...values,
      selectedPermission: temp,
    });
    setErrors({
      ...errors,
      selectedPermission: "",
    });
  };

  useEffect(() => {
    const temp = values.selectedPermission;
    let count = 0;
    temp.forEach((t) => {
      if (t.checked === true) {
        count = count + 1;
        if (count === values.selectedPermission.length) {
          setSelectAllChecked(true);
        }
      }
      if (t.checked === false) {
        setSelectAllChecked(false);
      }
    });
  }, [values]);

  const selectAllPermissionList = (e) => {
    let temp = values.selectedPermission;
    if (e.target.value === false) {
      setSelectAllChecked(false);
      temp.forEach((t) => {
        t.checked = false;
      });
      setValues({
        ...values,
        selectedPermission: temp,
      });
      setErrors({
        ...errors,
        selectedPermission: "",
      });
    } else {
      setSelectAllChecked(true);
      temp.forEach((t) => {
        t.checked = true;
      });
      setValues({
        ...values,
        selectedPermission: temp,
      });
      setErrors({
        ...errors,
        selectedPermission: "",
      });
    }
  };

  useEffect(() => {
    // setValues({
    //     ...values,
    //     selectedPermission: [],
    // });
    if (values.module) {
      props.setSelectedModule(values.module);
      if (values.module !== 0) {
        getModulePermissions();
      }
    }
  }, [values.module, props.projectValue]);

  useEffect(() => {
    const permissionSids = [];
    Object.keys(values.selectedPermission).forEach((moduleId) => {
      if (props.selectedPermissions[moduleId]) {
        props.selectedPermissions[moduleId].selectedPermission.forEach(
          (per) => {
            if (per.checked) {
              permissionSids.push(per.id);
            }
          }
        );
      }
    });
    //   props.setUserInfo({
    //     ...props.userInfo,
    //     permissions: values.selectedPermission,
    //   });
  }, [values.selectedPermission]);

  useEffect(() => {
    populateModuleList();
  }, [userReducer.permissionList]);

  const resetButtn = () => {};

  return (
    <RctModel
      isOpen={props.open}
      contentLabel={txt}
      portalClassName="delete-fault add-permission add-permission-model"
    >
      <div className="mt-0 p-3">
        {/* <Loader show={loading} /> */}
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <div className="d-flex justify-content-between ml-2">
              {txt}
              <span
                onClick={() => props.closeHandler(false)}
                style={{ float: "right", cursor: "pointer" }}
              >
                <CloseIcon />
              </span>
            </div>
          </Grid>
          <Grid item xs={12} className="grid-block">
            <Form onSubmit={formSubmit}>
              <Grid
                container
                spacing={1}
                justifyContent="flex-start"
                style={{ flexDirection: "row" }}
              >
                <Grid item xs={12}>
                  {/* <Controls.Select
                                              className={''}
                                              name={'module'}
                                              label={'Module'}
                                              value={values.module}
                                              items={moduleList}
                                              onChange={handleInputChanges}
                                              error={errors.module}
                                          /> */}
                  <ListItem
                    style={{
                      display: "block",
                      paddingLeft: "10px",
                    }}
                  >
                    <FormControl fullWidth>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        name={"module"}
                        variant="outlined"
                        value={values.module}
                        MenuProps={MenuProps}
                        onChange={handleInputChanges}
                      >
                        {moduleList?.map((make, index) => (
                          <MenuItem
                            key={index}
                            value={make.id}
                            className="demo-simple-select"
                            style={{ display: "block", padding: 10 }}
                          >
                            {make.permission}
                          </MenuItem>
                        ))}
                      </Select>
                      <p style={{ color: "red", fontWeight: "normal" }}>
                        {errors.selectedPermission}
                      </p>
                    </FormControl>
                  </ListItem>
                </Grid>
                {values.selectedPermission != "" && (
                  <>
                    <Grid item xs={12}>
                      {
                        <div className="role-checklist">
                          {/* <label style={{marginLeft:"10px"}} >Details</label> */}
                          <Controls.Checkbox
                            className="selectAdd"
                            name="selectAll"
                            label="Select All"
                            checked={selectAllChecked ? true : false}
                            onChange={selectAllPermissionList}
                          />
                          <div className="role-checklist-border">
                            <Scrollbars
                              className="rct-scroll"
                              autoHeight
                              autoHeightMin={100}
                              autoHeightMax={200}
                            >
                              <ul>
                                <div className="role-checklist-list-style">
                                  <li>
                                    {values.selectedPermission.map((item) => {
                                      return (
                                        <Controls.Checkbox
                                          key={item.id}
                                          name={item.title}
                                          label={getReadAndWrite(item.title)}
                                          checked={item.checked ? true : false}
                                          onChange={(args) =>
                                            updateSelectedPermissionList(
                                              args,
                                              item
                                            )
                                          }
                                        />
                                      );
                                    })}
                                  </li>
                                </div>
                              </ul>
                            </Scrollbars>
                          </div>
                        </div>
                      }
                      {/* <span className="selected-permission-error">
                            {errors.selectedPermission}
                          </span> */}
                    </Grid>
                    <Grid item xs={12}>
                      <div className="d-flex justify-content-end add-button">
                        {/* <Controls.Button
                              text={"RESET"}
                              className="reset-btn"
                              type="button"
                              variant="default"
                              onClick={() => getModulePermissions()}
                            /> */}
                        <Controls.Button
                          text={btnTxt}
                          className="create-btn ml-2"
                          type={"submit"}
                          onClick={formSubmit}
                        />

                        {/* <Controls.Button
                              text={"SELECT ALL"}
                              className="create-btn Status-btn m-3"
                              type="button"
                              variant="default"
                              onClick={selectAllPermissionList}
                            /> */}
                      </div>
                    </Grid>
                  </>
                )}
              </Grid>
            </Form>
          </Grid>
        </Grid>
      </div>
    </RctModel>
  );
};

const mapStateToProps = (state) => {
  return {
    //   permissions: state.permissionReducer.permissions,
  };
};

const mapDispatcherToProps = (dispatch) => {
  return {};
};

export default connect(mapStateToProps, mapDispatcherToProps)(AddPermission);
