const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;


passport.serializeUser((user, callback) => {
    callback(null, user._id)
  });
passport.deserializeUser((id, callback) => {
    User.findById(id)
      .then(userObj => {
        callback(null, userObj)
      })
      .catch(e => {
        callback(e)
      })
  });

passport.use(
    new LocalStrategy((username, password, callback) => {
      User.findOne({ username })
        .then(user => {
          if(!user) {
            return callback(null, false, { message: 'Incorrect username'})
          }
          bcrypt.compare(password, user.password, (err, same) => {
            if(!same) {
              callback(null, false, { message: 'password incorrect'})
            } else {
              callback(null, user)
            }
          })
        })
    })
  )

  module.exports = passport 