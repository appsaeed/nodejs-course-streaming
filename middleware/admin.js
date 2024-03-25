const Tutor = require("../model/Tutor");

async function admin(req, res, next) {
    const tutor_id = req.cookies?.tutor_id || '';
    const tutor = await Tutor.find(tutor_id);
    if(tutor){
        res.locals.tutor = tutor;
        res.locals.tutor_id = tutor.id;
        return next();
    }
    return res.redirect('/admin/login')
}
module.exports = admin;