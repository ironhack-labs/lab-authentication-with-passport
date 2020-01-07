const express        = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport 
const passport = require("passport");

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login', {"message": req.flash("error")});
})

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }
  User.findOne({ username })
    .then(user => {
      if (user) {
        res.render("passport/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      
      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          res.redirect("/");
        })
        .catch(error => {
          console.log(error);
        });
    })
    .catch(error => {
      next(error);
    });
});

passportRouter.post('/login', passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}))

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private.hbs", { user: req.user });
});

module.exports = passportRouter;