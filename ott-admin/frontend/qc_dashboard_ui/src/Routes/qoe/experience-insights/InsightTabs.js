import React from 'react'  
import PropTypes from 'prop-types';
import {Tabs, Tab, Box ,Tooltip } from "@material-ui/core";
import { useHistory } from 'react-router-dom';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
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
         <>
         {children}
         </>
       )}
     </div>
   );
 }
 
 TabPanel.propTypes = {
   children: PropTypes.node,
   index: PropTypes.number.isRequired,
   value: PropTypes.number.isRequired,
 };
 
 function a11yProps(index) {
   return {
     id: `simple-tab-${index}`,
     'aria-controls': `simple-tabpanel-${index}`,
   };
 }

export default function InsightTabs(props){
  const history = useHistory();
   const [value, setValue] = React.useState(0);
   const handleTabChange = (event, newValue) => {
     setValue(newValue);
     props.selectedTabs(newValue)
   };
   const tabsData = props.tabsData;
   const onClickPartner = (type) => {
     let cType = ''
     if(type === 'Disney+ Hotstar'){
      cType = 'HotStar'
     }
     else if(type === 'amzn_prm_logo'){
      cType = 'AmazonPrime'
     }
     else if(type === 'DocuBay'){
      cType = 'Docubay'
     }
     else{
      cType = type
     }
     localStorage.setItem('contentPartner', cType)
     history.push('PartnerDetail')
   }
   return (      
          <Box className='insightTabs'>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={value} onChange={handleTabChange}  className='tabs'>
                <Tab label="Content Partner" {...a11yProps(0)} />
                <Tab label="By Device" {...a11yProps(1)} />
            </Tabs>
            </Box>
            <TabPanel value={value} index={0} className="tabContent">
                <ul className='partner'>
                  {tabsData.length > 0 && tabsData.map((item, index)=>
                 
                  <li key={index}> 
                      <Tooltip title={item.content_partner} arrow>
                    <img alt='path_issue' onClick={()=>onClickPartner(item.content_partner)} src={item.content_partner_logo}/>
                    </Tooltip>
                    </li>
                  
                  )}
                </ul>
            </TabPanel>
            <TabPanel value={value} index={1} className="tabContent">
                <ul className='partner'>
                  {tabsData.length > 0 && tabsData.map((item, index) =>
                    <li key={index}>
                      <img alt='path_issue' src={`${process.env.PUBLIC_URL}/assets/images/img/${item.device_platform}.png`} />
                    </li>
                  )}
                </ul>
            </TabPanel>
          </Box>
   )
}
