const Bookmark = require('../model/Bookmark');
const Comment = require('../model/Comment');
const Like = require('../model/Like');
const Playlist = require('../model/Playlist');
const Tutor = require('../model/Tutor');
const User = require('../model/User');

class AccountController {

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async profile(req, res){
        
        const user_id = req.cookies['user_id'] || '667lMc6NeEDpJXd4ks7d';

        //get user from postgres database
        const user = await User.where('id', user_id).first();
        const total_like = await Like.where('user_id',user_id).count();
        const total_comment = await Comment.where('user_id',user_id).count();
        const total_bookmarked = await Bookmark.where('user_id',user_id).count()
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
            
        res.render('profile' , { 
            user: user,
            playlist: playlist,
            total_like: total_like,
            total_comment: total_comment,
            total_bookmarked: total_bookmarked
         })
    }

}

module.exports = AccountController