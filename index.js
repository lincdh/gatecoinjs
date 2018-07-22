const publiceps = require('./lib/publiceps');
const autheps = require('./lib/autheps');

module.exports = {
    ...publiceps,
    ...autheps
}