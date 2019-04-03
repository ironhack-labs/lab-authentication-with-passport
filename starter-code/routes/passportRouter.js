const express = require("express");
const passportRouter = express.Router();
// Require user model
const User = require('../models/user');
// Add bcrypt to encrypt passwords
const bcrypt = require('bcryptjs');
// Add passport 
const passport = require('passport');

const ensureLogin = require("connect-ensure-login");



//----------------------//
// -- CREATE ACCOUNT -- //
//----------------------//

// go to create account form (get)
passportRouter.get('/signup', (req, res, next) => {
  res.render('./passport/signup.hbs');
});

// create account (post)
passportRouter.post('/signup', (req, res, next) => {
  // ERR no input
  if (req.body.username.length < 2 || req.body.password.length < 2) {
    res.redirect('/signup')
    return;
  }
  // ERR already exists
  User.find({ username: req.body.username })
    .then(user => {
      if (user.length > 0) {
        res.redirect('/signup') // already exists
        throw new Error(`User ${user} already exists`);
      }
      return bcrypt.hash(req.body.password, 10)
    })
    // hash password
    .then(pass => {
      User.create({
        username: req.body.username,
        password: pass
      })
      console.log('User created', req.body.username);
      res.redirect('/login');
    })
    .catch(err => {
      console.log(err);
    })
});

//----------------------//
// -- LOGIN  ACCOUNT -- //
//----------------------//

passportRouter.get('/login', (req, res, next) => {
  res.render('./passport/login', { 'message': req.flash('error') }); // flash
})

passportRouter.post('/login', passport.authenticate('local', { 
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}));

passportRouter.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
  console.log('trying to login', req.user);
  res.render("passport/private", { user: req.user });
});
 

module.exports = passportRouter;