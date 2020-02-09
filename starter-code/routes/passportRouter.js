/*jshint esversion: 6 */

const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");

// Protected routes
const ensureLogin = require("connect-ensure-login");

/* GET singup */
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

/* POST singup*/
passportRouter.post("/signup", async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const existUser = await User.findOne({ username });
    if (!existUser) {
      const cryptPass = bcrypt.hashSync(password, 10);
      await User.create({ username, password: cryptPass });
      return res.redirect("/");
    } else {
      return res.render("passport/signup");
    }
  } catch (e) {
    next(e);
  }
});

/* GET login */
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

/* POST login */
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

/* GET private */
passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

/* GET logout */
passportRouter.get("/logout", (req, res, text) => {
  req.logOut();
  return res.redirect("/");
});

module.exports = passportRouter;
