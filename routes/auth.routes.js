const express = require('express');
const router = express.Router();
const ensureLogin = require('connect-ensure-login')

// Require user model
const User = require('../models/User.model')
// Add bcrypt to encrypt passwords
const bcrypt      = require('bcryptjs')
// Add passport
const passport = require('passport')

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
  
router.get('/login', (req, res)=>{
  res.render('auth/login', {errorMessage: req.flash('error')})
})
  
router.post('/login', passport.authenticate("local", {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))
  
router.get('/private-page', ensureLogin.ensureLoggedIn(), (req, res)=>{
  res.render('auth/private', {user: req.user.username})
})
  
router.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/')
})

module.exports = router;
