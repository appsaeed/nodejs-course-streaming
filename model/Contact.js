const Model = require('./Model');
class Contact  extends Model {

    static table = 'contact';    

}
Contact.parentStaticMethod(Contact)
module.exports = Contact;