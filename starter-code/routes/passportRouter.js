const express = require("express");
const passportRouter = express.Router();
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
const flash = require("connect-flash");
const hbs = require("hbs");
const Swag = require("swag");
Swag.registerHelpers(hbs);

// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport
const passport = require("passport");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.get("/index", (req, res, next) => {
  res.render("");
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});


passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
); 


passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.json({
      message: "Indicate username and password"
    });
    return;
  }

  User.findOne({
    username
  })
    .then(user => {
      if (user !== null) {
        res.json({
          message: "The username already exists"
        });
        return;
      }
      const bcryptSalt = 2;
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save(err => {
        if (err) {
          res.json({
            message: "Something went wrong"
          });
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch(error => {
      next(error);
    });
    
});

passportRouter.get("/private-page",ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private");
});


module.exports = passportRouter;
