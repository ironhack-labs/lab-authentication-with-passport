const express = require('express')
const passportRouter = express.Router()
// Require user model
const User = require('../models/User')

// Add passport
const passport = require('passport')

const ensureLogin = require('connect-ensure-login')

passportRouter.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user })
})

/*****************************/
/********* ROUTES ************/
/*****************************/

// Sign Up
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})
passportRouter.post('/signup', async (req, res, next) => {
  try {
    const user = await User.register({ ...req.body }, req.body.password)
    console.log(user)
    res.redirect('/login')
  } catch (e) {
    console.log(e)
    res.send('El usuario ya existe')
  }
})

// Log In
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})
passportRouter.post('/login', passport.authenticate('local'), (req, res, next) => {
  res.redirect('/private-page')
})

module.exports = passportRouter
