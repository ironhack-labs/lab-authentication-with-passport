const express = require("express");
const passportRouter = express.Router();
const passport = require('passport');
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const secure = require("../middlewares/secure.mid")


// Require user model
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "You must fill both fields." });
    return;
  }

  User.findOne({ username }).then(userFound => {
    if (userFound) {
      res.render("passport/signup", { message: "This user already exists." });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPass })
      .then(userCreated => {
        res.redirect("/login")
      })
      .catch(error => next(error))
  });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local-auth", {
  successRedirect: "/",
  failureRedirect: "/login",
  passReqToCallback: true,
  failureFlash: true
}));

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

passportRouter.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
})

module.exports = passportRouter;
