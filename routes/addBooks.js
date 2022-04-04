
const express = require("express");
const router = express.Router();
const conn = require("../db_connection/connection");
const formidable = require('formidable');
const fs = require("fs");

conn.connect((err) => {
    if (err) throw err;
});

router.get("/", (req, res) => {
    res.render("addBooks", 
    {
        title: "Add Books"
    });
});

router.post("/insert", (req, res) => {
	const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
        var oldpath = files.img.filepath;
        var newpath = 'public/images/' + files.img.originalFilename;
        fs.copyFile(oldpath, newpath, err => {if (err) throw err});

		let sqlCmd = 
		`INSERT INTO books
		(title, author, genre, available, img) 
		VALUES
		('${fields.title}', 
		'${fields.author}', 
		'${fields.genre}', 
		'Yes', 
		'${files.img.originalFilename}');`;

		conn.query(sqlCmd, (err, result) => {
			if (err) {
				console.log(err);
				res.status(400).send("Failed Submitting Book");
			}
			else {
				console.log("Book Submitted");
				res.status(200).send();
			}
		});
	});
});

module.exports = router;