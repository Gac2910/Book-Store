
const express = require("express");
const router = express.Router();
const conn = require("../db_connection/connection");
const formidable = require('formidable');

conn.connect((err) => {
    if (err) throw err;
});

// query for data and build table with ejs
router.get("/", (req, res) => {
	let sqlCmd = "SELECT * FROM books;";
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Getting Books For index.ejs");
		}
		else {
			console.log("Books Retrieved For index.ejs");
			res.render("index", 
			{
				title: "Home",
				books: result
			});
		}
	});
});

module.exports = router;