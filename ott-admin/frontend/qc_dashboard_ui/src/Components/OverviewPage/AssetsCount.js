import React from "react";
import { Tooltip } from "@material-ui/core";

class AssetsCount extends React.Component {
  state = {
    data: [],
  };


  render() {
    const columnStyle={
      flex: '0 0 16.66667%',
      maxWidth: '12.13333%'
    }
    const { info } = this.props
    function round(num, digits) {
      const lookup = [
        { value: 1, symbol: "" },
        { value: 1e3, symbol: "k" },
        { value: 1e6, symbol: "M" },
        { value: 1e9, symbol: "G" },
        { value: 1e12, symbol: "T" },
        { value: 1e15, symbol: "P" },
        { value: 1e18, symbol: "E" }
      ];
      const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
      var item = lookup.slice().reverse().find(function(item) {
        return num >= item.value;
      });
      return item ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol : "0";
    }

    return (
      <div className="row total-no">
        <div style={columnStyle}>
        <Tooltip title={info?.total ? info?.total : 0} arrow>
          <b>{info?.total ? round(info?.total,1) : 0}</b>
          </Tooltip>
          <p>Total Assets</p>
        </div>
        <div  style={columnStyle}>
        <Tooltip title={info?.statusvsCount?.Pass ? info?.statusvsCount?.Pass : 0} arrow>
          <b>{info?.statusvsCount?.Pass ? round(info?.statusvsCount?.Pass,1) : 0}</b>
          </Tooltip>
          <p>Pass</p>
        </div>
        <div  style={columnStyle}>
        <Tooltip title={info?.statusvsCount?.Verify? info?.statusvsCount?.Verify : 0} arrow>
          <b>{info?.statusvsCount?.Verify ? round(info?.statusvsCount?.Verify,1) : 0}</b>
          </Tooltip>
          <p>Fail</p>
          {/* Verify */}
        </div>
        <div  style={columnStyle}>
        <Tooltip title={info?.statusvsCount?.Fail? info?.statusvsCount?.Fail : 0} arrow>
          <b>{info?.statusvsCount?.Fail ? round(info?.statusvsCount?.Fail,1) : 0}</b>
          </Tooltip>
          <p>Un-Published</p>
          {/* Fail */}
        </div>
        <div  style={columnStyle}>
          <b>{info?.statusvsCount?.['In-Progress'] ? info?.statusvsCount?.['In-Progress'] : 0}</b>
          <p>In-Progress</p>
        </div>
        <div  style={columnStyle}>
        <Tooltip title={info?.statusvsCount?.Pending? info?.statusvsCount?.Pending : 0} arrow>
          <b>{info?.statusvsCount?.Pending ? round(info?.statusvsCount?.Pending,1) : 0}</b>
          </Tooltip>
          <p>Archived</p>
        </div>
  
        <div  style={columnStyle}>
          <b>{info?.avg_rpi_sec ? info?.avg_rpi_sec?.toFixed(1) + 's' : 0}</b>
          <p>Avg RPI Time</p>
        </div>
        <div  style={columnStyle}>
        <Tooltip title={info?.pendingInQueue? info?.pendingInQueue : 0} arrow>
          <b>{info?.pendingInQueue? round(info?.pendingInQueue,1) : 0}</b>
          </Tooltip>
          <p>Pending-In-Queue</p>
        </div>
      </div>
    );
  }
}

export default AssetsCount;
