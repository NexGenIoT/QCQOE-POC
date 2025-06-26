import React from 'react'
import CreateEditUser from "./CreateEditRole";
const EditRole = (props) => {
  return <>
    <CreateEditUser {...props} editRole/>
    </>
}

export default EditRole;