import React, { useEffect, useState, useCallback, useRef, forwardRef } from 'react';
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

function table_header(headers, dragging, dividerIndex, setWidth, setElementIndex, setElement, onMouseDown) {
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
                    setWidth={c.size[1]}
                    dragging={dragging}
                    selectedDividerIndex={dividerIndex}
                    setEventWidth={setWidth}
                    setEventElementIndex={setElementIndex}
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

function on_mouse_down(event, index, set_active, set_index, set_element_index, element, set_element, set_position, set_dragging) {
    set_position(event.clientX);
    set_active(event.target);
    set_index(index);
    set_element(element)
    set_element_index(index - 1);
    set_dragging(true);
    console.log('divider', index);
    console.log('element', element);
    return;
}

function on_mouse_move(event, index, element, divider, setWidth) {
    if (element) console.log('element', element.offsetWidth);

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
function TableData({ children, index, className, width, setWidth, dragging, selectedDividerIndex, setEventWidth, setEventElementIndex, setEventElement }) {
    const ref = React.createRef();

    useEffect(() => {
        if (dragging) {
            if (ref.current && index === selectedDividerIndex - 1) { 
                setEventElement(ref.current);
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

    const mouse_down = useCallback((event, index) => on_mouse_down(event, index, setSelectedDivider, setSelectedDividerIndex, setElementIndex, element, setElement, setDividerXPosition, setDragging), [dragging, selectedDivider, selectDividerIndex, elementIndex]);
    const mouse_move = useCallback((event) => on_mouse_move(event, elementIndex, element, selectedDivider, setWidth), [elementIndex, element, selectedDivider, setSelectedDividerIndex]);
    const mouse_up = useCallback((event) => { setDragging(false); console.log('mouse up'); }, [dragging]);

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
            table_header(headers, dragging, selectDividerIndex, setWidth, setElementIndex, setElement, mouse_down)
        }
        {
            table_body(headers, body)
        }
        </div>
    );
}

// Memoize component
export default React.memo(CollapsibleTable, props_equal);
