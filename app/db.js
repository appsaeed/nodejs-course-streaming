/* eslint-disable no-undef */
// eslint-disable-next-line no-unused-vars
const { Pool, Client } = require('pg');


const config = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USERNAME,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}

// const query =  (new Pool(config)).query('').then();
module.exports = { client: new Client(config) };
module.exports = (new Pool(config));
