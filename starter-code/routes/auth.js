const express = require("express");
const passport = require("passport");
const User = require("../models/User");

const { isLoggedIn, isLoggedOut } = require("../lib/logging");
const { hashPassword } = require("../lib/hashing");

const router = express.Router();

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
      req.user = user;
      return res.redirect("/");
    } else {
      req.flash("error", "User already exists! Please, try again.");
      return res.redirect("/auth/signup");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/login", isLoggedOut(), (req, res, next) => {
  res.render("auth/login");
});

router.post(
  "/login",
  isLoggedOut(),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/auth/login",
    failureFlash: "Invalid username or password! Please, try again.",
    passReqToCallback: true
  })
);

router.get("/logout", async (req, res, next) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = router;
