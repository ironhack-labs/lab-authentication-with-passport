const express = require('express')
const router = express.Router()

// Require user model
const User = require('../models/User.model')

// Add bcrypt to encrypt passwords
const bcrypt = require('bcryptjs')

// Add passport
const passport = require('passport')

const checkForAuth = (req, res, next) => {
  if(req.isAuthenticated()){
    return next()
  }else{
    res.redirect('/login')
  }
}

router.get('/signup', (req, res)=>{
  res.render('auth/signup')
})

router.post('/signup', (req, res) => {
  const {username, password} = req.body

  if(username === "" || password === ""){
    res.render('auth/signup', {errorMessage: "You have to fill all the fields"})
  }

  User.findOne({username})
    .then(user => {

      if(user){
        res.render('auth/signup', {errorMessage: "This username already exists"})

      }else{
        const hashedPassword = bcrypt.hashSync(password, 10)
        User.create({username, password: hashedPassword})
          .then(result=>{
            res.redirect('/login')
          })
      }
    })
    .catch(error => {
      res.send(error)
    })
})

router.get('/login', (req, res)=>{
  res.render('auth/login', {errorMessage: req.flash('error')})
})

router.post('/login', passport.authenticate('local', {
  successRedirect: '/private-page',
  failureRedirect: '/login',
  failureFlash: true,
  passReqToCallback: true
}))

router.get('/logout', (req, res)=>{
  req.logout()
  res.redirect('/')
})

router.get('/private-page', checkForAuth, (req, res) => {
  res.render('auth/private', { user: req.user });
});

module.exports = router;
