import * as React from 'react';
import {useEffect} from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import MenuList from '@mui/material/MenuList';

export default function ContentCatalogueFilter(props) {

	const { listName, saveContentPartnerData, checkedItemsContentPartner } = props;
	const [checked, setChecked] = React.useState(checkedItemsContentPartner);
	const [checklist, setChecklist] = React.useState(listName);

	// FOR THE Clear Button
	console.log(checkedItemsContentPartner,"saveContentPartnerData");
	console.log(props,"listName");
	useEffect(()=> {	
		if(checkedItemsContentPartner.length==0) {
			//	alert("yes12");
				// setChecklist([])
				 setChecked([])
				//saveContentPartnerData([]);
			}  // on click of clear button
	},[checkedItemsContentPartner])

	const handleToggle = (value) => () => {
		const currentIndex = checked.indexOf(value);
		let newChecked = [...checked];
		if (currentIndex === -1) {
			newChecked.push(value);
			setChecked(newChecked);
			saveContentPartnerData(newChecked);
		} else {
			newChecked = newChecked.filter(function (x) {
				if (value === localStorage.getItem('contentPartner')) {
					localStorage.removeItem('contentPartner')
					return x !== value;
				}
				else {
					return x !== value;
				}
			});
			setChecked(newChecked);
			saveContentPartnerData(newChecked);
		}
	};
	const searchList = (e) => {
		const keyword = e.target.value;
		if (keyword !== "") {
			const results = listName.filter(a => a.toLowerCase().includes(keyword.toLowerCase()))
			setChecklist(results);
		} else {
			setChecklist(listName);
		}
	}

	return (
		<Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
			<input type='text' name='filterSearch' onKeyUp={searchList} className="abc filterSearch" placeholder='Search' />
			<MenuList dense className="filterList">
				{checklist.map((value, index) => {
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
							<ListItemText id={labelId} primary={labelId} />
						</ListItemButton>
					);
				})}
			</MenuList>
		</Paper>
	);
}
