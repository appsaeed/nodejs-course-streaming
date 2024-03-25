const Model = require('./Model');
class Content  extends Model {

    static table = 'content';    

}
Content.parentStaticMethod(Content)
module.exports = Content;