const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { dbInstance } = require('../db/prepareInstance.js');
const { CuesMonolithic, qry_attributes_all } = require('../db/models.js');
const { float_to_tc, tc_to_float } = require('../util/timecode.js');
const { QueryTree } = require('../util/querytree.js');
const it = require('itertools');

// TODO: Load Enviroment variables

// Globals
const QRY_LIMIT_MAX = 250;

// Create route for new line entries
router.post('/api', async (req, res) => {
    // TODO
    res.status(401).json({ msg: 'POST route to API not authorized' });
});

// Read route for searching lines
router.get('/api', async (req, res) => {
    // Validate client query
    const query_keys = Object.keys(req.query);
    if (query_keys.length === 0) {
        res.status(400).json({ msg: 'please specify a query' });
        return;
    }

    // Extract data from query
    let qry_names = [];
    let qry_projects = [];
    let qry_segments = [];
    let qry_catalogues = [];
    let qry_lines = [];
    let qry_offset = 0;

    try {
        for (k of query_keys) {
            switch (k) {
                case 'names':
                    const dirty_names = req.query[k].split(',');
                    for (n of dirty_names) {
                        qry_names.push(n.trim());
                    }
                    break;

                case 'projects':
                    const dirty_projects = req.query[k].split('&&');
                    for (n of dirty_projects) {
                        qry_projects.push(n.trim());
                    }
                    break;

                case 'eps':
                    const dirty_segments = req.query[k].split(',');
                    for (n of dirty_segments) {
                        qry_segments.push(n.trim());
                    }
                    break;

                case 'catalogues':
                    const dirty_catalogues = req.query[k].split(',');
                    for (n of dirty_catalogues) {
                        qry_catalogues.push(n.trim());
                    }
                    break;

                case 'lines':
                    const dirty_lines = req.query[k].split('&&');
                    for (n of dirty_lines) {
                        qry_lines.push(n.trim());
                    }
                    break;

                case 'offset':
                    const re_numbers = new RegExp('[^0-9]+', 'g');
                    if (re_numbers.test(req.query[k])) throw `client query has invalid offset value: ${dirty_offset}`;
                    qry_offset = parseInt(req.query[k]);
                    break;

                default:
                    console.log(`[WARNING] ignoring unknown api query: ${k}`);
                    break;
            }
        }
    } catch (e) {
        console.log(`[ERROR] ${e}`);
        res.status(400).json({ msg: "bad request" });
        return;
    }

    // Sort various client parameters
    let collapsed_qry = [];
    const all_qry = [
        [qry_names.length,      { characterName: qry_names         }],
        [qry_projects.length,   { projectName: qry_projects        }],
        [qry_segments.length,   { projectSegment: qry_segments     }],
        [qry_catalogues.length, { projectCatalogue: qry_catalogues }],
        [qry_lines.length,      { preparedCue: qry_lines           }]
    ];

    all_qry.sort((a,b) => {
        return a[0] - b[0]
    });

    all_qry.forEach((current) => {
        const k = Object.keys(current[1])[0];
        for (e of current[1][k]) {
            collapsed_qry.push({ [k]: e }); 
        }
    }, collapsed_qry)

    // Build conditions for data query
    const qry_where = {
        [Op.or]: qry_names.map((c) => {
            return { characterName: c.toUpperCase() };
        }),
    };

    // Query database
    let qry_res_total = 0;
    let qry_res_results = [];
    try {
        // Query to get total results
        qry_res_total = await CuesMonolithic.count({
                where: qry_where
            }
        );

        // Main query for data
        qry_res_results = await CuesMonolithic.findAll({
            attributes: qry_attributes_all,
            where: qry_where,
            limit: QRY_LIMIT_MAX,
            offset: qry_offset * QRY_LIMIT_MAX,
            order: [['id', 'ASC'], ['project_name', 'ASC']]
        });
    } catch (e) {
        console.log(`[ERROR] ${e}`);
    }

    if (qry_res_results.length === 0) {
        res.status(200).json({ msg: 'none' });
        return;
    }

    // Return results of query to client
    const results = [
        ...qry_res_results.map((c) => {
            return c.dataValues;
        })
    ];

    let payload = {
        total_query: qry_res_total,
        total_data: results.length,
        max_query: QRY_LIMIT_MAX,
        current_offset: qry_offset,
        data: results
    };

    res.status(200).json(payload);
    // res.status(200).json({ msg: "Success!" });
});

// Update route for updating existing entries
router.put('/api', async (req, res) => {
    // TODO
    res.status(401).json({ msg: 'PUT route to API not authorized' });
});

// Delete route for removing existing entries
router.delete('/api', async (req, res) => {
    // TODO
    res.status(401).json({ msg: 'DELETE route to API not authorized' });
});

module.exports = {
    router
};