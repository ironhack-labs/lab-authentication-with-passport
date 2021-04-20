const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const passport = require('passport')
const saltRounds = 10;
const User = require('../models/User.model')
const ensureLogin = require('connect-ensure-login');


router.get('/signup', (req, res) => {
  res.render('auth/signup')
})
router.post('/signup', (req, res, next) =>{
  const {username, password} = req.body;
  if(!username || !password){
    res.render('auth/signup', {errorMessage: "You need to fill both fields"})
  }
  const salt = bcrypt.genSaltSync(saltRounds)
  const hashPassword = bcrypt.hashSync(password, salt);
  User.findOne({username})
  .then((user)=>{
    if(user){
      res.render('auth/signup', {errorMessage: "The user already exists"})
    }
    User.create({username, password: hashPassword})
    .then((user)=>{
      console.log(user);
      res.render('index', {user})
    })

  })


})


// Add bcrypt to encrypt passwords

// Add passport

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('passport/private', { user: req.user });
});

module.exports = router;
