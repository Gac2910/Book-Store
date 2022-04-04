
const express = require("express");
const router = express.Router();
const conn = require("../db_connection/connection");
const formidable = require('formidable');
const fs = require("fs");

conn.connect((err) => {
    if (err) throw err;
});

// query for data and build table with ejs
router.get("/", (req, res) => {
	let sqlCmd = "SELECT * FROM books;";
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Getting Books For listBooks.ejs");
		}
		else {
			console.log("Books Retrieved For listBooks.ejs");
			res.render("listBooks", 
			{
				title: "All Books",
				books: result
			});
		}
	});
});

router.get("/delete", (req, res) => {
	let sqlCmd = `DELETE FROM books WHERE book_id = ${req.query.id}`;
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Deleting Book");
		}
		else {
			console.log("Book Deleted");
			res.status(200).send();
		}
	});
});

router.post("/update", (req, res) => {
	const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
		// check if img is undefined dont include it in sql command
		// otherwise save the img and create sql command
		let sqlCmd;
		if (files.img != undefined) {
			var oldpath = files.img.filepath;
			var newpath = 'public/images/' + files.img.originalFilename;
			fs.copyFile(oldpath, newpath, err => {if (err) throw err});
			sqlCmd = 
			`UPDATE books
			SET 
			title = '${fields.title}', 
			author = '${fields.author}', 
			genre = '${fields.genre}', 
			available = 'Yes',
			img = '${files.img.originalFilename}'
			WHERE 
			book_id = ${fields.id};`;
		} 
		else {
			sqlCmd = 
			`UPDATE books
			SET 
			title = '${fields.title}', 
			author = '${fields.author}', 
			genre = '${fields.genre}', 
			available = 'Yes'
			WHERE 
			book_id = ${fields.id};`;
		}
		conn.query(sqlCmd, (err, result) => {
			if (err) {
				console.log(err);
				res.status(400).send("Failed Updating Book");
			}
			else {
				console.log("Book Updated");
				res.status(200).send();
			}
		});
	});
});

module.exports = router;