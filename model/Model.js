const db = require('../app/db');

class Model {
    static selectIndex = 0;
    static whereIndex = 6;
    static orderIndex = 7;
    static limitIndex = 8;

    static parentStaticMethod(child) {
        child.querys = Array(10).fill(null);
        child.table = this.table;
    }

    static toSql() {
        if (!this.querys[0]) this.select();
        return this.querys.filter(Boolean).join(' ') + ';';
    }

    static async all() {
        try {
            const query = await db.query(this.toSql());
            return query.rows || [];
        } catch (error) {
            console.error('Error fetching all records:', error);
            return [];
        }
    }

    /**
     * 
     * @returns {Promise<Array>}
     */
    static async get() {
        const query = await db.query(this.toSql());
        return query.rows || [];
    }

    static async count() {
        const count = await this.all();
        return count.length || 0;
    }

    static async find(id, key = 'id') {
        try {
            const query = await db.query(this.where(key, id).toSql());
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error fetching record by ID:', error);
            return null;
        }
    }

    static async first() {
        try {
            const query = await db.query(this.limit(1).toSql());
            return query.rows[0] || null;
        } catch (error) {
            console.error('Error fetching first record:', error);
            return null;
        }
    }

    static where(key, value = '') {
        if (!key) return this;

        if (typeof key === 'object') {
            const wheres = [];
            for (const k in key) {
                wheres.push(`${k} = '${key[k]}'`);
                this.querys[this.whereIndex] = 'WHERE ' + wheres.join(' AND ');
            }
        } else {
            this.querys[this.whereIndex] = `WHERE ${key} = '${value}'`;
        }
        return this;
    }

    static async create(data) {
        try {
            const keys = Object.keys(data).join(',');
            const values = Object.values(data).map(value => `'${value}'`).join(',');
            const query = `INSERT INTO ${this.table} (${keys}) VALUES (${values}) RETURNING *`;
            const result = await db.query(query);
            return result.rows[0] || null;
        } catch (error) {
            console.error('Error creating record:', error);
            return null;
        }
    }

    static async update(data) {
        try {
            const entries = Object.entries(data);
            // eslint-disable-next-line no-unused-vars
            const updates = entries.map(([key, value], index) => `${key} = $${index + 1}`);
            const values = Object.values(data);
            const query = `UPDATE ${this.table} SET ${updates.join(',')} ${this.querys[this.whereIndex]}`;
            await db.query(query, values);
            return true;
        } catch (error) {
            console.error('Error updating record:', error);
            return false;
        }
    }

    static async delete() {
        try {
            const query = `DELETE FROM ${this.table} ${this.querys[this.whereIndex]}`;
            await db.query(query);
            return true;
        } catch (error) {
            console.error('Error deleting record:', error);
            return false;
        }
    }

    static select(select = '*') {
        this.querys[0] = `SELECT ${select} FROM ${this.table}`;
        return this;
    }

    static orderBy(key, order = 'DESC') {
        if (!key) return this;
        this.querys[this.orderIndex] = `ORDER BY ${key} ${order}`;
        return this;
    }

    static limit(limit = 10) {
        if (!limit) return this;
        this.querys[this.limitIndex] = `LIMIT ${limit}`;
        return this;
    }
}

module.exports = Model;
