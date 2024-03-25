const { hash } = require('../../app/utilies');
const Auth = require('../../model/Auth');
const Playlist = require('../../model/Playlist');
const Tutor = require('../../model/Tutor');
const Content = require('../../model/Content');
const Controller = require('../Controller');
const Like = require('../../model/Like');
const Comment = require('../../model/Comment');

class AdminController extends Controller {


    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async register(req, res){

        res.render('admin/register')
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async profile(req, res){
        
        const tutor_id = res.locals?.tutor?.id || '';
        const total_playlist = await Playlist.where('tutor_id', tutor_id ).count();
        const total_content = await Content.where('tutor_id', tutor_id ).count();
        const total_like = await Like.where('tutor_id', tutor_id ).count();
        const total_comment = await Comment.where('tutor_id', tutor_id ).count();

        res.render('admin/profile', {
            total_comment,
            total_content,
            total_like,
            total_playlist
        })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async dashboard(req, res){

        const tutor_id = res.locals?.tutor?.id || '';
        const total_playlist = await Playlist.where('tutor_id', tutor_id ).count();
        const total_content = await Content.where('tutor_id', tutor_id ).count();
        const total_like = await Like.where('tutor_id', tutor_id ).count();
        const total_comment = await Comment.where('tutor_id', tutor_id ).count();

        res.render('admin/dashboard', {
            total_comment,
            total_content,
            total_like,
            total_playlist
        })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async login(req, res){

        res.render('admin/login')
        // res.render('admin/register')
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async loginPost(req, res){
        
        const email = req.body?.email || '';
        const password = req.body?.password || '';

        const login = await Auth.tutorLogin(res, email, password);

        if(login) return res.redirect('/admin/profile');

        req.flash('messages', ['Email or password is incorrect!'])
        return res.redirect('back');
        
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async registerPost(req, res){

        const password = req.body.password;
        const confirm_password = req.body.confirm_password;

        if(confirm_password !== password){
            req.flash('messages', ['Password and Confirm Password does not match!']);
            return res.redirect('back');
        }

        if(password.length <= 3){
            req.flash('messages', ['password must be at less then 4 characters']);
            return res.redirect('back');
        }

        const data = {
            name: req.body.name,
            email: req.body.email,
            profession: req.body.profession,
            password: hash(password),
        }

        if(req.file?.filename){
            data.image = req.file.filename;
        }

        const tutor = await Tutor.where('email', data.email).first();

        if(tutor){
            req.flash('messages', ['The email already exists!'])
            return res.redirect('back');
        }

        try {

            const save = await Tutor.create(data);

            if(save){
                return res.redirect('/admin/login')
            }
            
        } catch (error) {
            req.flash('messages', [error.message]);
            return res.redirect('back');
        }

        req.flash('messages', ['Unable to register tutor please try again later!']);
        return res.redirect('back');

    }

}

module.exports = AdminController