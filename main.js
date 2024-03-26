//dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const settings = require('./app/settings');
const session = require('express-session');
const flash = require('connect-flash');

//import local module
const publicRouter = require('./router/public');
const authRouter = require('./router/auth');
const adminRouter = require('./router/admin');
const {  getErrors, notFound } = require('./middleware/errors');
const locals = require('./middleware/locals');

//express middleware start
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: settings.session_secret,
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser(settings.cookie_secret))
app.use(locals())
app.set('view engine', "ejs")

//routeing setup
app.use(authRouter)
app.use( publicRouter)
app.use('/admin', adminRouter)



//error handlers
app.use(notFound);
app.use(getErrors);

//application listeners
const listeners = () =>  console.log('Local server running at http://localhost:' + settings.port);
app.listen(settings.port, listeners)