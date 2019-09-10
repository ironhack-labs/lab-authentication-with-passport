'use strict';

const express = require("express");
const passportRouter = express.Router();
const passport = require('passport');

// Require user model

// Add bcrypt to encrypt passwords


// Add passport 

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup');
});

passportRouter.post('/signup', passport.authenticate('signup', {
  successRedirect: "/",
  failureRedirect: "/passport/signup"
}));

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login');
});

module.exports = passportRouter;
