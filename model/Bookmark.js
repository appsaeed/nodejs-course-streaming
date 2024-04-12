const Model = require('./Model');
const Playlist = require('./Playlist');
class Bookmark  extends Model {

    static table = 'bookmark';  
    
   static playlists(){
    this.hasMany(Playlist, 'id', 'playlist_id', 'playlists', (query) => {
        Playlist.tutor()
    });
    return this;
   }

}
Bookmark.flash(Bookmark)
module.exports = Bookmark;