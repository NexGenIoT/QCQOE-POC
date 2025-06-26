import * as React from "react";
import { useEffect } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
const listName = ['Yes', 'No'];
export default function LiveFilter(props) {
  const { checkedItemLiveData, saveLiveData } = props;
  const [checked, setChecked] = React.useState(checkedItemLiveData);
  const [checklist, setChecklist] = React.useState(listName);
  // const [enteredValue, setEnteredValue] = React.useState("");

	// on click of clear button
	useEffect(()=> {
		if(checkedItemLiveData.length==0) {
			//	alert("checkedItemLiveData");

				setChecked([])
			}  
	},[checkedItemLiveData])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);

    }
    setChecked(newChecked);
	saveLiveData(newChecked);
  };

	return (
		<Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
			{/* <input type='text' name='filterSearch' onKeyUp={searchList} className="filterSearch" placeholder='Search' /> */}
			<MenuList dense className="filterList">
				{checklist.map((value, index) => {
					const labelId = value
					return (
						<ListItemButton key={index} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }} role={undefined} onClick={handleToggle(value)} dense>
							<ListItemIcon>
								<Checkbox
									edge="start"
									checked={checked.indexOf(value) !== -1}
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