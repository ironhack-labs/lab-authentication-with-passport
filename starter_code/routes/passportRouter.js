const express = require("express");
const passport = require("passport");
const router = express.Router();
const mongoose = require("mongoose");

//Import User model
const User = require("../models/user");

// Bcrypt to encrypt passwords and validate
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ username })
    .then(user => {
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      if (user !== null) {
        const error = {
          message: "Username already taken",
          status: "Test",
          stack: "Test2"
        };
        res.render("error", error);
      } else {
        const newUser = User({
          username,
          password: hashPass
        });

        return newUser.save();
      }
    })
    .then(newUser => {
      res.redirect("/");
    });
});

router.get("/login", (req, res) => {
  res.render("passport/login");
});

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private',
  failureRedirect: '/login',
  failureFlash: false 
}));

router.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
