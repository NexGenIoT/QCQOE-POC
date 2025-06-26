import { Grid, makeStyles } from '@material-ui/core'
import React from 'react'
import ReactPlayer from 'react-player'

const VideoPlayer = () => {

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
        }
    }));

    return (
        <div>
            <div className={useStyle.reactPlayer} style={{ marginLeft: '23%' }}>
                <ReactPlayer
                    className={useStyle.reactPlayer}
                    url='https://www.youtube.com/watch?v=ysz5S6PUM-U'
                    width='62%'
                    height='200px'
                />
                <div style={{ textAlign: 'start', marginTop: '10px' }}>
                    <h2>Video Freeze</h2>

                    <span>Start Time 1:30:45</span>  &nbsp;  &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;  <span>End Time 1:30:45</span>
                </div>
            </div>
            <h2 style={{ marginTop: '30px' }}>Black Screen</h2>
            <Grid container spacing={2} style={{ marginTop: '10px' }}>
                <Grid item xs={2}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#878282',
                        borderRadius: '3px',
                    }}>

                    </div>
                    <div style={{ paddingLeft: '15px' }}>
                        <span>1:30:45</span>
                    </div>

                </Grid>
                <Grid item xs={2}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#878282',
                        borderRadius: '3px',
                    }}>

                    </div>
                    <div style={{ paddingLeft: '15px' }}>
                        <span>1:30:45</span>
                    </div>

                </Grid>
                <Grid item xs={2}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#878282',
                        borderRadius: '3px',
                    }}>

                    </div>
                    <div style={{ paddingLeft: '15px' }}>
                        <span>1:30:45</span>
                    </div>

                </Grid>
                <Grid item xs={2}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#878282',
                        borderRadius: '3px',
                    }}>

                    </div>
                    <div style={{ paddingLeft: '15px' }}>
                        <span>1:30:45</span>
                    </div>

                </Grid>
                <Grid item xs={2}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#878282',
                        borderRadius: '3px',
                    }}>

                    </div>
                    <div style={{ paddingLeft: '15px' }}>
                        <span>1:30:45</span>
                    </div>
                </Grid>
                <Grid item xs={2}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        background: '#878282',
                        borderRadius: '3px',
                    }}>

                    </div>
                    <div style={{ paddingLeft: '15px' }}>
                        <span>1:30:45</span>
                    </div>
                </Grid>
            </Grid>
        </div>
    )
}
export default VideoPlayer;