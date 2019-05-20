const express = require("express");
const passportRouter = express.Router();

const User = require('../models/user')
const bcrypt = require('bcrypt')

const bcryptSalt = 10

// Require user model

// Add bcrypt to encrypt passwords

// Add passport 
const passport = require('passport')


const ensureLogin = require("connect-ensure-login");


passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup')

})

passportRouter.post('/signup', (req, res) => {
  const { username, password } = req.body
  if (username.length === 0 || password.length === 0) {
    res.render('passport/signup', { message: "Please input username & password" })
    return
  }

  User.findOne({ username })
    .then(user => {

      if (user) {
        res.render('passport/signup', { message: 'user already exists!' })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      const newUser = new User({ username, password: hashPass })

      newUser.save()

        .then(user => {

          res.redirect('/')

        })

        .catch(err => {
          res.render('passport/signup', { message: 'error' })
        })
    }
    )
})

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") })
})

passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/auth/login",
  failureFlash: true,
  passReqToCallback: true
}))

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = passportRouter;