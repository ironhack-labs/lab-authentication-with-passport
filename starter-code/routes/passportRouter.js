const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user.js');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  const saltRounds = 5;
  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.redirect("passport/signup", { error: "Username or password cant be null" });
    return;
  }

  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const genericUser = new User({
    username,
    password: hash
  })

  genericUser.save()
    .then(() => {
      res.redirect("passport/login")
    })
});

module.exports = passportRouter;