const passportLocalMongoose = require('passport-local-mongoose')
const mongoose = require("mongoose");

const userSchema = new require('mongoose').Schema({
  username: String,
},
{
  timestamps:{
    createdAt: "created_at", 
    updatedAt: "updated_at" 
  }
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'username'});
module.exports = require('mongoose').model('User', userSchema)