const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

/* _____ LOGIN __________ */

router.get("/login", (req, res) => {
  res.render("passport/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/passport/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

/* _____ SIGNUP __________ */

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  if (req.session.currentUser) {
    res.redirect("/");
    return;
  }
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  const newUser = User({
    username,
    password: hashPass
  });
  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "Please type in your username and password"
    });
    return;
  }
  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "Username already exists"
      });
      return;
    }
    newUser.save(err => {
      req.session.currentUser = newUser;
      res.redirect("/");
    });
  });
});

/* _______ PRIVATE ___________ */

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});

module.exports = router;
