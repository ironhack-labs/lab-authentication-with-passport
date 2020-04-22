// jshint esversion:6

const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/User.model.js");
// Require bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Require passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
// Require session
const session = require("express-session");

//SIGN UP
router.get("/signup", (req, res, next) => {
  res.render("auth/signup.hbs");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass,
      });

      newUser.save((err) => {
        if (err) {
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

// LOG IN
router.get("/login", (req, res, next) => {
  res.render("auth/login.hbs", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// LOG IN WITH SLACK (without sign up)
router.get("/auth/slack", passport.authenticate("slack"));
router.get(
  "/auth/slack/callback",
  passport.authenticate("slack", {
    successRedirect: "/private-page",
    failureRedirect: "/", // here you would navigate to the classic login page
  })
);

// LOGIN WITH GOOGLE (without sign up)
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ],
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/private-page",
    failureRedirect: "/", // here you would redirect to the login page using traditional login approach
  })
);

// PRIVATE PAGE
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private.hbs", { user: req.user }); // ERROR: before the render was passport/somethig
});

// LOG OUT
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
