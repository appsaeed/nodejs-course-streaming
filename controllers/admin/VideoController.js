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
        let videos = await (new Content()).where('tutor_id', tutor_id).get();
        return res.render('admin/videos/index', { videos })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async view(req, res) {

        const video_id = req.params?.video_id || '';

        const video = await (new Content()).find(video_id);

        const total_likes = await (new Like()).where('content_id', video_id).count();
        const get_comments = await (new Comment()).where('content_id', video_id).get();
        const comments = await Promise.all(get_comments.map(async (comment) => {
            const user = await (new User()).find(comment.user_id)
            const tutor = await (new Tutor()).find(comment.tutor_id);
            return {
                ...comment,
                user,
                tutor
            }
        }))

        return res.render('admin/videos/view', {
            video,
            comments: comments,
            total_likes
        });
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async edit(req, res) {

        const video_id = req.params?.video_id || '';
        const tutor_id = Auth.tutor_id(req);

        const video = await (new Content()).find(video_id);
        const playlists = await (new Playlist()).where('tutor_id', tutor_id).get();

        res.render('admin/videos/edit', { video, playlists });
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async update(req, res) {

        try {

            const video_id = req.body?.video_id || '';
            const video = await (new Content()).find(video_id);

            if (!video) {
                req.flash('messages', ['Video content was not found'])
                return res.redirect('back')
            }

            const data = {
                title: req.body?.title || video.title,
                description: req.body?.description || video.description,
                status: req.body?.status || video.status,
                playlist_id: req.body?.playlist_id || video.playlist_id
            }

            if (Array.isArray(req.files?.thumb) && req.files?.thumb[0]?.filename) {
                data.thumb = req.files?.thumb[0]?.filename;
            }
            if (Array.isArray(req.files?.video) && req.files?.video[0]?.filename) {
                data.video = req.files?.video[0]?.filename;
            }

            (new Content()).where('id', video_id).update(data)
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

            const deleted = await (new Content()).where('id', video_id).delete();

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

        const playlists = await (new Playlist()).where('tutor_id', Auth.tutor_id(req)).get();

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
            playlist_id: req.body?.playlist_id || ""
        }

        if (Array.isArray(req.files?.thumb) && req.files?.thumb[0]?.filename) {
            data.thumb = req.files?.thumb[0]?.filename;
        }
        if (Array.isArray(req.files?.video) && req.files?.video[0]?.filename) {
            data.video = req.files?.video[0]?.filename;
        }

        try {
            const save = await (new Content()).insert(data);

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
    static async search(req, res) {
        const search = String(req.query?.search || '');
        const tutor_id = res.locals?.tutor_id || '';

        const all_playlists = await (new Playlist())
        .where('title', 'LIKE', `%${search}%`)
        .where('tutor_id', tutor_id).orderBy('date', 'DESC').get();

        const get_videos = await (new Content())
        .where('title', 'LIKE', `%${search}%`)
        .where('tutor_id','=', tutor_id).orderBy('date', 'DESC').get();

        const playlists = await Promise.all(all_playlists.map(async (item) => {
            const total_videos = await (new Content()).where('playlist_id', item.id).count();
            return { ...item, total_videos }
        }))

        const videos = await Promise.all(get_videos.map(async (item) => {

            return { ... item, }
        }))

        return res.render('admin/search_page' , { playlists , videos })
    }

}

module.exports = VideoController