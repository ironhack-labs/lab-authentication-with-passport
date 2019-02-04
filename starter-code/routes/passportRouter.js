const express = require("express");
const passportRouter = express.Router();


// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Add passport
const passport = require("passport");


const ensureLogin = require("connect-ensure-login");


// SIGN UP
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup")
})

passportRouter.post("/signup", (req, res, next) => {

  const username = req.body.username;
  const password = req.body.password;

  if (username == "" || password == "") {
    res.render("passport/signup", {
      errorMessage: "Please type your username and password to sign up"
    });
    return;
  }

  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          errorMessage: "This username already exists"
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPwd = bcrypt.hashSync(password, salt);

      User.create({
        username,
        password: hashPwd
      })
        .then(() => { res.redirect("/") })
        .catch(error => { console.log(error) })
    })
    .catch(error => { next(error) })

})

//LOG IN

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login")
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

//LOG OUT

passportRouter.get("/logout", (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect("/login")
  })
})

module.exports = passportRouter;