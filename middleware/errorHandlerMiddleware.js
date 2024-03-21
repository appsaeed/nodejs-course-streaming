const createError = require('http-errors')
const settings = require('../app/settings')
function notFoundHandler(req, res, next){
    return next(createError(404, 'Your request was not found!'))
}

function errorHandler(err, req, res, next){
    const  error = {
        title: err.name,
        message: err.message
    }

    res.locals.error = error;
    res.status(err.status || 500)

    if(!res.locals.html){
        res.render('error');
    }else{
        res.json(error)
    }
    next()
}

module.exports = {
    notFoundHandler,
    errorHandler,
};