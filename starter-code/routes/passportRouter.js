const express = require('express');

const passportRouter = express.Router();

const bcrypt = require('bcrypt');

const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

const User = require('../models/user');


passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup', { user: req.user });
});

passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (username === '' || password === '') {
    res.render('passport/signup', {
      message: 'Indicate username and password',
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('passport/signup', {
          message: 'The username already exists',
        });
        return;
      }

      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
      });

      newUser.save((err) => {
        if (err) {
          res.render('passport/signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

passportRouter.get('/login', (req, res) => {
  res.render('passport/login', { user: req.user });
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

module.exports = passportRouter;
