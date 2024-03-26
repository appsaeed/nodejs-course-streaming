const settings = require('../app/settings');

/**
 * Create view and logic for index
 * @param {import('express').Errback} err 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function locals() {
    return function (req, res, next) {
        const messages = req.flash('messages');
        res.locals = {
            app_name: settings.app_name,
            app_date: (new Date()),
            messages: messages || []
        }
        next()
    }
}
module.exports = locals;