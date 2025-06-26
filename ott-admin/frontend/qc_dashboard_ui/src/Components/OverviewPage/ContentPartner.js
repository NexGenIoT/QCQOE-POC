import React, { useEffect, useState } from "react";
import DoughnutChart from "Components/Charts/DoughnutChart";
import MatButton from "@material-ui/core/Button";
import TotalAssets from "./TotalAssets";
import ClientSlider from "./Client-Slider";
import { useDispatch, useSelector } from "react-redux";
import { CircularProgress } from "@material-ui/core";
import { getPartnerDetails, getImageAssetInfo, setTabValue, getIssueTypesDetails, getStatusTypesDetails, getContentTypes } from "Store/Actions";
import {assetOverviewGraph, fixedSelectedContent} from 'Constants/constant'

const ContentPartner = (props) => {
  const [time, setTime] = useState(assetOverviewGraph.DAILY)
  const [title, setTitle] = useState(fixedSelectedContent.epicOn)
  const [textInput, setTextInput] = useState('')
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(getContentTypes(dispatch))
    dispatch(getPartnerDetails(dispatch))
    dispatch(getIssueTypesDetails(dispatch))
    dispatch(getStatusTypesDetails(dispatch))
  }, [dispatch])
  useEffect(() => {
    dispatch(getImageAssetInfo(textInput ? textInput : title, time, dispatch));
    //dispatch(getAnalysisCounts(dispatch))

  }, [time, title, textInput, dispatch])

  useEffect(() => {
   // dispatch(getAnalysisCounts(dispatch))
  }, [])
  const getImage = (name) => {
    setTitle(name)
    setTextInput('')
  }
  const setText = (text) => {
    setTextInput(text)
  }
  const data = useSelector(state => state.overviewReducer);
  const clickonViewDetails = () => {
    localStorage.setItem("overview", 1)
    localStorage.setItem('btnType', time)
    dispatch(setTabValue(1))
  }
  return (
    <div style={{position: 'relative'}}>
      {
        data?.isLoadingCrm && (
          <div style={{ position: 'absolute', top: '10%', left: '45%' }}>
            <CircularProgress />
          </div>
        )
      }
      <div className="row">
        <div className="col-md-6">
          <div className="rct-block-title view-partner">
            <h4>Content Partner Overview </h4>
          </div>
          <div className="relative-background">
            <div className="partner-logo"> <img onClick={clickonViewDetails} alt=""
              src={`${process.env.PUBLIC_URL}/assets/images/img/QC/${data.imageInfo}.png`}
            /> </div>
            <div className="circle-chart">
              {" "}
              <DoughnutChart data={data.imageAssetInfo} />{" "}
            </div>
          </div>
          <div className="monthely-status">
            <MatButton onClick={()=>setTime(assetOverviewGraph.DAILY)} className={`Status-btn ${time === assetOverviewGraph.DAILY ? 'Status-btn-active' : ''}`}>24 Hr</MatButton>
            <MatButton onClick={()=>setTime(assetOverviewGraph.WEEKLY)} className={`Status-btn ${time === assetOverviewGraph.WEEKLY ? 'Status-btn-active' : ''}`}>Weekly</MatButton>
            <MatButton onClick={()=>setTime(assetOverviewGraph.MONTHLY)} className={`Status-btn ${time === assetOverviewGraph.MONTHLY ? 'Status-btn-active' : ''}`}>Monthly</MatButton>
            <MatButton onClick={()=>setTime(assetOverviewGraph.MONTHLY_3)} className={`Status-btn ${time === assetOverviewGraph.MONTHLY_3 ? 'Status-btn-active' : ''}`}>3 Months</MatButton>
          </div>
        </div>
        <div className="col-md-6">
          <TotalAssets extra={true} filter={true} textInput={textInput} setText={setText} data={data.imageAssetInfo} time={time}/>
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="ott-carousel">
            <ClientSlider getImage={getImage} data={data.partnerInfo} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContentPartner;
