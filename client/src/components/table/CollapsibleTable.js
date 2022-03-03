import React, { useEffect, useState, useCallback } from 'react';
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

function table_header(headers, dragging, mouse_down, mouse_move, mouse_up) {
    const header_data = (data) => {
        const data_seperated = [];

        for (const d of data) {
            data_seperated.push({ type: 'value',   value: d.title, state: d.state(useState) });
            data_seperated.push({ type: 'divider', value: null,    state: null    });
        }

        return data_seperated.map((c, i) => {
            if (c.type === 'divider') {
                return (
                    <div
                        key={i}
                        className='ctable-header-data-sep'
                        onMouseDown={mouse_down}
                        onMouseUp={mouse_up}
                    />
                );
            }

            return (
                <TableData
                    key={i}
                    className='ctable-header-row-data'
                    width={c.state[0]}
                    setWidth={c.state[1]}
                    dragging={dragging}
                    mousemovecallback={mouse_move}
                    mouseupcallback={mouse_up}
                >
                {
                    c.value
                }
                </TableData>
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

function on_mouse_down(e, set_divider, set_dragging) {
    set_divider(e.clientX);
    set_dragging(true);
    console.log(e.target);
    return;
}

function on_mouse_move(e, set_width, set_position, dragging, width, x_position) {
    console.log(dragging);
    if (dragging && width && x_position) {
        const new_width = width + e.clientX - x_position;
        set_position(e.clientX);
        set_width(new_width);
        console.log('dragging');
    }


    return;
}

// Resizable Data
function TableData({ children, className, width, setWidth, dragging, mousemovecallback, mouseupcallback }) {
    const ref = React.createRef();

    useEffect(() => {
        if (ref.current) {
            if (!width) {
                setWidth(ref.current.offsetWidth)
            }
        }

        ref.current.style.width = `${width}px`;
    }, [ref, width, setWidth]);

    useEffect(() => {
        console.log('yeah', dragging)
        if (dragging) {
            document.addEventListener('mousemove', (e) => mousemovecallback(e, setWidth, width, dragging));
            document.addEventListener('mouseup', mouseupcallback);
        }

        return () => {
            document.removeEventListener('mousemove', mousemovecallback);
            document.removeEventListener('mouseup', mouseupcallback);
        };
    }, [dragging]);

    return (
        <React.Fragment>
            <div ref={ref} className={className}>{children}</div>
        </React.Fragment>
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

    const [dividerXPosition, setDividerXPosition] = useState(undefined);
    const [dragging, setDragging] = useState(false);
    console.log('here', dragging);
    const _setDragging = useCallback(setDragging, []);

    const mouse_down = (e) => on_mouse_down(e, setDividerXPosition, _setDragging);
    const mouse_move = useCallback((e, set_width, width, _dragging) => on_mouse_move(e, set_width, setDividerXPosition, _dragging, width, dividerXPosition), [dragging, _setDragging, dividerXPosition, setDividerXPosition]);
    const mouse_up = useCallback((e) => { _setDragging(false); console.log('mouse up'); }, [dragging, _setDragging]);

    return (
        <div className='ctable-container'>
        {
            table_header(headers, dragging, mouse_down, mouse_move, mouse_up)
        }
        {
            table_body(headers, body)
        }
        </div>
    );
}

// Memoize component
export default React.memo(CollapsibleTable, props_equal);
