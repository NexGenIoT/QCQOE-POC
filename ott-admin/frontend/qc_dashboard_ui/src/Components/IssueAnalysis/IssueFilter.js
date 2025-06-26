import React, { useState } from 'react';
import MatButton from "@material-ui/core/Button";
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';

import { useDispatch, useSelector } from 'react-redux';
import { Button, Checkbox, IconButton, ListItem, ListItemIcon, ListItemText, MenuItem, MenuList, Paper } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { ListItemButton } from '@mui/material';

import Divider from '@material-ui/core/Divider';
import { contentPartnerList, contentPartnerType } from './tileData';
import { clearAssetInfoData, clearConnectedData } from 'Store/Actions';

const IssueFilter = (props) => {
    console.log("props",props);
   const dispatch = useDispatch()
   const [rights, setRights] = useState(false);
   const dataOverview = useSelector(state => state.overviewReducer);
   const [contentPartner, setContentPartner] = useState(dataOverview?.partnerInfo)
   const [checkedContentType, setCheckedContentType] = useState([])
   const [checkedContent, setCheckedContent] = React.useState([]);
   const [contentType, setContentType] = useState(dataOverview?.contentTypes)
   const [open, setOpen] = useState(false);
   const [apply, setApply] = useState(false)



   const toggleDrawer = (side, open) => () => {
      side(open)

   };
   const closeflyout = () => {
      toggleDrawer(setRights, false);
      // document.getElementsByClassName('MuiPopover-root')[0].style.display = 'none';
   }
   const contentPartnerChange = (e) => {
      if (e.target.value !== "") {
         const data = dataOverview?.partnerInfo.filter(a => a.name.toLowerCase().includes(e.target.value.toLowerCase()))
         setContentPartner(data)
      } else {
         setContentPartner(dataOverview?.partnerInfo)
      }
   }

   const handleToggleContentPartner = (value) => {
      const currentIndex = checkedContent.indexOf(value);
      const newChecked = [...checkedContent];
      if (currentIndex === -1) {
         newChecked.push(value);
      } else {
         if (value === dataOverview?.imageInfo) {
            // dispatch(clearAssetInfoData())
         }
         newChecked.splice(currentIndex, 1);
      }
      setCheckedContent(newChecked);
   };
   const handleToggleContentType = (value) => {
      const currentIndex = checkedContentType.indexOf(value);
      const newChecked = [...checkedContentType];
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
      setCheckedContentType(newChecked);
    }

    const contentTypeChange = (e) => {
      if (e.target.value !== "") {
        const data = dataOverview?.contentTypes.filter(a => a.name.toLowerCase().includes(e.target.value.toLowerCase()))
        setContentType(data)
      } else {
        setContentType(dataOverview?.contentTypes)
      }
    }
   const applyFilters = () => {
      closeflyout();
      dispatch(clearConnectedData());
      setApply(true);
      setRights(false)

      if (!checkedContent.find(f => f === dataOverview?.imageInfo)) {
         dispatch(clearAssetInfoData());
      }
      props.applyFilter(checkedContent,checkedContentType)
   }
   return <>
      <MatButton className="Status-btn" onClick={toggleDrawer(setRights, true)}>Filter</MatButton>

      <div className="FilterContainer">
         <Drawer anchor="right" open={rights}>
            <div style={{ height: '90%', overflowY: 'scroll' }} className="rightSidebar">
               <div className='SideBarHeader' style={{ marginBottom: "-30px" }}>
                  <h3>Filter</h3>
                  <IconButton onClick={toggleDrawer(setRights, false)}> <Close /></IconButton>
               </div>
               <List dense className='filtersCont'>
               {/* {props.data=='issue' ?  */}
               <ListItem>
                     <h3>Content Partner</h3>
                     <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                        <input onChange={contentPartnerChange} type='text' name='filterSearch' className="filterSearch" placeholder='Search' />
                     </Paper>
                     <MenuList dense className="filterList">
                        {contentPartner.map((value, index) => {
                           const labelId = value?.name;
                           return (
                              <MenuItem key={index}>
                                 <ListItemButton onClick={() => handleToggleContentPartner(labelId)} role={undefined} dense>
                                    <ListItemIcon>
                                       <Checkbox
                                          edge="start"
                                          checked={checkedContent.indexOf(value?.name) !== -1}
                                          tabIndex={-1}
                                          disableRipple
                                          inputProps={{ 'aria-labelledby': labelId }}
                                          size="small"
                                          sx={{ minWidth: "18px" }}
                                       />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={labelId} />
                                 </ListItemButton>
                              </MenuItem>
                           );
                        })}
                     </MenuList>
                  </ListItem>
                   {/* : null} */}
                  <ListItem>
                <h3>Content Type</h3>
                <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                  <input onChange={contentTypeChange} type='text' name='filterSearch' className="filterSearch" placeholder='Search' />
                </Paper>
                <MenuList dense className="filterList">
                  {contentType.map((value, index) => {
                    const labelId = value?.name;
                    return (
                      <MenuItem key={index}>
                        <ListItemButton onClick={() => handleToggleContentType(labelId)} role={undefined} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checkedContentType.indexOf(value?.name) !== -1}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ 'aria-labelledby': labelId }}
                              size="small"
                              sx={{ minWidth: "18px" }}
                            />
                          </ListItemIcon>
                          <ListItemText id={labelId} primary={labelId} />
                        </ListItemButton>
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ListItem>
               </List>
            </div>
            <div className="rightSidebar" style={{ height: '10%' }}>
               <Button variant="contained" size="small" className='btnApply' onClick={applyFilters}>
                  Apply
               </Button>
            </div>
         </Drawer>
      </div>
   </>
}

export default IssueFilter;