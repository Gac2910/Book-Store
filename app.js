
// SERVER BACKEND

const express = require("express");
const app = express();
const port = 8888;

const morgan = require("morgan");
const path = require('path')
const rfs = require('rotating-file-stream');

// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
	interval: '1d', // rotate daily
	path: path.join(__dirname, 'log')
})

// setup the logger
app.use(morgan('combined', { stream: accessLogStream }))

const conn = require("./db_connection/connection");
conn.connect((err) => {
    if (err) throw err;
});

app.listen(port, () => {
    console.log("Listening On Port " + port);
});

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.static(__dirname + "/public"));

app.use("/", require("./routes/index"));
app.use("/index", require("./routes/index"));
app.use("/addBooks", require("./routes/addBooks"));
app.use("/listBooks", require("./routes/listBooks"));
app.use("/addReaders", require("./routes/addReaders"));
app.use("/listReaders", require("./routes/listReaders"));
app.use("/addLoans", require("./routes/addLoans"));
app.use("/listLoans", require("./routes/listLoans"));

app.get("/query", (req, res) => {
	let sqlCmd;
	if (req.query.where == undefined) 
		sqlCmd = `SELECT ${req.query.col} FROM ${req.query.table};`;
	else 
		sqlCmd = `SELECT ${req.query.col} FROM ${req.query.table} ${req.query.where};`;
		
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Retrieving Query");
		}
		else {
			console.log("Query Retrieved");
			res.status(200).send(result);
		}
	});
})
