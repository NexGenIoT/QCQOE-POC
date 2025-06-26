import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import {useEffect} from "react";

export default function VideoIdFilter(props) {
  const { saveVideoIdData,videoIdData} = props;
  const [inputValue, setInputValue] = React.useState(videoIdData);
  const searchList = (e) => {
    const keyword = e.target.value;
	setInputValue(keyword);
	saveVideoIdData(keyword);
  };

  useEffect(()=> {
	if( videoIdData.length==0) {
		setInputValue('')
		//saveVideoIdData('')
		}  // on click of clear button
},[videoIdData])

	return (
		<Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
			<input type='text' name='Enter video id to filter' onChange={searchList} value={inputValue} className="filterSearch" placeholder='Enter Video id to filter' />
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