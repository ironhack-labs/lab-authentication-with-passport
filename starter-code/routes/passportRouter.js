const express = require("express");
const passportRouter = express.Router();
const User = require("../models/user");

const bcrypt = require("bcrypt");
const bcryptSalt = 10;

const passport = require("passport");

const ensureLogin = require("connect-ensure-login");



passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});

passportRouter.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    return;
  }
  
  User
  .findOne({ username })
  .then(user => {
    if(user !== null){
      res.render("passport/signup", { message: "The username already exists" });
      return;
    }
    const salt = bcrypt.genSaltSync(bcryptSalt);
    const encryptedPass = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      username,
      password: encryptedPass
    })
    
    newUser.save((err) => {
      if(err){
        res.render("passport/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/login");
      }
    });
  })

  .catch(error => {
    console.log(`There is an ${error} error`)
  });
});

passportRouter.get("/login", (req, res) => {
  res.render("passport/login");
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
},console.log("HEMOS LLEGADO!!")));


passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


module.exports = passportRouter;