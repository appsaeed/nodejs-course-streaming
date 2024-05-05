const db = require('../app/db');
const Bookmark = require('../model/Bookmark');
const Comment = require('../model/Comment');
const Content = require('../model/Content');
const Like = require('../model/Like');
const Playlist = require('../model/Playlist');
const Tutor = require('../model/Tutor');
const Controller = require('./Controller');

class HomeController extends Controller {

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async index(req, res) {

        const playlists = await Playlist.tutor().where('status', 'active')
            .orderBy('date')
            .limit(6)
            .get();

        const user_id = res.locals?.user_id || '';
        const total_like = await Like.where('user_id', user_id).count();
        const total_comment = await Comment.where('user_id', user_id).count();
        const total_bookmarked = await Bookmark.where('user_id', user_id).count();

        res.render('home', { playlists, total_like, total_comment, total_bookmarked })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async about(req, res) {

        const playlist = await Playlist.tutor().orderBy('date').limit(6).get();

        res.render('about', {
            playlist: playlist
        })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async courses(req, res) {
        const playlist = await Playlist.tutor().where('status', 'active').orderBy('date').limit(6).get();

        res.render('courses', { playlist })
    }


    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async teachers(req, res) {
        
        const tutors = await Tutor.playlists().videos().comments().likes().get()
        const teachers = tutors.map( tutor => {
            return {
                ...tutor,
                total_playlists : tutor.playlists.length,
                total_videos : tutor.videos.length,
                total_comments: tutor.comments.length,
                total_likes : tutor.likes.length,
            }
        })

        return res.render('teachers', { teachers })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async bookmark(req, res) {
        const user_id = res.locals?.user?.id || '';
        //get bookmark from database
        const allBookmark = await Bookmark.where('user_id', user_id).get();

        const bookmarksPromise = allBookmark.map(async function (row) {

            const allPlaylist = await Playlist.where({
                'id': row.playlist_id, status: 'active'
            }).orderBy('date').get();

            const playlistPromise = await allPlaylist.map(async function (item) {

                const tutor = Tutor.where('id', item.tutor_id).first();

                return {
                    ...item,
                    tutor: tutor,
                }
            })

            const playlists = await Promise.all(playlistPromise);

            return {
                ...row,
                playlists: playlists
            }
        });

        const bookmarks = await Promise.all(bookmarksPromise)

        res.render('bookmark', {
            bookmarks: bookmarks,
        })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async like(req, res) {
        const user_id = res.locals?.user?.id || '';

        const query = await Like.content().where('user_id', user_id).all();

        console.log(query);
        const likes = await Promise.all(query.map(async (item) => {
            const content = await Content.find(item.content_id);
            const tutor = await Tutor.find(item.tutor_id);
            return {
                ...item,
                content,
                tutor
            }
        }))
        return res.render('likes', {
            likes: likes,
        })
    }
}

module.exports = HomeController