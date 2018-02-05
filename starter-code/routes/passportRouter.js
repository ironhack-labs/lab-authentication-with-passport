const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcryptjs = require("bcryptjs");
const bcryptSalt = 14;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    bcryptjs.genSalt(bcryptSalt, (err, salt) => {
      bcryptjs.hash(password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        var newUser = new User({
          username,
          password: hash
        });
        newUser.save(err => {
          if (err) return next(err);
          res.redirect("/login");
        });
      });
    });
  });
});

router.get("/login", (req, res) => {
  res.render("passport/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;
