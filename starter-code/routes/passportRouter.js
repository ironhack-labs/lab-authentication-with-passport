const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

// Add passport 
const passport = require('passport')

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

passportRouter.get('/signup', (req, res) => res.render('passport/signup'))

passportRouter.post('/signup', (req, res) => {
  const {
    username,
    password
  } = req.body

  if (!username || !password) {
    res.render('passport/signup', {
      errorMessage: 'ERROR: Rellena los dos campos'
    })
    return
  }
  User.findOne({
      "username": username
    })
    .then(user => {
      if (user) {
        res.render("passport/signup", {
          errorMessage: "El nombre de usuario ya existe"
        })
        return
      }

      if (password.length < 8) {
        res.render('passport/signup', {
          errorMessage: 'ERROR: la contraseña es muy corta'
        })
        return
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      User.create({
          username,
          password: hashPass
        })
        .then(() => res.redirect("/"))
        .catch(error => console.log(error))
    })
    .catch(error => {
      console.log(error)
    })
})

passportRouter.get("/login", (req, res) => res.render("passport/login", {
  "message": req.flash("error")
}));

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get('/private', ensureLogin.ensureLoggedIn(), (req, res) => res.render('passport/private', { user: req.user} ))

passportRouter.get('/logout', (req, res) => {
  req.logout()
  res.redirect('/login')
})

module.exports = passportRouter;