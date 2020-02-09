const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

const hashPassword = text => {
  const hash = bcrypt.hashSync(text, salt);
  return hash;
};

const checkedHashed = bcrypt.compareSync;

module.exports = {
  hashPassword,
  checkedHashed
};
