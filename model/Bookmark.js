const Model = require('./Model');
class Bookmark  extends Model {
    
    static get table (){return 'bookmark'}; 

}
module.exports = Bookmark;