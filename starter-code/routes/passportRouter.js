const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user.js');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');

const session = require('express-session');

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
})

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {user: req.user});
})

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
})

passportRouter.post("/signup", (req, res) => {
  const saltRounds = 5;
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.redirect("/signup", { message: "Username or password cant be null" });
    return;
  }

  User.findOne({ username })
    .then(found => {
      if (found !== null) {
        res.redirect("/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(password, salt);

      const genericUser = new User({
        username,
        password: hash
      })

      genericUser.save((err) => {
        if (err) {
          res.redirect("/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch(error => {
      next(error)
    })
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


module.exports = passportRouter;