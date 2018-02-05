const passport = require("passport");
const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/signup", (rep, res, next) => {
  res.render("passport/signup.ejs");
});

router.post("/signup", (req, res, next) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "You have to indicate a username and a password"
    });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username arlredy exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    newUser = new User({
      username: username,
      password: hashPass
    });

    newUser.save(err => {
      if (err)
        res.render("passport/signup", { message: "Somethig went wrong" });
      else res.redirect("/");
    });
  });
});

router.get("/login", (req, res, next) => {
  console.log(req.flash("error"));
  res.render("passport/login.ejs"), { message: req.flash("error") };
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

module.exports = router;
