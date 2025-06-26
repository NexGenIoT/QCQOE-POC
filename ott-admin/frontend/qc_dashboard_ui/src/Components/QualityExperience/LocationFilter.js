import * as React from "react";
import {useEffect} from 'react';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MatButton from "@material-ui/core/Button";

export default function LocationFilter(props) {
  const { listName, saveLocationData, checkedItemsLocation } = props;
  const cityarray = [];
  for (var key in listName) {
    if (listName.hasOwnProperty(key)) {
      if (listName[key] != NaN) {
        var nameabcd = listName[key].toString();
        var nameed = ([] = nameabcd.split(","));
        for (let j of nameed) {
          cityarray.push(j + "(" + key + ")");
        }
      }
    }
  }
  const [checked, setChecked] = React.useState(checkedItemsLocation);
  const [checklist, setChecklist] = React.useState(checkedItemsLocation);
  const [enteredValue, setEnteredValue] = React.useState("");

  useEffect(()=> {
		if(checkedItemsLocation.length==0) {
      //alert("check");
				setChecked([]);
        setChecklist([]);
        setEnteredValue("");
			}  // on click of clear button
	},[checkedItemsLocation])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);

    }
    setChecked(newChecked);
    saveLocationData(newChecked);
    //setChecklist(newChecked)

  };

  const searchList = (e) => {
    const keyword = e.target.value;
    setEnteredValue(keyword);
    if (keyword !== "") {
      const results = cityarray.filter((a) =>
        a.toLowerCase().includes(keyword.toLowerCase())
      );
      console.log("pp",results+"--",checked);
      setChecklist(results);
    } else {
      setChecklist(checked);
    }
  };

  const handleChange = (e) => {
    console.log("from ", e.target.value);
  };
  return (
    <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
      <input
        type='text'
        name='filterSearch'
        onKeyUp={searchList}
        className='filterSearch'
        placeholder='Search'
      />
      <MenuList dense className='filterList'>
        {/* <MatButton className="apply-filter-btn" > Select All </MatButton> */}

        {checklist.length > 0
          ? checklist.map((value, index) => {
              const labelId = value;
              return (
                <ListItemButton
                  key={index}
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                  role={undefined}
                  onClick={handleToggle(value)}
                  dense
                >
                  <ListItemIcon>
                    <Checkbox
                      edge='start'
                      checked={checked.indexOf(value) !== -1}
                      tabIndex={-1}
                      disableRipple
                      inputProps={{ "aria-labelledby": labelId }}
                      size='small'
                      sx={{ minWidth: "18px" }}
                    />
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={value} />
                </ListItemButton>
              );
            })
          : enteredValue && <p>No results found</p>}
      </MenuList>
    </Paper>
  );
}
