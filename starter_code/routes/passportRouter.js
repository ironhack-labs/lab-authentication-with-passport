const express = require('express');
const router = express.Router();
// User model
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');
const flash = require('connect-flash');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === '' || password === '') {
    res.render('passport/signup', {
      message: 'Indicate username and password',
    });
    return;
  }

  User.findOne({ username: username }, 'username', (err, user) => {
    if (user !== null) {
      res.render('passport/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username: username,
      password: hashPass,
    });

    newUser.save(err => {
      if (err) {
        res.render('passport/signup', { message: 'Something went wrong' });
      } else {
        res.redirect('/');
      }
    });
  });
});

router.get('/login', (req, res) => {
  res.render('passport/login');
});

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/private-page',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true,
  })
);

// router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render('auth/private', { user: req.user });
// });

module.exports = router;
