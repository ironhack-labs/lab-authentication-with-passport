const express = require("express");
const passportRouter = express.Router();
const {hashPassword,checkHashed} = require("../lib/hash");
const {isLoggedOut,isLoggedIn} = require("../lib/isLoggedMiddleware");
const User = require('../models/user')
const passport = require('passport');
const strength = require('strength');
const ensureLogin = require("connect-ensure-login");



passportRouter.get("/signup", isLoggedOut(), (req, res) => {
  res.render("passport/signup", {
    user: req.user
  });
});

passportRouter.post('/signup', isLoggedOut(), async (req, res, next) => {
  const {
    username,
    password
  } = req.body;
  if (username === '' || password === '') {
    return res.render('passport/signup', {
      errorMessage: "Indicate an username and password to signup"
    });
  } else {
    try {
      const existingUser = await User.findOne({
        username
      });
      if (!existingUser && strength(password) >= 2) {
        const newUser = await User.create({
          username,
          password: hashPassword(password)
        });
        return res.redirect('/login');
      } else if (strength(password) < 2) {
        return res.render('passport/signup', {
          errorMessage: "Create a password with mixed case, special character and number (minimun 8 characters and no repeated letters)"
        });
      } else {
        return res.render('passport/signup', {
          errorMessage: "The user or password already exists"
        });
      }
    } catch (e) {
      next(e);
    }
  }
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.post("/login",passport.authenticate("local", {
  successRedirect: "/signup",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

module.exports = passportRouter;
