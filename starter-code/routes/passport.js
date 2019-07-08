const express        = require("express");
const passport = express.Router();
// Require user model
const User           = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
// Add passport
const auth = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const ensureLogin = require("connect-ensure-login");

passport.get('/login', (req, res, next) => {
  res.render('passport/login');
});

passport.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passport.post('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render("signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
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
});

passport.post("/login", auth.authenticate("local", {
  successRedirect: "/passport/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

// passport.post('/login', (req, res, next) => {
//   const username = req.body.username;
//   const password = req.body.password;
//   const salt     = bcrypt.genSaltSync(bcryptSalt);
//   const hashPass = bcrypt.hashSync(password, salt);

//   if (username === "" || password === "") {
//     res.render("signup", {
//       errorMessage: "Indicate a username and a password to sign up"
//     });
//     return;
//   }
//   User.create({
//     username,
//     password: hashPass
//   })
//   .then(() => {
//     res.redirect("/");
//   })
//   .catch(error => {
//     console.log(error);
//   })
// });

passport.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passport.get("/private-page", (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passport;