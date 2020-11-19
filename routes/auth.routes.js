const express = require('express');
const router = express.Router();
// Require user model
const User=require('../models/User.model');
// Add bcrypt to encrypt passwords
const bcrypt=require('bcryptjs');
// Add passport

const ensureLogin = require('connect-ensure-login');
const passport = require('passport');

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user });
});

router.get('/signup',(req,res)=>{
  res.render('auth/signup');
});

router.post('/signup',(req,res,next)=>{

  const {username,password}=req.body;

  if(!username||!password){
    res.render('auth/signup',{errorMessage:'All fields are mandatory'});
    return;
  }

  User.findOne({username})
    .then(user=>{
      if(user){
          res.render('auth/signup', {errorMessage:'Username already taken'});
          return;
      }

      bcrypt
        .genSalt(10)
        .then(salt=>bcrypt.hash(password,salt))
        .then(hashedPassword=>{
            User.create({username,password:hashedPassword})
            .then(()=> {
              console.log('hi')
              res.render('auth/private');
            })
            .catch(err=>next(err))
          })
    })
    .catch(err=>next(err))

});

router.get('/login',(req,res)=>{
  res.render('auth/login');
});

router.post('/login',passport.authenticate('local',{
  successRedirect:'/private-page',
  failureRedirect:'/login'
}));

module.exports = router;
