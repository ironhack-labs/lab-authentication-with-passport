const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', {
    user: req.user
  });
});

/* GET & POST SIGNUP */
router.get('/signup', (req, res, next) => res.render('auth/signup'));
router.post('/signup', (req, res, next) => {

  function renderWithErrors(errors) {
    res.status(400).render('users/register', {
      errors: errors,
      user: req.body
    })
  }

  User.findOne({
      username: req.body.username
    })
    .then(user => {
      if (user) {
        renderWithErrors({
          username: 'This user already exists.'
        })
      } else {
        User.create(req.body)
          .then(() => res.redirect('/'))
          .catch(err => next(err));
      }
    })
    .catch(err => next(err));
})

/* GET & POST LOGIN */
router.get('/login', (req, res, next) => res.render('auth/login'));
router.post('/login', passport.authenticate('local', {
  successRedirect: '/create-employee',
  failureRedirect: '/login',
}));

router.get('/auth/google', passport.authenticate('google', {
  scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
  ]
}));

router.get('/auth/google/callback', passport.authenticate('google', {
  successRedirect: '/private-page',
  failureRedirect: '/login'
}));

// LOGOUT
router.get('/logout', (req, res, next) => {
  if (req.user) {
    req.logout();
  }
  res.redirect('/login');
})


module.exports = router;