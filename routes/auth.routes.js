const express = require('express');
const router = express.Router();
//Iteration #1: Require user model
const User = require('../models/User.model');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
//Iteration #2:  Add passport
const passport = require('passport');
// require passport and the local strategy. Do I need it here or in app.js?
// const LocalStrategy = require('passport-local').Strategy;

const ensureLogin = require('connect-ensure-login');

// Iteration #1: The signup feature
router.get('/signup', (req, res) => {
  res.render('auth/signup');
});

//Iteration #2: This route needs to receive the data from the form and log the user in.
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password must be 8 characters minimun.',
    });
    return;
  }
  if (username === '') {
    res.render('auth/signup', { message: 'Your username cannot be empty' });
    return;
  }
  User.findOne({ username: username }).then((user) => {
    if (user != null) {
      res.render('auth/signup', { message: 'Your username alredy exists' });
      return;
    }
    const salt = bcrypt.genSaltSync();
    const hash = bcrypt.hashSync(password, salt);

    User.create({ username: username, password: hash })
      .then((newUser) => {
        req.login(newUser, (err) => {
          if (err) {
            next(err);
          } else {
            res.redirect('/');
          }
        });
      })
      .catch((err) => {
        next(err);
      });
  });
});

router.get('/login', (req, res, next) => {
  res.render('auth/login', { errorMessage: req.flash('error') });
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/auth/private-page',
    failureRedirect: '/auth/login',
    failureFlash: true,
    passReqToCallback: true,
  })
);

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/slack', passport.authenticate('slack'));
router.get(
  '/slack/callback',
  passport.authenticate('slack', {
    successRedirect: '/auth/private-page',
    failureRedirect: '/auth/login',
  })
);

module.exports = router;
