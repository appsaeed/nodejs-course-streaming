const User = require("../model/User");

async function unauth(req, res, next) {
    const user_id = req.cookies?.user_id || '';
    const user = await new User().find(user_id);
    if(user){
        req.flash('messages', ['Already logged in'])
        return res.redirect('/')
    }
    res.locals.user = null;
    res.locals.user_id = null;
    return next();
}
module.exports = unauth;