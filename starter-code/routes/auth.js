const express = require('express');
const authRoutes = express.Router();
const User = require('../models/User.js')
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const path = require('path');
const passport = require('passport');

const router = require('express').Router();

authRoutes.get("/signup", (req, res, next) => {
  res.render("../views/passport/signup.ejs");
});

authRoutes.post("/signup", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("../views/passport/signup.ejs", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("../views/passport/signup.ejs", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);


    const newUser = new User({
      username,
      password: hashPass
    })
    .save()
    .then(user => res.redirect('/'))
    .catch(e => res.render("../views/passport/signup.ejs", { message: "Something went wrong" }));

  });
});

authRoutes.get("/login", (req, res, next) => {
  res.render("../views/passport/login.ejs");
});
authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/private-page",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.get('/logout',(req,res) =>{
  req.logout();
  res.redirect("/login");
});


module.exports = authRoutes
