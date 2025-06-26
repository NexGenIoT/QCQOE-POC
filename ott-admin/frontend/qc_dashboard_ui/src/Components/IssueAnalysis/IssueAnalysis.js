import BarChart from '../Charts/SimpleBarChart';
import BarChart2 from '../Charts/SimpleBarChartPartner';
import MatButton from "@material-ui/core/Button";
import IssueType from './IssueType';
import IssueFilter from './IssueFilter'
import domtoimage from 'dom-to-image';
import { createFileName } from 'use-react-screenshot';
import moment from 'moment';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Box from "@material-ui/core/Box";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Typography from "@material-ui/core/Typography";
import { getIssueType, getPartner, setIssueType, setPartner } from 'Store/Actions';
import { assetOverviewGraph, issueTypeOverviewGraph, isValidPermission } from 'Constants/constant';
import ClientSlider from 'Components/OverviewPage/Client-Slider';
import ByIssueStackBarGraphChart from './ByIssueStackBarGraphChart';
import ByContentStackBarGraphChart from './ByContentStackBarGraphChart';
import MUIDataTable from 'mui-datatables';
import { Paper } from '@material-ui/core';
import EnhancedTable from './ByContentPartnerTable';
import ClientSliderIssueAnalysis from 'Components/OverviewPage/Client-SliderIsueAnalysis';

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
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  //  setApply(false)
  //  setCheckedContent([])
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



const IssueAnalysis = () => {
  const dispatch = useDispatch();
  const data = useSelector(state => state.overviewReducer);
  const [filter, setFilter] =  useState(localStorage.getItem('btnType') ? localStorage.getItem('btnType') : assetOverviewGraph.DAILY)
  const [issueTypeFilter, setIssueTypeFilter] = useState('')
  const [contentTypeFilter, setContentTypeFilter] = useState(localStorage.getItem('contentBtnType') ? localStorage.getItem('contentBtnType') : assetOverviewGraph.DAILY)
  const [contentPartnerFilter, setContentPartnerFilter] = useState(localStorage.getItem('contentBtnPartner') ? localStorage.getItem('contentBtnPartner') : "ALL")
  const [apply, setApply] = useState(false)
  const [checkedContent, setCheckedContent] = React.useState([]);
  const [checkedContentType, setCheckedContentType] = useState([])
  const [issueTypeChartData, setIssueTypeChartData] = useState(data.issueTypeGraph);
  const [columnsData, setColumnsData] = useState([])
  const [partnerImageInfo, setPartnerImageInfo] = useState(data.partnerInfo)
  const [imageClicked, setImageClicked] = useState("ALL")

  var columns = [
    {
      label: "Date/Time",
      name: "interval",
      options: {
        sort: true
      }
    }
  ];
  const options = {
    count: issueTypeChartData?.data?.length,
    pagination: true,
    selectableRows: false,
    rowsPerPageOptions: [10, 50, 100],
    filter: false,
    search: false
  }
  const clickOnButton = (type) => {
    setFilter(type)
    //setPartnerImageInfo(data.partnerInfo)
    if (localStorage.getItem('btnType') != type) {
      localStorage.setItem('btnType', type)
      if (type == "DAILY" && localStorage.getItem('btnType') == "DAILY") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      } else if (type == "WEEKLY" && localStorage.getItem('btnType') == "WEEKLY") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      } else if (type == "MONTHLY" && localStorage.getItem('btnType') == "MONTHLY") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      } else if (type == "MONTHLY_3" && localStorage.getItem('btnType') == "MONTHLY_3") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      }
    }
    setIssueTypeFilter('')
    if (localStorage.getItem('issueBtnType')) {
      localStorage.setItem('issueBtnType', '')
    }

  }

  const clickOnIssueButton = (type) => {
    setIssueTypeFilter(type)
    setApply(false)
    // setCheckedContent([])
    // setCheckedContentType([])
    if (localStorage.getItem('issueBtnType') != type) {
      localStorage.setItem('issueBtnType', type)
      if (type == "UrlGenerationFailed") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      } else if (type == "Rechability") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      } else if (type == "Playability") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      } else if (type == "Integrity Issue") {
        dispatch(setIssueType([]))
        setIssueTypeChartData()
      }
    }

  }

  const clickOnPartnerFilterButton = (type) => {
    setApply(false)
    // setCheckedContent([])
    // setCheckedContentType([])
     setContentTypeFilter(type)
    // setContentPartnerFilter('ALL')
    if(checkedContent.length>0){
      let imgInfo=[]
     checkedContent.map(element=>{
    let  obj ={
        name:element
      }
      imgInfo.push(obj)
     })
      setPartnerImageInfo(imgInfo)
    }else{
      setPartnerImageInfo([])
      setPartnerImageInfo(data.partnerInfo)
    }
    setImageClicked("ALL")
    if (localStorage.getItem('contentBtnType')) {
      localStorage.setItem('contentBtnType', type)
    }
    dispatch(setPartner([]))
    // if (type == "DAILY" && localStorage.getItem('contentBtnType')=="DAILY") {
    //   dispatch(setPartner([]))
    // } else if (type == "WEEKLY" && localStorage.getItem('contentBtnType')=="WEEKLY") {
    //   dispatch(setPartner([]))
    // } else if (type == "MONTHLY" && localStorage.getItem('contentBtnType')=="MONTHLY") {
    //   dispatch(setPartner([]))
    // } else if (type == "MONTHLY_3" && localStorage.getItem('contentBtnType')=="MONTHLY_3") {
    //   dispatch(setPartner([]))
    // }
  }
  useEffect(() => {
    if (apply) {
      if (value == 0) {

        dispatch(getIssueType(filter, issueTypeFilter, checkedContent, checkedContentType, dispatch))

      } else {
        dispatch(getPartner(contentTypeFilter, contentPartnerFilter, checkedContentType, dispatch))
       

      }
    } else {
      // setPartnerImageInfo(data.partnerInfo)
      dispatch(getIssueType(assetOverviewGraph.DAILY, issueTypeOverviewGraph.PLAYBILITY, checkedContent, checkedContentType, dispatch))

      dispatch(getPartner(contentTypeFilter, contentPartnerFilter, checkedContentType, dispatch))
      

    }

  }, [apply, checkedContent, checkedContentType, dispatch])
  useEffect(() => {
    setColumnsData([])
    // setColumnsData(columns)
    let issueTempArray = []
    if (data.issueTypeGraph?.data) {
      data.issueTypeGraph?.data.map(element => {
        delete (element.integrityCount);

        issueTempArray.push(element)
      })
    }
    setIssueTypeChartData(data.issueTypeGraph)
    if (issueTypeFilter == "UrlGenerationFailed") {
      const obj1 = {
        label: "Url Generation Failed",
        name: "urlGenerationFailedCount",
        options: {
          sort: true
        }
      }
      const newDat = [...columns, obj1];
      setColumnsData(newDat)
    } else if (issueTypeFilter == "Rechability") {
      const obj1 = {
        label: "Reachability Count",
        name: "reachabilityCount",
        options: {
          sort: true
        }
      }
      const newDat = [...columns, obj1];
      setColumnsData(newDat)
    } else if (issueTypeFilter == "Playability") {
      const obj1 = {
        label: "Playability Count",
        name: "playabilityCount",
        options: {
          sort: true
        }
      }
      const newDat = [...columns, obj1];
      setColumnsData(newDat)
    }
    // else if (issueTypeFilter == "Integrity") {
    //   const obj1 ={
    //     label: "Integrity Count",
    //     name: "integrityCount",
    //     options: {
    //       sort: true
    //     }
    //   }
    //   const newDat = [...columns,obj1];
    //   setColumnsData(newDat)
    // }
    else {
      const tempArr = [
        {
          label: "Date/Time",
          name: "interval",
          options: {
            sort: true
          }
        },
        // {
        //   label: "Integrity Count",
        //   name: "integrityCount",
        //   options: {
        //     sort: true
        //   }
        // },
        {
          label: "Playability Fail",
          name: "playabilityCount",
          options: {
            sort: true
          }
        },
        {
          label: "Reachability Fail",
          name: "reachabilityCount",
          options: {
            sort: true
          }
        },
        {
          label: "Url Generation Fail",
          name: "urlGenerationFailedCount",
          options: {
            sort: true
          }
        }
      ]
      setColumnsData(tempArr)

    }

    // console.log("abcd--22==",columnsData);


  }, [data.issueTypeGraph])


  useEffect(() => {
    if (value == 0) {
      dispatch(getIssueType(filter, issueTypeFilter, checkedContent, checkedContentType, dispatch))
    }
  }, [filter, issueTypeFilter])
  useEffect(() => {
    if (value > 0) {
      dispatch(getPartner(contentTypeFilter, contentPartnerFilter, checkedContentType, dispatch))
    }
  }, [contentTypeFilter, contentPartnerFilter])



  const getImage = (type) => {
    console.log("abcd--",type);
    dispatch(setPartner([]))
    setContentPartnerFilter(type)
    setImageClicked(type)
    setCheckedContent([type])
    if (localStorage.getItem('contentBtnPartner')) {
      localStorage.setItem('contentBtnPartner', type)
    }
  }

  const applyFilter = (checkedContent, contentType) => {
    console.log("eee", checkedContent, contentType);
    setApply(false)
    if (value == 0) {
      dispatch(setIssueType([]))
      setIssueTypeChartData()
    } else {
      dispatch(setPartner([]))
    }
    setCheckedContent(checkedContent)
    setCheckedContentType(contentType)
    setContentPartnerFilter(checkedContent)
    if(checkedContent.length>0){
      let imgInfo=[]
     checkedContent.map(element=>{
    let  obj ={
        name:element
      }
      imgInfo.push(obj)
     })
      setPartnerImageInfo(imgInfo)
    }else{
      setPartnerImageInfo(data.partnerInfo)
      setContentPartnerFilter('ALL')
    }
    setApply(true)

  }


  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
    if (value > 0) {
      dispatch(getIssueType(assetOverviewGraph.DAILY, "", "", "", dispatch))
      dispatch(setIssueType([]))
      setIssueTypeChartData()
      setFilter(assetOverviewGraph.DAILY)
    }else{
       setCheckedContent([])
       setCheckedContentType([])
      setContentPartnerFilter('ALL')
      setPartnerImageInfo(data.partnerInfo)
      dispatch(setPartner([]))
      dispatch(getPartner(assetOverviewGraph.DAILY, "ALL", "", dispatch))
      setContentTypeFilter(assetOverviewGraph.DAILY)
    }

  };



  return <>
    <div className="issue-wraper">
      <Tabs value={value} onChange={handleChange} aria-label="basic tabs example"        >
       <Tab label="BY ISSUE" {...a11yProps(0)} />
        <Tab label="BY CONTENT PARTNER" {...a11yProps(1)} />

      </Tabs>
      <TabPanel value={value} index={0}>
        <div className='status-report'>
          <MatButton onClick={() => clickOnButton(assetOverviewGraph.DAILY)} className={`Status-btn ${filter === assetOverviewGraph.DAILY ? 'Status-btn-active' : ''}`}>24 Hr</MatButton>
          <MatButton onClick={() => clickOnButton(assetOverviewGraph.WEEKLY)} className={`Status-btn ${filter === assetOverviewGraph.WEEKLY ? 'Status-btn-active' : ''}`}>Weekly</MatButton>
          <MatButton onClick={() => clickOnButton(assetOverviewGraph.MONTHLY)} className={`Status-btn ${filter === assetOverviewGraph.MONTHLY ? 'Status-btn-active' : ''}`}>Monthly</MatButton>
          <MatButton onClick={() => clickOnButton(assetOverviewGraph.MONTHLY_3)} className={`Status-btn ${filter === assetOverviewGraph.MONTHLY_3 ? 'Status-btn-active' : ''}`}>3 Months</MatButton>
          <IssueFilter applyFilter={applyFilter} data={'issue'} />
        </div>
        {/* <BarChart data={data.issueTypeGraph} filterType={issueTypeFilter}/>  */}
        <ByIssueStackBarGraphChart data={issueTypeChartData} frequency={filter} issueTYpe={issueTypeFilter} />


        <div className="graphIsssueType">
          <MatButton onClick={() => clickOnIssueButton(issueTypeOverviewGraph.URL_GENERATION)} className={`Status-btn ${issueTypeFilter === issueTypeOverviewGraph.URL_GENERATION ? 'Status-btn-active' : ''}`}>Url Genration</MatButton>
          <MatButton onClick={() => clickOnIssueButton(issueTypeOverviewGraph.RECHABILITY)} className={`Status-btn ${issueTypeFilter === issueTypeOverviewGraph.RECHABILITY ? 'Status-btn-active' : ''}`}>Rechability</MatButton>
          <MatButton onClick={() => clickOnIssueButton(issueTypeOverviewGraph.PLAYBILITY)} className={`Status-btn ${issueTypeFilter === issueTypeOverviewGraph.PLAYBILITY ? 'Status-btn-active' : ''}`}>Playability</MatButton>
          {/* <MatButton onClick={() => clickOnIssueButton(issueTypeOverviewGraph.INTEGRITY_ISSUE)} className={`Status-btn ${issueTypeFilter === issueTypeOverviewGraph.INTEGRITY_ISSUE ? 'Status-btn-active' : ''}`}>Integrity Issue</MatButton> */}
        </div>
        <Paper>
          <MUIDataTable
            title={`Total Records ${issueTypeChartData?.data?.length ?? 0}`}
            columns={columnsData}
            data={issueTypeChartData?.data}
            options={options}
          />
        </Paper>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div className='status-report'>

          <MatButton onClick={() => clickOnPartnerFilterButton(assetOverviewGraph.DAILY)} className={`Status-btn ${contentTypeFilter === assetOverviewGraph.DAILY ? 'Status-btn-active' : ''}`}>24 Hr</MatButton>
          <MatButton onClick={() => clickOnPartnerFilterButton(assetOverviewGraph.WEEKLY)} className={`Status-btn ${contentTypeFilter === assetOverviewGraph.WEEKLY ? 'Status-btn-active' : ''}`}>Weekly</MatButton>
          <MatButton onClick={() => clickOnPartnerFilterButton(assetOverviewGraph.MONTHLY)} className={`Status-btn ${contentTypeFilter === assetOverviewGraph.MONTHLY ? 'Status-btn-active' : ''}`}>Monthly</MatButton>
          <MatButton onClick={() => clickOnPartnerFilterButton(assetOverviewGraph.MONTHLY_3)} className={`Status-btn ${contentTypeFilter === assetOverviewGraph.MONTHLY_3 ? 'Status-btn-active' : ''}`}>3 Months</MatButton>
          <IssueFilter applyFilter={applyFilter} data={'contentpartner'} />
        </div>
        {/* \ <BarChart2 data={data.partnerGraph} filterType={contentPartnerFilter}/>  */}
        <div>
          <ByContentStackBarGraphChart data={data.partnerGraph} frequency={contentTypeFilter} />
        </div>
        <div className="row">
          <div className="col-md-12">
            <div className="ott-carousel">
              <ClientSliderIssueAnalysis getImage={getImage} data={partnerImageInfo} title={imageClicked} />
            </div>
          </div>
        </div>
        <EnhancedTable data={data.partnerGraph} selected={data?.partnerGraph?.data} />

      </TabPanel>

    </div>


  </>
}

export default IssueAnalysis;