const Model = require('./Model');
class User  extends Model {

    static table = 'users';    

}
// User.flash(User)
module.exports = User;