const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const path = require("path");
const debug = require('debug')('starter-code:' + path.basename(__filename));
const router = express.Router();
const bcryptSalt = 10;
const flash = require("connect-flash");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

// router.get("/login", (req, res, next) => {
//   res.render("auth/login");
// });

router.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});
console.log(flash);

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// router.get("/login", (req, res, next) => {
//   res.render("auth/login", { "message": req.flash() });
// });

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
