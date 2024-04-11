const Model = require('letsql');
class Like extends Model {

    constructor() {
        super();
        this.table = 'likes';
        this.fillable = ['user_id', 'tutor_id', 'content_id']
    }

}
module.exports = Like;