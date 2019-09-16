const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const saltRounds = 10;

// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    return res.render("passport/signup", { message: "Please indicate a username and password" });
  }

  User.findOne({ username })
  .then(user => {
    if (user) {
      res.render("passport/signup", { message: "Username already exists!" });
    }

    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const newUser = {
      username,
      password: hashedPassword
    }

    User.create(newUser)
    .then(userCreated => {
      res.redirect("/login")
    })
    .catch(error => next(error));
  })
  .catch(error => next(error));
});

passportRouter.get("/login", (req, res) => {
  if (req.query.error == 1) {
    res.render("passport/login", { message: "Error while trying to Log In" });
  }
});

passportRouter.post("/login", passport.authenticate('local-auth', {
  successRedirect: "/private",
  failureRedirect: "/login?error=1",
  passReqToCallback: true,
  failureFlash: true,
}));

passportRouter.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
})

module.exports = passportRouter;
