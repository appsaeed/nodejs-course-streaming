/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const mysql = require('mysql');


const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}


var con = mysql.createConnection(config);

module.exports = con;
