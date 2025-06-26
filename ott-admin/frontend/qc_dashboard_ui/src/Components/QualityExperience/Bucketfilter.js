import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Checkbox from "@mui/material/Checkbox";
import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";

import { useEffect } from 'react';
import { removeDuplicates } from "Constants/constant";

const listName = ['WiFi', 'Cellular-2G', 'Cellular-3G', 'Cellular-4G', 'Cellular-5G']

export default function BucketFilter(props) {
    const { listBucketName, saveBucketData, checkedItemBucketData } = props;
    const [checked, setChecked] = React.useState(checkedItemBucketData);
    const [checklist, setChecklist] = React.useState(listBucketName);
    // const [enteredValue, setEnteredValue] = React.useState("");

    useEffect(() => {
        if (checkedItemBucketData.length == 0) {
            //	alert("checked Item Bucket Data");
            setChecked([])
            saveBucketData([]);
        }  // on click of clear button
    }, [checkedItemBucketData])

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
        saveBucketData(newChecked);
    };

    const searchList = (e) => {
        const keyword = e.target.value;
        if (keyword !== "") {
            const results = listBucketName.filter(a => a.toLowerCase().includes(keyword.toLowerCase()))
            setChecklist(results);
        } else {
            setChecklist(listBucketName);
        }
    }

    return (
        <Paper sx={{ width: "220px", margin: "0 0 15px 15px" }} elevation={3}>
            <input type='text' name='filterSearch' onKeyUp={searchList} className="abc filterSearch" placeholder='Search' />
            <MenuList dense className="filterList">
                {checklist && checklist.map((value, index) => {
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
            </MenuList>
        </Paper>
    );
}

const errorFilterData = [401, 400, 500, 501, 404];