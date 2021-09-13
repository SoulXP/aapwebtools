const express = require("express");
const router = require('./routes/routes.js');
const history = require('connect-history-api-fallback');
const path = require('path');
const http = require("http");

// TODO: Load environment
// TODO: Check for enviroment type
require('dotenv').config({ path: path.join(__dirname, 'env', 'dev.env') });

// Initaliaze express framework
const app = express();
app.use(history());
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get("/", (req, res) => {
	res.status(200).send('Hello World!');
});

http.createServer(app).listen(process.env.PORT || 8081, () => {
	console.log(`Server is running on port ${process.env.PORT || 8081}`);
});