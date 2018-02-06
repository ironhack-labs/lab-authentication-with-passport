const express = require('express')
const bcrypt = require('bcrypt')
const bcryptSalt = 10
const ensureLogin = require('connect-ensure-login')
const passport = require('passport')

const router = express.Router()
const User = require('../models/user')

/* ---------- Signup ---------- */

router.get('/signup', (req, res) => {
  res.render('passport/signup')
})

router.post('/signup', (req, res, next) => {
  /* if (req.session.currentUser) {
    return res.redirect('/')
  } */

  const username = req.body.username
  const password = req.body.password

  // validate
  if (password === '' || username === '' || password.length < 8 || !password.match(/[A-Z]/)) {
    const data = {
      title: 'Signup',
      message: 'Try again'
    }
    return res.render('passport/signup', data)
  }

  // check if user with this username already exists
  User.findOne({ username: username }, (err, user) => {
    if (err) {
      return next(err)
    }
    if (user) {
      const data = {
        title: 'Signup',
        message: 'The "' + username + '" username is taken'
      }
      return res.render('passport/signup', data)
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)

    const newUser = new User({
      username,
      password: hashPass
    })

    newUser.save(err => {
      if (err) {
        return next(err)
      }
      /* req.session.currentUser = newUser */
      res.redirect('/')
    })
  })
})

/* ---------- Login ---------- */

router.get('/login', (req, res, next) => {
  res.render('passport/login', { message: req.flash('error') })
})

router.post(
  '/login',
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
    passReqToCallback: true
  })
)

/* ---------- Private Pages ---------- */

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user })
})

module.exports = router
