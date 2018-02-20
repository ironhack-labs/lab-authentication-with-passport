const express = require("express");
// The EXPRESS ROUTER
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

// SIGN UP Get Route
router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

// SIGN UP Post Route
router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Username or Password is Invalid"
    });
  }
  // Checking for username requirements in database
  User.findOne({ username: username }, (err, user) => {
    if (err !== null) {
      res.render("passport/signup", { message: "Username taken" });
      return;
    }
    // Encrypting the password
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    // Creating the New User Doc "Object"
    const newUser = new User({
      username,
      password: hashPass
    });
    // Saving a new user to MongoDB
    newUser.save(err => {
      if (err) {
        res.render("passport/signup", { message: "something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  });
});

//  LOGIN ROUTE

router.get("/login", (req, res, next) => {
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

router.get("/", (req, res, next) => {
  res.redirect("/login");
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
