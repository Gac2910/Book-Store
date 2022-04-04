const mysql = require("mysql2");

var conn = mysql.createConnection({
    host: "localhost",
    user: "root",
    // password: "",
    password: "Memo1017!",
    database: "library"
});

module.exports = conn;