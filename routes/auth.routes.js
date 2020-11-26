const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const passport = require('passport')
const ensureLogin = require('connect-ensure-login')

const User = require('../models/User.model.js')

//ROUTES

//SIGNUP

router.get('/signup', (req, res, next) => {
  res.render('auth/signup');
})

router.post('/signup', (req, res)=>{

  const {username, password} = req.body

  if(username === '' || password === ''){
    res.render('auth/signup', {errorMessage: 'You have to fill all the fields'})
    return
  }

  User.findOne({username})
    .then((result)=>{
      if(!result){
        bcrypt.hash(password, 10)
          .then((hashedPassword)=>{
            User.create({username, password: hashedPassword})
              .then(()=>res.redirect('/'))
          })       
      } else {
        res.render('auth/signup', {errorMessage: 'This user already exists. Please, try again'})
      }
    })
    .catch((err)=>res.send(err)) 
})

//LOGIN

router.get('/login', (req, res)=>{
  res.render('auth/login', {errorMessage: req.flash('error')})
})

router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))


// PRIVATE PAGE

router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res) => {
  res.render('auth/private', { user: req.user.username });
});

module.exports = router;
