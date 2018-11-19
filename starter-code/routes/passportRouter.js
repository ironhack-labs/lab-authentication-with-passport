const express        = require('express');
const bcrypt         = require('bcrypt');
const path           = require('path');

const bcryptSalt     = 10;
const passportRouter = express.Router();
const bodyParser     = require('body-parser');
const mongoose       = require('mongoose');
const passport       = require('passport');
const LocalStrategy  = require('passport-local').Strategy;

// Require user model

// Add bcrypt to encrypt passwords

// Add passport


const ensureLogin    = require('connect-ensure-login');
const User           = require('../models/user');


passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});


passportRouter.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '' || password === '') {
    res.render('passport/signup', { message : 'INDICATE USERNAME AND PASSWORD' });
    return;
  }
  User.findOne({ username }).then((user) => {
    if (user !== null) {
      res.render('passport/signup', { message : 'This User already exists' });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password : hashPass,
    });

    newUser.save((err) => {
      if (err) {
        res.render('passport/signup', { message : 'Something went wrong' });
      } else {
        res.redirect('/');
      }
    });
  })
    .catch((error) => {
      next(error);
    });
});


passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});


passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,


}));


module.exports = passportRouter;
