const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
// Add passport 
const passport = require('passport');

const ensureLogin = require("connect-ensure-login");
const mongoose     = require('mongoose');

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res, next) => {
  res.render("../views/passport/signup.hbs");
});

passportRouter.post('/signup', (req, res, next) => {

  const {
    username,
    password
  } = req.body;

  User.findOne({
    username
  })
  .then(user => {
    if (user !== null){
      throw new error("Username already Exists");
    }

    const salt = bcrypt.genSaltSync(10);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User ({
      username,
      password: hashPass,
    });

    return newUser.save()

  })

    .then (user => {
      res.redirect("/");
    })
    .catch(err => {
      res.render("/signup"), {
        errorMessage: err.message
      }
    })
}) 
module.exports = passportRouter;

passportRouter.get("/login", (req, res, next) => {
  res.render("../views/passport/login.hbs");
});

passportRouter.get("/login", (req, res, next) => {
  res.render("../views/passport/login.hbs");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login"
}))





