const express = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const bcrypt = require("bcrypt");
const User = require("../models/user")
const bcryptSalt = 10;

//signup

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup")
})

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  })
  .then(user => {
    if (user !== null) {
      res.render("passport/signup", {
        message: "The username already exists"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    User.create({
      username,
      password: hashPass
    })
    res.redirect("/")
  })
})

//login

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login")
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// private page

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

module.exports = passportRouter;