const bcrypt = require('bcrypt');
function hash(password) {
    return bcrypt.hashSync(password, 10);
}
function hasCompare(password, hash) {
    return bcrypt.compareSync(password, hash);
}

function isObjectLike(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
}
function isObject(obj) {
    return obj?.constructor === Object;
}
module.exports = { hash, hasCompare ,isObjectLike, isObject}
