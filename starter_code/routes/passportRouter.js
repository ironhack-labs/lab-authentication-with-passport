const express = require("express");
const router = express.Router();
// User model
const User = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");

router.get("/signup", (req, res) => {
  res.render("passport/signup")
});

router.post("signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Username and password cannot be empty."
    });
    return;
  }

  User.findOne({
    username
  }).then(user => {
    if (user !== null) {
      res.render("passport/signup", {
        message: "This username has already been taken."
      })
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
        res.render("passport/signup", {
          message: "Error: Could not save username."
        });
      } else {
        res.redirect("/");
      }
    });
  }).catch(error => {
    next(error);
  });

});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});