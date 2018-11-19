const express        = require("express");
const passportRouter = express.Router();

// Require user model

const User= require("../models/user")
const mongoose= require("mongoose");

// Add bcrypt to encrypt passwords

const bcrypt=require("bcrypt");
const bcryptSalt=10;
// Add passport 
const passport = require("passport");


const ensureLogin = require("connect-ensure-login");


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


passportRouter.get("/signup", (req,res)=>{
  res.render("passport/signup");
})


passportRouter.get("/login", (req,res)=>{
  res.render("passport/login");
})

passportRouter.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log(req.body)
  res.render("passport/private", { user: req.user });
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username })
  .then(user => {
    if (user !== null) {
      res.render("signup", { message: "The username already exists" });
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
        res.render("signup", { message: "Something went wrong" });
      } else {
        res.redirect("login");
      }
    });
  })
  .catch(error => {
    next(error)
  })
});






module.exports = passportRouter;