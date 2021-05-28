const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model.js');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// Add passport
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

router.get('/signup', (reg, res, next)=> res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
 
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      // 2. Check user does not already exist
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }
      // Encrypt the password
      bcrypt
      .genSalt(bcryptSalt)
      .then(salt => bcrypt.hashSync(password, salt))
      .then(hashedPassword => {
        return User.create({
          username,
          password: hashedPassword
        });
      })
      .then(user => res.redirect('/login'))
    })
    .catch(err => next(err));
});

router.get('/login', (req, res, next) => res.render('auth/login', {errorMessage: req.flash('error')}));
 
router.post('/login',
  passport.authenticate('local', {
      successRedirect: '/private-page',
      failureRedirect: '/login',
      failureFlash: true
  })
);

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/login');
});

module.exports = router;
