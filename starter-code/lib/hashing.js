const bcrypt = require('bcryptjs');

const salt = 10;

const hashPassword = password => bcrypt.hashSync(password, salt);

module.exports = { hashPassword };
