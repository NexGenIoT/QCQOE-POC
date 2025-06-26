import React from 'react';
// import { Skeleton } from '@mui/material';
import Skeleton from '@mui/material/Skeleton'

const LoadingSkeleton = () => {
  return (
    <Skeleton 
    // style={{marginTop: '-3.85rem'}}
    width={330}
    height={180}
    variant='rectangular'
    animation="wave"
    />
    
  )
}

export default LoadingSkeleton