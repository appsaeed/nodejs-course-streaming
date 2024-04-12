const Model = require('./Model');
const Tutor = require('./Tutor');
class Content  extends Model {

    static table = 'content';    

    static tutor() {
        this.hasOne(Tutor, 'id', 'tutor_id', 'tutor');
        return this;
    }

}
Content.flash(Content);
module.exports = Content;