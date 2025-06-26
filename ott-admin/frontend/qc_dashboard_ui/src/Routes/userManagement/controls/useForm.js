import React, { useState } from 'react';
// import { makeStyles } from '@material-ui/core';

// const useStyles = makeStyles(theme => ({
//     root: {
//         '& .MuiFormControl-root': {
//         width: '80%',
//         margin: theme.spacing(1),
//         }
//     }
// }));

export const useForm = (initialValues, validateOnChange= false, validate) => {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});

    const handleInputChanges = e => {
        const { name, value } = e.target;
        setValues({
            ...values,
            [name]: value
        });
        if(validateOnChange) {
            validate({[name]: value});
        }
    }

    const resetForm = () => {
        setValues(initialValues);
        setErrors({});
    }

    return {
        values,
        setValues,
        errors,
        setErrors,
        handleInputChanges,
        resetForm,
    };
}

export const Form = (props) => {
    // const classes = useStyles();
    const {children, ...other} = props;
    return (
        <form autoComplete='off' {...other}>
            {children}
        </form>
    );
}