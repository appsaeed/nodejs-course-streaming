const Model = require('./Model');
class Playlist  extends Model {

    static table = 'playlist';    

}
Playlist.parentStaticMethod(Playlist)
module.exports = Playlist;