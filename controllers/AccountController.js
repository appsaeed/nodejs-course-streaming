const { hasCompare, hash } = require('../app/utilies');
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
        
        const user_id = res.locals?.user_id || '';

        //get user from postgres database
        const total_like = await Like.where('user_id',user_id).count();
        const total_comment = await Comment.where('user_id',user_id).count();
        const total_bookmarked = await Bookmark.where('user_id',user_id).count()

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
            
        res.render('profile/index' , { 
            playlist: playlist,
            total_like: total_like,
            total_comment: total_comment,
            total_bookmarked: total_bookmarked
         })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async edit(req, res){            
        res.render('profile/edit')
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async update(req, res){
        const user_id = res.locals?.user?.id || ''; 
        const user_password = res.locals?.user.password || ''; 
        const old_password = req.body?.old_password || '';          
        const new_password = req.body?.new_password || '';          
        const confirm_password = req.body?.confirm_password || ''; 

        const data = {
            name: req.body?.name || '',
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
    
            await User.where('id', user_id).update(data);

            req.flash('messages', ['profile was updated successfully!'])
            return res.redirect('back');
            
        } catch (error) {
            req.flash('messages', [error])
            return res.redirect('back');
        }
    }

}

module.exports = AccountController