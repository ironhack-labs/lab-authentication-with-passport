const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const saltRounds = 10;

// Add passport
const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req,res) => {
  res.render('auth/signup');
})

router.post('/signup', (req, res, next) => {
  const { username, password } =req.body;

  if(!username || !password) {
    res.render('auth/signup', {errorMessage: "Username and password are required."})
  }

  User.findOne({ username })
  .then (user => {
    if(user){
      res.render('auth/signup', {errorMessage: "User already exists"})
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashPassword = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPassword})
    .then(() => {
      res.redirect('/')
    })
    .catch((error) => next(error))
  })
})

router.get('/login', (req, res) => {
  res.render('auth/login');
})

router.post('/login', passport.authenticate("local",{
  successRedirect : '/',
  failureRedirect: '/auth/login',
  passReqToCallback: true
}));

module.exports = router;
