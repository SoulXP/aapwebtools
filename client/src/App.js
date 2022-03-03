import React, { useRef, useState } from 'react';
import './styles.css';
import './App.css';
import Searchbar from './components/searchbar/SearchBar.js';
import { api, API_RESULT_KEYS, API_LOCAL_DEFAULTS, build_query_string } from './http/ApiClient.js';
import Table from './components/table/Table.js';
import CollapsibleTable from './components/table/CollapsibleTable.js';
import TablePagination from './components/table/TablePagination.js';
import OptionsButton from './components/buttons/OptionsButton.js'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import { array_is_same, fast_hash_53, primitive_to_string, range_string_to_sequence, rotl, rotr } from './utils/Algorithm.js';
import { float_to_tc } from './utils/Timecode';

// App class globals
const APP_DATA_PROVIDER         = api;
const APP_PREFETCHBUFFER_MAX    = 1;
const APP_HASH_SEED             = 69420;

const APP_FLAG_SUCCESS = 1 << 0;
const APP_FLAG_ERROR   = 1 << 1;
const APP_FLAG_FAILURE = 1 << 2;
const APP_ERRORS = {
    [APP_FLAG_SUCCESS]: {
        msg: 'success'
    },

    [APP_FLAG_ERROR]: {
        msg: 'error'
    },

    [APP_FLAG_FAILURE]: {
        msg: 'failure'
    }
};

const APP_QUERYPARAMS_DEFAULT = {
    projects: [],
    characters: [],
    episodes: [],
    lines: [],
    limit: 0,
    page: 0,
    offset: 0
};

const APP_RESULT_DEFAULT = {
    query: '',
    query_params: APP_QUERYPARAMS_DEFAULT,
    hash: () => { return fast_hash_53(primitive_to_string(APP_RESULT_DEFAULT), APP_HASH_SEED) },
    data: {
        [API_RESULT_KEYS.TOTAL_QUERY]:   0,
        [API_RESULT_KEYS.TOTAL_RESULTS]: 0,
        [API_RESULT_KEYS.MAX_QUERY]:     API_LOCAL_DEFAULTS.MAX_QUERY,
        [API_RESULT_KEYS.PAGE]:          0,
        [API_RESULT_KEYS.OFFSET]:        0,
        [API_RESULT_KEYS.LIMIT]:         0,
        [API_RESULT_KEYS.RESULTS]:       []
    }
};

// Styling theme globals
const APP_COLOUR_PRIMARY_BLUE = '#4da4f6';
const APP_COLOUR_PRIMARY_GREEN = '#007e00';
const APP_COLOUR_PRIMARY_RED = '#ff572d';
const APP_COLOUR_PRIMARY_WHITE = '#EEEEEE';
const APP_COLOUR_SECOND_WHITE = '#AAAAAA';

const APP_THEME = createTheme({
    components: {
        MuiLinearProgress: {
            styleOverrides: {
                bar1Indeterminate: {
                    backgroundColor: APP_COLOUR_PRIMARY_BLUE
                },

                bar2Indeterminate: {
                    backgroundColor: APP_COLOUR_PRIMARY_BLUE
                }
            }
        }
    }
});

export default class App extends React.Component {
    constructor(props) {
        // Call parent constructor
        super(props);

        // App stateful variables
        this.state = {
            // UI input fields
            projects: '',
            characters: '',
            episodes: '',
            lines: '',
            current_input_focus: 0,

            // Parameters used for previous query
            current_query: '',
            successful_results: false,
            current_query_parameters: APP_QUERYPARAMS_DEFAULT,

            // State for WIP Rotating Prefetch Buffer Model
            _display_buffer_index: 0,
            _result_offset: 0,
            _data_buffers: [],
            _overflow_buffer: [],
            
            // Loading control variables for API queries
            awaiting_results: false,
            
            // Pagination variables
            page: 0,
            previous_page: 0,
            page_display_selection: 0,
            page_display_options: [12, 50, 125, 250],

            // Key-stroke state
            btn_last_pressed: '',
            key_timed_out: false
        };

        // Timer for various app level timing needs
        this.timers = 0;

        // Styling defaults
        this.table_row_size_px = 30;

        // References to DOM components
        this.projectsInput =   React.createRef();
        this.episodesInput =   React.createRef();
        this.charactersInput = React.createRef();
        this.linesInput =      React.createRef();
        // this.tableHeader =     React.createRef();
        // this.tableBody =       React.createRef();
        this.appHeader =       React.createRef();
        this.appSearchBar =    React.createRef();
        this.appPageSettings = React.createRef();
    }

    timeLastKeyPressed() {
        this.timer = setTimeout(() => {
            this.setState({ key_timed_out: true });
        }, 250);
    }

    getAvailableTableSpacePx() {
        // TODO: Non-negative safety check / any null case
        if (this.appHeader.current !== null
            && this.appSearchBar.current !== null
            && this.appPageSettings.current !== null
            // && this.tableHeader.current !== null
            // && this.tableBody.current !== null
            )
        {
            const screen_height = window.innerHeight;
            const header_height = this.appHeader.current.offsetHeight;
            const searchbar_height = this.appSearchBar.current.offsetHeight;
            // const tableheader_height = this.tableHeader.current.offsetHeight;
            const tableheader_height = 300 
            const pagesettings_height = this.appPageSettings.current.offsetHeight;
            const table_size = screen_height - (header_height + searchbar_height + tableheader_height + pagesettings_height);

            return table_size - 25;
        }

        return 0;
    }

    getRowSizePx() {
        let row_px = 0;
        // const table_size = this.getAvailableTableSpacePx() - this.tableHeader.current.offsetHeight;
        const table_size = 300;
        const aspect_ratio = window.screen.width / window.screen.height;

        let aspect_coef = (aspect_ratio > 1.25) ? 22 : 10;
        row_px = table_size / aspect_coef;
        
        return {
            size_px: row_px,
            total_fit: aspect_coef
        };
    }

    getPageRowDisplay() {
        return this.state.page_display_options[this.state.page_display_selection];
    }

    getBackgroundColor() {
        let background_color = APP_COLOUR_PRIMARY_BLUE;

        const successful_results = this.state.successful_results;
        const have_results = this._getBufferTotalRemoteResults() > 0;

        if (have_results) {
            background_color = APP_COLOUR_PRIMARY_GREEN;
        } else if (successful_results && !have_results && !this.state.awaiting_results) {
            background_color = APP_COLOUR_PRIMARY_RED;
        }

        return background_color;
    }

    areFieldsEmpty() {
        return this.state.projects === ''   &&
               this.state.characters === '' &&
               this.state.episodes === ''   &&
               this.state.lines === '';
    }

    areReferencesReady() {
        const references_ready = this.tableBody.current !== null
                                 && this.projectsInput.current !== null
                                 && this.episodesInput.current !== null
                                 && this.charactersInput.current !== null
                                 && this.linesInput.current !== null
                                 // && this.tableHeader.current !== null
                                 // && this.tableBody.current !== null
                                 && this.appHeader.current !== null
                                 && this.appSearchBar.current !== null
                                 && this.appPageSettings.current !== null;

        return references_ready;
    }

    toggleTextInput(direction = 1) {
        // Default for next input state
        let next_input_focus = this.state.current_input_focus + direction;

        // Determine next focus state should wrap around
        if (next_input_focus > 3) {
            next_input_focus = 0;
        } else if (next_input_focus < 0) {
            next_input_focus = 3
        }

        // Set state for focus field
        this.setState({ current_input_focus: next_input_focus })

        // Set focus according to state
        switch (this.state.current_input_focus) {
            case 0: this.projectsInput.current.focus();   break;
            case 1: this.charactersInput.current.focus(); break;
            case 2: this.episodesInput.current.focus();   break;
            case 3: this.linesInput.current.focus();      break;
            default: console.error('[ERROR] no reference to input field was set'); break;
        }
    }

    setAppRefs(refs = []) {
        if (refs.length !== 0) {
            for (const wrapper of refs) {
                const k = Object.keys(wrapper)[0];
                this[k] = wrapper[k];
            }
        }
    }
    
    // Callback method for components to update project property state
    updateFieldState(key, value) {
        this.setState((s,p) => ({ [key]: value }));
    }

    _isFlagSuccess(flag) {
        return flag === APP_FLAG_SUCCESS;
    }

    _consumeUserInput() {
        // Storage for parsed user input
        let list_episodes = [];
        let list_projects = [];
        let list_characters = [];
        let list_lines = [];
        let eps_sequence = [];
        
        // Collect user input from form fields
        const user_input = [
            {project: this.state.projects,     data: list_projects   },
            {episode: this.state.episodes,     data: list_episodes   },
            {character: this.state.characters, data: list_characters },
            {line: this.state.lines,           data: list_lines      }
        ];

        // Determine if new search is only white space
        const re_space = new RegExp('^ *$');
        const invalid_search = (re_space.test(this.state.projects))
                            && (re_space.test(this.state.characters))
                            && (re_space.test(this.state.episodes))
                            && (re_space.test(this.state.lines));

        // TODO: Handle invalid searches in UI
        if (invalid_search) return APP_FLAG_FAILURE;
            
        // Parse and seperate user options
        for (const i of user_input) {
            const k = Object.keys(i)[0];
            let delimiter = '';
            
            if (k === 'episode' || k === 'character') {
                // Handle case where user uses | as delimiter
                // TODO: Use better procedure for testing which delimiter is being used
                const re_delimiter = new RegExp('\\|');
                
                if (re_delimiter.test(i[k])) delimiter = '|';
                else delimiter = ',';
                
            } else if (k === 'project' || k === 'line') {
                delimiter = '|';
            }
            
            const dirty_data = i[k].split(delimiter);
            for (const n of dirty_data) {
                i['data'].push(n.trim().toLowerCase());
            }
        }
        
        // Transform ranged episodes to a sequence of comma-seperated values
        // TODO: Constrain max range to prevent user from generating too many numbers
        eps_sequence = range_string_to_sequence(list_episodes);

        // Handle if current query parameters are the same as previous
        // TODO: Display message in UI for identical query parameters
        // console.log('current query', this.state.current_query, 'new query', qry_href);
        list_projects.sort();
        list_episodes.sort();
        list_characters.sort();
        list_lines.sort();

        const identical_query = array_is_same(list_projects, this.state.current_query_parameters.projects)
                                && array_is_same(list_episodes, this.state.current_query_parameters.episodes)
                                && array_is_same(list_characters, this.state.current_query_parameters.characters)
                                && array_is_same(list_lines, this.state.current_query_parameters.lines)
                                && this.state.page === this.state.current_query_parameters.page
                                && this.state.offset === this.state.current_query_parameters.offset;

        if (identical_query) {
            console.log('[MESSAGE] current query parameters matches previous: skipping search');
            return APP_FLAG_SUCCESS;
        }
        
        // Update state for current query parameters
        // Clear current results
        this.setState({
            page: 0,
            result: APP_RESULT_DEFAULT,
            current_query_parameters: {
                projects: list_projects,
                episodes: list_episodes,
                characters: list_characters,
                lines: list_lines,
                limit: 0,
                page: 0,
                offset: 0
            }
        });

        return APP_FLAG_SUCCESS;
    }

    _offsetPage(offset = 0) {
        const next_page = this.state.page + offset;
        const api_total_query = this._getBufferTotalRemoteResults();
        const total_page_slices = Math.floor(api_total_query / this.getPageRowDisplay());
        const next_local_page = Math.max(0, Math.min(next_page, total_page_slices));
        this.setState({ page: next_local_page });
    }

    _getTableData() {
        const api_data = this._getPageData();

        const entries = [];
        let entry = {};
        for (const e of api_data) {
            const keys = Object.keys(e);

            for (const k of keys) {
                if (k === API_RESULT_KEYS.TIMECODE) {
                    const tick_rate = e[API_RESULT_KEYS.TICK_RATE];
                    const frame_rate = e[API_RESULT_KEYS.FRAME_RATE];

                    const tcin = float_to_tc(e[k][0], frame_rate, tick_rate);
                    const tcout = float_to_tc(e[k][1], frame_rate, tick_rate);
                    const duration = float_to_tc(e[k][1] - e[k][0], frame_rate, tick_rate);

                    entry['tcin'] = tcin;
                    entry['tcout'] = tcout;
                    entry['duration'] = duration;
                }

                else if (    k !== API_RESULT_KEYS.FRAME_RATE
                          && k !== API_RESULT_KEYS.TICK_RATE
                          && k !== API_RESULT_KEYS.AGE_RANGE  )
                {
                    entry[k] = e[k];
                }
            }

            entries.push({...entry});
            entry = {};
        }
        
        const table_data = {
            headers: [
                { key: API_RESULT_KEYS.PROJECT,   title: 'Project',   state: (f, v = 128) => f(v) },
                { key: API_RESULT_KEYS.SEGMENT,   title: 'Episode',   state: (f, v = 128) => f(v) },
                { key: API_RESULT_KEYS.CHARACTER, title: 'Character', state: (f, v = 128) => f(v) },
                { key: 'tcin',                    title: 'TC In',     state: (f, v = 128) => f(v) },
                { key: 'tcout',                   title: 'TC Out',    state: (f, v = 128) => f(v) },
                { key: 'duration',                title: 'Duration',  state: (f, v = 128) => f(v) },
                { key: API_RESULT_KEYS.LINE,      title: 'Line',      state: (f, v = 512) => f(v) },
            ],

            body: [...entries]
        };

        return table_data;
    }

    _getPageData() {
        // Function constants
        const api_max_query        = this._getBufferMaxRemoteResults();
        const api_current_page     = this._getBufferRemotePage();
        const current_page_display = this.getPageRowDisplay();
        const current_local_page   = this.state.page;

        if (this._getTotalStoredBuffers() === 0) return [];

        // Slice up results for returning
        const display_buffer = (api_current_page < this._getTotalStoredBuffers())
            ? [...this._getDisplayBuffer(), ...this._getOverflowBuffer()]
            : [...this._getDisplayBuffer()];

        const slice_offset = this.state._result_offset;
        const slice_delta = (current_local_page * current_page_display) - (api_current_page * api_max_query);
        const slice_start = Math.max(0, slice_delta);
        const slice_end = Math.min(display_buffer.length, slice_start + current_page_display);

        return display_buffer.slice(slice_start, slice_end);
    }

    _getDisplayBuffer() {
        if (this._getTotalStoredBuffers() === 0) return APP_RESULT_DEFAULT;
        return this.state._data_buffers[this.state._display_buffer_index].data[API_RESULT_KEYS.RESULTS];
    }
    
    _getOverflowBuffer() {
        return this.state._overflow_buffer;
    }

    _getBufferMaxRemoteResults(index = this.state._display_buffer_index) {
        if (this._getTotalStoredBuffers() === 0) return APP_RESULT_DEFAULT[API_RESULT_KEYS.MAX_QUERY];
        return this.state._data_buffers[index].data[API_RESULT_KEYS.MAX_QUERY];
    }

    _getBufferTotalRemoteResults(index = this.state._display_buffer_index) {
        if (this._getTotalStoredBuffers() === 0) return APP_RESULT_DEFAULT[API_RESULT_KEYS.TOTAL_QUERY];
        return this.state._data_buffers[index].data[API_RESULT_KEYS.TOTAL_QUERY];
    }

    _getTotalRemotePages() {
        if (this._getTotalStoredBuffers() === 0) return 0;
        return Math.floor(this._getBufferTotalRemoteResults() / this._getBufferMaxRemoteResults());
    }

    _getBufferTotalReturnedResults(index = this.state._display_buffer_index) {
        if (this._getTotalStoredBuffers() === 0) return APP_RESULT_DEFAULT[API_RESULT_KEYS.TOTAL_RESULTS];
        return this.state._data_buffers[index].data[API_RESULT_KEYS.TOTAL_RESULTS];
    }
    
    _getBufferRemotePage(index = this.state._display_buffer_index) {
        if (this._getTotalStoredBuffers() === 0) return APP_RESULT_DEFAULT[API_RESULT_KEYS.PAGE];
        return this.state._data_buffers[index].data[API_RESULT_KEYS.PAGE];    
    }

    _getTotalAllowedBuffers() {
        return (APP_PREFETCHBUFFER_MAX * 2) + 1;
    }

    _getTotalStoredBuffers() {
        return this.state._data_buffers.length;
    }

    _refreshBuffers() {
        const api_total_query = this._getBufferMaxRemoteResults();
        const total_page_slices = Math.floor(api_total_query / this.getPageRowDisplay());
        const api_max_query = this._getBufferMaxRemoteResults();
        const api_current_page = this._getBufferRemotePage();
        const max_mod_pages = Math.floor(api_max_query % this.getPageRowDisplay());
        const total_missing_buffer = this.getPageRowDisplay() - max_mod_pages + (max_mod_pages * api_current_page);
        const api_next_page_in_bounds = this._getBufferTotalReturnedResults(this.state._display_buffer_index + 1) > 0;

        if (this.state._result_offset !== total_missing_buffer) {
            this.setState({
                _result_offset: total_missing_buffer,
                _overflow_buffer: this.state._data_buffers[this.state._display_buffer_index + 1].data[API_RESULT_KEYS.RESULTS].slice(0, total_missing_buffer),
            });
        }

        const local_gt_slices = this.state.page > total_page_slices * (this._getBufferRemotePage() + 1);
        const local_lt_slices = this.state.page < total_page_slices * (this._getBufferRemotePage());

        let buffer_index_offset = 0;
        if (api_next_page_in_bounds && local_gt_slices) {
            buffer_index_offset = 1;
        } else if (local_lt_slices) {
            buffer_index_offset = -1;
        }
        
        const rotate_result = this._rotateBuffers(buffer_index_offset);

        return APP_FLAG_SUCCESS;
    }

    async _rotateBuffers(direction = 0) {
        if (direction === 0) {
            console.log('[MESSAGE] cannot rotate buffers with a direction of 0');
            return APP_FLAG_FAILURE;
        }

        const current_buffer_is_start = this.state._display_buffer_index === 0;
        const current_buffer_is_mid   = this.state._display_buffer_index === Math.floor(this._getTotalStoredBuffers() / 2);
        const current_buffer_is_end   = this.state._display_buffer_index === this._getTotalStoredBuffers() - 1;
        let new_buffer_index = this.state._display_buffer_index + 1;

        if (current_buffer_is_start) {
            // TODO
        } 
        
        else if (current_buffer_is_mid) {
            const { projects, episodes, characters, lines, limit, page, offset } = this.state._data_buffers[this.state._display_buffer_index].query_params;
            const boundary_index = (direction > 0) ? this._getTotalStoredBuffers() - 1 : 0;
            const qry_page_offset = (direction > 0) ? 1 : -1;
            const boundary_page = this.state._data_buffers[boundary_index].query_params.page + qry_page_offset;
            const total_remote_results = this._getBufferTotalRemoteResults() / this.getPageRowDisplay();
            const new_page = Math.max(0, Math.min(boundary_page, total_remote_results));
            
            const new_qry = build_query_string(projects, episodes, characters, lines, limit, new_page, offset);
            
            const insert_query = (direction > 0)
                ? async () => { return this._insertQueryIntoBuffer(new_qry, { projects, episodes, characters, lines, limit, page: new_page, offset }, true);  }
                : async () => { return this._insertQueryIntoBuffer(new_qry, { projects, episodes, characters, lines, limit, page: new_page, offset }, false); };

            insert_query().then(
                (flag_success) => {
                    if (!this._isFlagSuccess(flag_success)) {
                        console.log('[MESSAGE] rotating buffers failed when trying to replenish with more data from API');
                        return;
                    }

                    const buffer_index = Math.floor(this._getTotalStoredBuffers() / 2);
                    this.setState({ _display_buffer_index: buffer_index });
                },

                (e) => {
                    console.log(`[ERROR]: could not insert new query when rotating buffers: ${e}`);
                }
            );
        }
        
        else if (current_buffer_is_end) {
            // TODO
        }
        
        
        this.setState({ _display_buffer_index: new_buffer_index });
        return APP_FLAG_SUCCESS;
    }

    _hashParameters(p) {
        return fast_hash_53(primitive_to_string(p), APP_HASH_SEED);
    }

    async _dispatchQuery(parameters) {
        // Build query URI
        const { projects, episodes, characters, lines, limit, page, offset } = parameters;
        
        let qry_urls = [];

        this.setState({ awaiting_results: true });
        
        for (let i = 0; i < this._getTotalAllowedBuffers(); i++) {
            qry_urls.push({
                url: build_query_string(projects, episodes, characters, lines, limit, page + i, offset),
                parameters: { projects, episodes, characters, lines, limit, page: page + i, offset }
            });
        }

        if (!this._isFlagSuccess(await this._fillBuffersWithQueries(qry_urls, parameters))) {
            // Handle UI state
            console.log('[MESSAGE] could not fill buffers with provided parameters');
            this.setState({ successful_results: false });
            return APP_FLAG_FAILURE;
        }

        this.setState({ awaiting_results: false });
        this.setState({ successful_results: true });
        return APP_FLAG_SUCCESS;
    }

    _clearSearch(clear_results = true) {
        // Clear UI input fields
        this.setState({
            projects: '',
            characters: '',
            episodes: '',
            lines: ''
        });

        // Clear app search state
        if (clear_results) {
            this.setState({
                page: 0,
                result: APP_RESULT_DEFAULT,
                result_overflow : [],
                result_overflow_page: 0,
                result_offset: 0,
                current_query: '',
                current_query_parameters: APP_QUERYPARAMS_DEFAULT,
                successful_results: false,
                result_prefetch_1: APP_RESULT_DEFAULT,
                awaiting_results: false,
                _display_buffer_index: 0,
                _result_offset: 0,
                _data_buffers: [],
                _overflow_buffer: []
            });
        }
    }

    _buildBufferObject(url, parameters, results) {
        return {
            query: url,
            query_params: parameters,
            hash: () => { return fast_hash_53(primitive_to_string(parameters), APP_HASH_SEED) },
            data: results
        };
    }

    async _insertQueryIntoBuffer(url = '', parameters = APP_QUERYPARAMS_DEFAULT, at_end = true) {
        if (url.trim().length === 0) {
            console.log('[WARNING] no URLs were provided to query API');
            return APP_FLAG_FAILURE;
        }

        const update_buffers = (at_end)
            ? (v, r) => { const rv = rotl(v); rv.pop();   rv.push(r);    }
            : (v, r) => { const rv = rotr(v); rv.shift(); rv.unshift(r); };

        const new_element = await this._queryDataProvider(url);

        if (!this._isFlagSuccess(new_element.flag)) {
            console.log(`[MESSAGE] query to API with URL ${url} had no results`);
            return APP_FLAG_FAILURE;
        }

        const buffer_object = this._buildBufferObject(url, parameters, new_element.result);
        update_buffers(this.state._data_buffers, buffer_object);
        
        return APP_FLAG_SUCCESS;
    }

    async _fillBuffersWithQueries(urls = []) {
        if (urls.length === 0) {
            console.log('[WARNING] no URLs were provided to query API');
            return APP_FLAG_FAILURE;
        }
        
        let results = [];
        for (const u of urls) {
            const qry_result = await this._queryDataProvider(u.url);
            
            if (this._isFlagSuccess(qry_result.flag)) {
                const result = this._buildBufferObject(u.url, u.parameters, qry_result.result);
                results.push(result);
            }
        }
        
        if (results.length > 0) this.setState({ _data_buffers: [...results] });
        else console.log('[MESSAGE] query to API had no results');

        return APP_FLAG_SUCCESS;
    }

    async _queryDataProvider(qry = '') {
        if (qry === '') {
            console.log('[WARNING] cannot make query to data provider with an empty query');
            return { flag: APP_FLAG_FAILURE, result: APP_RESULT_DEFAULT.data };
        }

        // TODO: Verify format of query string before calling data provider
        try {
            console.log('[MESSAGE] making call to API with href:', qry);
            const qry_response = await APP_DATA_PROVIDER.get(qry);

            const qry_data = ((qry_response.status === 200)
                ? qry_response.data
                : APP_RESULT_DEFAULT.data
            );

            return { flag: APP_FLAG_SUCCESS, result: qry_data };
        } catch (e) {
            console.log(`[ERROR] query to API failed: ${e}`);
        }

        return { flag: APP_FLAG_FAILURE, result: APP_RESULT_DEFAULT };
    }

     componentDidMount() {
        // Listen for shortcuts
        window.addEventListener('keydown', async (e) => {
            // Get modifier state
            const modifier_key = (window.navigator.platform === 'Win32') ? (e.ctrlKey && e.shiftKey) : e.metaKey;
            const ctrl_key     = (window.navigator.platform === 'Win32') ? (e.altKey && e.shiftKey) : e.ctrlKey;
            const shift_key    = e.shiftKey;

            // Make a line search on Ctrl/Cmd + Enter
            if (e.key === 'Enter' && modifier_key) {
                this._consumeUserInput();
                this._dispatchQuery(this.state.current_query_parameters);
            }
            
            // Change results to previous page on Ctrl/Cmd + Left
            if (e.key === 'ArrowLeft' && modifier_key) {
                e.preventDefault();
                this._offsetPage(-1);
                this._refreshBuffers();
            }
            
            // Change results to next page on Ctrl/Cmd + Right
            if (e.key === 'ArrowRight' && modifier_key) {
                e.preventDefault();
                this._offsetPage(1);
                this._refreshBuffers();
            }
            
            // Clear search fields on 1x Escape
            if (e.key === 'Escape') {
                e.preventDefault();
                const inputs = [
                    {key: 'projects',   element: this.projectsInput.current   },
                    {key: 'episodes',   element: this.episodesInput.current   },
                    {key: 'characters', element: this.charactersInput.current },
                    {key: 'lines',      element: this.linesInput.current      }
                ];
                
                let active = '';
                for (const input of inputs) {
                    const is_same = document.activeElement === input['element'];
                    if (is_same) {
                        active = input['key'];
                    }
                }
                
                if (active !== '') {
                    this.updateFieldState(active, '');
                }

                // Reset state if all fields are empty
                const are_fields_empty = this.areFieldsEmpty();
                if (are_fields_empty) this.setState({ successful_results: !are_fields_empty });
            }
            
            // Clear clear search results on 2x Escape
            if (e.key === 'Escape' && this.state.btn_last_pressed === 'Escape' && !this.state.key_timed_out) {
                this._clearSearch(true);
                this.projectsInput.current.focus();
                this.setState({ current_input_focus: 0 });
            }

            // Navigate left to right on Shift + Tab
            if (e.key === 'Tab' && !shift_key) {
                e.preventDefault();
                this.toggleTextInput(1);
            } else if (e.key === 'Tab' && shift_key) {
                e.preventDefault();
                this.toggleTextInput(-1);
            }

            // Store state for currently pressed button
            this.setState({ btn_last_pressed: e.key });

            // Reset timeout for last key pressed & set timer
            this.setState({ key_timed_out: false });
            this.timeLastKeyPressed();
        });
    }

    componentWillUnmount() {
        window.removeEventListener('keydown', (e) => {
            // TODO
        });
    }
    
    componentDidUpdate(prev_props, prev_state) {
        // Clear app timers
        clearTimeout(this.timer);
    }

    render() {
        // Handle background color based on query results
        const backgroundColor = this.getBackgroundColor();

        return (
            <div style={{ backgroundColor: backgroundColor }} className='app'>
                {
                    this.state.awaiting_results
                    &&
                    <ThemeProvider theme={APP_THEME}>
                        <Box sx={{ width: '100%', position: 'absolute', left: '0px', top: '0px' }}>
                            <LinearProgress variant='query'/>
                        </Box>
                    </ThemeProvider>
                }
                <h1 style={{ marginTop: '1rem', textAlign: 'center' }} ref={this.appHeader} className='header'>AAP Lore</h1>
                <Searchbar
                    updateFieldCallbacks={{
                            updateProjects:    (v) => { this.updateFieldState('projects', v);             },
                            updateEpisodes:    (v) => { this.updateFieldState('episodes', v);             },
                            updateCharacters:  (v) => { this.updateFieldState('characters', v);           },
                            updateLines:       (v) => { this.updateFieldState('lines', v);                },
                            updateQueryParams: (v) => { this.updateFieldState('current_query_params', v); },
                            updateInputFocus:  (v) => { this.updateFieldState('current_input_focus', v);  },
                        }
                    }
                    setRefCallbacks={{
                        updateProjectsRef:     (ref) => { this.setAppRefs([{projectsInput: ref}])   },
                        updateEpisodesRef:     (ref) => { this.setAppRefs([{episodesInput: ref}])   },
                        updateCharactersRef:   (ref) => { this.setAppRefs([{charactersInput: ref}]) },
                        updateLinesRef:        (ref) => { this.setAppRefs([{linesInput: ref}])      },
                        updateAppSearchBarRef: (ref) => { this.setAppRefs([{appSearchBar: ref}])    },
                    }}
                    project={this.state.projects}
                    character={this.state.characters}
                    episode={this.state.episodes}
                    line={this.state.lines}
                    page={this.state.page}
                />
                <CollapsibleTable
                    tableData={this._getTableData()}
                    dataHash={(v) => { return fast_hash_53(primitive_to_string(v), APP_HASH_SEED); }}
                />
            </div>
        );
    }
}
