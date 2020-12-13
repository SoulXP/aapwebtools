const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const port = 8081;

app.post("/register", (req, res) => {
	res.send({ message: `User ${req.body.email} with password ${req.body.password} registered.`});
});

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
});