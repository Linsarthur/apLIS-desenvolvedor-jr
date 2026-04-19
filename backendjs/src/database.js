const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    database: process.env.DB_NAME || 'clinica',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    waitForConnections: true,
    connectionLimit: 10,
});

module.exports = pool;