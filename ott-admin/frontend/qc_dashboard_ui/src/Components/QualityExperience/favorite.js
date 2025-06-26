/*eslint react-hooks/exhaustive-deps: "off"*/
import * as React from 'react';
import { useState, useEffect } from 'react';
import { createFileName } from 'use-react-screenshot'
import LineChartComponent from './line-chart';
import AppliedFilters from './AppliedFilters';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import FilterLayout from './FilterLayout';
import LeftMenu from './LeftMenu';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FullscreenOutlinedIcon from '@mui/icons-material/FullscreenOutlined';
import { FullScreen, useFullScreenHandle } from "react-full-screen";
import Button from '@mui/material/Button';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
import TextField from '@mui/material/TextField';
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import DateRangePicker from '@mui/lab/DateRangePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import {
	Modal,
	ModalHeader,
	ModalBody,
	ModalFooter
} from 'reactstrap';
import Checkbox from '@mui/material/Checkbox';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { getRealTimePage, clearRealTimeDataCombine, getUniqueFilters, markMetricAsFavorite, setMetricType, getFavoriteMetrics, setMetricTypeFullName } from 'Store/Actions';
import { useDispatch, useSelector } from "react-redux";
import domtoimage from 'dom-to-image';
import { Line } from 'react-chartjs-2';
import moment from 'moment';
import exportFromJSON from 'export-from-json';
import { Tooltip } from "@material-ui/core";
import { DateRange } from "react-date-range";
import { NotificationManager } from 'react-notifications';

const Favorite = () => {
	const dispatch = useDispatch()
	const realdata = useSelector(state => state.qoeReducer);
	const favorite = realdata?.favoriteMetric;
	const realTimeMetric = realdata?.filters?.realtime_metrices_name;
	const userMetric = realdata?.filters?.user_metrices_name;
	const QualityMetric = realdata?.filters?.qoe_metrics_name;
	const cdnVal = realdata?.filters?.cdn;
	const contentTypeVal = realdata?.filters?.content_type;
	const contentPartnetVal = realdata?.filters?.content_partner;
	const locationVal = realdata?.filters?.location;
	const [openModal, setModalOpen] = useState(false)
	const [openModalCalender, setModalOpenCalender] = useState(false)
	const [unit, setUnit] = useState('')
	const [selectedMetric, setSelectedMetric] = useState([])
	const [isLoadingData, setisLoadingData] = React.useState(false);
	const [cdn, setCdn] = useState([]);
	const [contentType, setContentType] = useState([]);
	const [contentPartner, setContentPartner] = useState([]);
	const [location, setLocation] = useState([]);
	const [metric, setMetric] = useState('');
	const [metricHeader, setMetricHeader] = useState('');
	const [aggregationInterval, setAggregationInterval] = useState("1h");
	const [devicePlatform, setDevicePlatform] = useState(["dummy"]);
	const [fromDate, setFromDate] = useState(Math.floor((new Date()).getTime() / 1000.0) - (24 * 3600));
	const [toDate, setToDate] = useState(Math.floor((new Date()).getTime() / 1000.0));
	const [updatedGraphData, setUpdatedGraphData] = useState();
	const [allGraphPoints, setAllGraphPoints] = useState([])
	const [androidGraphPoints, setAndroidGraphPoints] = useState([])
	const [iosGraphPoints, setIosGraphPoints] = useState([]);
	const [chromeGraphPoints, setChromeGraphPoints] = useState([]);
	const [tvGraphPoints, setTvGraphPoints] = useState([])
	const [firestickGraphPoints, setFirestickGraphPoints] = useState([])
	const [metricGraphPoints, setMetricGraphPoints] = useState();
	const [androidDataPoints, setAndroidDataPoints] = useState();
	const [iosDataPoints, setIosDataPoints] = useState();
	const [chromeDataPoints, setChromeDataPoints] = useState();
	const [tvDataPoints, setTvDataPoints] = useState();
	const [firestickDataPoints, setFirestickDataPoints] = useState();
	const [graphPointsUpdated, setGraphPointsUpdated] = useState(true);
	const [selectVal, setSelectVal] = useState("1d");
	const [xAxis, setXAxis] = useState("hour");
	const [metricsListLoading, setisMetricsListLoading] = useState(false);
	const [customDateValue, setCustomDateValue] = useState([null, null]);
	const [refresh, setRefresh] = useState(10)
	const [tempLocation, setTempLocation] = useState([]);
	const [range, setRange] = useState([
		{
			startDate: new Date(),
			endDate: new Date(),
			key: "selection",
		},
	])
	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	//f0r drop down-------------------
	const [androidDataReport, setAndroidDataReport] = useState();
	const [iosDataReport, setIosDataReport] = useState();
	const [webDataReport, setWebDataReport] = useState();
	const [firestickDataReport, setFirestickDataReport] = useState();
	const [totalDataReport, setTotalDataReport] = useState();
	//-----------------------------------
	//for Video Plays And Failures
	const [attemptsData, setAttemptsData] = useState();
	const [videoStartFailuresData, setVideoStartFailuresData] = useState();
	const [exitBeforeVideoStartsData, setExitBeforeVideoStartsData] = useState();
	const [succesfullPlaysData, setSuccesfullPlaysData] = useState();
	//-----------------------------------
	const [AndroidSmartTvGraphPoints, setAndroidSmartTvGraphPoints] = useState([]);
	const [AndroidSmartTvDataPoints, setAndroidSmartTvDataPoints] = useState([]);
	const [AndroidSmartTvDataReport, setAndroidSmartTvDataReport] = useState([]);
	//--------------------------------------------


	const getCdn = (val) => {
		setCdn(val);
	}
	const getContentType = (val) => {
		setContentType(val);
	}
	const getContentPartner = (val) => {
		setContentPartner(val);
	}
	const getLocation = (val) => {
		setLocation(val);
	}
	const updateMetricHeader = (data) => {
		setMetricHeader(data)
	}
	const updateMetric = (metricName) => {

		console.log("abcdef--", metricName);
		setXAxis("hour");
		setDevicePlatform(realdata?.device_platform)
		setMetric(metricName);
		setAggregationInterval("1h")
		setStartDate();
		setEndDate();
		setRange([
			{
				startDate: new Date(),
				endDate: new Date(),
				key: "selection",
			},
		]);
		setFromDate(Math.floor(new Date().getTime() / 1000.0) - 24 * 3600);
		setToDate(Math.floor(new Date().getTime() / 1000.0));
		setRefresh(10)
		setSelectVal('1d')
		setIosDataPoints([])
		setAndroidDataPoints([])
		setChromeDataPoints([])
		setFirestickDataPoints([])
		setTvDataPoints([])
		setAndroidSmartTvDataPoints([])
		//reprt---data--------------
		setIosDataReport([]);
		setAndroidDataReport([]);
		setWebDataReport([]);
		setFirestickDataReport([]);
		setTotalDataReport([]);
		setAndroidSmartTvDataReport([])
		//------------------------------
	}

	useEffect(() => {
		if (realdata?.device_platform.length > 0) {
			setDevicePlatform(realdata?.device_platform)
		}
	}, [realdata?.device_platform])

	useEffect(() => {
		if (favorite) {
			setMetricHeader(favorite[0])
		} else {
			setMetricHeader('')
		}

		if (realTimeMetric != undefined && favorite?.length > 0) {
			realTimeMetric && favorite && favorite?.map(f => {
				if (realTimeMetric.indexOf(f) >= 0) {
					return setSelectedMetric(s => s.concat(realTimeMetric[realTimeMetric.indexOf(f)]))
				}
				else {
					return null
				}
			})
		}

	}, [realTimeMetric, favorite])

	useEffect(() => {
		if (userMetric != undefined && favorite?.length > 0) {
			userMetric && favorite && favorite?.map(f => {
				if (userMetric.indexOf(f) >= 0) {
					return setSelectedMetric(s => s.concat(userMetric[userMetric.indexOf(f)]))
				}
				else {
					return null
				}
			})
		}
	}, [userMetric, favorite])

	useEffect(() => {
		if (QualityMetric != undefined && favorite?.length > 0) {
			QualityMetric && favorite && favorite?.map(f => {
				if (QualityMetric.indexOf(f) >= 0) {
					return setSelectedMetric(s => s.concat(QualityMetric[QualityMetric.indexOf(f)]))
				}
				else {
					return null
				}
			})
		}
	}, [QualityMetric, favorite])

	const updatePlatformData = (layout, itemsToRemove) => {
		let dpl = devicePlatform;

		if (layout === "AppliedFilters") {
			for (var j = 0; j < itemsToRemove.length; j++) {
				for (var i = 0; i < dpl.length; i++) {
					if (dpl[i] === itemsToRemove[j]) {
						dpl.splice(i, 1);
					}
				}
			}
			setDevicePlatform(dpl);
		}
		else if (layout === "FilterLayout") {
		}
	}

	const savePlatformData = (val) => {
		setDevicePlatform(val);
	}

	const removeContentPartner = (type) => {
		const data = contentPartner;
		const final = data.filter(d => d !== type)
		setContentPartner(final);
	}

	const removeContentType = (type) => {
		const dataType = contentType;
		const final = dataType.filter(d => d !== type)
		setContentType(final);
	}
	const getLocationWithoutState = (val) => {
		let temparray = []
		val.forEach(element => {
			temparray.push(element.split('(')[0])
		});
		return temparray
	};

	const removeDevicePlatform = (platform) => {
		if (Array.isArray(platform)) {
			setDevicePlatform([]);
			setContentPartner([])
			setContentType([])
			localStorage.removeItem('contentPartner')
		}
		else {
			const dpa = devicePlatform;
			const final = dpa.filter(d => d !== platform)
			setDevicePlatform(final);
		}
	}
	const changeRefresh = (e) => {
		setRefresh(e.target.value)
	}
	const setDataRange = (e) => {
		setStartDate();
		setEndDate();
		setRange([
			{
				startDate: new Date(),
				endDate: new Date(),
				key: "selection",
			},
		]);
		setSelectVal(e.target.value);
		let aggrInterval = "";
		switch (e.target.value) {
			case "1min": {
				aggrInterval = "10s";
				setAggregationInterval(aggrInterval);
				setXAxis("sec");
				calculateDateRange("1min");
				return;
			}
			case "5min": {
				aggrInterval = "10s";
				setAggregationInterval(aggrInterval);
				setXAxis("sec");
				calculateDateRange("5min");
				return;
			}
			case "1h": {
				aggrInterval = "1m";
				setAggregationInterval(aggrInterval);
				setXAxis("hour");
				calculateDateRange("1h");
				return;
			}
			case "1d": {
				aggrInterval = "1h";
				setAggregationInterval(aggrInterval);
				setXAxis("hour");
				calculateDateRange("1d");
				return;
			}
			case "1w": {
				aggrInterval = "1d";
				setAggregationInterval(aggrInterval);
				setXAxis("date");
				calculateDateRange("1w");
				return;
			}
			case "1m": {
				aggrInterval = "2d";
				setAggregationInterval(aggrInterval);
				setXAxis("date");
				calculateDateRange("1m");
				return;
			}
			case "1y": {
				aggrInterval = "30d";
				setAggregationInterval(aggrInterval);
				setXAxis("date");
				calculateDateRange("1y");
				return;
			}
			default:
				return;
		}
	};

	const calculateDateRange = (timestamp) => {
		let sd = new Date();
		let toDate = Math.floor(sd.getTime() / 1000.0);
		setToDate(toDate);
		// let ts = Math.floor(new Date().getTime() / 1000);
		let ts = Math.floor(moment().endOf("date")._d.getTime() / 1000.0);
		let fromDateRange;

		switch (timestamp) {
			case "1min": {
				fromDateRange = ts - 60;
				setFromDate(fromDateRange);
				return;
			}
			case "5min": {
				fromDateRange = ts - 300;
				setFromDate(fromDateRange);
				return;
			}
			case "1h": {
				fromDateRange = ts - 3600;
				setFromDate(fromDateRange);
				return;
			}
			case "1d":
				{
					fromDateRange = ts - (24 * 3600);
					setFromDate(fromDateRange);
					return;
				}
			case "1w":
				{
					fromDateRange = ts - (7 * 24 * 3600);
					setFromDate(fromDateRange);
					return;
				}
			case "1m":
				{
					fromDateRange = ts - (30 * 24 * 3600);
					setFromDate(fromDateRange);
					return;
				}
			case "1y":
				{
					fromDateRange = ts - (12 * 30 * 24 * 3600);
					setFromDate(fromDateRange);
					return;
				}
			default:
				return
		}
	}

	useEffect(() => {
		if (customDateValue[0] !== null && customDateValue[1] !== null) {
			let fdate = customDateValue[0];
			let tdate = customDateValue[1];
			setToDate(Math.floor(tdate.getTime() / 1000.0));
			setAggregationInterval("1d");
			setFromDate(Math.floor(fdate.getTime() / 1000.0));
		}

	}, [customDateValue]);


	useEffect(() => {
		if (realdata && realdata.realTimePageData) {


			setisLoadingData(false);
			setUpdatedGraphData(realdata.realTimePageData)
		}
	}, [realdata]);


	const fetchTheRequest = (f, cdn, contentType, contentPartner, location, metric, toDate, fromDate, aggregationInterval, devicePlatform) => {
		if (f?.length > 0 && metric) {
			setAndroidGraphPoints([])
			setIosGraphPoints([])
			setChromeGraphPoints([])
			setAllGraphPoints([])
			setTvGraphPoints([])
			setFirestickGraphPoints([])
			setAndroidSmartTvGraphPoints([])
			setisLoadingData(true);
			if (metric === 'video_plays_and_failures') {
				dispatch(clearRealTimeDataCombine())
				dispatch(getRealTimePage(dispatch, cdn, contentType, contentPartner, getLocationWithoutState(location), metric, toDate, fromDate, aggregationInterval, []))
			}
			else {
				if (devicePlatform[0] === 'dummy') {
					return null
				}
				dispatch(getRealTimePage(dispatch, cdn, contentType, contentPartner, getLocationWithoutState(location), metric, toDate, fromDate, aggregationInterval, devicePlatform))
			}
		}
		else {
			if (f?.length > 0) {
				setAndroidGraphPoints([])
				setIosGraphPoints([])
				setChromeGraphPoints([])
				setAllGraphPoints([])
				setTvGraphPoints([])
				setFirestickGraphPoints([])
				setAndroidSmartTvGraphPoints([])
				setisLoadingData(true);
				if (devicePlatform[0] === 'dummy') {
					return null
				}
				dispatch(getRealTimePage(dispatch, cdn, contentType, contentPartner, getLocationWithoutState(location), f[0].toLowerCase().replaceAll(" ", "_"), toDate, fromDate, aggregationInterval, devicePlatform))
			}
		}

	}

	const handleReload = () => {
		let ts = Math.floor(new Date().getTime() / 1000);
		let fromDateInfo
		switch (selectVal) {
			case "1min":
				{
					fromDateInfo = ts - 60;
					break;
				}
			case "5min": {
				fromDateInfo = ts - 300;
				break;
			}
			case "1h":
				{
					fromDateInfo = ts - 3600;
					break;
				}
			case "1d":
				{
					fromDateInfo = ts - (24 * 3600);
					break;
				}
			case "1w":
				{
					fromDateInfo = ts - (7 * 24 * 3600);
					break;
				}
			case "1m":
				{
					fromDateInfo = ts - (30 * 24 * 3600);
					break;
				}
			case "1y":
				{
					fromDateInfo = ts - (12 * 30 * 24 * 3600);
					break;
				}
			default:
				break;
		}
		fetchTheRequest(favorite, cdn, contentType, contentPartner, getLocationWithoutState(location), metric, startDate ? toDate : ts, endDate ? fromDate : fromDateInfo, aggregationInterval, devicePlatform);
	}


	useEffect(() => {
		let ts = Math.floor(new Date().getTime() / 1000);
		let fromDateInfo
		switch (selectVal) {
			case "1min":
				{
					fromDateInfo = ts - 60;
					break;
				}
			case "5min": {
				fromDateInfo = ts - 300;
				break;
			}
			case "1h":
				{
					fromDateInfo = ts - 3600;
					break;
				}
			case "1d":
				{
					fromDateInfo = ts - (24 * 3600);
					break;
				}
			case "1w":
				{
					fromDateInfo = ts - (7 * 24 * 3600);
					break;
				}
			case "1m":
				{
					fromDateInfo = ts - (30 * 24 * 3600);
					break;
				}
			case "1y":
				{
					fromDateInfo = ts - (12 * 30 * 24 * 3600);
					break;
				}
			default:
				break;
		}
		fetchTheRequest(
			favorite,
			cdn,
			contentType,
			contentPartner,
			getLocationWithoutState(location),
			metric,
			toDate,
			startDate && endDate ? fromDate : fromDateInfo,
			aggregationInterval,
			devicePlatform);
	}, [favorite,
		cdn,
		contentType,
		contentPartner,
		location,
		metric,
		toDate,
		fromDate,
		aggregationInterval,
		devicePlatform]);



	useEffect(() => {
		console.log("updatedGraphData--", updatedGraphData);
		if (updatedGraphData == undefined || Object.keys(updatedGraphData).length === 0 || updatedGraphData?.message == "Bad request, Invalid metrics name.") {
			return;
		}
		if (Object.keys(updatedGraphData).length > 0) {
			//   setisLoadingData(true);
			let datas = [];
			let time = [];
			setGraphPointsUpdated(false);
			const monthNames = [
				"Jan",
				"Feb",
				"Mar",
				"Apr",
				"May",
				"Jun",
				"Jul",
				"Aug",
				"Sep",
				"Oct",
				"Nov",
				"Dec",
			];
			if (devicePlatform) {
				if (devicePlatform.length === 0) {
					datas =
						metric && metric.length !== 0
							? updatedGraphData[0]?.all[metric]
							: updatedGraphData[0]?.all[findMetricAttributeName(favorite[0])];
					let timestampArr = updatedGraphData[0]?.all?.time_stamp;
					setUnit(updatedGraphData[0]?.all?.unit);
					for (let i = 0; i < timestampArr.length; i++) {
						if (xAxis === "hour")
							time.push(
								monthNames[new Date(timestampArr[i]).getMonth()] +
								" " +
								new Date(timestampArr[i]).getDate() +
								"," +
								moment(timestampArr[i]).format("hh:mm")
							);
						else if (xAxis === "date")
							time.push(
								monthNames[new Date(timestampArr[i]).getMonth()] +
								" " +
								new Date(timestampArr[i]).getDate()
							);
						else if (xAxis === "sec")
							time.push(
								monthNames[new Date(timestampArr[i]).getMonth()] +
								" " +
								new Date(timestampArr[i]).getDate() +
								"," +
								new Date(timestampArr[i]).getHours() +
								":" +
								new Date(timestampArr[i]).getMinutes() +
								":" +
								new Date(timestampArr[i]).getSeconds()
							);
					}
					setAllGraphPoints(time);
					setMetricGraphPoints(datas);
				} else {
					let androidData;
					let iosData;
					let chromeData;
					let tvData;
					let firestickData;
					let AndroidSmartTvData;
					if (devicePlatform.includes("Android")) {
						androidData = updatedGraphData.find((item) => item.Android);
						if (androidData) {
							let datas = [];
							let time = [];
							//report data platform wise
							let datasReport = 0;
							datasReport =
								metric && metric.length !== 0
									? androidData.Android["total_sum"]
									: androidData.Android.total_sum;
							//report data platform wise
							datas =
								metric && metric.length !== 0
									? androidData.Android[metric]
									: androidData.Android[findMetricAttributeName(favorite[0])];
							let timestampArr = androidData.Android.time_stamp;
							setUnit(androidData.Android.unit);
							for (let i = 0; i < timestampArr.length; i++) {
								if (xAxis === "hour")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										moment(timestampArr[i]).format("hh:mm")
									);
								else if (xAxis === "date")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate()
									);
								else if (xAxis === "sec")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										new Date(timestampArr[i]).getHours() +
										":" +
										new Date(timestampArr[i]).getMinutes() +
										":" +
										new Date(timestampArr[i]).getSeconds()
									);
							}
							setAndroidGraphPoints(time);
							setAndroidDataPoints(datas);
							setAndroidDataReport(datasReport)

						}
					}
					if (devicePlatform.includes("iOS")) {
						iosData = updatedGraphData.find((item) => item.iOS);
						if (iosData) {
							let datas = [];
							let time = [];
							//report data platform wise
							let datasReport = 0;
							datasReport =
								metric && metric.length !== 0
									? iosData.iOS["total_sum"]
									: iosData.iOS.total_sum;
							//report data platform wise
							datas =
								metric && metric.length !== 0
									? iosData.iOS[metric]
									: iosData.iOS[findMetricAttributeName(favorite[0])];
							let timestampArr = iosData.iOS.time_stamp;
							setUnit(iosData.iOS.unit);
							for (let i = 0; i < timestampArr.length; i++) {
								if (xAxis === "hour")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										moment(timestampArr[i]).format("hh:mm")
									);
								else if (xAxis === "date")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate()
									);
								else if (xAxis === "sec")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										new Date(timestampArr[i]).getHours() +
										":" +
										new Date(timestampArr[i]).getMinutes() +
										":" +
										new Date(timestampArr[i]).getSeconds()
									);
							}
							setIosGraphPoints(time);
							setIosDataPoints(datas);
							setIosDataReport(datasReport)

						}
					}
					if (devicePlatform.includes("Web")) {
						chromeData = updatedGraphData.find((item) => item.Web);
						if (chromeData) {
							let datas = [];
							let time = [];
							//report data platform wise
							let datasReport = 0;
							datasReport =
								metric && metric.length !== 0
									? chromeData.Web["total_sum"]
									: chromeData.Web.total_sum;
							//report data platform wise
							datas =
								metric && metric.length !== 0
									? chromeData.Web[metric]
									: chromeData.Web[findMetricAttributeName(favorite[0])];
							let timestampArr = chromeData.Web.time_stamp;
							setUnit(chromeData.Web.unit);
							for (let i = 0; i < timestampArr.length; i++) {
								if (xAxis === "hour")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										moment(timestampArr[i]).format("hh:mm")
									);
								else if (xAxis === "date")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate()
									);
								else if (xAxis === "sec")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										new Date(timestampArr[i]).getHours() +
										":" +
										new Date(timestampArr[i]).getMinutes() +
										":" +
										new Date(timestampArr[i]).getSeconds()
									);
							}
							setChromeGraphPoints(time);
							setChromeDataPoints(datas);
							setWebDataReport(datasReport)

						}
					}
					if (devicePlatform.includes("FireTV")) {
						tvData = updatedGraphData.find((item) => item.FireTV);

						if (tvData) {
							let datas = [];
							let time = [];
							datas =
								metric && metric.length !== 0
									? tvData.FireTV[metric]
									: tvData.FireTV[findMetricAttributeName(favorite[0])];
							let timestampArr = tvData.FireTV.time_stamp;
							setUnit(tvData.FireTV.unit);
							for (let i = 0; i < timestampArr.length; i++) {
								if (xAxis === "hour")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										moment(timestampArr[i]).format("hh:mm")
									);
								else if (xAxis === "date")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate()
									);
								else if (xAxis === "sec")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										new Date(timestampArr[i]).getHours() +
										":" +
										new Date(timestampArr[i]).getMinutes() +
										":" +
										new Date(timestampArr[i]).getSeconds()
									);
							}
							setTvGraphPoints(time);
							setTvDataPoints(datas);
						}
					}
					if (devicePlatform.includes("Firestick")) {
						firestickData = updatedGraphData.find((item) => item.Firestick);
						if (firestickData) {
							let datas = [];
							let time = [];
							//report data platform wise
							let datasReport = 0;
							datasReport =
								metric && metric.length !== 0
									? firestickData.Firestick["total_sum"]
									: firestickData.Firestick.total_sum;
							//report data platform wise
							datas =
								metric && metric.length !== 0
									? firestickData.Firestick[metric]
									: firestickData.Firestick[findMetricAttributeName(favorite[0])];
							let timestampArr = firestickData.Firestick.time_stamp;
							setUnit(firestickData.Firestick.unit);
							for (let i = 0; i < timestampArr.length; i++) {
								if (xAxis === "hour")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										moment(timestampArr[i]).format("hh:mm")
									);
								else if (xAxis === "date")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate()
									);
								else if (xAxis === "sec")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										new Date(timestampArr[i]).getHours() +
										":" +
										new Date(timestampArr[i]).getMinutes() +
										":" +
										new Date(timestampArr[i]).getSeconds()
									);
							}
							setFirestickGraphPoints(time);
							setFirestickDataPoints(datas);
							setFirestickDataReport(datasReport)

						}

					}

					if (devicePlatform.includes("AndroidSmartTv")) {
						AndroidSmartTvData = updatedGraphData?.find((item) => item.AndroidSmartTv);
						if (AndroidSmartTvData) {
							let datas = [];
							let time = [];

							//report data platform wise
							let datasReport = 0;
							datasReport =
								metric && metric.length !== 0
									? AndroidSmartTvData.AndroidSmartTv["total_sum"]
									: AndroidSmartTvData.AndroidSmartTv.total_sum;
							//report data platform wise
							datas =
								metric && metric.length !== 0
									? AndroidSmartTvData.AndroidSmartTv[metric]
									: AndroidSmartTvData.AndroidSmartTv.rebuffering_percentage;

							let timestampArr = AndroidSmartTvData.AndroidSmartTv.time_stamp;

							setUnit(AndroidSmartTvData.AndroidSmartTv.unit);
							for (let i = 0; i < timestampArr.length; i++) {
								if (xAxis === "hour")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										moment(timestampArr[i]).format("hh:mm")
									);
								else if (xAxis === "date")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate()
									);
								else if (xAxis === "sec")
									time.push(
										monthNames[new Date(timestampArr[i]).getMonth()] +
										" " +
										new Date(timestampArr[i]).getDate() +
										"," +
										new Date(timestampArr[i]).getHours() +
										":" +
										new Date(timestampArr[i]).getMinutes() +
										":" +
										new Date(timestampArr[i]).getSeconds()
									);
							}
							setAndroidSmartTvGraphPoints(time);
							setAndroidSmartTvDataPoints(datas);
							setAndroidSmartTvDataReport(datasReport)
						}
					}
					try {
						let totalData = updatedGraphData.find((item) => item.all);
						//report data platform wise
						let datasReport = 0;
						datasReport =
							metric && metric.length !== 0
								? totalData.all["total_sum"]
								: totalData.all.total_sum;
						setTotalDataReport(datasReport)
						//report data platform wise
					} catch (error) {

					}
				}
				setGraphPointsUpdated(true);
			}
		}
	}, [updatedGraphData, favorite]);

	useEffect(() => {
		const isEmpty = Object.keys(realdata?.filters).length === 0;
		if (isEmpty) {
			setisMetricsListLoading(true);
			dispatch(getUniqueFilters(dispatch))
			setisMetricsListLoading(false);
		}
	}, [])

	const getImage = () => {
		const gettitle = metric ? metric : Array.isArray(favorite) && findMetricAttributeName(favorite[0]);

		var node = document.querySelector('.take-screenshot');
		domtoimage.toPng(node)
			.then(function (dataUrl) {
				const a = document.createElement('a')
				a.href = dataUrl
				a.download = createFileName('png', gettitle)
				a.click()
			})
			.catch(function (error) {
				console.error('oops, something went wrong!', error);
			});
	}

	useEffect(() => {
		return () => {
			dispatch(setMetricType(''))
			dispatch(setMetricTypeFullName(""));
		}
	}, [])

	useEffect(() => {
		const interval = setInterval(() => {
			let ts = Math.floor(new Date().getTime() / 1000);
			let fromDateInfo
			switch (selectVal) {
				case "1min":
					{
						fromDateInfo = ts - 60;
						break;
					}
				case "5min": {
					fromDateInfo = ts - 300;
					break;
				}
				case "1h":
					{
						fromDateInfo = ts - 3600;
						break;
					}
				case "1d":
					{
						fromDateInfo = ts - (24 * 3600);
						break;
					}
				case "1w":
					{
						fromDateInfo = ts - (7 * 24 * 3600);
						break;
					}
				case "1m":
					{
						fromDateInfo = ts - (30 * 24 * 3600);
						break;
					}
				case "1y":
					{
						fromDateInfo = ts - (12 * 30 * 24 * 3600);
						break;
					}
				default:
					break;
			}
			fetchTheRequest(favorite, cdn, contentType, contentPartner, location, metric, startDate ? toDate : ts, endDate ? fromDate : fromDateInfo, aggregationInterval, devicePlatform);
		}, refresh * 1000);
		return () => clearInterval(interval);
	}, [refresh, cdn, contentType, contentPartner, location, metric, toDate, fromDate, aggregationInterval, devicePlatform]);

	useEffect(() => {
		if (!favorite) {
			dispatch(getFavoriteMetrics(dispatch))
		}
	}, [])
	useEffect(() => {
		console.log("abcd--", realdata?.realTimePageDataCombine);
		if (realdata?.realTimePageDataCombine.length > 0) {
			const information = realdata?.realTimePageDataCombine?.find((f) => {
				if (f?.all !== undefined) {
					return Object.keys(f?.all).includes("video_start_failures");
				}
			});
			if (information) {
				setVideoStartFailuresData(information?.all?.total_sum);
			} else {
				setVideoStartFailuresData(0);
			}
		}
		if (realdata?.realTimePageDataCombine.length > 0) {
			const information = realdata?.realTimePageDataCombine?.find((f) => {
				if (f?.all !== undefined) {
					return Object.keys(f?.all).includes("attempts");
				}
			});
			if (information) {
				setAttemptsData(information?.all?.total_sum);
			} else {
				setAttemptsData(0);
			}
		}
		if (realdata?.realTimePageDataCombine.length > 0) {
			const information = realdata?.realTimePageDataCombine?.find((f) => {
				if (f?.all !== undefined) {
					return Object.keys(f?.all).includes("exit_before_video_starts");
				}
			});
			if (information) {
				setExitBeforeVideoStartsData(information?.all?.total_sum);
			} else {
				setExitBeforeVideoStartsData(0);
			}
		}
		if (realdata?.realTimePageDataCombine.length > 0) {
			const information = realdata?.realTimePageDataCombine?.find((f) => {
				if (f?.all !== undefined) {
					return Object.keys(f?.all).includes("succesful_plays");
				}
			});
			if (information) {
				setSuccesfullPlaysData(information?.all?.total_sum);
			} else {
				setSuccesfullPlaysData(0);
			}
		}

	}, [realdata?.realTimePageDataCombine])

	const handle = useFullScreenHandle();

	let timeGraphDataPoints
	let fullCombinationGraphPoints = []
	fullCombinationGraphPoints.push(androidGraphPoints, iosGraphPoints, chromeGraphPoints, tvGraphPoints, firestickGraphPoints, AndroidSmartTvGraphPoints, allGraphPoints)
	const lengths = fullCombinationGraphPoints.map(a => a.length);
	const index = lengths.indexOf(Math.max(...lengths));
	timeGraphDataPoints = fullCombinationGraphPoints[index]

	const handleToggle = (value) => {
		let uniqueData = [...new Set(selectedMetric)];
		const currentIndex = uniqueData.indexOf(value);
		const newChecked = [...uniqueData];
		if (currentIndex === -1) {
			newChecked.push(value);
		} else {
			newChecked.splice(currentIndex, 1);
		}
		setSelectedMetric(newChecked);
	}

	const removeLocation = (type) => {
		if (Array.isArray(type)) {
			setLocation([]);
		}
		else {
			const dataType = location;
			const final = dataType.filter((d) => d !== type);
			setLocation(final);
		}
	};

	const getCombineLabels = () => {
		const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
		if (realdata.realTimePageDataCombine.length > 0) {
			let labels = []
			realdata.realTimePageDataCombine[0]?.all?.time_stamp.map(c => {
				if (xAxis === 'hour') {
					return labels.push(monthNames[new Date(c).getMonth()] + " " + new Date(c).getDate() + "," + moment(c).format('hh:mm'));
				}
				else if (xAxis === "date") {
					return labels.push(monthNames[new Date(c).getMonth()] + " " + new Date(c).getDate());
				}
				else {
					return null
				}
			})
			return labels
		}
		else {
			return []
		}
	}

	const getAttemptsData = () => {
		if (realdata?.realTimePageDataCombine.length == 0) {
			return
		}
		const information = realdata?.realTimePageDataCombine?.find(f => {
			if (f?.all !== undefined) {
				return Object.keys(f?.all).includes('attempts')

			}
		})
		if (information) {
			return information?.all?.attempts
		}
		else {
			return []
		}
	}

	const videStartFailuresData = () => {
		if (realdata?.realTimePageDataCombine.length == 0) {
			return
		}
		const information = realdata?.realTimePageDataCombine?.find(f => {
			if (f?.all !== undefined) {

				return Object.keys(f?.all).includes('video_start_failures')
			}
		})
		if (information) {
			return information?.all?.video_start_failures
		}
		else {
			return []
		}
	}

	const exitBeforeVideoStarts = () => {
		if (realdata?.realTimePageDataCombine.length == 0) {
			return
		}
		const information = realdata?.realTimePageDataCombine?.find(f => {
			if (f?.all !== undefined) {

				return Object.keys(f?.all).includes('exit_before_video_starts')
			}
		})
		if (information) {
			return information?.all?.exit_before_video_starts
		}
		else {
			return []
		}
	}

	const succesfullPlays = () => {
		if (realdata?.realTimePageDataCombine.length == 0) {
			return
		}
		const information = realdata?.realTimePageDataCombine?.find(f => {
			if (f?.all !== undefined) {
				return Object.keys(f?.all).includes('succesful_plays')
			}
		})
		if (information) {
			return information?.all?.succesful_plays
		}
		else {
			return []
		}
	}

	const dataToShow = {
		labels: getCombineLabels(),
		datasets: [
			{
				label: "Attempts",
				data: getAttemptsData(),
				fill: true,
				borderColor: "red",
				backgroundColor: 'rgba(255, 204, 203, 0.3)'
			},
			{
				label: "Video Start Failures",
				data: videStartFailuresData(),
				fill: true,
				borderColor: "blue",
				backgroundColor: 'rgba(0,0,255, 0.1)'
			},
			{
				label: "Exit Before Video Starts",
				data: exitBeforeVideoStarts(),
				fill: true,
				borderColor: "green",
				backgroundColor: 'rgba(50,40,255, 0.1)'
			},
			{
				label: "Successful Plays",
				data: succesfullPlays(),
				fill: true,
				borderColor: "yellow",
				backgroundColor: 'rgba(50,211,255, 0.1)'
			},
		]
	};

	const submitCalender = () => {
		let diff = ((range[0].endDate - range[0].startDate) / (1000 * 60 * 60 * 24) + 1) % 365
		if (diff > 31) {
			NotificationManager.error("To-Date and From-Date Should be of 31 days of Gap", "", 2000)
			return;
		}
		setSelectVal(range[0])
		setXAxis("date");
		setStartDate(range[0].startDate);
		setEndDate(range[0].endDate);
		setModalOpenCalender(false);
		setToDate(
			Math.floor(moment(range[0].endDate).endOf("date")._d.getTime() / 1000.0)
		);
		setAggregationInterval("1d");
		setFromDate(Math.floor(range[0].startDate.getTime() / 1000.0));
	};

	const submit = () => {

		let unique = [...new Set(selectedMetric)];
		dispatch(markMetricAsFavorite(unique, () => {
			setAndroidGraphPoints([])
			setIosGraphPoints([])
			setChromeGraphPoints([])
			setAllGraphPoints([])
			setModalOpen(false)
			dispatch(getFavoriteMetrics(dispatch))
			setMetric('')
		}))
	}
	const updateParentMetric = (favInfo) => {

		setSelectedMetric(favInfo)
	}
	let uniqueMetric = [...new Set(selectedMetric)];
	const findMetricAttributeName = (metricName) => {

		switch (metricName) {
			case "Average Bitrate":
				return "average_bitrate";
			case "Connection Induced Re-buffering - CIRR (%)":
				return "connection_induced_rebuffering";
			case "Play Attempts":
				return "play_attempts";
			case "Video plays and failures":
				return "video_play_failures";
			case "Exit Before Video Starts":
				return "exit_before_video_starts";
			case "Video start Failures":
				return "video_start_failures";
			case "Video Playback Failures":
				return "video_playback_failures";
			case "Video Restart Time (VRT)":
				return "video_restart_time";
			case "Ended Plays":
				return "ended_plays";
			case "Max Concurrent Plays":
				return "concurrent_plays";
			case "Attempts":
				return "attempts";
			case "Plays":
				return "plays";
			case "Total Minutes Watched":
				return "total_minutes_watched";
			case "Unique Devices":
				return "unique_devices";
			case "Unique Viewers":
				return "unique_viewers";
			case "Minutes Per Unique Devices":
				return "minutes_per_unique_devices";
			case "Average Percent Completion":
				return "average_percent_completion";
			case "Ended Plays Per Unique Devices":
				return "ended_plays_per_unique_devices";
			case "Video Startup Time (VST)":
				return "video_startup_time";
			case "Rebuffering Ratio":
				return "rebuffering_ratio";
			case "Average Framerate":
				return "average_framerate";
			case "Rendering Quality":
				return "rendering_quality";
			case "Bandwidth":
				return "bandwidth";
			case "Rebuffering Percentage":
				return "rebuffering_percentage";
			case "User Attrition":
				return "user_attrition";
			case "Successful Plays":
				return "succesful_plays";
			case "Average Percentage Completion":
				return "average_percentage_completion";
			case "Video Start Time":
				return "video_start_time";
			case "Video Restart Time":
				return "video_restart_time";
			case "Video Plays And Failures":
				return "video_plays_and_failures";
			case "Connection Induced Rebuffering Ratio":
				return "connection_induced_rebuffering_ratio";
			case "Number of Mitigation Applied":
				return "number_of_mitigations_applied";
			case "Improvement in UEI":
				return "improvement_in_uei";
			case "Degradation in UEI":
				return "degradation_in_uei";
			case "Average Startup Buffer Length":
				return "average_startup_buffer_length";
			case "Average Rebuffering Buffer Length":
				return "average_rebuffering_buffer_length";
			case "Average Video Start Time":
				return "video_start_time";
			case "Average Video Restart Time":
				return "video_restart_time";
			case "Average Rendering Quality":
				return "rendering_quality";
			default:
				return "";
		}
	};
	const getExcelDownload = () => {

		const gettitle = metric ? metric : Array.isArray(favorite) && findMetricAttributeName(favorite[0]);
		const data = []

		if (metric === "video_plays_and_failures") {
			realdata?.realTimePageDataCombine?.map((aa, index) => {
				if (Object.keys(aa?.all).includes("attempts")) {
					return aa?.all.time_stamp.map((d, index) => {
						let key = Object.keys(aa?.all).filter(
							(f) => f === "attempts"
						);
						const heading = key.toString().replace(/_/g, " ");

						return data.push({
							Metrice: 'attempts',
							Timestamp: aa?.all.time_stamp[index],
							[metric]: aa?.all?.attempts[index],
							Unit: aa?.all?.unit,
						});
					})
				} else if (Object.keys(aa?.all).includes("exit_before_video_starts")) {
					return aa?.all.time_stamp.map((d, index) => {
						let key = Object.keys(aa?.all).filter(
							(f) => f === "exit_before_video_starts"
						);
						const heading = key.toString().replace(/_/g, " ");

						return data.push({
							Metrice: 'exit_before_video_starts',
							Timestamp: aa?.all.time_stamp[index],
							[metric]: aa?.all?.exit_before_video_starts[index],
							Unit: aa?.all?.unit,
						});
					})
				} else if (Object.keys(aa?.all).includes("succesful_plays")) {
					return aa?.all.time_stamp.map((d, index) => {
						let key = Object.keys(aa?.all).filter(
							(f) => f === "succesful_plays"
						);
						const heading = key.toString().replace(/_/g, " ");

						return data.push({
							Metrice: 'succesful_plays',
							Timestamp: aa?.all.time_stamp[index],
							[metric]: aa?.all?.succesful_plays[index],
							Unit: aa?.all?.unit,
						});
					})
				} else if (Object.keys(aa?.all).includes("video_start_failures")) {
					return aa?.all.time_stamp.map((d, index) => {
						let key = Object.keys(aa?.all).filter(
							(f) => f === "video_start_failures"
						);
						const heading = key.toString().replace(/_/g, " ");

						return data.push({
							Metrice: 'video_start_failures',
							Timestamp: aa?.all.time_stamp[index],
							[metric]: aa?.all?.video_start_failures[index],
							Unit: aa?.all?.unit,
						});
					})
				}
			})

		} else {
			realdata.realTimePageData.map(aa => {
				if (Object.keys(aa).includes('Android')) {
					return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
						let key = Object.keys(aa[Object.keys(aa)[0]]).filter(f => f === gettitle)
						const heading = key.toString().replace(/_/g, " ")
						return data.push({
							"Platform": Object.keys(aa)[0],
							"Timestamp": aa[Object.keys(aa)[0]].time_stamp[index],
							[heading]: aa[Object.keys(aa)[0]][key][index],
							"Unit": aa[Object.keys(aa)[0]].unit
						})
					})
				}
				else if (Object.keys(aa).includes('iOS')) {
					return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
						let key = Object.keys(aa[Object.keys(aa)[0]]).filter(f => f === gettitle)
						const heading = key.toString().replace(/_/g, " ")
						return data.push({
							"Platform": Object.keys(aa)[0],
							"Timestamp": aa[Object.keys(aa)[0]].time_stamp[index],
							[heading]: aa[Object.keys(aa)[0]][key][index],
							"Unit": aa[Object.keys(aa)[0]].unit
						})
					})
				}
				else if (Object.keys(aa).includes('Web')) {
					return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
						let key = Object.keys(aa[Object.keys(aa)[0]]).filter(f => f === gettitle)
						const heading = key.toString().replace(/_/g, " ")
						return data.push({
							"Platform": Object.keys(aa)[0],
							"Timestamp": aa[Object.keys(aa)[0]].time_stamp[index],
							[heading]: aa[Object.keys(aa)[0]][key][index],
							"Unit": aa[Object.keys(aa)[0]].unit
						})
					})
				}
				else if (Object.keys(aa).includes('tv')) {
					return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
						let key = Object.keys(aa[Object.keys(aa)[0]]).filter(f => f === gettitle)
						const heading = key.toString().replace(/_/g, " ")
						return data.push({
							"Platform": Object.keys(aa)[0],
							"Timestamp": aa[Object.keys(aa)[0]].time_stamp[index],
							[heading]: aa[Object.keys(aa)[0]][key][index],
							"Unit": aa[Object.keys(aa)[0]].unit
						})
					})
				}
				else if (Object.keys(aa).includes('Firestick')) {
					return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
						let key = Object.keys(aa[Object.keys(aa)[0]]).filter(f => f === gettitle)
						const heading = key.toString().replace(/_/g, " ")
						return data.push({
							"Platform": Object.keys(aa)[0],
							"Timestamp": aa[Object.keys(aa)[0]].time_stamp[index],
							[heading]: aa[Object.keys(aa)[0]][key][index],
							"Unit": aa[Object.keys(aa)[0]].unit
						})
					})
				} else if (Object.keys(aa).includes("AndroidSmartTv")) {
					return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
						let key = Object.keys(aa[Object.keys(aa)[0]]).filter(
							(f) => f === metric
						);
						const heading = key.toString().replace(/_/g, " ");
						return data.push({
							Platform: Object.keys(aa)[0],
							Timestamp: aa[Object.keys(aa)[0]].time_stamp[index],
							[heading]: aa[Object.keys(aa)[0]][key][index],
							Unit: aa[Object.keys(aa)[0]].unit,
						});
					});
				}
				else if (Object.keys(aa).includes('all')) {
					return aa[Object.keys(aa)[0]].time_stamp.map((d, index) => {
						let key = Object.keys(aa[Object.keys(aa)[0]]).filter(f => f === gettitle)
						const heading = key.toString().replace(/_/g, " ")
						return data.push({
							"Platform": Object.keys(aa)[0],
							"Timestamp": aa[Object.keys(aa)[0]].time_stamp[index],
							[heading]: aa[Object.keys(aa)[0]][key][index],
							"Unit": aa[Object.keys(aa)[0]].unit
						})
					})
				}
				else {
					return null
				}
			})
		}

		const fileName = createFileName(
			"csv",
			`${gettitle}-${moment().format("DD/MM/YYYY")}`
		);
		const exportType = exportFromJSON.types.csv;
		exportFromJSON({ data, fileName, exportType });
	};
	return (
		<>
			<div className='row take-screenshot'>
				<Modal isOpen={openModal} toggle={() => setModalOpen(false)} centered>
					<ModalHeader>
						<h3>Add To Favorites</h3>
					</ModalHeader>
					<ModalBody style={{ height: 450, overflowY: "scroll" }}>
						<h4 style={{ marginBottom: 10 }}>Real-Time Key Insights</h4>
						{realTimeMetric?.length > 0 &&
							realTimeMetric?.map((real, index) => {
								return (
									<MenuItem
										onClick={() => handleToggle(real)}
										style={{ width: "50%", paddingTop: 10, paddingBottom: 10 }}
										key={index}
									>
										<ListItemButton role={undefined} dense>
											<ListItemIcon>
												<Checkbox
													edge='start'
													checked={uniqueMetric.indexOf(real) !== -1}
													tabIndex={-1}
													disableRipple
													size='small'
													sx={{ minWidth: "18px" }}
												/>
											</ListItemIcon>
											<ListItemText
												className='modal-text'
												id={real}
												primary={real}
											/>
										</ListItemButton>
									</MenuItem>
								);
							})}
						<h4 style={{ marginTop: 10 }}>Quality Of Experience (QoE)</h4>
						{QualityMetric?.length > 0 &&
							QualityMetric?.map((real, index) => {
								return (
									<MenuItem
										style={{ width: "50%", paddingTop: 10, paddingBottom: 10 }}
										key={index}
									>
										<ListItemButton
											onClick={() => handleToggle(real)}
											role={undefined}
											dense
										>
											<ListItemIcon>
												<Checkbox
													edge='start'
													checked={uniqueMetric.indexOf(real) !== -1}
													tabIndex={-1}
													disableRipple
													size='small'
													sx={{ minWidth: "18px" }}
												/>
											</ListItemIcon>
											<ListItemText
												className='modal-text'
												id={real}
												primary={real}
											/>
										</ListItemButton>
									</MenuItem>
								);
							})}
						<h4 style={{ marginTop: 10 }}>User Engagement Metrics</h4>
						{userMetric?.length > 0 &&
							userMetric?.map((real, index) => {
								return (
									<MenuItem
										style={{ width: "50%", paddingTop: 10, paddingBottom: 10 }}
										key={index}
									>
										<ListItemButton
											onClick={() => handleToggle(real)}
											role={undefined}
											dense
										>
											<ListItemIcon>
												<Checkbox
													edge='start'
													checked={uniqueMetric.indexOf(real) !== -1}
													tabIndex={-1}
													disableRipple
													size='small'
													sx={{ minWidth: "18px" }}
												/>
											</ListItemIcon>
											<ListItemText
												className='modal-text'
												id={real}
												primary={real}
											/>
										</ListItemButton>
									</MenuItem>
								);
							})}
					</ModalBody>
					<ModalFooter>
						<div>
							<Button
								onClick={() => setModalOpen(false)}
								variant='contained'
								className='btn-danger text-white bg-danger'
							>
								Cancel
							</Button>
							<Button
								onClick={submit}
								variant='contained'
								color='primary'
								className='text-white bg-primary'
								style={{ marginLeft: 10 }}

							>
								Submit
							</Button>

						</div>
					</ModalFooter>
				</Modal>
				<div className='col-md-3'>
					<Paper className='SidePanel'>
						<div
							style={{
								display: "flex",
								flexDirection: "row",
								justifyContent: "space-between",
							}}
						>
							<h3 className='left-menu-title'>FAVORITE</h3>
							<p
								style={{ cursor: "pointer" }}
								onClick={() => setModalOpen(true)}
							>
								+ Add More
							</p>
						</div>
						{/* {!metricsListLoading && favorite ? ( */}
						<LeftMenu
							updateMetricHeader={updateMetricHeader}
							updateParentMetric={updateParentMetric}
							favorite={favorite}
							leftMenuMetrics={favorite}
							updateMetric={updateMetric}
						/>
						{/* ) : (
              <RctPageLoader />
            )} */}
					</Paper>
				</div>
				<div className='col-md-9 right-insight'>
					<Box sx={{ width: "100%", bgcolor: "background.paper" }}>
						<Paper>
							<div className='graphcontentHead'>
								<span
									style={{
										fontSize: "18px",
										fontWeight: 500,
										textTransform: "capitalize",
									}}
								>
									{metricHeader}
								</span>
								<Stack direction='row' spacing={1} sx={{ float: "right" }}>
									<IconButton
										color='primary'
										aria-label='screenshot'
										onClick={getImage}
									>
										<Tooltip title="Take screenshot" placement="bottom">
											<CameraAltOutlinedIcon color='disabled' />
										</Tooltip>
									</IconButton>
									<IconButton
										color='secondary'
										aria-label='download'
										onClick={getExcelDownload}
									>
										<Tooltip title="Download File" placement="bottom">
											<FileDownloadOutlinedIcon color='disabled' />
										</Tooltip>
									</IconButton>
									<IconButton aria-label='fullscreen' onClick={handle.enter}>
										<Tooltip title="Full Screen" placement="bottom">
											<FullscreenOutlinedIcon color='disabled' />
										</Tooltip>
									</IconButton>
									<Box className='dropdownCont'>
										<FormControl fullWidth className='intervalSelect'>
											<InputLabel id='intervalSelect'>Interval</InputLabel>
											<Select
												labelId='intervalSelect'
												id='demo-simple-select'
												value={refresh}
												label='Interval'
												onChange={changeRefresh}
												className='interSelect'
											>
												<MenuItem value={10}>10s</MenuItem>
												<MenuItem value={20}>20s</MenuItem>
												<MenuItem value={30}>30s</MenuItem>
												<MenuItem value={40}>40s</MenuItem>
												<MenuItem value={50}>50s</MenuItem>
											</Select>
										</FormControl>
										<FormControl fullWidth className='intervalSelect'>
											<InputLabel id='intervalSelect'>Interval</InputLabel>
											<Select
												labelId='intervalSelect'
												id='demo-simple-select'
												value={selectVal}
												label='Interval'
												onChange={setDataRange}
												className='interSelect'
											>
												<MenuItem value='5min'>5 Minute</MenuItem>
												<MenuItem value='1h'>1 Hour</MenuItem>
												<MenuItem value='1d'>Day</MenuItem>
												<MenuItem value='1w'>Week</MenuItem>
												<MenuItem value='1m'>Month</MenuItem>
												<MenuItem value='1y' disabled>Year</MenuItem>
											</Select>
										</FormControl>
										<div className='dateCont'>
											<span>Custom Date</span>
											<TextField
												onClick={() => setModalOpenCalender(true)}
												contentEditable={false}
												value={
													startDate
														? moment(startDate).format("DD/MM/YYYY")
														: ""
												}
												placeholder='dd-mm-yyyy'
											/>
											<Box sx={{ mx: 2 }}> to </Box>
											<TextField
												onClick={() => setModalOpenCalender(true)}
												contentEditable={false}
												value={
													endDate ? moment(endDate).format("DD/MM/YYYY") : ""
												}
												placeholder='dd-mm-yyyy'
											/>
										</div>
										<Modal
											isOpen={openModalCalender}
											toggle={() => setModalOpenCalender(false)}
											centered
										>
											<ModalHeader>
												<h3>Date Picker</h3>
											</ModalHeader>
											<ModalBody>
												<div
													style={{
														display: "flex",
														flexDirection: "row",
														justifyContent: "center",
													}}
												>
													<DateRange
														onChange={(item) => setRange([item.selection])}
														ranges={range}
														editableDateInputs={true}
														moveRangeOnFirstSelection={false}
														maxDate={new Date()}
													/>
												</div>
											</ModalBody>
											<ModalFooter>
												<div>
													<Button
														onClick={() => setModalOpenCalender(false)}
														variant='contained'
														className='btn-danger text-white bg-danger'
													>
														Cancel
													</Button>
													<Button
														onClick={submitCalender}
														variant='contained'
														color='primary'
														className='text-white bg-primary'
														style={{ marginLeft: 10 }}

													>
														Submit
													</Button>

												</div>
											</ModalFooter>
										</Modal>
									</Box>
									<FilterLayout
										metric={metric}
										getCdn={getCdn}
										getContentPartner={getContentPartner}
										getContentType={getContentType}
										getLocation={getLocation}
										savePlatformData={savePlatformData}
										cdnVal={cdnVal}
										contentTypeVal={contentTypeVal}
										contentPartnetVal={contentPartnetVal}
										locationVal={locationVal}
										devicePlatform={devicePlatform}
										contentPartner={contentPartner}
										contentType={contentType}
										location={location}
										updatePlatformData={updatePlatformData}
									/>
								</Stack>
							</div>
							<AppliedFilters
								attemptsData={attemptsData}
								videoStartFailuresData={videoStartFailuresData}
								exitBeforeVideoStartsData={exitBeforeVideoStartsData}
								succesfullPlaysData={succesfullPlaysData}
								startDate={startDate}
								endDate={endDate}
								metric={metric}
								removeDevicePlatform={removeDevicePlatform}
								removeContentPartner={removeContentPartner}
								removeContentType={removeContentType}
								removeLocation={removeLocation}
								devicePlatform={devicePlatform}
								updatePlatformData={updatePlatformData}
								handleReload={handleReload}
								contentPartner={contentPartner}
								contentType={contentType}
								location={location}
								selectVal={selectVal}
								androidDataPoints={
									devicePlatform?.includes("Android") ? androidDataPoints : [0]
								}
								iosDataPoints={
									devicePlatform?.includes("iOS") ? iosDataPoints : [0]
								}
								chromeDataPoints={
									devicePlatform?.includes("Web") ? chromeDataPoints : [0]
								}
								tvDataPoints={
									devicePlatform?.includes("FireTV") ? tvDataPoints : [0]
								}
								firestickDataPoints={
									devicePlatform?.includes("Firestick")
										? firestickDataPoints
										: [0]
								}
								androidDataReport={androidDataReport}
								iosDataReport={iosDataReport}
								firestickDataReport={firestickDataReport}
								webDataReport={webDataReport}
								totalDataReport={totalDataReport}
								androidSmartTvReport={AndroidSmartTvDataReport ? AndroidSmartTvDataReport : 0}
								androidSmartTvDataPoints={
									devicePlatform?.includes("AndroidSmartTv") ? AndroidSmartTvDataPoints : [0]
								}
							/>
							<FullScreen handle={handle}>
								<div className='chartCont'>
									{timeGraphDataPoints &&
										graphPointsUpdated &&
										!isLoadingData ? (
										<>
											{metric === "video_plays_and_failures" ? (
												<Line data={dataToShow} />
											) : (
												<LineChartComponent
													selectVal={selectVal}
													timeGraphPoints={timeGraphDataPoints}
													metricGraphPoints={
														metricGraphPoints ? metricGraphPoints : []
													}
													androidDataPoints={androidDataPoints}
													iosDataPoints={iosDataPoints}
													chromeDataPoints={chromeDataPoints}
													tvDataPoints={tvDataPoints}
													firestickDataPoints={firestickDataPoints}
													graphPointsUpdated={graphPointsUpdated}
													isLoadingData={isLoadingData}
													settitle={
														metric
															? metricHeader
															: Array.isArray(favorite) && favorite[0]
													}
													unit={unit}
													devicePlatform={devicePlatform}
													androidSmartTvDataPoints={AndroidSmartTvDataPoints}

												/>
											)}
										</>
									) : (
										<RctPageLoader />
									)}
								</div>
							</FullScreen>
						</Paper>
					</Box>
				</div>
			</div>
		</>
	);
}

export default Favorite;