const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../models/user.model.js")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt")
const bcryptSalt = 10
// Add passport 
const passport = require("passport")

const ensureLogin = require("connect-ensure-login");

//Private Page
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup")
})

passportRouter.post("/signup", (req, res, next) => {
  const {
    username,
    password
  } = req.body
  console.log(`se crea la cuenta,${username}`)
  if (username === "" || password === "") {
    res.render("passport/signup", {
      errorMessage: "rellene los campos"
    })
    return
  }

  User.findOne({
      username: username
    })
    .then(searchName => {
      if (searchName) {
        res.render("passport/signup", {
          errorMessage: "El usuario ya existe"
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({
          username,
          password: hashPass
        })
        .then(createAccount => {
          console.log("Cuenta creada", createAccount)
          res.redirect("/")
        })
        .catch(err => console.log("Error al crear nuevo usuario", err))
      next(err)
    })
})

passportRouter.get("/login", (req, res) => res.render("passport/login", {
  errorMessage: req.flash("error")
}))

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

passportRouter.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/")
})

module.exports = passportRouter;