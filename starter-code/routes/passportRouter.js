const express           = require("express");
const passportRouter    = express.Router();
const User              = require("../models/User")
const passport          = require("passport")
const ensureLogin       = require("connect-ensure-login");
const bcrypt            = require("bcrypt");

// Require user model

// Add bcrypt to encrypt passwords

// Add passport 

passportRouter.get("/login", (req, res) => {
  res.render("/passport/login", {login: true});
});

passportRouter.post("/login", passport.authenticate("local", {
  failureRedirect: "/passport/login", 
  failureFlash: "Email o contraseña invalidos"
}),
(req, res) =>{}
);

passportRouter.get("/signup", (req, res) => {
  res.render("/passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  let { username, password } = req.body;
  if (!password) return res.render("/passport/signup", { err: "No hay password" });
  const salt = 10;
  const bsalt = bcrypt.genSaltSync(salt);
  password = bcrypt.hashSync(password, bsalt);
  User.create({ username, password })
    .then(user => {
      res.json(user);
    })
    .catch(err => {
      res.json(err);
    });
});


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;