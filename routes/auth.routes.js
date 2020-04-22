const express = require("express");
const router = express.Router();
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// Require user model
const User = require("../models/User.model");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//sign up functionality iteration 1

router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  if (password.length < 8) {
    res.render("auth/signup", {
      message: "Your password must be 8 characters minimum",
    });
    return;
  }
  if (username === "") {
    res.render("auth/signup", { message: "Your username cannot be empty" });
    return;
  }

  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("auth/signup", { message: "Username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username: username, password: hashPass })
        .then((dbUser) => {
          // login the user
          // req.login(dbUser, (err) => {
          //   if (err) next(err);
          //   else res.redirect("/");
          // });
          res.render("auth/login");
          //res.redirect("auth/login");   //Why does res.render work and not res.redirect?
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

//login functionality iteration 2

router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

const loginCheck = () => {
  return (req, res, next) => {
    if (req.isAuthenticated()) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  };
};

// Add passport, must go below other routes

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/auth/private", { user: req.user });
});

module.exports = router;
