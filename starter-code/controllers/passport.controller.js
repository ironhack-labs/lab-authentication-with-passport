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
        res.render('passport/signup', {
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
              res.render('passport/signup', {
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

module.exports.login = (req, res, next) => {
  res.render("passport/login");
};

module.exports.doLogin = (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    res.render('passport/login', {
      user: {
        username: username
      },
      error: {
        username: username ? '' : 'Username is required',
        password: password ? '' : 'Password is required'
      }
    });
  } else {
    //EJECUTA el local-auth de passport y te devuelve error, user y validator
    passport.authenticate('local-auth', (error, user, validations) => {
      if (error) {
        next(error);
      } else if (!user) {
        res.render('passport/login', {
          user: {
            username: username
          },
          error: validations
        });
      } else {
        //LO PUEDES PONER EN CUALQUIER LADO PARA LOGEAR A ALGUIEN
        req.login(user, (error) => {
          if (error) {
            next(error);
          } else {
            res.render('passport/private', {
              user: {
                username: username
              },
              error: validations
            });
          }
        });
      }
    })(req, res, next);
  }
};