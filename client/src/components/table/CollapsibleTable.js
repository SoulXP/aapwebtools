import React from 'react';
import './CollapsibleTable.css'
import { API_RESULTS_KEYS } from '../../http/ApiClient.js'

// Memoization comparison function
function props_equal(previous, next) {
    const p_hash = previous.dataHash;
    const n_hash = next.dataHash;

    const p_value = previous.tableData;
    const n_value = next.tableData;
    
    return p_hash(p_value) === n_hash(n_value);
}

function set_width(e: React.BaseSyntheticEvent<DragEvent, EventTarget & HTMLDivElement, EventTarget>) {
    e.preventDefault();

    const sibling = e.currentTarget.previousElementSibling;
    const sibling_width = sibling.offsetWidth + 1;
}

function table_header(headers) {
    const header_data = (data) => {
        const data_seperated = [];

        for (const d of data) {
            data_seperated.push({ type: 'data',      value: d.title });
            data_seperated.push({ type: 'seperator', value: null    });
        }

        return data_seperated.map((c, i) => {
            if (c.type === 'seperator') return (<div key={i} draggable onDrag={set_width} className='ctable-header-data-sep'></div>);
            return (
                <div key={i} className='ctable-header-row-data'>{c.value}</div>
            );
        });
    };

    return (
        <div className='ctable-header'>
        {
            <div className='ctable-header-row'>
            {
                header_data(headers)
            }
            </div>
        }
        </div>
    );
}

function table_body(headers, body) {
    const body_data = (data) => {
        return data.map((c, i) => {
            const row = {};
            for (const k of headers) {
                if (k.key in c) row[k.key] = c[k.key];
            }
            return (<TableRow key={i} row={row} />);
        });
    };

    return (
        <div className='ctable-body'>
        {
            body_data(body)
        }
        </div> 
    );
}

// Row entry function
function TableRow({ row }) {
    const keys = Object.keys(row);
    
    return (
        <React.Fragment>
            <div className='ctable-body-row'>
            {
                keys.map((c, i) => {
                    return (<div key={i} className='ctable-body-row-data'>{row[c]}</div>);
                })
            }
            </div>
       </React.Fragment>
    );
}

// Main component
function CollapsibleTable({ tableData }) {
    const { headers, body } = tableData;

    return (
        <div className='ctable-container'>
        {
            table_header(headers)
        }
        {
            table_body(headers, body)
        }
        </div>
    );
}

// Memoize component
export default React.memo(CollapsibleTable, props_equal);
