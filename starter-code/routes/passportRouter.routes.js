const express = require("express");
const router = express.Router();

// Require user model
const User = require("../models/User.model");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");

//const LocalStrategy = require("passport-local").Strategy;

//SINGUP
router.get("/signup", (req, res) => res.render("passport/signup"));

router.post("/signup", (req, res, next) => {
  const { username, password } = req.body;

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
          message: "El usuario ya existe, merluzo"
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
        .catch(x =>
          res.render("passport/signup", {
            message: "Algo fue mal, inténtalo más tarde. Oopsy!"
          })
        );
    })
    .catch(error => {
      next(error);
    });
});

//LOGIN
router.get("/login", (req, res) =>
  res.render("passport/login", {
    message: req.flash("error")
  })
);

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

module.exports = router;
