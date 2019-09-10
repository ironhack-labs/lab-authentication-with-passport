'use strict';

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, 
    lowercase: true, 
    trim: true, 
    unique: true
  },
  passwordHash: {
    type: String, 
    required: true
  }
});

// const signInStatic = require('./user-sign-in-static');
const signUpStatic = require('./user-sign-up-static');

// userSchema.statics.signIn = signInStatic;
userSchema.statics.signUp = signUpStatic;

const User = mongoose.model('User', userSchema);

module.exports = User;
