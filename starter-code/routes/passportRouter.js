const express        = require("express");
const passportRouter = express.Router();
const bcrypt  = require('bcrypt');
// Require user model
const User = require('../models/user')
const passport = require('passport')

// Add bcrypt to encrypt passwords

//SIGNUP
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

// Signup passport 
passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  bcrypt.hash(password, 10)
    .then(hash => {
      return User.create({
        username: username,
        password: hash
      })
      .then(user => {
        res.send(user)
      })
    })
})

//LOGIN
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})

//Login passport
passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/auth/login',
  failureFlash: true
}))

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

/* GET signup page */
// router.get('/signup', (req, res, next) => {
//   res.render('passport/signup')
// })

module.exports = passportRouter;