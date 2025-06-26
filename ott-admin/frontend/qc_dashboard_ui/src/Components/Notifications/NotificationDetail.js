import { Box, Typography } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';
import Scrollbars from 'react-custom-scrollbars';
import { useSelector } from 'react-redux';
import moment from 'moment';

const NotificationsDetails = () => {
  const data = useSelector(state => state.qoeReducer);
  function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box p={3} style={{ width: '70px' }}>
            <Typography component="div" >{children}</Typography>
          </Box>
        )}
      </div>
    );
  }
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  const stylee = {
    display: 'inline-block',
    width: '100%',
    boxShadow: '0 3px 2px 0 rgb(0 0 0 / 2%)',
    backgroundColor: '#fff',
    padding: '5px 5px 5px 5px',
    borderRadius: '6px',
  }
  const style2 = {
    background: '#f6f6f6',
    padding: '6px',
    margin: '3px 5px 9px 0',
    borderRadius: '3px',
    fontSize: '13px',
    fontWeight: '300'
  }
  return (
    <div className="ecom-dashboard-wrapper 44">
      <Box
        className="insightTabs"
        style={{ marginBottom: "0px", background: "transparent" }}
      >
        <div className="issue-wraper" style={{ marginTop: '10px', width: '100%' }}>
          <div className='top-left-nav' style={{ marginTop: '10px', width: '100%' }}>
            <Typography variant="h5" style={{ fontSize: '1.6rem', lineHeight: '1.4', paddingLeft: '13px', marginBottom: '30px' }}> <span style={{ padding: '0px 0px 2px 17px' }}>Notifications</span></Typography>
          </div>
        </div>
        <div>
          <Scrollbars
            className="rct-scroll"
            autoHeight
            autoHide
            autoHeightMin={350}
            autoHeightMax={350}
            style={{ margin: '10px 28px 0 89px', width: '75%' }}
          >
            {
              data?.notifications?.length > 0 && data?.notifications?.map((notification, i) => {
                return (
                  <ul key={i} style={stylee} className="list-unstyled dropdown-list">
                    <li>
                      <div className="media">
                        <div className="media-body pt-5">
                          <div className="d-flex justify-content-between">
                            <h5 className="mb-5" style={{ fontSize: '1.3rem' }}>
                              {notification?.title}
                            </h5>
                            <span className="text-muted fs-12">
                            {
                              moment(notification?.timestamp).format('DD-MM-YYYY') === moment(new Date()).format('DD-MM-YYYY') ?
                                `Today | ${moment(notification?.timestamp).format('hh:mm:ss')}` :
                                `${moment(notification?.timestamp).format('DD-MM-YYYY')} | ${moment(notification?.timestamp).format('hh:mm:ss')}`
                            }
                            </span>
                          </div>
                          <div style={{ padding: '5px 0 5px 0 ' }} className="mb-5 mt-5">
                            <h5 className="asset-detail"> Asset ID <p>{notification?.detail?.sid}</p> <span>{notification?.detail.partner_name}</span> </h5> 
                          </div>
                          <div style={{ padding: '5px 0 5px 0 ' }} className="mb-5 mt-5">
                            <h5 className="asset-detail"> Detail <p>{notification?.detail?.message}</p></h5>
                            
                            
                          </div>
                          {/* <span style={{ fontStyle: 'italic' }} className="text-muted d-block">
                            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy
                          </span> */}
                        </div>
                      </div>
                    </li>
                  </ul>
                )
              })
            }
          </Scrollbars >
        </div >
      </Box >
    </div >
  )

}

export default NotificationsDetails;