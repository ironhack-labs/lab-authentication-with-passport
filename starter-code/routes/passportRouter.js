const express = require('express');
const authRoutes = express.Router();

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

const ensureLogin = require('connect-ensure-login');

const passport = require('passport');

authRoutes.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

authRoutes.post('/signup', (req, res, nextt) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  if (user !== null) {
    res.render('passport/signup', { message: 'The username is taken' });
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
      res.render('passport/signup', { message: 'Something went wrong' });
    }
  });
});

authRoutes.get('/login', (req, res, next) => {
  res.render('auth/login', { 'message': req.flash('error') });
});

authRoutes.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

authRoutes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = authRoutes;
