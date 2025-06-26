import {makeStyles } from '@material-ui/core'
import React,{useState} from 'react'
import ReactPlayer from 'react-player'  

const LogDetailVideoPlayer = (props) => { 
    const [state, setState] = useState({
        playing :true,
        controls :true
    })
 const {playing} = state   
    const useStyle = makeStyles(theme => ({
        root: {
            position: 'relative',
            paddingTop: '56.25% ',/* Player ratio: 100 / (1280 / 720) */
            textAlign: 'center',
            //marginLeft:'26%'
        },
        reactPlayer: {
            position: 'absolute',
            top: '0',
            left: '0'
        },
        reactbox: {
            width: '80px',
            height: '80px',
            background: '#878282',
            borderRadius: '3px',
        },
        controlsWrapper:{
            position:'absolute',
            top:0,
            left:0,
            right:0,
            bottom:0,
            background:"rgba(0,0,0,0.6)",
            display:"flex",
            flexDirection:"column",
            justifyContent:"space-between",
            zIndex:1


        }
    }));

    return (
        <div>
            <div className={useStyle.reactPlayer} >
                <ReactPlayer
                    className={useStyle.reactPlayer} 
                    url= {props.data}
                    width='100%'
                    height='100%'
                    controls
                    playing={playing}
                /> 
            </div> 
        </div>
    )
}
export default LogDetailVideoPlayer;