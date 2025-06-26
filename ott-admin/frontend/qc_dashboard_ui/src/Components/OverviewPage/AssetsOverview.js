import React, { useEffect, useState } from "react";
import LineChartComponent from "./line-chart";
import StackedBarChartComponent from "./stacked-bar-chart";
import MatButton from "@material-ui/core/Button";
import { useDispatch, useSelector } from "react-redux";
import {
  getAssetOverview,
  getRPIOverview
} from 'Store/Actions';
import { assetOverviewGraph } from "Constants/constant";

const AssetsOverview = () => {
  const [filter, setFilter] = useState(assetOverviewGraph.DAILY)
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getAssetOverview(filter, dispatch))
    dispatch(getRPIOverview(filter, dispatch))
  }, [dispatch, filter])
  const data = useSelector(state => state.overviewReducer);
  return (
    <>
      <div className="row block-title">
        <div className="col-md-6">
          <div className="rct-block-title"style={{paddingBottom: 0}} >
            <h4>Asset Overview </h4>
          </div>
          <LineChartComponent data={data?.assetOverviewGraph}/>
        </div>
        <div className="col-md-6">
          <div className="rct-block-title ">
            <h4 style={{marginBottom: 21}}>Average RPI QC Time</h4>        
            <StackedBarChartComponent data={data?.rpiOverviewGraph} />    
          </div>
           
        </div>
      </div>
      <div className="row">
        <div className="col-md-12">
          <div className="monthely-status">
            <MatButton onClick={()=>setFilter(assetOverviewGraph.DAILY)} className={`Status-btn ${filter === assetOverviewGraph.DAILY ? 'Status-btn-active' : ''}`}>24 Hr</MatButton>
            <MatButton onClick={()=>setFilter(assetOverviewGraph.WEEKLY)} className={`Status-btn ${filter === assetOverviewGraph.WEEKLY ? 'Status-btn-active' : ''}`}>Weekly</MatButton>
            <MatButton onClick={()=>setFilter(assetOverviewGraph.MONTHLY)} className={`Status-btn ${filter === assetOverviewGraph.MONTHLY ? 'Status-btn-active' : ''}`}>Monthly</MatButton>
            <MatButton onClick={()=>setFilter(assetOverviewGraph.MONTHLY_3)} className={`Status-btn ${filter === assetOverviewGraph.MONTHLY_3 ? 'Status-btn-active' : ''}`}>3 Months</MatButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default AssetsOverview;
