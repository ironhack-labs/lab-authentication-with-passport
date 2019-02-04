const express = require("express");
const passportRouter = express.Router();
// Require user model
const userModel = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("../src/js/bcrypt");
const encriptPassword = bcrypt.encriptPassword;
const checkPassword = bcrypt.checkPassword;
// Add passport
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

passportRouter.post("/signup", (req, res, next) => {
  if (req.body.username === "" || req.body.password === "") {
    res.render("passport/signup", {
      errorMessage: "Please fill the fields"
    });
    return;
  }
  userModel
    .findOne({ username: req.body.username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          errorMessage: "That username is already taken"
        });
        return;
      }
      userModel
        .create({
          username: req.body.username,
          password: encriptPassword(req.body.password)
        })
        .then(user => {
          console.log(`${user.username} was saved in the database`);
          res.redirect("/");
        })
        .catch(err => `An error occurred to save the user: ${err}`);
    })
    .catch(err => `An error occured trying to find the user ${err}`);
});

passportRouter.post("/login", (req, res, next) => {});

module.exports = passportRouter;
