import React, { useState, useEffect } from "react";
import { Scrollbars } from "react-custom-scrollbars";
import { UncontrolledDropdown, DropdownToggle, DropdownMenu } from "reactstrap";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import { Badge } from 'reactstrap';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getNotification, getNotifications } from 'Store/Actions/QOEActions'
import moment from "moment";

function Notifications() {
  const data = useSelector(state => state.qoeReducer);
  const dispatch = useDispatch()
  const [notifications, setNotifications] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(null);
  const [open, setOpen] = useState(false)
  useEffect(() => {
    dispatch(getNotifications(dispatch))
  }, [dispatch]);
  useEffect(() => {
    setNotifications(data?.notifications)
    setNotificationsCount(data?.notifications?.length)
  }, [data?.notifications]);
  return (
    <UncontrolledDropdown
      isOpen={open}
      nav
      className="list-inline-item notification-dropdown"
    >
      <DropdownToggle nav className="p-0">
        <Tooltip title="Notifications" placement="bottom">
          <IconButton onClick={() => setOpen(true)} className="custom-notification" aria-label="bell">
            <i className="zmdi zmdi-notifications-active"></i>
            {/* <Badge color="danger" className="badge-xs badge-top-right rct-notify">{notificationsCount}</Badge>  */}
          </IconButton>
        </Tooltip>
      </DropdownToggle>
      <DropdownMenu right>
        <div className="dropdown-content notification-content">
          <div className="dropdown-top d-flex justify-content-between rounded-top ">
            <span>
              <i className="zmdi zmdi-notifications-active"></i> Notifications
              {`(${notifications?.length})`}
            </span>
            <i style={{ cursor: 'pointer' }} onClick={() => setOpen(false)} className="zmdi zmdi-close"></i>
          </div>
          <Scrollbars
            className="rct-scroll"
            autoHeight
            autoHeightMin={100}
            autoHeightMax={280}
          >
            <ul className="list-unstyled dropdown-list">
              {notifications &&
                notifications.map((notification, key) => (
                  <li key={key}>
                    <div className="media">
                      <div className="media-body pt-5">
                        <div className="d-flex justify-content-between">
                          <h5 className="mb-5">
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
                        <span className="text-muted d-block">
                          <Button className="btn-xs partner">
                            {notification?.detail?.partner_name}
                          </Button>
                          <h5 className="mb-5">
                            Asset ID
                          </h5>
                          <p>{notification?.detail?.sid}</p>
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
            </ul>
          </Scrollbars>
          <div className="dropdown-foot p-2 bg-white rounded-bottom">
            <Button
              variant="contained"
              color="primary"
              className="mr-10 btn-xs bg-primary"
              component={Link} to="notifications"
              onClick={() => setOpen(false)}
            >
              View All <i className="zmdi zmdi-chevron-right"></i>
            </Button>
          </div>
        </div>
      </DropdownMenu>
    </UncontrolledDropdown>
  );
}
export default Notifications;
