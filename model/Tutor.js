const Model = require('./Model');
class Tutor  extends Model {

    static table = 'tutors';    

}
Tutor.parentStaticMethod(Tutor)
module.exports = Tutor;