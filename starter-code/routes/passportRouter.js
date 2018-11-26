const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
// Add passport 
const passport = require('passport')
const saltedRounds = 10
const ensureLogin = require("connect-ensure-login");

function isLogged(req, res, next) {
  if (req.isAuthenticated()) {
    return next()
  }
  return res.redirect('/login')
}

passportRouter.get('/private', isLogged, (req, res, next) => {
  const user = req.user
  res.render('passport/private', user)
})
passportRouter.get('/profile', (req, res, next) => {
  const user = req.user
  res.render('passport/profile', user)
})
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})

passportRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/profile')
})

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => {
      res.json(user)
    })
})

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;