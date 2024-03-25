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
// const Auth = require('./model/Auth');


//express middleware start
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')))
app.use(cookieParser(settings.cookie_screet))
app.set('view engine', "ejs")

app.locals = {
    date: (new Date()),
}

app.use(function(req, res, next) {
    const messages = req.flash('messages');
    if(messages){
        res.locals.messages = messages;
    }
    next()
})

//routeing setup
app.use(publicRouter)
app.use(authRouter)
app.use('/admin',adminRouter)



//error handlers
// app.use(notFoundHandler);
// app.use(errorHandler);

//404 not found handler

//application listeners
app.listen(settings.port, function () {
    console.log('Local server running at http://localhost:' + settings.port);
})