const Model = require('./Model');
const Tutor = require('./Tutor');
class Contact  extends Model {

    static get table() { return 'contact'};    

    static tutor() {
        this.hasOne(Tutor, 'id', 'tutor_id', 'tutor');
        return this;
    }

}
Contact.flash(Contact)
module.exports = Contact;