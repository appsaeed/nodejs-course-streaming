const Model = require('./Model');
class Bookmark  extends Model {

    static table = 'bookmark';    

}
Bookmark.parentStaticMethod(Bookmark)
module.exports = Bookmark;