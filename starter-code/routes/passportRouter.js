const express        = require("express");
const passportRouter = express.Router();
const ensureLogin = require("connect-ensure-login");
const User = require('../models/user')
const passport = require('passport')


// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');

// Add passport 

passportRouter.get("/signup", (req, res) => {
  res.render("passport/signup");
});



passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});


passportRouter.post('/signup', (req, res, next) => {
  const {username, password} = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashPass = bcrypt.hashSync(password, salt);

  if (username === "" || password === "") {
    res.render('passport/signup') 
    return;
  }

  User.findOne({username})
  .then(nameUser => {
    if (nameUser !== null) {
        res.render('signup')
        return;
    };
  User.create({
    username,
    password: hashPass,
  })
  .then(() => {
    res.redirect('/login');
  })
  .catch(error => {
    console.log(error);
  })
  })

});


passportRouter.get("/login", (req, res) => {
  res.render("passport/login", {message:req.flash('error')} );
});

passportRouter.post("/login", passport.authenticate("local", {
  successRedirect: "/private", 
  failureRedirect: "/login", 
  failureFlash: true, 
  passReqToCallback: true, 
 }));


passportRouter.get("/private", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;