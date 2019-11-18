const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords
const session = require("express-session")
const bcrypt = require("bcrypt")
const bcryptSalt = 10;
// Add passport 
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy

const ensureLogin = require("connect-ensure-login");
const Swag = require('swag');
Swag.registerHelpers('hbs');

//////////////////////////////////
//Meter bodyparser/mongoose/hbs/etc ??
/////////////////////////////////

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => {
  res.render('passport/signup');
});

passportRouter.post("/signup", (req, res) => {
  // res.render('passport/signup');
});

module.exports = passportRouter;