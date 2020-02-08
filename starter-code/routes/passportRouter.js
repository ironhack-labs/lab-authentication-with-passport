const express = require("express");
const passportRouter = express.Router();
const model = require("../models/user");
const { hashPassword, checkHashed } = require("../lib/hashing");
const passport = require("passport");
const { isLoggedIn, isLoggedOut } = require("../lib/isLoggedMiddleware");
// Require user model

//const User = require('../models/user');

// Add bcrypt to encrypt passwords

// const bcrypt = require('bcryptjs');
// const bcryptSalt = 10;

// Add passport 

 passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

// passportRouter.post("/signup", isLoggedOut(), async (req, res, next) => {

  passportRouter.post("/signup", async (req, res, next) => {
  console.log("Entrando al Post")
  const { username, password } = req.body;
  console.log("Requerido el body")
  
  const existingUser = await model.findOne({ username });
  if (!existingUser) {
    const newUser = await model.create({
      username,
      password: hashPassword(password)
    });
    res.redirect("/");
  } else {
    res.render("/signup");
  }
});

// const ensureLogin = require("connect-ensure-login");

// passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
//  res.render("passport/private", { user: req.user });
// });

module.exports = passportRouter;