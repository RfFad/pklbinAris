// config/database.js
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
  host: '182.253.105.189',
  user: 'davice',
  password: 'davicesmk',
  database: 'rsciremai',
  port: 3333,
});

module.exports=pool;
