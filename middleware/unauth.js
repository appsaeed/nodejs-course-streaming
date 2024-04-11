const settings = require("../app/settings");
const User = require("../model/User");

async function unauth(req, res, next) {
    const user_id = req.cookies?.[settings.auth_cookie_name] || '';
    const user = await (new User()).where('id', user_id).first();
    // const user = null;
    if(user){
        req.flash('messages', ['Already logged in'])
        return res.redirect('/')
    }
    res.locals.user = null;
    res.locals.user_id = null;
    return next();
}
module.exports = unauth;