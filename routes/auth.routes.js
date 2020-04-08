const express = require('express');
const router = express.Router();

// Require user model
const User = require('../models/User.model');

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt');
const bcryptSalt = 10;
// Add passport

const ensureLogin = require('connect-ensure-login');
const passport = require("passport");

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup', (req,res,next) => {
  res.render('./auth/signup');
})

router.post('/signup', (req,res,next) => {
  const { username, password } = req.body; 
  console.log(req.body)

  const salt = bcrypt.genSaltSync(bcryptSalt);
  const hashPass = bcrypt.hashSync(password, salt);

  User.create({username: username, password: hashPass})
    .then(user => {
      console.log(user)
      res.redirect('/private-page')
    })
    .catch(err => {
      res.send('erro na criação do usuário, tente novamente')
      console.log(err)
    })
})

router.get('/login', (req, res, next) => {
  res.render('./auth/login')
})

router.post('/login', passport.authenticate("local", {
  successRedirect: "/private-page", 
  failureRedirect: "/login", 
  failureFlash: false, 
  passReqToCallback: true, 
 }));

router.get('/logout', (req, res, next) =>{
  req.logout();
  res.redirect('/login');
})

module.exports = router;

