const express = require('express');
const router = express.Router();

// Require user model
const User = require('../models/User.model');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcryptjs');
const saltRounds = 10;

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
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
      res.render('auth/signup')
    })
    .catch((error) => next(error))
  })
})

module.exports = router;
