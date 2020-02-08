const express = require("express");
const passportRouter = express.Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");
const isLoggedIn = require("../lib/isLoggedIn");

// Add bcrypt to encrypt passwords

// Add passport

passportRouter.get("/private-page", isLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup");

module.exports = passportRouter;
