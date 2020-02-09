const express = require("express");
const router = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedMiddleware");

router.get("/signup", isLoggedOut(), (req, res, next) =>
  res.render("passport/signup")
);

router.post("/signup", isLoggedOut(), async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    req.flash("error", "Please, fill all the fields");
    return res.redirect("/signup");
  }

  try {
    const existUser = await User.findOne({ username });
    if (!existUser) {
      const salt = bcrypt.genSaltSync(10);
      const hashPass = bcrypt.hashSync(password, salt);
      await User.create({ username, password: hashPass });
      req.flash("error", "User created");
      return res.redirect("/");
    } else {
      req.flash("error", "User already exists");
      return res.redirect("/signup");
    }
  } catch (e) {
    next(e);
  }
});

router.get("/login", isLoggedOut(), (req, res, next) => {
  return res.render("passport/login");
});

router.post(
  "/login",
  isLoggedOut(),
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    successFlash: "Welcome",
    passReqToCallback: true
  })
);

router.get("/logout", isLoggedIn(), (req, res, text) => {
  req.logOut();
  return res.redirect("/");
});

module.exports = router;
