const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");

// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("./passport/signup.hbs");
});
passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username.length === 0 && password.length === 0) {
    res.render("/passport/signup", {
      message: "Please indicate username and password"
    });
  }
  User.findOne({ username }).then(user => {
    if (user) {
      res.render("/passport/signup", { message: "User already exists" });
    }
    const saltRounds = 5;

    const salt = bcrypt.genSaltSync(saltRounds);
    const encryptedPassword = bcrypt.hashSync(password, salt);

    User.create({
      username,
      password: encryptedPassword
    })
      .then(userCreated => {
        console.log(userCreated);
        res.render("./passport/login");
      })
      .catch(error => next(error));
  });
});

passportRouter.get("/login", (req, res) => {
  res.render("./passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    passReqToCallBack: true,
    failureFlash: true
  })
);

passportRouter.get("/logout", (req, res, next) => {
  req.logout();
  res.redirect("/");
});

passportRouter.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email"
    ]
  })
);
passportRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: "/private-page",
    failureRedirect: "/" // here you would redirect to the login page using traditional login approach
  })
);

module.exports = passportRouter;
