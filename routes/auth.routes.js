const express = require('express');
const router = express.Router();


// Require user model
const User = require("../models/User.model");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

//sign up functionality iteration 1

router.get("/signup", (req, res, next) => {
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
 
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
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
          res.render("auth/login");
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

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
