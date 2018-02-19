// routes/auth-routes.js
const express = require("express");
const authRoutes = express.Router();

// User model
const User = require("../models/User");

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

//Ensure Login
const ensureLogin = require("connect-ensure-login");

//passport
const passport = require("passport");

//Private page Login
authRoutes.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("auth/private", { user: req.user });
});

//login with passport
authRoutes.get("/login", (req,res)=>{
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
   successRedirect: "/private",
   failureRedirect: "/login",
   failureFlash: true,
   passReqToCallback: true
}));


//logout
authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
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
  });
});

module.exports = authRoutes;