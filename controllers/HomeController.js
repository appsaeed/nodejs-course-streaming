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
    static async index(req, res){
        
        const get_playlist = await Playlist.where('status', 'active')
                .orderBy('date')
                .limit(6)
                .get();

        const playlists = await Promise.all(get_playlist.map(async (list)=>{
            const tutor = await Tutor.find(list.tutor_id)
            return {
                ...list,
                tutor
            }
        }))
        
        const user_id = res.locals?.user_id || '';
        const total_like = await Like.where('user_id', user_id).count();
        const total_comment = await Comment.where('user_id', user_id).count();
        const total_bookmarked = await Bookmark.where('user_id', user_id).count();

        res.render('home' , { playlists , total_like, total_comment, total_bookmarked })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async about(req, res){

        // const like = await Like.where('user_id', user_id).count();
        const getPlaylist = await Playlist.where('status', 'active')
                .orderBy('date')
                .limit(6)
                .get();

        
        const playlistPromise = getPlaylist.map(async function(row){
            const tutor = await Tutor.where('id', row.tutor_id).first();
            return {
                ...row,
                tutor: tutor,
            }
        })

        const playlist =  await Promise.all(playlistPromise);
            
        res.render('about' , { 
            playlist: playlist
         })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async courses(req, res){
        // const like = await Like.where('user_id', user_id).count();
        const getPlaylist = await Playlist.where('status', 'active')
                .orderBy('date')
                .limit(6)
                .get();

        
        const playlistPromise = getPlaylist.map(async function(row){
            const tutor = await Tutor.where('id', row.tutor_id).first();
            return {
                ...row,
                tutor: tutor,
            }
        })

        const playlist =  await Promise.all(playlistPromise);
            
        res.render('courses' , {  playlist })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async contact(req, res){
        // const like = await Like.where('user_id', user_id).count();
        const getPlaylist = await Playlist.where('status', 'active')
                .orderBy('date')
                .limit(6)
                .get();

        
        const playlistPromise = getPlaylist.map(async function(row){
            const tutor = await Tutor.where('id', row.tutor_id).first();
            return {
                ...row,
                tutor: tutor,
            }
        })

        const playlist =  await Promise.all(playlistPromise);
            
        res.render('contact' , { 
            playlist: playlist
         })
    }


    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async teachers(req, res){

        const tutors = await Tutor.get();

        const teachers = await Promise.all(tutors.map(async (tutor) =>{
            const total_playlists = await Playlist.where('tutor_id', tutor.id).count();
            const total_videos    = await Content.where('tutor_id', tutor.id).count();
            const total_comments = await Comment.where('tutor_id', tutor.id).count();
            const total_likes = await Like.where('tutor_id', tutor.id).count();
            return {
                ...tutor,
                total_playlists,
                total_videos,
                total_comments,
                total_likes,
            }
        }))            
        res.render('teachers' , { teachers })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async bookmark(req, res){
        const user_id = res.locals?.user.id || '';
        //get bookmark from database
        const allBookmark = await Bookmark.where('user_id', user_id).get();

        const bookmarksPromise = allBookmark.map(async function(row) {

            const allPlaylist =  await Playlist.where({ 
                'id': row.playlist_id , status: 'active'
            }).orderBy('date').get();

            const playlistPromise = await allPlaylist.map(async function(item){

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
            
        res.render('bookmark' , { 
            bookmarks: bookmarks,
         })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async like(req, res){
        const user_id = res.locals?.user.id || '';
        //get bookmark from database
        const all_likes = await Like.where('user_id', user_id).get();

        const likesPromise = all_likes.map(async function(like) {

            const all_content =  await Content.where('id', like.content_id).orderBy('date').get();

            const contentPromise = await all_content.map(async function(item){

                const tutor = Tutor.where('id', item.tutor_id).first();

                return {
                    ...item,
                    tutor: tutor,
                }
            })

            const contents = await Promise.all(contentPromise);

            return {
                ...like,
                contents: contents
            }
        });

        const likes = await Promise.all(likesPromise)
            
        res.render('likes' , { 
            likes: likes,
         })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async comment(req, res){
        const user_id = res.locals?.user.id || '';

        //get bookmark from database
        const all_comments = await Comment.where('user_id', user_id).get();

        const commentsPromise = all_comments.map(async function(comment) {

            const contents =  await Content.where('id', comment.content_id).get();

            return {
                ...comment,
                contents: contents
            }
        });

        const comments = await Promise.all(commentsPromise)
            
        res.render('comments' , { 
            comments: comments,
         })
    }
}

module.exports = HomeController