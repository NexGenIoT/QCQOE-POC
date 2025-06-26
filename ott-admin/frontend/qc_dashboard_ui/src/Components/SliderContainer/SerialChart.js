
import React, { useEffect, useState, useRef } from "react";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

// const CHART_ID = 'population_chart';

const data = [{
  country: "USA",
  value: 100
}, {
  country: "China",
  value: 90
}, {
  country: "Japan",
  value: 80
}, {
  country: "Germany",
  value: 85
}, {
  country: "UK",
  value: 10
}, {
  country: "France",
  value: 55
}];

function SerialChart() {
  const chartRef = useRef(null);
  
  useEffect(() => {
    if (!chartRef.current) {
      chartRef.current = am4core.create("population_chart", am4charts.XYChart);
      
      chartRef.current.data = data;

      // Add X Axis
      let xAxis = chartRef.current.xAxes.push(new am4charts.CategoryAxis());
      xAxis.dataFields.category = "country";
      xAxis.renderer.cellStartLocation = 0.1;
      xAxis.renderer.cellEndLocation = 0.9;
      xAxis.renderer.grid.template.strokeOpacity = 0;
      xAxis.renderer.labels.template.fill = am4core.color('#ced1e0');
      xAxis.renderer.labels.template.fontSize = 0;

      // Add Y Axis
      let yAxis = chartRef.current.yAxes.push(new am4charts.ValueAxis());
      yAxis.renderer.grid.template.stroke = am4core.color('#f0f2fa');
      yAxis.renderer.grid.template.strokeOpacity = 0;
      yAxis.renderer.labels.template.fill = am4core.color('#ced1e0');
      yAxis.renderer.labels.template.fontSize = 0;
      
      // Create series
      let series = chartRef.current.series.push(new am4charts.ColumnSeries());
      series.dataFields.valueY = "value";
      series.dataFields.categoryX = "country";
      series.name = "Population";
      series.fillOpacity = 1;
      series.fill = am4core.color('#e5408f');
      series.strokeWidth = 0;
      series.columns.template.column.cornerRadiusTopLeft = 5;
      series.columns.template.column.cornerRadiusTopRight = 5;
      
      // Add cursor
      chartRef.current.cursor = new am4charts.XYCursor();

      // Disable axis lines
      chartRef.current.cursor.lineX.disabled = true;
      chartRef.current.cursor.lineY.disabled = true;

      // Disable axis tooltips
      xAxis.cursorTooltipEnabled = false;
      yAxis.cursorTooltipEnabled = false;

      // Disable zoom
      chartRef.current.cursor.behavior = 'none';
    }
    
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);
  
  // Load data into chart
  useEffect(() => {
    if (chartRef.current) {
      chartRef.current.data = data;
    }
  }, [data]);
  
  // Handle component unmounting, dispose chart
  useEffect(() => {
    return () => {
      chartRef.current && chartRef.current.dispose();
    };
  }, []);
  
  return <div id="population_chart" style={{width: '100%', height: '100px',}}  />
}


export default SerialChart