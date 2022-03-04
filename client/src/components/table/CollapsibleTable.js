import React, { useEffect, useState, useCallback, useRef, forwardRef } from 'react';
import './CollapsibleTable.css'
import { API_RESULTS_KEYS } from '../../http/ApiClient.js'
import { Cabin } from '@mui/icons-material';

// Memoization comparison function
function props_equal(previous, next) {
    const p_hash = previous.dataHash;
    const n_hash = next.dataHash;

    const p_value = previous.tableData;
    const n_value = next.tableData;
    
    return p_hash(p_value) === n_hash(n_value);
}

function table_header(headers, dragging, dividerIndex, setWidth, setElement, onMouseDown) {
    const header_data = (data) => {
        const data_seperated = [];

        for (const d of data) {
            data_seperated.push({ type: 'value',   value: d.title, size: d.size(useState), });
            data_seperated.push({ type: 'divider', value: null,    size: null,             });
        }

        return data_seperated.map((c, i) => {
            if (c.type === 'divider') {
                return (
                    <TableDivider
                        key={i}
                        index={i}
                        className='ctable-header-data-sep'
                        mouseDown={onMouseDown}
                    />
                );
            }

            return (
                <TableData
                    key={i}
                    index={i}
                    className='ctable-header-row-data'
                    width={c.size[0]}
                    dragging={dragging}
                    selectedDividerIndex={dividerIndex}
                    setEventWidth={setWidth}
                    setEventElement={setElement}
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

function on_mouse_down(event, divider_index, set_divider_index, set_active_divider, set_divider_position, set_element_index, set_dragging) {
    set_divider_position(event.clientX);
    set_active_divider(event.target);
    set_divider_index(divider_index);
    set_element_index(divider_index - 1);
    set_dragging(true);
    return;
}

function on_mouse_move(event, element, divider_position, set_divider_position, width) {
    if (element && divider_position) {
        const new_width = width + event.clientX - divider_position;
        element.style.width = `${new_width}px`;
        set_divider_position(event.clientX);
    };

    return;
}

// Divider for data
function TableDivider({ children, index, className, mouseDown }) {

    return (
        <React.Fragment>
            <div className={className} onMouseDown={(e) => { mouseDown(e, index); }}>{children}</div>
        </React.Fragment>
    );
}

// Resizable Data
function TableData({ children, index, className, width, dragging, selectedDividerIndex, setEventWidth, setEventElement }) {
    const ref = useRef(undefined);

    useEffect(() => {
        if (dragging) {
            if (ref.current && index === selectedDividerIndex - 1) {
                setEventElement(ref.current);
                setEventWidth(ref.current.clientWidth);
            }
        }
    }, [dragging, index, selectedDividerIndex]);

    return (
        <React.Fragment>
            <div ref={ref} style={{ width: `${width}px` }} className={className}>{children}</div>
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

    const [dragging, setDragging] = useState(false);
    const [dividerXPosition, setDividerXPosition] = useState(undefined);
    const [selectedDivider, setSelectedDivider] = useState(undefined);
    const [selectDividerIndex, setSelectedDividerIndex] = useState(undefined);
    const [width, setWidth] = useState(undefined);
    const [element, setElement] = useState(undefined);
    const [elementIndex, setElementIndex] = useState(undefined);
    
    const mouse_down = (event, index) => on_mouse_down(event, index, setSelectedDividerIndex, setSelectedDivider, setDividerXPosition, setElementIndex, setDragging);
    const mouse_move = (event) => on_mouse_move(event, element, dividerXPosition, setDividerXPosition, width);
    const mouse_up = (event) => { setDragging(false); console.log('mouse up'); };

    useEffect(() => {
        if (dragging) {
            document.addEventListener('mousemove', mouse_move);
        }

        document.addEventListener('mouseup', mouse_up);
        
        return () => {
            document.removeEventListener('mousemove', mouse_move);
            document.removeEventListener('mouseup', mouse_up);
        };
    }, [dragging]);

    return (
        <div className='ctable-container'>
        {
            table_header(headers, dragging, selectDividerIndex, setWidth, setElement, mouse_down)
        }
        {
            table_body(headers, body)
        }
        </div>
    );
}

// Memoize component
export default React.memo(CollapsibleTable, props_equal);
