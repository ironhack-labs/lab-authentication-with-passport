const express = require("express");
const passportRouter = express.Router();
const passport = require("passport");
// Require user model
const User = require("../models/User");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const salt = 10;

// const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res) => res.render("passport/signup"));
passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;
  if (username.length === 0 || password.length === 0) {
    res.render("signup", { message: "rellena todos los campos" });
    return;
  }
  User.findOne({ username }).then(user => {
    if (user) {
      res.render("signup", { message: "usuario exixte" });
      return;
    }

    const bSalt = bcrypt.genSaltSync(salt);
    const hashPass = bcrypt.hashSync(password, bSalt);

    const newUser = new User({
      username,
      password: hashPass
    });
    newUser
      .save()
      .then(x => res.redirect("/"))
      .catch(err => res.render("passport/signup", { message: `Error ${err}` }));
  });
});

passportRouter.get("/login", (req, res, next) =>
  res.render("passport/login", { message: req.flash("error") })
);
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;
