const express        = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user')
// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10
// Add passport 
const passport = require('passport')

const ensureLogin = require("connect-ensure-login");

passportRouter.get("/signup",  (req, res, next) => {
  res.render("passport/signup");
});

passportRouter.post("/signup",  (req, res, next) => {
  const {username, password} = req.body
  if (username === "" || password === "") {
    res.render("passport/signup", {errorMessage: "Rellena todo"})
    return
  }


  User.findOne({ username: username })
     .then(user => {
       if (user) {
         res.render("passport/signup", { errorMessage: "El usuario ya existe" });
         return;
       }
     })
     .catch(err => console.log('ERROR:', err))

      const salt = bcrypt.genSaltSync(bcryptSalt)
      const hashPass = bcrypt.hashSync(password, salt)
      User.create({ username, password: hashPass })
        .then(() => {
          console.log("creando")
          res.redirect('/')})
        .catch(err => console.log('ERROR:', err))

});     

passportRouter.get("/login",  (req, res, next) => {
  res.render("passport/login", {"message" : req.flash("error")});
});

passportRouter.post("/login", passport.authenticate("local", {
   successRedirect: "/private-page",
   failureRedirect: "/login",
   failureFlash: true,
   passReqToCallback: true
}));


  

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render("passport/private", { user: req.user });
});

module.exports = passportRouter;