//dependencies
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const settings = require('./app/settings');

//import local module
const  { notFoundHandler, errorHandler} = require('./middleware/errorHandlerMiddleware')

//main application start
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//database connection


//view engine configuration
app.set('view engine', "ejs")


//set static public path
// eslint-disable-next-line no-undef
app.use(express.static(path.join(__dirname, 'public')))

//cookie parsing
app.use(cookieParser(settings.cookie_screet))


//routeing setup



//error handlers
app.use(notFoundHandler);
app.use(errorHandler);

//404 not found handler

//application listeners
app.listen(settings.port, function(){
    console.log('Local server running at http://localhost:' + settings.port);
})