import React, { useEffect } from 'react';  
import { useDispatch } from 'react-redux';
import { clearConnectedData } from 'Store/Actions';
import PendingDataTable from 'Components/Tables/pending-data-table';

const PendingData=()=>{
  const dispatch = useDispatch()
  useEffect(()=>{
    return () => {
      dispatch(clearConnectedData())
    }
  }, [dispatch])
  return (
      <PendingDataTable/>
  )
}
 
export default PendingData;