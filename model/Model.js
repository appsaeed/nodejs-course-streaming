const db = require('../app/db');

class Model {

    static parentStaticMethod(child) {
        child.querys = [null, null, null, null];
        child.table = this.table;
    }

    static toSql() {
        if (!this.querys[0]) this.select();
        return this.querys.filter(Boolean).join(' ') + ';';
    }

    static async all() {
        const query = await db.query(this.toSql());
        return query.rows || [];
    }

    static async get() {
        const query = await db.query(this.toSql());
        return query.rows || [];
    }

    static async count() {
        const count = await this.get();
        return count.length || 0;
    }

    static select(select = '*') {
        this.querys[0] = `SELECT ${select} FROM ${this.table}`;
        return this;
    }

    static async find(id, key = 'id') {
        const query = await db.query(this.where(key, id).toSql());
        return query.rows[0] || null;
    }

    static async first() {
        const query = await db.query(this.limit(1).toSql());
        return query.rows[0] || null;
    }

    static where(key, value = '') {
        if (!key) return this;

        if (typeof key === 'object') {
            let wheres = [];
            for (const k in key) {
                wheres.push(`${k} = '${key[k]}'`);
            }
            this.querys[1] = 'WHERE ' + wheres.join(', ');
            return this;
        }

        this.querys[1] = `WHERE ${key} = '${value}'`;
        return this;
    }

    static orderBy(key, order = 'DESC') {
        if (!key) return this;
        this.querys[2] = `ORDER BY ${key} ${order}`;
        return this;
    }

    static limit(limit = 10) {
        if (!limit) return this;
        this.querys[3] = `LIMIT ${limit}`;
        return this;
    }
}

module.exports = Model;
