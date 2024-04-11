const Model = require('letsql');
class Contact extends Model {

    constructor() {
        super();
        this.table = 'contact';
        this.fillable = [
            'name', 'email', 'number', 'message'
        ]
    }

}
module.exports = Contact;