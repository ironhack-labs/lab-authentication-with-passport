const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/signup", { user: req.user });
});

app.post('/signup', (req, res) => {
  let email    = req.body.email;
  let password = req.body.password;

  res.send(`Email: ${email}, Password: ${password}`);
});


module.exports = router;
