const Model = require('./Model');
const Tutor = require('./Tutor');
class Playlist  extends Model {

    static table = 'playlist';    

    static tutor() {
        this.hasOne(Tutor, 'id', 'tutor_id', 'tutor');
        return this;
    }

}
Playlist.flash(Playlist)
module.exports = Playlist;