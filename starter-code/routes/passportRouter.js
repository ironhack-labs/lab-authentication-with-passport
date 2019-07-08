const express        = require("express");
const passportRouter = express.Router();
const passport = require("passport");
const User = require('../models/user');
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

// Add passport 

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "passport/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get('/signup', (req, res) => {
  res.render('passport/signup')
})

passportRouter.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  User.create({
    username,
    password: hashPass,
  })
    .then(() => {
      res.redirect("/");
    })
    .catch(error => {
      console.log(error);
    })
});

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;