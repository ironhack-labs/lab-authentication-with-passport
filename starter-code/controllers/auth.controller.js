const mongoose = require('mongoose');
const User = require('../models/user');
const passport = require('passport');

module.exports.signup = (req, res, next) => {
  res.render('/signup');
}

module.exports.doSignup = (req, res, next) => {
  
  function renderWithErrors(errors) {
    res.render('/signup', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (user) {
        renderWithErrors({ email: 'Email already registered'})
      } else {
        user = new User(req.body);
        return user.save()
          .then(user => res.redirect('/login'))
      }
    })
    .catch(error => {
      if (error instanceof mongoose.Error.ValidationError) {
        renderWithErrors(error.errors)
      } else {
        next(error);
      }
    });
}

module.exports.login = (req, res, next) => {
  res.render('/login');
}

module.exports.doLogin = (req, res, next) => {
  passport.authenticate('local-auth', (error, user, validation) => {
    if (error) {
      next(error);
    } else if (!user) {
      res.render('/signup', {
        user: req.body,
        errors: validation
      })
    } else {
      return req.login(user, (error) => {
        if (error) {
          next(error)
        } else {
          res.redirect('/private')
        }
      })
    }
  })(req, res, next);
}

module.exports.logout = (req, res, next) => {
  req.logout();
  res.redirect('/login');
}