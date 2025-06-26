/**
 * Search Form Component
 */
import React, { useEffect, useState } from "react";
// import { faSearch }  from '@fortawesome/free-solid-svg-icons';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function SearchForm(props) {
 const [searchText, setSearchText] = useState(props.searchText)

 const resetSearch = ()=>{
   setSearchText(props.searchText)
 }

 useEffect(()=>{
   resetSearch()
 },[props.flag])

 const handleChange= (e)=>{
   e.preventDefault();
   setSearchText(e.target.value);
   props.handleSearch(e.target.value);

 }

  const handleSearch = (e) => {
    e.preventDefault();
    e.stopPropagation();
    props.handleSearch(searchText);
  };

  const handleKeyPress = (e) => { 
   if(e.key === 'Enter'){
     e.preventDefault();
   }
 }

  return (
    <div>
      <form action="#" className="search-form-overlay">
        <div className="search-input">
          {/* <i  className="icon-magnifier crsr-ptr"></i> */}
          {/* <FontAwesomeIcon icon={faSearch} onClick={handleSearch} className="icon-magnifier cursor-pointer mr-2" /> */}
          <input
            onChange={handleChange}
            // onKeyPress={handleKeyPress}
            type="text"
            name="input-search"
            className="input-search w-100"
            placeholder={props.placeHolderText}
            value={searchText}
          />
        </div>
      </form>
    </div>
  );
}

export default SearchForm;
