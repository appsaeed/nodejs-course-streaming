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
        const get_bookmark = await Bookmark.where('user_id', user_id).get();

        // Use Promise.all to await all async operations in the loop
        const playlists = await Promise.all(get_bookmark.map(async function (item) {
            const playlists = await Playlist.where('id', item.playlist_id).get();
            return {
                ...item,
                playlists: playlists,
            }
        }));

        const bookmarks = await Promise.all(playlists.map(async function (item) {
            const lists = item.playlists || [];
            const items = await Promise.all(lists.map(async function (pl) {
                const tutor = await Tutor.find(pl.tutor_id);
                return {
                    ...pl,
                    tutor: tutor
                }
            }))

            return {
                ...item,
                playlists: items
            };
        }))

        res.render('bookmark', {
            bookmarks: bookmarks,
        })
    }

}

module.exports = BookmarkController