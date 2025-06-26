import React, { useState, useEffect } from 'react'
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { getErrorCount, getErrorlocationCoordinates, getlocationConcurrentCount, getlocationCoordinates, getPlayCount } from 'Store/Actions';
import { useDispatch, useSelector } from 'react-redux';
import RctPageLoader from 'Components/RctPageLoader/RctPageLoader';
// adding comment
export default function Location(props) {

    const dispatch = useDispatch()
    const data = useSelector(state => state.qoeReducer);
    const [isLoading, setIsLoading] = useState(false)
    const [infoWindowPopup, setInfoWindowPopup] = useState(false)
    const [infoWindowCoordinate, setInfoWindowCoordinate] = useState({})
    const [coordinates, setCoordinates] = useState([])
    const [errorCoordinates, setErrorCoordinates] = useState([])
    const [playCount, setPlayCount] = useState([])
    const [errorCount, setErrorCount] = useState([])
    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "AIzaSyDrr86JFplL6E731o7y_VMe5wIoHiWvnY4" // ,
        // ...otherOptions
    })
    const image =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";
    const containerStyle = {
        width: '100%',
        height: '600px',
        marginLeft: '1rem'
    };
    const center = {
        lat: 22.9473,
        lng: 79.1923
    }
    const divStyle = {
        background: `white`,
        width: "auto",
        height: "55px"
        // border: `1px solid #ccc`,
        // padding: 15
    }
    useEffect(() => {
        const params = { "metric": "concurrent", "operation": "count" }
        const errorParams = { "metric": "error", "operation": "count" }
        const paramsConcurrent = { "metric": "concurrent", "operation": "count" }
        dispatch(getlocationCoordinates(dispatch, params))
        dispatch(getErrorlocationCoordinates(dispatch, errorParams))
       // dispatch(getPlayCount(dispatch, params))
        dispatch(getErrorCount(dispatch, errorParams))
        dispatch(getlocationConcurrentCount(dispatch, paramsConcurrent))
        const interval = setInterval(() => {
            if (window.location.href.includes('dashboard/crm/location')) {
                dispatch(getlocationCoordinates(dispatch, params))
                dispatch(getErrorlocationCoordinates(dispatch, errorParams))
                //dispatch(getPlayCount(dispatch, params))
                dispatch(getErrorCount(dispatch, errorParams))
                dispatch(getlocationConcurrentCount(dispatch, paramsConcurrent))

            } else {
                clearInterval(interval)
            }
        }, 60000);
        return () => clearInterval(interval);

     }, [])
    const mappingCounts = (countArray) => {

        //conncurrentCount
        let playCountArray = []
        const uniquePlayCount = [...new Set(countArray.map(item => item.provider))]
        uniquePlayCount.forEach(uniqueElement => {
            let partnerObj = {
                provider: '',
                ios: '-',
                android: '-',
                firetv: '-',
                firestick: '-',
                web: '-'
            }
            countArray.forEach(element => {
                if (element.provider === uniqueElement) {
                    partnerObj.provider = element.provider
                    switch (element?.platform?.toLowerCase()) {
                        case "ios":
                            partnerObj.ios = element.concurrentplays
                            break;
                        case "android":
                            partnerObj.android = element.concurrentplays
                            break;
                        case "firetv":
                            partnerObj.firetv = element.concurrentplays
                            break;
                        case "firestick":
                            partnerObj.firestick = element.concurrentplays
                            break;
                        case "web":
                            partnerObj.web = element.concurrentplays
                            break;

                        default:
                            break;
                    }
                }
            });
            playCountArray.push(partnerObj)
        });
        return playCountArray
    }
    const mappingErrorCounts = (countArray) => {
        let playCountArray = []
        const uniquePlayCount = [...new Set(countArray.map(item => item.provider))]
        uniquePlayCount.forEach(uniqueElement => {
            let partnerObj = {
                provider: '',
                ios: '-',
                android: '-',
                firetv: '-',
                firestick: '-',
                web: '-'
            }
            countArray.forEach(element => {
                if (element.provider === uniqueElement) {
                    partnerObj.provider = element.provider
                    switch (element?.platform?.toLowerCase()) {
                        case "ios":
                            partnerObj.ios = element.count
                            break;
                        case "android":
                            partnerObj.android = element.count
                            break;
                        case "firetv":
                            partnerObj.firetv = element.count
                            break;
                        case "firestick":
                            partnerObj.firestick = element.count
                            break;
                        case "web":
                            partnerObj.web = element.count
                            break;

                        default:
                            break;
                    }
                }
            });
            playCountArray.push(partnerObj)
        });
        return playCountArray
    }
    useEffect(async () => {
        console.log("location--");
        if (data?.locationCoordinates?.data) {
            setIsLoading(false)
            const getCoordinatesArray = data?.locationCoordinates?.data;
            let coordinatesArray = []
            getCoordinatesArray.forEach(element => {
                let coordinatesObj = {
                    lat: element.latitude,
                    lng: element.longitude,
                    city: element.city,
                    count: element.count
                }
                coordinatesArray.push(coordinatesObj)
            });
            setCoordinates(coordinatesArray)
        }
        if (data?.errorLocationCoordinates?.data) {
            setIsLoading(false)
            const getErrorCoordinatesArray = data?.errorLocationCoordinates?.data;
            let errorCoordinatesArray = []
            getErrorCoordinatesArray.forEach(element => {
                let errorCoordinatesObj = {
                    lat: element.latitude,
                    lng: element.longitude,
                    city: element.city,
                    count: element.count
                }
                errorCoordinatesArray.push(errorCoordinatesObj)
            });
            setErrorCoordinates(errorCoordinatesArray)
        }
        if (data?.conncurrentCount?.length > 0) {
            setIsLoading(false)
            const countArray = await mappingCounts(data?.conncurrentCount)
            setPlayCount(countArray)
        }else{
            setPlayCount([])  
        }
        if (data?.errorCount?.length > 0) {
            setIsLoading(false)
            const countArray = await mappingErrorCounts(data?.errorCount)
            setErrorCount(countArray)
        }else{
            setErrorCount([])
        }

    }, [data?.locationCoordinates?.data, data?.errorLocationCoordinates?.data, data?.conncurrentCount, data?.errorCount])

    const mouseOver = (coordinate) => {
        setInfoWindowCoordinate(coordinate)
        setInfoWindowPopup(true)
    }
    const mouseOut = () => {
        setInfoWindowPopup(false)
        setInfoWindowCoordinate({})
    }
    if (!isLoaded) return <div>Loading...</div>
    if (isLoading) return <div style={{ height: 'calc(100vh - 170px)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><RctPageLoader /></div>
    else
        return (
            <>
                <div className='map'>
                    <h1>Location</h1>
                    {/* <div className="top-left-nav">
                        <ul>
                            <li className="active-tracker">CONCURRENCY (320) </li>
                            <li>PLAYBACK FAILURE (540)</li>
                        </ul>
                    </div> */}
                    <div className='detail-map'>
                        <div className='row'>
                            <div className='col-md-7 col-xl-7 location'>
                                <div  className='bliper countTable' style={{marginLeft:"12px"}}>
                                <div>Concurrent Count <br/> <span className='concurrentDotMarker'></span></div>
                                <div style={{marginLeft:"10px"}}>Error Count<br/><span className='ssoDotMarker'></span></div>
                                </div>
                               
                                <GoogleMap
                                    mapContainerStyle={containerStyle}
                                    center={center}
                                    zoom={5}
                                    maxZoom={5}
                                >
                                   {coordinates?.length > 0 && coordinates.map((coordinate) => {
                                        return (
                                            <Marker position={coordinate}
                                                icon={"http://maps.google.com/mapfiles/ms/icons/pink-dot.png"}

                                                onMouseOver={e => mouseOver(coordinate)} onClick={e => mouseOut(coordinate)} />
                                        )
                                    })}

                                    {errorCoordinates?.length > 0 && errorCoordinates.map((coordinate) => {
                                        return (
                                            <Marker position={coordinate} onMouseOver={e => mouseOver(coordinate)} onClick={e => mouseOut(coordinate)} />
                                        )
                                    })}
                                    {infoWindowPopup && <InfoWindow position={infoWindowCoordinate} >
                                        <div style={divStyle}>
                                        <p>{infoWindowCoordinate.city}</p>
                                            <h1>{infoWindowCoordinate.count}</h1>
                                        </div>
                                    </InfoWindow>
                                    }
                            </GoogleMap>
                            </div>
                            <div className=' countTable' style={{"margin-top": "24px"}}>
                                <div className=' playCountTable'>

                                    <table className="table table-sm playTable" cellPadding="0" cellSpacing="0">
                                        <thead>
                                            <tr className='playCountMainHeader'>
                                                <td colSpan="6">
                                                CONCURRENT COUNT
                                                </td>
                                            </tr>
                                            <tr className='playCountHeader'>
                                                <th>Partner</th>
                                                <th>IOS</th>
                                                <th>Android</th>
                                                <th>AndroidSmartTv</th>
                                                <th>FireStick</th>
                                                <th>Web</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {playCount?.length > 0 && playCount.map((play, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className='playCountSideHeader'>{play?.provider}</td>
                                                        <td>{play?.ios}</td>
                                                        <td>{play?.android}</td>
                                                        <td>{play?.AndroidSmartTv}</td>
                                                        <td>{play?.firestick}</td>
                                                        <td>{play?.web}</td>
                                                    </tr>
                                                )
                                            }
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                                <div className=' errorCountTable'>
                                    <table className="table table-sm errorTable">
                                        <thead>
                                            <tr className='errorCountMainHeader'>
                                                <td colSpan="6">
                                                    ERROR COUNT
                                                </td>
                                            </tr>
                                            <tr className='errorCountHeader'>
                                                <th>Partner</th>
                                                <th>IOS</th>
                                                <th>Android</th>
                                                <th>AndroidSmartTv</th>
                                                <th>FireStick</th>
                                                <th>Web</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {errorCount?.length > 0 && errorCount.map((error, index) => {
                                                return (
                                                    <tr key={index}>
                                                        <td className='errorCountSideHeader'>{error.provider}</td>
                                                        <td>{error?.ios}</td>
                                                        <td>{error?.android}</td>
                                                        <td>{error?.AndroidSmartTv}</td>
                                                        <td>{error?.firestick}</td>
                                                        <td>{error?.web}</td>
                                                    </tr>
                                                )
                                            }
                                            )}

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
}