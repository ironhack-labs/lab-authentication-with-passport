const express = require ('express');
const passportRouter = express.Router ();
const User = require ('../models/user');
const bcrypt = require ('bcrypt');
const bcryptSalt = 10;
const passport = require ('passport');
const ensureLogin = require ('connect-ensure-login');

passportRouter.get ('/signup', (req, res, next) => {
  res.render ('passport/signup');
});

passportRouter.post ('/signup', (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync (bcryptSalt);
  const hashPass = bcrypt.hashSync (password, salt);

  const newUser = new User ({
    username,
    password: hashPass,
  });
  newUser
    .save ()
    .then (userSaved => {
      res.redirect ('/');
    })
    .catch (error => {
      res.render ('/signup', {message: 'Something is wrong'});
    });
});

passportRouter.get ('/login', (req, res, next) => {
  res.render ('passport/login');
});

passportRouter.get (
  '/private-page',
  ensureLogin.ensureLoggedIn (),
  (req, res) => {
    res.render ('passport/private', {user: req.user});
  }
);

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("./passport/private", { user: req.user });
});

module.exports = passportRouter;
