const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Require user model
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "You must fill both fields." });
  }

  User.findOne({ username }).then(userFound => {
    if (userFound) {
      res.render("passport/signup", { message: "This user already exists." });
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    User.create({ username, password: hashPass })
      .then(userCreated => {
        res.redirect("/login")
      });
    
   
  });
});
// Add bcrypt to encrypt passwords

// Add passport

const ensureLogin = require("connect-ensure-login");

passportRouter.get(
  "/private-page",
  ensureLogin.ensureLoggedIn(),
  (req, res) => {
    res.render("passport/private", { user: req.user });
  }
);

module.exports = passportRouter;
