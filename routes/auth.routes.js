const express = require('express')
const router = express.Router()

const passport = require("passport")

// Require user model

const User = require('../models/user.model')

// Add bcrypt to encrypt passwords

const bcrypt = require("bcrypt")
const bcryptSalt = 10
const salt = bcrypt.genSaltSync(bcryptSalt)

// Add passport

router.get('/signup', (req, res) => res.render('auth/signup'))

router.post('/signup', (req, res) => {
  
  const { username, password } = req.body

  if (username.length === 0 || password.length === 0) {
    res.render('auth/signup', {message: 'Fill the gaps'})
    return
  }
  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', { message: 'User already exists' })
        return
      }

      const hassPass = bcrypt.hashSync(password, salt)
      User.create({ username, password: hassPass })
        .then(() => res.redirect('/'))
        .catch(err => next(err))
    })
    .catch(err => next(err))
})


router.get('/login', (req, res) => res.render('auth/login', {'message': req.flash('error')}))

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
  req.logout()
  res.render('auth/login', { message: 'Sesión cerrada' })
})


module.exports = router