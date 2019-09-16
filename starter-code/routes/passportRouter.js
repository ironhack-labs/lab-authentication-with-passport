const express = require("express");
const passportRouter = express.Router();
// Require user model
const Users = require("../models/Users");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport
const passport = require("passport");
const bcryptSalt = 10;

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Please, introduce both username and password"
    });
  }
  Users.findOne({ username })
    .then(user => {
      if (user === null) {
        const salt = bcrypt.genSaltSync(bcryptSalt);
        const hashPass = bcrypt.hashSync(password, salt);

        const newUser = new Users({
          username,
          password: hashPass
        });
        newUser.save(err => {
          if (err) {
            res.render("auth/signup", { message: "Something went wrong" });
          } else {
            res.redirect("/");
          }
        });
      }
    }, res.render("passport/signup", { message: "The user already exists" }))
    .catch(error => {
      next(error);
    });
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);
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
    failureRedirect: "/login" 
  })
);

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
