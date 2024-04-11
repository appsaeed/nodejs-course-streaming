const Model = require('letsql');
class Content extends Model {

    constructor() {
        super();
        this.table = 'content';
        this.fillable = [
            'tutor_id',
            'playlist_id',
            'title',
            'description',
            'video',
            'thumb',
            'date',
            'status'
        ]
    }

}
module.exports = Content;