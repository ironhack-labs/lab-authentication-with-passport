const bcrypt = require('bcryptjs');

const salt = 10;

const hashPassword = password => (password !== '' ? bcrypt.hashSync(password, salt) : '');

const checkHash = bcrypt.compareSync;
module.exports = { hashPassword, checkHash };
