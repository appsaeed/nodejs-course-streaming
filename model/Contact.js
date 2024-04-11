const Model = require('./Model');
class Contact  extends Model {

    static get table(){
        return 'contact';
    }    

}
module.exports = Contact;