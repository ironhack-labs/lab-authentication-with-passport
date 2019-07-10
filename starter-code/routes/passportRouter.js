const express        = require("express");
const passportRouter = express.Router();
const User = require('../models/user'); // Require user model



const session       = require("express-session");
const bcrypt = require("bcrypt"); // Add bcrypt to encrypt passwords
const bcryptSalt = 10;
const passport      = require("passport");
const LocalStrategy = require("passport-local").Strategy;


// Add passport 
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login");
});

// Add passport 
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: false,
  passReqToCallback: true
}));

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.findOne({ "username": username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          errorMessage: "The username already exists!"
        });
        return;
      }

      User.create({
        username,
        password: hashPass
      })
        .then(() => {
          res.redirect("/login");
        })
        .catch(error => {
          console.log(error);
        })
    });
});

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});
passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;