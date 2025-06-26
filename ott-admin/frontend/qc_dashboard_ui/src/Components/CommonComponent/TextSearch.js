import TextField from '@material-ui/core/TextField';
import React, { useState, useCallback } from 'react';


const TextSearch = (inputProps, props) => {

  const { InputProps, classes, ref, onTextChange, searchLabel, ...other } = inputProps;

  const handleChange = (val) => {
    // console.log('on child',val)
    onTextChange(val);
  }


  const debounce = (func) => {
    let timer;
    return function (...args) {
      const context = this;
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        timer = null;
        func.apply(context, args);
      }, 500);
    };
  };

  const optimizedFn = useCallback(debounce(handleChange), []);

  return (
    <TextField
      fullWidth
      id="standard-basic" label={searchLabel} variant="standard"
      {...other}
      inputRef={ref}
      InputProps={{
        ...InputProps,
      }}
      value={props.textInput}
      onChange={(e) => optimizedFn(e.target.value)}
    />
  );



};

export default TextSearch;