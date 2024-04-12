const Bookmark = require('../model/Bookmark');
const Playlist = require('../model/Playlist');
const Tutor = require('../model/Tutor');
const Controller = require('./Controller');

class BookmarkController extends Controller {


    /**
     * Create view and logic for index
     * @param {import('express').Request} req 
     * @param {import('express').Response} res
     */
    static async index(req, res) {
        const user_id = res.locals?.user?.id || '';

        // Get bookmarks from the database
        const bookmarks = await Bookmark.playlists()
        .where('user_id', user_id).get();

        res.render('bookmark', { bookmarks: bookmarks })
    }

}

module.exports = BookmarkController