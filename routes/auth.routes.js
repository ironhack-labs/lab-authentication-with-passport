const express = require('express');
const router = express.Router();
const User = require('../models/User.model');
const bcrypt = require('bcrypt');
const passport = require('passport');

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});



router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render('auth/signup', { message: 'Your password must have at least 8 characters' });
    return
  }
  if (username === '') {
    res.render('auth/signup', { message: 'Write a username' });
    return
  }
  User.findOne({ username: username })
    .then(userDB => {
      if (userDB !== null) {
        res.render('auth/signup', { message: 'Sorry, username taken' })
      } else {
        const salt = bcrypt.genSaltSync();
        const hash = bcrypt.hashSync(password, salt);
        User.create({ username: username, password: hash })
          .then(createdUser => {
            req.login(createdUser, err => {
              if (err) {
                next(err);
                res.render('auth/signup', { message: 'account not created' });
              } else {
                res.redirect('/login');
              }
            })

          })
      }
    })
});

router.get('/logout', (req, res, next) => {
  // this is a passport function
  req.logout();
  res.redirect('/');
});


module.exports = router;
