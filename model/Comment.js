const Model = require('./Model');
class Comment  extends Model {

    static get table(){
        return 'comments';
    }    

}
module.exports = Comment;