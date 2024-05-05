const Model = require('./Model');
class Comment  extends Model {

    static table = 'comments';    

}
// Comment.flash(Comment)
module.exports = Comment;