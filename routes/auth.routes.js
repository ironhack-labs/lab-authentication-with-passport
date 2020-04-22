const express = require("express");
const router = express.Router();
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const flash = require("connect-flash");

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("signup", { message: "One of the fields are empty" });
  }
  if (password.length < 10) {
    res.render("signup", {
      message: "Your password cannot be less than 8 characters",
    });
  }
  User.findOne({ username: username }).then((found) => {
    if (found !== null) {
      res.render("signup", { message: "Username is already taken" });
    } else {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(password, salt);
      User.create({ username: username, password: hash })
        .then((data) => {
          // res.redirect("/login");
          req.login(data, (err) => {
            if (err) {
              next(err);
            } else {
              res.redirect("/login");
            }
          });
        })
        .catch((err) => {
          next(err);
        });
    }
  });
});

router.get("/login", (req, res, next) => {
  res.render("auth/login", { errorMessage: req.flash("error") });
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

router.get("/logout", (req, res, next) => {
  // req.session.destroy
  req.logout();
  res.redirect("/");
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

module.exports = router;
