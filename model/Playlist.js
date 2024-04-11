const Model = require('./Model');
class Playlist  extends Model {

    static get table (){
        return 'playlist'
    };    

}
module.exports = Playlist;