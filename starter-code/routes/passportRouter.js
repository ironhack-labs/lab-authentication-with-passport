const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require('../models/user')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10

// Add passport 
const passport = require('passport')

const ensureLogin = require("connect-ensure-login");


passportRouter.get('/signup', (req, res, next) => res.render('passport/signup'))
passportRouter.post("/signup", (req, res, next) => {

  const { username, password } = req.body

  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Rellena todo" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("passport/signup", { message: "El usuario ya existe" });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });

      newUser.save((err) => {
        if (err) {
          res.render("passport/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });

    })
    .catch(error => {
      next(error)
    })
});


passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});



module.exports = passportRouter;