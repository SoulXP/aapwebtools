const env = require('dotenv');
const { Pool } = require('pg');

// TODO: Handle misconfigured environment
env.config({ path: process.cwd() + '/env/api.env' });

// Create pools for database to be used throughout application
const pool = new Pool ({
    host: process.env.AWTDBHOST,
    port: process.env.AWTDBPORT,
    database: process.env.AWTDBNAME,
    user: process.env.AWTDBUSER,
    passwrod: process.env.AWTDBPASS
});

module.exports = {
    pool
};