const express = require("express");
const router = express.Router();


// Require user model
const User = require("../models/user.model");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

// private pages
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

// signup
router.get("/signup", (req, res) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res) => {
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(req.body.password, salt);

  let user = new User({ username: req.body.username, password: hashPass });

  user.save().then(() => {
    res.redirect("/login");
  });
});

// login
router.get("/login", (req, res, next) => {
  res.render("auth/login",  { message: req.flash('error') });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true,
  })
);

// logout
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

module.exports = router;
