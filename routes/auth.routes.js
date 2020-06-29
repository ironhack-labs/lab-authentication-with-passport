const express = require('express');
const router = express.Router();
const passport = require('passport')

// Require user model

const User = require("../models/User.model")






// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


// Add passport

const ensureLogin = require('connect-ensure-login');


//RUTAS


//RUTA GET PARA SIGNUP

router.get('/signup', (req, res) => {
  res.render('auth/signup')
})

router.get('/login', (req, res) => res.render('auth/login', { "message": req.flash("error") }))


//RUTA POST PARA SIGNUP

router.post('/signup', (req, res) => {



  const { username, password } = req.body



  if (username.length === 0 || password.length === 0) {
    res.render("auth/signup", { errorMsg: "Rellena los campos" });
    return
  }
  
  User
    .findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup", { errorMsg: "Usuario ya existente" });
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      return User.create({ username, password: hashPass })
    })
    .then(() => res.redirect('/'))
    .catch(err => console.log("Error!:", err))
})

//POST DE LOGIN

router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
