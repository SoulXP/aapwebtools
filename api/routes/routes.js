const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { dbInstance } = require('../db/prepareInstance.js');
const { CuesMonolithic, qry_attributes_all } = require('../db/models.js');
const { float_to_tc, tc_to_float } = require('../util/timecode.js');
const { all_combinations } = require('../util/algorithm.js');
const it = require('itertools');

// TODO: Load Enviroment variables

// Globals
const QRY_LIMIT_MAX = 250;

// Create route for new line entries
router.post('/q', async (req, res) => {
    // TODO
    res.status(401).json({ msg: 'POST route to API not authorized' });
});

// Read route for searching lines
router.get('/q', async (req, res) => {
    // Extract data from query
    let qry_names = [];
    let qry_projects = [];
    let qry_segments = [];
    let qry_catalogues = [];
    let qry_lines = [];
    let qry_offset = 0;

    try {
        // Validate client query
        const query_keys = Object.keys(req.query);
        if (query_keys.length === 0 || query_keys.length === 1 && query_keys[0] === 'offset') {
            res.status(200).json({ msg: 'insufficient parameters in request query' });
            return;
        }
    

        for (const k of query_keys) {
            switch (k) {
                case 'names':
                    const dirty_names = req.query[k].split(',');
                    for (const n of dirty_names) {
                        qry_names.push(n.trim());
                    }
                    break;

                case 'projects':
                    const dirty_projects = req.query[k].split('&&');
                    for (const n of dirty_projects) {
                        qry_projects.push(n.trim());
                    }
                    break;

                case 'eps':
                    const dirty_segments = req.query[k].split(',');
                    for (const n of dirty_segments) {
                        qry_segments.push(n.trim());
                    }
                    break;

                case 'catalogues':
                    const dirty_catalogues = req.query[k].split(',');
                    for (const n of dirty_catalogues) {
                        qry_catalogues.push(n.trim());
                    }
                    break;

                case 'lines':
                    const dirty_lines = req.query[k].split('&&');
                    for (const n of dirty_lines) {
                        qry_lines.push(n.trim());
                    }
                    break;

                case 'offset':
                    const re_numbers = new RegExp('[^0-9]+', 'g');
                    if (re_numbers.test(req.query[k])) throw `client query has invalid offset value: ${dirty_offset}`;
                    qry_offset = parseInt(req.query[k]);
                    break;

                default:
                    console.log(`[MESSAGE] ignoring unknown api query: ${k}`);
                    break;
            }
        }
    } catch (e) {
        console.log(`[MESSAGE] ${e}`);
        res.status(400).json({ msg: "bad query in request" });
        return;
    }

    if (qry_names.length === 0
        && qry_projects.length === 0
        && qry_segments.length === 0
        && qry_catalogues.length === 0
        && qry_lines.length === 0)
    {
        const msg = 'no valid parameters were passed in request query'
        console.log(`[MESSAGE] canceling search query: ${msg}`);
        res.status(400).json({ msg });
        return;
    }

    // Filter out empty arrays in values input argument
    let qry_tagged = [];
    const qry_uncollapsed = [
        ['characterName',    qry_names      ],
        ['projectName',      qry_projects   ],
        ['projectSegment',   qry_segments   ],
        ['projectCatalogue', qry_catalogues ],
        ['preparedCue',      qry_lines      ]
    ].filter((c) => {
        return c[1].length > 0;
    });

    qry_uncollapsed.forEach((c) => {
        const k = c[0];
        let grp = [];
        for (const e of c[1]) {
            grp.push({ [k]: e });
        }
        qry_tagged.push(grp);
    });

    qry_combos = all_combinations(qry_tagged);

    // Build conditions for data query
    const qry_where = {
        [Op.or]: qry_combos.map((c) => {
            let catalogue = 'S'; // TODO: handle syntax for different catalogue types i.e reels, episodes, etc.
            let segment = 'EP'; // TODO: handle syntax for different segment types i.e reels, episodes, etc.
            let options = [];

            for (const e of c) {
                const k = Object.keys(e)[0];

                switch (k) {
                    case 'projectName':
                        options.push({ [k]: e[k].toUpperCase() });
                        break;

                    case 'projectCatalogue':
                        // TODO: handle syntax for different catalogue types i.e reels, episodes, etc.
                        options.push({ [k]: catalogue + ((e[k].length > 1) ? e[k] : '0' + e[k]) });
                        break;
                        
                    case 'projectSegment':
                        // TODO: handle syntax for different segment types i.e reels, episodes, etc.
                        options.push({ [k]: segment + ((e[k].length > 1) ? e[k] : '0' + e[k]) });
                        break;
                        
                    case 'characterName':
                        options.push({ [k]: e[k].toUpperCase() });
                        break;

                    case 'preparedCue':
                        const regex_string = `\\y${e[k]}\\y`;
                        options.push({ [k]: { [Op.iRegexp]: regex_string } });
                        break;

                    default:
                        console.log(`[WARNING] key of ${k} is not recognized. skipping`);
                        break; 
                }
            }

            return { [Op.and]: options };
        })
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
        console.error(`[ERROR] ${e}`);
        res.status(500).json({ msg: 'internal error'});
        return;
    }

    // Return results of query to client
    const results = [
        ...qry_res_results.map((c) => {
            return c.dataValues;
        })
    ];

    const payload = ((qry_res_total > 0)
        ? { total_query: qry_res_total, total_results: results.length, max_query: QRY_LIMIT_MAX, current_offset: qry_offset, results: results }
        : { total_query: 0, total_results: 0, max_query: QRY_LIMIT_MAX, current_offset: 0, results: [] }
    );

    res.status(200).json(payload);
    // res.status(200).json({ msg: "Success!" });
});

// Update route for updating existing entries
router.put('/q', async (req, res) => {
    // TODO
    res.status(401).json({ msg: 'PUT route to API not authorized' });
});

// Delete route for removing existing entries
router.delete('/q', async (req, res) => {
    // TODO
    res.status(401).json({ msg: 'DELETE route to API not authorized' });
});

module.exports = {
    router
};