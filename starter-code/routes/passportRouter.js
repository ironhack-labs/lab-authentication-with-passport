const express = require("express");
const router = express.Router();

const User = require('../models/user.model')
const bcrypt = require("bcrypt");
const bcryptSalt = 10
const passport = require("passport");

//ensure
const ensureLogin = require("connect-ensure-login");





// configutacion de registro
router.get("/signup", (req, res) => res.render("passport/signup"))
router.post("/signup", (req, res) => {

  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "commpleta las cositas" })
    return
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("passport/signup", { message: "El usuario ya existe" })
        return
      }

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)

      User.create({ username, password: hashPass })
        .then(() => res.redirect('/'))
        .catch(() => res.render("passport/signup", { message: "Algo va mal Crack" }))
    })
    .catch(error => next(error))
})

router.get("/login", (req, res) => res.render("passport/login", { message: req.flash("error") }))
router.post('/login', passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))



router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = router;