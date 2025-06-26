import React from 'react';
// import { makeStyles } from '@material-ui/core';
import { Button as MuiButton } from "reactstrap";

// const useStyles = makeStyles(theme => ({
//     root: {
//         margin: theme.spacing(1),
//         borderRadius: 2,
//     },
//     label: {
//         textTransform: 'uppercase',
//         fontFamily: 'Roboto',
//         fontSize: 14,
//         lineHeight: '11px',
//         padding: theme.spacing(1),
//     }
// }))

const Button = (props) => {
    const {text, size='large', color='primary', variant='contained', onClick, ...others} = props;
    // const classes = useStyles();
    return <MuiButton
        // classes={{root: classes.root, label: classes.label}}
        variant={variant}
        disableElevation
        size={size}
        color={color} 
        onClick={onClick}
        {...others}
    >
        {text}
    </MuiButton>
}

export default Button;