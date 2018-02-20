// import { Router } from "../../../../../../Library/Caches/typescript/2.6/node_modules/@types/express";

const express        = require("express");
const router         = express.Router();
// User model
const User           = require("../models/user");
// Bcrypt to encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;
const ensureLogin = require("connect-ensure-login");
const passport      = require("passport");


//Route to handle signup form display
router.get("/signup", (req, res, next) => {
  res.render("passport/signup");
});

//Route to handle signup form submission
router.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
 
  //Valiidation 1 - Checking whether user has provided user and pass  
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }

  //Validation 2 - Check whether user alredy exists in the database
  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }

  //Encrypt password
  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  //Generate new user with encrypted password
  const newUser = new User({
    username,
    password: hashPass
  });

  //Save the new user to the database
    newUser.save((err) => {
      if (err) {
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
      res.redirect("/");
      }
    });
  });
});

router.get("/login", (req, res, next) => {
  res.render("passport/login", {message: req.flash("error") });
});

 //ROute to handle login form submission 
router.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

router.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

module.exports = router;
