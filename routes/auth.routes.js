const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/User.model");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");

// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/github", passport.authenticate("github"));

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "/privat",
    failureRedirect: "/login",
  })
);

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 8) {
    res.render("auth/signup", {
      message: "Your password must include more then 8 Characters!",
    });
  }
  if (username === "") {
    res.render("auth/signup", { message: "Please enter a Username" });
  }
  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("auth/signup", { message: "Username is already taken!" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash }).then((newUser) => {
        req
          .login(newUser, (err) => {
            if (err) {
              next(err);
            } else {
              res.redirect("/privat");
            }
          })
          .catch((err) => {
            next(err);
          });
      });
    }
  });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/privat",
    failureRedirect: "/login",
    passReqToCallback: true,
  })
);

router.get("/privat", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/privat", { user: req.user });
});

module.exports = router;
