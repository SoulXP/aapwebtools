const express = require("express");
const { router } = require('./routes/routes.js');
const { dbInstance } = require('./db/prepareInstance');
const path = require('path');
const http = require("http");

// TODO: Handle environment
const env = require('dotenv').config({ path: path.join(__dirname, 'env', 'dev.env') });

// Initaliaze express framework & load router
const app = express();
app.use('/', router);

// Host server
http.createServer(app).listen(process.env.PORT || 8081, async () => {
	console.log(`Server is running on port ${process.env.PORT || 8081}`);
});