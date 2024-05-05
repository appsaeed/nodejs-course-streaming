const connection = require('../app/mysql')
const _queryBuilder = require('./builder')
const _filter = require('./filter')

async function _process(reset = true) {
    if (!this.table) {
        console.log('\x1b[41m\x1b[37m%s\x1b[0m', 'Table name is not set!');
        throw new Error('Table name is not set!');
    }
    let _q = this._query
    if(reset) this._query = {};
    // return query.sql;
    const data = await connection.query(this.toRaw());

    const doCast = _q.action === 'select' && this.casts && Object.keys(this.casts).length > 0;
    const doRelation = _q.action === 'select' && _q.relations?.length > 0;
    const doHideField = _q.action === 'select' && this.hidden && this.hidden.length > 0;

    // relation
    let dataRelation = {};
    if (doRelation) {
        // loop through each relation to get data
        await Promise.all(_q.relations.map(async relation => {
            // get mainField, it's the field that will be used to get ids
            let mainField = relation.type === 'belongsTo' ? relation.foreignKey : relation.localKey;
            // get related ids, remove duplicate ids, and check if ids is not empty
            let ids = data.map(row => row[mainField]);
            ids = ids.filter(id => id !== undefined && id !== null); // remove undefined and null ids
            if (ids.length === 0) return;

            let model = relation.model;
            console.log('mode:::::',model);
            let callback = relation.callback;
            model.selectMore([])
            if (callback && typeof callback === 'function') {
                callback(model)
            }
            // get relatedField, it's the field that will be used to get data using ids
            let relatedField = relation.type === 'belongsTo' ? relation.localKey : relation.foreignKey;
            let results = await model.whereIn(relatedField, ids).get();
            dataRelation[relation.identifier] = {};
            if (relation.type === 'belongsTo' || relation.type === 'hasOne') { // one to one
                dataRelation[relation.identifier]['empty'] = null;
                dataRelation[relation.identifier]['key'] = mainField;
                dataRelation[relation.identifier]['data'] = results.reduce((map, row) => {
                    if (!row[relatedField]) throw new Error(`Field ${relatedField} is not exist in relation result!`);
                    map[row[relatedField]] = row;
                    return map;
                }, {});
            } else { // has many
                dataRelation[relation.identifier]['empty'] = [];
                dataRelation[relation.identifier]['key'] = mainField;
                dataRelation[relation.identifier]['data'] = results.reduce((map, row) => {
                    if (!row[relatedField]) throw new Error(`Field ${relatedField} is not exist in relation result!`);
                    if (!map[row[relatedField]]) map[row[relatedField]] = [];
                    map[row[relatedField]].push(row);
                    return map;
                }, {});
            }
        }))
    }

    // post process data
    if (data?.length > 0 && (doCast || doRelation || doHideField)) {
        this.resultData = data.map((row, idx) => {
            if (doCast) {
                row = _filter.casts(row, this.casts);
            }
            if (doRelation) {
                // iterate through relations and set data value
                for (let identifier in dataRelation) {
                    let key = row[dataRelation[identifier]['key']];
                    if (dataRelation.hasOwnProperty(identifier)) {
                        row[identifier] = dataRelation[identifier]['data'][key] ?? dataRelation[identifier]['empty'];
                    }
                }
            }
            if (doHideField) {
                // iterate through hidden fields and remove it from data
                for (let i = 0; i < this.hidden.length; i++) {
                    delete row[this.hidden[i]];
                }
            }
            return row;
        })
    } else {
        this.resultData = data;
    }

    return this.resultData
}


/** @class Model */
class Model {

    static table = 't'; // init table, must be overridden by child class
    static primaryKey = 'id'; // can be overridden by child class
    static fillable = []; // can be overridden by child class
    static guarded = []; // can be overridden by child class
    static hidden = []; // can be overridden by child class
    static timestamp = true; // can be overridden by child class
    static softDelete = false; // can be overridden by child class
    static perPage = 10; // can be overridden by child class
    static casts = {}; // can be overridden by child class
    static _query= {}; // init query. should not be overridden by child class

    static flash(child){
        // this._query = {}
        // console.log(this._query)
        return child;
    }

    /**
     * If select is empty, then use all default fields
     * @param fields - single string (with comma separated) or multiple arguments or array of fields
     */
    static select(fields) {
        // can accept multiple arguments or array of fields or single string including comma separated fields
        if (arguments.length > 1) fields = Array.from(arguments);
        else if (typeof fields === 'string') fields = fields.split(',');
        if (fields?.length > 0) {
            this._query.select = fields;
        }
        return this;
    }

    /**
     * Add more fields to select, if except is not empty, then remove fields from select.
     * If fields is empty, then use all default fields
     * @param fields
     * @param excepts
     */
    static selectMore(fields = [], excepts = []) {
        this._query.select = this._query.select ?? [];
        if (fields.length > 0) {
            this._query.select = this._query.select.concat(fields);
        }
        if (excepts.length > 0) {
            this._query.select = this._query.select.filter(field => !excepts.includes(field));
        }
        return this;
    }

    /**
     * Add join to query
     * @param table - table name to join
     * @param first - first field to join
     * @param operator - operator
     * @param second - second field to join
     * @param type - type of join (INNER, LEFT, RIGHT, etc.). Default is INNER.
     */
    static join(table, first, operator, second, type = 'INNER') {
        this._query.joins = this._query.joins ?? [];
        this._query.joins.push({ table, first, operator, second, type });
        return this;
    }

    /**
     * Add LEFT JOIN to query
     * @param table - table name to join
     * @param first - first field to join
     * @param operator - operator
     * @param second - second field to join
     */
    static leftJoin(table, first, operator, second) {
        return this.join(table, first, operator, second, 'LEFT');
    }

    /**
     * Add WHERE clause to query.
     * If field is an object, then treat it as equal operator with field as key and value as value.
     * If field is a string, then treat it as equal operator with field as key and operator as value.
     * If all arguments are present, then treat as it is.
     * @param field
     * @param operator
     * @param value
     */
    static where(field, operator, value) {
        this._query.where = this._query.where ?? [];
        if (arguments.length === 1 && typeof field === 'object') {
            // if field is an object key-value pair, we treat it as equal operator with field as key and value as value
            for (let f in field) {
                if (field.hasOwnProperty(f))
                    this._query.where.push({ field: f, operator: '=', value: field[f], condition: 'AND' });

            }
        } else if (arguments.length === 2) {
            // if arguments length is 2, we treat it as equal operator with first argument as field and second argument as value
            this._query.where.push({ field: field, operator: '=', value: operator, condition: 'AND' });
        } else if (arguments.length === 3) {
            this._query.where.push({ field: field, operator: operator, value: value, condition: 'AND' });
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * Add raw WHERE clause to query.
     * @param raw - raw query
     * @returns {Model}
     */
    static whereRaw(raw) {
        this._query.where = this._query.where ?? [];
        this._query.where.push({ raw: raw, condition: 'AND' });
        return this;
    }

    /**
     * Add OR WHERE clause to query.
     * If field is an object, then treat it as equal operator with field as key and value as value.
     * If field is a string, then treat it as equal operator with field as key and operator as value.
     * If all arguments are present, then treat as it is.
     * @param field
     * @param operator
     * @param value
     */
    static orWhere(field, operator, value) {
        this._query.where = this._query.where ?? [];
        if (arguments.length === 1 && typeof field === 'object') {
            // if field is an object key-value pair, we treat it as equal operator with field as key and value as value
            for (let f in field) {
                if (field.hasOwnProperty(f))
                    this._query.where.push({ field: f, operator: '=', value: field[f], condition: 'OR' });
            }
        } else if (arguments.length === 2) {
            // if arguments length is 2, we treat it as equal operator with first argument as field and second argument as value
            this._query.where.push({ field: field, operator: '=', value: operator, condition: 'OR' });
        } else if (arguments.length === 3) {
            this._query.where.push({ field: field, operator: operator, value: value, condition: 'OR' });
        } else {
            throw new Error('Invalid arguments');
        }
        return this;
    }

    /**
     * Add raw OR WHERE clause to query.
     * @param raw - raw query
     * @returns {Model}
     */
    static orWhereRaw(raw) {
        this._query.where = this._query.where ?? [];
        this._query.where.push({ raw: raw, condition: 'OR' });
        return this;
    }

    /**
     * Add WHERE IN clause to query
     * @param field - field name
     * @param values - array of values
     */
    static whereIn(field, values = []) {
        this._query.where = this._query.where ?? [];
        this._query.where.push({ field: field, operator: 'IN', value: values, condition: 'AND' });
        return this;
    }

    /**
     * Add WHERE NOT IN clause to query
     * @param field - field name
     * @param values - array of values
     */
    static whereNotIn(field, values) {
        this._query.where = this._query.where ?? [];
        this._query.where.push({ field: field, operator: 'NOT IN', value: values, condition: 'AND' });
        return this;
    }

    /**
     * Add WHERE IS NULL clause to query
     * @param field
     * @returns {Model}
     */
    static whereNull(field) {
        this._query.where = this._query.where ?? [];
        this._query.where.push({ field: field, operator: 'IS', value: 'NULL', condition: 'AND' });
        return this;
    }

    /**
     * Add WHERE IS NOT NULL clause to query
     * @param field
     * @returns {Model}
     */
    static whereNotNull(field) {
        this._query.where = this._query.where ?? [];
        this._query.where.push({ field: field, operator: 'IS NOT', value: 'NULL', condition: 'AND' });
        return this;
    }

    /**
     * Include soft deleted data
     * @returns {Model}
     */
    static withTrashed() {
        this._query.withTrashed = true;
        return this;
    }

    /**
     * Add ORDER BY clause to query
     * @param field - field name
     * @param direction - ASC or DESC
     */
    static orderBy(field, direction = 'ASC') {
        this._query.orderBy = { field: field, direction: direction.toUpperCase() };
        return this;
    }

    /**
     * Add GROUP BY clause to query
     * @param fields - single string (with comma separated) or multiple arguments or array of fields
     */
    static groupBy(fields) {
        if (arguments.length > 1) fields = Array.from(arguments);
        else if (typeof fields === 'string') fields = fields.split(',');
        if (fields?.length > 0) {
            this._query.groupBy = fields;
        }
        return this;
    }

    /**
     * Add LIMIT and OFFSET clause to query
     * @param limit - number of rows to be returned
     * @param offset - number of rows to be skipped
     */
    static limit(limit, offset = 0) {
        this._query.limit = limit;
        this._query.offset = offset;
        return this;
    }

    /**
     * Add hasMany relationship to result. Get all record that holds the current model primary key.
     * @param model - model class
     * @param foreignKey - foreign key. It's the related-model field that will be used to get the parent model
     * @param localKey - local key. It's the field that the related-model will refer to
     * @param name - identifier name. If not set, we use table name
     * @param callback - callback function to modify query
     */
    static hasMany(model, foreignKey, localKey, name = '', callback = null) {
        // if (typeof model === 'function') model = new model();
        if (!name) name = model.table;
        this._query.relations = this._query.relations ?? [];
        this._query.relations.push({ 
            model: model, 
            foreignKey, 
            localKey, 
            identifier: name, 
            type: 'hasMany', 
            callback 
        });
        return this;
    }

    /**
     * Add hasOne relationship to result. Get single record that holds the current model primary key.
     * @param model - model class
     * @param foreignKey - foreign key. It's the related-model field that will be used to get the parent model
     * @param localKey - local key. It's the field that the related-model will refer to
     * @param name - identifier name. If not set, we use table name
     * @param callback - callback function to modify query
     * @returns {Model}
     */
    static hasOne(model, foreignKey, localKey, name = '', callback = null) {
        // if (typeof model === 'function') model = new model();
        if (!name) name = model.table;
        this._query.relations = this._query.relations ?? [];
        this._query.relations.push({ model: model, foreignKey, localKey, identifier: name, type: 'hasOne', callback });
        return this;
    }

    /**
     * Add belongsTo relationship to result. Get single record that the current model belongs to.
     * @param model - model class
     * @param foreignKey - foreign key. It's the field that will be used to get the related-model
     * @param ownerKey - owner key. It's the target (related-model) field that the model refers to
     * @param name - identifier name. If not set, we use table name
     * @param callback - callback function to modify query
     */
    static belongsTo(model, foreignKey, ownerKey, name = '', callback = null) {
        // if (typeof model === 'function') model = new model();
        if (!name) name = model.table;
        this._query.relations = this._query.relations ?? [];
        this._query.relations.push({ model: model, foreignKey, localKey: ownerKey, identifier: name, type: 'belongsTo', callback });
        return this;
    }

    /**
     * Add with clause to query. This will add relationship data to result.
     * @param relation - single string of relation or array of relations
     */
    static with(relation) {
        this._query.with = this._query.with ?? [];
        if (typeof relation === 'string') relation = [relation];
        for (let i = 0; i < relation.length; i++) {
            // check if relation function exists
            if (typeof this[relation[i]] !== 'function') throw new Error(`Relation ${relation[i]} doesn't exist!`);
            eval(`this.${relation[i]}()`)
        }
        return this;
    }

    // TODO: add withCount

    /**
     * Execute raw query
     * @param query - string of query
     */
    static async rawQuery(query) {
        this._query.rawQuery = query;
        return await this.get();
    }

    /**
     * Get data with pagination
     * @param page - page number
     * @param perPage - number of rows per page
     */
    static async paginate(page = 0, perPage = 0) {
        if (typeof page !== 'number') page = Number(page);
        if (typeof perPage !== 'number') perPage = Number(perPage);
        // if page and perPage is not set, then use query limit and offset if any
        if (page < 1) page = Math.floor((this._query.offset ?? 0) / (this._query.limit ?? this.perPage) + 1)
        if (perPage < 1) perPage = this._query.limit ?? this.perPage;
        this._query.limit = perPage;
        this._query.offset = (page - 1) * perPage;

        // check if soft delete is enabled
        if (this.softDelete && !this._query.withTrashed) this.whereNull('deleted_at');

        this._query.action = 'select';
        const data = await _process.call(this, false)

        // remove last where that been added by soft delete, although it's okay to have same where clause
        if (this.softDelete && !this._query.withTrashed) this._query.where.pop();

        // reset limit and offset
        this._query.limit = null;
        this._query.offset = null;
        const total = await this.count();
        const pages = Math.ceil(total / perPage);
        return {
            data: data,
            total: total,
            pages: pages,
            page: page,
            perPage: perPage,
            nextPage: page < pages ? page + 1 : null,
            prevPage: page > 1 && page <= pages ? page - 1 : null,
        };
    }

    /**
     * Get all data
     * @returns {Promise<unknown>}
     */
    static async get() {
        // check if soft delete is enabled
        if (this.softDelete && !this._query.withTrashed) this.whereNull('deleted_at');

        this._query.action = 'select';
        return await _process.call(this)
    }
    /**
     * Get all data
     * @returns {Promise<unknown>}
     */
    static async all() {
        // check if soft delete is enabled
        if (this.softDelete && !this._query.withTrashed) this.whereNull('deleted_at');

        this._query.action = 'select';
        return await _process.call(this)
    }

    /**
     * Get first data
     * @returns {Promise<*|null>}
     */
    static async first() {
        this._query.limit = 1;
        let result = await this.get();
        return result[0] ?? null;
    }

    /**
     * Find data by primary key
     * @param primaryKey - primary key value
     * @returns {Promise<*|null>}
     */
    static async find(primaryKey) {
        this._query.where = [];
        return await this.where(this.primaryKey, primaryKey).first();
    }

    /**
     * Get data count
     * @returns {Promise<*|number>}
     */
    static async count() {
        // select count only
        this._query.select = ['COUNT(*) as count'];
        let result = await this.first();
        return result?.count ?? 0;
    }

    // INSERT
    /**
     * Insert data
     * @param data
     * @returns {Promise<unknown>}
     */
    static async insert(data) {
        this._query.data = _filter.fields(data, this.fillable, this.guarded);
        if (Object.keys(this._query.data).length === 0) return null;

        if (this.timestamp) {
            this._query.data.created_at = new Date();
        }

        this._query.action = 'insert';
        return await _process.call(this);
    }

    // UPDATE
    /**
     * Update data
     * @param data
     * @returns {Promise<unknown>}
     */
    static async update(data) {
        this._query.data = _filter.fields(data, this.fillable, this.guarded);
        if (Object.keys(this._query.data).length === 0) return null;
        // for safety, update query must have where clause
        if (this._query.where === undefined) throw new Error('Update query must have where clause!');

        // check if soft delete is enabled
        if (this.softDelete && !this._query.withTrashed) this.whereNull('deleted_at');

        if (this.timestamp) {
            this._query.data.updated_at = new Date();
        }

        this._query.action = 'update';
        return await _process.call(this)
    }

    // DELETE
    /**
     * Delete data. If soft delete is enabled, it will set `deleted_at` column to current datetime.
     * @returns {Promise<unknown>}
     */
    static async delete() {
        // check if soft delete is enabled
        if (this.softDelete) {
            // get only non-deleted data
            this.whereNull('deleted_at')
            // if soft delete is enabled, then update deleted_at column
            this._query.data = { deleted_at: new Date() };
            this._query.action = 'update';
        } else {
            this._query.action = 'delete';
        }
        return await _process.call(this)
    }

    /**
     * Force delete data. Delete data permanently even if soft delete is enabled.
     * @returns {Promise<unknown>}
     */
    static async forceDelete() {
        this._query.action = 'delete';
        return await _process.call(this)
    }

    static toRaw(){
        const sql = _queryBuilder(this.table, this._query).sql;
        // this._query = {};
        return sql;
    }
}

module.exports = Model;