const Model = require('letsql');
class Playlist extends Model {

    constructor() {
        super();
        this.table = 'playlist';
        this.fillable = ['tutor_id', 'title', 'description', 'thumb', 'date', 'status']
    }

}
module.exports = Playlist;