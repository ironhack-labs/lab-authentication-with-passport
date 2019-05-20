const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require("../../starter-code/models/user")

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10
// Add passport 
const passport = require('passport')

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

// get y post de signup
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup")
})

passportRouter.post("/signup", (req, res, next) => {
  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render('passport/signup', { message: "Rellene todos los campos" })
    return
  }

  User.findOne({ username })
    // comprobar si exite nombre de usario
    .then(user => {
      if (user) {
        res.render('passport/signup', { message: "El nombre de usuario ya existe" })
        return
      }
      // encriptar password
      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      // crear usuario
      const newUser = new User({
        username,
        password: hashPass
      })

      // guardar datos usuario en BBDD
      newUser.save()
        .then(x => res.redirect("/"))
        .catch(err => res.render("passport/signup", { message: `Hubo un error: ${err}` }))
    })
})

//login
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") })
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/passport/login",
  failureFlash: true,
  passReqToCallback: true
}))

module.exports = passportRouter;