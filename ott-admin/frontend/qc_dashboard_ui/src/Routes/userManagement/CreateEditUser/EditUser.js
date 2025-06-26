import React from "react";
import CreateEditUser from "./CreateUser";

const EditUser = (props) => {

    return <>
        <CreateEditUser {...props} editUser sid={props.location.state.sid}  />
    </>
}

export default EditUser;