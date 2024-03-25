const { Pool } = require('pg');

class DB {

    constructor() {
        this.pool = new Pool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USERNAME,
            database: process.env.DB_DATABASE,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT || 5432,
        });
    }

    static async query(sql, params) {
        const client = await DB.pool.connect(); // Use DB.pool instead of this.pool
        try {
            const result = await client.query(sql, params);
            return result.rows;
        } finally {
            client.release();
        }
    }

    static async getAllByStatus(tableName, status) {
        const sql = `SELECT * FROM ${tableName} WHERE status = $1`;
        return await DB.query(sql, [status]);
    }

    static async insertWithStatus(tableName, data, status) {
        // Add the status to the data object before inserting
        const dataWithStatus = { ...data, status };
        return await DB.insert(tableName, dataWithStatus);
    }

    static async updateStatusById(tableName, id, status) {
        const data = { status };
        return await DB.updateById(tableName, id, data);
    }

    static async deleteByStatus(tableName, status) {
        const sql = `DELETE FROM ${tableName} WHERE status = $1 RETURNING *`;
        return await DB.query(sql, [status]);
    }
    
    // Other existing methods...
}

module.exports = DB;
