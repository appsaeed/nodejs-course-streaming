const Comment = require('./Comment');
const Content = require('./Content');
const Like = require('./Like');
const Model = require('./Model');
const Playlist = require('./Playlist');
class Tutor  extends Model {

    static table = 'tutors';

    static playlists() {
       this.hasMany(Playlist, 'tutor_id', 'id', 'playlists');
       return this;
    }

    static videos(){
      this.hasMany(Content, 'tutor_id', 'id', 'videos');
      return this;
    }

    static comments(){
        this.hasMany(Comment, 'tutor_id', 'id', 'comments');
        return this;
    }
    static likes(){
        this.hasMany(Like, 'tutor_id', 'id', 'likes');
        return this;
    }

}
// Tutor.flash(Tutor)
module.exports = Tutor;