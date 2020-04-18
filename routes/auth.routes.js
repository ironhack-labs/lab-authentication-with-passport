const express = require('express');
const router = express.Router();
const passport = require('passport')

// Require user model
const User = require('../models/User.model')

const bcrypt = require('bcrypt')
const bcryptSalt = 10

// Add bcrypt to encrypt passwords
router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  console.log({ username, password })

  if (!username || !password) {
    res.render('auth/signup', { message: 'Indicate username and password' });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }

      console.log('creating the user')

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save();
    })
    .then((user) => {
      console.log('this is the new user: ' + user)
      res.redirect('/login');
    })
});

router.get('/login', (req, res, next) => {
  res.render('auth/login');
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private', // pick up the redirectBackTo parameter and after login redirect the user there. ( default / )
  failureRedirect: '/login',
}))

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

//Logout

router.get('/logout', (req, res) => {
  req.logOut()
  res.render('auth/logout')
});

module.exports = router;
