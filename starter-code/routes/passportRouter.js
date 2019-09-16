const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');

const bcryptSalt = 10;


const ensureLogin = require("connect-ensure-login");




passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup")
})

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username
  const password = req.body.password
  if (username === "" || password === "") {

    res.render("passport/signup", {
      message: "please indicate username and password"
    })
    return
  }

  User.findOne({
      username
    })
    .then((user) => {
      if (user) {
        res.render("passport/signup", {
          message: "Username alrady exist"
        })
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      })

      newUser.save()
        .then(() => res.redirect("/"))
        .catch(error => next(error))

    })
    .catch(error => next(error))
})

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login")
})

passportRouter.post("/login", passport.authenticate('local-auth', {
  successRedirect: '/',
  failureRedirect: '/login',
  passReqToCallback: true,
  failureFlash: true,
}))

module.exports = passportRouter;