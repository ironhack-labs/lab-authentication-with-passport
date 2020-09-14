const express = require('express');
const router = express.Router();
const passport = require("passport")

const User = require("../models/User.model")

const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Endpoints
router.get('/signup', (req, res) => res.render('signup-form'))
router.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  if (username.length === 0 || password.length === 0) {
    res.render("signup-form", {
      message: "Indicate username and password"
    })
    return
  }
  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("signup-form", {
          message: "The username already exists"
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({
          username,
          password: hashPass
        })
        .then(() => res.redirect('/'))
        .catch(error => next(error))
    })
    .catch(err => next(err))
})

router.get('/login', (req, res, next) => res.render('login-form', {
  'message': req.flash('error')
}))

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res, next) => {
  req.logout()
  res.render('login-form', { message: 'Log out' })
})

module.exports = router
