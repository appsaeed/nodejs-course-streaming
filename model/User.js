const Model = require('letsql');
class User  extends Model { 
    constructor() {
        super();
        this.table = 'users';
        this.fillable = ['name', 'email', 'password', 'image']
    }
}
module.exports = User;