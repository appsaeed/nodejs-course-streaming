const Comment = require('../model/Comment');
const Content = require('../model/Content');
const Like = require('../model/Like');

class LikeController {

    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async store(req, res) {

        if (!(res.locals?.user?.id)) {
            req.flash('messages', ['You must be logged in to like this video!'])
            return res.redirect('back');
        }

        try {

            const user_id = res.locals.user?.user;
            const content_id = req.body?.video_id || '';
            const comment = req.body?.comment || '';

            const video = await Content.find(content_id);

            if (!video) {
                req.flash('messages', ['The video was not found'])
                return res.redirect('back');
            }

            await Comment.create({
                content_id,
                user_id,
                tutor_id:
                    video.tutor_id,
                comment
            });

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
    static async updateLike(req, res) {
        try {
            const video_id = req.params?.video_id || '';
            const user_id = res.locals.user?.id || '';

            const content = await Content.find(video_id);

            if (!content) {
                res.locals.messages = ['Unable to fetch the video'];
                res.redirect('back');
            }

            if (await Like.where('content_id', video_id).first()) {
                await Like.where('content_id', video_id).delete();
            } else {

                await Like.create({
                    content_id: video_id,
                    user_id: user_id,
                    tutor_id: content.tutor_id
                });
            }

            res.locals.messages = ['Liked'];
            res.redirect('back')

        } catch (error) {
            res.locals.messages = ['Server error: ' + error.message];
            res.redirect('back');
        }
    }
}
module.exports = LikeController;