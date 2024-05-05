const Content = require('./Content');
const Model = require('./Model');
class Like extends Model   {

    static get table(){
        return 'likes';
    }

    static content(){
        this.hasMany(Content, 'id', 'content_id', 'contents' , (query) => {
            // query.join('tutors', 'tutors.id', '=', 'content.tutor_id')
            // Playlist.tutor();
            // query.hasOne(Tutor, 'tutor_id', 'id', 'tutor');
        })
        return this;
    }
}
// Like.flash(Like)
module.exports = Like;