'use strict';

const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: String,
  password: String
 
}, {
  timestamps: true
});

const signInStatic = function(username, password) {
  
  const Model = this;
  
  let auxiliaryUser;

  return Model.findOne({ username })
    .then(user => {
      if (!user) {
        throw new Error('USER_NOT_FOUND');
      } else {
        auxiliaryUser = user;
        return bcrypt.compare(password, user.passwordHash);
      }
    })
    .then(matches => {
      if (!matches) {
        throw new Error('PASSWORD_DOESNT_MATCH');
      } else {
        return Promise.resolve(auxiliaryUser);
      }
    })
    .catch(error => {
      console.log('There was an error signing up the user', error);
      return Promise.reject(error);
    });
};

const signUpStatic = function(username, password) {
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
      return Promise.reject(new Error('There was an error in the sign up process.'));
    });
};

userSchema.statics.signIn = signInStatic;
userSchema.statics.signUp = signUpStatic;





const User = mongoose.model('User', userSchema);

module.exports = User;
