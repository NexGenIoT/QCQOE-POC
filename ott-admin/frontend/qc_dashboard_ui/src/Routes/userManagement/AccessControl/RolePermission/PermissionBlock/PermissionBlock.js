import React, { useState, useEffect } from "react";
import { connect, useSelector } from "react-redux";
import { Grid } from "@mui/material";
import './RolesPermissionBlock.scss';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip } from "@mui/material";
import RctModel from "Util/Modal";
import Delete from '../../../../../Assets/Images/delete.png';
import { getReadAndWrite } from "Constants/constant";
// import RctModel from '../../../Components/Modal/Examples/Modal';
const PermissionBlock = (props) => {
    const userReducer = useSelector(state => state.userReducer)
    const { items } = props;
    console.log("permission block--",items);
    const [showPopup, setShowPopup] = useState(false);
    const [data, setData] = useState();
    const closePopup = () => {
        setShowPopup(false)
    }
    const [permissionData, setPermissionData] = useState([]);
    useEffect(() => {
        setPermissionData(userReducer?.permissionList);
       } , [userReducer?.permissionList])


    return <div className="col-md-12 px-0">
        {
            Object.keys(items).map(key => {
                const item = items[key];
                const mod = permissionData.find(p => p.id === item.module);
                return <>
                   { mod && <div className='roles-permission-bg'>
                    <h4 className="mb-1">{`${mod ? mod.permission : ''}`}</h4>
                    <div className='perm-list'>
                        <Grid container spacing={1}>
                            <Grid item xs={10}>

                                {
                                    item.selectedPermission.map(p => {
                                        if (p.checked) {
                                            return <button className="update" key={p.id}>
                                                {getReadAndWrite(p.title)}
                                            </button>
                                        }
                                    })
                                }

                            </Grid>
                            <div className="mt-3 permission-action icon-action">
                                <Tooltip title="Edit" arrow>
                                    <span>
                                        <ModeEditIcon
                                            className="edit-icon"
                                            onClick={() => props.updateHandler(item)}
                                        />
                                        {/* <i class="zmdi zmdi-edit"  ></i>  */}
                                    </span>
                                </Tooltip>
                                <Tooltip title="Delete" arrow>
                                    <span>
                                        <DeleteIcon
                                            className="edit-icon"
                                            onClick={() => { setShowPopup(true); setData(item) }}
                                        />
                                    </span>
                                </Tooltip>

                            </div>

                        </Grid>
                    </div>

                </div>
                }
               </> 


            })
        }
        <RctModel
            isOpen={showPopup}
            footer={{
                primaryButton: {
                    action: closePopup,
                    name: 'Cancel',
                    addClass: "btn btn-cancel login-button"
                },
                secondaryButton: {
                    action: () => { setShowPopup(false); props.deleteHandler(data) },
                    name: 'Yes',
                    addClass: "btn btn-success px-4 login-button"
                }
            }}
        >
            <span className='d-block'><img src={Delete} style={{ width: 60 }} /></span><br />
            <h5>Do you really want to Delete Permission?</h5>
        </RctModel>
    </div>
}

const mapStateToProps = state => {
    return {
        // permissions: state.permissionReducer.permissions,
    }
}

const mapDispatcherToProps = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatcherToProps)(PermissionBlock);