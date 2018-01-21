// Bcrypt to encrypt passwords
// const bcrypt         = require("bcrypt");
// const bcryptSalt     = 10;
// const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const mongoose = require('mongoose');
// User model
const User = require("../models/user");

module.exports.ensureLoggedIn = (req, res, next) => {
  res.render("passport/private", {
    user: req.user
  });
};
module.exports.signup = (req, res, next) => {
  res.render("passport/signup");
};
module.exports.doSignup = (req, res, next) => {
  User.findOne({
      username: req.body.username
    })
    .then(user => {
      if (user != null) {
        res.render('auth/signup', {
          user: user,
          error: {
            username: 'Username already exists'
          }
        });
      } else {
        user = new User(req.body);
        user.save()
          .then(() => {
            req.session.currentUser = user;
            res.render("passport/private", {
              user: user
            });
          }).catch(error => {
            if (error instanceof mongoose.Error.ValidationError) {
              res.render('auth/signup', {
                user: user,
                error: error.errors
              });
            } else {
              next(error);
            }
          });
      }
    }).catch(error => next(error));
};