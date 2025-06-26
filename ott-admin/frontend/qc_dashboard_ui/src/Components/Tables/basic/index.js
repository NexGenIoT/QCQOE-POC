/**
 * Basic Table
 */
import React, { Fragment, useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import { Media, Badge } from 'reactstrap';
import IconButton from '@material-ui/core/IconButton';
// api
import api from 'Api';
// page title bar
import PageTitleBar from 'Components/PageTitleBar/PageTitleBar';
// intl messages
import IntlMessages from 'Util/IntlMessages';
// rct card box
import RctCollapsibleCard from 'Components/RctCollapsibleCard/RctCollapsibleCard';
// For Basic Table
let id = 0;

function createData(name, calories, fat, carbs, protein) {
	id += 1;
	return { id, name, calories, fat, carbs, protein };
}

const data = [
	createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
	createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
	createData('Eclair', 262, 16.0, 24, 6.0),
	createData('Cupcake', 305, 3.7, 67, 4.3),
	createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function BasicTable(props){
   const [employeePayroll, setEmployeePayroll] = useState(null);
   
   useEffect(() => {
      getEmployeePayrolls();
   },[])
   
	// get employee payrols
	const getEmployeePayrolls = () => {
		api.get('employeePayrols.js')
			.then((response) => {
				setEmployeePayroll(response.data);
			})
			.catch(error => {
				// error handling
			})
	}

   const { match } = props;
   return (
      <div className="table-wrapper">
         <PageTitleBar title={<IntlMessages id="sidebar.basic" />} match={match} />
         <RctCollapsibleCard heading="Basic Table" fullBlock>
            <div className="table-responsive">
               <Table>
                  <TableHead>
                     <TableRow hover>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat (g)</TableCell>
                        <TableCell align="right">Carbs (g)</TableCell>
                        <TableCell align="right">Protein (g)</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     <Fragment>
                        {data.map(n => {
                           return (
                              <TableRow hover key={n.id}>
                                 <TableCell>{n.name}</TableCell>
                                 <TableCell align="right">{n.calories}</TableCell>
                                 <TableCell align="right">{n.fat}</TableCell>
                                 <TableCell align="right">{n.carbs}</TableCell>
                                 <TableCell align="right">{n.protein}</TableCell>
                              </TableRow>
                           );
                        })}
                     </Fragment>
                  </TableBody>
               </Table>
            </div>
         </RctCollapsibleCard>
         <RctCollapsibleCard heading="Employee Payroll" fullBlock>
            <div className="table-responsive">
               <Table>
                  <TableHead>
                     <TableRow hover>
                        <TableCell>Name</TableCell>
                        <TableCell>Designation</TableCell>
                        <TableCell>Salary</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell>Action</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     <Fragment>
                        {employeePayroll && employeePayroll.map((employee, key) => (
                           <TableRow hover key={key}>
                              <TableCell>
                                 <Media>
                                    <Media left>
                                       <Media object src={employee.employeeAvatar} alt="User Profile 1" className="rounded-circle mr-20" width="40" height="40" />
                                    </Media>
                                    <Media body><h5 className="m-0 pt-15">{employee.employeeName}</h5></Media>
                                 </Media>
                              </TableCell>
                              <TableCell>{employee.designation}</TableCell>
                              <TableCell>${employee.salary}</TableCell>
                              {employee.status === 1 ?
                                 <TableCell><Badge color="success">Done</Badge></TableCell>
                                 : <TableCell><Badge color="warning">Done</Badge></TableCell>
                              }
                              <TableCell>
                                 <IconButton className="text-success" aria-label="Delete"><i className="zmdi zmdi-check-all"></i></IconButton>
                                 <IconButton className="text-danger" aria-label="Add an alarm"><i className="zmdi zmdi-close"></i></IconButton>
                              </TableCell>
                           </TableRow>
                        ))}
                     </Fragment>
                  </TableBody>
               </Table>
            </div>
         </RctCollapsibleCard>
         <RctCollapsibleCard heading="Contextual colored Table" fullBlock>
            <div className="table-responsive">
               <Table>
                  <TableHead>
                     <TableRow>
                        <TableCell>Order ID</TableCell>
                        <TableCell>Invoice</TableCell>
                        <TableCell>Customer Name</TableCell>
                        <TableCell>Profitment</TableCell>
                        <TableCell>Status</TableCell>
                     </TableRow>
                  </TableHead>
                  <TableBody>
                     <TableRow className="table-primary">
                        <TableCell>#10001</TableCell>
                        <TableCell>INV-001001</TableCell>
                        <TableCell>Juan Rodriquez</TableCell>
                        <TableCell>$120.40</TableCell>
                        <TableCell><Badge color="info" className="badge-pill">Pending</Badge></TableCell>
                     </TableRow>
                     <TableRow className="table-secondary">
                        <TableCell>#10002</TableCell>
                        <TableCell>INV-001002</TableCell>
                        <TableCell>Grace Maldonado</TableCell>
                        <TableCell>$45.40</TableCell>
                        <TableCell><Badge color="success" className="badge-pill">Paid</Badge></TableCell>
                     </TableRow>
                     <TableRow className="table-success">
                        <TableCell>#10003</TableCell>
                        <TableCell>INV-001003</TableCell>
                        <TableCell>Johnny Gonzales</TableCell>
                        <TableCell>$45.40</TableCell>
                        <TableCell><Badge color="danger" className="badge-pill">Canceled</Badge></TableCell>
                     </TableRow>
                     <TableRow className="table-danger">
                        <TableCell>#10004</TableCell>
                        <TableCell>INV-001004</TableCell>
                        <TableCell>Juan Rodriquez</TableCell>
                        <TableCell>$155.40</TableCell>
                        <TableCell><Badge color="success" className="badge-pill">Paid</Badge></TableCell>
                     </TableRow>
                     <TableRow className="table-info">
                        <TableCell>#10002</TableCell>
                        <TableCell>INV-001002</TableCell>
                        <TableCell>Grace Maldonado</TableCell>
                        <TableCell>$45.40</TableCell>
                        <TableCell><Badge color="danger" className="badge-pill">Canceled</Badge></TableCell>
                     </TableRow>
                     <TableRow className="table-secondary">
                        <TableCell>#10003</TableCell>
                        <TableCell>INV-001003</TableCell>
                        <TableCell>Johnny Gonzales</TableCell>
                        <TableCell>$45.40</TableCell>
                        <TableCell><Badge color="info" className="badge-pill">Pending</Badge></TableCell>
                     </TableRow>
                  </TableBody>
               </Table>
            </div>
         </RctCollapsibleCard>
      </div>
   );
}

export default BasicTable;
