const express = require("express");
const passportRouter = express.Router();
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");
const User= require ("../models/user")
// Require user model

// Add bcrypt to encrypt passwords

// Add passport 

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login" 
  );
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

passportRouter.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username === "" || password === "") {
      res.render("passport/signup", { message: "Indicate username and password" });
      return;
    }
  
    User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
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
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/login");
        }
      });
    })
    .catch(error => {
      next(error)
    })
  });


  passportRouter.post("/login", passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: false,
    passReqToCallback: true
  }));
  

module.exports = passportRouter;