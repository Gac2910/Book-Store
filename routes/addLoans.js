
const express = require("express");
const router = express.Router();
const conn = require("../db_connection/connection");
const formidable = require("formidable");

conn.connect((err) => {
    if (err) throw err;
});

// for the addLoans page, page needs to be rendered with books data
router.get("/", (req, res) => {
	let sqlCmd = "SELECT * FROM books;";
	conn.query(sqlCmd, (err, result) => {
		if (err) {
			console.log(err);
			res.status(400).send("Failed Getting Books For addLoans.ejs");
		}
		else {
			console.log("Books Retrieved For addLoans.ejs");
			res.render("addLoans", 
			{
				title: "Add Loans",
				books: result
			});
		}
	});
});

router.post("/insert", (req, res) => {
	const form = new formidable.IncomingForm();
    form.parse(req, (err, fields, files) => {
		let sqlCmd = 
		`INSERT INTO loans
		(loan_number, loan_date, return_date, fk_book_id, fk_reader_id) 
		VALUES
		('${fields.loan_number}', 
		'${fields.loan_date}', 
		'${fields.return_date}', 
		'${fields.book_id}', 
		'${fields.reader_id}');`;

		conn.query(sqlCmd, (err, result) => {
			if (err) {
				console.log(err);
				res.status(400).send("Failed Submitting Loan");
			}
			else {
				console.log("Loan Submitted");
				res.status(200).send();
			}
		});
	});
});



module.exports = router;