const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

router.get("/signup", (req, res, next) => res.render("passport/signup"));

router.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) return res.render("passport/signup");

  try {
    const existUser = await User.findOne({ username });
    if (!existUser) {
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      await User.create({ username, password: hashPass });
      return res.redirect("/");
    } else {
      return res.render("passport/signup");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/login", (req, res, next) => {
  return res.render("passport/login", { message: req.flash("error") });
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/logout", (req, res, text) => {
  req.logOut();
  return res.redirect("/");
});

module.exports = router;
