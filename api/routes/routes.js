const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { dbInstance } = require('../db/prepareInstance.js');
const { CuesMonolithic, qry_attributes_all } = require('../db/models.js');
const { stderr, stdout } = require('process');
const { float_to_tc, tc_to_float } = require('../src/timecode.js');

// TODO: Load Enviroment variables

// Create route for new line entries
router.post('/api', async (req, res) => {
    // TODO
    res.status(401).json({ msg: 'POST route to API not authorized' });
});

// Read route for searching lines
router.get('/api', async (req, res) => {
    // Validate client query
    const query_keys = Object.keys(req.query);
    if (query_keys.length === 0) res.status(400).json({ msg: 'please specify a query'});

    // Extract data from query
    let qry_names = [];
    let qry_eps = [];
    let qry_projects = [];
    let qry_segments = [];
    let qry_catalogues = [];
    let qry_lines = []; 

    try {
        for (k of query_keys) {
            switch (k) {
                case 'names':
                    const dirty_names = req.query[k].split(',');
                    for (n of dirty_names) {
                        qry_names.push(n.trim());
                    }
                    break;

                case 'eps':
                    const dirty_eps = req.query[k].split(',');
                    for (n of dirty_eps) {
                        qry_eps.push(n.trim());
                    }
                    break;

                case 'projects':
                    const dirty_projects = req.query[k].split('&&');
                    for (n of dirty_projects) {
                        qry_projects.push(n.trim());
                    }
                    break;

                case 'segments':
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

                default:
                    console.log(`WARNING: unknown api query ${k}`);
                    break;
             }
        }
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }
    
    // Sanitize client query
    // TODO
    const qry_where = {
        [Op.or]: qry_names.map((c) => {
            return { characterName: c.toUpperCase() };
        })
    };

    // Query database
    let qry_results = [];
    try {
        qry_results = await CuesMonolithic.findAll({
            attributes: qry_attributes_all,
            where: qry_where,
            limit: 250
        });
    } catch (e) {
        console.log(`ERROR: ${e}`);
    }

    if (qry_results.length === 0) res.status(200).json({ msg: 'none' });

    // Return results of query to client
    let results = [
        ...qry_results.map((c) => {
            return c.dataValues;
        })
    ];

    res.status(200).json(results);
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