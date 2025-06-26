import * as React from "react";
import {useEffect} from 'react';
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";

export default function ErrorFilter(props) {
  const {listName, saveErrorCodeData, checkedItemsErrorCode} = props;
  const [checked, setChecked] = React.useState(checkedItemsErrorCode?checkedItemsErrorCode:[]);
	const [checklist, setChecklist] = React.useState(listName);
  // const [enteredValue, setEnteredValue] = React.useState("");
	console.log({ listName });
	console.log({ checkedItemsErrorCode });

	useEffect(()=> {
		if(checkedItemsErrorCode.length==0) {
		setChecked([]);
        setChecklist([]);
		}  // on click of clear button
	},[checkedItemsErrorCode])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
			console.log({ newChecked })
    } else {
      newChecked.splice(currentIndex, 1);

    }
    setChecked(newChecked);
		saveErrorCodeData(newChecked);
  };

  const searchList = (e) => {
    const keyword = e.target.value;
		console.log({ listName });
    // setEnteredValue(keyword);
    if (keyword !== "") {
      const results = listName.filter((a) =>
        a.toString().toLowerCase().includes(keyword.toString().toLowerCase())
      );
      console.log("error filter",results+"--",checked);
      setChecklist(results);
    } else {
      setChecklist(listName);
    }
  };
	return (
		<Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
			<input type='text' name='filterSearch' onKeyUp={searchList} className="filterSearch" placeholder='Search' />
			<MenuList dense className="filterList">
				{checklist && checklist.map((value, index) => {
					const labelId = value;
					return (
						<ListItemButton key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} role={undefined} onClick={handleToggle(value)} dense>
							<ListItemIcon>
								<Checkbox
									edge="start"
									checked={checked?checked.indexOf(value) !== -1:-1}
									tabIndex={-1}
									disableRipple
									inputProps={{ 'aria-labelledby': labelId }}
									size="small"
									sx={{ minWidth: "18px" }}
								/>
							</ListItemIcon>
							<ListItemText id={labelId} primary={value} />
						</ListItemButton>
					);
				})}
			</MenuList>
		</Paper>
	);
}

const errorFilterData = [401, 400, 500, 501, 404];