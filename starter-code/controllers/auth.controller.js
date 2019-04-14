const mongoose    = require('mongoose');
const User        = require('../models/user.model');
const passport    = require('passport');
const ensureLogin = require("connect-ensure-login");

module.exports.private = (req, res) => { res.render('passport/private', { user: req.user }); };

module.exports.signup = (req, res, next) => { res.render('passport/signup'); };

module.exports.doSignup = (req, res, next) => {
  function renderWithErrors(errors) {
    res.render('passport/signup', {
      user: req.body,
      errors: errors
    })
  }

  User.findOne({ username: req.body.username })
    .then( user => {
      if (user) { renderWithErrors( {username: 'UserName already registered'} ) }
      else {
        user = new User(req.body);
        return user.save()
          .then( user => res.redirect('/') )
      }
    })
    .catch( error => {
      if (error instanceof mongoose.Error.ValidationError) { renderWithErrors(error.errors) }
      else { next(error); }
    })
}

//module.exports.login = (req, res, next) => { res.render('passport/login'); };