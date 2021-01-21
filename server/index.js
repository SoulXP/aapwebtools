const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const https = require("https");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8081;

app.get("/", (req, res) => {
	//res.send({ message: `User ${req.body.email} with password ${req.body.password} registered.`});
	res.send("Hello World!");
});

https.createServer({
	key: fs.readFileSync("./certificates/localhost-private.pem"),
	cert: fs.readFileSync("./certificates/localhost-cert.pem")
}, app).listen(port, () => {
	console.log(`Server is running on port ${port}`);
});

// app.listen(port, () => {
// 	console.log(`Server is running on http://localhost:${port}`);
// });