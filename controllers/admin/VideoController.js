const { hash } = require('../../app/utilies');
const Auth = require('../../model/Auth');
const Playlist = require('../../model/Playlist');
const Tutor = require('../../model/Tutor');
const Content = require('../../model/Content');
const Controller = require('../Controller');
const Like = require('../../model/Like');
const Comment = require('../../model/Comment');
const User = require('../../model/User');

class VideoController extends Controller {


    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async index(req, res) {

        const tutor_id = Auth.tutor_id(req);

        const videos = await Content.where('tutor_id', tutor_id).get();

        return res.render('admin/videos/index', { videos })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async view(req, res) {

        const video_id = req.params?.video_id || '';
        // const tutor_id = Auth.tutor_id(req);

        const video = await Content.find(video_id);

        const total_likes = await Like.where('content_id', video_id).count();
        const get_comments = await Comment.where('content_id', video_id).get();
        const comments = await Promise.all(get_comments.map(async (comment) => {
            const user = await User.find(comment.user_id)
            const tutor = await Tutor.find(comment.tutor_id);
            return {
                ...comment,
                user,
                tutor
            }
        }))

        res.render('admin/videos/view', { video, comments ,total_likes });
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async edit(req, res) {

        const video_id = req.params?.video_id || '';
        const tutor_id = Auth.tutor_id(req);

        const video = await Content.find(video_id);
        const playlists = await Playlist.where('tutor_id',tutor_id ).get();

        res.render('admin/videos/edit', { video , playlists});
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async update(req, res) {

        try {

            const video_id = req.body?.video_id || '';
            const video = await Content.find(video_id);

            if(!video) {
                req.flash('messages', ['Video content was not found'])
                return res.redirect('back')
            }

            const data = {
                title: req.body?.title || video.title,
                description: req.body?.description || video.description ,
                status: req.body?.status || video.status,
                playlist_id: req.body?.playlist_id || video.playlist_id
            }

            if(Array.isArray(req.files?.thumb) && req.files?.thumb[0]?.filename){
                data.thumb = req.files?.thumb[0]?.filename;
            }
            if(Array.isArray(req.files?.video) && req.files?.video[0]?.filename){
                data.video = req.files?.video[0]?.filename;
            }

            Content.where('id', video_id).update(data)
            req.flash('messages', ['playlist updated successfully'])
            return res.redirect('back');
        } catch (error) {
            req.flash('messages', [error.message])
            return res.redirect('back');
        }
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async delete(req, res) {

        try {
            const video_id = req.params?.video_id || '';

            const deleted = await Content.where('id', video_id).delete();

            if (deleted) {
                req.flash('messages', ['Content deleted'])
                return res.redirect('/admin/videos');
            }
            
        } catch (error) {
            req.flash('messages', [error.message])
            return res.redirect('/admin/videos');
        }

        req.flash('messages', ['Unalbe to delete playlist'])
        return res.redirect('/admin/playlists');
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async add(req, res) {

        const playlists = await Playlist.where('tutor_id', Auth.tutor_id(req)).get();

        res.render('admin/videos/add', { playlists })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async save(req, res) {

        const data = {
            title: req.body?.title || '0',
            description: req.body?.description || '',
            status: req.body?.status || 'active',
            tutor_id: Auth.tutor_id(req),
            playlist_id: req.body?.playlist_id || "",
            date: (new Date()).toDateString(),
        }

        if(Array.isArray(req.files?.thumb) && req.files?.thumb[0]?.filename){
            data.thumb = req.files?.thumb[0]?.filename;
        }
        if(Array.isArray(req.files?.video) && req.files?.video[0]?.filename){
            data.video = req.files?.video[0]?.filename;
        }

        try {
            const save = await Content.create(data);

            if (save) {
                req.flash('messages', ['Video added successfully'])
                return res.redirect('back');
            }

            req.flash('messages', ['Something went wrong'])

            return res.redirect('back')

        } catch (error) {
            req.flash('messages', [error.message])
            return res.redirect('back');
        }

    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async profile(req, res) {

        const tutor_id = res.locals?.tutor?.id || '';
        const total_playlist = await Playlist.where('tutor_id', tutor_id).count();
        const total_content = await Content.where('tutor_id', tutor_id).count();
        const total_like = await Like.where('tutor_id', tutor_id).count();
        const total_comment = await Comment.where('tutor_id', tutor_id).count();

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
    static async dashboard(req, res) {

        const tutor_id = res.locals?.tutor?.id || '';
        const total_playlist = await Playlist.where('tutor_id', tutor_id).count();
        const total_content = await Content.where('tutor_id', tutor_id).count();
        const total_like = await Like.where('tutor_id', tutor_id).count();
        const total_comment = await Comment.where('tutor_id', tutor_id).count();

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
    static async login(req, res) {

        res.render('admin/login')
        // res.render('admin/register')
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async loginPost(req, res) {

        const email = req.body?.email || '';
        const password = req.body?.password || '';

        const login = await Auth.tutorLogin(res, email, password);

        if (login) return res.redirect('/admin/profile');

        req.flash('messages', ['Email or password is incorrect!'])
        return res.redirect('back');

    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async registerPost(req, res) {

        const password = req.body.password;
        const confirm_password = req.body.confirm_password;

        if (confirm_password !== password) {
            req.flash('messages', ['Password and Confirm Password does not match!']);
            return res.redirect('back');
        }

        if (password.length <= 3) {
            req.flash('messages', ['password must be at less then 4 characters']);
            return res.redirect('back');
        }

        const data = {
            name: req.body.name,
            email: req.body.email,
            profession: req.body.profession,
            password: hash(password),
        }

        if (req.file?.filename) {
            data.image = req.file.filename;
        }

        const tutor = await Tutor.where('email', data.email).first();

        if (tutor) {
            req.flash('messages', ['The email already exists!'])
            return res.redirect('back');
        }

        try {

            const save = await Tutor.create(data);

            if (save) {
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

module.exports = VideoController