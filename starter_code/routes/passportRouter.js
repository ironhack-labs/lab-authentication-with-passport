const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

router.post('/signup', (req, res, next) => {

  const { username, password } = req.body;

  // Check password promise
  let passCheck = new Promise((resolve, reject) => {
    if (username === "" || password === "") {
      return reject(new Error("Indicate a username and a password to sign up"));
    }
    resolve();
  })

  // Check password
  passCheck.then(() => {
    return User.findOne({ "username": username })
  })
    .then(user => {
      if (user !== null) {
        throw new Error("Username Already exists")
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      return newUser.save()
    })
    .then(user => {
      res.redirect("/");
    })
    .catch(e => {
      res.render("passport/signup", {
        errorMessage: e.message
      });
    });
})

router.get('/login', (req, res, next) => {
  res.render('passport/login', { "message": req.flash("error") });
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;