const { hash, hasCompare } = require('../../app/utilities');
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
        const total_playlist = await new Playlist().where('tutor_id', tutor_id ).count();
        const total_content = await new Content().where('tutor_id', tutor_id ).count();
        const total_like = await new Like().where('tutor_id', tutor_id ).count();
        const total_comment = await new Comment().where('tutor_id', tutor_id ).count();

        res.render('admin/profile/index', {
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
    static async editProfile(req, res){
        res.render('admin/profile/edit')
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async updateProfile(req, res){
        
        const tutor_id = res.locals?.tutor_id || '';
        const user_password = res.locals?.tutor.password || ''; 
        const old_password = req.body?.old_password || '';          
        const new_password = req.body?.new_password || '';          
        const confirm_password = req.body?.confirm_password || ''; 

        const data = {
            name: req.body?.name || "",
            profession: req.body?.profession || "",
        }

        try {

            if(new_password || confirm_password || old_password){
                if(!hasCompare(old_password, user_password)){
                    req.flash('messages', ['Prvous password is incorrect'])
                    return res.redirect('back');
                }else if(new_password != confirm_password){
                    req.flash('messages', ['Password could not match with confirm password'])
                    return res.redirect('back');
                }else {
                    data.password = hash(new_password);
                }
            }

            if(new_password && confirm_password === new_password && hasCompare(old_password, user_password)){
                data.password = hash(new_password);
            }
    
            if(req.file?.filename){
                data.image = req.file.filename;
            }
    
            await new Tutor().where('id', tutor_id).update(data);

            req.flash('messages', ['profile was updated successfully!'])
            return res.redirect('back');
            
        } catch (error) {
            req.flash('messages', [error])
            return res.redirect('back');
        }
    }




    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async dashboard(req, res){

        const tutor_id = res.locals?.tutor?.id || '';
        const total_playlist = await new Playlist().where('tutor_id', tutor_id ).count();
        const total_content = await new Content().where('tutor_id', tutor_id ).count();
        const total_like = await new Like().where('tutor_id', tutor_id ).count();
        const total_comment = await new Comment().where('tutor_id', tutor_id ).count();

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

        const login = await new Auth().tutorLogin(res, email, password);

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

        const tutor = await new Tutor().where('email', data.email).first();

        if(tutor){
            req.flash('messages', ['The email already exists!'])
            return res.redirect('back');
        }

        try {

            const save = await new Tutor().create(data);

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