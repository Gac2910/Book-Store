
const express = require("express");
const router = express.Router();
const conn = require("../db_connection/connection");
const formidable = require('formidable');

conn.connect((err) => {
    if (err) throw err;
});

router.get("/", (req, res) => {
    res.render("addReaders", 
    {
        title: "Add Readers"
    });
});

router.post("/insert", (req, res) => {
	const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
		let sqlCmd = 
		`INSERT INTO readers
		(first_name, last_name, email, phone_number) 
		VALUES
		('${fields.first_name}', 
		'${fields.last_name}', 
		'${fields.email}', 
		'${fields.phone_number}');`;

		conn.query(sqlCmd, (err, result) => {
			if (err) {
				console.log(err);
				res.status(400).send("Failed Submitting Reader");
			}
			else {
				console.log("Reader Submitted");
				res.status(200).send();
			}
		});
	});
});

module.exports = router;