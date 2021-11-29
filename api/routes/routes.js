const express = require('express');
const router = express.Router();
const { pool } = require('../db/preparePool.js');
const { stderr, stdout } = require('process');

// TODO: Load Enviroment variables

// Dirty float to timecode function
// TODO: Fix precision/rounding error for floats
function float_to_tc(n, frame_rate) {
    // TODO: Get resolution constant. Using 10000000.0 at the moment
    let h = m = s = f = 0.0
    if (n >= 60.0 * 60.0 * 10000000.0) {
        h = n / 60.0 * 60.0 / 10000000.0;
        h = Math.trunc(h);
        n = n % (60.0 * 60.0 * 10000000.0);
    }
    
    if (n >= 60.0 * 10000000.0) {
        m = n / 60.0 / 10000000.0;
        m = Math.trunc(m);
        n = n % (60.0 * 10000000.0);
    }
    
    if (n >= 10000000.0) {
        s = n / 10000000.0;
        s = Math.trunc(s);
        n = n % 10000000.0;
    }

    f = Math.round(n * frame_rate / 10000000.0);

    hs = (h.toString().length == 1) ? '0' + h.toString() : h.toString();
    ms = (m.toString().length == 1) ? '0' + m.toString() : m.toString();
    ss = (s.toString().length == 1) ? '0' + s.toString() : s.toString();
    fs = (f.toString().length == 1) ? '0' + f.toString() : f.toString();

    return `${hs}:${ms}:${ss}:${fs}`;
}

// Test route
// TODO: Create route names for various API queries
router.get("/api", async (req, res) => {
    let q = (req.query.name).toUpperCase();
    let results = []
    try {
        const db_result = await pool.query(`SELECT id, project_name, project_identifier, project_catalogue, project_segment, character_name, age_range, timeline_values, frame_rate FROM tbl_dubbing_cues_monolithic WHERE character_name = '${q}' LIMIT 1000`);
        results = db_result.rows;
    } catch (e) {
        console.log(e);
    }

    res.status(200).json(results);
});

module.exports = {
    router
};