const express        = require("express");
const passportRouter = express.Router();

// Require user model

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
// Add passport 
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  res.render("passport/signup")
}); 

passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login")
});

passportRouter.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  res.render("passport/login")
}); 

module.exports = passportRouter;