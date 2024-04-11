const Model = require('letsql');
class Tutor extends Model {

    constructor() {
        super();
        this.table = 'tutors';
        this.fillable = ['name', 'profession', 'email', 'password', 'image']
    }

}
module.exports = Tutor;