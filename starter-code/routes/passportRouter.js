const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
// Add passport 
const passport = require("passport")

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => {
  res.render("views/passport/signup")
})

passportRouter.post("/signup", (req, res) => {

  const { username, password } = req.body;
  if (username === "" || password === "") {
    res.redirect("views/passport/signup")
    // errorMessage:"FIll both fields"
  }
  const saltRounds = 5;
  const salt = ncrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hash
  })
  newUser.save()
    .then(()=> {
      res.redirect("/login")
    })
})

module.exports = passportRouter;