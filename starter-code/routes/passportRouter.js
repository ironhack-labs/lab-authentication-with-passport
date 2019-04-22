const express = require("express");
const passportRouter = express.Router();
const User = require('../models/user')
const bcrypt = require('bcrypt')
const passport = require('passport')

passportRouter.get('/signup', (req, res, next) => {
  res.render('passport/signup')
})

passportRouter.post("/signup", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    return res.render("passport/signup", { message: "Indicate username and password" })
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("passport/signup", { message: "The username already exists" });
        return
      }
    })

  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  const newUser = new User({
    username,
    password: hashPass
  });
  try {
    await newUser.save()
    res.redirect('/')
  } catch (error) {
    res.render("passport/signup", { message: "Something went wrong" });
  }
})

passportRouter.get('/login', (req, res, next) => {
  res.render('passport/login',{"message":req.flash("error")})
})

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
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







