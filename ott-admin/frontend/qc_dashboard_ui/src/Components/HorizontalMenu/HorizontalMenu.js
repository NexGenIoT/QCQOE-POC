/**
 * Horizontal Menu
 */
import React from 'react';
import IntlMessages from 'Util/IntlMessages';
import navLinks from './NavLinks';
import NavMenuItem from './NavMenuItem';

function HorizontalMenu() {
   return (
      <div className="horizontal-menu">
         <ul className="list-unstyled nav">
            {navLinks && navLinks.category1 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-view-dashboard"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.general" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks && navLinks.category1.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks && navLinks.category2 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-widgets"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.modules" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks && navLinks.category2.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks && navLinks.category3 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-view-carousel"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.component" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks && navLinks.category3.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks && navLinks.category4 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-wrench"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.features" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks && navLinks.category4.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks && navLinks.category5 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-assignment-check"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.applications" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks && navLinks.category5.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
            {navLinks && navLinks.category6 &&
               <li className="nav-item">
                  <a href="!#" onClick={e => e.preventDefault()} className="nav-link">
                     <i className="zmdi zmdi-assignment-check"></i>
                     <span className="menu-title"><IntlMessages id="sidebar.extensions" /></span>
                  </a>
                  <ul className="list-unstyled sub-menu">
                     {navLinks && navLinks.category6.map((menu, key) => (
                        <NavMenuItem
                           menu={menu}
                           key={key}
                        />
                     ))}
                  </ul>
               </li>
            }
         </ul>
      </div>
   );
}

export default HorizontalMenu;
