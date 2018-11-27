const router = require("express").Router();
const express        = require("express");
const passportRouter = express.Router();

// Require user model

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

// Finally, add a POST route to your passportRouter.js to receive the data 
// from the signup form and create a new user with the data.

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
})

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");

// In order to add the login feature, let's add one GET route to our router 
//to display the login page.
router.get("/login", (req, res, next) => {
  res.render("auth/login");
});


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;

