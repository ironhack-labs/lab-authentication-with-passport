const express = require("express");
const passport = require('passport')
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");


// Require user model
const User = require("../models/user")

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Add passport 
passportRouter.get("/signup", (req, res) => {
  console.log("aqui si entra es el get")
  res.render("passport/signup")
});

passportRouter.post("/signup", (req, res, next) => {
  console.log("este es el pooost ")
  const { username, password } = req.body

  if (!username || !password) {
    res.render("passport/signup", { message: "Introduce un usuario y contraseña" });
    return;
  }
  User.findOne({ username })

    .then(user => {
      if (user) {
        res.render("passport/signup", { message: "El usuario ya existe, merluzo" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({ username, password: hashPass })
        .then(x => {
          console.log("entra aquiiii", x)
          res.redirect("/")
        })
        .catch(x => res.render("passport/signup", { message: "Algo fue mal, inténtalo más tarde. Oopsy!" }))
    })
    .catch(error => { next(error) })
});

passportRouter.get("/login", (req, res) => res.render("passport/login", { "message": req.flash("error") }));

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
