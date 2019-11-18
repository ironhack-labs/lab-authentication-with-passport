const express = require("express");
const router = express.Router();
const passport = require('passport');

// Require user model
const User = require("../models/User.model")
// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

router.get("/signup", (req, res) => res.render("passport/signup"));

router.post("/signup", (req, res, next) => {

  const {
    username,
    password
  } = req.body

  if (!username || !password) {
    res.render("passport/signup", {
      message: "Introduce un usuario y contraseña"
    });
    return;
  }

  User.findOne({
      username
    })

    .then(user => {
      if (user) {
        res.render("passport/signup", {
          message: "El usuario ya existe"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({
          username,
          password: hashPass
        })
        .then(x => res.redirect("/"))
        .catch(x => res.render("passport/signup", {
          message: "Algo fue mal, inténtalo más tarde."
        }))
    })
    .catch(error => {
      next(error)
    })
});
// Add passport 
router.get("/login", (req, res) => res.render("passport/login", {
  "message": req.flash("error")
}));

router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));


const ensureLogin = require("connect-ensure-login");


router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

router.get('/logout', (req, res) => {
  req.logout()
  res.redirect("/login")
})

module.exports = router;