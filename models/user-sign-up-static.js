'use strict';

const bcrypt = require('bcryptjs');

module.exports = function(username, password) {
  const Model = this;

  return bcrypt.hash(password, 10)
  .then(hash => {
    return Model.create({
      username, 
      passwordHash: hash
    });
  })
  .then(user => {
    return Promise.resolve(user);
  })
  .catch(error => {
    console.log(error);
    return Promise.reject( new Error('There was an error when trying to sign up', error));
  });
};