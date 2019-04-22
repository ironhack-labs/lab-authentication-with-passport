const express = require('express');
const router  = express.Router();
const ensureLogin = require('connect-ensure-login')
const passport = require("passport")
const bcrypt = require("bcrypt")
const User = require("../models/user")
const localStrategy = require("passport-local").Strategy;

passport.serializeUser((user, cb) => {
  cb(null, user._id);
 });
 
 passport.deserializeUser((id, cb) => {
  User.findById(id, (err, user) => {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
 });

 passport.use(
  new localStrategy(
    async (username, password, next) => {
    try {
      const user = await User.findOne({ username });
      if (!user) return next(null, false, {
        message: "Incorrect username"
       })
      if (!bcrypt.compareSync(password, user.password)) return next(null, false, {
        message: 'Incorrect password'
      })
 
      return next(null, next)
 
    } catch (error) {
      return next(error);
    }
  })
 );

 module.exports = passport;