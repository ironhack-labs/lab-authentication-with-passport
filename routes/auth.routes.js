const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login');
const User = require('../models/User.model')
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const passport = require('passport');

// Sign Up routes
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('auth/signup', { message: 'Please type username and password' });
    return;
  }

  User
    .findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: 'Username already exists' });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User
        .create({ username, password: hashPass })
        .then(() => {
          res.redirect('/login')
        })
        .catch(err => res.status(400).render('signup', { message: err.errmsg }))
    })
    .catch(err => next(err));

});

// Log In routes
router.get('/login', (req, res) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

router.get('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/login')
});

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
