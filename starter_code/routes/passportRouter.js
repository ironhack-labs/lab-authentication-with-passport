const express = require("express");
const passportRouter = express.Router();
// User model
const User = require("../models/User");
// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");


// passportRouter.get("/", (req, res) => {
//   res.render("passport/login")
// })

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/passport/login",
    failureFlash: false,
    passReqToCallback: false
  })
);

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res) => {
  let { username, password } = req.body;

  User.findOne({ username: username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", {
        errorMessage: "El usuario ya existe"
      });
      return;
    }

    if (username === "" || password === "") {
      res.render("passport/signup", {
        errorMessage: "Indica un nombre de usuario y contraseña"
      });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    const newUser = User({
      username,
      password: hashPass
    });
    newUser.save(err => {
      res.redirect("/");
    });
  });
});


module.exports = passportRouter;