const express = require('express')
const router = express.Router();
const passport = require('passport')

// Require user model
const User = require("../models/User.model")

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Add passport

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user })
});

//SIGN UP//

router.get("/signup", (req, res, next) => {
  res.render("auth/signup")
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMsg: "Indicate username and password"
    })
    return
  }

  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", {
          errorMsg: "The username already exists"
        })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      })

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", {
            errorMsg: "Something went wrong"
          })
        } else {
          res.redirect("/")
        }
      })
    })
    .catch(error => {
      next(error)
    })
})

//LOG IN//

router.get("/login", (req, res, next) => {
  res.render("auth/login", {"message": req.flash("error")})
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

module.exports = router