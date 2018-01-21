// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");

module.exports.ensureLoggedIn = (req, res, next) => {
  res.render("passport/private", { user: req.user });
};