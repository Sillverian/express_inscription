const mysql = require('mysql2/promise');

exports.db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'formation_express',
});
