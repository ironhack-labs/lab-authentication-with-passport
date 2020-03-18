const express        = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user")

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')

// Add passport 
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup", { message: req.flash("error") });
})

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    req.flash("error", "Fields cannot be blank")
    res.redirect("/signup");
    throw "Empty details entered";
  }
  User.findOne({ username: username })
    .then(user => {
      if (user) {
        req.flash("error", "Username already exists");
        res.redirect("/signup");
        throw "Username already exists";
      }
    })
    .then(() => {
      bcrypt.hash(password, 10).then(hash => {
        return User.create({
          username: username,
          password: hash
        }).then(user => {
          res.render("passport/signup-successful", { user });
        });
      });
    });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { message: req.flash("error") });
});

passportRouter.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true
}))

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req)
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/logout", (req, res, next) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

module.exports = passportRouter;