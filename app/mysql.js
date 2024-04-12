const mysql = require('mysql2');

global.sql = {};
global.sql.conn = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'nodejs_course'
});

if (sql.conn.state === 'disconnected') {
    sql.conn.connect(function(err) {
        if (err) throw err;
        console.log("MySQL Connected!");
    });
}

sql.conn.on('error', function(err) {
    console.log('db error', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        setTimeout(() => {
            sql.conn.connect(function(err) {
                if (err) throw err;
                console.log("MySQL Connected!");
            });
        }, 2000);
    } else {
        throw err;
    }
});

const query = async (query, bindings = []) => {
    return new Promise((resolve, reject) => {
        sql.conn.query(query, bindings, function (err, result) {
            if (err) throw err;
            resolve(result);
        });
    });
}

module.exports = {
    query
}