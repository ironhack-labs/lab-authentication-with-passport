const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const passport = require("passport");
const bcryptSalt = 10;

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup", { user: req.user });
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Please indicate username and password"
    });
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("passport/signup", { message: "Username already exists" });
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser
        .save()
        .then(() => res.redirect("/private-page"))
        .catch(error => next(error));
    })
    .catch(error => next(error));
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local-auth", {
    successRedirect: "/private",
    failureRedirect: "/login",
    passReqToCallback: true,
    failureFlash: true
  })
);

passportRouter.get(
  "/private",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);


module.exports = passportRouter;
