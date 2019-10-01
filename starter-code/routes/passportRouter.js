const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user');

// Add bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  const salt     = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({
    username,
    password: hashPass
  })
    .then((data) => {
      console.log(`User created: ${data}`);
      res.redirect('/login');
    })
    .catch(err => { throw new Error(err) });
});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
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

module.exports = passportRouter;