const express = require('express');
const router = express.Router();

// Require user model
const User = require('../models/User.model.js');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport
const passport = require('passport');

// ITERATION 1
// GET Signup
router.get('/signup', (req, res, next) => res.render('auth/signup'));

// POST Signup
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  console.log(username)
  // Check username and password are not empty
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' });
    return;
  }
 
  User.findOne({ username })
    .then(user => {
      // Check user does not already exist
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }
 
      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
 
      // Save the user in DB
     
      const newUser = new User({
        username,
        password: hashPass
      });
      
      newUser
        .save()
        .then(() => res.redirect('/'))
        .catch(err => next(err));
    })
    .catch(err => next(err));
});

// ITERATION 2
// GET Login
router.get('/login', (req, res, next) => res.render('auth/login'));

// POST Login
router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login'
  })
);

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

// Logout
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;
