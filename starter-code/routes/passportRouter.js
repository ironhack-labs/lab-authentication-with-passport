const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user")

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10

// Add passport 
const passport = require('passport')

const ensureLogin = require("connect-ensure-login");

// local
// const session = require("express-session")
// const LocalStrategy = this.require("passport-local").Strategy
// const flash = require("connect-flash")






passportRouter.get("/signup", (req, res) => res.render("passport/signup"))

passportRouter.post("/signup", (req, res, next) => {

  const { username, password } = req.body

  if (!username || !password) {
    res.render("/signup", { message: "Introduce un usuario y contraseña" });
    return;
  }

  User.findOne({ username })

    .then(user => {
      if (user) {
        res.render("/signup", { message: "El usuario ya existe" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(x => res.redirect("/"))
        .catch(x => res.render("/signup", { message: "Algo fue mal, inténtalo más tarde. Oopsy!" }))
    })
    .catch(error => { next(error) })
});


passportRouter.get("/login", (req, res) => res.render("../views/passport/login"))

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));









passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = passportRouter;