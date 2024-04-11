const Model = require('./Model');
class Tutor  extends Model {

    static get table (){
        return 'tutors'
    };    

}
module.exports = Tutor;