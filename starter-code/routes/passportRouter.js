const express = require("express");
const passportRouter = express.Router();
const User = require('../models/User')
const passport = require('../config/passport')
const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user});
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", async (req, res) => {
  try {
    const username = await User.register({
      ...req.body
    }, req.body.password)
    res.redirect('/login')
  } catch (err) {
    console.log(err)
  }
});


passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});


passportRouter.post("/login", passport.authenticate('local'), (req, res, next) => {
  res.redirect('/private-page')
});


module.exports = passportRouter;