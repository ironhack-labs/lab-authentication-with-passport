const express = require("express");
const router = express.Router();

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

// SIGN UP
router.get("/signup", (req, res) => res.render("passport/signup"));

router.post("/signup", (req, res) => {
  const {
    username,
    password
  } = req.body;

  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Rellena los campos"
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
        .then(() => res.redirect("/"))
        .catch(() =>
          res.render("passport/signup", {
            message: "Something went wrong"
          })
        );
    })
    .catch(error => next(error));
});

//LOGIN

router.get("/login", (req, res) => res.render("passport/login", {
  message: req.flash("error")
}))
router.post('/login', passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))


//Logout
router.get("/logout", (req, res) => {
  req.logout()
  res.redirect("/login")
})

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

module.exports = router;