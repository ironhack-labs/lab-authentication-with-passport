const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcryptjs");
const saltRound = 10;

// Add passport 
const passport = require("passport");
const localStrategy = require('passport-local').Strategy;


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res)=> {
  res.render("passport/signup");
});

passportRouter.post("/signup",(req, res, next) => {
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

    const salt = bcrypt.genSaltSync(saltRound);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error)
  })
  
});

passportRouter.get("/login", (req, res)=> {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}) );

passportRouter.get("/logout", (req, res)=> {
  req.logout();
  res.redirect("/login");
});


module.exports = passportRouter;