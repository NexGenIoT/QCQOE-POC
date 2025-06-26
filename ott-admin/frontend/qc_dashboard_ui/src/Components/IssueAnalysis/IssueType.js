import React from 'react';    
import { Link } from 'react-router-dom';

const IssueType=()=>{
  return <>
  <div className="issue-type"> 
  <Link to="/"> Url Genration </Link> 
  <Link to="/"> Rechability </Link> 
  <Link to="/"> Playbility   </Link> 
  <Link to="/"> Integrity Issue </Link> 

</div>
  </> 
}
 
export default IssueType;