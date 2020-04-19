const express = require('express');
const router = express.Router();
const app = express()
const passport = require('passport')
const User = require('./../models/User.model')


// signup form
//why is it router.get and not app.get
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

router.post('/signup', (req, res, next) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt)

  let user = new User({
    username: req.body.username,
    password: hashPass
  })
  user.save().then(() => {
    res.send('worked')
  })

})

// Require user model
// This is a syntax of how to import a database(a model) which is the User.model
// const User = require('../models/User.model')

// Add bcrypt to encrypt passwords
//bcrypt is a library
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

// login form
router.get('/login', (req, res, next) => {
  res.render('../views/auth/login.hbs')
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  // failureFlash: true,
  passReqToCallback: true
}))

module.exports = router;
