// routes/auth-routes.js
const express = require('express');
const authRoutes = express.Router();
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');

// User model
const User = require('../models/user');

// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authRoutes.get('/login', (req, res, next) => {
  res.render('login', { 'message': req.flash('error') });
});

authRoutes.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get('/signup', (req, res, next) => {
  res.render('signup');
});

authRoutes.post('/signup', (req, res, next) => {
  if (req.session.currentUser) {
    return res.redirect('/');
  }

  const username = req.body.username;
  const password = req.body.password;

  // validate
  if (username === '' || password === '') {
    const data = {
      title: 'Signup',
      message: 'Try again'
    };
    return res.render('signup', data);
  }

  // check if user with this username already exists
  User.findOne({ 'username': username }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      };
      return res.render('signup', data);
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass

    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      req.session.currentUser = newUser;
      res.redirect('/login');
    });
  });
});

authRoutes.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

authRoutes.get('/authRoutes/facebook', passport.authenticate('facebook'));
authRoutes.get('/authRoutes/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/private',
  failureRedirect: '/'
}));

authRoutes.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = authRoutes;
