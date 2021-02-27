const mysql = require('mysql2');

// create the connection to database
// const db = mysql.createPool({
//   host: 'localhost',
//   user: 'brian',
//   password: 'mysqlPass',
//   database: 'brianckwang_company',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

const db = mysql.createConnection({
  host: 'localhost',
  user: 'brian',
  password: 'mysqlPass',
  database: 'brianckwang_company'
});

module.exports = db;