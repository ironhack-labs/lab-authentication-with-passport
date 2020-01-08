const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport 
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const flash = require("connect-flash");


const ensureLogin = require("connect-ensure-login");

//GET SIGN UP PAGE
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup")
})

//POST SIGN UP PAGE
passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
  .then(() => {
    res.redirect("/");
  })
  .catch(error => {
    console.log(error);
  })
})

//GET LOG IN
passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login')
})

//POST LOG IN
passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/private-page", 
  failureRedirect: "/login", 
  failureFlash: true, 
  passReqToCallback: true, 
}));


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;