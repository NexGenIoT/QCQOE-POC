import { Checkbox as MuiCheckbox, FormControl, FormControlLabel, makeStyles } from '@mui/material';
import React from 'react';

// const useStyles = makeStyles(theme => ({
//     root: {
//         margin: theme.spacing(1),
//         // width: '100%',
//         display: 'flex',
//         '& .MuiOutlinedInput-input': {
//             padding: theme.spacing(1),
//             margin: theme.spacing(0),
//         },
//     }
// }));

const Checkbox = (props) => {
    // const classes = useStyles();
    const { name, label, value, onChange, required=false, defaultValue = false } = props;

    const convertToDefEventParam = (name, value) => ({
        target: {
            name, value
        }
    });

    return <FormControl >
        <FormControlLabel className={props.className}
            control={<MuiCheckbox
                name={name}
                checked={value}
                onChange={e => onChange(convertToDefEventParam(name, e.target.checked))}
                required={required}
                defaultValue={defaultValue}
                checked={props.checked}
            />}
            label={label}
        />
    </FormControl>;
}

export default Checkbox;