
const express = require('express');
const authController = express.Router();

const passport = require('passport');
const ensureLogin = require('connect-ensure-login');
const User = require('../models/user');

const bcrypt = require('bcrypt');
const bcryptSalt = 10;

authController.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

authController.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (username === '' || password === '') {
    res.render('auth/signup', {errorMessage: 'Missing username or password'})
  };
  User.findOne({username: username}, (err, user) => {
    if ( user !== null) {
      res.render('auth/signup', {errorMessage: 'This username is taken'});
      return;
    };
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass,
    });
    newUser.save(err => {
      if (err) {
        res.render('auth/signup', {errorMessage: 'something went wrong'});
      } else {
        res.redirect('/');
      };
    });
  });
});

authController.get('/login', (req, res, next) => {
  res.render('auth/login', {message: req.flash('error') })
});

authController.post('/login', passport.authenticate('local', {
  successRedirect: 'private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

authController.get('/', (req, res, next) => {
  res.redirect('/login')
})

authController.get('/Private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('private', { user: req.user });
});

authController.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
})




module.exports = authController;

