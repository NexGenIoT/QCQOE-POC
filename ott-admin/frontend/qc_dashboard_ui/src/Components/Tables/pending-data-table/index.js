/*eslint react-hooks/exhaustive-deps: "off"*/
import React, { useEffect } from "react";
import MUIDataTable from "mui-datatables";
//import MaterialTable from "material-table";

import MatButton from "@material-ui/core/Button";
import List from "@mui/material/List";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Drawer,
  FormControl,
  IconButton,
  InputLabel,
  ListItem,
  ListItemIcon,
  MenuList,
  Paper,
  Select,
  Snackbar,
  TextField,
} from "@material-ui/core";
import PendingInQueueModeltab from "Components/PendingDataPage/PendingInQueueModeltab";
import { useDispatch, useSelector } from "react-redux";
import {
  getPendingInQueueTableData,
  getAssetDetailsOfPendingInQueuePage,
  getPartnerDetails,
  getIssueTypesDetails,
  getStatusTypesDetails,
  clearAssetInfoData,
  getAssetQCDetails,
  getPendingInQueueGraphData,
  clearPendingInQueueData,
  getContentTypes,
  getPendingInQueueTableDownloadedData,
} from "Store/Actions";
import { assetOverviewGraph } from "Constants/constant";
import CircularProgress from "@material-ui/core/CircularProgress";
// import TotalAssets from "Components/OverviewPage/TotalAssets";
// import SpacePieChart from "Components/Charts/SpacePieChart";
import { Close } from "@material-ui/icons";
import { InputBase, ListItemButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SpacePieChartContentPartner from "Components/Charts/SpacePieChartContentPartner";
import SpacePieChartStatusTypes from "Components/Charts/SpacePieChartStatusType";
import SpacePieChartContentType from "Components/Charts/SpacePieChartContentType";
import SpacePieChartIssue from "Components/Charts/SpacePieChartIssueType";
import MyDialog from "./edit_dialoge";
import CreateIcon from "@mui/icons-material/Create";
import { getUpdateTask } from "Store/Actions";
import LogDetailVideoPlayer from "Components/PendingDataPage/LogDetailVideoPlayer";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { NotificationManager } from "react-notifications";

function PendingDataTable(props) {
  const dispatch = useDispatch();
  const dataOverview = useSelector((state) => state.overviewReducer);
  const dataTable = useSelector((state) => state.pendingInQueueReducer);
  const [rights, setRights] = useState(false);
  const [apply, setApply] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [server, setServer] = useState(true);
  const [search, setSearch] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterList, setFilterList] = useState([]);
  const [filter, setFilter] = useState(
    localStorage.getItem("btnType")
      ? localStorage.getItem("btnType")
      : assetOverviewGraph.DAILY
  );
  const [contentPartner, setContentPartner] = useState(
    dataOverview?.partnerInfo
  );
  const [checkedContent, setCheckedContent] = React.useState([]);
  const [graphContent, setgraphContent] = React.useState();
  const [issueType, setIssueType] = useState(dataOverview?.issueType);
  const [checkedIssue, setCheckedIssue] = useState([]);
  const [contentType, setContentType] = useState(dataOverview?.contentTypes);
  const [checkedContentType, setCheckedContentType] = useState([]);
  const [status, setStatus] = useState(dataOverview?.status);
  const [checkedStatus, setCheckedStatus] = useState([]);
  const [colOrder, setColOrder] = useState([0, 1, 2, 3, 4, 5, 6, 7]);
  const [tableData, setTableData] = useState([]);
  const [response, setResponse] = useState({});
  const [open, setOpen] = useState(false);
  const [statusDd, setStatusDd] = React.useState("");
  const [showCB, setShowCB] = useState(false);
  const [selectedTableData, setSelectedTableData] = useState([]);
  const [updatedStatus, setUpdatedStatus] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [taskStatus, setTaskStatus] = React.useState("");
  const [isStatusUpdated, setIsStatusUpdated] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState("");
  const [responseForFirstPie, setResponseForFirstPie] = useState({});
  const [pertnerVideoUrl, setPertnerVideoUrl] = useState();
  const [videoTitle, setvideoTitle] = useState();
  const [videoOpen, setOpenvideo] = React.useState(false);
  const [tagId, setTagId] = useState();
  const [hoichoiToken, setHoichoiToken] = useState();
  const [openSearch, setOpenSearch] = React.useState(false);
  const [searchAssetId, setSearchAssetId] = useState("");
  const [dialogErrorMessage, setDialogErrorMessage] = useState("");

  const handleOpenVideo = (value, data, url) => {
    // console.log('handleOpenVideo', value, data, url);
    // if (url == null || url == undefined) {
    //   NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //   return
    // }
    // setPertnerVideoUrl(url)
    // setvideoTitle(value)
    // setOpenvideo(true)
  };

  const searchByAssetId = () => {
    if (searchAssetId != "") {
      dispatch(clearAssetInfoData());
      setCheckedContent([]);
      setCheckedIssue([]);
      setCheckedContentType([]);
      setCheckedStatus([]);
      setIsStatusUpdated(true);
    } else {
      NotificationManager.error("Please enter valid asset ID to search");
    }
  };

  const getTagId = () => {
    //zee5
    const headers = {
      authorization: `bearer ${localStorage.getItem("authToken")}`, //'bearer 2ALlKhKRPgPnmPGP1ybW5EC4b4L3SfMk',
      baid: `${localStorage.getItem("baid")}`,
      deviceid: `${localStorage.getItem("deviceid")}`, //' 1655113084229',
      partneruniqueid: `${localStorage.getItem("partneruniqueid")}`, //' 7279043196-1279963085',
      subscriberid: `${localStorage.getItem("subscriberid")}`, //' 1186525315'
    };
    fetch(
      "https://qoe-tsmore-kong.videoready.tv/zee5-playback-api/v2/tag/fetch",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        if (json.message == "Success") {
          setTagId(json.data.tag);
        } else {
          // getTagId();
        }
      });
  };

  const getHoichoiToken = () => {
    setHoichoiToken("");

    const headers = {
      authorization: `bearer ${localStorage.getItem("authToken")}`, //`bearer S48TBplphIX3euvjJl2KnIJ6dvKcvCk6`,
    };
    //  params = {'partner':'hoichoi'}
    fetch(
      "https://tb.tapi.videoready.tv/qoe-service/api/v1/akamai/getToken?hoichoi",
      {
        method: "GET",
        headers: { "Content-Type": "application/json", ...headers },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("hoichoi--", json);
        if (json.data?.status == "SUCCESS") {
          setHoichoiToken(json.data?.token);
        } else {
          // getHoichoiToken();
        }
      });
  };

  const getChaupal = (asset_id) => {
    // const headers = {
    //   'authorization': `bearer ${localStorage.getItem("authToken")}`,//`bearer S48TBplphIX3euvjJl2KnIJ6dvKcvCk6`,
    //   'subscriberId': `${localStorage.getItem("subscriberid")}`,
    //   'contentType': 'application/json'
    // }
    // fetch(`https://tb.tapi.videoready.tv/qoe-mobile-services/api/v1/content/playback/${asset_id}`,
    //   {
    //     method: "POST",
    //     headers: { 'Content-Type': 'application/json', ...headers },
    //   })
    //   .then((res) => res.json())
    //   .then((json) => {
    //     console.log("Chaupal--", json);
    //     if (json?.code == 0) {
    //       if (json.data?.playUrls[1].url == '') {
    //         NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //         return
    //       }
    //       localStorage.setItem("chaupal_Licence_url", json.data?.playUrls[1].licenceUrl)
    //       let myArray1 = json.data?.playUrls[1].url//?.split("?")[0]
    //       return window.open(myArray1, '_blank');
    //     } else {
    //       NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //       return
    //     }
    //   })
  };

  const getAllSDKAUthDetail = (provider) => {
    const headers = {};
    fetch(
      `https://qc7.qoeqoe.com:5000/get_credentials?partner=${provider}`, //SONYLIV
      {
        method: "GET",
        headers: { "Content-Type": "application/json", ...headers },
      }
    )
      .then((res) => res.json())
      .then((json) => {
        console.log("getAllSDKAUthDetail--", json);
        localStorage.setItem("authToken", json.authorization_token);

        localStorage.setItem("baid", json.baid);
        localStorage.setItem("deviceid", json.device_id);
        localStorage.setItem("partneruniqueid", json.partner_unique_id);
        localStorage.setItem("subscriberid", json.subscriber_id);
        getTagId();
        getHoichoiToken();
      });
  };

  const getZee5url = (fullurl) => {
    // if (fullurl == null || fullurl == undefined) {
    //   NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //   return
    // }
    // let myArray = fullurl?.split("?")[0]
    // return window.open(myArray, '_blank');;
  };
  const getHoichoiUrl = (fullurl) => {
    // if (fullurl == null || fullurl == undefined) {
    //   NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //   return
    // }
    // let myArray1 = fullurl?.split("?")[0]
    // let myArray2 = myArray1 + "?" + hoichoiToken
    // return window.open(myArray2, '_blank');;
  };

  const getSonyLiveUrl = (fullurl, assetid) => {
    // if (fullurl == null || fullurl == undefined) {
    //   NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //   return
    // }
    // getAllSDKAUthDetail("SONYLIV")
    // localStorage.setItem("sonyAssetId", "")
    // localStorage.setItem("sonyAssetId", assetid)
    // console.log("assets", assetid);
    // window.open(fullurl, '_blank');
  };

  const getErosLiveUrl = (fullurl, erosassetid) => {
    // if (fullurl == null || fullurl == undefined) {
    //   NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //   return
    // }
    // getAllSDKAUthDetail("SONYLIV")
    // localStorage.setItem("erosAssetId", erosassetid)
    // window.open(fullurl, '_blank');
    //return fullurl;
  };

  const getHungamaUrl = (fullurl) => {
    // if (fullurl == null || fullurl == undefined) {
    //   NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //   return
    // }
    // getAllSDKAUthDetail("SONYLIV")
    // window.open(fullurl, '_blank');
    //return fullurl;
  };

  const openUrl = (fullurl) => {
    // if (fullurl == null || fullurl == undefined) {
    //   NotificationManager.error("Url is not generated ! Please try with pass status or try with other video", '', 1500)
    //   return
    // }
    // window.open(fullurl, '_blank');
  };

  const handleCloseVideo = () => setOpenvideo(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  let assetId = "";

  const dataLog = useSelector((state) => state.pendingInQueueReducer);
  const { totalItems } = dataLog;
  const { logAssetData } = dataLog;
  logAssetData?.data &&
    logAssetData?.data.length > 0 &&
    logAssetData?.data.map((d) => {
      if (d.key === "Asset Id") {
        return (assetId = d.value);
      } else {
        return null;
      }
    });
  const buttonType = localStorage.getItem("btnType");
  useEffect(() => {
    if (buttonType) {
      setCheckedContent([dataOverview?.imageInfo]);
    } else {
      setCheckedContent([]);
      setgraphContent();
    }
  }, []);
  useEffect(() => {
    if (
      issueType.length === 0 &&
      contentPartner.length === 0 &&
      contentType.length === 0
    ) {
      dispatch(getPartnerDetails(dispatch));
      dispatch(getIssueTypesDetails(dispatch));
      dispatch(getStatusTypesDetails(dispatch));
      dispatch(getContentTypes(dispatch));
    }
  }, []);
  useEffect(() => {
    const value = localStorage.getItem("overview");
    // console.log('get grap data ', filter);
    if (value) {
      dispatch(
        getPendingInQueueGraphData(
          dataOverview.imageInfo
            ? [
                ...new Set(checkedContent.concat(dataOverview.imageInfo)),
              ].toString()
            : checkedContent.toString(),
          buttonType,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          dispatch
        )
      );
    } else {
      dispatch(
        getPendingInQueueGraphData(
          checkedContent.toString(),
          filter,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          dispatch
        )
      );
    }
  }, [buttonType, filter]);

  useEffect(() => {
    window.scrollTo(0, 0);
    window.scrollTo({ top: 0, behavior: "smooth" });
    const value = localStorage.getItem("overview");
    if (value) {
      dispatch(
        getPendingInQueueTableData(
          dataOverview.imageInfo
            ? [
                ...new Set(checkedContent.concat(dataOverview.imageInfo)),
              ].toString()
            : checkedContent.toString(),
          buttonType,
          page,
          rowsPerPage,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          searchAssetId,
          dispatch
        )
      );
    } else {
      dispatch(
        getPendingInQueueTableData(
          checkedContent.toString(),
          filter,
          page,
          rowsPerPage,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          searchAssetId,
          dispatch
        )
      );
    }
  }, [filter, page, rowsPerPage, isStatusUpdated]);

  useEffect(() => {
    if (apply) {
      const value = localStorage.getItem("overview");
      if (value) {
        dispatch(
          getPendingInQueueTableData(
            dataOverview.imageInfo
              ? [
                  ...new Set(checkedContent.concat(dataOverview.imageInfo)),
                ].toString()
              : checkedContent.toString(),
            buttonType,
            page,
            rowsPerPage,
            checkedIssue.toString(),
            checkedContentType.toString(),
            checkedStatus.toString(),
            searchAssetId,
            dispatch
          )
        );
        dispatch(
          getPendingInQueueGraphData(
            dataOverview.imageInfo
              ? [
                  ...new Set(checkedContent.concat(dataOverview.imageInfo)),
                ].toString()
              : checkedContent.toString(),
            buttonType,
            checkedIssue.toString(),
            checkedContentType.toString(),
            checkedStatus.toString(),
            dispatch
          )
        );
      } else {
        dispatch(
          getPendingInQueueTableData(
            checkedContent.toString(),
            filter,
            page,
            rowsPerPage,
            checkedIssue.toString(),
            checkedContentType.toString(),
            checkedStatus.toString(),
            searchAssetId,
            dispatch
          )
        );
        dispatch(
          getPendingInQueueGraphData(
            checkedContent.toString(),
            filter,
            checkedIssue.toString(),
            checkedContentType.toString(),
            checkedStatus.toString(),
            dispatch
          )
        );
      }
    }
  }, [apply]);

  useEffect(() => {
    let temparray = [];
    setTableData([]);

    if (dataTable?.logTableData.length > 0) {
      try {
        //  getAllSDKAUthDetail("SONYLIV")
      } catch (error) {}
      dataTable?.logTableData.forEach((element) => {
        let obj = {
          ...element,
          isSelected: false,
          dropdownValue: element.task,
        };
        temparray.push(obj);
      });
      setTableData(temparray);
    }
  }, [dataTable?.logTableData, updatedStatus]);

  useEffect(() => {
    setResponse(dataOverview?.connectedData);
    // setResponseForFirstPie(dataOverview?.connectedData)
    if (Object.keys(dataOverview?.connectedData).length != 0) {
      if (Object.keys(dataOverview?.connectedData?.partners).length != 0) {
        if (Object.keys(responseForFirstPie).length == 0) {
          setResponseForFirstPie(dataOverview?.connectedData);
        }
      }
    } else {
      setResponseForFirstPie(dataOverview?.connectedData);
    }
  }, [dataOverview?.connectedData]);

  const handleClickOpen = (data, row) => {
    dispatch(getAssetDetailsOfPendingInQueuePage(row.rowData[0], dispatch));
    // dispatch(getAssetQCDetails(row.rowData[0], dispatch))
    setOpen(true);
  };
  const toggleDrawer = (side, open) => {
    side(open);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const closeflyout = () => {
    toggleDrawer(setRights, false);
    document.getElementsByClassName("MuiPopover-root")[0].style.display =
      "none";
  };
  const { fullScreen } = props;

  const handleDialogClose = (event) => {
    setIsDialogOpen(false);
  };
  const handleAddNewRow = (event) => {
    let payloads = [];
    payloads = [
      {
        assetsId: selectedTableData[0],
        taskStatus: selectedTableData[6],
        errorMessage: "",
      },
    ];
    dispatch(getUpdateTask(payloads, dispatch));
    setIsDialogOpen(false);
    setIsStatusUpdated(true);
    setSuccessMessage("Status Updated Succesfully");
    //, (val) => {

    // if (!val.error) {
    //   setIsDialogOpen(false);
    //   setIsStatusUpdated(true)
    //   setSuccessMessage("Status Updated Succesfully")
    // }
    // else {
    //   alert(val.error)
    // }
    // })
    // )

    // setData(
    //   // Here you can add the new row to whatever index you want
    //   [{ id: dialogId, word: dialogWord }, ...data]
    // );
  };

  const handleDropDownCahnge = (event) => {
    selectedTableData[6] = event.target.value;
    setTaskStatus(event.target.value);
    setSelectedTableData(selectedTableData);
  };

  const columns = [
    {
      label: "Asset ID",
      name: "id",
      options: {
        display: colOrder.indexOf(0) >= 0 ? true : false,
        sort: true,
      },
    },

    {
      label: "Title",
      name: "title",
      options: {
        display: colOrder.indexOf(1) >= 0 ? true : false,
        sort: true,
        customBodyRender: (value, data, row) => {
          return (
            <>
              {data.rowData[2] === "EPICON" ||
              data.rowData[2] === "CURIOSITYSTREAM" ||
              data.rowData[2] === "SHEMAROOME" ||
              data.rowData[2] === "DOCUBAY" ? (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() => handleOpenVideo(value, data, data.rowData[8])}
                >
                  {value}
                </a>
              ) : data.rowData[2] === "EROSNOW" ? (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() =>
                    getErosLiveUrl(
                      document.location.origin + "/ErosNow/index.html",
                      data.rowData[0].slice(8)
                    )
                  }
                >
                  {value}
                </a>
              ) : data.rowData[2] === "HUNGAMA" ? (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() =>
                    getHungamaUrl(
                      document.location.origin +
                        "/HungamaPlayerSDK/index.html?assetId=" +
                        data.rowData[0].slice(8)
                    )
                  }
                >
                  {value}
                </a>
              ) : data.rowData[2] === "SONYLIV" ? (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() =>
                    getSonyLiveUrl(
                      document.location.origin +
                        "/sonylive/demo.html" +
                        "#enableui=false&useiframe=true&enableads=false&enabletestad=false&createplayer=true&prefetchplayer=true",
                      data.rowData[0].slice(9)
                    )
                  }
                >
                  {value}
                </a>
              ) : data.rowData[2] === "ZEE5" ? (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() => getZee5url(data.rowData[8]) + "?tag=" + tagId}
                  target="_blank"
                >
                  {value}
                </a>
              ) : data.rowData[2] === "HOICHOI" ? (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() => getHoichoiUrl(data.rowData[8])}
                  target="_blank"
                >
                  {value}
                </a>
              ) : data.rowData[2] === "CHAUPAL" ? (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() => getChaupal(data.rowData[0].slice(8))}
                  target="_blank"
                >
                  {value}
                </a>
              ) : (
                <a
                  style={{ color: "#3776ec" }}
                  onClick={() => openUrl(data.rowData[8])}
                >
                  {value}
                </a>
              )}
            </>
          );
        },
      },
    },
    {
      label: "Content Partner",
      name: "contentPartner",
      options: {
        display: colOrder.indexOf(2) >= 0 ? true : false,
        sort: true,
      },
    },
    {
      label: "Content Type",
      name: "contentType",
      options: {
        display: colOrder.indexOf(3) >= 0 ? true : false,
        sort: true,
      },
    },
    // {
    //   label: "Issue Type",
    //   name: "issueType",
    //   options: {

    //     display: colOrder.indexOf(4) >= 0 ? true : false,
    //     sort: true

    //   }

    // },
    {
      label: "Date /Time",
      name: "date",
      options: {
        display: colOrder.indexOf(5) >= 0 ? true : false,
        sort: true,
      },
    },
    // {
    //   label: "Task Status",
    //   name: "task",
    //   options: {
    //     display: colOrder.indexOf(6) >= 0 ? true : false,
    //     sort: false,

    //   }
    // }
    // ,

    // {
    //   label: "",
    //   name: "",
    //   options: {
    //     customBodyRender: (data, row) => {
    //       if (row.rowData[6] == "Verify") {
    //         return <i className="zmdi zmdi-edit icons"
    //           onClick={() => {
    //             setIsDialogOpen(true)
    //             setSelectedTableData("")
    //             setSelectedTableData(row.rowData);
    //             setTaskStatus(row.rowData[6])
    //           }}></i>;
    //       } else {
    //         return null
    //       }

    //     },
    //     display: colOrder.length === 1 ? false : true
    //   }
    // },

    // {
    //   label: "",
    //   name: "url",
    // },
    {
      label: "",
      name: "",
      options: {
        customBodyRender: (data, row) => {
          return (
            <i
              className="icon-arrow-right icons"
              onClick={() => handleClickOpen(data, row)}
            ></i>
          );
        },
        display: colOrder.length === 1 ? false : true,
      },
    },
    {
      label: "",
      name: "dropdownValue",
      options: {
        display: false,
      },
      display: colOrder.length === 1 ? false : true,
    },
    {
      label: "",
      name: "isSelected",
      options: {
        display: false,
      },
      display: colOrder.length === 1 ? false : true,
    },
  ];

  const options = {
    filterType: "checkbox",
    count: totalItems,
    pagination: true,
    serverSide: server,
    rowsPerPage: rowsPerPage,
    rowsPerPageOptions: [10, 50, 100],
    page: page,
    searchOpen: search,
    searchText: searchText,
    filterList: filterList,
    search: false,
    // filterType: "dropdown",
    selectableRows: "none", // "multiple",
    textLabels: {
      body: {
        noMatch: dataTable.isLoading
          ? null
          : "Sorry, there is no matching data to display",
      },
    },
    onTableChange: (action, tableState) => {
      if (action === "onFilterDialogOpen") {
        toggleDrawer(setRights, true);
        setApply(false);
        setContentPartner(dataOverview?.partnerInfo);
        setIssueType(dataOverview?.issueType);
        setContentType(dataOverview?.contentTypes);
        setStatus(dataOverview?.status);
      }
      if (action === "changePage") {
        setServer(true);
        setSearchText(null);
        setSearch(false);
        setPage(tableState.page);
        const arr = new Array(tableState.columns.length).fill([]);
        setFilterList(arr);
      }
      if (action === "filterChange") {
        setServer(false);
        setFilterList(tableState.filterList);
        function checkAge(age) {
          return age.length > 0;
        }
        const final = tableState.filterList.some(checkAge);
        if (page > 0 && final) {
          setPage(0);
        }
      }
      if (action === "propsUpdate") {
        setPage(tableState.page);
      }
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    onDownload: () => {
      // const columnsShow = []
      // colOrder.map(order=>{
      //   return columns[order].name && columnsShow.push(columns[order].name)

      // })
      // const redux = array => array.map(o => columnsShow.reduce((acc, curr) => {
      //   acc[curr] = o[curr];
      //   return acc;
      // }, {}));
      // const data = redux(tableData)
      const value = localStorage.getItem("overview");
      if (value) {
        dispatch(
          getPendingInQueueTableDownloadedData(
            dataOverview.imageInfo
              ? [
                  ...new Set(checkedContent.concat(dataOverview.imageInfo)),
                ].toString()
              : checkedContent.toString(),
            buttonType,
            page,
            rowsPerPage,
            checkedIssue.toString(),
            checkedContentType.toString(),
            checkedStatus.toString(),
            searchAssetId,
            dispatch
          )
        );
      } else {
        dispatch(
          getPendingInQueueTableDownloadedData(
            checkedContent.toString(),
            filter,
            page,
            rowsPerPage,
            checkedIssue.toString(),
            checkedContentType.toString(),
            checkedStatus.toString(),
            searchAssetId,
            dispatch
          )
        );
      }
      return false;
    },
    onColumnSortChange: (changedColumn, direction) => {
      const myData = [...tableData];
      if (direction === "asc") {
        let temparray = [];
        const finalTableSortedData =
          changedColumn === "date"
            ? myData?.sort((a, b) =>
                new Date(a["dateTimeStamp"]) > new Date(b["dateTimeStamp"])
                  ? 1
                  : -1
              )
            : myData?.sort((a, b) =>
                a[changedColumn] > b[changedColumn] ? 1 : -1
              );
        setTableData([]);
        finalTableSortedData.forEach((element) => {
          let obj = {
            ...element,
            isSelected: false,
            dropdownValue: element.task,
          };
          temparray.push(obj);
        });
        setTableData(temparray);
      } else {
        const finalTableSortedData =
          changedColumn === "date"
            ? myData?.sort((a, b) =>
                new Date(b["dateTimeStamp"]) > new Date(a["dateTimeStamp"])
                  ? 1
                  : -1
              )
            : myData?.sort((a, b) =>
                b[changedColumn] > a[changedColumn] ? 1 : -1
              );
        setTableData([]);
        let temparray = [];

        finalTableSortedData.forEach((element) => {
          let obj = {
            ...element,
            isSelected: false,
            dropdownValue: element.task,
          };
          temparray.push(obj);
        });
        setTableData(temparray);
      }
    },
    onViewColumnsChange: (changedColumn, action) => {
      if (action === "remove") {
        const index = columns.findIndex((f) => f.name === changedColumn);
        var finalArrayRemove = colOrder.filter(function (item) {
          return item !== index;
        });
        setColOrder(finalArrayRemove);
      } else {
        const index = columns.findIndex((f) => f.name === changedColumn);
        var finalArrayAdd = colOrder.concat(index);
        setColOrder(finalArrayAdd.sort());
      }
    },
    onChangeRowsPerPage: (numberOfRows) => {
      window.scrollTo(0, 0);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setRowsPerPage(numberOfRows);
      setPage(0);
    },
    onFilterChange: (
      changedColumn,
      filterList,
      type,
      changedColumnIndex,
      displayData
    ) => {
      if (type === "chip") {
        setServer(true);
      }
    },
    onSearchOpen: () => {
      setSearch(true);
    },
    onSearchChange: (s) => {
      if (searchText) {
        setServer(false);
      }
      setSearchText(s);
    },
    onSearchClose: () => {
      setServer(true);
    },
  };
  const clickOnButton = (type) => {
    setSearchAssetId("");
    //  setgraphContent("")
    console.log("filter--", type + "--" + filter);
    if (filter !== type) {
      //dispatch(clearPendingInQueueData())
      setResponseForFirstPie({});
    }
    const value = localStorage.getItem("overview");
    if (value) {
      dispatch(
        getPendingInQueueTableData(
          dataOverview.imageInfo
            ? [
                ...new Set(checkedContent.concat(dataOverview.imageInfo)),
              ].toString()
            : checkedContent.toString(),
          buttonType,
          page,
          rowsPerPage,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          searchAssetId,
          dispatch
        )
      );
    } else {
      dispatch(
        getPendingInQueueTableData(
          checkedContent.toString(),
          filter,
          page,
          rowsPerPage,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          searchAssetId,
          dispatch
        )
      );
    }

    setFilter(type);
    setServer(true);
    setPage(0);
    if (localStorage.getItem("btnType")) {
      localStorage.setItem("btnType", type);
    }
  };

  const contentPartnerChange = (e) => {
    if (e.target.value !== "") {
      const data = dataOverview?.partnerInfo.filter((a) =>
        a.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setContentPartner(data);
    } else {
      setContentPartner(dataOverview?.partnerInfo);
    }
  };

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

  const handleToggleIssueType = (value) => {
    const currentIndex = checkedIssue.indexOf(value);
    const newChecked = [...checkedIssue];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheckedIssue(newChecked);
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
  };

  const handleToggleStatusType = (value) => {
    const currentIndex = checkedStatus.indexOf(value);
    const newChecked = [...checkedStatus];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setCheckedStatus(newChecked);
  };

  const issueTypeChange = (e) => {
    if (e.target.value !== "") {
      const data = dataOverview?.issueType.filter((a) =>
        a.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setIssueType(data);
    } else {
      setIssueType(dataOverview?.issueType);
    }
  };

  const contentTypeChange = (e) => {
    if (e.target.value !== "") {
      const data = dataOverview?.contentTypes.filter((a) =>
        a.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setContentType(data);
    } else {
      setContentType(dataOverview?.contentTypes);
    }
  };

  const statusTypeChange = (e) => {
    if (e.target.value !== "") {
      const data = dataOverview?.status.filter((a) =>
        a.name.toLowerCase().includes(e.target.value.toLowerCase())
      );
      setStatus(data);
    } else {
      setStatus(dataOverview?.status);
    }
  };

  const applyFilters = () => {
    setSearchAssetId("");
    closeflyout();
    dispatch(clearPendingInQueueData());
    setPage(0);
    setRowsPerPage(10);
    setApply(true);
    setResponseForFirstPie({});
    setTableData();
    if (!checkedContent.find((f) => f === dataOverview?.imageInfo)) {
      dispatch(clearAssetInfoData());
    }

    console.log("checkedContent===", checkedContent);
    if (checkedContent.length == 0) {
      setCheckedContent([]);
      setgraphContent("");
    }
  };
  const handleChangeContentPartner = (partner) => {
    // if (checkedContent.length !== 1) {
    setSearchAssetId("");
    setResponse({});
    setCheckedContent([partner]);

    setgraphContent(partner);
    const value = localStorage.getItem("overview");
    if (value) {
      dispatch(
        getPendingInQueueTableData(
          partner,
          buttonType,
          page,
          rowsPerPage,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          searchAssetId,
          dispatch
        )
      );
      dispatch(
        getPendingInQueueGraphData(
          partner,
          buttonType,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          dispatch
        )
      );
    } else {
      dispatch(
        getPendingInQueueTableData(
          partner,
          filter,
          page,
          rowsPerPage,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          searchAssetId,
          dispatch
        )
      );

      dispatch(
        getPendingInQueueGraphData(
          partner,
          filter,
          checkedIssue.toString(),
          checkedContentType.toString(),
          checkedStatus.toString(),
          dispatch
        )
      );
    }
    // }
  };
  let styleobj = {
    float: "right",
    "margin-right": "25px",
    background: "#e10092",
    color: "white",
    "font-size": "17px",
    width: "136px",
  };

  return (
    <>
      <div className="FilterContainer">
        <Drawer anchor="right" open={rights} onClose={() => closeflyout()}>
          <div
            style={{ height: "90%", overflowY: "scroll" }}
            className="rightSidebar"
          >
            <div className="SideBarHeader" style={{ marginBottom: "-30px" }}>
              <h3>Filter</h3>
              <IconButton onClick={() => closeflyout()}>
                {" "}
                <Close />
              </IconButton>
            </div>
            <List dense className="filtersCont">
              <ListItem>
                <h3>Content Partner</h3>
                <Paper
                  sx={{ width: "220px", margin: "0 0 15px 15px" }}
                  elevation={3}
                >
                  <input
                    onChange={contentPartnerChange}
                    type="text"
                    name="filterSearch"
                    className="filterSearch"
                    placeholder="Search"
                  />
                </Paper>
                <MenuList dense className="filterList">
                  {contentPartner.map((value, index) => {
                    const labelId = value?.name;
                    return (
                      <MenuItem key={index}>
                        <ListItemButton
                          onClick={() => handleToggleContentPartner(labelId)}
                          role={undefined}
                          dense
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={
                                checkedContent.indexOf(value?.name) !== -1
                              }
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
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
              {/* <ListItem>
                <h3>Issue Type</h3>
                <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                  <input onChange={issueTypeChange} type='text' name='filterSearch' className="filterSearch" placeholder='Search' />
                </Paper>
                <MenuList dense className="filterList">
                  {issueType.map((value, index) => {
                    const labelId = value?.name;
                    return (
                      <MenuItem key={index}>
                        <ListItemButton onClick={() => handleToggleIssueType(labelId)} role={undefined} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checkedIssue.indexOf(value?.name) !== -1}
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
              </ListItem> */}

              <ListItem>
                <h3>Content Type</h3>
                <Paper
                  sx={{ width: "220px", margin: "0 0 15px 15px" }}
                  elevation={3}
                >
                  <input
                    onChange={contentTypeChange}
                    type="text"
                    name="filterSearch"
                    className="filterSearch"
                    placeholder="Search"
                  />
                </Paper>
                <MenuList dense className="filterList">
                  {contentType.map((value, index) => {
                    const labelId = value?.name;
                    return (
                      <MenuItem key={index}>
                        <ListItemButton
                          onClick={() => handleToggleContentType(labelId)}
                          role={undefined}
                          dense
                        >
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={
                                checkedContentType.indexOf(value?.name) !== -1
                              }
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": labelId }}
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
              {/* <ListItem>
                <h3>Status Type</h3>
                <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
                  <input onChange={statusTypeChange} type='text' name='filterSearch' className="filterSearch" placeholder='Search' />
                </Paper>
                <MenuList dense className="filterList">
                  {status.map((value, index) => {
                    const labelId = value?.name;
                    return (
                      <MenuItem key={index}>
                        <ListItemButton onClick={() => handleToggleStatusType(labelId)} role={undefined} dense>
                          <ListItemIcon>
                            <Checkbox
                              edge="start"
                              checked={checkedStatus.indexOf(value?.name) !== -1}
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
              </ListItem> */}
            </List>
          </div>
          <div className="rightSidebar" style={{ height: "10%" }}>
            <Button
              variant="contained"
              size="small"
              className="btnApply"
              onClick={applyFilters}
            >
              Apply
            </Button>
          </div>
        </Drawer>
      </div>
      {Object.keys(response)?.length > 0 && (
        <>
          <div className="row">
            <div className="col-md-6">
              <SpacePieChartContentPartner
                response={responseForFirstPie}
                type="content-partner"
                handleChangeContentPartner={handleChangeContentPartner}
              />
            </div>
            <div className="col-md-6">
              <SpacePieChartContentType
                response={response}
                type="content-type"
              />
            </div>
            {/* <div className="col-md-3">
                <SpacePieChartStatusTypes response={response} type='status' />
              </div>
              <div className="col-md-3">
                <SpacePieChartIssue response={response} type='issue' />
              </div> */}
          </div>
          <div className="row log-graph">
            <div className="col-md-12">
              <div className="relative-background">
                <div className="partner-logo">
                  {responseForFirstPie.partnerList?.length > 0
                    ? responseForFirstPie.partnerList?.map((img, index) => {
                        return (
                          <img
                            onClick={() => handleChangeContentPartner(img)}
                            className={
                              img == graphContent ? "partner-border" : null
                            }
                            key={index}
                            alt=""
                            src={`${process.env.PUBLIC_URL}/assets/images/img/QC/${img}.png`}
                          />
                        );
                      })
                    : null}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="data-table-wraper">
        <div className="monthely-status">
          {localStorage.getItem("overview") ? (
            <>
              {/* <MatButton onClick={() => clickOnButton(assetOverviewGraph.ALL)} className={`Status-btn ${localStorage.getItem('btnType') === assetOverviewGraph.ALL ? 'Status-btn-active' : ''}`}>All</MatButton> */}
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.DAILY)}
                className={`Status-btn ${
                  localStorage.getItem("btnType") === assetOverviewGraph.DAILY
                    ? "Status-btn-active"
                    : ""
                }`}
              >
                24 Hr
              </MatButton>
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.WEEKLY)}
                className={`Status-btn ${
                  localStorage.getItem("btnType") === assetOverviewGraph.WEEKLY
                    ? "Status-btn-active"
                    : ""
                }`}
              >
                Weekly
              </MatButton>
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.MONTHLY)}
                className={`Status-btn ${
                  localStorage.getItem("btnType") === assetOverviewGraph.MONTHLY
                    ? "Status-btn-active"
                    : ""
                }`}
              >
                Monthly
              </MatButton>
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.MONTHLY_3)}
                className={`Status-btn ${
                  localStorage.getItem("btnType") ===
                  assetOverviewGraph.MONTHLY_3
                    ? "Status-btn-active"
                    : ""
                }`}
              >
                3 Months
              </MatButton>
            </>
          ) : (
            <>
              {openSearch ? (
                <div style={{ position: "absolute" }}>
                  <Paper
                    className="search-box"
                    component="form"
                    sx={{
                      p: "2px 4px",
                      display: "flex",
                      alignItems: "left",
                      width: 350,
                    }}
                  >
                    <InputBase
                      sx={{ ml: 1, flex: 1 }}
                      placeholder="Search asset id "
                      inputProps={{ "aria-label": "search asset id" }}
                      onChange={(e) => setSearchAssetId(e.target.value)}
                      value={searchAssetId}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                    >
                      <SearchIcon
                        onClick={() => {
                          searchByAssetId();
                        }}
                      />
                    </IconButton>
                    {/* <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" /> */}
                    <IconButton
                      color="primary"
                      sx={{ p: "10px" }}
                      aria-label="directions"
                    >
                      <Close onClick={() => setSearchAssetId("")} />
                    </IconButton>
                  </Paper>
                </div>
              ) : null}
              {/* <MatButton onClick={() => clickOnButton(assetOverviewGraph.ALL)} className={`Status-btn ${filter === assetOverviewGraph.ALL ? 'Status-btn-active' : ''}`}>All</MatButton> */}
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.DAILY)}
                className={`Status-btn ${
                  filter === assetOverviewGraph.DAILY ? "Status-btn-active" : ""
                }`}
              >
                24 Hr
              </MatButton>
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.WEEKLY)}
                className={`Status-btn ${
                  filter === assetOverviewGraph.WEEKLY
                    ? "Status-btn-active"
                    : ""
                }`}
              >
                Weekly
              </MatButton>
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.MONTHLY)}
                className={`Status-btn ${
                  filter === assetOverviewGraph.MONTHLY
                    ? "Status-btn-active"
                    : ""
                }`}
              >
                Monthly
              </MatButton>
              <MatButton
                onClick={() => clickOnButton(assetOverviewGraph.MONTHLY_3)}
                className={`Status-btn ${
                  localStorage.getItem("btnType") ===
                  assetOverviewGraph.MONTHLY_3
                    ? "Status-btn-active"
                    : ""
                }`}
              >
                3 Months
              </MatButton>

              <MatButton
                className="seachIcon-btn"
                onClick={() => {
                  openSearch ? setOpenSearch(false) : setOpenSearch(true);
                }}
              >
                <i className="zmdi zmdi-search"></i>{" "}
              </MatButton>
            </>
          )}
        </div>
        <>
          <MUIDataTable
            title={`Total Assets ${totalItems}`}
            data={tableData}
            columns={columns}
            options={options}
            className={"filter-btn"}
          />
          <MyDialog
            assetid={selectedTableData[0]}
            title={selectedTableData[1]}
            isOpen={isDialogOpen}
            onClose={handleDialogClose}
          >
            <Paper style={{ padding: "2em" }}>
              <div>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Task Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={selectedTableData[6]}
                    onChange={handleDropDownCahnge}
                  >
                    <MenuItem value={"Pass"}>Pass</MenuItem>
                    <MenuItem value={"Verify"}>Verify</MenuItem>
                    <MenuItem value={"Fail"}>Fail</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <div style={{ marginTop: "3em", textAlign: "end" }}>
                <Button onClick={handleAddNewRow}>Save</Button>
                <Button onClick={handleDialogClose}>Cancel</Button>
              </div>
            </Paper>
          </MyDialog>
          <Snackbar
            anchorOrigin={{
              vertical: "top",
              horizontal: "center",
            }}
            open={isStatusUpdated}
            onClose={() => setIsStatusUpdated(false)}
            autoHideDuration={2000}
            message={<span id="message-id">{successMessage}</span>}
          />
          {/* <MatButton onClick={() => updateStatusClick()} style={styleobj} className='Status-btn-active'>Submit</MatButton> */}

          {/* <Modal
            open={videoOpen}
            onClose={handleCloseVideo}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={style} className={"remove-padding"}>
              <h3>{videoTitle}</h3>
              <LogDetailVideoPlayer data={pertnerVideoUrl} />
            </Box>
          </Modal> */}

          <Dialog
            fullScreen={fullScreen}
            open={open}
            onClose={handleClose}
            className={"filter-popup"}
          >
            <DialogTitle id="responsive-dialog-title">
              ASSET ID : {assetId}{" "}
              <i className="zmdi zmdi-close" onClick={handleClose} />{" "}
            </DialogTitle>
            <DialogContent>
              <DialogContentText>
                <PendingInQueueModeltab />
              </DialogContentText>
            </DialogContent>
          </Dialog>
        </>
        {!dataTable.isLoading &&
        Object.keys(dataOverview?.connectedData).length > 0 ? null : (
          <CircularProgress
            className="progress-primary mr-30 mb-10"
            size={60}
            mode="determinate"
            value={75}
          />
        )}
      </div>
    </>
  );
}

export default PendingDataTable;
