const mongoose = require("mongoose");
const Schema   = mongoose.Schema;
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const userSchema = new Schema({
  username: String,
  password: String
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;