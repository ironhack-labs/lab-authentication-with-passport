const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("../helpers/passport");

router.get("/signup", (req, res) => {
  res.render("passport/signup");
})

router.post("/signup", (req, res, next) => {
  User.register(req.body, req.body.password)
  .then(user=>res.redirect("login"))
  .catch(e=>next(e))
})

router.get("/login", (req, res) => {
  res.render("passport/login")
})

router.post("/login", passport.authenticate('local'), (req, res, next) => {
  res.redirect("/private-page");
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = router;