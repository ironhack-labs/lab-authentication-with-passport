const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords

// Add passport

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
