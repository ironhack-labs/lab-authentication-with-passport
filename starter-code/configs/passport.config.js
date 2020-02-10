const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const flash = require('connect-flash')

const User = require('../models/user')

module.exports = app => {

  passport.serializeUser((user, next) => next(null, user._id))

  passport.deserializeUser((id, next) => {

    User.findById(id, (err, user) => {
      if (err) {
        return next(err)
      }
      next(null, user)
    });
  });


  app.use(flash())

  passport.use(new LocalStrategy({
    passReqToCallback: true
  }, (req, username, password, next) => {
    User.findOne({
      username
    }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {
          message: "Incorrect username"
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {
          message: "Incorrect password"
        });
      }

      return next(null, user);
    });
  }));


}