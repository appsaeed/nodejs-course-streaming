const db = require('../app/db');
const {  isObject } = require('../app/utilities');

class Model {

    static findIndex = 0;
    static crudIndex = 0;

    static whereIndex = 6;

    static orderIndex = 7;
    static limitIndex = 8;

    static queryLength = 10;

    static querys = Array(this.queryLength).fill(null);


    /**
     * Set query in array
     * @param {number} index 
     * @param {any} value 
     */
    static setQuery(index, value) {
        this.querys[index] = value
    }


    /**
     * Get table name
     * @returns {string} table
     */
    static getTable() {
        const tableName = String(this.name).toLowerCase();
        const table = this.table || tableName;
        return table;
    }


    /**
     * Select sql query generator
     * @param {string} select select properties | default *
     */
    static select(select = '*') {
        this.querys[this.findIndex] = `SELECT ${select} FROM ${this.getTable()}`;
        return this;
    }

    /**
     * Generating sql query string from all methods are passed
     * @returns {string}
     */
    static toSql() {
        //filterd falsey values and join them as a single string
        const data = this.querys.filter(Boolean).join(' ') + ';';
        // console.log(data);
        return data;
    }


    /**
     * Generate sql select - where with key/values 
     * @param {string | object} where your selector string | object key pairs
     * @param {string | undefined} value if not passed object fist parameter passes value
     */
    static where(where, value = '') {
        //return back if does not exist key 
        if (!where) return this;

        let wheres = []

        //check the object and make 
        if (isObject(where)) {
            wheres = Object.keys(where).map(key => `${key} = '${where[key]}'`)
        } else {
            wheres.push(`${where} = '${value}'`)
        }

        this.querys[this.whereIndex] = 'WHERE ' + wheres.join(' AND ');

        return this;
    }

    /**
     * Get all results from database
     * @returns {Promise<any[]>}
     */
    static async all() {
        try {
            //clean up previous queries
            this.flashQuery([
                this.whereIndex,
            ])
            //inject select sl query 
            if (!this.querys[this.findIndex]) this.select();

            const query = await db.query(this.toSql());
            return query.rows || [];
        } catch (error) {
            console.log('db all error: ',error);
            return [];
        }
    }

    /**
     * Get selected rows from the database
     * @returns {Promise<any[]>}
     */
    static async get() {
        try {
            //inject select sl query 
            if (!this.querys[this.findIndex]) this.select();

            const query = await db.query(this.toSql());
            return query.rows || [];
        } catch (error) {
            console.log('db get error: ',error);
            return [];
        }
    }

    /**
     * Count rows in the database
     * @returns {Promise<number>}
     */
    static async count() {
        //inject select query
        if (!this.querys[this.findIndex]) this.select();

        const count = await this.all();
        return count.length || 0;
    }

    /**
     * find sinle data from the database
     * @param {number|string} id 
     * @param {string|number} key 
     * @returns {Promise<any|null>}
     */
    static async find(id, key = 'id') {
        try {

            //inject select query
            if (!this.querys[this.findIndex]) this.select();

            const query = await db.query(this.where(key, id).limit(1).toSql());
            return query.rows[0] || null;
        } catch (error) {
            console.log('db find error: ',error);
            return null;
        }
    }

    /**
     * Get first selected row from the database
     * @returns {any|T}
     */
    static async first() {
        try {
            //inject select query
            if (!this.querys[this.findIndex]) this.select();

            const query = await db.query(this.limit(1).toSql());
            return query.rows[0] || null;
        } catch (error) {
            console.log('db first error: ',error);
            return null;
        }
    }

    /**
     * Update sql query generator
     * @param {any} data 
     * @param {string|undefined} value 
     */
    static updateSql(data, value) {

        //clean up previous queries
        this.flashQuery([
            this.limitIndex,
            this.orderIndex,
        ])

        let updates = [];

        if (isObject(data)) {
            updates = Object.keys(data).map(key => `${key}='${data[key]}'`)
        } else {
            updates.push(`${String(data)} = '${value}'`)
        }

        this.querys[this.crudIndex] = `UPDATE ${this.getTable()} SET ` + updates.join(',');

        return this.toSql();
    }

    /**
     * Update record in the database
     * @param {Object<any>|string} data 
     * @param {string|undefined} value 
     * @returns {boolean}
     */
    static async update(data, value = '') {
        try {
            //run update query to database
            await db.query(this.updateSql(data,value));

            return true;
        } catch (error) {
            console.log('db update error: ',error);
            return false;
        }
    }

    /**
     * Delete sql generator
     */
    static deleteSql() {

        //clean up unnecessary queries
        this.flashQuery([
            this.limitIndex,
            this.orderIndex
        ]);

        this.querys[this.crudIndex] = `DELETE FROM ${this.getTable()}`;

        return this.toSql();
    }

    /**
     * Delete a record from the database
     * @returns {boolean}
     */
    static async delete() {
        try {
            //execute delete sql to database
            await db.query(this.deleteSql());
            return true;
        } catch (error) {
            console.log('db delete error: ',error);
            return false;
        }
    }


    /**
     * Generate sql query as string
     * @param {object} data
     * @returns {string}
     */
    static createSql(data) {

        //cleanup all previous queries 
        this.flashQuery('*')

        const keys = Object.keys(data).join(',');
        const values = Object.values(data).map(value => `'${value}'`).join(',');
        const query = `INSERT INTO ${this.getTable()} (${keys}) VALUES (${values})`;

        this.querys[this.crudIndex] = query;

        return this.toSql();
    }

    /**
     * Insert data to database
     * @param {object} data
     */
    static async create(data) {
        try {
            const result = await db.query(this.createSql(data));
            return result.rows[0] || null;
        } catch (error) {
            console.log('db create error: ',error);
            return null;
        }
    }

    /**
     * Generate sql order by | defaul DESC
     * @param {string} key 
     * @param {string} order 
     */
    static orderBy(key, order = 'DESC') {
        if (!key) return this;
        this.querys[this.orderIndex] = `ORDER BY ${key} ${order}`;
        return this;
    }

    /**
     * Sql limit query | default value 10
     * @param {number} limit 
     */
    static limit(limit = 10) {
        if (!limit) return this;
        this.querys[this.limitIndex] = `LIMIT ${limit}`;
        return this;
    }


    /**
     * clean up individual query
     * @param {"*"|number[]} param 
     */
    static flashQuery(param = undefined) {
        if (param === '*') {
            this.querys = Array(this.queryLength).fill(null)
        } else if (Array.isArray(param)) {
            param.forEach(index => {
                this.querys[index] = null;
            })
        } else if (typeof param === 'number') {
            this.querys[param] = null;
        }
        return this;
    }
}

module.exports = Model;
