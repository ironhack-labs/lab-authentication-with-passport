const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model');

// Add bcrypt to encrypt passwords
const bcryptjs = require('bcryptjs');
// Add passport
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');


router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup')
});

router.get('/login', (req, res) => {
  res.render('auth/login', /* { errorMessage: req.flash('error')  } */)
});


router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
);




router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (password.length < 8) {
    res.render('auth/signup', {
      message: 'Your password must be 8 characters minimun.'
    });
    return;
  }
  if (username === '') {
    res.render('auth/signup', { message: 'Your username cannot be empty' });
    return;
  }

  User.findOne({ username: username }).then(found => {
    if (found !== null) {
      res.render('auth/signup', { message: 'This username is already taken' });
    } else {
      const salt = bcryptjs.genSaltSync();
      const hash = bcryptjs.hashSync(password, salt);

      User.create({ username: username, password: hash })
        .then(dbUser => {
              res.redirect('/');
        })
        .catch(err => {
          next(err);
        });
    }
  });
});

module.exports = router;
