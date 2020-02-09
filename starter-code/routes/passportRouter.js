const express = require("express");
const passportRouter = express.Router();

// Require user model
const User = require("../models/user");

// Add bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

// Add passport 
const passport = require("passport");

//Get
passportRouter.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

//Post
passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;



  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
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
          res.render("auth/signup", { message: "Something went wrong" });
        } else {
          res.redirect("/");
        }
      });
    })
    .catch(error => {
      next(error)
    })
});


//LOG IN
passportRouter.get("/login", (req, res, next) => {
  res.render("passport/login", { "message": req.flash("error") });
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true, //will allow us to use flash messages in our application
  passReqToCallback: true
}));


passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});


const ensureLogin = require("connect-ensure-login");

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;