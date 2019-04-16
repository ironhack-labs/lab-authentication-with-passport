const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport
const passport = require("passport")

const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  
  let username = req.body.username
  let password = req.body.password

  if(username.length < 4 || (password.length > 8 && password.length < 4))
  {
    res.render("passport/signup", {
      message: "Please enter both, username (min 4 chars) and password (min 4 - max 8) to sign up."
    })
    return;
  }

  let saltRounds = 5;
  let salt = bcrypt.genSaltSync(saltRounds)
  let encryptedPwd = bcrypt.hashSync(password, salt)

  Promise.resolve()
    .then(() => User.create({username: username, password: encryptedPwd}))
    .then(() => res.render('passport/login'))
    .catch(err => res.render("passport/signup", {message: err}))
});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login', {message: req.flash("error")});
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/logout", (req, res) => 
{
  req.logout()
  res.redirect("/login")
})

module.exports = passportRouter;