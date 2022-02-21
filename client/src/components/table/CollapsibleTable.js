import React, { useRef, useState } from 'react';
import './CollapsibleTable.css'
import PropTypes from 'prop-types';
import { API_RESULTS_KEYS } from '../../http/ApiClient.js'
import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

function Row({ row }) {
    const [open, setOpen] = useState(false);
    const keys = Object.keys(row);
    
    return (
        <React.Fragment>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell>
                    <IconButton
                        aria-label="expand row"
                        size="small"
                        onClick={() => setOpen(!open)}
                    >
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                    </IconButton>
                </TableCell>
                {
                    keys.map((c, i) => {
                        if (i === 0) return (<TableCell key={i} component='th' scope='row'>{row[c]}</TableCell>);
                        return (<TableCell key={i}>{row[c]}</TableCell>);
                    })
                }
            </TableRow>
            {/*<TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Customer</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                        <TableCell align="right">Total price ($)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {
                                    row.history.map((historyRow) => {
                                        <TableRow key={historyRow.date}>
                                            <TableCell component="th" scope="row">
                                                {historyRow.date}
                                            </TableCell>
                                            <TableCell>{historyRow.customerId}</TableCell>
                                            <TableCell align="right">{historyRow.amount}</TableCell>
                                            <TableCell align="right">
                                                {Math.round(historyRow.amount * row.price * 100) / 100}
                                            </TableCell>
                                        </TableRow>
                                    })
                                }
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>*/}
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.any.isRequired,
};

export default function CollapsibleTable({ tableData, prepareDataRows }) {
    const { headers, body } = tableData;

    return (
        <TableContainer component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead>
                    <TableRow>
                        <TableCell />
                        {
                            headers.map((c, i) => {
                                return (<TableCell key={i}>{c.title}</TableCell>);
                            })
                        }
                    </TableRow>
                </TableHead>
                <TableBody>
                {
                    body.map((c, i) => {
                        const row = {};
                        for (const k of headers) {
                            if (k.key in c) row[k.key] = c[k.key];
                        }
                        return (<Row key={i} row={row}/>);
                    })
                }
                </TableBody>
            </Table>
        </TableContainer>
    );
}

