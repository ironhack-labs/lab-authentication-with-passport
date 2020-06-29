const express = require('express');
const router = express.Router();
const session = require("express-session")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy



// Require user model

const User = require("../models/User.model");

// Add bcrypt to encrypt passwords

const bcryptjs = require("bcryptjs")
const bcryptjsSalt = 10;


// Passport config


//Sign Up
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
})

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcryptjs.genSaltSync(bcryptjsSalt);
      const hashPass = bcryptjs.hashSync(password, salt);


      const newUser = new User({
        username,
        password: hashPass
      })

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" })
        } else {
          res.redirect("/")
        }
      })
    })
    .catch(error => next(error))
})

//Login


router.get('/login', (req, res) => res.render('auth/login'))

router.post('/login', passport.authenticate('local', {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))


//Private page


const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
