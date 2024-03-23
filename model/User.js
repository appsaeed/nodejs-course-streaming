const Model = require('./Model');
class User  extends Model {

    static table = 'users';    

}
User.parentStaticMethod(User)
module.exports = User;