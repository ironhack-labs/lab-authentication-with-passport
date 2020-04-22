const express = require("express");
const router = express.Router();
// Require user model

const User = require("../models/User.model");
// Add bcrypt to encrypt passwords

const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
});
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up",
    });
    return;
  }

  User.findOne({ username: username }).then((user) => {
    if (user !== null) {
      res.render("auth/signup", {
        errorMessage: "The username is already taken",
      });
    } else {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
        username: username,
        password: hashPass,
      })
        .then((user) => {
          console.log("User has been created", user.username);
          //Send or render somewhere
          res.redirect("/private-page");
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
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

module.exports = router;
