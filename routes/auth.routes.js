const express = require('express');
const router = express.Router();
// Require user model

const User = require('../models/User.model')

// Add bcrypt to encrypt passwords

const bcryptjs = require('bcryptjs')
const bcryptjsSalt = 10

// Add passport

const passport = require('passport')
const flash = require("connect-flash")


const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

// SIGNUP GET
router.get('/signup', (req, res, next) => {
  res.render('auth/signup')
})

// SIGNUP POST
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  
  if (!username || !password) {
    res.render('auth/signup', {
      errorMsg: 'Rellene todos los campos, ¡MERLUZO!'
    })
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render('auth/signup', {errorMsg: 'Este usuario ya está registrado, ¡MERLUZO!'})
        return
      }
      const salt = bcryptjs.genSaltSync(bcryptjsSalt)
      const hashPass = bcryptjs.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(() => res.render('auth/signup', { errorMsg: 'Hubo un error' }))
    })
    .catch(err => next(err))

})

// LOGIN GET

router.get('/login', (req, res) => res.render('auth/login', { errorMsg: req.flash("error") }))

// LOGIN POST

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res) => {
    req.logout()
    res.redirect("/login")
})

module.exports = router;
