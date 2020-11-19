const express = require('express');
const router = express.Router();


// Require user model
const User = require('../models/User.model.js')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcrypt')
const bcryptSalt = 10;

// Add passport
const passport = require('passport')

const ensureLogin = require('connect-ensure-login');

//SignUp feature
router.get('/signup', (req, res, next)=>{
  res.render('auth/signup')
})

router.post('/signup', (req, res, next)=>{
  const {username, password} = req.body

  User.findOne({username})
  .then(()=>{
    bcrypt.hash(password, bcryptSalt)
    .then((hashedPassword)=>{
      User.create({username, password: hashedPassword})
        .then(()=>res.redirect('/'))
    })       
  })
  .catch((err)=>res.send(err)) 
})

//LogIn feature
router.get('/login', (req, res, next)=>{
  res.render('auth/login')
})

router.post("/login", passport.authenticate("local", {
    successRedirect: "/", 
    failureRedirect: "/login", 
    failureFlash: true, 
    passReqToCallback: true 
  }
));

//Private page feature
router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
