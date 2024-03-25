/**
 * Create view and logic for index
 * @param {import('express').Request} req 
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
function token(req, res, next) {
    const token = req.body?.token || '';
    const local_token = process.env.API_TOKEN;
    if (token === local_token) {
        return next();
    } else {
        return next('The token is invalid')
    }
}
module.exports = token;