// router/auth-router.js
const express = require("express");
const router = express.Router();
const FbStrategy = require('passport-facebook').Strategy;

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Passport 
const passport = require("passport");

//ensureLogin
const ensureLogin = require("connect-ensure-login");


router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  // Si el nombre de usuario y la contraseña estan vacios regresa un mensaje de error
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username or password" });
    return;
  }

  // Busca si el nombre de usurio ya esta registrado
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});


router.get("/login", (req, res, next) => {
  res.render("passport/login",{"message":req.flash("error")});
});

router.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));
 
// Usamos la función  ensureLogin.ensureLoggedIn() para asegurarnos de que el usuario haya iniciado sesión antes de ver esta página.
router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("private", { user: req.user });
})

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

router.get("/auth/facebook", passport.authenticate("facebook"));
router.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/"
}));

module.exports = router;