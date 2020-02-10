const express = require("express");
const router = express.Router();
const { isLoggedIn, isLoggedOut } = require("../lib/logging");
const { hashPassword, checkHashedPassword } = require("../lib/hashing");
const User = require("../models/User");
// Require user model

// Add bcrypt to encrypt passwords

// Add passport

//const ensureLogin = require("connect-ensure-login");

router.get("/signup", isLoggedOut(), (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      const hash = hashPassword(password);
      const user = await User.create({ username, password: hash });
      req.session.user = user;
      return res.redirect("/");
    }
    res.render("auth/signup", {
      errorMessage: "User already exists! Please, try again."
    });
  } catch (e) {
    next(e);
  }
});

router.get("/login", isLoggedOut(), (req, res, next) => {
  res.render("auth/login");
});

router.get("/logout", async (req, res, next) => {
  req.session.destroy();
  res.redirect("/");
});

/*
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});
*/

module.exports = router;
