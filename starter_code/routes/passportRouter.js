const express = require('express');
const router = express.Router();
// User model
const User = require('../models/user');
// Bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
const ensureLogin = require('connect-ensure-login');
const passport = require('passport');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup',(req, res, next)=>{
  res.render('passport/signup');
})

router.post('/signup',(req, res, next)=>{
  const username = req.body.username;
  const password = req.body.password;
  
  if (username === "" || password === "") {
    res.render("passport/signup", { message: "Indicate username and password" });
    reject();
  }

  User.findOne({ username })
    .then(user => {
      if (user !== null) throw new Error("The username already exists");
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);

      const newUser = new User({
        username,
        password: hashPass
      });
      return newUser.save();
    })
    .then(newUser => {
      res.redirect("/");
    })
    .catch(e => {
      res.render("passport/signup", { message: e.message });
  });

});

router.get("/login", (req, res, next) => {
  res.render("passport/login");
});

router.post( "/login",passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/passport/login",
    failureFlash: false,  // desactivar el flash
    passReqToCallback: false
  })
);

router.get("/logout", (req, res) => {
  req.logout();        
  res.redirect("/");
});




module.exports = router;