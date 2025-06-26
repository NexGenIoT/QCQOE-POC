import React from 'react'
import CreateEditUser from '../CreateEditUser/CreateUser'

export default function MyAccount(props) {
  return (
    <CreateEditUser sid={props.location.state.sid} myaccount/>
  )
}
