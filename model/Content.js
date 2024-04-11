const Model = require('./Model');
class Content  extends Model {

    static get table (){
        return 'content'
    };    

}
module.exports = Content;