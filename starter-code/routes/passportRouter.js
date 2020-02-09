const express = require("express");
const router = express.Router();
// Require user model
const User = require("../models/User");
// Add bcrypt to encrypt passwords
const { hashPassword, checkHashed } = require("../lib/hashing");
// Add passport
const passport = require("passport");
// Add LoggedIn Middleware
const ensureLogin = require("connect-ensure-login");

router.get("/register", ensureLogin.ensureLoggedOut(), (req, res, next) => {
  res.render("passport/register");
});

router.post(
  "/register",
  ensureLogin.ensureLoggedOut(),
  async (req, res, next) => {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      const newUser = User.create({
        username,
        password: hashPassword(password)
      });
      //req.flash(`Created user ${username}`)
      return res.redirect("/");
    } else {
      req.flash("User already exist with this username");
      return res.redirect("/auth/register");
    }
  }
);

router.get("/login", ensureLogin.ensureLoggedOut(), (req, res, next) => {
  res.render("passport/login");
});

router.post(
  "/login",
  ensureLogin.ensureLoggedOut(),
  passport.authenticate("local", { failureRedirect: "/auth/login" }),
  function(req, res) {
    res.redirect("/");
  }
);
/*
app.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/login" }),
  function(req, res) {
    res.redirect("/");
  }
);*/

router.get(
  "/logout",
  ensureLogin.ensureLoggedIn("/auth/login"),
  async (req, res, next) => {
    req.logout();
    res.redirect("/");
  }
);

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
