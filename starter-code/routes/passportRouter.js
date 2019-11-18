const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
})

passportRouter.post("/signup", (req, res) => {
  const plainPass = req.body.password;
  if (req.body.username.length > 0 && plainPass.length > 0) {
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hash = bcrypt.hashSync(plainPass, salt);
    User.find({
        username: req.body.username
      })
      .then((a) => {
        if(a.length <= 0){
          User.create({
            username: req.body.username,
            password: hash
          })
          .then(newUser => {
            res.redirect("/login");
          })
        }else{
          res.render("passport/signup", {
            message: "The username already exists",
          });
        }
      })
  } else {
    res.render("passport/signup", {
      message: "You must fill both user name and password fields!"
    });
  }
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
})

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);


module.exports = passportRouter;