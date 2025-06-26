/**
 * Downshift Component
 */
 import React from 'react';
 import TextField from '@material-ui/core/TextField';
 import MenuItem from '@material-ui/core/MenuItem';
 import Downshift from 'downshift';
 import { useSelector } from "react-redux";
 
 function renderInput(inputProps, props) {
   const { InputProps, classes, ref, ...other } = inputProps;
   return (
     <TextField
       {...other}
       inputRef={ref}
       InputProps={{
         ...InputProps,
       }}
       value={props.textInput}
     />
   );
 }
 
 function renderSuggestion(params) {
   const { suggestion, index, itemProps, highlightedIndex, selectedItem } = params;
   const isHighlighted = highlightedIndex === index;
   const isSelected = selectedItem === suggestion.label;
   return (
     <MenuItem
       {...itemProps}
       key={suggestion.label}
       selected={isHighlighted}
       component="div"
       style={{
         fontWeight: isSelected ? 500 : 400,
       }}
     >
       {suggestion.label}
     </MenuItem>
   );
 }
 
 function getSuggestions(inputValue, suggestions) {
   let count = 0;
   return suggestions.filter(suggestion => {
     const keep =
       (!inputValue || suggestion.label.toLowerCase().includes(inputValue.toLowerCase())) &&
       count < 5;
     if (keep) {
       count += 1;
     }
     return keep;
   });
 }
 
 export default function SearchForm(props) {
   const { classes } = props;
   const data = useSelector(state => state.overviewReducer);
   let suggestions = []
   data?.partnerInfo.length > 0 && data?.partnerInfo.map(d=>{
    return suggestions.push({
      label: d.name
    })
   })
   const clickOnSearch = () => {
     let textValue = document.querySelector('#integration-downshift').value
     props.setText(textValue)
   }
   return (
     <>
      <Downshift>
        {({ getInputProps, getItemProps, isOpen, inputValue, selectedItem, highlightedIndex }) => (
          <div>
            {renderInput({
              fullWidth: true,
              classes,
              InputProps: getInputProps({
                placeholder: 'Search for Content Partner',
                id: 'integration-downshift',
              }),
            },props)}
            {isOpen ? (
              <div>
                {getSuggestions(inputValue, suggestions).map((suggestion, index) =>
                  renderSuggestion({
                    suggestion,
                    index,
                    itemProps: getItemProps({ item: suggestion.label }),
                    highlightedIndex,
                    selectedItem,
                  }),
                )}
              </div>
            ) : null}
          </div>
        )}
      </Downshift>
      <button onClick={clickOnSearch}>Search</button>
     </>
   );
 }
 