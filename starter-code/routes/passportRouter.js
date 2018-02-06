const express = require('express');
const router = express.Router();
const passport = require('passport');

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const ensureLogin = require('connect-ensure-login');

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
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username }, 'username', (err, user, next) => {
    if (err) {
      return next(err);
    }
    if (user !== null) {
      res.render('auth/signup', { message: 'The username already exists' });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render('auth/signup', { message: 'Something went wrong' });
      } else {
        //        res.redirect('/login');
      }
    });
  });
  //  By default, LocalStrategy expects to find credentials in parameters named username and password
  // user is created in db after the completion of the post the the direct authentication below seems not to work
  // passport.authenticate('local', {
  //   successRedirect: '/private-page',
  //   failureRedirect: '/login',
  //   failureFlash: true,
  //   passReqToCallback: true
  // });
});

// login ------------------- with passport
router.get('/login', (req, res, next) => {
  res.render('passport/login', { 'message': req.flash('error') });
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login', // adjust
  failureFlash: true,
  passReqToCallback: true
}));

// logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
