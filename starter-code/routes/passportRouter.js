const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require('../models/user.model')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10
// Add passport 
const passport = require("passport")


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get("/signup", (req, res) => res.render("passport/signup"))
passportRouter.post("/signup", (req, res) => {
  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Rellena los campos loko" })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("passport/signup", { message: "El usuario ya existe" })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hassPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hassPass })
        .then(() => res.redirect('/'))
        .catch(() => res.render("passport/signup"), { message: "Ha ido algo mal macho" })
    })
    .catch(error => next(error))
})

passportRouter.get("/login", (req, res) => res.render("passport/login", { message: req.flash("error") }))
passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => res.render("passport/private"))

// passportRouter.get("/logout", (req, res) => {
//   req.logout()
//   res.redirect("/login")
// }
// )
//

module.exports = passportRouter;

