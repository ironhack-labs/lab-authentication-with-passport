const express        = require("express");
const passportRouter = express.Router();
const User = require('../models/user');

// Require user model

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
// Add passport 
const passport = require("passport");


const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);
  if (username === "" || password === "") {
    res.render("/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
   User.findOne({ username: username })
    .then(user => {
      if (user) {
        res.render('../views/passport/signup', { errorMessage: 'The username already exists!' });
        return;
      }
      console.log('vai criar')
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
    .catch(error => console.log(error))
})

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/",
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter