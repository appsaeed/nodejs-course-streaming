
/**
 * Create view and logic for index
 * @param {import('express').Errback} err 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function notFound(req, res) {
   return res.render('errors/404.ejs')
}

/**
 * Create view and logic for index
 * @param {import('express').Errback} err 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
// eslint-disable-next-line no-unused-vars
function getErrors(err, req, res, next) {
    res.status(err.status || 500);
    const error = {
        code: err.name,
        success: false, 
        message: err.message 
    };

    return res.render('errors/common', error);
    // if(req.accepts('json')) {
    //     return res.json(error);
    // } else {
    // }
}

module.exports = {
    notFound,
    getErrors,
};
