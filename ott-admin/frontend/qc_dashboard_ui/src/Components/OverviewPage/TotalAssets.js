import SearchForm from "Components/SearchForm/SearchForm";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTabValue } from "Store/Actions";

const TotalAssets = (props) => {
  const finalData = useSelector(state => state.overviewReducer);
  //const [totalQoeCount, setTotalQoeCount] = useState(0);

  const dispatch = useDispatch();
  const setText = (text) => {
    props.setText(text)
  }

//  const getLastString = (text)=>{
//      let strarray = text.split('-')
//     return  strarray[strarray.length-1].toLowerCase() 
//   }
  // useEffect(()=>{
  //   console.log("abcd--",props);

  //   let tempCount=0;
  //   if(finalData?.analysisCounts){
      
  //     for (let index = 0; index < Object.keys(finalData?.analysisCounts).length; index++) {
  //       if( finalData.imageInfo.toLowerCase() == getLastString(Object.keys(finalData?.analysisCounts)[index])){
  //         tempCount = parseInt(finalData?.analysisCounts[Object.keys(finalData?.analysisCounts)[index]])
  //         setTotalQoeCount(tempCount)
  //         return;
  //       }else{
  //         tempCount  =tempCount + parseInt(finalData?.analysisCounts[Object.keys(finalData?.analysisCounts)[index]])
  //         setTotalQoeCount(tempCount)
  //       }

  //     }
  //   }
   

  // },[finalData?.analysisCounts,finalData.imageInfo])
  const clickonViewDetails = () => {
    localStorage.setItem("overview", 1)
    localStorage.setItem('btnType', props.time)
    dispatch(setTabValue(1))
  }

  const getFailData = () => {
    const fail = finalData?.connectedData?.status?.find(s => s.status === 'Fail')
    if (fail) {
      return fail.count
    }
    else {
      return 0
    }
  }
  const getPassData = () => {
    const pass = finalData?.connectedData?.status?.find(s => s.status === 'Pass')
    if (pass) {
      return pass.count
    }
    else {
      return 0
    }
  }
  const getInProgressData = () => {
    const inProgress = finalData?.connectedData?.status?.find(s => s.status === 'In-Progress')
    if (inProgress) {
      return inProgress.count
    }
    else {
      return 0
    }
  }
  const getPendingData = () => {
    const pending = finalData?.connectedData?.status?.find(s => s.status === 'Pending')
    if (pending) {
      return pending.count
    }
    else {
      return 0
    }
  }
  const getTotalAssetsCount = () => {
    let count = 0
    if(finalData?.connectedData?.partners?.length > 0){
      finalData?.connectedData?.partners?.map((p)=>{
        return count = count + p.count
      })
      return count
    }
    else{
      return 0
    }
  }
  const getVerifyData= () => {//Unpublished
   
    const verify = finalData?.connectedData?.status?.find(s => s.status === 'Unpublished')
    if (verify) {
      return verify.count
    }
    else {
      return 0
    }
  }
  return (
    <>
      <div className="total-assets">
        {
          props.filter && props.extra && (
            <div className="auto-search">
              <i className="zmdi zmdi-search"></i>
              <SearchForm textInput={props.textInput} setText={setText} time={props.time} />
            </div>
          )
        }
        <p>
          Total Assets : {props.filter ? props?.data?.total ? props?.data?.total : 0 : getTotalAssetsCount()}
          {props.filter && props.extra && <span style={{ cursor: 'pointer', paddingLeft: 10, color: '#E10092' }} onClick={clickonViewDetails}> View Details  <i className="zmdi zmdi-chevron-right"></i></span>}
        </p>
        <table>
          <tbody>
            {
              props.filter ? (
                <>
                  <tr>
                    <th>New</th>
                    {props.extra && <th>Re-try</th>}
                    {/* <th>Analysis Counts</th>
                    <th></th> */}
                  </tr>
                  <tr>
                    <td>
                      <b className="pass"> </b> Pass : {props?.data?.data?.New?.Pass ? props?.data?.data?.New?.Pass : 0}
                    </td>
                    {
                      props.extra && (
                        <td>
                          {" "}
                          <b className="pass"> </b>Pass : {props?.data?.data?.['Re-Try']?.Pass ? props?.data?.data?.['Re-Try']?.Pass : 0}
                        </td>
                      )
                    }
                    
                  {/* {
                      finalData?.analysisCounts && (
                       <>
                        <td>
                        <b className="pass"> </b>Curiosity : {finalData?.analysisCounts['qc-analyse-asset-curiosity']}
                      </td>
                      <td>
                        <b className="pass"> </b>Docubay : {finalData?.analysisCounts['qc-analyse-asset-docubay']}
                      </td>
                      </>
                      )
                  } */}
                        
                  </tr>
                  <tr>
                    <td>
                      <b className="unpublished"> </b>Un-Published : {props?.data?.data?.New?.Unpublished ? props?.data?.data?.New?.Unpublished : 0}
                    </td>
                    {
                      props.extra && (
                        <td>
                          <b className="unpublished"> </b>Un-Published : {props?.data?.data?.['Re-Try']?.Unpublished ? props?.data?.data?.['Re-Try']?.Unpublished : 0}
                        </td>
                      )
                    }
                    {/* {
                      finalData?.analysisCounts && (
                       <>
                        <td>
                      <b className="pass"> </b>EpiCon : {finalData?.analysisCounts['qc-analyse-asset-epicon']}
                    </td>
                    <td>
                      <b className="pass"> </b>ErosNow : {finalData?.analysisCounts['qc-analyse-asset-erosnow']}
                    </td>
                    </>
                      )
                     } */}
                  </tr>
                  <tr>
                    <td>
                      <b className="fail"> </b>Fail : {props?.data?.data?.New?.Fail ? props?.data?.data?.New?.Fail : 0}
                    </td>
                    {
                      props.extra && (
                        <td>
                          <b className="fail"> </b>Fail : {props?.data?.data?.['Re-Try']?.Fail ? props?.data?.data?.['Re-Try']?.Fail : 0}
                        </td>
                      )
                    }
                      {/* {
                      finalData?.analysisCounts && (
                       <>
                         <td>
                      <b className="pass"> </b>Hotstar : {finalData?.analysisCounts['qc-analyse-asset-hotstar']}
                    </td>
                    <td>
                      <b className="pass"> </b>Hungama : {finalData?.analysisCounts['qc-analyse-asset-hungama']}
                    </td>
                    </>
                      )} */}
                  </tr>
                
                  <tr>
                    <td>
                      {" "}
                      <p>Notify : {props?.data?.data?.New?.Notified ? props?.data?.data?.New?.Notified : 0}</p>
                    </td>
                    {
                      props.extra && (
                        <td>
                          <p> Notify : {props?.data?.data?.['Re-Try']?.Notified ? props?.data?.data?.['Re-Try']?.Notified : 0} </p>
                        </td>
                      )
                    }
                       {/* {
                      finalData?.analysisCounts && (
                       <>  
                                             <td>
                      <b className="pass"> </b>NammaFlix : {finalData?.analysisCounts['qc-analyse-asset-nammaflix']}
                    </td>
                    <td>
                      <b className="pass"> </b>Prime : {finalData?.analysisCounts['qc-analyse-asset-prime']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      <p>Not Notify : {props?.data?.data?.New?.['Non-Notified'] ? props?.data?.data?.New?.['Non-Notified'] : 0}</p>
                    </td>
                    {
                      props.extra && (
                        <td>
                          <p>Not Notify : {props?.data?.data?.['Re-Try']?.['Non-Notified'] ? props?.data?.data?.['Re-Try']?.['Non-Notified'] : 0} </p>
                        </td>
                      )
                    }
                       {/* {
                      finalData?.analysisCounts && (
                       <>
                         <td>
                      <b className="pass"> </b>Sonyliv : {finalData?.analysisCounts['qc-analyse-asset-sonyliv']}
                    </td>
                    <td>
                      <b className="pass"> </b>VootKids : {finalData?.analysisCounts['qc-analyse-asset-vootkids']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      <b className="progress"> </b>In-Progress : {props?.data?.data?.New?.['In-Progress'] ? props?.data?.data?.New?.['In-Progress'] : 0}
                    </td>
                    {
                      props.extra && (
                        <td>
                          <b className="progress"> </b>In-Progress : {props?.data?.data?.['Re-Try']?.['In-Progress'] ? props?.data?.data?.['Re-Try']?.['In-Progress'] : 0}
                        </td>
                      )
                    }
                       {/* {
                      finalData?.analysisCounts && (
                       <>
                         <td>
                      <b className="pass"> </b>Vootselect : {finalData?.analysisCounts['qc-analyse-asset-vootselect']}
                    </td>
                    <td>
                      <b className="pass"> </b>Zee5 : {finalData?.analysisCounts['qc-analyse-asset-zee5']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      <b className="pending"> </b>Pending : {props?.data?.data?.New?.Pending ? props?.data?.data?.New?.Pending : 0}
                    </td>
                    {
                      props.extra && (
                        <td>
                          <b className="pending"> </b>Pending : {props?.data?.data?.['Re-Try']?.Pending ? props?.data?.data?.['Re-Try']?.Pending : 0}
                        </td>
                      )
                    }
                       {/* {
                      finalData?.analysisCounts && (
                       <>
                      <td>
                      <b className="pass"> </b>HoiChoi : {finalData?.analysisCounts['qc-analyse-asset-hoichoi']}
                    </td>
                    <td>
                      <b className="pass"> </b>Shemaroome : {finalData?.analysisCounts['qc-analyse-asset-shemaroo']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      <b className="pendinginque"> </b>Pending-In-Queue : {props?.data?.pendingInQueue}
                    </td>
                  </tr>

                </>
              ) : (
                <>
                  <tr>
                    <th>New</th>
                    <th>Re-try</th>
                    <th>Analysis Counts</th>
                  </tr>
                  <tr>
                    <td>
                      <b className="pass"> </b> Pass : {getPassData()}
                    </td>
                    <td>
                      {" "}
                      <b className="pass"> </b>Pass : 0
                    </td>
                    {/* {
                      finalData?.analysisCounts && (
                       <>
                        <td>
                        <b className="pass"> </b>Curiosity : {finalData?.analysisCounts['qc-analyse-asset-curiosity']}
                      </td>
                      <td>
                        <b className="pass"> </b>Docubay : {finalData?.analysisCounts['qc-analyse-asset-docubay']}
                      </td>
                      </>
                      )
                  } */}
                  </tr>
                  
                  <tr>
                    <td>
                      <b className="unpublished"> </b>Un-Published : {getVerifyData()}
                    </td>
                    <td>
                      <b className="unpublished"> </b>Un-Published : 0
                    </td>
                    {/* {
                      finalData?.analysisCounts && (
                       <>
                        <td>
                      <b className="pass"> </b>EpiCon : {finalData?.analysisCounts['qc-analyse-asset-epicon']}
                    </td>
                    <td>
                      <b className="pass"> </b>ErosNow : {finalData?.analysisCounts['qc-analyse-asset-erosnow']}
                    </td>
                    </>
                      )
                     } */}
                  </tr>
                  <tr>
                    <td>
                      <b className="fail"> </b>Fail : {getFailData()}
                    </td>
                    <td>
                      <b className="fail"> </b>Fail : 0
                    </td>
                    {/* {
                      finalData?.analysisCounts && (
                       <>
                         <td>
                      <b className="pass"> </b>Hotstar : {finalData?.analysisCounts['qc-analyse-asset-hotstar']}
                    </td>
                    <td>
                      <b className="pass"> </b>Hungama : {finalData?.analysisCounts['qc-analyse-asset-hungama']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      {" "}
                      <p>Notify : 0</p>
                    </td>
                    <td>
                      <p>Notify : 0</p>
                    </td>
                    {/* {
                      finalData?.analysisCounts && (
                       <>  
                                             <td>
                      <b className="pass"> </b>NammaFlix :{finalData?.analysisCounts['qc-analyse-asset-nammaflix']}
                    </td>
                    <td>
                      <b className="pass"> </b>Prime : {finalData?.analysisCounts['qc-analyse-asset-prime']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      <p>Not Notify : 0</p>
                    </td>
                    <td>
                      <p>Not Notify : 0</p>
                    </td>
                    {/* {
                      finalData?.analysisCounts && (
                       <>
                         <td>
                      <b className="pass"> </b>Sonyliv : {finalData?.analysisCounts['qc-analyse-asset-sonyliv']}
                    </td>
                    <td>
                      <b className="pass"> </b>VootKids : {finalData?.analysisCounts['qc-analyse-asset-vootkids']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      <b className="progress"> </b>In-progress : {getInProgressData()}
                    </td>
                    <td>
                      <b className="progress"> </b>In-progress : 0
                    </td>
                    {/* {
                      finalData?.analysisCounts && (
                       <>
                         <td>
                      <b className="pass"> </b>Vootselect : {finalData?.analysisCounts['qc-analyse-asset-vootselect']}
                    </td>
                    <td>
                      <b className="pass"> </b>Zee5 : {finalData?.analysisCounts['qc-analyse-asset-zee5']}
                    </td>
                    </>
                      )} */}
                  </tr>
                  <tr>
                    <td>
                      <b className="pending"> </b>Pending : {getPendingData()}
                    </td>
                    <td>
                      <b className="pending"> </b>Pending : 0
                    </td>
                    {/* {
                      finalData?.analysisCounts && (
                       <>
                      <td>
                      <b className="pass"> </b>HoiChoi : {finalData?.analysisCounts['qc-analyse-asset-hoichoi']}
                    </td>
                    <td>
                      <b className="pass"> </b>Shemaroome : {finalData?.analysisCounts['qc-analyse-asset-shemaroo']}
                    </td>
                    </>
                      )} */}
                  </tr>
                </>
              )
            }
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TotalAssets;
