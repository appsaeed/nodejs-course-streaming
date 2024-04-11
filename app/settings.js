/* eslint-disable no-undef */
require('dotenv').config()
const settings = {

    app_name: process.env.APP_NAME || 'app name',

    env: process.env.NODE_ENV || 'production',

    is_dev: process.env.NODE_ENV === 'development',

    port: process.env.PORT,

    cookie_secret: process.env.COOKIE_SECRET || 'secret_key',

    session_secret: process.env.SESSION_SECRET || 'secret_key',

    auth_cookie_name : 'auth_cookie'

}

module.exports = settings;