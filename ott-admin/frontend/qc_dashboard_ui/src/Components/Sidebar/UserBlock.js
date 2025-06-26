/**
 * User Block Component
 */
import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu } from 'reactstrap';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUserFromFirebase } from 'Store/Actions';
import { isValidRole } from 'Constants/constant';

function UserBlock() {
   const [userDropdownMenu, setUserDropdownMenu] = useState(false);
   const dispatch = useDispatch();
   const history = useHistory();
   const data = useSelector(state => state.authUser);
   const [dropdownVal, setDropdownVal] = useState('My Account');
   const logoutUser = (e) => {
      e.preventDefault();
      dispatch(logoutUserFromFirebase(history, dispatch));
   }
   const toggleUserDropdownMenu = () => {
      setUserDropdownMenu(!userDropdownMenu);
   }
   return (
      <div className="top-sidebar">
         <div className="sidebar-user-block profile">
            <Dropdown
               isOpen={userDropdownMenu}
               toggle={() => toggleUserDropdownMenu()}
               className="rct-dropdown"
            >
               <DropdownToggle
                  tag="div"
                  className="d-flex align-items-center"
               >
                  <div className="user-profile"><i className="zmdi zmdi-account"></i>
                  </div>
                  <div className="user-info">
                     <span className="user-name ml-3">{dropdownVal}</span>
                     <i className="zmdi zmdi-chevron-down dropdown-icon mx-3"></i>
                  </div>
               </DropdownToggle>
               <DropdownMenu>
                  <ul className="list-unstyled mb-0 drpdw-menu">
                     <li onClick={() => {
                        setUserDropdownMenu(false);
                        setDropdownVal('My Account')
                     }}>
                        <Link to={{
                           pathname: '/dashboard/crm/my-account',
                           state: { activeTab: 0 }
                        }}>
                           {/* <i className="zmdi zmdi-account text-primary mr-3"></i> */}
                           <span className='text-primary ml-3'>My Account</span>
                        </Link>
                     </li>
                     <li onClick={() => {
                        setUserDropdownMenu(false);
                        setDropdownVal('Change Password')
                     }}>
                        <Link to={{
                           pathname: '/dashboard/crm/change-password',
                           state: { activeTab: 0 }
                        }}>
                           {/* <i className="zmdi zmdi-account text-primary mr-3"></i> */}
                           <span className='text-primary ml-3'>Change Password</span>
                        </Link>
                     </li>


                     {isValidRole('ROLE_ADMIN') && (
                        <>
                           <li onClick={() => {
                              setUserDropdownMenu(false);
                              setDropdownVal('User Management List')
                           }}>
                              <Link
                                 to={{
                                    pathname: '/dashboard/crm/user-list',
                                    // state: { activeTab: 2 }
                                 }}
                              >
                                 <span className=" text-primary ml-3">User managment List</span>
                              </Link>
                           </li>
                           <li onClick={() => {
                              setUserDropdownMenu(false);
                              setDropdownVal('Access Control')
                           }}>
                              <Link
                                 to={{
                                    pathname: '/dashboard/crm/access-control',
                                    // state: { activeTab: 2 }
                                 }}
                              >
                                 <span className=" text-primary ml-3">Access Control</span>
                              </Link>
                           </li>
                        </>
                     )}

                     <li className="border-top">
                        <a href="!#" onClick={(e) => logoutUser(e)}>
                           <i className="zmdi zmdi-power text-danger mr-3"></i>
                           <span>Sign out</span>
                        </a>
                     </li>
                  </ul>
               </DropdownMenu>
            </Dropdown>
         </div>
      </div>
   );
}


export default UserBlock;
