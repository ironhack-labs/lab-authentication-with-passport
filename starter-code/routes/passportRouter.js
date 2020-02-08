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

router.get("/register", (req, res, next) => {
  res.render("passport/register");
});

router.post("/register", async (req, res, next) => {
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
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;
