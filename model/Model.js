const db = require('../app/db');
const { isObject } = require('../app/utilities');

class Model {
    static findIndex = 0;
    static crudkIndex = 1;
    static crudvIndex = 2;
    static tableIndex = 3;
    static whereIndex = 4;
    static orderIndex = 5;
    static limitIndex = 6;
    static queryLength = 7;
    static querys = Array(this.queryLength).fill(null);

    static getTable() {
        const tableName = String(this.name).toLowerCase();
        const table = this.querys[this.tableIndex] || tableName;
        return table;
    }

    static select(select = '*') {
        this.querys[this.findIndex] = `SELECT ${select} FROM`;
        return this.resetQueryPartsAfter(this.findIndex);
    }

    static toSql() {
        this.querys[this.tableIndex] = this.getTable();
        const data = this.querys.filter(Boolean).join(' ') + ';';
        console.log(data);
        return data;
    }

    static where(where, value = '') {
        if (!where) return this;

        let wheres = [];

        if (isObject(where)) {
            wheres = Object.keys(where).map(key => `${key} = '${where[key]}'`);
        } else {
            wheres.push(`${where} = '${value}'`);
        }

        this.querys[this.whereIndex] = 'WHERE ' + wheres.join(' AND ');

        return this.resetQueryPartsAfter(this.whereIndex);
    }

    static orderBy(key, order = 'DESC') {
        if (!key) return this;
        this.querys[this.orderIndex] = `ORDER BY ${key} ${order}`;
        return this.resetQueryPartsAfter(this.orderIndex);
    }

    static limit(limit = 10) {
        if (!limit) return this;
        this.querys[this.limitIndex] = `LIMIT ${limit}`;
        return this.resetQueryPartsAfter(this.limitIndex);
    }

    static resetQueryPartsAfter(index) {
        for (let i = index + 1; i < this.queryLength; i++) {
            this.querys[i] = null;
        }
        return this;
    }

    static async all() {
        try {
            this.resetQueryPartsAfter(this.whereIndex);
            if (!this.querys[this.findIndex]) this.select();
            const query = await db.query(this.toSql());
            return query.rows || [];
        } catch (error) {
            console.log('db all error: ', error);
            return [];
        }
    }

    static async get() {
        try {
            if (!this.querys[this.findIndex]) this.select();
            const query = await db.query(this.toSql());
            this.resetQueryPartsAfter(this.findIndex);
            return query.rows || [];
        } catch (error) {
            console.log('db get error:', error);
            return [];
        }
    }

    static async count() {
        const count = await this.get();
        return count.length || 0;
    }

    static async find(id, key = 'id') {
        try {
            this.resetQueryPartsAfter(this.findIndex);
            if (!this.querys[this.findIndex]) this.select();
            const query = await db.query(this.where(key, id).limit(1).toSql());
            return query.rows[0] || null;
        } catch (error) {
            console.log('db find error:', error);
            return null;
        }
    }

    static async first() {
        try {
            if (!this.querys[this.findIndex]) this.select();
            const query = await db.query(this.limit(1).toSql());
            return query.rows[0] || null;
        } catch (error) {
            console.log('db first error:', error);
            return null;
        }
    }

    static updateSql(data, value) {
        this.resetQueryPartsAfter(this.limitIndex);
        let updates = [];
        if (isObject(data)) {
            updates = Object.keys(data).map(key => `${key}='${data[key]}'`);
        } else {
            updates.push(`${String(data)} = '${value}'`);
        }
        this.querys[this.crudkIndex] = `UPDATE`;
        this.querys[this.crudvIndex] = 'SET ' + updates.join(',');
        return this.toSql();
    }

    static async update(data, value = '') {
        try {
            await db.query(this.updateSql(data, value));
            return true;
        } catch (error) {
            console.log('db update error:', error);
            return false;
        }
    }

    static deleteSql() {
        this.resetQueryPartsAfter(this.limitIndex);
        this.querys[this.crudkIndex] = `DELETE FROM`;
        return this.toSql();
    }

    static async delete() {
        try {
            await db.query(this.deleteSql());
            return true;
        } catch (error) {
            console.log('db delete error:', error);
            return false;
        }
    }

    static createSql(data) {
        this.resetQueryPartsAfter(this.findIndex);
        const keys = Object.keys(data).join(',');
        const values = Object.values(data).map(value => `'${value}'`).join(',');
        this.querys[this.crudkIndex] = 'INSERT INTO';
        this.querys[this.crudvIndex] = `(${keys}) VALUES (${values})`;
        return this.toSql();
    }

    static async create(data) {
        try {
            const result = await db.query(this.createSql(data));
            this.resetQueryPartsAfter(this.findIndex);
            return result.rows[0] || null;
        } catch (error) {
            console.log('db create error:', error);
            return null;
        }
    }

    static flashQuery(param = undefined) {
        if (param === '*') {
            this.querys = Array(this.queryLength).fill(null);
        } else if (Array.isArray(param)) {
            param.forEach(index => {
                this.querys[index] = null;
            });
        } else if (typeof param === 'number') {
            this.querys[param] = null;
        }
        return this;
    }
}

module.exports = Model;
