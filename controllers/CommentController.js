const Comment = require('../model/Comment');
const Content = require('../model/Content');

class CommentController {

     /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
     static async index(req, res){
        const user_id = res.locals?.user?.id || '';

        //get bookmark from database
        const all_comments = await (new Comment()).where('user_id', user_id).get();

        const commentsPromise = all_comments.map(async function(comment) {

            const contents =  await (new Content()).where('id', comment.content_id).get();

            return {
                ...comment,
                contents: contents
            }
        });

        const comments = await Promise.all(commentsPromise)
            
        res.render('comment/index' , { 
            comments: comments,
         })
    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async edit(req, res) {
        const comment_id = req.params?.comment_id || '';
        const comment = await (new Comment()).find(comment_id);
        if(!comment){
            req.flash( 'messages', ['Comment not found']);
            res.redirect('back');
        }
        return res.render('comment/edit', { comment })
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async store(req, res) {

        if (!(res.locals?.user?.id)) {
            req.flash('messages', ['You must be logged in before leave a comment!'])
            return res.redirect('back');
        }

        try {

            const user_id = res.locals.user?.id;
            const content_id = req.body?.video_id || '';
            const comment = req.body?.comment || '';

            const video = await (new Content()).find(content_id);

            if (!video) {
                req.flash('messages', ['The video was not found'])
                return res.redirect('back');
            }

            const data = {
                content_id,
                user_id,
                tutor_id: video.tutor_id,
                comment
            }

            await (new Comment()).insert(data);
            req.flash('messages', ['Comment Saved'])
            return res.redirect('back');

        } catch (error) {
            return res.send(error);
        }
    }
    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async update(req, res) {

        const comment_id = req.body?.comment_id || "";
        const comment = req.body?.comment || "";

        if(!comment && !comment_id) {
            req.flash('messages', ['Comment was not found'])
            return res.redirect('back');
        }
        
        if((await (new Comment()).where({ id: comment_id }).update({ comment })))
        req.flash('messages', ['Comment was updated'])
        return res.redirect('back');

    }

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async delete(req, res) {

        const comment_id = req.params?.comment_id || "";

        await (new Comment()).where('id', comment_id).delete();
        


        if(comment_id) {
            req.flash('messages', ['Comment was not found'])
            return res.redirect('back');
        }

        await (new Comment()).where('id', comment_id).delete();
        
        req.flash('messages', ['Comment was removed'])
        
        return res.redirect('back');

    }
}
module.exports = CommentController;