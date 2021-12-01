const express = require('express');
const router = express.Router();
const { pool } = require('../db/preparePool.js');
const { stderr, stdout } = require('process');
const { float_to_tc, tc_to_float } = require('../src/timecode.js');

// TODO: Load Enviroment variables

// Test route
// TODO: Create route names for various API queries
router.get("/api", async (req, res) => {
    let q = (req.query.name).toUpperCase();

    let results = [];

    try {
        const db_result = await pool.query(`SELECT project_name, project_identifier, project_catalogue, project_segment, character_name, prepared_cue, age_range, timeline_values, frame_rate FROM tbl_dubbing_cues_monolithic WHERE character_name = '${q}' LIMIT 1000`);

        for (e of db_result.rows) {
            const { project_name, project_identifier, project_catalogue, project_segment, character_name, prepared_cue, age_range, timeline_values, frame_rate } = e;

            const entry = {
                project_name,
                project_identifier,
                project_catalogue,
                project_segment,
                character_name,
                prepared_cue,
                age_range
            };

            const timeline = [
                float_to_tc(timeline_values[0], frame_rate),
                float_to_tc(timeline_values[1], frame_rate),
                float_to_tc(timeline_values[1] - timeline_values[0], frame_rate)
            ];

            entry['timeline'] = timeline;

            results.push(entry);
        }
    } catch (e) {
        console.log(e);
    }

    res.status(200).json(results);
});

module.exports = {
    router
};