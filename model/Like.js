const Model = require('./Model');
class Like  extends Model {
    
    static get table(){
        return 'likes';
    }

}
module.exports = Like;