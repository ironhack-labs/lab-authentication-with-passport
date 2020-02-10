const express = require("express");
const router = express.Router()
// Require user model
const User = require('../models/user.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10
// Add passport 
const passport = require('passport')
const ensureLogin = require("connect-ensure-login")



router.get('/signup', (req, res) => res.render('passport/signup-form'))
router.post("/signup", (req, res) => {

  const {
    username,
    password
  } = req.body

  if (username === "" || password === "") {
    res.render("passport/signup-form", {
      message: "Rellena los campos, no se van a rellenar solos..."
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user) {
        res.render("passport/signup-form", {
          message: "El usuario ya existe, ten más imaginación..."
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
        .catch(() => res.render("passport/signup-form", {
          message: "Algo ha ido mal, no se qué pero ha ido mal..."
        }))
    })
    .catch(error => next(error))
})



router.get('/login', (req, res) => {
  res.render('passport/login-form', {
    message: req.flash("error")
  })
})
router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})




router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  })
})

module.exports = router