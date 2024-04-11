const Model = require('./Model');
class User  extends Model {

    static get table (){
        return 'users'
    };   

}
module.exports = User;