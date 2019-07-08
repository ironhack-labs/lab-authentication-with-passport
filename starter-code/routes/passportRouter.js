const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

const passportRouter = express.Router();

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  const { username } = req.body;
  const { password } = req.body;

  if (username === '' || password === '') {
    res.render('signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render('signup', { message: 'The username already exists' });
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
          res.render('signup', { message: 'Something went wrong' });
        } else {
          res.redirect('/');
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

passportRouter.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

passportRouter.get('/login', (req, res) => {
  res.render('passport/login', { message: req.flash('error') });
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/private',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true,
}));

module.exports = passportRouter;
