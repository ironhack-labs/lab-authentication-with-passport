const express = require('express');
const router = express.Router();
// Require user model
const passport = require('passport')
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')

const bcryptSalt = 10

// Add passport

const ensureLogin = require('connect-ensure-login')

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user })
})

//--LOG IN--
router.get('/signup', (req, res, next) => res.render('auth/signup'))
router.post('/signup', (req, res, next) => {
  const { username, password } = req.body

  if (!username || !password) {
    res.render('auth/signup', {errorMsg:'Dame usuario y contrasena cuyons'})
  }

User.findOne({ username })
  .then(user => {
    if (user) {
      res.render('auth/signup', {errorMsg: 'Eror en la BS' })
      return 
    }
    const salt = bcrypt.genSaltSync(bcryptSalt)
    const hashPass = bcrypt.hashSync(password, salt)
    User.create({ username, password: hashPass })
    .then(() => res.redirect('/'))
    .catch(() => res.render('auth/signup', {errorMsg: 'No se pudo crear el usuario'}))
  })
  .catch(error => next(error))
})

router.get("/login", (req, res, next) => res.render("auth/login"))


router.post("/login", passport.authenticate("local", {

  successRedirect: "/",

  failureRedirect: "/login",

  failureFlash: true,

  passReqToCallback: true

}))
module.exports = router;
