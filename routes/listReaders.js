
const express = require("express");
const router = express.Router();
const conn = require("../db_connection/connection");
const formidable = require('formidable');

conn.connect((err) => {
    if (err) throw err;
});

// query for data and build table with ejs
router.get("/", (req, res) => {
	let sqlCmd = "SELECT * FROM readers;";
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Getting Readers For listReaders.ejs");
		}
		else {
			console.log("Readers Retrieved For listReaders.ejs");
			res.render("listReaders", 
			{
				title: "All Readers",
				readers: result
			});
		}
	});
});

router.get("/delete", (req, res) => {
	let sqlCmd = `DELETE FROM readers WHERE reader_id = ${req.query.id}`;
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Deleting Reader");
		}
		else {
			console.log("Reader Deleted");
			res.status(200).send();
		}
	});
});

router.post("/update", (req, res) => {
	const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
		let sqlCmd = 
		`UPDATE readers
		SET 
		first_name = '${fields.first_name}', 
		last_name = '${fields.last_name}', 
		email = '${fields.email}', 
		phone_number = '${fields.phone_number}'
		WHERE
		reader_id = ${fields.id};`;

		conn.query(sqlCmd, (err, result) => {
			if (err) {
				console.log(err);
				res.status(400).send("Failed Updating Reader");
			}
			else {
				console.log("Reader Updated");
				res.status(200).send();
			}
		});
	});
});

module.exports = router;