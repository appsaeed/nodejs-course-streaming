const settings = require("../app/settings");
const User = require("../model/User");

async function auth(req, res, next) {
    const user_id = req.cookies?.[settings.auth_cookie_name] || '';
    const user = await (new User()).find(user_id);
    res.locals.user = user;
    res.locals.user_id = user_id;
    return next();
}
module.exports = auth;