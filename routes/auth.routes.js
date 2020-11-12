const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model.js');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passport = require('passport');

// Add passport

const ensureLogin = require('connect-ensure-login');
const { get } = require('mongoose');
const app = require('../app.js');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.render('auth/signup', username, {
      errorMessage: 'Please fill in all the fields',
    });
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('auth/signup', {
          errorMessage: 'Username is already in use',
        });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, passwordHash: hashPass })
        .then(() => res.redirect('/'))
        .catch((error) => next(error));
    })
    .catch((error) => next(error));
});

router.get('/login', (req, res) => res.render('auth/login'));

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
  })
);

router.get('/private', (req, res) => {
  if (!req.user) {
    res.redirect('/login');
    return;
  }

  res.render('auth/private', {
    user: req.user,
  });
});

module.exports = router;
