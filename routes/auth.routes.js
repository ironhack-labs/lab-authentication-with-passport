const express = require('express');
const router = express.Router();
const User = require("../models/user.model")
const passport = require("passport")

const bcryptjs = require("bcryptjs")
const bcryptSalt = 10

const ensureLogin = require('connect-ensure-login');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});


router.get('/signup', (req, res) => res.render('auth/signup'))

router.post("/signup", (req, res, next) => {

  const { username, password } = req.body


  User
    .findOne({ username })
    .then(user => {
      if (user) {
        res.render("auth/signup", { errorMsg: "El usuario ya existe" })
        return
      }

      // Other validations
      const salt = bcryptjs.genSaltSync(bcryptSalt)
      const hashPass = bcryptjs.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(() => res.render("auth/signup", { errorMsg: "Hubo un error" }))
    })
    .catch(error => next(error))
})

router.get('/login', (req, res) => res.render('auth/login'))

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))


module.exports = router;
