const express = require('express');
const router = express.Router();
// Require user model
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

router.get('/signup', (req, res) => res.render('auth/signup') )

router.get('/login', (req, res) => res.render('auth/login') )

router.get('/google', passport.authenticate("google", {
  scope: [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email"
  ]
}))

router.get('/google/callback', passport.authenticate('google', { 
    successRedirect: '/', 
    failureRedirect: '/login'
  })
)

router.post('/google', passport.authenticate('local', { 
  successRedirect: '/', 
  failureRedirect: '/login'
  })
)

router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
})

router.post('/signup', (req, res) => {
  const {username, password} = req.body;
  if (password.length < 8) {
    return res.render('auth/signup', { message: 'Password must be at least 8 characters' });
  }
  User.findOne( { username })
  .then((user) => {
    if (user !== null) {
      return res.render('auth/signup', { message: 'This username has already been taken' });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create( { username, password: hash })
      .then(dbUser => {
        req.login(dbUser, err => {
          if (err) {
            next(err);
          } else {
            res.redirect('/')
          }
        })
      })
      .catch(err => next(err));
    }
  })
})

router.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
