const express = require("express");
const passportRouter = express.Router();
const User = require('../models/user');
const bcrypt = require("bcrypt");
const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
// const LocalStrategy = require("passport-local").Strategy;
// const flash = require("connect-flash");
const bcryptSalt = 10;


// Require user modelco


// Add bcrypt to encrypt passwords


// Add passport 





passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", {
    user: req.user
  });
});

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')

});

passportRouter.post("/signup", (req, res, next) => {
  console.log("hola")
  const {
    username,
    password
  } = req.body;
  if (username === "" || password === "") {
    res.render("passport/signup", {
      message: "Indicate username and password",
      section: "signup"
    });
    return;
  }
  User.findOne({
      username
    })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", {
          message: "The username already exists",
          section: "signup"
        });
        return;
      }
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
      const newUser = new User({
        username,
        password: hashPass
      });
      newUser.save(err => {
        if (err) {
          res.render("passport/signup", {
            message: "Something went wrong",
            section: "signup"
          });
        } else {
          res.redirect("/login");
          // res.render.json('hola')
        }
      });
    })
    .catch(error => {
      next(error);
    });
});
passportRouter.get("/login", (req, res) => {
  res.render("passport/login", {
    message: "error",
    section: "login"
  });
});
// invoked via passport.use(new LocalStrategy({
passportRouter.post(
  "/login",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/private-page",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);








module.exports = passportRouter;