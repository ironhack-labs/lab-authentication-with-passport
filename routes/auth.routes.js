const express = require('express');
const router = express.Router();
// Require user model
const User=require("../models/User.js")
const passport=require('passport')

// Add bcrypt to encrypt passwords
const bcrypt =require('bcrypt')
const bcryptSalt=12



// Add passport

const ensureLogin = require('connect-ensure-login');
const { route } = require('./index.routes.js');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

router.get('/signup', (req, res, next) => res.render('auth/signup'));

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;
 
  // 1. Check username and password are not empty
  if (!username || !password) {
    res.render('auth/signup', { errorMessage: 'Indicate username and password' });
    return;
  }
 
  User.findOne({ username })
    .then((user) => {
      // 2. Check user does not already exist
      if (user !== null) {
        res.render('auth/signup', { message: 'The username already exists' });
        return;
      }
 
      // Encrypt the password
      const salt = bcrypt.genSaltSync(bcryptSalt);
      const hashPass = bcrypt.hashSync(password, salt);
 
      //
      // Save the user in DB
      //
 
      const newUser = new User({
        username,
        password: hashPass,
      });
 
      newUser
        .save()
        .then(() => res.redirect('/'))
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
});
 
// ---------------------------------

router.get('/login', (req, res, next) => {
  res.render('auth/login', {'errorMessage':req.flash('error')});
});
 
router.post("/login", passport.authenticate("local", {
  successRedirect: "/private",
  failureRedirect: "/login"
}));

router.get("/private-page", (req, res) => {
  if (!req.user) {
    res.redirect('/login'); // not logged-in
    return;
  }
 
  // ok, req.user is defined
  res.render("private", { user: req.user });
});

router.post('/login', passport.authenticate('local', {
  successRedirect:'/',
  failureRedirect:'login',
  failureFlash:true,
}));

router.get('/logout', (req, res)=>{
  req.logout();
  res.redirect('/');
});


module.exports = router;
