import React from "react";
import { TextField } from "@mui/material";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     margin: theme.spacing(1),
//     width: "96%",
//     display: "flex",
//     "& .MuiOutlinedInput-input": {
//       padding: theme.spacing(1),
//       margin: theme.spacing(0.8),
//       color: "#424448",
//       fontWeight: 700,
//       letterSpacing: 2,
//     },
//     "& .MuiInputLabel-formControl": {
//       top: -6,
//     },
//     "& .MuiInputLabel-shrink": {
//       top: 0,
//       fontSize: "1rem !important",
//       fontStyle: "italic",
//       color: "#899098",
//     },
//   },
// }));

const Input = (props) => {
  // const classes = useStyles();
  const {
    name,
    className,
    label,
    type = "text",
    value,
    onChange,
    defaultValue,
    inputProps = { maxLength: 255 },
    placeholder,
    required = false,
    autoComplete = "off",
    error,
    ...other
  } = props;
  return (
    <TextField
      name={name}
      className={className}
      // classes={{ root: classes.root }}
      type={type}
      label={label}
      placeholder={placeholder}
      required={required}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      variant={"outlined"}
      autoComplete={autoComplete}
      inputProps={inputProps}
      {...(error && { error: true, helperText: error })}
      {...other}
    />
  );
};

export default Input;
