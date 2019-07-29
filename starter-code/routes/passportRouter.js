const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Rellena todo" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("passport/signup", { message: "El usuario ya existe" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(() => res.redirect("/"))
        .catch(err => console.log("Ha habido un error", err));
    })
    .catch(error => {
      next(error);
    });
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login", { message: req.flash("error") });
});
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = passportRouter;
