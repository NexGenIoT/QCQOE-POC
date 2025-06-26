import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { visuallyHidden } from '@mui/utils';
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { createFileName } from "use-react-screenshot";
import domtoimage from "dom-to-image";
import exportFromJSON from "export-from-json";
import moment from "moment";
import MUIDataTable from 'mui-datatables';
function createData(partnerName, playbility, reachability, urlGenerationFailed) {
    return {
        partnerName: partnerName ? partnerName : "-",
        playbility: playbility ? playbility : "-",
        reachability: reachability ? reachability : "-",
        urlGenerationFailed: urlGenerationFailed ? urlGenerationFailed : "-"
    };
}

var rows = [];


// function descendingComparator(a, b, orderBy) {
//     if (b[orderBy] < a[orderBy]) {
//         return -1;
//     }
//     if (b[orderBy] > a[orderBy]) {
//         return 1;
//     }
//     return 0;
// }

// function getComparator(order, orderBy) {
//     return order === 'desc'
//         ? (a, b) => descendingComparator(a, b, orderBy)
//         : (a, b) => -descendingComparator(a, b, orderBy);
// }
// function stableSort(array, comparator) {
//     const stabilizedThis = array.map((el, index) => [el, index]);
//     stabilizedThis.sort((a, b) => {
//         const order = comparator(a[0], b[0]);
//         if (order !== 0) {
//             return order;
//         }
//         return a[1] - b[1];
//     });
//     return stabilizedThis.map((el) => el[0]);
// }

// const headCells = [
//     {
//         id: "partnerName",
//         numeric: false,
//         disablePadding: true,
//         label: 'Partner',
//     },
//     {
//         id: "Playability",
//         numeric: false,
//         disablePadding: true,
//         label: 'Playability',
//     },
//     {
//         id: "Reachability",
//         numeric: true,
//         disablePadding: false,
//         label: 'Reachability',
//     },
//     {
//         id: "UrlGenerationFailed",
//         numeric: true,
//         disablePadding: false,
//         label: 'UrlGenerationFailed',
//     },

// ];

// function EnhancedTableHead(props) {
//     const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
//         props;
//     const createSortHandler = (property) => (event) => {
//         onRequestSort(event, property);
//     };

//     return (
//         <TableHead>
//             <TableRow>
//                 {headCells.map((headCell) => (
//                     <TableCell
//                         key={headCell.id}
//                         align={headCell.numeric ? 'right' : 'left'}
//                         padding={headCell.disablePadding ? '10px' : '10px'}
//                         sortDirection={orderBy === headCell.id ? order : false}
//                     >
//                         <TableSortLabel
//                             active={orderBy === headCell.id}
//                             direction={orderBy === headCell.id ? order : 'asc'}
//                             onClick={createSortHandler(headCell.id)}
//                         >
//                             {headCell.label}
//                             {orderBy === headCell.id ? (
//                                 <Box component="span" sx={visuallyHidden}>
//                                     {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
//                                 </Box>
//                             ) : null}
//                         </TableSortLabel>
//                     </TableCell>
//                 ))}
//             </TableRow>
//         </TableHead>
//     );
// }

// EnhancedTableHead.propTypes = {
//     numSelected: PropTypes.number.isRequired,
//     onRequestSort: PropTypes.func.isRequired,
//     onSelectAllClick: PropTypes.func.isRequired,
//     order: PropTypes.oneOf(['asc', 'desc']).isRequired,
//     orderBy: PropTypes.string.isRequired,
//     rowCount: PropTypes.number.isRequired,
// };

// function EnhancedTableToolbar(props) {
//     console.log("EnhancedTableToolbar abcd-",props);
//     const { numSelected } = props;
     
//     const getExcelDownload = () => {
//         const data = [];
//         const fileName = createFileName(
//           "csv",
//           `by_content_partner-${moment().format("DD/MM/YYYY")}`
//         );
//         const exportType = exportFromJSON.types.csv;
//         if(rows.length>0){
//             exportFromJSON({ data: rows, fileName, exportType });
//         }
        
//       };

//    const  getImgFromProps= () =>{
//        props.getImageFn()
//     }
//     return (
//         <Toolbar
//         >
//             {
//                 <Typography
//                     sx={{ flex: '1 1 100%' }}
//                     variant="h6"
//                     id="tableTitle"
//                     component="div"
//                 >
//                     Total ({numSelected})
//                 </Typography>
//             }
//             <Tooltip title="Download">
//                 <IconButton
//                     color='secondary'
//                     aria-label='download'
//                     onClick={getExcelDownload}
//                 >
//                     <FileDownloadOutlinedIcon color='disabled' />
//                 </IconButton>
//             </Tooltip>
//             <Tooltip title="Take screenshot">
//             <IconButton
//                     color='primary'
//                     aria-label='screenshot'
//                     onClick={getImgFromProps}
//                   >
//                     <CameraAltOutlinedIcon color='disabled' />
//                   </IconButton>
//             </Tooltip>

//         </Toolbar>
//     );
// }

// EnhancedTableToolbar.propTypes = {
//     numSelected: PropTypes.number.isRequired,
// };

export default function EnhancedTable(props) {
    const data = useSelector(state => state.overviewReducer);

    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState('calories');
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

    var partnerArray = []
    var columnsData = [
        {
            label: "Partner Name",
            name: "partnerName",
            // options: {
            //   sort: true
            // }
          },
          {
            label: "Playability Fail",
            name: "playbility",
            // options: {
            //   sort: true
            // }
          },
          {
            label: "Reachability Fail",
            name: "reachability",
            // options: {
            //   sort: true
            // }
          },
          {
            label: "UrlGeneration Fail",
            name: "urlGenerationFailed",
            // options: {
            //   sort: true
            // }
          }

      ];
      const options = {
        count: rows.length,
        pagination: true,
        selectableRows: false,
        rowsPerPageOptions: [10, 50, 100],
        filter: false,
        search: false
      }

    // useEffect(() => {
        if (props?.data?.data) {
            props?.data?.data.pop()    
            props?.data?.data.map(element => {
                const entries = Object.entries(element.partners);
                for (const [partner, count] of entries) {
                    let obj = {
                        type:element.issueType,
                        id: partner,
                        count: count
                    }
                    partnerArray.push(obj)
    
                }
            })
        }
        rows = Array.from(new Set(partnerArray.map(s => s.id)))
            .map(lab => {
                  let partnerobjArry=["-","-","-"]               
                let obj1 = {
                    label: lab,
                    data: partnerArray.filter(s => s.id === lab).map(edition =>{
                        if(edition.type=="Playability"){
                            partnerobjArry[0]=edition.count
                        }else if(edition.type=="Reachability"){
                            partnerobjArry[1]=edition.count
                        }else if(edition.type=="UrlGenerationFailed"){
                            partnerobjArry[2]=edition.count

                        }   
                       return partnerobjArry
                    }),
                    type:partnerArray.filter(s => s.id === lab).map(edition => edition.type)
                }
                partnerobjArry=["-","-","-"] //clear after every provider set
                return createData(obj1.label, ...obj1.data[0])
            }).sort((a, b) => a.partnerName.localeCompare(b.partnerName))
 
    //  }, [props?.data?.data,data.partnerGraph])
    const getImage = () => {
        var node = document.querySelector(".take-screenshot");
        var options = {
          quality: 1,
          bgcolor: "#ffffff",
        };
        domtoimage
          .toPng(node, options)
          .then(function (dataUrl) {
            const a = document.createElement("a");
            a.href = dataUrl;
            a.download = createFileName(
              "png",
              `by-content-partner-${moment().format("DD/MM/YYYY")}`
            );
            a.click();
          })
          .catch(function (error) {
            console.error("oops, something went wrong!", error);
          });
      };

    return (
        // <Box sx={{ width: '100%' }} >
            <Paper style={{marginTop:"50px"}}>
                {/* <EnhancedTableToolbar numSelected={rows.length} getImageFn={getImage} />
               <TableContainer className='take-screenshot'>
                    <Table
                        sx={{ minWidth: 750 }}
                        aria-labelledby="tableTitle"
                        // size={dense ? 'small' : 'medium'}
                    >
                        <EnhancedTableHead
                            numSelected={rows.length}
                            order={order}
                            orderBy={orderBy}
                            rowCount={rows.length}
                        />
                        <TableBody>
                            {
                             stableSort(rows, getComparator(order, orderBy))
                                 .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    return (
                                        <TableRow
                                            hover
                                            key={row.partnerName}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                                padding="10px"
                                            >
                                                {row.partnerName}
                                            </TableCell>

                                            <TableCell
                                                component="th"
                                                scope="row"
                                                padding="10px"
                                            >
                                                {row.playbility}
                                            </TableCell>
                                            <TableCell align="right">{row.reachability}</TableCell>
                                            <TableCell align="right">{row.urlGenerationFailed}</TableCell>

                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 20, 50]}
                    component="div"
                    count={rows.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}
                   <MUIDataTable
                title={`Total Records ${rows.length ?? 0}`}
                columns={columnsData}
                data={rows}
                options={options}
              />
            </Paper>
        // </Box>
    );
}