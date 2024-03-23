const Model = require('./Model');
class Comment  extends Model {

    static table = 'comments';    

}
Comment.parentStaticMethod(Comment)
module.exports = Comment;