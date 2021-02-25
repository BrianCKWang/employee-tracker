const mysql = require('mysql2');

// create the connection to database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'brian',
  password: 'mysqlPass',
  database: 'brianckwang_company'
});

module.exports = db;