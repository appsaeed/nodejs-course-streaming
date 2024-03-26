const { hash } = require('../app/utilities');
const Auth = require('../model/Auth');
const User = require('../model/User');

class AuthController {

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async login(req, res) {
        res.render('auth/login')
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async loginPost(req, res) {
        const email = req.body?.email || '';
        const password = req.body?.password || '';

        if(((await Auth.login(res, email, password)))){
            return res.redirect('/')
        }
        
        req.flash('messages', ['Email and password incorrect!'])
        return res.redirect('back');
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async register(req, res) {
        res.render('auth/register')
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async registerPost(req, res) {
        const password = req.body?.password;
        const confirm_password = req.body?.confirm_password;
        const email = req.body?.email || '';

        if (password !== confirm_password) {
            req.flash('messages', ['confirm password could not match to the password'])
            return res.redirect('back');
        }

        const user = await User.where('email', email).first();

        if (user) {
            req.flash('messages', ['The user already exists!'])
            return res.redirect('back');
        }

        const data = {
            name: req.body?.name || '',
            email: req.body?.email || '',
            password: hash(password),
        }
        if (req.file?.filename) {
            data.image = req.file.filename;
        }

        try {

            const save = await User.create(data);

            if (save) {

                req.flash('messages', ['Successfully created account!'])
                
                if(((await Auth.login(res, email, password)))){
                    return res.redirect('/')
                }
                
                return res.redirect('/login')
            }

        } catch (error) {
            req.flash('messages', [error.message]);
            return res.redirect('back');
        }

        req.flash('messages', ['Unable to register please try again later!']);
        return res.redirect('back');
    }

}
module.exports = AuthController;