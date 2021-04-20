const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const User = require('../models/User.model')
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', {
    user: req.user
  });
});

router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render('auth/signup', {
          errorMessage: 'User already exists'
        });
      }
      const salt = bcrypt.genSaltSync(saltRounds);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
          username,
          password: hashPass
        })
        .then(newUser => {
          return res.redirect('/')
          // req.login(newUser, (error) => {
          //   if (error) {
          //     next(error)
          //   }
          //   return res.redirect('/passport/private')
          // })
        })
    })
})

module.exports = router;