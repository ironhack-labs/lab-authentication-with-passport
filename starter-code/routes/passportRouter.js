const express = require('express');

const passportRouter = express.Router();
// Require user model

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');


passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});


// sign up
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  const {username} = req.body;
  const {password} = req.body;

  if (username === '' || password === '') {
    res.render('passport/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('/signup', { message: 'The username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
      });

      newUser.save((err) => {
        if (err) {
          res.render('/signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// login
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login', { message: req.flash('error') });
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

// logout
passportRouter.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = passportRouter;
