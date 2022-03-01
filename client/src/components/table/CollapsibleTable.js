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

// Row entry function
function Row({ row }) {
    const keys = Object.keys(row);
    
    return (
        <React.Fragment>
            <tr className='table-body-row'>
            {
                keys.map((c, i) => {
                    const class_name = 'table-body-row-data'
                    if (i === 0) return (<td key={i} className={class_name}>{row[c]}</td>);
                    if (i === keys.length - 1) return (<td key={i} className={class_name}>{row[c]}</td>);
                    return (<td key={i} className={class_name}>{row[c]}</td>);
                })
            }
            </tr>
       </React.Fragment>
    );
}

// Main component
function CollapsibleTable({ tableData, prepareDataRows }) {
    const { headers, body } = tableData;

    return (
        <div className='table-container'>
            <table className='table-fill-screen'>
                <thead>
                    <tr>
                    {
                        headers.map((c, i) => {
                            if (i === headers.length - 1) return (<td key={i}>{c.title}</td>);
                            return (<td key={i} >{c.title}</td>);
                        })
                    }
                    </tr>
                </thead>
                <tbody>
                    {
                        body.map((c, i) => {
                            const row = {};
                            for (const k of headers) {
                                if (k.key in c) row[k.key] = c[k.key];
                            }
                            return (<Row key={i} row={row}/>);
                        })
                    }
                </tbody>
            </table>
            <div style={{ position: 'absolute', bottom:0, left: 0, width: '100%' }}>hello</div>
        </div>
    );
}

// Memoize component
export default React.memo(CollapsibleTable, props_equal);
