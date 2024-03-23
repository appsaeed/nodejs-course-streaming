const Model = require('./Model');
class Like  extends Model {

    static table = 'likes';    

}
Like.parentStaticMethod(Like)
module.exports = Like;