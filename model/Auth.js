const { hasCompare } = require("../app/utilities");
const Bookmark = require("./Bookmark");
const Comment = require("./Comment");
const Like = require("./Like");
const Tutor = require("./Tutor");
const User = require("./User");

class Auth {

    /**
     * Create view and logic for index
     * @param {import('express').Response} res
     */
    static async user(res) {
        
        const user_id = res.locals?.user_id || '';

        const user = await User.find(user_id);

        if (!user) return null;

        const total_like = await Like.where('user_id', user_id).count();
        const total_comment = await Comment.where('user_id', user_id).count();
        const total_bookmarked = await Bookmark.where('user_id', user_id).count();

        return {
            ...user,
            total_like: total_like,
            total_comment: total_comment,
            total_bookmarked: total_bookmarked
        }
    }

    /**
     * Create view and logic for index
     * @param {import('express').Response} res
     */
    static async tutorLogin(res, email, password) {

        const user = await Tutor.where('email', email).first();
        const hash = user?.password || '';
        if (user?.id && hasCompare(password, hash)) {
            res.cookie('tutor_id', user.id, { httpOnly: true });
            return true;
        }

        return false;
    }
    /**
     * Create view and logic for index
     * @param {import('express').Response} res
     */
    static async login(res, email, password) {

        const user = await User.where('email', email).first();
        const hash = user?.password || '';

        if (user?.id && hasCompare(password, hash)) {
            res.cookie('user_id', user.id, { httpOnly: true });
            return true;
        }

        return false;
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async logoutTutor(req, res) {

        res.cookie('tutor_id', null, { httpOnly: true, maxAge: 0 });

        return res.redirect('/admin/login');
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     */
    static async logout(req, res) {

        res.cookie('user_id', null, { httpOnly: true, maxAge: 0 });

        return res.redirect('/login');
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req
     * @returns {string}
     */
    static tutor_id(req) {
        return req.cookies?.tutor_id || '';
    }
}
module.exports = Auth;