const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/User');
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 12;
// Add passport 
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const flash = require("connect-flash")


passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup")
})

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("index", {
      message: "Indicate username and password",
      section: "signup"
    });
    return;
  }

  User.findOne({
    username
  })
    .then((user) => {
      if (user !== null) {
        res.render("index", {
          message: "The username already exists",
          section: "signup"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.render("index", {
            message: "Something went wrong",
            section: "signup"
          });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch((error) => {
      next(error);
    });
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login")
})

passportRouter.post(
  "/login",
  passport.authenticate('local', {
    successReturnToOrRedirect: "/private",
    failureRedirect: "/",
    failureFlash: true,
    passReqToCallback: true
  })
);

passportRouter.get("/private", (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;