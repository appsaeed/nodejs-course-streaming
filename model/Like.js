const Bookmark = require('./Bookmark');
const Comment = require('./Comment');
const Contact = require('./Contact');
const Content = require('./Content');
const Model = require('./Model');
const Playlist = require('./Playlist');
const Tutor = require('./Tutor');
const User = require('./User');
class Like extends Model   {

    static get table(){
        return 'likes';
    }

    static content(){
        console.log('Tutor Model; ', Tutor)
        this.hasMany(Content, 'id', 'content_id', 'contents' , (query) => {
            // query.join('tutors', 'tutors.id', '=', 'content.tutor_id')
            // Playlist.tutor();
            // query.hasOne(Tutor, 'tutor_id', 'id', 'tutor');
        })
        return this;
    }
}
Like.flash(Like)
module.exports = Like;