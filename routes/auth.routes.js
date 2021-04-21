const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcrypt');

// Require user model
const User = require('../models/User.model')

// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {
  const {username, password} = req.body

  if (username === '' || password === ''){
    res.render('auth/signup', {errMsg: `Please fill all the fields`})
  }
  User.findOne({username})
  .then((result) => {
    if (result) {
     res.render('auth/signup', {errMsg: `This user already exists`})
    } else {
      const hashedPassword = bcrypt.hashSync(password, 10)
      User.create({username: username, password: hashedPassword})
      .then((result) => {
        res.redirect('/login')
      })
    }
  })
  .catch((err) => {
    console.log(err)
  })
})

router.get('/login', (req, res, next) => {
  res.render('auth/login', {errMsg: req.flash('error')});
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/')
})

module.exports = router;
