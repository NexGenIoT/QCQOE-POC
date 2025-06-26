import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import {useEffect} from "react";


export default function DeviceIdFilter(props) {
  const { saveDeviceIdData,deviceIdData } = props;
  const [inputValue, setInputValue] = React.useState(deviceIdData);

  //console.log(saveDeviceIdData,"saveDeviceIdData()");
  useEffect(()=> {
	if(deviceIdData.length==0) {
			setInputValue('')
			//saveDeviceIdData('')
		}  // on click of clear button
},[deviceIdData])

  const searchList = (e) => {
    const keyword = e.target.value;
	setInputValue(keyword);
	saveDeviceIdData(keyword);
  };
	return (
		<Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
			<input type='text' name='Enter to filter device id' value={inputValue} onChange={searchList} className="filterSearch" placeholder='Enter to filter device id' />
			{/* <MenuList dense className="filterList">
				{checklist.map((value, index) => {
					console.log('first', checked.indexOf(value) !== -1, checked)
					const labelId = value;
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
			</MenuList> */}
		</Paper>
	);
}

const errorFilterData = [401, 400, 500, 501, 404];