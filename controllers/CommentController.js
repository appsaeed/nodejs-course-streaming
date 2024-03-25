const Comment = require('../model/Comment');
const Content = require('../model/Content');

class CommentController {

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

            const video = await Content.find(content_id);

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

            await Comment.create(data);
            req.flash('messages', ['Comment Saved'])
            return res.redirect('back');

        } catch (error) {
            return res.send(error);
        }
    }
}
module.exports = CommentController;