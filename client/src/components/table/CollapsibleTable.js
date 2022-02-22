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
                        if (i === 0) return (<TableCell key={i} sx={{ width: '1rem' }} component='th' scope='row'>{row[c]}</TableCell>);
                        if (i === keys.length - 1) return (<TableCell key={i} sx={{ width: '42%', fontWeight: 'bold'}} >{row[c]}</TableCell>);
                        return (<TableCell key={i} sx={{ width: '1rem' }} >{row[c]}</TableCell>);
                    })
                }
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                     <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                History
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Column 1</TableCell>
                                        <TableCell>Column 2</TableCell>
                                        <TableCell align="right">Column 3</TableCell>
                                        <TableCell align="right">Column 4</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

Row.propTypes = {
    row: PropTypes.any.isRequired,
};

export default function CollapsibleTable({ tableData, prepareDataRows }) {
    const { headers, body } = tableData;

    return (
        <TableContainer className='table-container' component={Paper}>
            <Table aria-label="collapsible table">
                <TableHead >
                    <TableRow >
                        <TableCell sx={{ width: '1rem' }}/>
                        {
                            headers.map((c, i) => {
                                if (i === headers.length - 1) return (<TableCell key={i} sx={{ width: '42%', fontWeight: 'bold'}} >{c.title}</TableCell>);
                                return (<TableCell key={i} sx={{ fontWeight: 'bold'}} >{c.title}</TableCell>);
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

