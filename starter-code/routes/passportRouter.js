const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10
// Add passport 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const flash = require("connect-flash");

const ensureLogin = require("connect-ensure-login");



passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


// Signup - Get
passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})
// Signup - Post
passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body


  if (!username || !password) {
    // res.render("auth/signup", { errMsg: "Rellena los campos, gandul" })
    console.log("campos vacios")
    return
  }

  User.findOne({ username })
    .then(foundUser => {
      if (foundUser) {
        // res.render("auth/signup", { errMsg: "Sé más original, eso ya existe" })
        console.log('El usuario ya existe')
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(createdUser => {
          console.log(createdUser)
          res.redirect("/")
        })
        .catch(err => console.log("Algo no va bien", err))

    })
    .catch(err => console.log("Buuuu", err))
})


// Login - Get
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})
// Login - Post
passportRouter.post('/login', passport.authenticate("login", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))


// Private area
passportRouter.get('/private-page', ensureAuthenticated, (req, res) => {
  res.render('private', { user: req.user })
})

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect('/login')
  }
}


module.exports = passportRouter;