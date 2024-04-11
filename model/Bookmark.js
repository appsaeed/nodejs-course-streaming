const Model = require('letsql');
class Bookmark  extends Model {
    
    constructor() {
        super();
        this.table = 'bookmark';
        this.fillable = ['user_id','playlist_id']
    }

}
module.exports = Bookmark;