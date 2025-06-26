import React from 'react'
import { TableCell, TableRow,IconButton } from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import AccessControlRowSummary from '../AccessControl/AccessControlSummary';
export default function Row(props) {
	const { row, ...rest } = props;
  const showRowSummary = true;
  const [open, setOpen] = React.useState(false);
	return (
		<>
			<TableRow>
				{props.columns.map((col) => {
					return (
						<TableCell key={col.field} style={{ paddingLeft: '10px', paddingRight: 0, whiteSpace: 'nowrap' }}>
							<div className="font-resolution">
								{col.renderCell != undefined
									? col.renderCell(col.row ? row : row[col.field])
									: row[col.field]}
							</div>

						</TableCell>
					);
				})}
				{props.module === 'rolesList' ? <TableCell style={{ paddingLeft: 0, paddingTop: 8, paddingBottom: 8 }}>
					<IconButton
						aria-label="expand row"
						size="small"
						onClick={() => setOpen(!open)}
					>
						{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
					</IconButton>
				</TableCell> : <TableCell></TableCell>}
			</TableRow>
			{
				showRowSummary && (props.module === 'rolesList') && <AccessControlRowSummary row={row} columns={props.columns} open={open} {...rest} />
			}
			{
            //   (props.module === 'controlAction') && <ControlRequestSummary row={row} columns={props.columns} open={open} {...rest} />
            }
		</>
	)
}
