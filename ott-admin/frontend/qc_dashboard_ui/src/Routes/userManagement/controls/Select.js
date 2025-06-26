import React, {useEffect} from 'react';
// import TextField from '@mui/material/TextField';
// import Autocomplete from '@mui/material/Autocomplete';
import { FormControl, InputLabel, MenuItem, Select as MuiSelect, FormHelperText, TextField, Autocomplete } from '@mui/material';


// const useStyles = makeStyles(theme => ({
//     root: {
//         margin: theme.spacing(1),
//         // width: '90%',
//         display: 'flex',
//         '& .MuiOutlinedInput-input': {
//             padding: theme.spacing(1),
//             margin: theme.spacing(0.8), color:'#424448', fontWeight:700, letterSpacing:2
//         },
//         '& .MuiInputLabel-formControl': {
//             top: -9,
//             left: 45,
//         },
//         '& .MuiInputLabel-shrink': {
//             top: -6,
//             left: 0,fontSize:'1rem !important', fontStyle:'italic', color:'#899098'
//         },
//         '& #autocomplete':{
//           margin:0, padding:'4px 4px 4px 6px'
//         }
//     }
// }));

const Select = (props) => {
    // const classes = useStyles();
    const {dataType}=props
    // const { label,valueType ,className , name, resetValue=true, optionDisabledProp=null, selectedType=`${dataType=='file_format'?'name':'sid'}`, dependentSelector=null, renderSpecificItems=null, addEnabled=false, value, isDuplicateList=false, placeholder,disabled=false, required=false, multiple=false, error=null } = props;
    const { label,valueType ,className , name, resetValue=true, optionDisabledProp=null, selectedType=`${dataType=='file_format'?'name':'sid'}`, dependentSelector=null, renderSpecificItems=null, value, isDuplicateList=false, placeholder,disabled=false, required=false, error=null } = props;
    let items = [...props.items]; //Avoid if duplicate records
    if(items && items.length > 0){
      if(isDuplicateList){
        items = items.filter((v,i,a)=>a.findIndex(v2=>(v2.name===v.name))===i)
      }
      if(dependentSelector && renderSpecificItems && renderSpecificItems.length > 0){
        items = items.filter(i => renderSpecificItems.includes(i.name));
      }
    }    



    const getSelectedValue = () => {
      
      if(value && items && items.length > 0){
        if(typeof value === 'string' || typeof value === 'number'){
            const temp = items && items.find((e) => (e[selectedType] && e[selectedType] == value)); //Array with object
            if(temp){
                return temp['name']; 
            }else{
              if(resetValue){
                props.onChange({target:{name, value: ''}})
              }
              return ''; 
          }
        }else if(Array.isArray(value)){
          
            const temp = items && items.find((e) => (e[selectedType] && value.includes(e[selectedType]))); //Array with object
            // const temp = items && items.filter((e) => (e[selectedType] && tempNum.includes(e[selectedType]))); //Array with object
            if(temp){
              return temp['name']; 
            }else{
              if(resetValue){
                props.onChange({target:{name, value: ''}})
              }
              return ''; 
          }
          
        }
      }else{
        return '';
      }

    };
    
    return <FormControl className={className} required={required} {...(error && { error: true, helperText: error})}>
    <Autocomplete
    value={getSelectedValue()}
    //multiple={multiple}
    limitTags={2}
    className="autocompleteSingle"
    
    onChange={(event, newValue) => {
      if (typeof newValue === 'string') { 
          props.onChange({target:{name, value:newValue}})
      }else if (Array.isArray(newValue)) { 
        props.onChange({target:{name, value: newValue.map(function(item) {
            return item[selectedType];
          })}})
      } else if (newValue && newValue.inputValue) {
        // Create a new value from the user input
          props.onChange({target:{name, value:newValue.inputValue}})
      } else {
        if(valueType && valueType=='Array' && newValue)
        {
          props.onChange({target:{name, value:[newValue[selectedType]]}})
        }
        else if(newValue){
          props.onChange({target:{name, value:newValue[selectedType]}})
        }else{
          props.onChange({target:{name, value: ''}})
        }
      }
    }}
    //selectOnFocus
    //clearOnBlur
    //handleHomeEndKeys
    id="autocomplete"
    options={items}
    required={required}
    disabled={disabled}
    name={name}
    getOptionLabel={(option) => {
      // Value selected with enter, right from the input
      if (typeof option === 'string') {
        return option;
      }
      // Add "xxx" option created dynamically
      if (option.inputValue) {
        return option.inputValue;
      }
      // Regular option
      return option.name;
    }}
    getOptionDisabled={(option) => {
      
        if(option["userName"]===optionDisabledProp){
          return true
        }
        else if(option["name"]===optionDisabledProp){
          return true
        }
      if(optionDisabledProp && typeof option === 'object' && option != null){
        return option[optionDisabledProp];
      }
      
    }}
    renderOption={(props, option) => <li key={option.sid} {...props}>{option.name}</li>}
    //freeSolo
    renderInput={(params) => (
      <TextField {...params} label={label} placeholder={placeholder} InputLabelProps={{ shrink: false }} />
    )}
  />
  {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>;
}

export default Select;


// import React from 'react';
// import { FormControl, InputLabel, MenuItem, Select as MuiSelect, makeStyles, FormHelperText } from '@material-ui/core';

// const useStyles = makeStyles(theme => ({
//     root: {
//         margin: theme.spacing(1),
//         // width: '90%',
//         display: 'flex',
//         '& .MuiOutlinedInput-input': {
//             padding: theme.spacing(1),
//             margin: theme.spacing(0.8), color:'#424448', fontWeight:700, letterSpacing:2
//         },
//         '& .MuiInputLabel-formControl': {
//             top: -9,
//             left: 45,
//         },
//         '& .MuiInputLabel-shrink': {
//             top: -6,
//             left: 17,fontSize:'1rem !important', fontStyle:'italic', color:'#899098'
//         }
//     }
// }));

// const Select = (props) => {
//     const classes = useStyles();
//     const { name, label, value, onChange, required=false, items, multiple=false,error=null, ...others } = props;

//     return <FormControl classes={{root: classes.root}} required={required} {...(error && { error: true, helperText: error})}>
//         <InputLabel className={others.className}>{label}</InputLabel>
//         <MuiSelect
//             label={label}
//             name={name}
//             value={value}
//             onChange={onChange}
//             required={required}
//             variant={'outlined'}
//             multiple={multiple}
//             {...others}
//         >
//             {/* <MenuItem key={0} value={0}>None</MenuItem> */}
//             {
//                 items.map(o => <MenuItem key={o.id} value={o.id}>{o.title}</MenuItem>)
//             }
//         </MuiSelect>
//         {error && <FormHelperText>{error}</FormHelperText>}
//     </FormControl>;
// }

// export default Select;