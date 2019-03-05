const express        = require("express");
const passportRouter = express.Router();


// Require user model

const User           = require("../models/user");

// Add bcrypt to encrypt passwords

const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

// Add passport 

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log("entraaaa")
  res.render("passport/private", { user: req.user });
});

// SignUp

passportRouter.get("/signup", (req, res) => res.render("passport/signup"))


passportRouter.post("/signup", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username.length === 0 || password.length === 0) {
      const data = {errorMsg: 'Please fill all the fields'}
      
      res.render('passport/signup', data)
      return
  }

  User.findOne({ "username": username })
      .then(user => {
          if (user) {
              res.render("passport/signup", {
                  errorMsg: "The username already exists!"
              })
          return
      }

      const salt     = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      User.create({username, password: hashPass})
          .then(()        => res.redirect("/"))
          .catch(error    => console.log(error))
  })
})


// LogIn

passportRouter.get("/login", (req, res) => res.render("passport/login"))

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));





module.exports = passportRouter;