
const express = require("express");
const router = express.Router();
const conn = require("../db_connection/connection");
const formidable = require('formidable');

conn.connect((err) => {
    if (err) throw err;
});

// query for data and build table with ejs
router.get("/", (req, res) => {
	let sqlCmd = 
	`SELECT * 
	FROM loans 
	INNER JOIN books 
	ON fk_book_id = book_id 
	INNER JOIN readers 
	ON fk_reader_id = reader_id;`;
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Getting Loans For listLoans.ejs");
		}
		else {
			console.log("Loans Retrieved For listLoans.ejs");
			res.render("listLoans", 
			{
				title: "All Loans",
				loans: result
			});
		}
	});
});

router.get("/delete", (req, res) => {
	let sqlCmd = `DELETE FROM loans WHERE loan_id = ${req.query.id}`;
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Deleting Loans");
		}
		else {
			console.log("Loan Deleted");
			res.status(200).send();
		}
	});
});

router.post("/update", (req, res) => {
	const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
		let sqlCmd = 
		`UPDATE loans
		SET
		loan_date = '${fields.loan_date}', 
		return_date = '${fields.return_date}', 
		fk_book_id = '${fields.fk_book_id}',
		fk_reader_id = '${fields.fk_reader_id}'
		WHERE
		loan_id = ${fields.id};`;

		conn.query(sqlCmd, (err, result) => {
			if (err) {
				console.log(err);
				res.status(400).send("Failed Updating Loan");
			}
			else {
				console.log("Loan Updated");
				res.status(200).send();
			}
		});
	});
});

module.exports = router;