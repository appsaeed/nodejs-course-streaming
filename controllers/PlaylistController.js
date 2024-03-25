const Bookmark = require('../model/Bookmark');
const Comment = require('../model/Comment');
const Content = require('../model/Content');
const Like = require('../model/Like');
const Playlist = require('../model/Playlist');
const Tutor = require('../model/Tutor');
const User = require('../model/User');
const Controller = require('./Controller');

class PlaylistController extends Controller {

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async index(req, res) {

        const playlist_id = req.params?.playlist_id || '';

        const playlist = await Playlist.where({id : playlist_id, status : 'active'}).first();
        const videos = await Content.where('playlist_id', playlist_id).get();

        const tutor_id = playlist?.tutor_id || '';
        const user_id = res.locals?.user_id || '';

        const tutor = await Tutor.find(tutor_id);
        const totol_bookmarked = await Bookmark.where({ playlist_id, user_id }).count()

        res.render('playlist', {
            playlist: playlist,
            videos,
            tutor: tutor,
            totol_bookmarked,
        })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async watchVideo(req, res) {

        //get user from postgres database
        const user_id = res.locals?.user.id || '';
        const video_id = req.params?.video_id || '';
        const video = await Content.find(video_id);
        const tutor_id = video?.tutor_id || '';
        
        const tutor = await Tutor.find(tutor_id);
        const total_like = await Like.where('user_id', user_id).count();
        const all_comments = await Comment.where('content_id', video_id).get();

        const commentsPomise = all_comments.map(async function (comment) {
            const user = await User.find(comment.user_id)
            const tutor = await Tutor.find(comment.tutor_id)
            return {
                ...comment,
                user: user,
                tutor: tutor,
            }
        })

        const comments = await Promise.all(commentsPomise)

        res.render('watch_video', {
            video: video,
            tutor: tutor,
            total_like: total_like,
            comments: comments
        })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async savePlaylist(req, res) {
        try {
            const user_id = res.locals?.user.id || '';
            const playlist_id = req.body?.playlist_id || '';


            const bookmark = await Bookmark.find(playlist_id, 'playlist_id');

            if(bookmark){

                await Bookmark.where('playlist_id', playlist_id).delete();
                res.locals.messages = ['Playlist unsaved'];
                res.redirect('back');
            }else {

                await Bookmark.create({ playlist_id, user_id })
                
                res.locals.messages = ['Playlist saved'];
                res.redirect('back');
            }
        } catch (error) {
            res.locals.messages = ['Server error: ' + error.message];
            res.redirect('back');
        }
    }

}

module.exports = PlaylistController