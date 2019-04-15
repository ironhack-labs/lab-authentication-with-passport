const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user");
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport 
const passport = require("passport");
const localStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  User.create(req.body)
  .then(() => res.redirect("/"))
  .catch(() => res.redirect("/"));
});

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;