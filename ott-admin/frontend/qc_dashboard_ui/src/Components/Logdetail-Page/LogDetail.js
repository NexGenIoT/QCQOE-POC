import React, { useEffect } from 'react';  
import { useDispatch } from 'react-redux';
import { clearConnectedData } from 'Store/Actions';
import DataTable from '../Tables/data-table'

const LogDetail=()=>{
  const dispatch = useDispatch()
  useEffect(()=>{
    return () => {
      dispatch(clearConnectedData())
    }
  }, [dispatch])
  return (
      <DataTable/>
  )
}
 
export default LogDetail;