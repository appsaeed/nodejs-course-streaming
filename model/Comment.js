const Model = require('letsql');
class Comment extends Model {

    constructor() {
        super();
        this.table = 'comments';
        this.fillable = [
            'content_id', 'user_id', 'tutor_id', 'comment', 'date'
        ]
    }

}
module.exports = Comment;