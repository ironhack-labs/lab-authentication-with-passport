const express = require('express')
const passportRouter = express.Router()
// Require user model
const User = require('../models/user')
const { getSignup, getLogin, postSignup } = require('../controllers/authControllers')
// Add bcrypt to encrypt passwords

// Add passport
const passport = require('../middleware/passport')

const ensureLogin = require('connect-ensure-login')

passportRouter.get('/signup', getSignup)
passportRouter.post('/signup', postSignup)
passportRouter.get('/login', getLogin)
passportRouter.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/passport/login',
    passReqToCallback: true,
    failureFlash: true
  })
)
passportRouter.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/auth/login')
})

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user })
})

module.exports = passportRouter
