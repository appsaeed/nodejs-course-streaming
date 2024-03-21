/* eslint-disable no-undef */
require('dotenv').config()
const settings = {

    env: process.env.NODE_ENV || 'production',

    is_dev: process.env.NODE_ENV === 'development',

    port: process.env.PORT,

    cookie_screet: process.env.COOKIE_SCREET || 'screet',

}

module.exports = settings;